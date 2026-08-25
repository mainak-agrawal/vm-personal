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
  const description = content
    ? `${content.title} study materials, lecture videos, quizzes, and interactive simulations for JEE, NEET, and CBSE, ICSE, and IB board exam preparation.`
    : 'The requested study materials could not be found.';
  return {
    title: title,
    description: description,
  };
}

export default async function MaterialPage({ params }: MaterialPageProps) {
  const { grade, subject: topic } = await params;
  const content = await getMaterialContent(grade, topic);

  if (!content) {
    notFound();
  }

  const baseUrl = 'https://vishvamohan.com';
  const pageUrl = `${baseUrl}/resources/${grade}/${topic}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': pageUrl,
        url: pageUrl,
        name: content.title,
        description: content.description,
        isPartOf: { '@type': 'WebSite', name: 'Vishva Mohan', url: baseUrl },
      },
      ...content.videos.map((v) => ({
        '@type': 'VideoObject',
        name: v.title,
        description: v.description ?? content.title,
        thumbnailUrl: v.thumbnailUrl,
        embedUrl: v.embedUrl,
        ...(v.uploadDate ? { uploadDate: v.uploadDate } : {}),
        learningResourceType: 'Lecture video',
        educationalUse: 'Study',
        isPartOf: { '@id': pageUrl },
      })),
      ...content.documents.map((d) => ({
        '@type': ['DigitalDocument', 'LearningResource'],
        name: d.title,
        url: d.downloadUrl,
        encodingFormat: d.type,
        ...(d.uploadDate ? { dateModified: d.uploadDate } : {}),
        learningResourceType: 'Study material',
        educationalUse: 'Study',
        isPartOf: { '@id': pageUrl },
      })),
      ...content.quizzes.map((q) => ({
        '@type': ['Quiz', 'LearningResource'],
        name: q.title,
        url: q.url,
        ...(q.uploadDate ? { dateModified: q.uploadDate } : {}),
        learningResourceType: 'Quiz',
        educationalUse: 'Assessment',
        isPartOf: { '@id': pageUrl },
      })),
      ...content.interactiveLessons.map((l) => ({
        '@type': 'LearningResource',
        name: l.title,
        url: l.url,
        ...(l.uploadDate ? { dateModified: l.uploadDate } : {}),
        learningResourceType: 'Interactive simulation',
        educationalUse: 'Interactive resource',
        isPartOf: { '@id': pageUrl },
      })),
    ],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
