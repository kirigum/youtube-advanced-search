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
  order: 'relevance' | 'date' | 'viewCount' | 'rating';
}
export interface YouTubeChannelListResponse {
  kind: "youtube#channelListResponse";
  etag: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: YouTubeChannelItem[];
}

export interface YouTubeChannelItem {
  kind: "youtube#channel";
  etag: string;
  id: string;
  snippet: {
    title: string;
    description: string;
    customUrl?: string; // e.g. "@username"
    publishedAt: string; // ISO 8601 Date string
    thumbnails: {
      default: YouTubeThumbnail;
      medium?: YouTubeThumbnail;
      high?: YouTubeThumbnail;
    };
    localized: {
      title: string;
      description: string;
    };
    country?: string;
  };
  statistics: {
    viewCount: string;
    subscriberCount: string;
    hiddenSubscriberCount: boolean;
    videoCount: string;
  };
}

export interface YouTubeThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface YouTubeVideoListResponse {
  kind: "youtube#videoListResponse";
  etag: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: YouTubeVideoItem[];
}

export interface YouTubeVideoItem {
  kind: "youtube#video";
  etag: string;
  id: string;
  contentDetails: {
    duration: string; // ISO 8601 duration format (e.g., "PT15M33S")
    dimension: "2d" | "3d";
    definition: "hd" | "sd";
    caption: "true" | "false";
    licensedContent: boolean;
    regionRestriction?: {
      allowed?: string[]; // ISO 3166-1 alpha-2 country codes
      blocked?: string[]; // ISO 3166-1 alpha-2 country codes
    };
    contentRating: Record<string, any>; // Complex parental control schemas
    projection: "rectangular" | "360";
    hasCustomThumbnail?: boolean;
  };
  statistics: {
    viewCount: string;
    likeCount?: string;
    favoriteCount: string;
    commentCount?: string;
  };
}

export interface YouTubeSearchQueryParameters {
  part: 'snippet';
  key: string;

  q: string;

  type?: 'video' | 'channel' | 'playlist'; // Must be 'video' to use eventType
  maxResults?: string; // max is 50
  pageToken?: string;
  order?: 'date' | 'rating' | 'relevance' | 'title' | 'videoCount' | 'viewCount';

  eventType?: 'completed' | 'live' | 'upcoming';

  regionCode?: string;
  relevanceLanguage?: string;

  publishedAfter?: string;
  publishedBefore?: string;

  videoDuration?: 'any' | 'long' | 'medium' | 'short';
  videoPaidProductPlacement?: 'true' | 'any';
}


export interface YouTubeSearchVideoResponse {
  kind: "youtube#searchListResponse";
  etag: string;
  nextPageToken?: string;
  prevPageToken?: string;
  regionCode: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: YouTubeSearchVideoItem[];
}

export interface YouTubeSearchVideoItem {
  kind: "youtube#searchResult";
  etag: string;
  id: {
    kind: "youtube#video";
    videoId: string;
  };
  snippet: {
    publishedAt: string; // ISO 8601 Date string
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default: YouTubeThumbnail;
      medium?: YouTubeThumbnail;
      high?: YouTubeThumbnail;
    };
    channelTitle: string;
    liveBroadcastContent: "none" | "upcoming" | "live";
    publishTime: string;
  };
}

export interface ExtendedYouTubeSearchVideoItem extends YouTubeSearchVideoItem {
  statistics?: YouTubeVideoItem['statistics'];
  contentDetails?: YouTubeVideoItem['contentDetails'];
  channel?: {
    statistics: YouTubeChannelItem['statistics'];
    snippet: YouTubeChannelItem['snippet'];
  };
}

export interface YouTubeSearchVideoOptions extends Omit<YouTubeSearchQueryParameters, 'key'> {
  minViews?: number;
  maxViews?: number;
  minSubs?: number;
  maxSubs?: number;
  excludedRegions?: string[];
}
