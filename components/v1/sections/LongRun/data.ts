import type { NavIconName } from "@/components/v1/NavIcons";

/**
 * "Build for the Lonng Run" — step.run.
 *
 * Copy for the campaign landing page at inngest.com/long-run, which
 * the bare step.run domain points to. Copied from the SF page, so the
 * city-specific copy below (the programming cards) still reads San
 * Francisco until it's rewritten. Everything the page says lives
 * here so creative revisions don't touch layout.
 */

/* ── 01 · Hero ─────────────────────────────────────────────────────── */

export const HERO = {
  // Optional two-tone: `eyebrow` in frost, then `eyebrowAccent` in the
  // accent. Leave `eyebrow` empty for a single-tone line.
  eyebrow: "",
  eyebrowAccent: "Open source durable execution",
  body: "If your code runs for minutes or days, it won't run straight through. Wrap functions in steps that automatically retry, pause, and fan out. Scale instantly, without thinking about infra.",
  cta: {
    label: "Start Free",
    // `/sign-up` is a site-wide redirect to NEXT_PUBLIC_SIGNUP_URL, so it
    // resolves to the real signup app per environment. Ref tag follows
    // the repo convention: a hero gets the bare page slug.
    href: "/sign-up?ref=long-run",
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

export const LR_DIFFERENCE = {
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

export interface UseCase {
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

export const LR_USE_CASES: UseCase[] = [
  {
    id: "workflows",
    title: "Workflows",
    body: "Coordinate multi-step processes without losing completed work.",
    icon: "durable-execution",
    href: "/docs/durable-execution/primitives?ref=long-run-use-cases",
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
    href: "/docs/patterns/jobs/keeping-your-api-fast?ref=long-run-use-cases",
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
    href: "/docs/durable-execution/durable-agents?ref=long-run-use-cases",
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
    href: "/docs/durable-execution/flow-control?ref=long-run-use-cases",
    image: {
      src: "/assets/v1/sf-long-run/data-pipelines.png",
      // Decorative: the card title and body already say what it is.
      alt: "",
    },
    imageNote: "Step DAG graph",
  },
];

/* ── 06 · Learn more ───────────────────────────────────────────────── */

export interface CampaignCard {
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
 * "Learn more" cards: two blog posts and the agent example repo. A card
 * with no `image` shows a labelled placeholder from `mediaNote`.
 */
export const LR_CAMPAIGN_CARDS: CampaignCard[] = [
  {
    id: "blog-long-running",
    title: "Long running everything",
    body: "Long-running work is anything that can’t finish in a single request. Learn how to ensure it stays durable.",
    cta: {
      label: "Read the blog",
      href: "/blog/all-your-workflows-are-about-to-be-long-running?ref=long-run-learn-more",
    },
    image: {
      src: "/assets/v1/long-run/long-running-blog.webp",
      alt: "All your workflows are about to be long running. Build for it.",
    },
  },
  {
    id: "blog-dead-last",
    title: "Durable execution for dummies*",
    body: "Or anyone not used to building infrastructure around their production product.",
    cta: {
      label: "Read the blog",
      href: "/blog/what-dead-fcking-last-taught-me-about-durable-execution?ref=long-run-learn-more",
    },
    image: {
      src: "/assets/v1/long-run/dead-last-blog.webp",
      alt: "Lauren Craigie, Head of Marketing at Inngest, on a trail run.",
    },
  },
  {
    id: "agent-example",
    title: "Start with one example",
    body: "Build an agent to complete long running data analytics tasks.",
    cta: {
      label: "Get the repo",
      href: "https://github.com/inngest/agent-examples/tree/main/token-streaming-agent",
    },
    image: {
      src: "/assets/v1/long-run/agent-examples-repo.webp",
      alt: "The token-streaming-agent folder in the inngest/agent-examples repo on GitHub.",
    },
  },
];

export const LR_CAMPAIGN = {
  // Two-tone eyebrow: `eyebrowAccent` in the accent, then `eyebrow` in
  // frost. Leave `eyebrow` empty for a single-tone line.
  eyebrowAccent: "Learn more",
  eyebrow: "",
  title: ["What does it mean to be long running?"],
  body: "If you’re building anything that needs to stop, start, or retry based on an event, you’re building a long-running workflow. Find best practices here:",
} as const;

/* ── Quick starts ──────────────────────────────────────────────────── */

/** Logo cards for the page's "Start building" section. `invert` flips the
 *  dark-on-light marks so they read white on the dark card. */
export const LR_QUICKSTARTS = [
  {
    eyebrow: "Quickstart",
    title: "Next.js",
    href: "/docs/getting-started/nextjs-quick-start",
    logo: "/assets/v1/start-building/nextjs.png",
    invert: true,
  },
  {
    eyebrow: "Quickstart",
    title: "Node.js",
    href: "/docs/durable-execution/quick-start/typescript-quick-start",
    logo: "/assets/v1/start-building/node.svg",
    invert: false,
  },
  {
    eyebrow: "Quickstart",
    title: "Python",
    href: "/docs/getting-started/python-quick-start",
    logo: "/assets/v1/start-building/python.svg",
    invert: true,
  },
] as const;

/* ── 07 · Resources ────────────────────────────────────────────────── */

export interface Resource {
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
export const LR_RESOURCES: Resource[] = [
  {
    id: "built-for-the-long-run",
    kind: "Blog",
    // Published title, copied exactly — the post spells it "long
    // running", not the campaign's "lonng".
    title: "All your workflows are about to be long running. Build for it.",
    href: "/blog/all-your-workflows-are-about-to-be-long-running?ref=long-run-resources",
  },
  {
    id: "visual-primer",
    kind: "Walkthrough",
    title: "What are Durable Functions? A visual JavaScript primer",
    href: "/blog/durable-functions-a-visual-javascript-primer?ref=long-run-resources",
  },
  {
    id: "steps-guide",
    kind: "Developer guide",
    title: "Steps in Inngest: checkpointed, retriable units of work",
    href: "/docs/durable-execution/primitives?ref=long-run-resources",
  },
];

export const LR_USE_CASES_COPY = {
  title: "Because one request is never the finish line.",
  body: "However it's written, wherever it runs, Inngest makes lonng running jobs (and short sprints), unbreakable.",
} as const;

export const LR_RESOURCES_COPY = {
  title: ["Keep building."],
  body: "Explore the technical ideas behind lonng-running agents and workflows.",
} as const;
