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
import { track, ANALYTICS_EVENTS, type ResourceContext } from '@/lib/analytics';

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

  const trackingContext: ResourceContext = {
    grade_subject: content.gradeSubject,
    topic: content.topic,
    material_title: content.title,
  };

  const handleTabChange = (id: ActiveTab) => {
    setActiveTab(id);
    track(ANALYTICS_EVENTS.RESOURCE_TAB_VIEW, { tab: id, ...trackingContext });
  };

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
    track(ANALYTICS_EVENTS.VIDEO_PLAY, {
      resource_id: video.id,
      resource_title: video.title,
      ...trackingContext,
    });
  };

  const handleCloseModal = () => {
    setSelectedVideo(null);
  };

  const interactiveLessons = content.interactiveLessons ?? [];
  const quizzes = content.quizzes ?? [];

  return (
    <div className="w-full">
      {/* Pill tab navigation (scrollable on narrow screens) */}
      <div className="mb-8 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <nav className="inline-flex min-w-max gap-1 rounded-full border border-border/60 bg-card/60 p-1.5 backdrop-blur-sm">
          {([
            { id: 'videos', label: 'Videos', icon: Film, count: content.videos.length },
            { id: 'interactive', label: 'Interactive Lessons', icon: Sparkles, count: interactiveLessons.length },
            { id: 'quizzes', label: 'Quizzes', icon: ListChecks, count: quizzes.length },
            { id: 'docs', label: 'Documents', icon: FileText, count: content.documents.length },
          ] as const).map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              onClick={() => handleTabChange(id)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                activeTab === id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
              {count > 0 && (
                <span
                  className={`ml-0.5 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-xs font-semibold ${
                    activeTab === id
                      ? 'bg-primary-foreground/20 text-primary-foreground'
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
              <h2 className="font-headline text-2xl font-semibold tracking-tight text-foreground">Lecture Videos</h2>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search videos..."
                    value={videoSearchTerm}
                    onChange={(e) => setVideoSearchTerm(e.target.value)}
                    className="pl-10 w-full rounded-full sm:w-64"
                  />
                </div>
                <Select value={videoSortOption} onValueChange={(value: SortOption) => setVideoSortOption(value)}>
                  <SelectTrigger className="w-full rounded-full sm:w-48">
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
            resourceType="interactive_lesson"
            trackingContext={trackingContext}
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
            resourceType="quiz"
            trackingContext={trackingContext}
          />
        </div>

        <div className={activeTab === 'docs' ? '' : 'hidden'}>
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="font-headline text-2xl font-semibold tracking-tight text-foreground">Documents &amp; Notes</h2>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search documents..."
                    value={docSearchTerm}
                    onChange={(e) => setDocSearchTerm(e.target.value)}
                    className="pl-10 w-full rounded-full sm:w-64"
                  />
                </div>
                <Select value={docSortOption} onValueChange={(value: SortOption) => setDocSortOption(value)}>
                  <SelectTrigger className="w-full rounded-full sm:w-48">
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
                    <DocumentRow key={doc.id} document={doc} trackingContext={trackingContext} />
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
