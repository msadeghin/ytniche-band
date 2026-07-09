// 🔗 oEmbed Provider
// Uses YouTube's public oEmbed endpoint — no API key required

import type { ProviderResult, NormalizedVideo } from "./types";

const OEMBED_URL = "https://www.youtube.com/oembed";

/**
 * Fetches video metadata from YouTube's free oEmbed endpoint.
 * No API key required.
 *
 * Returns basic info: title, author name, author URL.
 * Does NOT return: view count, like count, comments.
 */
export async function getVideoFromOEmbed(
  videoUrl: string
): Promise<ProviderResult<NormalizedVideo>> {
  const warnings: string[] = [];
  const errors: string[] = [];

  try {
    const url = `${OEMBED_URL}?url=${encodeURIComponent(videoUrl)}&format=json`;
    const res = await fetch(url);

    if (!res.ok) {
      errors.push(`oEmbed returned status ${res.status}`);
      return { data: null, provider: "oembed", warnings, errors };
    }

    const data = await res.json();

    if (!data || !data.title) {
      errors.push("oEmbed returned empty data");
      return { data: null, provider: "oembed", warnings, errors };
    }

    warnings.push(
      "oEmbed does not provide view counts, like counts, or subscriber data."
    );

    const normalized: NormalizedVideo = {
      title: data.title || "Unknown Title",
      url: videoUrl,
      channelTitle: data.author_name || undefined,
      channelUrl: data.author_url || undefined,
      thumbnailUrl: data.thumbnail_url || undefined,
      provider: "oembed",
      confidence: "medium",
    };

    return { data: normalized, provider: "oembed", warnings, errors };
  } catch (err: any) {
    errors.push(`oEmbed fetch failed: ${err.message}`);
    return { data: null, provider: "oembed", warnings, errors };
  }
}
