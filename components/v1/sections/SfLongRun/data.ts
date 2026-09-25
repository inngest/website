import type { NavIconName } from "@/components/v1/NavIcons";

/**
 * "Build for the long run" — San Francisco.
 *
 * Copy for the campaign landing page at inngest.com/sf-long-run, which
 * the step.run/sf placements point to. Everything the page says lives
 * here so creative revisions don't touch layout.
 */

/* ── 01 · Hero ─────────────────────────────────────────────────────── */

export const HERO = {
  // Two-tone: the city in frost, the campaign line in the accent.
  eyebrow: "San Francisco.",
  eyebrowAccent: "Built here, running here.",
  body: "If your code runs for minutes or days, it won't run straight through. Wrap functions in steps that automatically retry, pause, and fan out. Scale instantly, without thinking about infra.",
  cta: {
    label: "Start Free",
    // `/sign-up` is a site-wide redirect to NEXT_PUBLIC_SIGNUP_URL, so it
    // resolves to the real signup app per environment. Ref tag follows
    // the repo convention: a hero gets the bare page slug.
    href: "/sign-up?ref=sf-long-run",
  },
  // Shows the command itself rather than a generic label, per design.
  installCta: { label: "npm install inngest", command: "npm install inngest" },
  // The design's run-trace panel: a step.run function with a flaky step
  // retrying across three attempts before completing.
  visual: {
    src: "/assets/v1/sf-long-run/dashboard-header-ui.png",
    alt: "An Inngest run trace: a step.run function with a flaky step retrying across three attempts before completing, alongside each step's duration.",
    width: 1255,
    height: 973,
  },
} as const;

/* ── 02 · The product difference ───────────────────────────────────── */

export const SF_DIFFERENCE = {
  title: ["Durable doesn't have to be hard."],
  body: "Orchestrating long-running code is tough. But you don't need to wrangle a bunch of extra infrastructure to do it. The Inngest SDK is the fastest way to make any code durable and observable by default.",
  /** Reuses the homepage's before/after assets and the shared slider. */
  before: {
    src: "/assets/v1/it-doesnt-have-to-be-hard/before.webp",
    alt: "Before: the tangle of infrastructure (queues, pubsub, idempotency, error handling, capacity management) you have to build yourself.",
  },
  after: {
    src: "/assets/v1/it-doesnt-have-to-be-hard/after.webp",
    alt: "After: a single step.run() call replacing all that infrastructure.",
  },
} as const;

/* ── 03 · Use cases ────────────────────────────────────────────────── */

export interface SfUseCase {
  id: string;
  title: string;
  body: string;
  /** Reuses the nav's existing icon set rather than introducing new art. */
  icon: NavIconName;
  /** Docs page this use case links through to. */
  href: string;
  /** Card thumbnail. Absent until the design's art is exported — the card
   *  renders a labelled placeholder rather than a stand-in image. */
  image?: { src: string; alt: string };
  /** What the thumbnail should show; used as the placeholder label. */
  imageNote: string;
}

export const SF_USE_CASES: SfUseCase[] = [
  {
    id: "workflows",
    title: "Workflows",
    body: "Coordinate multi-step processes without losing completed work.",
    icon: "durable-execution",
    href: "/docs/features/inngest-functions/steps-workflows?ref=sf-long-run-use-cases",
    image: {
      src: "/assets/v1/sf-long-run/workflows.png",
      // Decorative: the card title and body already say what it is.
      alt: "",
    },
    imageNote: "Run timeline — inngest/function.invoked",
  },
  {
    id: "background-jobs",
    title: "Background jobs",
    body: "Run work beyond the request-response cycle.",
    icon: "background-jobs",
    href: "/docs/guides/background-jobs?ref=sf-long-run-use-cases",
    image: {
      src: "/assets/v1/sf-long-run/background-jobs.png",
      // Decorative: the card title and body already say what it is.
      alt: "",
    },
    imageNote: "Event fan-out — app/user.created to sendSignupEmail",
  },
  {
    id: "ai-agents",
    title: "AI agents",
    body: "Support unpredictable sequences of model calls and tool use.",
    icon: "ai-workflows",
    href: "/docs/learn/durable-agents?ref=sf-long-run-use-cases",
    image: {
      src: "/assets/v1/sf-long-run/agent-bot.png",
      // Decorative: the card title and body already say what it is.
      alt: "",
    },
    imageNote: "Agent chat panel",
  },
  {
    id: "data-pipelines",
    title: "Data pipelines",
    body: "Process multi-step data operations with durable execution.",
    icon: "queues",
    href: "/docs/guides/flow-control?ref=sf-long-run-use-cases",
    image: {
      src: "/assets/v1/sf-long-run/data-pipelines.png",
      // Decorative: the card title and body already say what it is.
      alt: "",
    },
    imageNote: "Step DAG graph",
  },
];

