#!/usr/bin/env bun
// 🖥️ YTNiche Band — Local Backend Server
// Handles cookie upload, yt-dlp metadata retrieval, and local analysis
//
// Security:
// - Cookies NEVER leave the local machine
// - Cookie content NEVER logged or displayed
// - Only status (configured/not) is exposed to the frontend
// - .gitignore protects private/ and cookies.txt
//
// Usage:
//   bun run server/localServer.ts
//   → http://localhost:8787

import { parseYouTubeInput } from "../src/lib/youtube/parseYouTubeInput";

const PORT = 8787;
const PRIVATE_DIR = "./private";
const COOKIES_PATH = `${PRIVATE_DIR}/cookies.txt`;

// ─── Utility: Validate Netscape cookie format ────────────────
function looksLikeCookiesTxt(text: string): boolean {
  const lines = text.split("\n").filter((l) => l.trim() && !l.trim().startsWith("#"));
  // Netscape cookies.txt has tab-separated fields
  // Minimum: at least one line with 6+ tab-separated fields
  return lines.some((line) => {
    const parts = line.split("\t");
    if (parts.length < 6) return false;
    // Domain should contain a dot (e.g., .youtube.com)
    return parts[0].includes(".");
  });
}

// ─── Start Server ────────────────────────────────────────────
const server = Bun.serve({
  port: PORT,
  hostname: "localhost",

  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const path = url.pathname;
    const method = req.method;

    // CORS headers for local frontend
    const corsHeaders = {
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle preflight
    if (method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // ─── GET /api/health ──────────────────────────────────
    if (method === "GET" && path === "/api/health") {
      let ytDlpAvailable = false;
      try {
        const proc = Bun.spawnSync(["which", "yt-dlp"]);
        ytDlpAvailable = proc.exitCode === 0;
      } catch {
        ytDlpAvailable = false;
      }

      const cookiesConfigured = await checkCookiesExist();

      return new Response(
        JSON.stringify({
          ok: true,
          mode: "local",
          ytDlpAvailable,
          cookiesConfigured,
        }),
        { headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // ─── GET /api/cookies/status ──────────────────────────
    if (method === "GET" && path === "/api/cookies/status") {
      const exists = await checkCookiesExist();

      return new Response(
        JSON.stringify({
          configured: exists,
          path: "private/cookies.txt",
          message: exists ? "Cookies configured" : "Cookies missing — upload cookies.txt for real YouTube metadata",
        }),
        { headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // ─── POST /api/cookies/upload ─────────────────────────
    if (method === "POST" && path === "/api/cookies/upload") {
      try {
        const contentType = req.headers.get("Content-Type") || "";

        let cookieContent: string;

        if (contentType.includes("multipart/form-data")) {
          const formData = await req.formData();
          const file = formData.get("file");
          if (!file || !(file instanceof File)) {
            return new Response(
              JSON.stringify({ ok: false, message: "No file uploaded" }),
              { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
            );
          }
          cookieContent = await file.text();
        } else if (contentType.includes("text/plain") || contentType.includes("application/json")) {
          const body = await req.json();
          cookieContent = body.content || body.cookies || "";
        } else {
          cookieContent = await req.text();
        }

        // Validate format
        if (!looksLikeCookiesTxt(cookieContent)) {
          return new Response(
            JSON.stringify({
              ok: false,
              message: "Invalid cookies.txt format. Must be Netscape format with tab-separated fields.",
            }),
            { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        // Ensure private/ directory exists
        try {
          Bun.spawnSync(["mkdir", "-p", PRIVATE_DIR]);
        } catch {
          // Fallback
          const fs = await import("fs");
          fs.mkdirSync(PRIVATE_DIR, { recursive: true });
        }

        // Save file (no logging of content)
        await Bun.write(COOKIES_PATH, cookieContent);

        console.log(`[server] Cookies saved to ${COOKIES_PATH}`);

        return new Response(
          JSON.stringify({
            ok: true,
            message: "Cookies saved locally",
            path: "private/cookies.txt",
          }),
          { headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      } catch (err: any) {
        console.error("[server] Cookie upload error:", err.message);
        return new Response(
          JSON.stringify({ ok: false, message: `Upload failed: ${err.message}` }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
    }

    // ─── POST /api/ytdlp/metadata ─────────────────────────
    if (method === "POST" && path === "/api/ytdlp/metadata") {
      try {
        const body = await req.json();
        const { url: targetUrl } = body;

        if (!targetUrl) {
          return new Response(
            JSON.stringify({ ok: false, message: "Missing 'url' in request body" }),
            { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        // Check if yt-dlp is installed
        const whichProc = Bun.spawnSync(["which", "yt-dlp"]);
        if (whichProc.exitCode !== 0) {
          return new Response(
            JSON.stringify({
              ok: false,
              message: "yt-dlp is not installed. Please install it first.",
              installUrl: "https://github.com/yt-dlp/yt-dlp",
            }),
            { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        // Check cookies
        const cookiesExist = await checkCookiesExist();
        if (!cookiesExist) {
          return new Response(
            JSON.stringify({
              ok: false,
              requiresCookies: true,
              message: "Please upload cookies.txt before running YouTube analysis.",
            }),
            { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        // Get metadata with yt-dlp
        const cookieArg = `--cookies=${COOKIES_PATH}`;
        const proc = Bun.spawnSync([
          "yt-dlp",
          cookieArg,
          "--dump-json",
          "--no-download",
          "--skip-download",
          "--no-playlist",
          "--flat-playlist",
          targetUrl,
        ]);

        if (proc.exitCode !== 0) {
          const stderr = proc.stderr.toString();
          return new Response(
            JSON.stringify({
              ok: false,
              message: `yt-dlp failed: ${stderr.substring(0, 500)}`,
            }),
            { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        const stdout = proc.stdout.toString();
        const lines = stdout.trim().split("\n");

        // Try to parse JSON output
        try {
          // First entry is the main video/channel info
          const mainEntry = JSON.parse(lines[0]);

          // For channel/playlist pages, there may be entries
          const entries = lines.length > 1
            ? lines.slice(1).map((l) => {
                try { return JSON.parse(l); } catch { return null; }
              }).filter(Boolean)
            : [];

          const metadata = {
            id: mainEntry.id,
            title: mainEntry.title,
            channel: mainEntry.channel,
            channel_id: mainEntry.channel_id,
            channel_url: mainEntry.channel_url,
            uploader: mainEntry.uploader,
            description: mainEntry.description?.substring(0, 1000),
            duration: mainEntry.duration,
            view_count: mainEntry.view_count,
            like_count: mainEntry.like_count,
            upload_date: mainEntry.upload_date,
            thumbnail: mainEntry.thumbnail,
            webpage_url: mainEntry.webpage_url,
            extractor: mainEntry.extractor,
            entries: entries.map((e: any) => ({
              id: e.id,
              title: e.title,
              url: e.webpage_url || e.url,
              view_count: e.view_count,
              upload_date: e.upload_date,
              duration: e.duration,
            })),
            subtitles: mainEntry.subtitles || undefined,
            automatic_captions: mainEntry.automatic_captions || undefined,
          };

          return new Response(
            JSON.stringify({ ok: true, metadata }),
            { headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        } catch (parseErr: any) {
          return new Response(
            JSON.stringify({
              ok: false,
              message: `Failed to parse yt-dlp output: ${parseErr.message}`,
              raw: stdout.substring(0, 1000),
            }),
            { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }
      } catch (err: any) {
        console.error("[server] yt-dlp error:", err.message);
        return new Response(
          JSON.stringify({ ok: false, message: `yt-dlp failed: ${err.message}` }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
    }

    // ─── POST /api/analyze ────────────────────────────────
    if (method === "POST" && path === "/api/analyze") {
      try {
        const body = await req.json();
        const { mode, input: userInput, profile } = body;

        if (!mode) {
          return new Response(
            JSON.stringify({ ok: false, message: "Missing 'mode' in request body" }),
            { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        // Check cookie status
        const cookiesExist = await checkCookiesExist();

        // Parse input
        const parsed = parseYouTubeInput(userInput || "");

        // For channel/video URL analysis, require cookies
        if ((mode === "channel" || mode === "video") && parsed.type !== "keyword" && !cookiesExist) {
          return new Response(
            JSON.stringify({
              ok: false,
              requiresCookies: true,
              message: "Please upload cookies.txt before running YouTube analysis.",
              cookieEndpoint: "/api/cookies/status",
            }),
            { headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        // For keyword mode, don't require cookies
        let metadata: any = null;
        if (cookiesExist && parsed.type !== "keyword" && parsed.cleanUrl) {
          // Try to get metadata via yt-dlp
          const whichProc = Bun.spawnSync(["which", "yt-dlp"]);
          if (whichProc.exitCode === 0) {
            const cookieArg = `--cookies=${COOKIES_PATH}`;
            const proc = Bun.spawnSync([
              "yt-dlp",
              cookieArg,
              "--dump-json",
              "--no-download",
              "--skip-download",
              "--no-playlist",
              "--flat-playlist",
              parsed.cleanUrl,
            ]);

            if (proc.exitCode === 0) {
              const stdout = proc.stdout.toString();
              const lines = stdout.trim().split("\n");
              if (lines.length > 0) {
                try {
                  const entry = JSON.parse(lines[0]);
                  metadata = {
                    title: entry.title,
                    channel: entry.channel || entry.uploader,
                    channel_id: entry.channel_id,
                    channel_url: entry.channel_url,
                    description: entry.description?.substring(0, 1000),
                    view_count: entry.view_count,
                    subscriber_count: entry.channel_follower_count,
                    duration: entry.duration,
                    upload_date: entry.upload_date,
                    entries: lines.length > 1
                      ? lines.slice(1).map((l: string) => {
                          try { const e = JSON.parse(l); return { title: e.title, url: e.webpage_url, view_count: e.view_count, upload_date: e.upload_date }; } catch { return null; }
                        }).filter(Boolean)
                      : [],
                  };
                } catch {}
              }
            }
          }
        }

        // Build provider data for analysis pipeline
        const providerData = metadata ? {
          title: metadata.title,
          channel: metadata.channel,
          channelId: metadata.channel_id,
          channelUrl: metadata.channel_url,
          description: metadata.description,
          viewCount: metadata.view_count,
          subscriberCount: metadata.subscriber_count,
          recentUploads: metadata.entries,
        } : null;

        return new Response(
          JSON.stringify({
            ok: true,
            mode,
            input: userInput,
            parsed,
            metadata,
            providerData,
            cookiesConfigured: cookiesExist,
            noKeyMode: true,
            message: cookiesExist
              ? "Analysis ready with yt-dlp + cookies"
              : "Heuristic mode — no YouTube metadata available",
          }),
          { headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      } catch (err: any) {
        console.error("[server] Analyze error:", err.message);
        return new Response(
          JSON.stringify({ ok: false, message: `Analysis failed: ${err.message}` }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
    }

    // ─── 404 ────────────────────────────────────────────────
    return new Response(
      JSON.stringify({ ok: false, message: "Not found" }),
      { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  },
});

// ─── Helper: check if cookies file exists ────────────────────
async function checkCookiesExist(): Promise<boolean> {
  try {
    const file = Bun.file(COOKIES_PATH);
    return await file.exists();
  } catch {
    return false;
  }
}

console.log(`\n  🖥️  YTNiche Band — Local Server`);
console.log(`  ─────────────────────────────`);
console.log(`  URL:     http://localhost:${PORT}`);
console.log(`  Status:  GET  /api/health`);
console.log(`  Cookies: GET  /api/cookies/status`);
console.log(`           POST /api/cookies/upload`);
console.log(`  yt-dlp:  POST /api/ytdlp/metadata`);
console.log(`  Analyze: POST /api/analyze`);
console.log(`  ─────────────────────────────`);
console.log(`  Make sure the Vite dev server is running on port 3000.\n`);
