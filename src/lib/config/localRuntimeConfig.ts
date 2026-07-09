// 🛠️ Local Runtime Configuration
// Browser-safe config detection — no filesystem access in browser

export interface LocalRuntimeConfig {
  enableYtDlp: boolean;
  enableCookies: boolean;
  cookiesPath?: string;
  youtubeApiKeyAvailable: boolean;
  noKeyMode: boolean;
}

/**
 * Detects available local features without reading filesystem.
 * In browser builds, only import.meta.env is available.
 * In CLI/Bun/server builds, process.env is available.
 */
export function getLocalRuntimeConfig(): LocalRuntimeConfig {
  const isBrowser = typeof window !== "undefined";
  const hasProcess = typeof process !== "undefined" && process.env;

  let youtubeApiKeyAvailable = false;

  if (isBrowser && typeof import.meta !== "undefined" && import.meta.env) {
    youtubeApiKeyAvailable = !!(
      (import.meta as any).env?.VITE_YOUTUBE_API_KEY ||
      (import.meta as any).env?.YOUTUBE_API_KEY
    );
  } else if (hasProcess) {
    youtubeApiKeyAvailable = !!(
      process.env.YOUTUBE_API_KEY ||
      process.env.VITE_YOUTUBE_API_KEY
    );
  }

  // yt-dlp and cookies are only available in CLI/server environments
  let enableYtDlp = false;
  let enableCookies = false;
  let cookiesPath: string | undefined;

  if (!isBrowser && hasProcess) {
    enableYtDlp = process.env.ENABLE_YTDLP === "true";
    enableCookies = process.env.ENABLE_COOKIES === "true";
    cookiesPath = process.env.YOUTUBE_COOKIES_PATH || undefined;
  }

  return {
    enableYtDlp,
    enableCookies,
    cookiesPath,
    youtubeApiKeyAvailable,
    noKeyMode: !youtubeApiKeyAvailable,
  };
}
