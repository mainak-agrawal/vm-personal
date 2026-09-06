'use client';

import { useMemo, useState } from 'react';
import type { ResourceCategory } from '@/types';
import { ResourceCategoryCard } from '@/components/cards/resource-category-card';
import { cn } from '@/lib/utils';

interface ResourcesBrowserProps {
  categories: ResourceCategory[];
}

const ROMAN_VALUES: Record<string, number> = {
  I: 1,
  V: 5,
  X: 10,
  L: 50,
  C: 100,
  D: 500,
  M: 1000,
};

function romanToInt(roman: string): number {
  let total = 0;
  const upper = roman.toUpperCase();
  for (let i = 0; i < upper.length; i += 1) {
    const current = ROMAN_VALUES[upper[i]] ?? 0;
    const next = ROMAN_VALUES[upper[i + 1]] ?? 0;
    total += current < next ? -current : current;
  }
  return total;
}

// The grade slug looks like `class-IX-Biology`; the middle segment is the roman grade.
function getGradeRoman(category: ResourceCategory): string {
  return category.gradesub.split('-')[1] ?? '';
}

export function ResourcesBrowser({ categories }: ResourcesBrowserProps) {
  const [activeGrade, setActiveGrade] = useState<string>('all');

  const grades = useMemo(() => {
    const unique = Array.from(new Set(categories.map(getGradeRoman))).filter(Boolean);
    return unique.sort((a, b) => romanToInt(a) - romanToInt(b));
  }, [categories]);

  const filtered = useMemo(() => {
    if (activeGrade === 'all') return categories;
    return categories.filter((category) => getGradeRoman(category) === activeGrade);
  }, [categories, activeGrade]);

  const chipClass = (isActive: boolean) =>
    cn(
      'shrink-0 whitespace-nowrap rounded-full border px-4 py-2 font-headline text-sm font-medium tracking-tight transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.97]',
      isActive
        ? 'border-primary bg-primary text-primary-foreground shadow-sm'
        : 'border-border/70 bg-card/60 text-muted-foreground hover:border-primary/40 hover:text-foreground'
    );

  return (
    <>
      {/* Grade quick-filter */}
      <div className="mb-8 -mx-6 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div
          role="tablist"
          aria-label="Filter resources by class"
          className="flex w-max items-center gap-2 sm:flex-wrap"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeGrade === 'all'}
            onClick={() => setActiveGrade('all')}
            className={chipClass(activeGrade === 'all')}
          >
            All classes
          </button>
          {grades.map((grade) => (
            <button
              key={grade}
              type="button"
              role="tab"
              aria-selected={activeGrade === grade}
              onClick={() => setActiveGrade(grade)}
              className={chipClass(activeGrade === grade)}
            >
              Class {grade}
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
          {filtered.map((category, index) => (
            <ResourceCategoryCard key={category.slug} category={category} index={index} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No resources found for this class.</p>
      )}
    </>
  );
}
