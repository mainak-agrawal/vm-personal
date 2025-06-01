'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import type { VideoResource } from '@/types';

interface VideoPlayerModalProps {
  video: VideoResource | null;
  isOpen: boolean;
  onClose: () => void;
}

export function VideoPlayerModal({ video, isOpen, onClose }: VideoPlayerModalProps) {
  if (!video) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] p-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="font-headline text-2xl text-primary">{video.title}</DialogTitle>
          {video.description && <DialogDescription className="text-muted-foreground">{video.description}</DialogDescription>}
        </DialogHeader>
        <div className="aspect-video p-4">
          <iframe
            width="100%"
            height="100%"
            src={video.embedUrl}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="rounded-md"
          ></iframe>
        </div>
      </DialogContent>
    </Dialog>
  );
}
