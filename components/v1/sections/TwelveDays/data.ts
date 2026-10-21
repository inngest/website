/**
 * "The 12 Days of Workflows" — Inngest × CodeTV holiday campaign, in
 * the Build for the Lonng Run brand.
 *
 * Copy for inngest.com/12-days-of-workflows. Twelve short video lessons,
 * one Inngest primitive each, behind an advent calendar whose doors
 * unlock at midnight Pacific. Ends with a live CodeTV episode building a
 * Rube Goldberg machine out of all twelve.
 *
 * DRAFT: the lesson list, dates and prizes are placeholders until the
 * lineup (Mitch), shoot schedule and budget are final. Everything the
 * page says lives here so those land as data edits, not layout changes.
 */

const REF = "12-days-of-workflows";

/** Year the calendar runs. Bump this (and nothing else) to rerun it. */
export const YEAR = 2026;

/**
 * Midnight Pacific on December `day`. December is always PST (UTC-8),
 * so the offset is fixed rather than looked up.
 */
export function unlockAt(day: number): Date {
  return new Date(`${YEAR}-12-${String(day).padStart(2, "0")}T00:00:00-08:00`);
}

/** Campaign colours, sampled from the poster art. */
export const COLORS = {
  salmon: "#F55C50",
  blue: "#0035F1",
  lime: "#ECFE08",
  green: "#0BDD48",
  cream: "#FBF0A8",
  ink: "#010101",
} as const;

export interface WorkflowDay {
  day: number;
  /** The primitive the lesson teaches. */
  primitive: string;
  /** The song line — "On the Nth day of workflows, Inngest gave to me…" */
  gift: string;
  /** One or two sentences on what it does and why it matters. */
  body: string;
  /** Short, real SDK code. Keep it to a few lines; the door is small. */
  code: string;
  docs: { label: string; href: string };
  /** The lesson video, once it's cut. Until then the door shows a slot. */
  video?: string;
}

