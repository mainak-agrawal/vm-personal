'use client';

import Link from 'next/link';
import type { ResourceCategory } from '@/types';
import { ArrowUpRight } from 'lucide-react';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';

interface ResourceCategoryCardProps {
  category: ResourceCategory;
  index?: number;
}

const TILE_COUNT = 6;

export function ResourceCategoryCard({ category, index = 0 }: ResourceCategoryCardProps) {
  const tile = (index % TILE_COUNT) + 1;
  const [gradePart, subjectPart] = category.title.includes('|')
    ? category.title.split('|').map((s) => s.trim())
    : [category.gradesub, category.title];

  return (
    <Link
      href={`/resources/${category.slug}`}
      className="group block h-full focus:outline-none"
      style={{
        // Themeable soft tint + matching ink per tile
        ['--tile' as string]: `var(--tile-${tile})`,
        ['--ink' as string]: `var(--tile-${tile}-ink)`,
      }}
      onClick={() =>
        track(ANALYTICS_EVENTS.RESOURCE_CATEGORY_CLICK, {
          category_title: category.title,
          category_slug: category.slug,
        })
      }
    >
      <article className="flex h-full flex-col justify-between rounded-[1.75rem] border border-border/50 bg-[hsl(var(--tile))] p-5 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-black/[0.06] group-focus-visible:ring-2 group-focus-visible:ring-[hsl(var(--ink))] group-active:translate-y-0 sm:p-6 md:p-7">
        <div className="flex items-start justify-between gap-3">
          {gradePart && (
            <span className="inline-flex items-center rounded-full border border-white/70 bg-white/55 px-4 py-2 font-headline text-sm font-medium tracking-tight text-[hsl(var(--ink))] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.85),0_1px_3px_0_rgba(0,0,0,0.06)] backdrop-blur-lg dark:border-white/15 dark:bg-white/10 dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),0_1px_3px_0_rgba(0,0,0,0.2)]">
              {gradePart}
            </span>
          )}
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-background/60 text-[hsl(var(--ink))] transition-all duration-300 group-hover:bg-[hsl(var(--ink))] group-hover:text-background">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>

        <div className="mt-6">
          <h2 className="font-headline text-2xl font-semibold capitalize tracking-tight text-foreground md:text-[1.7rem]">
            {subjectPart.toLowerCase()}
          </h2>
          {category.description && (
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {category.description}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
