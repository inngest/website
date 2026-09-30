import type { NavIconName } from "@/components/v1/NavIcons";
import type { KeepGoingIconName } from "@/components/v1/sections/NycLongRun/KeepGoingIcons";

/**
 * "Build for the Lonng Run" — New York City.
 *
 * Copy for the campaign landing page at inngest.com/nyc-long-run, which
 * the step.run/nyc placements point to. Everything the page says lives
 * here so creative revisions don't touch layout.
 */

/* ── 01 · Hero ─────────────────────────────────────────────────────── */

export const HERO = {
  // Two-tone: the city in frost, the campaign line in the accent.
  eyebrow: "New York City.",
  // "Built here, running here" is SF's line — Inngest is built there.
  // NYC gets the campaign line instead, which is true anywhere.
  eyebrowAccent: "Built for the lonng run.",
  body: "If your code runs for minutes or days, it won't run straight through. Wrap functions in steps that automatically retry, pause, and fan out. Scale instantly, without thinking about infra.",
  cta: {
    label: "Start Free",
    // `/sign-up` is a site-wide redirect to NEXT_PUBLIC_SIGNUP_URL, so it
    // resolves to the real signup app per environment. Ref tag follows
    // the repo convention: a hero gets the bare page slug.
    href: "/sign-up?ref=nyc-long-run",
  },
  // Shows the command itself rather than a generic label, per design.
  installCta: { label: "npm install inngest", command: "npm install inngest" },
  // The design's run-trace panel: a step.run function with a flaky step
  // retrying across three attempts before completing.
  visual: {
    src: "/assets/v1/nyc-long-run/dashboard-header-ui.png",
    alt: "An Inngest run trace: a step.run function with a flaky step retrying across three attempts before completing, alongside each step's duration.",
    width: 1255,
    height: 973,
  },
} as const;

/* ── 02 · The product difference ───────────────────────────────────── */

