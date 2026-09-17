/**
 * "Build for the long run" campaign data — the single source of truth for
 * the OOH/DOOH landing page at step.run/{nyc,sf,build}.
 *
 * Scoped deliberately tight. This page catches someone who just scanned a
 * QR code off a poster or a chalk stencil, so it carries the campaign line,
 * one explanation of what Inngest does, the course, and a CTA — nothing
 * from the internal pitch (pillars, metaphor rationale, media plan).
 */

import type { NavIconName } from "@/components/v1/NavIcons";

export type Market = "nyc" | "sf" | "all";

/** The in-page technical proof section on the SF page. Declared here
 *  because the hero's secondary CTA references it, and a `const` used
 *  before its declaration would be a temporal dead zone error at module
 *  evaluation. */
export const SF_PROOF_ANCHOR = "long-run-technical-proof";

/* ── Hero ──────────────────────────────────────────────────────────── */

interface MarketCopy {
  /** Uppercase eyebrow above the headline — anchors the page to the
   *  placement the visitor just walked past. */
  eyebrow: string;
  /** The line that rewards the scan. Names the city, so the page reads as
   *  a continuation of the street rather than a generic product page. */
  lede: string;
}

export const MARKET_COPY: Record<Market, MarketCopy> = {
  nyc: {
    eyebrow: "New York City · Marathon Sunday, Nov 1",
    lede: "You just walked past us in New York.",
  },
  sf: {
    eyebrow: "San Francisco · Built here, running here",
    lede: "You just walked past us in San Francisco.",
  },
  all: {
    eyebrow: "Build for the long run",
    lede: "Long running humans. Long running agents.",
  },
};

/** The one-breath explanation, under the lede in every market. */
export const HERO_BODY =
  "Inngest runs your functions durably — for hours, days or weeks. Every step checkpoints as it finishes, so a failure retries that one step instead of restarting the whole run.";

/* ── What it does ──────────────────────────────────────────────────── */

/** Three facts beside the snippet. One line each, no elaboration. */
export const FACTS = [
  "Runs for hours or days, not one request",
  "A step fails, that step retries — the run keeps its place",
  "Step-level traces for every attempt, in production",
] as const;

/* ── The course: the route → capabilities ──────────────────────────── */

export interface CourseStage {
  id: string;
  /** Mile marker as it appears on the course. */
  mile: string;
  /** Borough, or Central Park for the finish. */
  place: string;
  /** The Inngest capability this leg stands for. */
  capability: string;
  body: string;
  href: string;
}

/**
 * The real NYC marathon route mapped onto what Inngest does over a long
 * run. The course crosses all five boroughs and finishes in Central Park —
 * which is in Manhattan, not a sixth borough, so the section says "five
 * boroughs and a finish line" rather than counting six.
 *
 * Copy is deliberately one line per leg: this is a page someone reads
 * standing on a sidewalk.
 */
export const COURSE: CourseStage[] = [
  {
    id: "staten-island",
    mile: "Mile 0",
    place: "Staten Island",
    capability: "Start the run",
    body: "Write an ordinary function and export it. No queue to provision, no worker to babysit.",
    href: "/docs/getting-started/nextjs-quick-start?ref=long-run-course",
  },
  {
    id: "brooklyn",
    mile: "Miles 2–13",
    place: "Brooklyn",
    capability: "Durable execution",
    body: "The longest stretch of the race. A crash at mile nine picks up at mile nine.",
    href: "/platform/durable-execution?ref=long-run-course",
  },
  {
    id: "queens",
    mile: "Miles 13–15",
    place: "Queens",
    capability: "Long-running steps",
    body: "Sleep for a week. Wait for an event. Pause for a human. The run holds its place.",
    href: "/docs/learn/inngest-steps?ref=long-run-course",
  },
  {
    id: "manhattan",
    mile: "Miles 15–20",
    place: "Manhattan · First Ave",
    capability: "Retries & resume",
    body: "Something fails at hour three. Retry the step — the work banked behind it stays banked.",
    href: "/docs/guides/error-handling?ref=long-run-course",
  },
  {
    id: "bronx",
    mile: "Miles 20–21",
    place: "The Bronx",
    capability: "Observability & traces",
    body: "Mile 20 is where races are lost. See which step, which input, which attempt.",
    href: "/platform/observability?ref=long-run-course",
  },
  {
    id: "central-park",
    mile: "Mile 26.2",
    place: "Central Park",
    capability: "Evals & outcomes",
    body: "Score real production runs, and change course mid-race without losing what already worked.",
    href: "/platform/agent-evals?ref=long-run-course",
  },
];

