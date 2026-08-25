'use client';

import { Suspense, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';

/**
 * Initializes PostHog on the client and captures a `$pageview` on every
 * App Router navigation. The Next.js App Router does not emit page loads on
 * client-side navigation, so SPA pageviews are captured manually here.
 *
 * Requests are sent through the `/ingest` reverse proxy (see next.config.ts)
 * so analytics are not blocked by ad blockers and data quality stays high.
 */

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname || !posthog.__loaded) return;
    let url = window.origin + pathname;
    const query = searchParams?.toString();
    if (query) url += `?${query}`;
    posthog.capture('$pageview', { $current_url: url });
  }, [pathname, searchParams]);

  return null;
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key || posthog.__loaded) return;

    posthog.init(key, {
      api_host: '/ingest',
      ui_host:
        process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.posthog.com',
      defaults: '2025-05-24',
      capture_pageview: false, // captured manually for App Router navigations
      capture_pageleave: true,
      autocapture: true, // records clicks on every element for element-level popularity
      persistence: 'localStorage+cookie',
    });
  }, []);

  return (
    <PostHogProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </PostHogProvider>
  );
}
