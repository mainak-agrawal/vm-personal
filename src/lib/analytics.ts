import posthog from 'posthog-js';

/**
 * Centralized, type-safe telemetry layer built on PostHog.
 * All custom events flow through `track` so naming stays consistent and
 * calls are safe no-ops when analytics is not configured (e.g. local dev
 * without a PostHog key, or during server rendering).
 */

export const ANALYTICS_EVENTS = {
  RESOURCE_TAB_VIEW: 'resource_tab_view',
  VIDEO_PLAY: 'video_play',
  QUIZ_OPEN: 'quiz_open',
  INTERACTIVE_LESSON_OPEN: 'interactive_lesson_open',
  DOCUMENT_DOWNLOAD: 'document_download',
  RESOURCE_CATEGORY_CLICK: 'resource_category_click',
} as const;

export type AnalyticsEvent =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

export type AnalyticsProperties = Record<
  string,
  string | number | boolean | null | undefined
>;

/** Shared context describing where in the resource hierarchy an event fired. */
export interface ResourceContext {
  grade_subject?: string;
  topic?: string;
  material_title?: string;
}

export function isAnalyticsEnabled(): boolean {
  return (
    typeof window !== 'undefined' &&
    Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY) &&
    posthog.__loaded === true
  );
}

export function track(
  event: AnalyticsEvent,
  properties?: AnalyticsProperties
): void {
  if (!isAnalyticsEnabled()) return;
  try {
    posthog.capture(event, properties);
  } catch {
    // Never let telemetry break the UI.
  }
}
