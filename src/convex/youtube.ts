// YouTube Data API v3 wrapper
// No Convex generated dependencies — works standalone

const YT_API_BASE = 'https://www.googleapis.com/youtube/v3';

async function fetchYouTube(endpoint: string, params: Record<string, string>) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) throw new Error('YOUTUBE_API_KEY not configured');

  const url = new URL(`${YT_API_BASE}/${endpoint}`);
  url.searchParams.set('key', apiKey);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString());
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`YouTube API error (${res.status}): ${err}`);
  }
  return res.json();
}

export interface YouTubeChannelInfo {
  id: string;
  name: string;
  description: string;
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
  createdDate: string;
  thumbnailUrl: string;
}

export async function getChannelInfo(channelId: string): Promise<YouTubeChannelInfo> {
  const data = await fetchYouTube('channels', {
    part: 'snippet,statistics',
    id: channelId,
  });
  const item = data.items?.[0];
  if (!item) throw new Error(`Channel ${channelId} not found`);

  return {
    id: item.id,
    name: item.snippet.title,
    description: item.snippet.description,
    subscriberCount: parseInt(item.statistics.subscriberCount || '0'),
    viewCount: parseInt(item.statistics.viewCount || '0'),
    videoCount: parseInt(item.statistics.videoCount || '0'),
    createdDate: item.snippet.publishedAt,
    thumbnailUrl: item.snippet.thumbnails?.high?.url || '',
  };
}

export interface YouTubeVideo {
  id: string;
  title: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  thumbnailUrl: string;
  duration: string;
}

export async function getChannelVideos(channelId: string, maxResults = 10): Promise<YouTubeVideo[]> {
  const channelData = await fetchYouTube('channels', {
    part: 'contentDetails',
    id: channelId,
  });
  const uploadsId = channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!uploadsId) return [];

  const playlistData = await fetchYouTube('playlistItems', {
    part: 'snippet',
    playlistId: uploadsId,
    maxResults: maxResults.toString(),
    order: 'date',
  });

  const videoIds = playlistData.items
    ?.map((item: any) => item.snippet.resourceId.videoId)
    .filter(Boolean)
    .join(',');

  if (!videoIds) return [];

  const videosData = await fetchYouTube('videos', {
    part: 'statistics,contentDetails,snippet',
    id: videoIds,
  });

  return (videosData.items || []).map((item: any) => ({
    id: item.id,
    title: item.snippet.title,
    publishedAt: item.snippet.publishedAt,
    viewCount: parseInt(item.statistics?.viewCount || '0'),
    likeCount: parseInt(item.statistics?.likeCount || '0'),
    commentCount: parseInt(item.statistics?.commentCount || '0'),
    thumbnailUrl: item.snippet.thumbnails?.high?.url || '',
    duration: item.contentDetails?.duration || 'PT0M',
  }));
}

export interface SearchResult {
  channelId: string;
  channelName: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnailUrl: string;
}

export async function searchYouTube(query: string, maxResults = 20): Promise<SearchResult[]> {
  const params: Record<string, string> = {
    part: 'snippet',
    q: query,
    maxResults: maxResults.toString(),
    type: 'video',
  };

  const data = await fetchYouTube('search', params);
  return (data.items || []).map((item: any) => ({
    channelId: item.snippet.channelId,
    channelName: item.snippet.channelTitle,
    title: item.snippet.title,
    description: item.snippet.description,
    publishedAt: item.snippet.publishedAt,
    thumbnailUrl: item.snippet.thumbnails?.high?.url || '',
  }));
}

export async function getChannelByHandle(handle: string): Promise<YouTubeChannelInfo | null> {
  const data = await fetchYouTube('channels', {
    part: 'snippet,statistics',
    forHandle: handle.replace('@', ''),
  });
  const item = data.items?.[0];
  if (!item) return null;
  return {
    id: item.id,
    name: item.snippet.title,
    description: item.snippet.description,
    subscriberCount: parseInt(item.statistics.subscriberCount || '0'),
    viewCount: parseInt(item.statistics.viewCount || '0'),
    videoCount: parseInt(item.statistics.videoCount || '0'),
    createdDate: item.snippet.publishedAt,
    thumbnailUrl: item.snippet.thumbnails?.high?.url || '',
  };
}
