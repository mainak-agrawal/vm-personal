import { getTopicsForGradeSubject } from '@/lib/data';
import type { TopicCategory } from '@/types';
import { TopicsListClient } from './topics-list';
import type { Metadata } from 'next';

// Import static params for build-time generation
let staticParams: { gradeParams: Array<{ grade: string }> } | null = null;

function loadStaticParams() {
  if (staticParams) return staticParams;
  
  try {
    staticParams = require('@/lib/static-params.json');
    return staticParams!;
  } catch (error) {
    console.warn('Static params not found, using empty array');
    return { gradeParams: [] };
  }
}

// Generate static params for all grade routes
export async function generateStaticParams() {
  const params = loadStaticParams();
  console.log('[BUILD] Generating static params for grades:', params.gradeParams.length);
  return params.gradeParams;
}

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
