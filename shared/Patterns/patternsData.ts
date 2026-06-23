// Section metadata + pattern index for the Inngest patterns hub (under /docs).
// Each section maps to an Inngest primitive with its brand accent. `accent.hex`
// is the bright/structural accent (dots, rails, viz); `accentDeep` is the
// light-mode-safe variant used for text/links. `viz` selects the section
// diagram in shared/Patterns/Viz.tsx.
//
// PATTERNS is the static index (category + slug + title + subtitle) used by the
// left nav, landing, and category pages. The long-form body for each pattern
// lives in shared/Patterns/_patterns/<slug>.mdx and is loaded by slug.

export interface PatternItem {
  slug: string;
  title: string;
  subtitle: string;
}

export interface PatternSectionMeta {
  id: string;
  number: string;
  name: string;
  kicker: string;
  description: string;
  viz: string; // visualization id (see shared/Patterns/Viz.tsx)
  accentDeep: string; // deeper accent hex, readable as text on a light canvas
  accent: {
    text: string; // Tailwind text color class
    border: string; // Tailwind border color class
    bg: string; // Tailwind bg tint class
    gradient: string; // CSS gradient for rule line
    hex: string; // bright/structural accent
    rgb: string; // "R G B" for rgba mixing
  };
}

export interface PatternSection extends PatternSectionMeta {
  patterns: PatternItem[];
}

const PATTERN_SECTIONS: PatternSectionMeta[] = [
  {
    id: "durable",
    number: "00",
    name: "Durable Workflows",
    kicker: "Steps that don't lose state",
    description:
      "Multi-step business logic that survives crashes, deploys, and minute-long LLM calls. Each step is independently retried and persisted. No glue code, no external queues to babysit.",
    viz: "durable",
    accentDeep: "#027A48",
    accent: {
      text: "text-matcha-500",
      border: "border-matcha-500",
      bg: "bg-matcha-500/[0.08]",
      gradient: "from-matcha-500 to-transparent",
      hex: "#2C9B63",
      rgb: "44 155 99",
    },
  },
  {
    id: "flow",
    number: "01",
    name: "Flow Control",
    kicker: "Spike-proof the boring stuff",
    description:
      "Throttle, debounce, rate-limit, and cap concurrency, declaratively per-tenant or globally. Survive flash sales, runaway LLM bills, and noisy webhook providers.",
    viz: "flow",
    accentDeep: "#B26C09",
    accent: {
      text: "text-honey-500",
      border: "border-honey-500",
      bg: "bg-honey-500/[0.07]",
      gradient: "from-honey-500 to-transparent",
      hex: "#D56B13",
      rgb: "213 107 19",
    },
  },
  {
    id: "events",
    number: "02",
    name: "Event Coordination",
    kicker: "Choreograph the chaos",
    description:
      "Wait for events, correlate signals across time, and cancel in-flight work based on what users do. The substrate underneath approvals, sagas, and abandonment flows.",
    viz: "events",
    accentDeep: "#1365D6",
    accent: {
      text: "text-breeze-500",
      border: "border-breeze-500",
      bg: "bg-breeze-500/[0.08]",
      gradient: "from-breeze-500 to-transparent",
      hex: "#2389F1",
      rgb: "35 137 241",
    },
  },
  {
    id: "schedule",
    number: "03",
    name: "Scheduling",
    kicker: "Time as a first-class input",
    description:
      "Cron, sleep, and sleepUntil, durable across deploys and process restarts. Schedule work for tomorrow, next quarter, or whenever a user picks a date.",
    viz: "schedule",
    accentDeep: "#7147F1",
    accent: {
      text: "text-purplehaze-500",
      border: "border-purplehaze-500",
      bg: "bg-purplehaze-500/[0.08]",
      gradient: "from-purplehaze-500 to-transparent",
      hex: "#8B74F9",
      rgb: "139 116 249",
    },
  },
  {
    id: "jobs",
    number: "04",
    name: "Background Jobs",
    kicker: "Off the request path",
    description:
      "Heavy work (image processing, email, exports, webhook ingestion) belongs in the background where retries and concurrency control live. Get it out of your API responses.",
    viz: "jobs",
    accentDeep: "#CF164B",
    accent: {
      text: "text-blush-500",
      border: "border-blush-500",
      bg: "bg-blush-500/[0.08]",
      gradient: "from-blush-500 to-transparent",
      hex: "#F93E6A",
      rgb: "249 62 106",
    },
  },
];

