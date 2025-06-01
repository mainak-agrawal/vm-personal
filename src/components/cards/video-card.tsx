import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { VideoResource } from '@/types';
import { PlayCircle } from 'lucide-react';

interface VideoCardProps {
  video: VideoResource;
  onPlay: () => void;
}

export function VideoCard({ video, onPlay }: VideoCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden group hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="relative p-0">
        <Image
          src={video.thumbnailUrl}
          alt={video.title}
          width={320}
          height={180}
          className="w-full h-auto aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
          data-ai-hint="lecture thumbnail"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <PlayCircle className="h-16 w-16 text-white/80" />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="font-headline text-lg text-primary mb-1">{video.title}</CardTitle>
        {video.description && <p className="text-sm text-muted-foreground line-clamp-2">{video.description}</p>}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="flex justify-between items-center w-full">
            {video.duration && <span className="text-xs text-muted-foreground">{video.duration}</span>}
            <Button variant="outline" size="sm" onClick={onPlay} className="border-primary text-primary hover:bg-primary/10">
                Watch Video
            </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
