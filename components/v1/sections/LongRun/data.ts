/**
 * "Build for the long run" campaign data — the single source of truth for
 * the OOH/DOOH landing page at step.run/{nyc,sf,build}.
 *
 * Scoped deliberately tight. This page catches someone who just scanned a
 * QR code off a poster or a chalk stencil, so it carries the campaign line,
 * one explanation of what Inngest does, the course, and a CTA — nothing
 * from the internal pitch (pillars, metaphor rationale, media plan).
 *
 * The SF cut runs longer than the street-traffic default. Its placements
 * are in-person and conversational (a run club, a drink sponsorship, an
 * after-hours office night) rather than a poster someone walks past, so
 * the page has to do the explaining the activation didn't: what
 * "long-running" actually means, where to read further, and where to find
 * us next. Those sections are market-gated, not global.
 *
 * SF also runs on a different metaphor. New York's placement is the
 * marathon, so that page is built on distance. San Francisco's programme
 * is barely a running programme at all — one run club against a drink
 * sponsorship, a coffee cart and an office open until 3 AM — so its
 * through-line is the hours instead: the work that doesn't stop when the
 * workday does. That reading is also closer to the product, since
 * "long-running" is a property of time.
 */

export type Market = "nyc" | "sf" | "all";

/* ── Hero ──────────────────────────────────────────────────────────── */

interface MarketCopy {
  /** Uppercase eyebrow above the headline — anchors the page to the
   *  placement the visitor just walked past. */
  eyebrow: string;
  /**
   * The opening line. Names the city either way, so the page reads as a
   * continuation of the placement rather than a generic product page —
   * but the register differs by market. NYC rewards a scan off a poster
   * ("you just walked past us"); SF greets someone we've most likely
   * already met in person, at the run club or over a sponsored drink.
   */
  lede: string;
}

export const MARKET_COPY: Record<Market, MarketCopy> = {
  nyc: {
    eyebrow: "New York City · Marathon Sunday, Nov 1",
    lede: "You just walked past us in New York.",
  },
  sf: {
    eyebrow: "San Francisco · Built here, running here",
    lede: "It's good to see you, San Francisco.",
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
  /**
   * The marker on the leg — a mile for New York's route, a clock time
   * for San Francisco's day. Free text so both read naturally.
   */
  marker: string;
  /** Borough, neighbourhood, or wherever the leg happens. */
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
    marker: "Mile 0",
    place: "Staten Island",
    capability: "Start the run",
    body: "Write an ordinary function and export it. No queue to provision, no worker to babysit.",
    href: "/docs/getting-started/nextjs-quick-start?ref=long-run-course",
  },
  {
    id: "brooklyn",
    marker: "Miles 2–13",
    place: "Brooklyn",
    capability: "Durable execution",
    body: "The longest stretch of the race. A crash at mile nine picks up at mile nine.",
    href: "/platform/durable-execution?ref=long-run-course",
  },
  {
    id: "queens",
    marker: "Miles 13–15",
    place: "Queens",
    capability: "Long-running steps",
    body: "Sleep for a week. Wait for an event. Pause for a human. The run holds its place.",
    href: "/docs/learn/inngest-steps?ref=long-run-course",
  },
  {
    id: "manhattan",
    marker: "Miles 15–20",
    place: "Manhattan · First Ave",
    capability: "Retries & resume",
    body: "Something fails at hour three. Retry the step — the work banked behind it stays banked.",
    href: "/docs/guides/error-handling?ref=long-run-course",
  },
  {
    id: "bronx",
    marker: "Miles 20–21",
    place: "The Bronx",
    capability: "Observability & traces",
    body: "Mile 20 is where races are lost. See which step, which input, which attempt.",
    href: "/platform/observability?ref=long-run-course",
  },
  {
    id: "central-park",
    marker: "Mile 26.2",
    place: "Central Park",
    capability: "Evals & outcomes",
    body: "Score real production runs, and change course mid-race without losing what already worked.",
    href: "/platform/agent-evals?ref=long-run-course",
  },
];

/* ── What "long-running" actually means ────────────────────────────── */

