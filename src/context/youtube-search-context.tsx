import React, { PropsWithChildren, createContext, useCallback, useContext, useState } from 'react';

import youtubeSearchService from '@/services/youtube-search';
import { ExtendedYouTubeSearchVideoItem, YouTubeSearchVideoOptions } from '@/types';

interface YouTubeSearchContextValue {
  data: ExtendedYouTubeSearchVideoItem[] | null;
  loading: boolean;
  error: string | null;
  searchOptions: YouTubeSearchVideoOptions;
  onSearch: () => Promise<void>;
  onChangeFilter: <K extends keyof YouTubeSearchVideoOptions>(
    name: K,
    value: YouTubeSearchVideoOptions[K],
  ) => void;
  onLoadMore?: () => Promise<void>;
}

const FILTERS_INITIAL_STATE: YouTubeSearchVideoOptions = {
  q: '',
  order: 'relevance',
  regionCode: 'any',
  relevanceLanguage: 'any',
  videoDuration: 'any',
  excludedRegions: [],
};

const YouTubeSearchContext = createContext<YouTubeSearchContextValue | null>(null);

export const YouTubeSearchProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [data, setData] = useState<ExtendedYouTubeSearchVideoItem[] | null>(null);
  const [searchOptions, setSearchOptions] = useState<YouTubeSearchVideoOptions>(FILTERS_INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);

  const executeSearch = useCallback(
    async (pageToken?: string) => {
      setLoading(true);
      setError(null);

      try {
        const searchData = await youtubeSearchService.searchVideos({
          ...searchOptions,
          ...(pageToken && { pageToken }),
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
    [searchOptions],
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
    <K extends keyof YouTubeSearchVideoOptions>(name: K, value: YouTubeSearchVideoOptions[K]) => {
      setSearchOptions((prev) => ({
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
    searchOptions,
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
