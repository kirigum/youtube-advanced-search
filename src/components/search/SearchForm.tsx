import { FC } from 'react';

import { useYouTubeSearch } from '@/context/youtube-search-context';
import { SearchFilters } from '@/types';

export const SearchForm: FC = () => {
  const { loading, filters, onSearch, onChangeFilter } = useYouTubeSearch();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target;

    if (type === 'checkbox') {
      const checked = (event.target as HTMLInputElement).checked;

      if (name === 'excludedRegions') {
        onChangeFilter(
          name as keyof SearchFilters,
          checked
            ? [...filters.excludedRegions, value]
            : filters.excludedRegions.filter((item) => item !== value),
        );
      } else {
        onChangeFilter(name as keyof SearchFilters, checked);
      }

      return;
    }

    onChangeFilter(name as keyof SearchFilters, value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    onSearch();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      <div className="col-span-1 md:col-span-2 lg:col-span-4 mt-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Keyword</label>
        <input
          type="text"
          name="keyword"
          value={filters.keyword}
          onChange={handleInputChange}
          placeholder="e.g., React tutorial"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />

        <p className="text-xs text-gray-500 mt-1">
          Your request can also use the Boolean NOT (-) and OR (|) operators to exclude videos or to
          find videos that are associated with one of several search terms.
        </p>

        <p className="text-xs text-gray-500 mt-1">
          For example, "boating|sailing -fishing" will return videos that contain either "boating"
          or "sailing" but not "fishing".
        </p>

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
          <span className="text-sm font-medium text-gray-700 select-none">With paid promotion</span>
        </label>
      </div>

      <div className="mt-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Views (Min - Max)</label>
        <div className="flex space-x-2">
          <input
            type="number"
            name="minViews"
            value={filters.minViews || ''}
            onChange={handleInputChange}
            placeholder="Min"
            className="w-1/2 p-2 border border-gray-300 rounded-md"
          />
          <input
            type="number"
            name="maxViews"
            value={filters.maxViews || ''}
            onChange={handleInputChange}
            placeholder="Max"
            className="w-1/2 p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div className="mt-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Subscribers (Min - Max)
        </label>
        <div className="flex space-x-2">
          <input
            type="number"
            name="minSubs"
            value={filters.minSubs || ''}
            onChange={handleInputChange}
            placeholder="Min"
            className="w-1/2 p-2 border border-gray-300 rounded-md"
          />
          <input
            type="number"
            name="maxSubs"
            value={filters.maxSubs || ''}
            onChange={handleInputChange}
            placeholder="Max"
            className="w-1/2 p-2 border border-gray-300 rounded-md"
          />
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
          <option value="any">Any</option>
          <option value="short">Short (&lt; 4 mins)</option>
          <option value="medium">Medium (4-20 mins)</option>
          <option value="long">Long (&gt; 20 mins)</option>
        </select>
      </div>

      <div className="mt-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Publication Date</label>
        <select
          name="dateFilter"
          value={filters.dateFilter}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="any">Any</option>
          <option value="Today">Today</option>
          <option value="This Week">This Week</option>
          <option value="This Month">This Month</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
        <select
          name="order"
          value={filters.order}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="relevance">Relevance</option>
          <option value="date">Upload Date</option>
          <option value="viewCount">View Count</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      <div className="flex space-x-2">
        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
          <select
            name="regionCode"
            value={filters.regionCode}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="any">Any</option>
            <option value="US">US</option>
            <option value="GB">UK</option>
            <option value="CA">Canada</option>
            <option value="AU">Australia</option>
          </select>
        </div>
        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
          <select
            name="relevanceLanguage"
            value={filters.relevanceLanguage}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="any">Any</option>
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
            <label
              key={country.code}
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors"
            >
              <input
                type="checkbox"
                name="excludedRegions"
                value={country.code}
                checked={filters.excludedRegions.includes(country.code)}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-sm text-gray-700 select-none">{country.name}</span>
            </label>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Note: This only works if the creator has publicly set their channel location on YouTube.
        </p>
      </div>

      <div className="col-span-1 md:col-span-2 lg:col-span-4 flex justify-end mt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </form>
  );
};
