import { FC } from "react";

import { ExtendedYouTubeSearchVideoItem } from "@/types";
import { VideoCard } from "@/components/video-card/VideoCard";

export const VideoList: FC<{ searchResults: ExtendedYouTubeSearchVideoItem[] }> = ({
  searchResults,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {searchResults.map((video) => (
        <VideoCard key={video.id.videoId} video={video} />
      ))}
    </div>
  );
};
