
import Link from 'next/link';
import { getTeacherProfile } from '@/lib/data';
import type { TeacherProfile } from '@/types';
import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  description:
    'Vishva Mohan is a Science educator and mentor coaching high school students for JEE and NEET, especially Physics. Explore free study materials, lecture videos, quizzes, and interactive simulations for JEE, NEET, CBSE, ICSE, and IB-Board.',
};

export default async function HomePage() {
  const profile: TeacherProfile = await getTeacherProfile();

  const baseUrl = 'https://vishvamohan.com';
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: baseUrl,
        name: 'Vishva Mohan',
        description:
          'Physics educator and mentor coaching high school students for JEE and NEET.',
        publisher: { '@id': `${baseUrl}/#person` },
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
        knowsAbout: [
          'Physics',
          'JEE Physics',
          'NEET Physics',
          'Mathematics',
          'Biology',
          'Competitive exam coaching',
        ],
        sameAs: ['https://www.youtube.com/@VM-Science'],
        alumniOf: [
          { '@type': 'CollegeOrUniversity', name: 'Indian Institute of Technology Delhi' },
          { '@type': 'CollegeOrUniversity', name: 'University of Notre Dame' },
        ],
      },
    ],
  };

  return (
    <section className="bg-aurora relative flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center overflow-hidden px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      {/* Visually hidden content preserved for SEO / screen readers */}
      <div className="sr-only">
        <h2>Science Classes by Vishva Mohan Sir — Physics Coach for JEE &amp; NEET</h2>
        <p>
          Vishva Mohan is a Physics and Science educator and mentor coaching high school
          students for JEE (Advanced &amp; Main) and NEET. Explore free study materials,
          lecture videos, quizzes, and interactive simulations across Physics, Mathematics,
          and Biology for Class IX, Class X, Class XI, and Class XII students following CBSE,
          ICSE, and IB boards.
        </p>
      </div>

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <p className="mb-6 font-headline text-xs font-medium uppercase tracking-[0.35em] text-muted-foreground">
          Science Classes by <span className="whitespace-nowrap">Vishva Mohan Sir</span>
        </p>
        <h1 className="text-balance font-headline text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-[5.25rem]">
          For{' '}
          <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
            growing minds
          </span>
          <span className="mt-3 block text-2xl font-normal leading-tight tracking-tight text-muted-foreground sm:text-3xl md:text-4xl">
            not just a better report card
          </span>
        </h1>

        <div className="mt-24 flex justify-center sm:mt-28 md:mt-32">
          <Link
            href="/resources"
            className="group inline-flex items-center gap-3 rounded-full border border-white/60 bg-white/40 px-12 py-6 font-headline text-2xl font-medium tracking-tight text-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.85),0_8px_30px_-6px_rgba(0,0,0,0.15)] backdrop-blur-lg transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-white/55 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_16px_40px_-8px_rgba(0,0,0,0.22)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-0 active:scale-[0.98] dark:border-white/15 dark:bg-white/10 dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18),0_8px_30px_-6px_rgba(0,0,0,0.4)] dark:hover:bg-white/15 sm:text-3xl"
          >
            Resources
            <ArrowRight className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-1 sm:h-7 sm:w-7" />
          </Link>
        </div>
      </div>
    </section>
  );
}
