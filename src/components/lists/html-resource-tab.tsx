'use client';

import { useMemo, useState } from 'react';
import type { HtmlResource } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarDays, ExternalLink, Search, type LucideIcon } from 'lucide-react';
import { format } from 'date-fns';
import { track, ANALYTICS_EVENTS, type ResourceContext } from '@/lib/analytics';

type SortOption = 'name-asc' | 'name-desc' | 'date-desc' | 'date-asc';

interface HtmlResourceTabProps {
  heading: string;
  resources: HtmlResource[];
  icon: LucideIcon;
  searchPlaceholder: string;
  emptyMessage: string;
  itemNoun: string; // e.g. "interactive lessons", "quizzes"
  showPreview?: boolean; // Render social-preview thumbnails (quizzes)
  resourceType?: 'quiz' | 'interactive_lesson'; // Telemetry classification
  trackingContext?: ResourceContext;
}

export function HtmlResourceTab({
  heading,
  resources,
  icon: Icon,
  searchPlaceholder,
  emptyMessage,
  itemNoun,
  showPreview = false,
  resourceType,
  trackingContext,
}: HtmlResourceTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('name-asc');

  const handleOpen = (item: HtmlResource) => {
    if (!resourceType) return;
    const event =
      resourceType === 'quiz'
        ? ANALYTICS_EVENTS.QUIZ_OPEN
        : ANALYTICS_EVENTS.INTERACTIVE_LESSON_OPEN;
    track(event, {
      resource_id: item.id,
      resource_title: item.title,
      ...trackingContext,
    });
  };

  const filteredAndSorted = useMemo(() => {
    const filtered = resources.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      switch (sortOption) {
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
  }, [resources, searchTerm, sortOption]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="font-headline text-3xl text-primary">{heading}</h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
          <Select value={sortOption} onValueChange={(value: SortOption) => setSortOption(value)}>
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

      {filteredAndSorted.length > 0 ? (
        <>
          <div className="text-sm text-muted-foreground mb-4">
            Showing {filteredAndSorted.length} of {resources.length} {itemNoun}
            {searchTerm && <span> for "{searchTerm}"</span>}
          </div>
          <div className="space-y-3">
            {filteredAndSorted.map((item) =>
              showPreview ? (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${item.title}`}
                  onClick={() => handleOpen(item)}
                  className="group relative flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg border bg-card hover:bg-secondary/50 hover:border-primary/40 hover:shadow-sm transition-all duration-200"
                >
                  <div className="w-full sm:w-64 md:w-72 lg:w-80 shrink-0 aspect-[1200/630] rounded-md overflow-hidden">
                    {item.previewImageUrl ? (
                      <img
                        src={item.previewImageUrl}
                        alt={`Preview of ${item.title}`}
                        loading="lazy"
                        className="h-full w-full object-cover border rounded-md"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center rounded-md border border-dashed border-primary/30 bg-primary/5 group-hover:bg-primary/10 transition-colors">
                        <Icon className="h-10 w-10 text-primary/70" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1 sm:pr-6">
                    <h3 className="text-base sm:text-lg font-semibold text-foreground break-words group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                      <CalendarDays className="h-3 w-3 shrink-0" />
                      <span>Uploaded: {format(new Date(item.uploadDate), 'MMMM d, yyyy')}</span>
                    </div>
                  </div>
                  <ExternalLink className="absolute top-3 right-3 h-5 w-5 shrink-0 text-muted-foreground group-hover:text-accent transition-colors" />
                </a>
              ) : (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${item.title}`}
                  onClick={() => handleOpen(item)}
                  className="group flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-secondary/50 hover:border-primary/40 hover:shadow-sm transition-all duration-200"
                >
                  <Icon className="h-8 w-8 text-primary shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-md font-semibold text-foreground break-words group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <CalendarDays className="h-3 w-3 shrink-0" />
                      <span>Uploaded: {format(new Date(item.uploadDate), 'MMMM d, yyyy')}</span>
                    </div>
                  </div>
                  <ExternalLink className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-accent transition-colors" />
                </a>
              )
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          {searchTerm ? (
            <div>
              <p className="text-muted-foreground">No results found for "{searchTerm}"</p>
              <Button variant="link" onClick={() => setSearchTerm('')} className="mt-2">
                Clear search
              </Button>
            </div>
          ) : (
            <p className="text-muted-foreground">{emptyMessage}</p>
          )}
        </div>
      )}
    </div>
  );
}