/* ── 06 · San Francisco campaign ───────────────────────────────────── */

export interface SfCampaignCard {
  id: string;
  title: string;
  body: string;
  /** Confirmed detail line. Use `pending` instead when unconfirmed. */
  detail?: string;
  /** Shown as a "details coming soon" state — no button, per the brief:
   *  an unconfirmed event must not ship an inactive CTA. */
  pending?: string;
  cta?: { label: string; href: string };
  /** Card photography. */
  image?: { src: string; alt: string };
  /** Describes the intended art; used as the placeholder label until
   *  `image` is set. */
  mediaNote?: string;
}

/**
 * SF programming.
 *
 * Only the Corgi Café start date is confirmed. The run club and the
 * community event have no confirmed date, venue or registration page, so
 * they carry a "details coming soon" state and NO call to action — an
 * inactive button is worse than no button, and a fabricated date on a
 * public page is worse than both.
 *
 * LAUNCH DEPENDENCY: run-club date + destination, community event date /
 * venue / format + Luma registration URL. Each is a one-line edit here.
 */
export const SF_CAMPAIGN_CARDS: SfCampaignCard[] = [
  {
    id: "corgi-cafe",
    title: "The Long Run.",
    body: "Find our campaign drink at Corgi Café and follow the long run from your cup to your code.",
    detail: "Starting October 1.",
    image: {
      src: "/assets/v1/sf-long-run/corgi-cup.png",
      alt: "The campaign drink at Corgi Café.",
    },
    mediaNote: "Approved campaign drink photo — cup or sleeve artwork",
  },
  {
    id: "run-club",
    title: "Run with us.",
    body: "Join the Inngest community for a run in San Francisco. All paces welcome.",
    pending: "Date TBD",
    image: {
      src: "/assets/v1/sf-long-run/sf-run.png",
      alt: "The San Francisco bay, looking toward the Golden Gate Bridge.",
    },
    mediaNote: "Campaign photo — San Francisco run",
  },
  {
    id: "community",
    title: "Keep the long run going.",
    body: "Join us for another opportunity to connect with San Francisco builders.",
    pending: "Date and venue TBD",
    image: {
      src: "/assets/v1/sf-long-run/innhouse.png",
      alt: "Developers working together at an Inngest community event.",
    },
    mediaNote: "Campaign photo — community event",
  },
];

export const SF_CAMPAIGN = {
  // Two-tone eyebrow: campaign name in the accent, city in frost.
  eyebrowAccent: "The long run.",
  eyebrow: "San Francisco.",
  // Set exactly as designed, including the unhyphenated second half.
  title: ["Long-running humans. Long running agents."],
  body: "We're bringing Build for the Long Run to San Francisco through coffee, community, and a few opportunities to get moving.",
} as const;

/* ── 07 · Resources ────────────────────────────────────────────────── */

export interface SfResource {
  id: string;
  /** Kind of thing it is, shown as the card's eyebrow. */
  kind: string;
  /** Exact published title. Do not paraphrase — these are real pages. */
  title: string;
  href: string;
}

/**
 * Real, already-published Inngest content. Every title below is the exact
 * `heading` / `metaTitle` from the source file, and every URL was checked
 * to return 200 — nothing here is invented.
 *
 * The section hides itself when this array is empty, so trimming it is a
 * safe way to pull a card that hasn't been cleared.
 */
export const SF_RESOURCES: SfResource[] = [
  {
    id: "durable-workflow-engine",
    kind: "Blog",
    title: "How a durable workflow engine works: you might not need a queue",
    href: "/blog/how-durable-workflow-engines-work?ref=sf-long-run-resources",
  },
  {
    id: "visual-primer",
    kind: "Walkthrough",
    title: "What are Durable Functions? A visual JavaScript primer",
    href: "/blog/durable-functions-a-visual-javascript-primer?ref=sf-long-run-resources",
  },
  {
    id: "steps-guide",
    kind: "Developer guide",
    title: "Steps in Inngest: checkpointed, retriable units of work",
    href: "/docs/learn/inngest-steps?ref=sf-long-run-resources",
  },
];

export const SF_USE_CASES_COPY = {
  title: "Because one request is never the finish line.",
  body: "However it's written, wherever it runs, Inngest makes long running jobs (and short sprints), unbreakable.",
} as const;

export const SF_RESOURCES_COPY = {
  title: ["Keep building."],
  body: "Explore the technical ideas behind long-running agents and workflows.",
} as const;
