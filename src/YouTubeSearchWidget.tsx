import React, { useState, useEffect } from 'react';
import { useYouTubeSearch } from './useYouTubeSearch';
import { SearchFilters, MergedVideo } from './types';

const FILTERS_INITIAL_STATE: SearchFilters = {
  keyword: '',
  dateFilter: 'Any',
  regionCode: 'Any',
  language: 'Any',
  videoDuration: 'Any',
  excludedRegions: [],
  excludeLive: false,
  withPaidPromotion: false,
};

export const YouTubeSearchWidget: React.FC = () => {
  const [searchResults, setSearchResults] = useState<MergedVideo[]>([]);
  const [filters, setFilters] = useState<SearchFilters>(FILTERS_INITIAL_STATE);
  const [activeFilters, setActiveFilters] = useState<SearchFilters | null>(null);

  const { data, loading, error, executeSearch, nextPageToken, fetchedCount } = useYouTubeSearch();


  useEffect(() => {
    setSearchResults((prev) => [...prev, ...data]);
  }, [data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

   // Handle Checkbox Arrays (for Exclude Regions)
    if (type === 'checkbox' && name === 'excludedRegions') {
      const checked = (e.target as HTMLInputElement).checked;
      
      setFilters((prev) => {
        const currentList = prev.excludedRegions;
        if (checked) {
          return { ...prev, excludedRegions: [...currentList, value] };
        } else {
          return { ...prev, excludedRegions: currentList.filter(item => item !== value) };
        }
      });

      return;
      }

    setFilters((prev) => ({
      ...prev,
      [name]: ['minViews', 'maxViews', 'minSubs', 'maxSubs'].includes(name) 
        ? (value ? Number(value) : undefined) 
        : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchResults([]);
    setActiveFilters(filters);
    executeSearch(filters); 
  };

  const handleLoadMore = () => {
    if (activeFilters && nextPageToken) executeSearch(activeFilters, nextPageToken);
  };

  const formatNumber = (num: number) => new Intl.NumberFormat('en-US', { notation: 'compact' }).format(num);

  // Format seconds into MM:SS or HH:MM:SS
  const formatDuration = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const getFlagEmoji = (countryCode?: string) => {
    if (!countryCode) return '';
    const codePoints = countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  return (
    <section className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">YouTube Advanced Search</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="col-span-1 md:col-span-2 lg:col-span-4 mt-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Keyword</label>
          <input type="text" name="keyword" value={filters.keyword} onChange={handleInputChange} placeholder="e.g., React tutorial" className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" required />

          <label className="flex items-center space-x-2 cursor-pointer mt-3 w-max">
            <input
              type="checkbox"
              name="excludeLive"
              checked={filters.excludeLive}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-sm font-medium text-gray-700 select-none">
              Exclude Live & Upcoming Streams
            </span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer mt-3 w-max">
            <input
              type="checkbox"
              name="withPaidPromotion"
              checked={filters.withPaidPromotion}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-sm font-medium text-gray-700 select-none">
              With paid promotion
            </span>
          </label>
        </div>

        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Views (Min - Max)</label>
          <div className="flex space-x-2">
            <input type="number" name="minViews" value={filters.minViews || ''} onChange={handleInputChange} placeholder="Min" className="w-1/2 p-2 border border-gray-300 rounded-md" />
            <input type="number" name="maxViews" value={filters.maxViews || ''} onChange={handleInputChange} placeholder="Max" className="w-1/2 p-2 border border-gray-300 rounded-md" />
          </div>
        </div>

        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Subscribers (Min - Max)</label>
          <div className="flex space-x-2">
            <input type="number" name="minSubs" value={filters.minSubs || ''} onChange={handleInputChange} placeholder="Min" className="w-1/2 p-2 border border-gray-300 rounded-md" />
            <input type="number" name="maxSubs" value={filters.maxSubs || ''} onChange={handleInputChange} placeholder="Max" className="w-1/2 p-2 border border-gray-300 rounded-md" />
          </div>
        </div>

        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
          <select 
            name="videoDuration" 
            value={filters.videoDuration} 
            onChange={handleInputChange} 
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="any">Any Length</option>
            <option value="short">Short (&lt; 4 mins)</option>
            <option value="medium">Medium (4-20 mins)</option>
            <option value="long">Long (&gt; 20 mins)</option>
          </select>
        </div>

        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Publication Date</label>
          <select name="dateFilter" value={filters.dateFilter} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md">
            <option value="Any">Any</option>
            <option value="Today">Today</option>
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
          </select>
        </div>

        <div className="flex space-x-2">
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
            <select name="regionCode" value={filters.regionCode} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md">
              <option value="Any">Any</option>
              <option value="US">US</option>
              <option value="GB">UK</option>
              <option value="CA">Canada</option>
              <option value="AU">Australia</option>
            </select>
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
            <select name="language" value={filters.language} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md">
              <option value="Any">Any</option>
              <option value="en">English</option>
              <option value="es">Spanish</option>
            </select>
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 lg:col-span-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Exclude Channel Regions
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 bg-white p-3 border border-gray-300 rounded-md">
            {[
              { code: 'RU', name: 'Russia' },
              { code: 'IN', name: 'India' },
              { code: 'CN', name: 'China' },
              { code: 'BR', name: 'Brazil' },
              { code: 'US', name: 'USA' },
              { code: 'GB', name: 'UK' },
            ].map((country) => (
              <label key={country.code} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors">
                <input
                  type="checkbox"
                  name="excludedRegions"
                  value={country.code}
                  checked={filters.excludedRegions.includes(country.code)}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-sm text-gray-700 select-none">
                  {getFlagEmoji(country.code)} {country.name}
                </span>
              </label>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Note: This only works if the creator has publicly set their channel location on YouTube.
          </p>
        </div>


        <div className="col-span-1 md:col-span-2 lg:col-span-4 flex justify-end mt-2">
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium">
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-md">{error}</div>}

      {searchResults.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map((video) => {
            const videoUrl = `https://www.youtube.com/watch?v=${video.videoId}`;
            
            return (
              <div key={video.videoId} className="flex flex-col bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="block relative group">
                  <img src={video.thumbnailUrl} alt={video.title} className="w-full h-48 object-cover" />

                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs font-medium px-1.5 py-0.5 rounded">
                    {formatDuration(video.durationInSeconds)}
                  </div>

                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                    <svg className="w-12 h-12 text-white opacity-0 group-hover:opacity-90 drop-shadow-md transition-opacity" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                    </svg>
                  </div>
                </a>

                <div className="p-4 flex flex-col flex-grow">
                  <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2" dangerouslySetInnerHTML={{ __html: video.title }} />
                  </a>

                  <p className="text-sm text-gray-600 font-medium mb-3 flex items-center gap-1">
                    {video.channelTitle}
                    {video.country && <span title={`Channel Region: ${video.country}`}>{getFlagEmoji(video.country)}</span>}
                  </p>

                  <div className="flex justify-between text-xs text-gray-500 border-t pt-3 mt-auto mb-4">
                    <span>👀 {formatNumber(video.viewCount)} views</span>
                    <span>👥 {formatNumber(video.subscriberCount)} subs</span>
                  </div>
                  <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="w-full block text-center bg-red-600 text-white font-medium py-2 rounded-md hover:bg-red-700 transition-colors mt-auto">
                    Watch on YouTube
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* True Empty State (No API results at all from the very beginning) */}
      {!loading && !error && searchResults.length === 0 && fetchedCount === 0 && activeFilters && (
        <div className="text-center py-12 text-gray-500">
          No results match your exact criteria. Try adjusting your keyword or filters.
        </div>
      )}

      {nextPageToken && (
        <div className="flex justify-center items-center space-x-4 mt-8 pb-8">
          <button
            disabled={loading}
            onClick={handleLoadMore}
            className="px-6 py-2 bg-white border border-gray-300 text-gray-800 rounded-md disabled:opacity-50 hover:bg-gray-50 transition-colors font-medium shadow-sm"
          >
            Load More
          </button>
        </div>
      )}
    </section>
  );
};