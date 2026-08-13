import { FC } from "react";

import { ExtendedYouTubeSearchVideoItem } from "../../types";
import { SearchResultCard } from "./SearchResultCard";

export const SearchResultList: FC<{ searchResults: ExtendedYouTubeSearchVideoItem[] }> = ({
  searchResults,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {searchResults.map((video) => (
        <SearchResultCard key={video.id.videoId} video={video} />
      ))}
    </div>
  );
};
