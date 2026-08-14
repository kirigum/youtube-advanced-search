import { FC } from 'react';

import { VideoList } from '@/components/video-list/VideoList';
import { useYouTubeSearch } from '@/context/youtube-search-context';

import { SearchForm } from './SearchForm';

export const SearchWidget: FC = () => {
  const { data, loading, error, onLoadMore } = useYouTubeSearch();

  return (
    <section className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">YouTube Advanced Search</h1>

      <SearchForm />

      {error && <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-md">{error}</div>}

      {data && data.length > 0 ? <VideoList searchResults={data} /> : null}

      {!loading && data && data.length === 0 && !onLoadMore && (
        <div className="text-center py-12 text-gray-500">
          No results match your exact criteria. Try adjusting your keyword or filters.
        </div>
      )}

      {onLoadMore && (
        <div className="flex justify-center items-center space-x-4 mt-8 pb-8">
          <button
            disabled={loading}
            onClick={onLoadMore}
            className="px-6 py-2 bg-white border border-gray-300 text-gray-800 rounded-md disabled:opacity-50 hover:bg-gray-50 transition-colors font-medium shadow-sm"
          >
            Load More
          </button>
        </div>
      )}
    </section>
  );
};
