import { FC } from 'react';

import { ExtendedYouTubeSearchVideoItem } from '@/types';
import { formatToCompactNumber, parseISO8601Duration } from '@/utils';

import { getFlagEmoji } from './utils';

export const VideoCard: FC<{
  video: ExtendedYouTubeSearchVideoItem;
}> = ({ video, ...resProps }) => {
  const videoUrl = `https://www.youtube.com/watch?v=${video.id.videoId}`;
  const thumbnailUrl =
    video.snippet.thumbnails?.high?.url ||
    video.snippet.thumbnails?.medium?.url ||
    video.snippet.thumbnails?.default?.url;
  const duration = video.contentDetails?.duration
    ? parseISO8601Duration(video.contentDetails.duration)
    : null;

  return (
    <div
      className="flex flex-col bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
      {...resProps}
    >
      <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="block relative group">
        <img src={thumbnailUrl} alt={video.snippet.title} className="w-full h-48 object-cover" />

        {duration && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs font-medium px-1.5 py-0.5 rounded">
            {`${duration.hours}:${duration.minutes}:${duration.seconds}`}
          </div>
        )}

        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
          <svg
            className="w-12 h-12 text-white opacity-0 group-hover:opacity-90 drop-shadow-md transition-opacity"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
          </svg>
        </div>
      </a>

      <div className="p-4 flex flex-col flex-grow">
        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-600 transition-colors"
        >
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">{video.snippet.title}</h3>
        </a>

        {video.channel && (
          <p className="text-sm text-gray-600 font-medium mb-3 flex items-center gap-1">
            {video.channel.snippet.title}

            {video.channel.snippet.country && (
              <span title={`Channel Region: ${video.channel.snippet.country}`}>
                {getFlagEmoji(video.channel.snippet.country)}
              </span>
            )}
          </p>
        )}

        <div className="flex justify-between text-xs text-gray-500 border-t pt-3 mt-auto mb-4">
          {video.statistics?.viewCount && (
            <span>👀 {formatToCompactNumber(Number(video.statistics.viewCount))} views</span>
          )}

          {video.channel?.statistics?.subscriberCount && (
            <span>
              👥 {formatToCompactNumber(Number(video.channel.statistics.subscriberCount))} subs
            </span>
          )}
        </div>
        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full block text-center bg-red-600 text-white font-medium py-2 rounded-md hover:bg-red-700 transition-colors mt-auto"
        >
          Watch on YouTube
        </a>
      </div>
    </div>
  );
};
