// 🔀 Provider Router
// Orchestrates all available providers with priority fallback.
// Never requires cookies or API keys.

import type {
  ProviderResult,
  NormalizedVideo,
  NormalizedChannel,
} from "./types";
import { getLocalRuntimeConfig } from "../config/localRuntimeConfig";
import { getVideoFromOEmbed } from "./oembedProvider";
import { getRecentUploadsFromRSS } from "./rssProvider";
import { getChannelFromApi } from "./youtubeApiProvider";
import { getManualChannel, getManualVideo } from "./manualProvider";
import { isYtDlpEnabled, getMetadataWithYtDlp } from "./ytdlpProvider";
import { parseYouTubeInput } from "../youtube/parseYouTubeInput";

/**
 * Resolves a video URL through all available providers.
 *
 * Priority:
 * 1. YouTube API (if key available)
 * 2. oEmbed (free, no key required)
 * 3. yt-dlp (if enabled in CLI)
 * 4. Manual fallback (heuristic)
 */
export async function resolveVideo(
  input: string
): Promise<ProviderResult<NormalizedVideo>> {
  const config = getLocalRuntimeConfig();
  const parsed = parseYouTubeInput(input);
  const allWarnings: string[] = [];
  const allErrors: string[] = [];

  // Priority 1: YouTube API
  if (!config.noKeyMode && parsed.videoId) {
    // For now, oEmbed provides similar data without API key
    // Full video API integration can be added later
  }

  // Priority 2: oEmbed (free, no key)
  if (parsed.type === "video" && parsed.cleanUrl) {
    const result = await getVideoFromOEmbed(parsed.cleanUrl);
    allWarnings.push(...result.warnings);
    allErrors.push(...result.errors);
    if (result.data) {
      return {
        data: result.data,
        provider: result.provider,
        warnings: allWarnings,
        errors: allErrors,
      };
    }
  }

  // Priority 3: yt-dlp (local CLI only)
  if (isYtDlpEnabled()) {
    const result = await getMetadataWithYtDlp(input);
    allWarnings.push(...result.warnings);
    allErrors.push(...result.errors);
    if (result.data) {
      return result as ProviderResult<NormalizedVideo>;
    }
  }

  // Priority 4: Manual fallback
  const manual = getManualVideo({
    title: parsed.displayName,
    channelTitle: parsed.displayName,
  });
  allWarnings.push(...manual.warnings);

  return {
    data: manual.data,
    provider: "manual",
    warnings: allWarnings,
    errors: allErrors,
  };
}

/**
 * Resolves a channel URL/handle through all available providers.
 *
 * Priority:
 * 1. YouTube API (if key available)
 * 2. RSS feed (if channel_id available, free)
 * 3. yt-dlp (if enabled in CLI)
 * 4. Manual fallback (heuristic)
 */
export async function resolveChannel(
  input: string
): Promise<ProviderResult<NormalizedChannel>> {
  const config = getLocalRuntimeConfig();
  const parsed = parseYouTubeInput(input);
  const allWarnings: string[] = [];
  const allErrors: string[] = [];

  // Priority 1: YouTube API
  if (!config.noKeyMode) {
    const apiHandle = parsed.handle || input;
    const result = await getChannelFromApi(apiHandle);
    allWarnings.push(...result.warnings);
    allErrors.push(...result.errors);
    if (result.data) {
      // Also try RSS for recent uploads
      if (result.data.id) {
        const rssResult = await getRecentUploadsFromRSS(result.data.id);
        allWarnings.push(...rssResult.warnings);
        allErrors.push(...rssResult.errors);
        if (rssResult.data && rssResult.data.length > 0) {
          result.data.recentUploads = rssResult.data;
        }
      }
      return {
        data: result.data,
        provider: "youtube-api",
        warnings: allWarnings,
        errors: allErrors,
      };
    }
  }

  // Priority 2: RSS feed (free, no key) — if we can resolve channel_id
  if (parsed.channelId) {
    const rssResult = await getRecentUploadsFromRSS(parsed.channelId);
    allWarnings.push(...rssResult.warnings);
    allErrors.push(...rssResult.errors);
    if (rssResult.data && rssResult.data.length > 0) {
      // We have uploads but no channel metadata — create minimal channel
      const firstUpload = rssResult.data[0];
      const data: NormalizedChannel = {
        title: firstUpload.channelTitle || parsed.displayName,
        handle: parsed.handle,
        url: parsed.cleanUrl,
        recentUploads: rssResult.data,
        provider: "rss",
        confidence: "medium",
      };
      return { data, provider: "rss", warnings: allWarnings, errors: allErrors };
    }
  } else if (parsed.handle) {
    allWarnings.push(
      "RSS requires channel_id. Use YouTube API or yt-dlp to resolve handle to channel_id."
    );
  }

  // Priority 3: yt-dlp (local CLI only)
  if (isYtDlpEnabled()) {
    const result = await getMetadataWithYtDlp(input);
    allWarnings.push(...result.warnings);
    allErrors.push(...result.errors);
    if (result.data) {
      return result as ProviderResult<NormalizedChannel>;
    }
  }

  // Priority 4: Manual fallback
  const manual = getManualChannel({
    name: parsed.handle || parsed.displayName,
  });
  allWarnings.push(...manual.warnings);

  return {
    data: manual.data,
    provider: "manual",
    warnings: allWarnings,
    errors: allErrors,
  };
}

/**
 * Resolves a keyword/search term through available providers.
 *
 * Priority:
 * 1. YouTube API search (if key available)
 * 2. Manual fallback (heuristic)
 */
export async function resolveKeyword(
  input: string
): Promise<ProviderResult<NormalizedChannel>> {
  const config = getLocalRuntimeConfig();
  const parsed = parseYouTubeInput(input);
  const allWarnings: string[] = [];
  const allErrors: string[] = [];

  // Priority 1: YouTube API search
  if (!config.noKeyMode) {
    try {
      const { searchYouTube } = await import(
        /* @vite-ignore */ "../../convex/youtube"
      );
      const results = await searchYouTube(input, 5);
      if (results && results.length > 0) {
        const top = results[0];
        const data: NormalizedChannel = {
          id: top.channelId,
          title: top.channelName,
          description: top.description,
          provider: "youtube-api",
          confidence: "medium",
        };
        return {
          data,
          provider: "youtube-api",
          warnings: allWarnings,
          errors: allErrors,
        };
      }
    } catch {
      allWarnings.push("YouTube API search failed. Falling back to heuristic.");
    }
  }

  // Priority 2: Manual fallback
  const manual = getManualChannel({ name: input });
  allWarnings.push(...manual.warnings);

  return {
    data: manual.data,
    provider: "manual",
    warnings: allWarnings,
    errors: allErrors,
  };
}