export const DAYS: WorkflowDay[] = [
  {
    day: 1,
    primitive: "Background jobs",
    gift: "A job that runs in the background",
    body: "Move slow work off the request. Wrap it in step.run and a failure retries just that step, while everything that already finished stays finished.",
    code: `await step.run("send-welcome", () =>\n  email.send(user)\n);`,
    docs: {
      label: "Background jobs",
      href: `/docs/guides/background-jobs?ref=${REF}`,
    },
  },
  {
    day: 2,
    primitive: "Sleeps",
    gift: "Two sleeps a-sleeping",
    body: "Pause a function for seconds or for weeks. No queue to babysit, no server held open while it waits.",
    code: `await step.sleep("wait-a-day", "1d");`,
    docs: {
      label: "Sleeps",
      href: `/docs/features/inngest-functions/steps-workflows/sleeps?ref=${REF}`,
    },
  },
  {
    day: 3,
    primitive: "Wait for human input",
    gift: "Three humans approving",
    body: "Stop mid-function and wait for a person to click approve, with a timeout in case they never do.",
    code: `await step.waitForEvent("approval", {\n  event: "app/expense.approved",\n  timeout: "3d",\n});`,
    docs: {
      label: "Wait for event",
      href: `/docs/features/inngest-functions/steps-workflows/wait-for-event?ref=${REF}`,
    },
  },
  {
    day: 4,
    primitive: "Fan-out",
    gift: "Four jobs a-fanning",
    body: "Send one event per item and let each run on its own. One slow job never holds up the rest.",
    code: `await step.sendEvent("fan-out",\n  users.map((u) => ({\n    name: "app/user.nudge",\n    data: u,\n  }))\n);`,
    docs: {
      label: "Fan-out jobs",
      href: `/docs/guides/fan-out-jobs?ref=${REF}`,
    },
  },
  {
    day: 5,
    primitive: "Cron jobs",
    gift: "Five golden crons",
    body: "Schedule a function with a cron expression, in whatever timezone the work lives in. It's also how these doors open.",
    code: `triggers: {\n  cron: "TZ=America/Los_Angeles 0 9 * * 1",\n}`,
    docs: {
      label: "Scheduled functions",
      href: `/docs/guides/scheduled-functions?ref=${REF}`,
    },
  },
  {
    day: 6,
    primitive: "Throttling",
    gift: "Six throttles throttling",
    body: "Cap how fast a function runs, per user or per API key, so the third-party API on the other end stays happy.",
    code: `throttle: {\n  limit: 6,\n  period: "1m",\n  key: "event.data.user_id",\n}`,
    docs: {
      label: "Throttling",
      href: `/docs/guides/throttling?ref=${REF}`,
    },
  },
  {
    day: 7,
    primitive: "Batching",
    gift: "Seven batches batching",
    body: "Collect events and process them together: one bulk insert instead of a hundred tiny ones.",
    code: `batchEvents: {\n  maxSize: 100,\n  timeout: "7s",\n}`,
    docs: {
      label: "Batching",
      href: `/docs/guides/batching?ref=${REF}`,
    },
  },
  {
    day: 8,
    primitive: "AI steps",
    gift: "Eight models a-wrapping",
    body: "Turn each LLM call into a step, with prompts and tokens in the trace and retries when the provider hiccups.",
    code: `await step.ai.wrap("draft-reply",\n  generateText,\n  { model, prompt }\n);`,
    docs: {
      label: "AI orchestration",
      href: `/docs/features/inngest-functions/steps-workflows/step-ai-orchestration?ref=${REF}`,
    },
  },
  {
    day: 9,
    primitive: "Debounce",
    gift: "Nine debounces debouncing",
    body: "When events arrive in a flurry, wait for the dust to settle and run once with the latest one.",
    code: `debounce: {\n  key: "event.data.customer_id",\n  period: "9s",\n}`,
    docs: {
      label: "Debounce",
      href: `/docs/guides/debounce?ref=${REF}`,
    },
  },
  {
    day: 10,
    primitive: "Cancellation",
    gift: "Ten runs a-cancelling",
    body: "Stop a run the moment it stops making sense, like a reminder for an order that was just cancelled.",
    code: `cancelOn: [{\n  event: "app/order.cancelled",\n  match: "data.orderId",\n}]`,
    docs: {
      label: "Cancel on events",
      href: `/docs/features/inngest-functions/cancellation/cancel-on-events?ref=${REF}`,
    },
  },
  {
    day: 11,
    primitive: "Concurrency",
    gift: "Eleven tenants queueing",
    body: "Give every customer their own concurrency limit, so one noisy tenant can't take the whole queue.",
    code: `concurrency: {\n  limit: 11,\n  key: "event.data.tenant_id",\n}`,
    docs: {
      label: "Concurrency",
      href: `/docs/guides/concurrency?ref=${REF}`,
    },
  },
  {
    day: 12,
    primitive: "Checkpointing",
    gift: "Twelve steps checkpointing",
    body: "Every completed step is saved as it finishes, so a run that falls over picks up where it left off. On by default in v4.",
    code: `new Inngest({\n  id: "my-app",\n  checkpointing: {\n    maxRuntime: "800s",\n  },\n});`,
    docs: {
      label: "Checkpointing",
      href: `/docs/setup/checkpointing?ref=${REF}`,
    },
  },
];

/**
 * Where each day sits on the calendar. Real advent calendars scatter the
 * numbers so you have to hunt for today's door; this is a fixed shuffle
 * so the layout is the same for everyone.
 */
export const DOOR_ORDER = [7, 2, 11, 4, 9, 1, 12, 5, 3, 10, 6, 8];

/** Door front colours, cycled by day. Ink is the number and outline. */
export const DOOR_FACES = [
  { bg: COLORS.salmon, ink: COLORS.ink, num: "#FFFFFF" },
  { bg: COLORS.lime, ink: COLORS.ink, num: COLORS.ink },
  { bg: COLORS.green, ink: COLORS.ink, num: COLORS.ink },
  { bg: COLORS.cream, ink: COLORS.ink, num: COLORS.salmon },
  { bg: COLORS.ink, ink: COLORS.ink, num: COLORS.lime },
  { bg: "#FFFFFF", ink: COLORS.ink, num: COLORS.blue },
];

/**
 * The cron function that opens the doors, shown on the page.
 *
 * NOT WIRED UP YET: the page currently unlocks doors from the visitor's
 * clock (see useCalendarClock). Making this real needs a serve endpoint
 * on the website, somewhere to store which doors are open, and a public
 * dashboard view to link to.
 */
export const UNLOCK_FUNCTION = `inngest.createFunction(
  {
    id: "open-todays-door",
    triggers: {
      cron: "TZ=America/Los_Angeles 0 0 1-12 12 *",
    },
  },
  async ({ step }) => {
    const day = await step.run("which-door", () =>
      new Date().getDate()
    );
    await step.run("open-door", () =>
      calendar.open(day)
    );
  }
);`;

