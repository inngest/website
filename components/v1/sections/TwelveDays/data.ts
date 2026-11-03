/**
 * "The 12 Days of Workflows" — Inngest × CodeTV holiday campaign, in
 * the Build for the Lonng Run brand.
 *
 * Copy for inngest.com/12-days-of-workflows. Twelve short video lessons,
 * one Inngest primitive each, behind an advent calendar whose doors
 * unlock at midnight Eastern, one per weekday from December 3 to 18.
 * Ends with a live CodeTV episode building a Rube Goldberg machine out
 * of all twelve.
 *
 * DRAFT: copy is Lauren's review draft. CodeTV participation and the
 * finale details stay provisional until approved,
 * and the lesson list waits on the final lineup (Mitch). Everything the
 * page says lives here so those land as data edits, not layout changes.
 */

/** Ref tag for links on this page. Each door's sign-up and docs links add `-day-N`. */
export const REF = "12-days-of-workflows";

/** Year the calendar runs. */
export const YEAR = 2026;

/** Doors unlock at midnight here; dates on the page are shown in it. */
export const TIMEZONE = "America/New_York";

/**
 * The December date each door opens: weekdays only, December 3–18.
 * These are 2026's weekdays, so rerunning the calendar in another year
 * means updating `YEAR` and this list together.
 */
export const UNLOCK_DATES = [3, 4, 7, 8, 9, 10, 11, 14, 15, 16, 17, 18];

/**
 * Midnight Eastern on door `day`'s date. December is always EST
 * (UTC-5), so the offset is fixed rather than looked up.
 */
export function unlockAt(day: number): Date {
  const date = String(UNLOCK_DATES[day - 1]).padStart(2, "0");
  return new Date(`${YEAR}-12-${date}T00:00:00-05:00`);
}

/** "December 9" (or "Dec 9" with `short`) for the date door `day` opens. */
export function unlockLabel(day: number, short = false): string {
  return unlockAt(day).toLocaleDateString("en-US", {
    month: short ? "short" : "long",
    day: "numeric",
    timeZone: TIMEZONE,
  });
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
      href: `/docs/guides/background-jobs?ref=${REF}-day-1`,
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
      href: `/docs/features/inngest-functions/steps-workflows/sleeps?ref=${REF}-day-2`,
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
      href: `/docs/features/inngest-functions/steps-workflows/wait-for-event?ref=${REF}-day-3`,
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
      href: `/docs/guides/fan-out-jobs?ref=${REF}-day-4`,
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
      href: `/docs/guides/scheduled-functions?ref=${REF}-day-5`,
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
      href: `/docs/guides/throttling?ref=${REF}-day-6`,
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
      href: `/docs/guides/batching?ref=${REF}-day-7`,
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
      href: `/docs/features/inngest-functions/steps-workflows/step-ai-orchestration?ref=${REF}-day-8`,
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
      href: `/docs/guides/debounce?ref=${REF}-day-9`,
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
      href: `/docs/features/inngest-functions/cancellation/cancel-on-events?ref=${REF}-day-10`,
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
      href: `/docs/guides/concurrency?ref=${REF}-day-11`,
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
      href: `/docs/setup/checkpointing?ref=${REF}-day-12`,
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
 * NOT WIRED UP: the page unlocks doors from the visitor's clock (see
 * useCalendarClock), so nothing has to run on a server.
 */
export const UNLOCK_FUNCTION = `inngest.createFunction(
  {
    id: "open-todays-door",
    triggers: {
      // Midnight Eastern, every weekday in December.
      cron: "TZ=America/New_York 0 0 * 12 1-5",
    },
  },
  async ({ step }) => {
    const day = await step.run("which-door", () =>
      calendar.doorFor(new Date())
    );
    if (!day) return; // Outside December 3–18.
    await step.run("open-door", () =>
      calendar.open(day)
    );
  }
);`;

export const HERO = {
  chips: ["Inngest × CodeTV", "December 3–18"],
  // Set like the posters: a huge line, a mono line, a huge line. Read
  // as one heading (`label`).
  titleTop: "12 Days",
  titleMid: "of",
  titleBottom: "Workflows",
  label: "12 Days of Workflows",
  tagline:
    "Twelve doors. Twelve weird workflows. One very long-running holiday season.",
  body: "A new door opens every weekday at midnight Eastern. Behind each: a bite-sized video, a real code example, and another way to make your workflows keep running when things get weird.",
  cta: { label: "Explore the calendar", href: "#calendar" },
  secondaryCta: { label: "Start building free", href: `/sign-up?ref=${REF}` },
} as const;

/** Section id the hero's "Explore the calendar" jumps to. */
export const CALENDAR_ID = "calendar";

// Two-sentence headlines are split: the first sentence is the poster
// title, the second a smaller line under it.
export const CALENDAR = {
  eyebrow: "The calendar",
  title: "No peeking.",
  subtitle: "The workflows are still wrapping themselves.",
  body: "One new workflow unlocks every weekday, December 3–18. Come back for a short lesson, runnable code, and the docs to make it your own. Miss a day? Catch up whenever you like.",
  completed: "Completed ✓",
  /** Each door's sign-up link. */
  tryIt: "Try it free",
} as const;

export const HOW_IT_OPENS = {
  eyebrow: "How the doors open",
  title: "A cron job. Obviously.",
  body: "No elves working overtime. Every midnight Eastern, an Inngest function opens the next door. Watch the schedule in action and see how a little orchestration keeps the season running.",
  cta: {
    label: "See how it works",
    href: `/docs/guides/scheduled-functions?ref=${REF}`,
  },
} as const;

/** The email sign-up in the calendar (EmailSignup.tsx). */
export const SIGNUP = {
  prompt: "Get an email when each door opens.",
  label: "Email address",
  placeholder: "you@company.com",
  button: "Email me each door",
  sending: "Signing you up…",
  sent: "You're on the list. See you at the next door.",
  failed: "That didn't go through. Try again?",
} as const;

export const FINALE = {
  chips: ["Live on CodeTV"],
  title: ["Twelve workflows walk", "into one machine."],
  body: [
    "After the last door opens, join Inngest and CodeTV live as we build one gloriously overengineered Rube Goldberg machine out of everything behind the doors.",
  ],
  // TODO: registration link and date are still TBD; this anchor is a
  // placeholder until then.
  cta: { label: "Save your spot", href: "#finale" },
  video: "/assets/v1/12-days/cat-vertical.mp4",
  videoLabel:
    "Animated poster: an eyeball rolls down a ramp into a bowl balanced on someone's head, under the words Keep all your weird workflows running.",
} as const;

export const SONG = {
  eyebrow: "The song so far",
  locked: "The first verse drops December 3.",
} as const;

export const CLOSING = {
  title: "All is calm. Your workflows are still running.",
  body: "Make something weird. Make it durable. Build for the long run.",
  cta: { label: "Start building free", href: `/sign-up?ref=${REF}` },
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
  subtitle: "Twelve moving parts.",
  body: "Every new door adds a stage to our increasingly questionable holiday contraption. Run it. Break it halfway. Watch Inngest pick up where it left off—without rerunning completed steps.",
  aside: "Because even holiday chaos deserves durable execution.",
  locked: "The machine comes alive December 3.",
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