/**
 * PLACEHOLDER COPY — the shape is settled, the words are not.
 *
 * "Long-running" is the term the whole campaign leans on and the one thing
 * a poster can't define. The ladder measures real work against the ~30
 * seconds a request gets, so the term stops being vague: nearly everything
 * worth running is already off the end of it.
 *
 * The workday row is doing the campaign's work. Sitting a human's eight
 * hours directly under an agent's makes the page's whole argument in two
 * lines — they're the same order of magnitude, and neither of them fits in
 * a request. (New York's cut of this section swaps in "A marathon runs 4.5
 * hours" instead, where the race is the placement.)
 *
 * Ordered short → long so the reader's own workload lands somewhere on it.
 */
export const DURATIONS = [
  { subject: "An HTTP request", verb: "gets", length: "~30 seconds" },
  { subject: "A workday", verb: "runs", length: "8 hours" },
  { subject: "An agent", verb: "runs for", length: "hours" },
  { subject: "A migration", verb: "runs for", length: "months" },
  { subject: "A service", verb: "runs for", length: "years" },
] as const;

/**
 * The turn: everything above the request line breaks the assumption a
 * normal serverless function is built on. One line each — this is the
 * moment the reader recognises their own bug.
 */
export const FAILURES = [
  "A step errors at hour three.",
  "The model times out and takes the run with it.",
  "A deploy lands mid-run.",
  "Context is lost, and nobody can say which attempt lost it.",
] as const;

/* ── Further reading ───────────────────────────────────────────────── */

export interface Reference {
  id: string;
  /** Short kicker — what kind of thing this is. */
  kind: string;
  title: string;
  body: string;
  href: string;
}

/**
 * Where to go after the page. An in-person conversation ends without a
 * URL, so this section is the one that has to survive the walk home —
 * three depths (concept, mechanics, proof) rather than a link dump.
 */
export const REFERENCES: Reference[] = [
  {
    id: "durable-execution",
    kind: "The concept",
    title: "What durable execution is",
    body: "The model underneath all of it: why checkpointing each step changes what you can safely run for hours.",
    href: "/platform/durable-execution?ref=long-run-sf-references",
  },
  {
    id: "steps",
    kind: "The mechanics",
    title: "Steps, sleeps and waits",
    body: "How a function pauses for a week, waits on a human, and picks up exactly where it stopped.",
    href: "/docs/learn/inngest-steps?ref=long-run-sf-references",
  },
  {
    id: "flow-control",
    kind: "The mechanics",
    title: "Flow control and concurrency",
    body: "Throttling, debounce, and per-tenant concurrency — the controls that keep a long run from taking everything else down with it.",
    href: "/docs/guides/flow-control?ref=long-run-sf-references",
  },
  {
    id: "observability",
    kind: "The mechanics",
    title: "Step-level traces",
    body: "Every attempt of every step, with its input and output, in production rather than in a local replay.",
    href: "/platform/observability?ref=long-run-sf-references",
  },
  {
    id: "customers",
    kind: "The proof",
    title: "Teams running this in production",
    body: "What long-running work looks like for people already shipping it — the runs, the scale, the failure modes.",
    href: "/customers?ref=long-run-sf-references",
  },
  {
    id: "quickstart",
    kind: "Start here",
    title: "Your first durable function",
    body: "Fifteen minutes, in the codebase you already have. No queue to provision first.",
    href: "/docs/getting-started/nextjs-quick-start?ref=long-run-sf-references",
  },
];

/* ── Activations: where to find us on the ground ───────────────────── */

export interface Activation {
  id: string;
  title: string;
  /** Display copy for the date. Free text so "Every Thursday" works. */
  when: string;
  /** ISO 8601 start, for sorting and the upcoming/past split. */
  startsAt: string;
  /**
   * ISO 8601 end. Needed for anything that spans days — without it a
   * multi-day activation would flip to "past" on its own opening morning.
   * Single-session activations can leave it off.
   */
  endsAt?: string;
  venue: string;
  neighborhood: string;
  body: string;
  /** RSVP / details. Omit for a drop-in with nothing to sign up for. */
  href?: string;
  linkLabel?: string;
  /**
   * A standing thing rather than a dated one (a drink sponsorship that
   * runs all quarter). Renders as "Ongoing" and sorts with the upcoming
   * block regardless of `startsAt`.
   */
  ongoing?: boolean;
}

