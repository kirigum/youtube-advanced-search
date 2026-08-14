import React, { createContext, useContext, useState, useCallback, PropsWithChildren } from 'react';
import { SearchFilters, ExtendedYouTubeSearchVideoItem } from '@/types';
import youtubeSearchService from '@/services/youtube-search';

interface YouTubeSearchContextValue {
  data: ExtendedYouTubeSearchVideoItem[] | null;
  loading: boolean;
  error: string | null;
  filters: SearchFilters;
  onSearch: () => Promise<void>;
  onChangeFilter: <K extends keyof SearchFilters>(name: K, value: SearchFilters[K]) => void;
  onLoadMore?: () => Promise<void>;
}

const FILTERS_INITIAL_STATE: SearchFilters = {
  keyword: '',
  order: 'relevance',
  dateFilter: 'Any',
  regionCode: 'Any',
  language: 'Any',
  videoDuration: 'Any',
  excludedRegions: [],
  excludeLive: false,
  withPaidPromotion: false,
};

const getPublishedAfterDate = (filter: SearchFilters['dateFilter']): string | undefined => {
  if (filter === 'Any') return undefined;
  const date = new Date();
  if (filter === 'Today') date.setDate(date.getDate() - 1);
  if (filter === 'This Week') date.setDate(date.getDate() - 7);
  if (filter === 'This Month') date.setMonth(date.getMonth() - 1);
  return date.toISOString();
};

const YouTubeSearchContext = createContext<YouTubeSearchContextValue | null>(null);

export const YouTubeSearchProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [data, setData] = useState<ExtendedYouTubeSearchVideoItem[] | null>(null);
  const [filters, setFilters] = useState<SearchFilters>(FILTERS_INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);

  const executeSearch = useCallback(async (pageToken?: string) => {
    setLoading(true);
    setError(null);

    try {
      const { order, keyword, dateFilter, withPaidPromotion, excludeLive, language, regionCode, videoDuration, ...resFilters } = filters;
      const publishedAfter = getPublishedAfterDate(dateFilter);

      const searchData = await youtubeSearchService.searchVideos({
        part: 'snippet',
        type: 'video',
        maxResults: '50',
        q: keyword,
        ...resFilters,
        ...(publishedAfter && { publishedAfter }),
        ...(regionCode && regionCode !== 'Any' && { regionCode }),
        ...(language && language !== 'Any' && { relevanceLanguage: language }),
        ...(pageToken && { pageToken }),
        ...(withPaidPromotion && { videoPaidProductPlacement: 'true' }),
        ...(excludeLive && { eventType: 'completed' }),
        ...(videoDuration && videoDuration !== 'Any' && { videoDuration }),
      });

      return {
        items: searchData.items,
        nextPageToken: searchData.nextPageToken ?? null,
      };
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const onLoadMore = useCallback(async () => {
    if (!nextPageToken) {
      return;
    }

    const result = await executeSearch(nextPageToken);

    if (result) {
      setData((prev) => [...(prev || []), ...result.items]);
      setNextPageToken(result.nextPageToken);
    }
  }, [executeSearch, nextPageToken]);

  const onChangeFilter = useCallback(<K extends keyof SearchFilters>(name: K, value: SearchFilters[K]) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const onSearch = useCallback(async () => {
    setData(null);
    setNextPageToken(null);

    const result = await executeSearch();

    if (result) {
      setData(result.items);
      setNextPageToken(result.nextPageToken);
    }
  }, [executeSearch]);

  const value: YouTubeSearchContextValue = {
    data,
    loading,
    error,
    filters,
    onSearch,
    onChangeFilter,
    onLoadMore: !!nextPageToken ? onLoadMore : undefined,
  };

  return (
    <YouTubeSearchContext.Provider value={value}>
      {children}
    </YouTubeSearchContext.Provider>
  );
};

export const useYouTubeSearch = (): YouTubeSearchContextValue => {
  const context = useContext(YouTubeSearchContext);
  
  if (!context) {
    throw new Error('useYouTubeSearch must be used within a YouTubeSearchProvider');
  }
  
  return context;
};