'use client';

import type { MaterialContent, VideoResource, DocumentResource } from '@/types';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VideoCard } from '@/components/cards/video-card';
import { DocumentRow } from '@/components/lists/document-row';
import { HtmlResourceTab } from '@/components/lists/html-resource-tab';
import { VideoPlayerModal } from '@/components/modals/video-player-modal';
import { Film, FileText, LayoutGrid, List, Search, Sparkles, ListChecks } from 'lucide-react';

interface MaterialContentClientProps {
  content: MaterialContent;
}

type ActiveTab = 'videos' | 'interactive' | 'quizzes' | 'docs';
type SortOption = 'name-asc' | 'name-desc' | 'date-desc' | 'date-asc';

export function MaterialContentClient({ content }: MaterialContentClientProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('videos');
  const [selectedVideo, setSelectedVideo] = useState<VideoResource | null>(null);
  const [videoViewMode, setVideoViewMode] = useState<'grid' | 'list'>('grid'); // Not implemented, placeholder
  
  // Separate search and sort state for videos and documents
  const [videoSearchTerm, setVideoSearchTerm] = useState('');
  const [videoSortOption, setVideoSortOption] = useState<SortOption>('name-asc');
  const [docSearchTerm, setDocSearchTerm] = useState('');
  const [docSortOption, setDocSortOption] = useState<SortOption>('date-desc');

  // Filter and sort videos based on search term and sort option
  const filteredAndSortedVideos = useMemo(() => {
    let filtered = content.videos.filter(video =>
      video.title.toLowerCase().includes(videoSearchTerm.toLowerCase())
    );

    // Sort the filtered videos
    filtered.sort((a, b) => {
      switch (videoSortOption) {
        case 'name-asc':
          return a.title.localeCompare(b.title);
        case 'name-desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [content.videos, videoSearchTerm, videoSortOption]);

  // Filter and sort documents based on search term and sort option
  const filteredAndSortedDocuments = useMemo(() => {
    let filtered = content.documents.filter(doc =>
      doc.title.toLowerCase().includes(docSearchTerm.toLowerCase())
    );

    // Sort the filtered documents
    filtered.sort((a, b) => {
      switch (docSortOption) {
        case 'name-asc':
          return a.title.localeCompare(b.title);
        case 'name-desc':
          return b.title.localeCompare(a.title);
        case 'date-desc':
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
        case 'date-asc':
          return new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [content.documents, docSearchTerm, docSortOption]);

  const handlePlayVideo = (video: VideoResource) => {
    setSelectedVideo(video);
  };

  const handleCloseModal = () => {
    setSelectedVideo(null);
  };

  const interactiveLessons = content.interactiveLessons ?? [];
  const quizzes = content.quizzes ?? [];

  return (
    <div className="w-full">
      {/* Horizontal Tabs (scrollable on narrow screens) */}
      <div className="border-b border-border mb-8 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <nav className="flex gap-4 sm:gap-8 min-w-max">
          {([
            { id: 'videos', label: 'Videos', icon: Film, count: content.videos.length },
            { id: 'interactive', label: 'Interactive Lessons', icon: Sparkles, count: interactiveLessons.length },
            { id: 'quizzes', label: 'Quizzes', icon: ListChecks, count: quizzes.length },
            { id: 'docs', label: 'Documents', icon: FileText, count: content.documents.length },
          ] as const).map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 py-3 px-1 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === id
                  ? 'border-primary text-primary font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {label}
              {count > 0 && (
                <span
                  className={`ml-1 inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full text-xs font-semibold ${
                    activeTab === id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-muted-foreground'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Section */}
      <div className="w-full">
        <div className={activeTab === 'videos' ? '' : 'hidden'}>
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="font-headline text-3xl text-primary">Lecture Videos</h2>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search videos..."
                    value={videoSearchTerm}
                    onChange={(e) => setVideoSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                <Select value={videoSortOption} onValueChange={(value: SortOption) => setVideoSortOption(value)}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                    <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {filteredAndSortedVideos.length > 0 ? (
              <>
                <div className="text-sm text-muted-foreground mb-4">
                  Showing {filteredAndSortedVideos.length} of {content.videos.length} videos
                  {videoSearchTerm && (
                    <span> for "{videoSearchTerm}"</span>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAndSortedVideos.map((video) => (
                    <VideoCard key={video.id} video={video} onPlay={() => handlePlayVideo(video)} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                {videoSearchTerm ? (
                  <div>
                    <p className="text-muted-foreground">No videos found for "{videoSearchTerm}"</p>
                    <Button 
                      variant="link" 
                      onClick={() => setVideoSearchTerm('')}
                      className="mt-2"
                    >
                      Clear search
                    </Button>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No videos available for this section yet.</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className={activeTab === 'interactive' ? '' : 'hidden'}>
          <HtmlResourceTab
            heading="Interactive Lessons"
            resources={interactiveLessons}
            icon={Sparkles}
            searchPlaceholder="Search interactive lessons..."
            emptyMessage="No interactive lessons available for this section yet."
            itemNoun="interactive lessons"
          />
        </div>

        <div className={activeTab === 'quizzes' ? '' : 'hidden'}>
          <HtmlResourceTab
            heading="Quizzes"
            resources={quizzes}
            icon={ListChecks}
            searchPlaceholder="Search quizzes..."
            emptyMessage="No quizzes available for this section yet."
            itemNoun="quizzes"
            showPreview
          />
        </div>

        <div className={activeTab === 'docs' ? '' : 'hidden'}>
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="font-headline text-3xl text-primary">Documents & Notes</h2>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search documents..."
                    value={docSearchTerm}
                    onChange={(e) => setDocSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                <Select value={docSortOption} onValueChange={(value: SortOption) => setDocSortOption(value)}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                    <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                    <SelectItem value="date-desc">Newest First</SelectItem>
                    <SelectItem value="date-asc">Oldest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {filteredAndSortedDocuments.length > 0 ? (
              <>
                <div className="text-sm text-muted-foreground mb-4">
                  Showing {filteredAndSortedDocuments.length} of {content.documents.length} documents
                  {docSearchTerm && (
                    <span> for "{docSearchTerm}"</span>
                  )}
                </div>
                <div className="space-y-3">
                  {filteredAndSortedDocuments.map((doc) => (
                    <DocumentRow key={doc.id} document={doc} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                {docSearchTerm ? (
                  <div>
                    <p className="text-muted-foreground">No documents found for "{docSearchTerm}"</p>
                    <Button 
                      variant="link" 
                      onClick={() => setDocSearchTerm('')}
                      className="mt-2"
                    >
                      Clear search
                    </Button>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No documents available for this section yet.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <VideoPlayerModal video={selectedVideo} isOpen={!!selectedVideo} onClose={handleCloseModal} />
    </div>
  );
}