/**
 * PLACEHOLDER SCHEDULE — dates and venues are stand-ins so the section can
 * be reviewed with real states in it. Swap for the confirmed calendar
 * before the page ships.
 *
 * This is the section the in-person program actually feeds. Someone who
 * met us at a run club or picked up a sponsored drink lands here to find
 * out what else is happening, so it carries both tenses: what's next, and
 * what they missed. Past entries stay on the page deliberately — proof the
 * campaign is a real, recurring thing rather than one flyer.
 */
export const SF_ACTIVATIONS: Activation[] = [
  {
    id: "corgi-cafe",
    title: "The next one's on us at Corgi Cafe",
    when: "All quarter",
    startsAt: "2026-09-01T08:00:00-07:00",
    endsAt: "2026-12-31T18:00:00-08:00",
    ongoing: true,
    venue: "Corgi Cafe",
    neighborhood: "Inner Sunset",
    body: "We're covering a drink. Tag us in a photo of it on LinkedIn and the next one's on us too — the run keeps going as long as you do.",
    href: "https://www.linkedin.com/company/inngest/",
    linkLabel: "Tag us on LinkedIn",
  },
  {
    id: "builders-who-run",
    title: "Builders Who Run",
    when: "Every other Saturday · 8 AM",
    startsAt: "2026-09-19T08:00:00-07:00",
    venue: "Meet at the Ferry Building",
    neighborhood: "Embarcadero",
    body: "An easy 5K along the water with people who ship for a living. No pace requirement, no pitch — coffee at the end.",
    href: "https://lu.ma/inngest",
    linkLabel: "RSVP",
  },
  {
    id: "midnight-matcha",
    title: "Midnight Matcha · Innhouse After Dark",
    when: "Thursday, October 15 · 9 PM – 3 AM",
    startsAt: "2026-10-15T21:00:00-07:00",
    endsAt: "2026-10-16T03:00:00-07:00",
    venue: "Inngest HQ",
    neighborhood: "SoMa",
    body: "The office stays open and the matcha stays on. Bring the thing you're stuck on — long-running work tends to get debugged at hours like these anyway.",
    href: "https://lu.ma/inngest",
    linkLabel: "RSVP",
  },
  {
    id: "coffee-cart",
    title: "Coffee cart on the Panhandle",
    when: "Friday, October 30 · 7–10 AM",
    startsAt: "2026-10-30T07:00:00-07:00",
    venue: "Panhandle, near Masonic",
    neighborhood: "NoPa",
    body: "Free coffee on the commute for anyone running, riding, or walking past. No talk track, no badge scan.",
  },
  {
    id: "mini-mic",
    title: "Mini-mic: what are you actually running?",
    when: "Wednesday, November 11 · 6 PM",
    startsAt: "2026-11-11T18:00:00-08:00",
    venue: "Inngest HQ",
    neighborhood: "SoMa",
    body: "Short, recorded conversations with people shipping agents in production. Come to talk, or come to listen to what everyone else is fighting.",
    href: "https://lu.ma/inngest",
    linkLabel: "RSVP",
  },
  {
    id: "sf-marathon-cheer",
    title: "Cheer station at the SF Marathon",
    when: "Sunday, July 26",
    startsAt: "2026-07-26T06:00:00-07:00",
    endsAt: "2026-07-26T13:00:00-07:00",
    venue: "Mile 19, Golden Gate Park",
    neighborhood: "Golden Gate Park",
    body: "Mile 19 is where the race gets decided. We brought signs, water, and a lot of noise for the people still out there.",
  },
];

/**
 * Upcoming first (soonest leads, with standing activations pinned to the
 * top of that block), then past newest-first — the same ordering the
 * /events page uses, so the two read consistently.
 *
 * Pass `isPast` in rather than importing the events helper here: this
 * module is imported during render, and a date-dependent module-level
 * constant would bake the build time into a static page.
 */
export function sortActivations(
  activations: Activation[],
  isPast: (a: { startsAt: string; endsAt?: string }) => boolean,
): Activation[] {
  const upcoming = activations
    .filter((a) => !isPast(a))
    .sort((a, b) => {
      if (a.ongoing !== b.ongoing) return a.ongoing ? -1 : 1;
      return a.startsAt.localeCompare(b.startsAt);
    });
  const past = activations
    .filter((a) => isPast(a))
    .sort((a, b) => b.startsAt.localeCompare(a.startsAt));
  return [...upcoming, ...past];
}

