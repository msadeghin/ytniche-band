// 🔗 YouTube Input Parser
// Parses various YouTube URL formats and plain keywords into structured input

export type YouTubeInputType = "channel" | "video" | "keyword" | "unknown";

export interface ParsedYouTubeInput {
  type: YouTubeInputType;
  originalInput: string;
  handle?: string;
  channelId?: string;
  videoId?: string;
  cleanUrl?: string;
  displayName: string;
}

/**
 * Parses a YouTube URL or keyword into structured parts.
 *
 * Supported formats:
 * - https://www.youtube.com/@handle
 * - https://www.youtube.com/@handle/videos
 * - https://youtube.com/@handle
 * - https://www.youtube.com/channel/CHANNEL_ID
 * - https://www.youtube.com/c/customname
 * - https://www.youtube.com/user/username
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - plain keyword
 *
 * Important: For input like "https://www.youtube.com/@timdanilovhi/videos",
 * the displayName should be "@timdanilovhi", not "videos".
 */
export function parseYouTubeInput(input: string): ParsedYouTubeInput {
  const trimmed = input.trim();
  const result: ParsedYouTubeInput = {
    type: "unknown",
    originalInput: trimmed,
    displayName: trimmed,
  };

  if (!trimmed) return result;

  // Check if it's a URL
  const isUrl =
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("youtube.com/") ||
    trimmed.startsWith("youtu.be/") ||
    trimmed.startsWith("www.youtube.com/");

  if (isUrl) {
    // Normalize URL — add protocol if missing
    let url: URL;
    try {
      url = new URL(
        trimmed.startsWith("http") ? trimmed : `https://${trimmed}`
      );
    } catch {
      result.type = "keyword";
      result.displayName = trimmed;
      return result;
    }

    const hostname = url.hostname.replace("www.", "");
    const pathname = url.pathname;

    // ─── Handle /@handle variants ──────────────────────────
    const handleMatch = pathname.match(/^\/(@[\w.-]+)/);
    if (handleMatch) {
      result.type = "channel";
      result.handle = handleMatch[1];
      result.displayName = handleMatch[1];
      result.cleanUrl = `https://www.youtube.com/${handleMatch[1]}`;
      return result;
    }

    // ─── Handle /channel/CHANNEL_ID ────────────────────────
    const channelMatch = pathname.match(/^\/channel\/([\w-]+)/);
    if (channelMatch) {
      result.type = "channel";
      result.channelId = channelMatch[1];
      result.displayName = `Channel ${channelMatch[1].substring(0, 8)}...`;
      result.cleanUrl = `https://www.youtube.com/channel/${channelMatch[1]}`;
      return result;
    }

    // ─── Handle /c/customname ──────────────────────────────
    const cMatch = pathname.match(/^\/c\/([\w.-]+)/);
    if (cMatch) {
      result.type = "channel";
      result.displayName = cMatch[1];
      result.cleanUrl = `https://www.youtube.com/c/${cMatch[1]}`;
      return result;
    }

    // ─── Handle /user/username ─────────────────────────────
    const userMatch = pathname.match(/^\/user\/([\w.-]+)/);
    if (userMatch) {
      result.type = "channel";
      result.displayName = userMatch[1];
      result.cleanUrl = `https://www.youtube.com/user/${userMatch[1]}`;
      return result;
    }

    // ─── Handle /watch?v=VIDEO_ID ──────────────────────────
    const videoId = url.searchParams.get("v");
    if (videoId && hostname.includes("youtube")) {
      result.type = "video";
      result.videoId = videoId;
      result.displayName = `Video ${videoId.substring(0, 8)}...`;
      result.cleanUrl = `https://www.youtube.com/watch?v=${videoId}`;
      return result;
    }

    // ─── Handle youtu.be/VIDEO_ID ──────────────────────────
    if (hostname === "youtu.be") {
      const shortId = pathname.replace(/^\//, "").split("/")[0];
      if (shortId) {
        result.type = "video";
        result.videoId = shortId;
        result.displayName = `Video ${shortId.substring(0, 8)}...`;
        result.cleanUrl = `https://youtu.be/${shortId}`;
        return result;
      }
    }

    // Fallback: unknown URL type
    result.type = "keyword";
    result.displayName = trimmed;
    return result;
  }

  // ─── Plain @handle without URL ───────────────────────────
  if (trimmed.startsWith("@")) {
    result.type = "channel";
    result.handle = trimmed;
    result.displayName = trimmed;
    result.cleanUrl = `https://www.youtube.com/${trimmed}`;
    return result;
  }

  // ─── Plain keyword ───────────────────────────────────────
  result.type = "keyword";
  result.displayName = trimmed;
  return result;
}