export const NYC_DIFFERENCE = {
  title: ["Durable doesn't have to be hard."],
  body: "Orchestrating lonng-running code is tough. But you don't need to wrangle a bunch of extra infrastructure to do it. The Inngest SDK is the fastest way to make any code durable and observable by default.",
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

export interface NycUseCase {
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

export const NYC_USE_CASES: NycUseCase[] = [
  {
    id: "workflows",
    title: "Workflows",
    body: "Coordinate multi-step processes without losing completed work.",
    icon: "durable-execution",
    href: "/docs/features/inngest-functions/steps-workflows?ref=nyc-long-run-use-cases",
    image: {
      src: "/assets/v1/nyc-long-run/workflows.png",
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
    href: "/docs/guides/background-jobs?ref=nyc-long-run-use-cases",
    image: {
      src: "/assets/v1/nyc-long-run/background-jobs.png",
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
    href: "/docs/learn/durable-agents?ref=nyc-long-run-use-cases",
    image: {
      src: "/assets/v1/nyc-long-run/agent-bot.png",
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
    href: "/docs/guides/flow-control?ref=nyc-long-run-use-cases",
    image: {
      src: "/assets/v1/nyc-long-run/data-pipelines.png",
      // Decorative: the card title and body already say what it is.
      alt: "",
    },
    imageNote: "Step DAG graph",
  },
];

/* ── 06 · New York campaign ───────────────────────────────────────── */

export interface NycCampaignCard {
  id: string;
  title: string;
  body: string;
  /** Confirmed detail line. Use `pending` instead when unconfirmed. */
  detail?: string;
  /** Shown as a "details coming soon" state — no button. An unconfirmed
   *  event must not ship an inactive CTA. */
  pending?: string;
  cta?: { label: string; href: string };
  /** Card photography. */
  image?: { src: string; alt: string };
  /** Describes the intended art; the placeholder label until `image`
   *  is set. */
  mediaNote?: string;
}

/**
 * New York programming.
 *
 * Founders Run Club is fully confirmed — date, time, venue and a real
 * registration site — so it carries a live CTA. Marathon weekend is
 * called out separately: the date is the campaign's anchor, but there's
 * no confirmed venue, meeting point or registration page yet, so it
 * shows what is known and no button.
 */
export const NYC_CAMPAIGN_CARDS: NycCampaignCard[] = [
  {
    id: "founders-run-club",
    title: "Run with us.",
    body: "Join Founders Run Club for an easy morning run with people who ship for a living. All paces welcome.",
    detail: "October 17 · Abingdon Square Park · 9 AM",
    cta: { label: "Founders RC", href: "https://foundersrc.com/" },
    image: {
      src: "/assets/v1/nyc-long-run/run-club.jpg",
      alt: "Runners heading up a cobbled street together.",
    },
  },
  {
    id: "marathon-weekend",
    title: "Marathon weekend.",
    body: "The city fills up with people doing something unreasonable for an unreasonably long time. We'll be out there for it.",
    pending: "November 1 · Details to come",
    mediaNote: "Campaign photo — marathon weekend",
  },
];

export const NYC_CAMPAIGN = {
  // Two-tone eyebrow: campaign name in the accent, city in frost.
  eyebrowAccent: "The lonng run.",
  eyebrow: "New York City.",
  // One line in the design. Hyphenation follows the campaign's own
  // spelling in the mock.
  title: ["Lonng-running humans. Lonng running agents."],
  body: "We're bringing Build for the Lonng Run to New York through run clubs, marathon weekend, and a few opportunities to get moving.",
} as const;

/* ── 07 · Resources ────────────────────────────────────────────────── */

export interface NycResource {
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
export const NYC_RESOURCES: NycResource[] = [
  {
    id: "durable-workflow-engine",
    kind: "Blog",
    title: "How a durable workflow engine works: you might not need a queue",
    href: "/blog/how-durable-workflow-engines-work?ref=nyc-long-run-resources",
  },
  {
    id: "visual-primer",
    kind: "Walkthrough",
    title: "What are Durable Functions? A visual JavaScript primer",
    href: "/blog/durable-functions-a-visual-javascript-primer?ref=nyc-long-run-resources",
  },
  {
    id: "steps-guide",
    kind: "Developer guide",
    title: "Steps in Inngest: checkpointed, retriable units of work",
    href: "/docs/learn/inngest-steps?ref=nyc-long-run-resources",
  },
];

export const NYC_USE_CASES_COPY = {
  title: "Because one request is never the finish line.",
  body: "However it's written, wherever it runs, Inngest makes lonng running jobs (and short sprints), unbreakable.",
} as const;

export const NYC_RESOURCES_COPY = {
  title: ["Keep building."],
  body: "Explore the technical ideas behind lonng-running agents and workflows.",
} as const;

/* ── 02 · What a lonng run is made of ──────────────────────────────── */

/**
 * Chip tone. Three groups, not decoration: green is work that runs,
 * amber is work that waits or pauses, salmon is work that fails or
 * needs a person. `accent-amber` was added to the v1 palette for this
 * section (styles/v1.css), carrying the same value as the site's
 * existing honey-300.
 */
export type NycKeepGoingTone = "green" | "amber" | "salmon";

export interface NycKeepGoingItem {
  label: string;
  icon: KeepGoingIconName;
  tone: NycKeepGoingTone;
}

export const NYC_KEEP_GOING = {
  // Two-tone eyebrow, the campaign line split across the accent and frost.
  eyebrowAccent: "Lonng-running humans.",
  eyebrow: "Lonng-running agents.",
  title: "Some things are built to keep going.",
  body: [
    "A marathon doesn't happen in one step. Neither does the work your agents are doing.",
    "The longer the run, the more chances something has to go wrong. The question is what happens when it does.",
  ],
  /**
   * The pile-up is the argument, so this is set as a wrapping run of
   * chips rather than a tidy column: it should read as "this keeps
   * going" before any single item is read.
   */
  work: [
    { label: "Research", icon: "search", tone: "green" },
    { label: "Tool calls", icon: "gear", tone: "amber" },
    { label: "Human approvals", icon: "person", tone: "salmon" },
    { label: "Model calls", icon: "sparkle", tone: "salmon" },
    { label: "External APIs", icon: "code", tone: "green" },
    { label: "Background jobs", icon: "loop", tone: "green" },
    { label: "Work that waits", icon: "clock", tone: "green" },
    { label: "Work that fails", icon: "cross", tone: "salmon" },
    { label: "Work that resumes hours later", icon: "pause", tone: "amber" },
  ] satisfies NycKeepGoingItem[],
} as const;
