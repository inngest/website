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
