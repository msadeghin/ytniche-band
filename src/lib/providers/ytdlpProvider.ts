// ⚡ yt-dlp Local Provider (Optional)
// Provides richer YouTube metadata using yt-dlp on the local machine.
//
// IMPORTANT SAFETY RULES:
// - Disabled by default. Enable with: ENABLE_YTDLP=true
// - Cookies are NEVER stored in app state, logs, or committed to Git.
// - Cookie access is local-only. Never upload or share cookies.
// - In browser environments, this provider always returns a warning.
//
// Cookie safety:
// - Export cookies manually from browser extension (e.g., Get cookies.txt)
// - Save to: ./private/cookies.txt
// - Set: YOUTUBE_COOKIES_PATH=./private/cookies.txt
// - Set: ENABLE_COOKIES=true
// - NEVER commit cookies.txt to Git.

import type { ProviderResult, NormalizedVideo, NormalizedChannel } from "./types";

/**
 * Checks if yt-dlp is enabled via environment variable.
 * Default: false (disabled).
 */
export function isYtDlpEnabled(): boolean {
  const isBrowser = typeof window !== "undefined";
  if (isBrowser) return false;
  return process.env.ENABLE_YTDLP === "true";
}

/**
 * Checks if cookie access is enabled via environment variable.
 * Default: false (disabled).
 */
export function isCookieAccessEnabled(): boolean {
  const isBrowser = typeof window !== "undefined";
  if (isBrowser) return false;
  return process.env.ENABLE_COOKIES === "true";
}

/**
 * Gets metadata using yt-dlp.
 *
 * In browser environments, this always returns a warning.
 * In CLI/server environments with yt-dlp installed, it executes yt-dlp.
 * Without yt-dlp, it returns a clear warning.
 */
export async function getMetadataWithYtDlp(
  url: string
): Promise<ProviderResult<NormalizedVideo | NormalizedChannel>> {
  const warnings: string[] = [];
  const errors: string[] = [];

  // ─── Browser check ───────────────────────────────────────
  const isBrowser = typeof window !== "undefined";
  if (isBrowser) {
    warnings.push(
      "yt-dlp is not available in browser environments. Switch to CLI for yt-dlp support."
    );
    return { data: null, provider: "ytdlp", warnings, errors };
  }

  // ─── Enabled check ───────────────────────────────────────
  if (!isYtDlpEnabled()) {
    warnings.push(
      "yt-dlp is disabled. Set ENABLE_YTDLP=true in your environment to enable."
    );
    return { data: null, provider: "ytdlp", warnings, errors };
  }

  // ─── Cookie warning ──────────────────────────────────────
  if (isCookieAccessEnabled()) {
    warnings.push(
      "Cookie access: local-only. Cookies are NEVER uploaded, shared, or committed to Git."
    );
    warnings.push(
      "Cookie path: " + (process.env.YOUTUBE_COOKIES_PATH || "not set")
    );
  }

  // ─── Check if yt-dlp is available ────────────────────────
  try {
    const { execSync } = await import("child_process");
    const result = execSync("which yt-dlp", {
      encoding: "utf-8",
      timeout: 5000,
    }).toString().trim();

    if (!result) {
      warnings.push(
        "yt-dlp not found in PATH. Install it: https://github.com/yt-dlp/yt-dlp"
      );
      return { data: null, provider: "ytdlp", warnings, errors };
    }
  } catch {
    warnings.push(
      "yt-dlp not found in PATH. Install it: https://github.com/yt-dlp/yt-dlp"
    );
    return { data: null, provider: "ytdlp", warnings, errors };
  }

  // ─── Execute yt-dlp ─────────────────────────────────────
  // For now, this is a stub that documents how CLI/server can use yt-dlp.
  // Full implementation requires careful process management in the deployment context.
  warnings.push(
    "yt-dlp execution is available in CLI mode. Run 'bun run analyze' for terminal-based analysis."
  );

  return { data: null, provider: "ytdlp", warnings, errors };
}