/* ── The SF day: hours → capabilities ──────────────────────────────── */

/**
 * The SF cut of the course device, on a clock instead of a route.
 *
 * New York's placement is the marathon, so distance is the right axis
 * there. San Francisco's isn't a race — it's a run club, a drink
 * sponsorship, a coffee cart and an office that stays open until 3 AM —
 * so the shared idea isn't distance, it's the hours. Which is also the
 * more literal reading of the product: "long-running" is a property of
 * time, and a route only ever implied that.
 *
 * The hinge is 17:00. Everything above it is an ordinary workday;
 * everything below it is the part the campaign is actually about — the
 * work, human and otherwise, that doesn't stop when the office does.
 * Each leg is pinned to a real SF activation so the page and the street
 * programme describe the same day.
 */
export const SF_DAY: CourseStage[] = [
  {
    id: "0600",
    marker: "06:00",
    place: "Ferry Building",
    capability: "Start the run",
    body: "The run club sets off. Write an ordinary function, export it — no queue to provision first.",
    href: "/docs/getting-started/nextjs-quick-start?ref=long-run-sf-course",
  },
  {
    id: "0900",
    marker: "09:00",
    place: "SoMa",
    capability: "Durable execution",
    body: "The long flat stretch of the day. Every step checkpoints as it finishes, so a crash picks up where it stopped.",
    href: "/platform/durable-execution?ref=long-run-sf-course",
  },
  {
    id: "1300",
    marker: "13:00",
    place: "Inner Sunset",
    capability: "Long-running steps",
    body: "Sleep for a week. Wait for an event. Pause for a human who's gone to lunch. The run holds its place.",
    href: "/docs/learn/inngest-steps?ref=long-run-sf-course",
  },
  {
    id: "1700",
    marker: "17:00",
    place: "Everywhere else",
    capability: "Retries & resume",
    body: "The hour a request would have given up. A step failed at three and retried on its own — the work banked behind it stayed banked.",
    href: "/docs/guides/error-handling?ref=long-run-sf-course",
  },
  {
    id: "2100",
    marker: "21:00",
    place: "Inngest HQ",
    capability: "Observability & traces",
    body: "The office is quiet and something's off in prod. See which step, which input, which attempt — not a local replay.",
    href: "/platform/observability?ref=long-run-sf-course",
  },
  {
    id: "0300",
    marker: "03:00",
    place: "Still going",
    capability: "Evals & outcomes",
    body: "Score the runs that happened while you slept, and change course without losing what already worked.",
    href: "/platform/agent-evals?ref=long-run-sf-course",
  },
];

interface CourseCopy {
  eyebrow: string;
  title: string;
  body: string;
  stages: CourseStage[];
}

/**
 * Which course a market gets. `all` (step.run/build, no city context)
 * keeps New York's — it's the campaign's flagship route and the one the
 * OOH creative is built around.
 */
export const COURSE_COPY: Record<Market, CourseCopy> = {
  nyc: {
    eyebrow: "26.2 miles",
    title: "Five boroughs and a finish line.",
    body: "The course crosses all five boroughs and ends in Central Park. Every leg of it is something Inngest does for work that runs long.",
    stages: COURSE,
  },
  sf: {
    eyebrow: "06:00 – 03:00",
    title: "The work doesn't stop at five.",
    body: "San Francisco keeps going long after the office lights go off, and so does everything you left running. Here's one day of it — the hours, and what Inngest is doing in each of them.",
    stages: SF_DAY,
  },
  all: {
    eyebrow: "26.2 miles",
    title: "Five boroughs and a finish line.",
    body: "The course crosses all five boroughs and ends in Central Park. Every leg of it is something Inngest does for work that runs long.",
    stages: COURSE,
  },
};

/* ═══════════════════════════════════════════════════════════════════
 * NYC narrative cut
 *
 * The approved NYC layout runs the product story first (connection →
 * problem → product truth → run visual → proof) and lands the marathon
 * as payoff, rather than letting the campaign metaphor delay the
 * explanation. Everything below serves that cut.
 *
 * Additive on purpose: the SF page still runs on MARKET_COPY / FACTS /
 * COURSE / DURATIONS / REFERENCES / SF_ACTIVATIONS above, and none of
 * those change. Markets opt into this narrative in LongRun.tsx.
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
