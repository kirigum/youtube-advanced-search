import { AlertCircle, Loader2, PlaySquare } from 'lucide-react';
import { FC } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { VideoList } from '@/components/video-list/VideoList';
import { useYouTubeSearch } from '@/context/youtube-search-context';

import { SearchForm } from './SearchForm';

export const SearchWidget: FC = () => {
  const { data, loading, error, onLoadMore } = useYouTubeSearch();

  const noResultsFound = !loading && data && data.length === 0 && !onLoadMore;

  return (
    <section className="max-w-7xl mx-auto p-4 md:p-6 bg-background min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          YouTube Advanced Search
        </h1>
        <p className="text-muted-foreground mt-2">
          Filter and analyze YouTube content with pinpoint accuracy.
        </p>
      </div>

      <SearchForm />

      {error && (
        <Alert variant="destructive" className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Search Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && !data && (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground animate-pulse">
          <Loader2 className="h-10 w-10 animate-spin mb-4 opacity-50" />
          <p className="font-medium">Scanning YouTube...</p>
        </div>
      )}

      {data && data.length > 0 ? <VideoList videos={data} /> : null}

      {noResultsFound && (
        <div className="text-center py-20 bg-muted/30 rounded-lg border border-dashed mb-8">
          <PlaySquare className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-foreground">No matching videos found</h3>
          <p className="text-muted-foreground mt-1">
            No results match your exact criteria. Try adjusting your keyword or filters.
          </p>
        </div>
      )}

      {onLoadMore && (
        <div className="flex justify-center mt-10 mb-8">
          <Button
            onClick={onLoadMore}
            variant="outline"
            size="lg"
            disabled={loading}
            className="px-10 shadow-sm"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </section>
  );
};