/* ═══════════════════════════════════════════════════════════════════
 * NYC narrative cut
 *
 * The approved NYC layout runs the product story first (connection →
 * problem → product truth → run visual → proof) and lands the marathon
 * as payoff, rather than letting the campaign metaphor delay the
 * explanation. Everything below serves that cut.
 *
 * Additive on purpose: the short cut above (MARKET_COPY / FACTS /
 * COURSE) is untouched and still serves the city-agnostic page. Markets
 * opt into this narrative in LongRun.tsx.
 * ═══════════════════════════════════════════════════════════════════ */

/* ── 01 · Hero (narrative markets) ─────────────────────────────────── */

/**
 * The turn from poster to product, in the hero's right rail. Present only
 * for markets on the narrative cut; markets without it keep the short
 * lede + HERO_BODY hero above.
 */
export interface HeroNarrative {
  /** Eyebrow override for the narrative cut. */
  eyebrow: string;
  /** Emphasised line(s) opening the rail — the turn from poster to
   *  production. */
  bridge: string[];
  body: string[];
  /** Emphasised line closing the rail, under the body. */
  closer?: string;
  cta: { label: string; href: string };
  /** Second CTA beside the primary. Used for the in-page jump to the
   *  technical proof. */
  secondaryCta?: { label: string; href: string };
  /** Small line under the CTAs acknowledging the placement someone just
   *  walked past. */
  note?: string;
  /** Real product screenshot shown under the hero copy. */
  visual?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
}

export const HERO_NARRATIVE: Partial<Record<Market, HeroNarrative>> = {
  nyc: {
    eyebrow: "New York City · November 2026",
    bridge: [
      "26.2 miles is one kind of long-running.",
      "The other kind runs in production.",
    ],
    body: [
      "Agents and workflows can run for hours, days, or weeks. When something fails along the way, the work that already finished shouldn't have to start over.",
      "Inngest makes long-running work durable — checkpointing every step so failures can retry from where they happened instead of sending the whole run back to the starting line.",
    ],
    // Points at the run visual rather than off-site: the CTA promises
    // proof, so it goes to the proof.
    cta: { label: "See how it works", href: "#long-run-see-it-run" },
  },
  sf: {
    eyebrow: "San Francisco · Built here, running here",
    // No bridge line: SF leads with the product rather than the campaign,
    // so the body does the work and the marathon reference waits until
    // the campaign section much further down.
    bridge: [],
    body: [
      "Build agents and workflows that can run for minutes, hours, or days. Inngest handles durable execution, retries, and recovery so your code can pick up where it left off.",
    ],
    cta: {
      label: "Build your first long-running function",
      // `/sign-up` is a site-wide redirect to NEXT_PUBLIC_SIGNUP_URL, so
      // this resolves to the real signup app per environment. Ref tag
      // follows the repo convention: hero gets the bare page slug.
      href: "/sign-up?ref=long-run-sf",
    },
    secondaryCta: {
      label: "See how it works",
      href: `#${SF_PROOF_ANCHOR}`,
    },
    // SF's placements are scattered across the city rather than tied to
    // one weekend, so the page acknowledges the sighting without naming
    // a single moment.
    note: "Spotted us around San Francisco? You're in the right place.",
    // A real capture of the Inngest dashboard showing a multi-step run
    // trace with per-step durations — already approved and in use on
    // /compare-to-temporal. Reused rather than mocked up: the brief
    // forbids inventing a realistic-looking dashboard.
    visual: {
      src: "/assets/v1/compare-temporal/runs-dashboard.jpg",
      alt: "The Inngest dashboard showing a run trace, with each step of a multi-step function listed alongside its duration.",
      width: 1806,
      height: 1107,
    },
  },
};

