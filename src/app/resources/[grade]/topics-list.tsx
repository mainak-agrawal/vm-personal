'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
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
      <div className="mb-8 max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        {searchTerm && (
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Showing {filteredTopics.length} of {topics.length} topics
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        )}
      </div>

      {/* Topics List */}
      {filteredTopics.length > 0 ? (
        <div className="space-y-3 max-w-4xl mx-auto">
          {filteredTopics.map((topic) => (
            <Link
              key={topic.slug}
              href={`/resources/${grade}/${topic.slug}`}
              className="block"
            >
              <div className="flex items-center justify-between p-4 bg-card hover:bg-primary/5 border border-border hover:border-primary/20 rounded-lg transition-all duration-200 cursor-pointer group active:scale-[0.99] active:translate-y-0.5">
                <h3 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                  {topic.name}
                </h3>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          {searchTerm ? (
            <div>
              <p className="text-muted-foreground">No topics found for "{searchTerm}"</p>
              <button 
                onClick={() => setSearchTerm('')}
                className="mt-2 text-primary hover:underline"
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
