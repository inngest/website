// Editorial config for the promoted "featured" pattern shown on /patterns/.
// Swap the slug + copy when promoting a different pattern.

export type FeaturedPattern = {
  /** Frontmatter `pattern` value of the surviving section. */
  sectionId: string;
  /** MDX file slug (filename without extension). */
  slug: string;
  /** Eyebrow text shown above the title. */
  label: string;
  /** Editorial pitch (2–3 sentences). Distinct from the pattern's own subtitle. */
  excerpt: string;
  /** Bullets shown in the featured card. Keep to 3–4. */
  highlights: string[];
  /** ISO date used for the "Published" row. */
  publishedAt: string;
  /** Pre-formatted read time string. */
  readTime: string;
};

export const FEATURED_PATTERN: FeaturedPattern = {
  sectionId: "flow",
  slug: "flash-sales-and-bursty-workflows",
  label: "Featured pattern",
  excerpt:
    "When traffic spikes, webhooks fire twice, or third-party APIs push back, four primitives keep your pipeline upright: throttle, concurrency, debounce, and idempotency. This pattern shows when to reach for each — and how they compose on one function.",
  highlights: [
    "Throttle vs concurrency — when each matters",
    "Debounce noisy webhooks without losing the last update",
    "Idempotency keys for at-least-once delivery",
    "Compose all four on one function",
  ],
  publishedAt: "2026-05-12",
  readTime: "8 min read",
};
