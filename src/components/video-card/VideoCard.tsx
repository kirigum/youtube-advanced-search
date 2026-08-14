import { Eye, Play, Users } from 'lucide-react';
import { FC, HTMLAttributes } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

import { ExtendedYouTubeSearchVideoItem } from '@/types';
import { formatToCompactNumber, parseISO8601Duration } from '@/utils';

import { getFlagEmoji } from './utils';

interface VideoCardProps extends HTMLAttributes<HTMLDivElement> {
  video: ExtendedYouTubeSearchVideoItem;
}

export const VideoCard: FC<VideoCardProps> = ({ video, ...resProps }) => {
  const videoUrl = `https://www.youtube.com/watch?v=${video.id.videoId}`;
  const thumbnailUrl =
    video.snippet.thumbnails?.high?.url ||
    video.snippet.thumbnails?.medium?.url ||
    video.snippet.thumbnails?.default?.url;

  const duration = video.contentDetails?.duration
    ? parseISO8601Duration(video.contentDetails.duration)
    : null;

  return (
    <Card
      className="flex flex-col overflow-hidden group transition-all hover:shadow-md border-border/50"
      {...resProps}
    >
      <a
        href={videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative overflow-hidden"
      >
        <img
          src={thumbnailUrl}
          alt={video.snippet.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {duration && (
          <Badge
            variant="secondary"
            className="absolute bottom-2 right-2 bg-black/80 hover:bg-black/80 text-white border-none rounded-sm px-1.5 py-0.5 text-xs font-medium backdrop-blur-sm pointer-events-none"
          >
            {`${duration.hours}:${duration.minutes}:${duration.seconds}`}
          </Badge>
        )}

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
          <Play
            className="w-12 h-12 text-white opacity-0 group-hover:opacity-90 drop-shadow-md transition-opacity"
            fill="currentColor"
          />
        </div>
      </a>

      <CardContent className="p-4 flex flex-col flex-grow">
        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline decoration-primary transition-colors"
        >
          <h3 className="font-semibold text-foreground line-clamp-2 mb-2">{video.snippet.title}</h3>
        </a>

        {video.channel && (
          <p className="text-sm text-muted-foreground font-medium mb-4 flex items-center gap-1.5">
            {video.channel.snippet.title}
            {video.channel.snippet.country && (
              <span title={`Channel Region: ${video.channel.snippet.country}`}>
                {getFlagEmoji(video.channel.snippet.country)}
              </span>
            )}
          </p>
        )}

        <div className="flex justify-between items-center text-xs text-muted-foreground border-t pt-4 mt-auto">
          {video.statistics?.viewCount && (
            <div className="flex items-center gap-1.5" title="Views">
              <Eye className="w-4 h-4" />
              <span>{formatToCompactNumber(Number(video.statistics.viewCount))}</span>
            </div>
          )}

          {video.channel?.statistics?.subscriberCount && (
            <div className="flex items-center gap-1.5" title="Subscribers">
              <Users className="w-4 h-4" />
              <span>{formatToCompactNumber(Number(video.channel.statistics.subscriberCount))}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="px-4 pb-4 pt-0 mt-auto">
        <Button asChild className="w-full bg-red-600 hover:bg-red-700 text-white shadow-sm">
          <a href={videoUrl} target="_blank" rel="noopener noreferrer">
            Watch on YouTube
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};
