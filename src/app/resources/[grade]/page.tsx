import { getTopicsForGradeSubject } from '@/lib/data';
import type { TopicCategory } from '@/types';
import { TopicsListClient } from './topics-list';
import type { Metadata } from 'next';

interface TopicsPageProps {
  params: {
    grade: string;
  };
}

export async function generateMetadata(
  { params }: TopicsPageProps
): Promise<Metadata> {
  const { grade } = await params;
  const gradeDisplay = grade.replace('class-', 'Class ').replace('-', ' ');
  return {
    title: `${gradeDisplay} Topics`,
  };
}

export default async function TopicsPage({ params }: TopicsPageProps) {
  const { grade } = await params;
  const topics: TopicCategory[] = await getTopicsForGradeSubject(grade);
  
  const gradeDisplay = grade.replace('class-', 'Class ').replace('-', ' ');

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">
          {gradeDisplay} Topics
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Select a topic to access study materials, videos, and documents.
        </p>
      </header>
      
      <TopicsListClient topics={topics} grade={grade} />
    </div>
  );
}
