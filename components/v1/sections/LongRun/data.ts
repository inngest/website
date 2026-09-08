/**
 * "Build for the long run" campaign data — the single source of truth for
 * the OOH/DOOH landing page at step.run/{nyc,sf,build}.
 *
 * Copy here comes straight from the campaign deck (Sept 2026), so it stays
 * in lockstep with the posters, chalk, and DOOH creative. Edit this file
 * rather than the sections when the creative changes.
 */

export type Market = "nyc" | "sf" | "all";

/* ── Hero ──────────────────────────────────────────────────────────── */

interface MarketCopy {
  /** Uppercase eyebrow above the headline — anchors the page to the
   *  placement the visitor just walked past. */
  eyebrow: string;
  /** One line under the standing sub-headline, specific to the market. */
  lede: string;
}

export const MARKET_COPY: Record<Market, MarketCopy> = {
  // NYC's job is "make it famous" — the marathon is the anchor.
  nyc: {
    eyebrow: "New York City · Marathon Sunday, Nov 1",
    lede: "You just walked past us in New York. 26.2 miles is a long-running process with a crowd.",
  },
  // SF's job is "make it credible" — community, not spectacle.
  sf: {
    eyebrow: "San Francisco · Built here, running here",
    lede: "You just walked past us in San Francisco. The agents you're shipping run a lot longer than a request.",
  },
  all: {
    eyebrow: "Build for the long run",
    lede: "Things worth building take time. Your infrastructure should assume that.",
  },
};

/* ── The durations ladder ──────────────────────────────────────────── */

/** "The longer something runs, the more there is to go wrong." */
export const DURATIONS = [
  { subject: "An agent", verb: "runs for", length: "hours" },
  { subject: "A marathon", verb: "runs", length: "4.5 hours" },
  { subject: "A migration", verb: "runs for", length: "months" },
  { subject: "A service", verb: "runs for", length: "years" },
] as const;

/** What actually goes wrong out there. */
export const FAILURES = [
  "A step errors at hour three.",
  "Context is lost.",
  "Something times out.",
] as const;

/* ── The course: boroughs → capabilities ───────────────────────────── */

export interface CourseStage {
  id: string;
  /** Mile marker as it appears on the course. */
  mile: string;
  /** Borough / landmark. */
  place: string;
  /** The Inngest capability this leg stands for. */
  capability: string;
  body: string;
  href: string;
  /** Link label — kept short so the card footer holds one line. */
  linkLabel: string;
}

/**
 * The campaign's centrepiece: the real NYC marathon route, borough by
 * borough, mapped onto what Inngest does over a long run. Order and mile
 * markers follow the actual course — Staten Island start, the long
 * Brooklyn stretch, Queens, First Avenue, a lap of the Bronx, then Central
 * Park.
 */
export const COURSE: CourseStage[] = [
  {
    id: "staten-island",
    mile: "Mile 0",
    place: "Staten Island",
    capability: "Start the run",
    body: "Write an ordinary function and export it. No queue to provision, no worker to babysit, no state machine to draw first.",
    href: "/docs/getting-started/nextjs-quick-start?ref=long-run-course",
    linkLabel: "Quick start",
  },
  {
    id: "brooklyn",
    mile: "Miles 2–13",
    place: "Brooklyn",
    capability: "Durable execution",
    body: "The longest stretch of the race. Every step checkpoints as it completes, so a crash at mile nine picks up at mile nine.",
    href: "/platform/durable-execution?ref=long-run-course",
    linkLabel: "Durable execution",
  },
  {
    id: "queens",
    mile: "Miles 13–15",
    place: "Queens",
    capability: "Long-running steps",
    body: "Sleep for a week. Wait for an event. Pause for a human to approve. The run holds its place instead of holding a connection open.",
    href: "/docs/learn/inngest-steps?ref=long-run-course",
    linkLabel: "Steps",
  },
  {
    id: "manhattan",
    mile: "Miles 15–20",
    place: "Manhattan · First Ave",
    capability: "Retries & resume",
    body: "Something fails at hour three. Retry the step, not the chain — the work already banked behind it stays banked.",
    href: "/docs/guides/error-handling?ref=long-run-course",
    linkLabel: "Error handling",
  },
  {
    id: "bronx",
    mile: "Miles 20–21",
    place: "The Bronx",
    capability: "Observability & traces",
    body: "Mile 20 is where races are lost. Step-level traces tell you which step, which input, which attempt — not just that the run went red.",
    href: "/platform/observability?ref=long-run-course",
    linkLabel: "Observability",
  },
  {
    id: "central-park",
    mile: "Mile 26.2",
    place: "Central Park",
    capability: "Evals & outcomes",
    body: "Finishing and finishing well are different things. Score real production runs, then change course without throwing away what already worked.",
    href: "/platform/agent-evals?ref=long-run-course",
    linkLabel: "Agent evals",
  },
];

/* ── The three pillars ─────────────────────────────────────────────── */

export const PILLARS = [
  {
    id: "reliability",
    kicker: "Built to keep running.",
    title: "Reliability",
    body: "Work runs for hours, days or longer without making you manage queues, state, retries and recovery yourself.",
  },
  {
    id: "agnostic",
    kicker: "Built to keep changing.",
    title: "Agnostic",
    body: "Models change. Runtimes change. Tools change. Your stack changes. Inngest doesn't ask you to bet your application on one of them.",
  },
  {
    id: "optimization",
    kicker: "Built to keep getting better.",
    title: "Optimization",
    body: "Evals tell you what worked, what didn't, and where to change course — without throwing away everything that came before.",
  },
] as const;

/* ── Why a marathon ────────────────────────────────────────────────── */

/** The same phrase, three vocabularies. We don't have to invent the
 *  metaphor — we just have to claim it. */
export const METAPHOR = [
  { who: "Engineers say", phrase: "long-running process", mono: false },
  { who: "Inngest says", phrase: "step.run()", mono: true },
  { who: "Runners say", phrase: "Sunday long run", mono: false },
] as const;

/* ── Where to find us ──────────────────────────────────────────────── */

export interface CityActivations {
  city: string;
  /** The city's job in the campaign. */
  role: string;
  window: string;
  items: string[];
}

export const CITIES: Record<"nyc" | "sf", CityActivations> = {
  nyc: {
    city: "New York City",
    role: "Makes it visible",
    window: "October – November 2026",
    items: [
      "Marathon Sunday, November 1 — mile-marker signs and a cheer squad",
      "Coffee carts on the course",
      "Sidewalk chalk and spectator signs",
      "Wild posters across the boroughs",
      "Founders run club",
    ],
  },
  sf: {
    city: "San Francisco",
    role: "Makes it credible",
    window: "October – December 2026",
    items: [
      "Midnight Matcha — Innhouse After Dark, 9pm–3am",
      "Builders Who Run + Founders Run Club",
      "A recurring coffee cart",
      "Mini-mic interviews with people shipping agents",
    ],
  },
};
