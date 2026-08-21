import React, { PropsWithChildren, createContext, useCallback, useContext, useState } from 'react';

import youtubeSearchService from '@/services/youtube-search';
import { ExtendedYouTubeSearchVideoItem, SearchFilters } from '@/types';

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
  regionCode: 'any',
  relevanceLanguage: 'any',
  videoDuration: 'any',
  excludedRegions: [],
  excludeLive: false,
  withPaidPromotion: false,
};

const YouTubeSearchContext = createContext<YouTubeSearchContextValue | null>(null);

export const YouTubeSearchProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [data, setData] = useState<ExtendedYouTubeSearchVideoItem[] | null>(null);
  const [filters, setFilters] = useState<SearchFilters>(FILTERS_INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);

  const executeSearch = useCallback(
    async (pageToken?: string) => {
      setLoading(true);
      setError(null);

      try {
        const { keyword, withPaidPromotion, excludeLive, ...resFilters } = filters;
        const omittedFilters = Object.entries(resFilters).reduce((acc, [key, value]) => {
          if (!value || (typeof value === 'string' && value === 'any')) {
            return acc;
          }

          return { ...acc, [key]: value };
        }, {});
        const searchData = await youtubeSearchService.searchVideos({
          part: 'snippet',
          type: 'video',
          maxResults: '50',
          q: keyword,
          ...omittedFilters,
          ...(pageToken && { pageToken }),
          ...(withPaidPromotion && { videoPaidProductPlacement: 'true' }),
          ...(excludeLive && { eventType: 'completed' }),
        });

        return {
          items: searchData.items,
          nextPageToken: searchData.nextPageToken ?? null,
        };
      } catch (err: unknown) {
        setError((err as Error)?.message || 'An unexpected error occurred');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [filters],
  );

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

  const onChangeFilter = useCallback(
    <K extends keyof SearchFilters>(name: K, value: SearchFilters[K]) => {
      setFilters((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    [],
  );

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
    onLoadMore: nextPageToken ? onLoadMore : undefined,
  };

  return <YouTubeSearchContext.Provider value={value}>{children}</YouTubeSearchContext.Provider>;
};

export const useYouTubeSearch = (): YouTubeSearchContextValue => {
  const context = useContext(YouTubeSearchContext);

  if (!context) {
    throw new Error('useYouTubeSearch must be used within a YouTubeSearchProvider');
  }

  return context;
};
