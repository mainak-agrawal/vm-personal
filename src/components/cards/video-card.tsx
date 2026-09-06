import Image from 'next/image';
import type { VideoResource } from '@/types';
import { PlayCircle } from 'lucide-react';

interface VideoCardProps {
  video: VideoResource;
  onPlay: () => void;
}

export function VideoCard({ video, onPlay }: VideoCardProps) {
  return (
    <div
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-border/50 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/[0.06]"
      onClick={onPlay}
    >
      <div className="relative overflow-hidden">
        <Image
          src={video.thumbnailUrl}
          alt={video.title}
          width={320}
          height={180}
          className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
          data-ai-hint="lecture thumbnail"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-background/90 shadow-lg backdrop-blur-sm">
            <PlayCircle className="h-8 w-8 text-primary" />
          </span>
        </div>
      </div>
      <div className="flex flex-grow flex-col p-5">
        <h3 className="font-headline text-lg font-medium tracking-tight text-foreground transition-colors group-hover:text-primary">
          {video.title}
        </h3>
        {video.description && (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{video.description}</p>
        )}
        {video.duration && (
          <span className="mt-3 text-xs text-muted-foreground">{video.duration}</span>
        )}
      </div>
    </div>
  );
}
