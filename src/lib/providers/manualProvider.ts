// 🏠 Manual Provider (Fallback)
// Generates heuristic metadata when no API/feed provider is available.
// Always works — no API keys, no network calls.

import type { ProviderResult, NormalizedChannel, NormalizedVideo } from "./types";

/**
 * Creates a heuristic NormalizedChannel from minimal input.
 * Always succeeds — no network calls, no API key required.
 */
export function getManualChannel(input: {
  name: string;
  category?: string;
  format?: string;
}): ProviderResult<NormalizedChannel> {
  const warnings: string[] = [
    "Manual provider — data is heuristic, not from YouTube API.",
    "For accurate stats (subscribers, views), add a YouTube API key or use the CLI with yt-dlp.",
  ];

  const data: NormalizedChannel = {
    title: input.name,
    handle: input.name.startsWith("@") ? input.name : undefined,
    url: input.name.startsWith("@")
      ? `https://www.youtube.com/${input.name}`
      : undefined,
    description: `Heuristic analysis based on user input: ${input.name}`,
    provider: "manual",
    confidence: "low",
    recentUploads: [],
  };

  return { data, provider: "manual", warnings, errors: [] };
}

/**
 * Creates a heuristic NormalizedVideo from minimal input.
 * Always succeeds — no network calls, no API key required.
 */
export function getManualVideo(input: {
  title: string;
  channelTitle?: string;
}): ProviderResult<NormalizedVideo> {
  const warnings: string[] = [
    "Manual provider — data is heuristic, not from YouTube API.",
  ];

  const data: NormalizedVideo = {
    title: input.title,
    url: "",
    channelTitle: input.channelTitle,
    provider: "manual",
    confidence: "low",
  };

  return { data, provider: "manual", warnings, errors: [] };
}
