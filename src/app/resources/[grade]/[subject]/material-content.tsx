'use client';

import type { MaterialContent, VideoResource } from '@/types';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { VideoCard } from '@/components/cards/video-card';
import { DocumentRow } from '@/components/lists/document-row';
import { VideoPlayerModal } from '@/components/modals/video-player-modal';
import { Film, FileText, LayoutGrid, List } from 'lucide-react';

interface MaterialContentClientProps {
  content: MaterialContent;
}

type ActiveTab = 'videos' | 'docs';

export function MaterialContentClient({ content }: MaterialContentClientProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('videos');
  const [selectedVideo, setSelectedVideo] = useState<VideoResource | null>(null);
  const [videoViewMode, setVideoViewMode] = useState<'grid' | 'list'>('grid'); // Not implemented, placeholder

  const handlePlayVideo = (video: VideoResource) => {
    setSelectedVideo(video);
  };

  const handleCloseModal = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-64 shrink-0">
        <nav className="space-y-2 sticky top-20">
          <Button
            variant={activeTab === 'videos' ? 'secondary' : 'ghost'}
            className="w-full justify-start text-lg py-3 h-auto"
            onClick={() => setActiveTab('videos')}
          >
            <Film className="mr-3 h-5 w-5" />
            Videos
          </Button>
          <Button
            variant={activeTab === 'docs' ? 'secondary' : 'ghost'}
            className="w-full justify-start text-lg py-3 h-auto"
            onClick={() => setActiveTab('docs')}
          >
            <FileText className="mr-3 h-5 w-5" />
            Documents
          </Button>
        </nav>
      </aside>

      <section className="flex-1 min-w-0">
        {activeTab === 'videos' && (
          <div>
            <h2 className="font-headline text-3xl text-primary mb-6">Lecture Videos</h2>
            {content.videos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {content.videos.map((video) => (
                  <VideoCard key={video.id} video={video} onPlay={() => handlePlayVideo(video)} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No videos available for this section yet.</p>
            )}
          </div>
        )}

        {activeTab === 'docs' && (
          <div>
            <h2 className="font-headline text-3xl text-primary mb-6">Documents & Notes</h2>
            {content.documents.length > 0 ? (
              <div className="space-y-3">
                {content.documents.map((doc) => (
                  <DocumentRow key={doc.id} document={doc} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No documents available for this section yet.</p>
            )}
          </div>
        )}
      </section>

      <VideoPlayerModal video={selectedVideo} isOpen={!!selectedVideo} onClose={handleCloseModal} />
    </div>
  );
}
