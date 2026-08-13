import { YouTubeChannelListResponse, YouTubeVideoListResponse, YouTubeSearchVideoResponse, SearchFilters, YouTubeChannelItem, YouTubeSearchVideoOptions, ExtendedYouTubeSearchVideoItem } from '../types';

class YouTubeSearchService {
  private readonly BASE_URL = 'https://www.googleapis.com/youtube/v3';
  private readonly API_KEY: string;

  private channels = new Map<string, YouTubeChannelItem>();

  constructor() {
    const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY || '';

    if (!apiKey.trim()) {
      throw new Error('Please provide a valid YouTube Data API v3 Key.');
    }

    this.API_KEY = apiKey;
  }

  private async processFetch<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json()

      throw new Error(`API Error (${response.status}): ${errorData?.error?.message}`);
    }

    return response.json();
  }

  public getPublishedAfterDate(dateFilter: SearchFilters['dateFilter']): string | undefined {
    if (dateFilter === 'Any') {
      return undefined;
    }

    const date = new Date();

    if (dateFilter === 'Today') {
      date.setDate(date.getDate() - 1);
    }
    if (dateFilter === 'This Week') {
      date.setDate(date.getDate() - 7);
    }
    if (dateFilter === 'This Month') {
      date.setMonth(date.getMonth() - 1);
    }

    return date.toISOString();
  }

  public async getChannels(channelIds: string[]) {
    let cachedChannels: YouTubeChannelItem[] = [];
    let idsToFetch = new Set<string>();

    channelIds.forEach((id) => {
      if (this.channels.has(id)) {
        cachedChannels.push(this.channels.get(id)!);
      } else {
        idsToFetch.add(id);
      }
    });

    if (idsToFetch.size === 0) {
      return cachedChannels;
    }

    try {
    const url = `${this.BASE_URL}/channels?part=statistics,snippet&id=${Array.from(idsToFetch).join(',')}&key=${this.API_KEY}`;
    const data = await this.processFetch<YouTubeChannelListResponse>(url);

    data.items.forEach(item => this.channels.set(item.id, item));

    return [...cachedChannels, ...data.items];
    } catch (error: unknown) {
      throw new Error(`Failed to fetch channels: ${(error as Error)?.message}`);
    }
  }

  public async getVideos(videoIds: string[]) {
    if (videoIds.length === 0) {
      return [];
    }

    try {
    const url = `${this.BASE_URL}/videos?part=statistics,contentDetails&id=${videoIds.join(',')}&key=${this.API_KEY}`;
    const data = await this.processFetch<YouTubeVideoListResponse>(url);

    return data.items;
    } catch (error: unknown) {
      throw new Error(`Failed to fetch videos: ${(error as Error)?.message}`);
    }
  }

  public async searchVideos({ minSubs, maxSubs, minViews, maxViews, excludedRegions, ...options }: YouTubeSearchVideoOptions) {
    try {
    const queryParams: Record<string, string> = {
      ...options,
      key: this.API_KEY,
    };

      const url = new URL(`${this.BASE_URL}/search`);
      url.search = new URLSearchParams(queryParams).toString();

      const searchData = await this.processFetch<YouTubeSearchVideoResponse>(url.toString());

      const videoIds = searchData.items.map((item) => item.id.videoId).filter(Boolean);
      const channelIds = Array.from(new Set(searchData.items.map((item) => item.snippet.channelId))).filter(Boolean);

      const [videosData, channelsData] = await Promise.all([
        minViews || maxViews ? this.getVideos(videoIds) : Promise.resolve([]),
        minSubs || maxSubs ? this.getChannels(channelIds) : Promise.resolve([]),
      ]);

      const extendedSearchItems: ExtendedYouTubeSearchVideoItem[] = searchData.items.map((item) => {
        const videoDetails = videosData.find((video) => video.id === item.id.videoId);
        const channelDetails = channelsData.find((channel) => channel.id === item.snippet.channelId);

        return {
          ...item,
          statistics: videoDetails?.statistics,
          contentDetails: videoDetails?.contentDetails,
          channel: channelDetails ? { statistics: channelDetails.statistics, snippet: channelDetails.snippet } : undefined,
        };
      });

      const filteredItems = extendedSearchItems.filter((video) => {
        if (minViews && parseInt(video?.statistics?.viewCount || '0', 10) < minViews) {
          return false;
        }
        if (maxViews && parseInt(video?.statistics?.viewCount || '0', 10) > maxViews) {
          return false;
        }
        if (minSubs && parseInt(video?.channel?.statistics?.subscriberCount || '0', 10) < minSubs) {
          return false;
        }
        if (maxSubs && parseInt(video?.channel?.statistics?.subscriberCount || '0', 10) > maxSubs) {
          return false;
        }
        if (!!excludedRegions?.length && video?.channel?.snippet?.country) {
          return !excludedRegions.includes(video.channel.snippet.country);
        }

        return true;
      });

      return { items: filteredItems, nextPageToken: searchData.nextPageToken };
    } catch (error: unknown) {
      throw new Error((error as Error)?.message || 'An unexpected error occurred while searching for videos.');
    }
  }
}

// Export the singleton instance directly!
export default new YouTubeSearchService();
