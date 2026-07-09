// 🎬 YouTube API Provider
// Uses the YouTube Data API v3 via the Convex backend,
// with a browser-safe fallback if the API key is not available.

import type {
  ProviderResult,
  NormalizedChannel,
  NormalizedVideo,
} from "./types";
import { getLocalRuntimeConfig } from "../config/localRuntimeConfig";

/**
 * Attempts to resolve a channel using the YouTube API.
 * Returns null with a clear warning if the API key is not available.
 */
export async function getChannelFromApi(
  handleOrId: string
): Promise<ProviderResult<NormalizedChannel>> {
  const config = getLocalRuntimeConfig();
  const warnings: string[] = [];
  const errors: string[] = [];

  if (config.noKeyMode) {
    warnings.push(
      "YouTube API key not configured. Set YOUTUBE_API_KEY for exact channel stats."
    );
    warnings.push(
      "Continuing with heuristic analysis. Create a free key at: https://console.cloud.google.com/apis/credentials"
    );
    return { data: null, provider: "youtube-api", warnings, errors };
  }

  try {
    // Attempt to use the Convex YouTube module via dynamic import
    // This is a browser-safe wrapper — the actual API call goes through Convex
    const { getChannelByHandle } = await import(
      /* @vite-ignore */ "../../convex/youtube"
    );

    // Remove '@' prefix if present
    const cleanHandle = handleOrId.startsWith("@")
      ? handleOrId.substring(1)
      : handleOrId;

    const channel = await getChannelByHandle(cleanHandle);

    if (!channel) {
      warnings.push(
        `Channel not found via YouTube API: ${handleOrId}. Falling back to heuristic analysis.`
      );
      return { data: null, provider: "youtube-api", warnings, errors };
    }

    const data: NormalizedChannel = {
      id: channel.id,
      title: channel.name,
      handle: handleOrId.startsWith("@") ? handleOrId : `@${cleanHandle}`,
      url: `https://www.youtube.com/${handleOrId}`,
      description: channel.description,
      subscriberCount: channel.subscriberCount,
      viewCount: channel.viewCount,
      videoCount: channel.videoCount,
      publishedAt: channel.createdDate,
      thumbnailUrl: channel.thumbnailUrl,
      provider: "youtube-api",
      confidence: "high",
    };

    return { data, provider: "youtube-api", warnings, errors };
  } catch (err: any) {
    errors.push(`YouTube API call failed: ${err.message}`);
    return { data: null, provider: "youtube-api", warnings, errors };
  }
}