/* ── 02 · The connection ───────────────────────────────────────────── */

export const CONNECTION = {
  eyebrow: "Long-running humans. Long-running agents.",
  title: ["Some things are", "built to keep going."],
  lead: [
    "A marathon doesn't happen in one step.",
    "Neither does the work your agents are doing.",
  ],
  /** Set as a wrapping run of chips — the pile-up is the argument. */
  work: [
    "Research",
    "Tool calls",
    "Human approvals",
    "Model calls",
    "External APIs",
    "Background jobs",
    "Work that waits",
    "Work that fails",
    "Work that resumes hours later",
  ],
  close: [
    "The longer the run, the more chances something has to go wrong.",
    "The question is what happens when it does.",
  ],
} as const;

/* ── 03 · The problem ──────────────────────────────────────────────── */

export interface ProblemCopy {
  eyebrow: string;
  title: string[];
  failures: string[];
  /** Lines between the failure tally and the statement. */
  setup: string[];
  /** The page's low point, set at display weight. */
  statement: string[];
  /** Optional beat after the statement. NYC answers its own question;
   *  SF's statement is already an answer, so it has none. */
  rebuttal?: string;
}

export const PROBLEM: Partial<Record<Market, ProblemCopy>> = {
  nyc: {
    eyebrow: "Mile 18. Hour three. Step 47.",
    title: ["Something", "will break."],
    failures: [
      "A model times out.",
      "An API goes down.",
      "A deploy lands mid-run.",
      "A human takes three days to approve something.",
      "A process crashes after hours of completed work.",
    ],
    setup: ["And suddenly you're faced with a very bad option:"],
    statement: ["Go back to zero", "and run the whole", "thing again?"],
    rebuttal: "No thanks.",
  },
  sf: {
    // SF has no marathon to hang the eyebrow on, and its hero already did
    // the "what a long run is made of" work — so this section carries the
    // whole problem on its own.
    eyebrow: "Long-running software",
    title: ["The longer it runs,", "the more can go wrong."],
    failures: [
      "A model times out.",
      "An API fails.",
      "A deploy lands mid-run.",
      "A human approval takes three days.",
      "A process crashes after hours of completed work.",
    ],
    setup: [
      "For work that lasts seconds, maybe that's annoying.",
      "For work that's already been running for hours?",
    ],
    statement: ["Don't start over."],
  },
};

/* ── 04 · The product truth ────────────────────────────────────────── */

export const TRUTH = {
  eyebrow: "Durable execution",
  title: ["Retry the step.", "Not the chain."],
  lead:
    "Inngest checkpoints each step as it completes, so the work behind you stays done.",
  capabilities: [
    {
      id: "duration",
      title: "Run for hours or days.",
      body: "Your function isn't tied to a single request.",
    },
    {
      id: "retry",
      title: "Retry from the point of failure.",
      body: "If step 47 fails, retry step 47 — not steps 1 through 46.",
    },
    {
      id: "wait",
      title: "Wait without keeping something alive.",
      body: "Sleep for a week. Wait for an event. Pause for a human.",
    },
    {
      id: "traces",
      title: "See what happened.",
      body: "Step-level traces show every attempt, input, and output in production.",
    },
    {
      id: "survive",
      title: "Survive the things production throws at you.",
      body: "Failures and interruptions don't have to mean starting from zero.",
    },
  ],
} as const;

/* ── 05 · See it run ───────────────────────────────────────────────── */

export type RunEntryState = "ok" | "fail" | "retry";

export interface RunEntry {
  at: string;
  label: string;
  state: RunEntryState;
}

/**
 * The campaign's hero technical proof: a multi-step run that fails at the
 * write step, retries that step alone, and finishes — without replaying
 * the plan and research steps that already completed.
 *
 * NOTE for whoever builds the richer interactive version: this is the
 * honest minimal cut. The brief is one multi-step long-running workflow
 * that fails mid-run, retries only the failed step and continues, built
 * once and reused across NYC, SF, /build, paid and social. Whatever
 * replaces this must keep the two facts the copy asserts — the run does
 * not restart, and completed work is not repeated.
 */
