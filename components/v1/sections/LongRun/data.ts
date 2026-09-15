/**
 * "Build for the long run" campaign data — the single source of truth for
 * the OOH/DOOH landing page at step.run/{nyc,sf,build}.
 *
 * Scoped deliberately tight. This page catches someone who just scanned a
 * QR code off a poster or a chalk stencil, so it carries the campaign line,
 * one explanation of what Inngest does, the course, and a CTA — nothing
 * from the internal pitch (pillars, metaphor rationale, media plan).
 */

export type Market = "nyc" | "sf" | "all";

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
  /** The two lines bridging the marathon to production. */
  bridge: string[];
  body: string[];
  cta: { label: string; href: string };
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

export const PROBLEM = {
  eyebrow: "Mile 18. Hour three. Step 47.",
  title: ["Something", "will break."],
  failures: [
    "A model times out.",
    "An API goes down.",
    "A deploy lands mid-run.",
    "A human takes three days to approve something.",
    "A process crashes after hours of completed work.",
  ],
  setup: "And suddenly you're faced with a very bad option:",
  badOption: ["Go back to zero", "and run the whole", "thing again?"],
  rebuttal: "No thanks.",
} as const;

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

export const SEE_IT_RUN = {
  eyebrow: "See it run",
  title: ["Break something.", "Keep running."],
  payoff: "The run didn't restart. Neither did the work that already finished.",
  ctaLabel: "Build this workflow",
  ctaHref: "/docs/getting-started/nextjs-quick-start?ref=long-run-demo",
} as const;

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
    { label: "New York City", href: "/long-run/nyc?ref=long-run-footer" },
    { label: "The full story", href: "/long-run?ref=long-run-footer" },
  ],
  all: [
    { label: "New York City", href: "/long-run/nyc?ref=long-run-footer" },
    { label: "San Francisco", href: "/long-run/sf?ref=long-run-footer" },
  ],
};
