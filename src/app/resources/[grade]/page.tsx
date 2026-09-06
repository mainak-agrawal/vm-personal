import { getTopicsForGradeSubject } from '@/lib/data';
import type { TopicCategory } from '@/types';
import { TopicsListClient } from './topics-list';
import Link from 'next/link';
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
    description: `Explore ${gradeDisplay} topics with study materials, lecture videos, quizzes, and interactive simulations for JEE, NEET, and CBSE, ICSE, and IB board exam preparation.`,
  };
}

export default async function TopicsPage({ params }: TopicsPageProps) {
  const { grade } = await params;
  const topics: TopicCategory[] = await getTopicsForGradeSubject(grade);
  
  const gradeDisplay = grade.replace('class-', 'Class ').replace('-', ' ');

  const baseUrl = 'https://vishvamohan.com';
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Resources', item: `${baseUrl}/resources` },
      { '@type': 'ListItem', position: 3, name: gradeDisplay, item: `${baseUrl}/resources/${grade}` },
    ],
  };

  return (
    <div className="bg-aurora min-h-[calc(100dvh-4rem)]">
      <div className="container mx-auto max-w-5xl px-6 py-12 md:py-16">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link href="/" className="transition-colors hover:text-primary">Home</Link></li>
            <li aria-hidden="true" className="text-border">/</li>
            <li><Link href="/resources" className="transition-colors hover:text-primary">Resources</Link></li>
            <li aria-hidden="true" className="text-border">/</li>
            <li aria-current="page" className="text-foreground">{gradeDisplay}</li>
          </ol>
        </nav>
        <header className="mb-10">
          <p className="font-headline text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
            Topics
          </p>
          <h1 className="mt-3 font-headline text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            {gradeDisplay}
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Select a topic to access study materials, videos, and documents.
          </p>
        </header>

        <TopicsListClient topics={topics} grade={grade} />
      </div>
    </div>
  );
}
