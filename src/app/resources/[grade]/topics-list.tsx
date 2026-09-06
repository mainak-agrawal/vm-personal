'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ChevronRight } from 'lucide-react';
import type { TopicCategory } from '@/types';

interface TopicsListClientProps {
  topics: TopicCategory[];
  grade: string;
}

export function TopicsListClient({ topics, grade }: TopicsListClientProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter topics based on search term
  const filteredTopics = useMemo(() => {
    return topics.filter(topic =>
      topic.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [topics, searchTerm]);

  return (
    <>
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-13 w-full rounded-full border border-border/60 bg-card/70 py-3.5 pl-12 pr-4 text-base text-foreground shadow-sm outline-none backdrop-blur-sm transition-all placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
          />
        </div>
        {searchTerm && (
          <p className="mt-3 pl-2 text-sm text-muted-foreground">
            Showing {filteredTopics.length} of {topics.length} topics
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        )}
      </div>

      {/* Topics List */}
      {filteredTopics.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filteredTopics.map((topic, index) => {
            const tile = (index % 6) + 1;
            return (
              <Link
                key={topic.slug}
                href={`/resources/${grade}/${topic.slug}`}
                className="group block focus:outline-none"
                style={{
                  ['--tile' as string]: `var(--tile-${tile})`,
                  ['--ink' as string]: `var(--tile-${tile}-ink)`,
                }}
              >
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-border/50 bg-[hsl(var(--tile))] p-5 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-lg group-hover:shadow-black/[0.05] group-focus-visible:ring-2 group-focus-visible:ring-[hsl(var(--ink))] group-active:translate-y-0">
                  <h3 className="font-headline text-lg font-medium tracking-tight text-foreground">
                    {topic.name}
                  </h3>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background/60 text-[hsl(var(--ink))] transition-all duration-300 group-hover:bg-[hsl(var(--ink))] group-hover:text-background">
                    <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="py-12 text-center">
          {searchTerm ? (
            <div>
              <p className="text-muted-foreground">No topics found for "{searchTerm}"</p>
              <button
                onClick={() => setSearchTerm('')}
                className="mt-2 font-medium text-primary hover:underline"
              >
                Clear search
              </button>
            </div>
          ) : (
            <p className="text-muted-foreground">No topics available at the moment.</p>
          )}
        </div>
      )}
    </>
  );
}
