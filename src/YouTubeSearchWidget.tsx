import { FC } from "react";
import { useYouTubeSearch } from "./useYouTubeSearch";
import { SearchFilters } from "./types";
import { SearchResultList } from "./components/search-result";

export const YouTubeSearchWidget: FC = () => {
  const {
    data,
    loading,
    error,
    filters,
    onSearch,
    onChangeFilter,
    onLoadMore,
  } = useYouTubeSearch();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;

      if (name === "excludedRegions") {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <section className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        YouTube Advanced Search
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <div className="col-span-1 md:col-span-2 lg:col-span-4 mt-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Keyword
          </label>
          <input
            type="text"
            name="keyword"
            value={filters.keyword}
            onChange={handleInputChange}
            placeholder="e.g., React tutorial"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />

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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Views (Min - Max)
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              name="minViews"
              value={filters.minViews || ""}
              onChange={handleInputChange}
              placeholder="Min"
              className="w-1/2 p-2 border border-gray-300 rounded-md"
            />
            <input
              type="number"
              name="maxViews"
              value={filters.maxViews || ""}
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
              value={filters.minSubs || ""}
              onChange={handleInputChange}
              placeholder="Min"
              className="w-1/2 p-2 border border-gray-300 rounded-md"
            />
            <input
              type="number"
              name="maxSubs"
              value={filters.maxSubs || ""}
              onChange={handleInputChange}
              placeholder="Max"
              className="w-1/2 p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration
          </label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Publication Date
          </label>
          <select
            name="dateFilter"
            value={filters.dateFilter}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="Any">Any</option>
            <option value="Today">Today</option>
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sort Order
          </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Region
            </label>
            <select
              name="regionCode"
              value={filters.regionCode}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="Any">Any</option>
              <option value="US">US</option>
              <option value="GB">UK</option>
              <option value="CA">Canada</option>
              <option value="AU">Australia</option>
            </select>
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Language
            </label>
            <select
              name="language"
              value={filters.language}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
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
              { code: "RU", name: "Russia" },
              { code: "IN", name: "India" },
              { code: "CN", name: "China" },
              { code: "BR", name: "Brazil" },
              { code: "US", name: "USA" },
              { code: "GB", name: "UK" },
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
                <span className="text-sm text-gray-700 select-none">
                  {country.name}
                </span>
              </label>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Note: This only works if the creator has publicly set their channel
            location on YouTube.
          </p>
        </div>

        <div className="col-span-1 md:col-span-2 lg:col-span-4 flex justify-end mt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {error && (
        <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      {data && data.length > 0 ? <SearchResultList searchResults={data} /> : null}
      
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