// Static pattern index. `category` matches a section id above; `slug` matches a
// file in shared/Patterns/_patterns/. Titles/subtitles mirror the MDX
// frontmatter so the nav and listings can render without reading the files.
export interface PatternIndexItem extends PatternItem {
  category: string;
}

export const PATTERNS: PatternIndexItem[] = [
  {
    category: "durable",
    slug: "reliably-run-critical-workflows",
    title: "Reliably run critical workflows",
    subtitle:
      "Break multi-step AI pipelines and complex business logic into durable, independently retried steps.",
  },
  {
    category: "durable",
    slug: "run-experiments-in-production",
    title: "Run experiments in production",
    subtitle:
      "Use group.experiment() to split traffic, keep cohorts stable, compare variants, and roll changes forward safely.",
  },
  {
    category: "flow",
    slug: "flash-sales-and-bursty-workflows",
    title: "Flash sales and bursty workflows",
    subtitle:
      "Use throttle, concurrency, debounce, and idempotency to handle traffic spikes without overwhelming downstream services.",
  },
  {
    category: "events",
    slug: "event-coordination-for-lost-customers",
    title: "Building flows for lost customers",
    subtitle:
      "Coordinate between events to build AI-driven re-engagement, human-in-the-loop approvals, and multi-step user journeys.",
  },
  {
    category: "events",
    slug: "reliable-scheduling-systems",
    title: "Reliable scheduling systems",
    subtitle:
      "Fan out to hundreds or thousands of independently-retried jobs from a single trigger, from batch AI processing to multi-tenant report generation.",
  },
  {
    category: "events",
    slug: "running-functions-in-parallel",
    title: "Running functions in parallel",
    subtitle:
      "Fan out to multiple model calls, evaluations, or processing tasks from a single event.",
  },
  {
    category: "schedule",
    slug: "running-at-specific-times",
    title: "Running code at specific times",
    subtitle:
      "Schedule one-off work for appointment reminders, off-peak AI maintenance, embargoed publishing, and user-picked send times.",
  },
  {
    category: "jobs",
    slug: "build-reliable-webhooks",
    title: "Build reliable webhooks",
    subtitle:
      "Handle webhooks and AI model callbacks with fast acknowledgement, at-least-once delivery, and replay.",
  },
  {
    category: "jobs",
    slug: "keeping-your-api-fast",
    title: "Keeping your API fast",
    subtitle:
      "Offload LLM calls, data processing, and other heavy work from the request path into reliable background functions.",
  },
];

// Build the full sections-with-patterns list, in display order, dropping any
// section that has no patterns.
export function getPatternSections(): PatternSection[] {
  return PATTERN_SECTIONS.flatMap((meta) => {
    const patterns = PATTERNS.filter((p) => p.category === meta.id).map(
      ({ slug, title, subtitle }) => ({ slug, title, subtitle })
    );
    if (patterns.length === 0) return [];
    return [{ ...meta, patterns }];
  });
}

export function getSection(id: string): PatternSectionMeta | undefined {
  return PATTERN_SECTIONS.find((s) => s.id === id);
}

export function getPattern(
  category: string,
  slug: string
): PatternIndexItem | undefined {
  return PATTERNS.find((p) => p.category === category && p.slug === slug);
}

// Featured / promoted pattern, highlighted at the top of the landing page.
export const FEATURED_PATTERN = {
  category: "flow",
  slug: "flash-sales-and-bursty-workflows",
  label: "Featured pattern",
  excerpt:
    "When traffic spikes (a flash sale, a batch import, or an AI agent firing dozens of tool calls in parallel), four flow-control primitives keep you in control: throttle, concurrency, debounce, and idempotency. Here's when to reach for each.",
  // Existing brand graphic that fits the Flow Control theme. Set to null to
  // render the section's viz diagram instead.
  image: "/assets/homepage/flow-control.svg",
};

export default PATTERN_SECTIONS;
