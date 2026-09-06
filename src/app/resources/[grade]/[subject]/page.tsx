import { getMaterialContent } from '@/lib/data';
import { MaterialContentClient } from './material-content';
import { notFound } from 'next/navigation';
import Link from 'next/link';
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
  const gradeDisplay = grade.replace('class-', 'Class ').replace('-', ' ');
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
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
          { '@type': 'ListItem', position: 2, name: 'Resources', item: `${baseUrl}/resources` },
          { '@type': 'ListItem', position: 3, name: gradeDisplay, item: `${baseUrl}/resources/${grade}` },
          { '@type': 'ListItem', position: 4, name: content.title, item: pageUrl },
        ],
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
    <div className="bg-aurora min-h-[calc(100dvh-4rem)]">
      <div className="container mx-auto max-w-6xl px-6 py-12 md:py-16">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link href="/" className="transition-colors hover:text-primary">Home</Link></li>
            <li aria-hidden="true" className="text-border">/</li>
            <li><Link href="/resources" className="transition-colors hover:text-primary">Resources</Link></li>
            <li aria-hidden="true" className="text-border">/</li>
            <li><Link href={`/resources/${grade}`} className="transition-colors hover:text-primary">{gradeDisplay}</Link></li>
            <li aria-hidden="true" className="text-border">/</li>
            <li aria-current="page" className="text-foreground">{content.title}</li>
          </ol>
        </nav>
        <header className="mb-10">
          <p className="font-headline text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
            {gradeDisplay}
          </p>
          <h1 className="mt-3 font-headline text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            {content.title}
          </h1>
          <p className="sr-only">
            {content.description}
          </p>
        </header>
        <MaterialContentClient content={content} />
      </div>
    </div>
  );
}
