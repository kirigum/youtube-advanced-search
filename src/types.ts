export interface SearchFilters {
  keyword: string;
  minViews?: number;
  maxViews?: number;
  minSubs?: number;
  maxSubs?: number;
  dateFilter: 'Any' | 'Today' | 'This Week' | 'This Month';
  regionCode: string;
  language: string;
  videoDuration: 'Any' | 'short' | 'medium' | 'long';
  excludedRegions: string[];
  excludeLive: boolean;
  withPaidPromotion: boolean;
}

export interface MergedVideo {
  videoId: string;
  title: string;
  thumbnailUrl: string;
  channelId: string;
  channelTitle: string;
  publishedAt: string;
  viewCount: number;
  subscriberCount: number;
  durationInSeconds: number;
  country?: string;
}

export interface YTSearchItem {
  id: { videoId: string };
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: { medium: { url: string } };
    channelTitle: string;
    liveBroadcastContent: string;
  };
}

export interface YTVideoItem {
  id: string;
  statistics: { viewCount: string };
  contentDetails: { duration: string };
}

export interface YTChannelItem {
  id: string;
  statistics: { subscriberCount: string };
  snippet?: { country?: string };
}