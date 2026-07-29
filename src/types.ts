export interface SearchFilters {
  keyword: string;
  minViews?: number;
  maxViews?: number;
  minSubs?: number;
  maxSubs?: number;
  dateFilter: 'Any' | 'Today' | 'This Week' | 'This Month';
  regionCode: string;
  language: string;
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
  };
}

export interface YTVideoItem {
  id: string;
  statistics: { viewCount: string };
}

export interface YTChannelItem {
  id: string;
  statistics: { subscriberCount: string };
}