export const RUN: RunEntry[] = [
  { at: "00:00", label: "Run started", state: "ok" },
  { at: "00:04", label: "Plan completed", state: "ok" },
  { at: "01:32", label: "Research completed", state: "ok" },
  { at: "03:14", label: "Write failed", state: "fail" },
  { at: "03:14", label: "Retrying write…", state: "retry" },
  { at: "03:16", label: "Write completed", state: "ok" },
  { at: "03:17", label: "Run completed", state: "ok" },
];

export interface SeeItRunCopy {
  eyebrow: string;
  title: string[];
  payoff: string;
  ctaLabel: string;
  ctaHref: string;
}

const DEMO_CTA = {
  ctaLabel: "Build this workflow",
  ctaHref: "/docs/getting-started/nextjs-quick-start?ref=long-run-demo",
};

export const SEE_IT_RUN: Record<Market, SeeItRunCopy> = {
  nyc: {
    eyebrow: "See it run",
    title: ["Break something.", "Keep running."],
    payoff:
      "The run didn't restart. Neither did the work that already finished.",
    ...DEMO_CTA,
  },
  sf: {
    eyebrow: "See it run",
    title: ["Break a step.", "Keep the run."],
    payoff: "The failed step retried. The completed work didn't.",
    ...DEMO_CTA,
  },
  all: {
    eyebrow: "See it run",
    title: ["Break something.", "Keep running."],
    payoff:
      "The run didn't restart. Neither did the work that already finished.",
    ...DEMO_CTA,
  },
};

/* ── 06 · Proof ────────────────────────────────────────────────────── */

export interface ProofStat {
  figure: string;
  caption: string;
}

/**
 * Headline production numbers.
 *
 * DELIBERATELY EMPTY. Two claims are candidates — "14,892 hours, longest
 * Inngest run in production" and "27 million hours of work that didn't
 * have to start over" — but neither ships until Product/Data validates
 * the figure. The stat row renders only when this array is populated, so
 * the page cannot go live with an invented number.
 *
 * A customer line ("<customer> runs <workload> with Inngest without
 * <problem>") needs a real, cleared example, so it isn't stubbed either.
 * Until both land, the section stands on the customer logo strip — proof
 * that is already public and already true.
 */
export const PROOF_STATS: ProofStat[] = [];

export const PROOF = {
  eyebrow: "Still running",
  title: ["Built for production,", "not just the demo."],
} as const;

/* ── 07 · The campaign moment ──────────────────────────────────────── */

export interface CampaignMomentCopy {
  eyebrow: string;
  title: string[];
  body: string[];
  /** The small line under the imagery. */
  kicker: string;
  /** What the photography slot holds — shown in the review placeholder
   *  until real campaign assets land. */
  mediaNote: string;
}

export const MOMENT: Partial<Record<Market, CampaignMomentCopy>> = {
  nyc: {
    eyebrow: "New York City · 26.2 miles",
    title: ["We're here for", "the long run."],
    body: [
      "For one weekend, New York is full of people doing something objectively unreasonable for an objectively long time.",
      "We respect that.",
      "So we're showing up for the people still running — on the course and in production.",
    ],
    kicker: "Long-running humans 🤝 long-running agents.",
    mediaNote:
      "Campaign photography — street activation, wheatpaste, runners, spectator signs",
  },
};

/* ── 08 · Try ──────────────────────────────────────────────────────── */

export const TRY = {
  eyebrow: "Your turn",
  title: ["Build something", "that keeps running."],
  body: [
    "Start with an ordinary function. Break a step. Watch it retry without throwing away the work that already finished.",
    "No infrastructure to provision first.",
  ],
  primary: {
    label: "Build your first durable function",
    href: "/sign-up?ref=long-run-try",
  },
  secondary: {
    label: "Read about durable execution",
    href: "/platform/durable-execution?ref=long-run-try",
  },
  footnote: "Start free · No credit card required",
} as const;

/* ── 09 · Campaign footer ──────────────────────────────────────────── */

