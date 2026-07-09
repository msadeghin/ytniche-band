// 📡 RSS Provider
// Uses YouTube's public RSS feed for recent uploads — no API key required
//
// Limitations:
// - RSS does not provide view counts
// - RSS does not provide subscriber counts
// - RSS requires a channel_id (not handle)
// - Returns at most 15 recent videos

import type { ProviderResult, NormalizedVideo } from "./types";

const RSS_URL = "https://www.youtube.com/feeds/videos.xml";

interface RSSEntry {
  videoId?: string;
  title?: string;
  link?: string;
  published?: string;
  authorName?: string;
  authorUri?: string;
  thumbnailUrl?: string;
}

/**
 * Fetches recent uploads from a channel using YouTube's public RSS feed.
 * No API key required.
 *
 * @param channelId - The YouTube channel ID (not handle)
 * @returns Recent uploads with title, URL, and publish date
 */
export async function getRecentUploadsFromRSS(
  channelId: string
): Promise<ProviderResult<NormalizedVideo[]>> {
  const warnings: string[] = [];
  const errors: string[] = [];

  if (!channelId) {
    errors.push("RSS requires channel_id. Provide a channel ID, not a handle.");
    return { data: null, provider: "rss", warnings, errors };
  }

  try {
    const url = `${RSS_URL}?channel_id=${encodeURIComponent(channelId)}`;
    const res = await fetch(url);

    if (!res.ok) {
      errors.push(`RSS feed returned status ${res.status}`);
      return { data: null, provider: "rss", warnings, errors };
    }

    const text = await res.text();

    // Parse XML manually (no external XML parser dependency)
    const entries = parseRSSXml(text);

    if (entries.length === 0) {
      warnings.push("RSS feed returned no entries. Channel may have no uploads.");
      return { data: [], provider: "rss", warnings, errors };
    }

    warnings.push(
      "RSS does not provide view counts, like counts, or subscriber counts."
    );

    const videos: NormalizedVideo[] = entries.map((entry) => ({
      id: entry.videoId,
      title: entry.title || "Unknown",
      url: entry.link || `https://www.youtube.com/watch?v=${entry.videoId}`,
      channelTitle: entry.authorName,
      channelUrl: entry.authorUri,
      publishedAt: entry.published,
      thumbnailUrl: entry.thumbnailUrl,
      provider: "rss" as const,
      confidence: "medium" as const,
    }));

    return { data: videos, provider: "rss", warnings, errors };
  } catch (err: any) {
    errors.push(`RSS fetch failed: ${err.message}`);
    return { data: null, provider: "rss", warnings, errors };
  }
}

/**
 * Minimal XML parser for YouTube RSS feeds.
 * Does NOT use DOMParser (not available in all environments).
 */
function parseRSSXml(xml: string): RSSEntry[] {
  const entries: RSSEntry[] = [];

  // Match each <entry>...</entry> block
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/gi;
  let entryMatch;

  while ((entryMatch = entryRegex.exec(xml)) !== null) {
    const block = entryMatch[1];

    const entry: RSSEntry = {};

    // Extract videoId from <yt:videoId>
    const videoIdMatch = block.match(/<yt:videoId>([^<]+)<\/yt:videoId>/i);
    if (videoIdMatch) entry.videoId = videoIdMatch[1];

    // Extract title
    const titleMatch = block.match(/<title>([^<]+)<\/title>/i);
    if (titleMatch) entry.title = titleMatch[1];

    // Extract link
    const linkMatch = block.match(/<link[^>]*href="([^"]+)"/i);
    if (linkMatch) entry.link = linkMatch[1];

    // Extract published date
    const publishedMatch = block.match(/<published>([^<]+)<\/published>/i);
    if (publishedMatch) entry.published = publishedMatch[1];

    // Extract author name
    const authorNameMatch = block.match(/<name>([^<]+)<\/name>/i);
    if (authorNameMatch) entry.authorName = authorNameMatch[1];

    // Extract author URI
    const authorUriMatch = block.match(/<uri>([^<]+)<\/uri>/i);
    if (authorUriMatch) entry.authorUri = authorUriMatch[1];

    // Extract media:thumbnail
    const thumbMatch = block.match(
      /<media:thumbnail[^>]*url="([^"]+)"/i
    );
    if (thumbMatch) entry.thumbnailUrl = thumbMatch[1];

    entries.push(entry);
  }

  return entries;
}
