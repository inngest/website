// Section metadata for the Inngest patterns hub.
// Each section maps to an Inngest primitive with its brand accent color.
// Pattern items themselves are sourced from MDX frontmatter in
// pages/patterns/_patterns/ at build time — see pages/patterns/index.tsx.
// Tailwind color classes reference tokens defined in tailwind.config.js.

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
  accent: {
    text: string;      // Tailwind text color class
    border: string;    // Tailwind border color class
    bg: string;        // Tailwind bg tint class
    gradient: string;  // CSS gradient for rule line
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
      "Multi-step business logic that survives crashes, deploys, and minute-long LLM calls. Each step is independently retried and persisted — no glue code, no external queues to babysit.",
    accent: {
      text: "text-matcha-500",
      border: "border-matcha-500",
      bg: "bg-matcha-500/[0.08]",
      gradient: "from-matcha-500 to-transparent",
    },
  },
  {
    id: "flow",
    number: "01",
    name: "Flow Control",
    kicker: "Spike-proof the boring stuff",
    description:
      "Throttle, debounce, rate-limit, and cap concurrency — declaratively, per-tenant or globally. Survive flash sales, runaway LLM bills, and noisy webhook providers.",
    accent: {
      text: "text-honey-500",
      border: "border-honey-500",
      bg: "bg-honey-500/[0.07]",
      gradient: "from-honey-500 to-transparent",
    },
  },
  {
    id: "events",
    number: "02",
    name: "Event Coordination",
    kicker: "Choreograph the chaos",
    description:
      "Wait for events, correlate signals across time, and cancel in-flight work based on what users do. The substrate underneath approvals, sagas, and abandonment flows.",
    accent: {
      text: "text-breeze-500",
      border: "border-breeze-500",
      bg: "bg-breeze-500/[0.08]",
      gradient: "from-breeze-500 to-transparent",
    },
  },
  {
    id: "schedule",
    number: "03",
    name: "Scheduling",
    kicker: "Time as a first-class input",
    description:
      "Cron, sleep, and sleepUntil — durable across deploys and process restarts. Schedule work for tomorrow, next quarter, or whenever a user picks a date.",
    accent: {
      text: "text-purplehaze-500",
      border: "border-purplehaze-500",
      bg: "bg-purplehaze-500/[0.08]",
      gradient: "from-purplehaze-500 to-transparent",
    },
  },
  {
    id: "jobs",
    number: "04",
    name: "Background Jobs",
    kicker: "Off the request path",
    description:
      "Heavy work — image processing, email, exports, webhook ingestion — belongs in the background where retries and concurrency control live. Get it out of your API responses.",
    accent: {
      text: "text-blush-500",
      border: "border-blush-500",
      bg: "bg-blush-500/[0.08]",
      gradient: "from-blush-500 to-transparent",
    },
  },
];

export default PATTERN_SECTIONS;