export const ELSEWHERE: Record<Market, { label: string; href: string }[]> = {
  nyc: [
    { label: "San Francisco", href: "/long-run/sf?ref=long-run-footer" },
    { label: "The full story", href: "/long-run?ref=long-run-footer" },
  ],
  sf: [
    { label: "New York", href: "/long-run/nyc?ref=long-run-sf-footer" },
    { label: "Build", href: "/long-run?ref=long-run-sf-footer" },
  ],
  all: [
    { label: "New York City", href: "/long-run/nyc?ref=long-run-footer" },
    { label: "San Francisco", href: "/long-run/sf?ref=long-run-footer" },
  ],
};

/* ── SF · On the ground ────────────────────────────────────────────── */

export interface Activation {
  id: string;
  name: string;
  /** Venue / date line. Say "Date to be confirmed" rather than inventing
   *  one — these render publicly. */
  meta: string;
  body: string;
  cta: {
    label: string;
    /** Omit until the real destination exists. A CTA without an href
     *  renders as a visibly unfinished placeholder rather than a dead
     *  link, so the page can't ship with one. */
    href?: string;
  };
  /** Photography slot, shown as a labelled placeholder until the real
   *  asset lands. */
  mediaNote?: string;
}

/**
 * SF's programming. Dates and RSVP destinations are deliberately not
 * filled in — none were provided, and inventing either would put wrong
 * information on a public page. Each is a one-line edit once confirmed.
 */
export const SF_ACTIVATIONS: Activation[] = [
  {
    id: "the-long-run",
    name: "The Long Run",
    meta: "Corgi Cafe · Claude Ln · October",
    body: "Our long-running drink, available all month.",
    cta: { label: "Corgi Cafe" },
    mediaNote: "Photo from the cafe — the coffee sleeve",
  },
  {
    id: "builders-who-run",
    name: "Builders Who Run",
    meta: "Date to be confirmed · San Francisco",
    body: "An easy 5K with people who ship for a living. No pace requirement. Coffee on us at the end.",
    cta: { label: "RSVP" },
  },
  {
    id: "innhouse-after-dark",
    name: "Innhouse After Dark",
    meta: "Date to be confirmed · Inngest HQ",
    body: "Bring the thing you're stuck on. We'll keep the lights on.",
    cta: { label: "RSVP" },
  },
];

export const ON_THE_GROUND = {
  eyebrow: "On the ground in San Francisco",
  title: ["Find us around the city."],
  lead: "We're building for the long run here, too.",
} as const;

/* ═══════════════════════════════════════════════════════════════════
 * SF page — revised structure (Sept 2026)
 *
 * The SF cut leads with the product and drops the campaign below it:
 * hero → the product difference → use cases → technical proof → product
 * proof → the San Francisco programming → resources → conversion.
 *
 * SF-scoped on purpose. NYC and the city-agnostic cut keep the sections
 * they already use; nothing here is wired into them.
 * ═══════════════════════════════════════════════════════════════════ */

/**
 * Verified signup destination. `/sign-up` is a site-wide redirect defined
 * in next.config.mjs from NEXT_PUBLIC_SIGNUP_URL, so it resolves to
 * whatever the environment's real signup app is rather than a hardcoded
 * host.
 *
 * LAUNCH DEPENDENCY: the campaign wants a "build your first long-running
 * function" entry point. This currently points at the standard signup
 * flow; confirm whether it should instead deep-link to a quickstart.
 */
export const SF_PRIMARY_CTA = {
  label: "Build your first long-running function",
  /** Ref tags follow the repo convention: hero gets the bare page slug,
   *  other sections get a suffix. */
  ref: { hero: "long-run-sf", final: "long-run-sf-final" },
} as const;


/* ── 02 · The product difference ───────────────────────────────────── */

export const SF_DIFFERENCE = {
  title: ["Everything is now long-running."],
  supporting: "Don't start over.",
  body:
    "If your app needs to wait for human input, run while you're away, or recover from failure, you need durable execution.",
  before: {
    label: "Before Inngest",
    headline: "Build the infrastructure yourself.",
    items: [
      "Build retry logic yourself.",
      "Track completed work manually.",
      "Manage additional orchestration infrastructure.",
    ],
  },
  after: {
    label: "With Inngest",
    headline: "Write the code. Inngest keeps it running.",
    items: [
      "Define durable steps.",
      "Resume without repeating completed steps.",
      "Use Inngest to orchestrate execution.",
    ],
  },
} as const;

