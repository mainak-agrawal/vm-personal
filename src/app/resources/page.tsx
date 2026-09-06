import { getResourceCategories } from '@/lib/data';
import type { ResourceCategory } from '@/types';
import { ResourcesBrowser } from '@/components/cards/resources-browser';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resources',
  description:
    'Browse Physics, Mathematics, and Biology study materials, lecture videos, quizzes, and interactive simulations organized by class and subject for JEE, NEET, CBSE, ICSE, and IB students.',
};

export default async function ResourcesPage() {
  const categories: ResourceCategory[] = await getResourceCategories();

  return (
    <div className="bg-aurora min-h-[calc(100dvh-4rem)]">
      <div className="container mx-auto max-w-6xl px-6 py-14 md:py-20">
        <header className="mb-10 max-w-2xl">
          <p className="font-headline text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
            Library
          </p>
          <h1 className="mt-3 font-headline text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
            Resources
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            Study materials, lecture videos, quizzes, and interactive simulations organized
            by class and subject. Pick where you want to begin.
          </p>
        </header>

        {categories.length > 0 ? (
          <ResourcesBrowser categories={categories} />
        ) : (
          <p className="text-muted-foreground">No resource categories available at the moment.</p>
        )}
      </div>
    </div>
  );
}
