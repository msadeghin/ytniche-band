// Provider types for the YouTube metadata layer

export type ProviderName =
  | "youtube-api"
  | "rss"
  | "oembed"
  | "manual"
  | "ytdlp";

export interface ProviderResult<T> {
  data: T | null;
  provider: ProviderName;
  warnings: string[];
  errors: string[];
}

export interface NormalizedVideo {
  id?: string;
  title: string;
  url: string;
  channelTitle?: string;
  channelUrl?: string;
  publishedAt?: string;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  duration?: string;
  description?: string;
  transcript?: string;
  provider: ProviderName;
  confidence: "low" | "medium" | "high";
  thumbnailUrl?: string;
}

export interface NormalizedChannel {
  id?: string;
  title: string;
  url?: string;
  handle?: string;
  description?: string;
  subscriberCount?: number;
  viewCount?: number;
  videoCount?: number;
  publishedAt?: string;
  recentUploads?: NormalizedVideo[];
  provider: ProviderName;
  confidence: "low" | "medium" | "high";
  thumbnailUrl?: string;
}
