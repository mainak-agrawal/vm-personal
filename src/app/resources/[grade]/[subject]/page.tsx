import { getMaterialContent } from '@/lib/data';
import { MaterialContentClient } from './material-content';
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';

// Import static params for build-time generation
let staticParams: { topicParams: Array<{ grade: string; subject: string }> } | null = null;

function loadStaticParams() {
  if (staticParams) return staticParams;
  
  try {
    staticParams = require('@/lib/static-params.json');
    return staticParams!;
  } catch (error) {
    console.warn('Static params not found, using empty array');
    return { topicParams: [] };
  }
}

// Generate static params for all grade/topic combinations
export async function generateStaticParams() {
  const params = loadStaticParams();
  console.log('[BUILD] Generating static params for topics:', params.topicParams.length);
  return params.topicParams;
}

interface MaterialPageProps {
  params: {
    grade: string;
    subject: string; // This is actually the topic now
  };
}

export async function generateMetadata(
  { params }: MaterialPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { grade, subject: topic } = await params;
  const content = await getMaterialContent(grade, topic);
  const title = content ? `${content.title} Resources` : 'Materials Not Found';
  return {
    title: title,
  };
}

export default async function MaterialPage({ params }: MaterialPageProps) {
  const { grade, subject: topic } = await params;
  const content = await getMaterialContent(grade, topic);

  if (!content) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">{content.title}</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {content.description}
        </p>
      </header>
      <MaterialContentClient content={content} />
    </div>
  );
}
