import Image from 'next/image';
import Link from 'next/link';
import { getTeacherProfile } from '@/lib/data';
import type { TeacherProfile } from '@/types';
import { GraduationCap, Compass } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Meet Vishva Mohan — a Physics and Science educator and mentor with over two decades of experience coaching students for JEE, NEET, and board exams, and a former civil servant.',
};

// Render inline <b>…</b> tags coming from the profile data as real <strong> elements.
function renderTextWithBold(text: string) {
  const parts = text.split(/(<b>.*?<\/b>)/g);
  return parts.map((part, index) => {
    if (part.startsWith('<b>') && part.endsWith('</b>')) {
      return <strong key={index} className="font-semibold text-foreground">{part.slice(3, -4)}</strong>;
    }
    return <span key={index}>{part}</span>;
  });
}

export default async function AboutPage() {
  const profile: TeacherProfile = await getTeacherProfile();

  const baseUrl = 'https://vishvamohan.com';
  const pageUrl = `${baseUrl}/about`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': pageUrl,
        url: pageUrl,
        name: 'About Vishva Mohan',
        isPartOf: { '@type': 'WebSite', name: 'Vishva Mohan', url: baseUrl },
        mainEntity: { '@id': `${baseUrl}/#person` },
      },
      {
        '@type': 'Person',
        '@id': `${baseUrl}/#person`,
        name: profile.name,
        jobTitle: 'Physics Educator, Coach & Mentor',
        description:
          'Physics educator with over two decades of experience mentoring students for JEE, NEET, and board exams; former civil servant (District Magistrate).',
        image: `${baseUrl}${profile.photoUrl}`,
        url: baseUrl,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
          { '@type': 'ListItem', position: 2, name: 'About', item: pageUrl },
        ],
      },
    ],
  };

  const bioParagraphs = profile.bio.split('\n\n');

  return (
    <div className="bg-aurora">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto max-w-5xl px-6 py-14 md:py-20">
        {/* Hero */}
        <section className="flex flex-col items-center gap-10 md:flex-row md:items-center md:gap-14">
          <div className="relative shrink-0">
            <div
              aria-hidden="true"
              className="absolute -inset-4 -z-10 rounded-[2.75rem] bg-gradient-to-br from-primary/25 via-accent/20 to-transparent blur-2xl"
            />
            <div className="overflow-hidden rounded-[2.25rem] border border-border/70 bg-card p-2 shadow-xl shadow-primary/5">
              <Image
                src={profile.photoUrl}
                alt={profile.name}
                width={300}
                height={365}
                className="h-auto w-56 rounded-[1.75rem] object-cover md:w-64"
                data-ai-hint="teacher portrait"
                priority
                fetchPriority="high"
              />
            </div>
          </div>

          <div className="text-center md:text-left">
            <p className="font-headline text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
              About
            </p>
            <h1 className="mt-3 font-headline text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
              {profile.name}
            </h1>
            <p className="mt-3 font-headline text-xl font-medium text-primary md:text-2xl">
              {profile.title}
            </p>
          </div>
        </section>

        {/* Philosophy / Bio */}
        <section className="mx-auto mt-16 max-w-3xl">
          <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
            {bioParagraphs.map((paragraph, index) => (
              <p
                key={index}
                className={
                  index === 0
                    ? 'text-xl font-medium leading-relaxed text-foreground md:text-2xl'
                    : ''
                }
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {/* Credentials & Career */}
        <section className="mt-20 grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
          {profile.academicProfiles.map((academic, index) => (
            <article
              key={`academic-${index}`}
              className="rounded-3xl border border-border/60 bg-[hsl(var(--tile-1))] p-7 md:p-8"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[hsl(var(--tile-1-ink))]/10 text-[hsl(var(--tile-1-ink))]">
                  <GraduationCap className="h-5 w-5" />
                </span>
                <h2 className="font-headline text-lg font-semibold tracking-tight text-foreground">
                  {academic.degree}
                </h2>
              </div>
              {academic.description && (
                <p className="mt-4 text-sm text-muted-foreground">{academic.description}</p>
              )}
              <ul className="mt-5 space-y-4">
                {academic.points.map((point, pIndex) => (
                  <li
                    key={`academic-${index}-point-${pIndex}`}
                    className="border-l-2 border-[hsl(var(--tile-1-ink))]/25 pl-4 text-sm leading-relaxed text-muted-foreground"
                  >
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}

          <article className="rounded-3xl border border-border/60 bg-[hsl(var(--tile-4))] p-7 md:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[hsl(var(--tile-4-ink))]/10 text-[hsl(var(--tile-4-ink))]">
                <Compass className="h-5 w-5" />
              </span>
              <h2 className="font-headline text-lg font-semibold tracking-tight text-foreground">
                {profile.professionalSections[0]?.heading ?? 'Career'}
              </h2>
            </div>
            <div className="mt-5 space-y-6">
              {profile.professionalSections.map((section, index) => (
                <div key={`professional-${index}`}>
                  {section.description && (
                    <p className="text-sm text-muted-foreground">
                      {renderTextWithBold(section.description)}
                    </p>
                  )}
                  <ul className="mt-3 space-y-3">
                    {section.points.map((point, pIndex) => (
                      <li
                        key={`professional-${index}-point-${pIndex}`}
                        className="border-l-2 border-[hsl(var(--tile-4-ink))]/25 pl-4 text-sm leading-relaxed text-muted-foreground"
                      >
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </article>
        </section>

        {/* CTA */}
        <section className="mt-20 flex flex-col items-center justify-center gap-4 text-center">
          <p className="font-headline text-2xl font-medium tracking-tight text-foreground md:text-3xl">
            Ready to explore?
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 font-headline text-base font-medium text-primary-foreground shadow-sm transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]"
            >
              Browse Resources
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-7 py-3 font-headline text-base font-medium text-foreground transition-colors hover:bg-secondary active:scale-[0.98]"
            >
              Get in Touch
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