/* ── 03 · Use cases ────────────────────────────────────────────────── */

export interface SfUseCase {
  id: string;
  title: string;
  body: string;
  /** Reuses the nav's existing icon set rather than introducing new art. */
  icon: NavIconName;
}

export const SF_USE_CASES: SfUseCase[] = [
  {
    id: "workflows",
    title: "Workflows",
    body: "Coordinate multi-step processes without losing completed work.",
    icon: "durable-execution",
  },
  {
    id: "background-jobs",
    title: "Background jobs",
    body: "Run work beyond the request-response cycle.",
    icon: "background-jobs",
  },
  {
    id: "ai-agents",
    title: "AI agents",
    body: "Support unpredictable sequences of model calls and tool use.",
    icon: "ai-workflows",
  },
  {
    id: "data-pipelines",
    title: "Data pipelines",
    body: "Process multi-step data operations with durable execution.",
    icon: "queues",
  },
];

/* ── 04 · Technical proof ──────────────────────────────────────────── */

export const SF_TECHNICAL_PROOF = {
  title: ["Retry the step.", "Not the chain."],
  body:
    "When a step fails, Inngest can retry it without repeating successfully completed steps.",
  supporting:
    "Your agent doesn't know how many turns or tool calls it'll need. Inngest lets you create durable steps dynamically, preserving completed work so execution can continue after a failure.",
} as const;

/* ── 05 · Product proof ────────────────────────────────────────────── */

export interface SfPillar {
  id: string;
  title: string;
  body: string;
}

export const SF_PILLARS: SfPillar[] = [
  {
    id: "keep-running",
    title: "Built to keep running",
    body: "Durable execution and retries help workflows recover from failure.",
  },
  {
    id: "understood",
    title: "Built to be understood",
    body: "Inspect runs and execution details to understand what happened.",
  },
  {
    id: "improve",
    title: "Built to improve",
    body: "Use evaluation and experimentation capabilities to iterate on your agents.",
  },
];

export const SF_PRODUCT_PROOF = {
  title: [
    "Built to keep running.",
    "Built to be understood.",
    "Built to improve.",
  ],
} as const;

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
  /** Photography slot, rendered as a labelled placeholder until an
   *  approved campaign asset exists. */
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
    title: "The Long Run (short legs).",
    body: "Find our campaign drink at Corgi Café and follow the long run from your cup to your code.",
    detail: "Starting October 1.",
    mediaNote: "Approved campaign drink photo — cup or sleeve artwork",
  },
  {
    id: "run-club",
    title: "Run with us.",
    body: "Join the Inngest community for a run in San Francisco. All paces welcome.",
    pending: "Date to be confirmed.",
  },
  {
    id: "community",
    title: "Keep the long run going.",
    body: "Join us for another opportunity to connect with San Francisco builders.",
    pending: "Date, venue and format to be confirmed.",
  },
];

export const SF_CAMPAIGN = {
  eyebrow: "The long run · San Francisco",
  title: ["Long-running humans.", "Long-running agents."],
  body: "We're bringing Build for the Long Run to San Francisco through coffee, community, and a few opportunities to get moving.",
} as const;

/* ── 08 · Final conversion ─────────────────────────────────────────── */

export const SF_CLOSER = {
  title: ["Your next long run", "starts here."],
  body: "Build your first durable workflow with Inngest.",
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
    href: "/blog/how-durable-workflow-engines-work?ref=long-run-sf-resources",
  },
  {
    id: "visual-primer",
    kind: "Walkthrough",
    title: "What are Durable Functions? A visual JavaScript primer",
    href: "/blog/durable-functions-a-visual-javascript-primer?ref=long-run-sf-resources",
  },
  {
    id: "steps-guide",
    kind: "Developer guide",
    title: "Steps in Inngest: checkpointed, retriable units of work",
    href: "/docs/learn/inngest-steps?ref=long-run-sf-resources",
  },
];

export const SF_RESOURCES_COPY = {
  title: ["Keep building."],
  body: "Explore the technical ideas behind long-running agents and workflows.",
} as const;
