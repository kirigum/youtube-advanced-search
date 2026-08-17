import { Eye, Play, Users } from 'lucide-react';
import { FC, HTMLAttributes } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ExtendedYouTubeSearchVideoItem } from '@/types';
import { formatToCompactNumber } from '@/utils';

import { formatDuration, getFlagEmoji } from './utils';

interface VideoCardProps extends HTMLAttributes<HTMLDivElement> {
  video: ExtendedYouTubeSearchVideoItem;
}

export const VideoCard: FC<VideoCardProps> = ({ video, className, ...resProps }) => {
  const videoUrl = `https://www.youtube.com/watch?v=${video.id.videoId}`;
  const thumbnailUrl =
    video.snippet.thumbnails?.high?.url ||
    video.snippet.thumbnails?.medium?.url ||
    video.snippet.thumbnails?.default?.url;

  return (
    <Card
      className={cn(
        'flex flex-col overflow-hidden group rounded-2xl border-border/60 bg-background/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 hover:border-border/80',
        className,
      )}
      {...resProps}
    >
      <a
        href={videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative overflow-hidden aspect-video"
      >
        <img
          src={thumbnailUrl}
          alt={video.snippet.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

        {video.contentDetails?.duration && (
          <Badge
            variant="secondary"
            className="absolute bottom-2.5 right-2.5 bg-black/70 hover:bg-black/70 text-white border-none rounded px-2 py-0.5 text-xs font-semibold backdrop-blur-md pointer-events-none shadow-sm tracking-wide"
          >
            {formatDuration(video.contentDetails.duration)}
          </Badge>
        )}

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300 drop-shadow-lg">
            <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
          </div>
        </div>
      </a>

      <CardContent className="p-5 flex flex-col flex-grow">
        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group/title mb-3 block"
        >
          <h3 className="font-semibold text-foreground leading-tight line-clamp-2 transition-colors group-hover/title:text-blue-600 dark:group-hover/title:text-blue-400">
            {video.snippet.title}
          </h3>
        </a>

        {video.channel && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary/50 text-secondary-foreground text-xs font-medium w-fit mb-4 transition-colors hover:bg-secondary">
            <span className="truncate max-w-[150px]">{video.channel.snippet.title}</span>

            {video.channel.snippet.country && (
              <span title={`Channel Region: ${video.channel.snippet.country}`} className="ml-0.5">
                {getFlagEmoji(video.channel.snippet.country)}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-auto bg-muted/40 rounded-xl p-3 border border-border/30">
          {video.statistics?.viewCount ? (
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5">
                Views
              </span>
              <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                <Eye className="w-3.5 h-3.5 text-blue-500" />
                {formatToCompactNumber(Number(video.statistics.viewCount))}
              </div>
            </div>
          ) : null}

          {video.statistics?.viewCount && video.channel?.statistics?.subscriberCount && (
            <div className="w-px h-8 bg-border/50" />
          )}

          {video.channel?.statistics?.subscriberCount ? (
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5">
                Subs
              </span>
              <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                <Users className="w-3.5 h-3.5 text-green-500" />
                {formatToCompactNumber(Number(video.channel.statistics.subscriberCount))}
              </div>
            </div>
          ) : null}
        </div>
      </CardContent>

      <CardFooter className="px-5 pb-5 pt-0 mt-auto">
        <Button
          asChild
          variant="default"
          className="w-full rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-sm transition-all group-hover:shadow-md font-medium"
        >
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            Watch on YouTube
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};
