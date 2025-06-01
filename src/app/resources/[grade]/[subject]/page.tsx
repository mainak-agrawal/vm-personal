import { getMaterialContent } from '@/lib/data';
import { MaterialContentClient } from './material-content';
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';

interface MaterialPageProps {
  params: {
    grade: string;
    subject: string;
  };
}

export async function generateMetadata(
  { params }: MaterialPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const content = await getMaterialContent(params.grade, params.subject);
  const title = content ? `${content.title} Resources` : 'Materials Not Found';
  return {
    title: title,
  };
}

export default async function MaterialPage({ params }: MaterialPageProps) {
  const { grade, subject } = params;
  const content = await getMaterialContent(grade, subject);

  if (!content) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">{content.title}</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Explore videos and documents for {content.grade} {content.subject}.
        </p>
      </header>
      <MaterialContentClient content={content} />
    </div>
  );
}
