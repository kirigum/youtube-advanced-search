import { useState, useCallback } from 'react';
import { SearchFilters, MergedVideo, YTSearchItem, YTVideoItem, YTChannelItem } from './types';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || ''; 
const BASE_URL = 'https://youtube.googleapis.com/youtube/v3';
const MAX_AUTO_FETCHES = 5;

const parseDuration = (duration: string): number => {
  let hours = 0;
  let minutes = 0;
  let seconds = 0;
  
  const hoursMatch = duration.match(/(\d+)H/);
  const minutesMatch = duration.match(/(\d+)M/);
  const secondsMatch = duration.match(/(\d+)S/);
  
  if (hoursMatch) hours = parseInt(hoursMatch[1], 10);
  if (minutesMatch) minutes = parseInt(minutesMatch[1], 10);
  if (secondsMatch) seconds = parseInt(secondsMatch[1], 10);
  
  return hours * 3600 + minutes * 60 + seconds;
};

export const useYouTubeSearch = () => {
  const [data, setData] = useState<MergedVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [fetchedCount, setFetchedCount] = useState<number>(0);

  const getPublishedAfterDate = (filter: SearchFilters['dateFilter']): string | undefined => {
    if (filter === 'Any') return undefined;
    const date = new Date();
    if (filter === 'Today') date.setDate(date.getDate() - 1);
    if (filter === 'This Week') date.setDate(date.getDate() - 7);
    if (filter === 'This Month') date.setMonth(date.getMonth() - 1);
    return date.toISOString();
  };

  const executeSearch = useCallback(async (filters: SearchFilters, startingPageToken?: string) => {
    if (!API_KEY.trim()) {
      setError('Please provide a valid YouTube Data API v3 Key.');
      return;
    }

    setLoading(true);
    setError(null);

    let currentToken: string | undefined = startingPageToken;
    let foundResults: MergedVideo[] = [];
    let loopCount = 0;
    let cumulativeFetched = 0;
    let finalNextToken: string | null = null;

    try {
      const publishedAfter = getPublishedAfterDate(filters.dateFilter);

      // Loop to fetch multiple pages in case the first page doesn't yield results due to filters, up to MAX_AUTO_FETCHES times
      while (foundResults.length === 0 && loopCount < MAX_AUTO_FETCHES) {
        loopCount++;

        const queryParams: Record<string, string> = {
          part: 'snippet',
          type: 'video',
          maxResults: '50',
          // need to change
          order: 'date',
          q: filters.keyword,
          ...(publishedAfter && { publishedAfter }),
          ...(filters.regionCode && filters.regionCode !== 'Any' && { regionCode: filters.regionCode }),
          ...(filters.language && filters.language !== 'Any' && { relevanceLanguage: filters.language }),
          ...(currentToken && { pageToken: currentToken }),
          ...(filters.videoDuration && filters.videoDuration !== 'Any' && { videoDuration: filters.videoDuration }),
          ...(filters.withPaidPromotion && { videoPaidProductPlacement: 'true' }),
          key: API_KEY,
        };

        const searchUrl = new URL(`${BASE_URL}/search`);
        searchUrl.search = new URLSearchParams(queryParams).toString();

        const searchRes = await fetch(searchUrl.toString());
        const searchData = await searchRes.json();
        
        if (!searchRes.ok) {
           throw new Error(searchData.error?.message || 'Failed to fetch search results from YouTube API');
        }
        
        finalNextToken = searchData.nextPageToken || null;
        
        let searchItems: YTSearchItem[] = searchData.items || [];
        cumulativeFetched += searchItems.length;

        if (filters.excludeLive) {
          searchItems = searchItems.filter(item => item.snippet.liveBroadcastContent === 'none');
        }

        // If filtering removed all items on this page, immediately jump to the next page
        if (!searchItems.length) {
           if (!finalNextToken) break;
           currentToken = finalNextToken;
           continue; 
        }

        const videoIds = searchItems.map((item) => item.id.videoId).filter(Boolean).join(',');
        const channelIds = Array.from(new Set(searchItems.map((item) => item.snippet.channelId))).filter(Boolean).join(',');

        const [videosRes, channelsRes] = await Promise.all([
          fetch(`${BASE_URL}/videos?part=statistics,contentDetails&id=${videoIds}&key=${API_KEY}`),
          fetch(`${BASE_URL}/channels?part=statistics,snippet&id=${channelIds}&key=${API_KEY}`)
        ]);

        if (!videosRes.ok || !channelsRes.ok) throw new Error('Failed to fetch statistics');

        const videosData = await videosRes.json();
        const channelsData = await channelsRes.json();

        const viewsMap = new Map<string, number>();
        const durationMap = new Map<string, number>();
        (videosData.items || []).forEach((item: YTVideoItem) => {
          viewsMap.set(item.id, parseInt(item.statistics?.viewCount || '0', 10));
          durationMap.set(item.id, parseDuration(item.contentDetails?.duration || 'PT0S'));
        });

        const subsMap = new Map<string, number>();
        const countryMap = new Map<string, string>(); // NEW: Map for channel countries
        (channelsData.items || []).forEach((item: YTChannelItem) => {
          subsMap.set(item.id, parseInt(item.statistics?.subscriberCount || '0', 10));
          if (item.snippet?.country) {
            countryMap.set(item.id, item.snippet.country);
          }
        });

        const merged: MergedVideo[] = searchItems.map((item) => {
          const videoId = item.id.videoId;
          const channelId = item.snippet.channelId;

          return {
            videoId,
            title: item.snippet.title,
            thumbnailUrl: item.snippet.thumbnails.medium.url,
            channelId,
            channelTitle: item.snippet.channelTitle,
            publishedAt: item.snippet.publishedAt,
            viewCount: viewsMap.get(videoId) || 0,
            subscriberCount: subsMap.get(channelId) || 0,
            durationInSeconds: durationMap.get(videoId) || 0,
            country: countryMap.get(channelId),
          };
        });

        const filtered = merged.filter((video) => {
          if (filters.minViews && video.viewCount < filters.minViews) return false;
          if (filters.maxViews && video.viewCount > filters.maxViews) return false;
          if (filters.minSubs && video.subscriberCount < filters.minSubs) return false;
          if (filters.maxSubs && video.subscriberCount > filters.maxSubs) return false;

          if (filters.excludedRegions.length > 0 && video.country) {
            if (filters.excludedRegions.includes(video.country)) return false;
          }

          return true;
        });

        if (filtered.length > 0) {
          foundResults = filtered;
          break; 
        }

        if (!finalNextToken) break; 

        currentToken = finalNextToken;
      }

      setData(foundResults);
      setNextPageToken(finalNextToken);
      setFetchedCount(cumulativeFetched);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, executeSearch, nextPageToken, fetchedCount };
};