export const HERO = {
  chips: ["Inngest × CodeTV", "12 lessons", "Dec 1–12"],
  // Set like the posters: a huge line, a mono line, a huge line.
  // Read as one heading: "12 days of weird workflows that refuse to
  // stop running".
  titleTop: "12 Days",
  titleMid: "of weird workflows that refuse to stop",
  titleBottom: "Running",
  label: "The 12 Days of Workflows",
  body: "Twelve short video lessons, one Inngest primitive a day. A new door unlocks every night at midnight Pacific, opened by a cron job you can watch run. Finish the run for merch and raffle entries.",
  cta: { label: "Start Free", href: `/sign-up?ref=${REF}` },
} as const;

export const CALENDAR = {
  eyebrow: "The calendar",
  title: "No peeking.",
  body: "Doors open at midnight Pacific. Each one is a lesson, from 30 seconds to 4 minutes, plus the code and the docs.",
} as const;

export const HOW_IT_OPENS = {
  eyebrow: "How the doors open",
  title: "A cron job. Obviously.",
  body: "Every night at midnight, an Inngest function wakes up and opens the next door. When the calendar opens, you'll be able to watch it run live in the Inngest dashboard.",
} as const;

/** Completion rewards. Amounts and designs are still being decided. */
export const PRIZES = {
  eyebrow: "Finish the run",
  title: "Solid days get merch.",
  items: [
    {
      kicker: "Every lesson",
      title: "One raffle entry.",
      body: "Each lesson you finish is another entry in the Inngest credits raffle.",
    },
    {
      kicker: "9 of 12",
      title: "Exclusive merch.",
      body: "Finish nine lessons for limited-run merch, drawn by an artist we're commissioning for the campaign.",
    },
    {
      kicker: "12 of 12",
      title: "The full set.",
      body: "Every door, every lesson. The complete-run piece, with the artist's signature on the back of the neck.",
    },
  ],
  signIn:
    "Sign in with your Inngest account when the calendar opens so your lessons count.",
} as const;

export const FINALE = {
  chips: ["Live on CodeTV", "Date TBD"],
  title: ["The finale:", "one ridiculous machine."],
  body: [
    "After the twelfth door, we build a Rube Goldberg machine out of all twelve primitives, live on CodeTV.",
    "Raffle and hackathon winners get announced on the stream.",
  ],
  video: "/assets/v1/12-days/cat-vertical.mp4",
  videoLabel:
    "Animated poster: an eyeball rolls down a ramp into a bowl balanced on someone's head, under the words Keep all your weird workflows running.",
} as const;

export const SONG = {
  eyebrow: "The song so far",
} as const;

/**
 * The machine: every unlocked primitive becomes a stage in one long,
 * ridiculous run. Each stage gets a trace line (the step as it would
 * appear in the Inngest dashboard), what it reports when it finishes,
 * and a pretend duration.
 */
export const MACHINE = {
  eyebrow: "Build the machine",
  title: "One ridiculous run.",
  body: "Every door you open adds a stage. Run the machine, then crash it halfway. Finished steps stay finished, so it resumes from where it fell over instead of starting again.",
  locked: "The machine comes alive December 1.",
  steps: {
    1: { step: 'step.run("send-welcome")', done: "Email queued", ms: 212 },
    2: {
      step: 'step.sleep("wait-a-day", "1d")',
      done: "Slept 1d (fast-forwarded)",
      ms: 86_400_000,
    },
    3: {
      step: 'step.waitForEvent("approval")',
      done: "A human said yes",
      ms: 41_000,
    },
    4: {
      step: 'step.sendEvent("fan-out")',
      done: "Fanned out to 4 jobs",
      ms: 38,
    },
    5: {
      step: 'cron("0 9 * * 1")',
      done: "Monday, 9 AM, right on time",
      ms: 4,
    },
    6: { step: "throttle: 6/min", done: "Stayed under the limit", ms: 640 },
    7: { step: "batchEvents: 100", done: "Inserted 100 rows at once", ms: 95 },
    8: {
      step: 'step.ai.wrap("draft-reply")',
      done: "Model replied, 412 tokens",
      ms: 1_830,
    },
    9: {
      step: "debounce: 9s",
      done: "Ran once, with the latest event",
      ms: 9_000,
    },
    10: {
      step: "cancelOn: order.cancelled",
      done: "Nothing to cancel, carried on",
      ms: 3,
    },
    11: {
      step: "concurrency: 11/tenant",
      done: "Got a slot in the queue",
      ms: 120,
    },
    12: { step: "checkpoint", done: "All twelve steps saved", ms: 7 },
  } as Record<number, { step: string; done: string; ms: number }>,
} as const;
