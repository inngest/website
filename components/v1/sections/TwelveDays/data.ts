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
  /** The lesson's name, from its folder in the course repo. */
  title: string;
  /**
   * The problem, the way a developer would complain about it. Shown on
   * the door before it opens, so it's a hint, not the answer.
   */
  teaser: string;
  /** One or two sentences on the fix, in the card shop's story. */
  body: string;
  /** Short, real SDK code. Keep it to a few lines; the door is small. */
  code: string;
  docs: { label: string; href: string };
  /** The lesson video, once it's cut. Until then the door shows a slot. */
  video?: string;
}

/**
 * The twelve lessons, from Mitch's technical concepts (the Notion tech
 * spec). Each `code` sample is trimmed from the "After" block on that
 * day's lesson page, so step names match what the videos show. Each one is a problem the holiday card shop hits during the
 * rush, and the primitive that fixes it.
 */
export const DAYS: WorkflowDay[] = [
  {
    day: 1,
    primitive: "Durable steps",
    title: "Survive failure",
    teaser: "“My LLM call failed and took the whole request down with it.”",
    body: "The image API fails twice. Wrap each call in a step and only the failed one retries, so the card's text is written, and billed, once.",
    code: `const card = await step.run(\n  "write-text",\n  () => writeCard(event.data)\n);\nconst image = await step.run(\n  "render-image",\n  () => renderImage({\n    text: card.text,\n  })\n);`,
    docs: {
      label: "Steps",
      href: `/docs/learn/inngest-steps?ref=${REF}-day-1`,
    },
  },
  {
    day: 2,
    primitive: "Fail fast",
    title: "Stop knocking",
    teaser: "“Stop retrying things that are never going to work.”",
    body: "A message that fails moderation won't pass on the fourth try. Stop right away and tell the sender, and when a provider says “come back later,” come back exactly then.",
    code: `if (!verdict.ok) {\n  throw new NonRetriableError(\n    "Rejected by moderation"\n  );\n}\nif (err.status === 429) {\n  throw new RetryAfterError(\n    "LLM rate limited",\n    err.retryAfterMs ?? "1m"\n  );\n}`,
    docs: {
      label: "Error handling",
      href: `/docs/guides/error-handling?ref=${REF}-day-2`,
    },
  },
  {
    day: 3,
    primitive: "Invoke",
    title: "Split the work",
    teaser: "“My flakiest API is setting the rules for my whole workflow.”",
    body: "Rendering the art fails more than anything else. Give it its own function with ten retries and invoke it, so the rest of the card keeps the default four.",
    code: `// renderCardImage has retries: 10\nconst image = await step.invoke(\n  "render-image",\n  {\n    function: renderCardImage,\n    data: { text: card.text },\n  }\n);`,
    docs: {
      label: "Invoke",
      href: `/docs/guides/invoking-functions-directly?ref=${REF}-day-3`,
    },
  },
  {
    day: 4,
    primitive: "Wait for event",
    title: "Wait for a human",
    teaser: "“I need a human to say yes before this goes out.”",
    body: "The draft pauses until the sender approves it. Approving picks the run back up; silence lets it expire. It costs nothing while it waits, even for days.",
    code: `const approval =\n  await step.waitForEvent(\n    "wait-for-approval",\n    {\n      event: cardApproved,\n      match: "data.cardId",\n      timeout: "48h",\n    }\n  );\nif (approval === null) {\n  return { status: "expired" };\n}`,
    docs: {
      label: "Wait for event",
      href: `/docs/features/inngest-functions/steps-workflows/wait-for-event?ref=${REF}-day-4`,
    },
  },
  {
    day: 5,
    primitive: "Sleep and cancel",
    title: "Deliver on the 25th",
    teaser: "“Send this on Christmas morning, unless they cancel.”",
    body: "The card sleeps until Christmas morning, then goes out. If the sender deletes it first, one cancel event stops the sleeping run.",
    code: `cancelOn: [{\n  event: cardDeleted,\n  match: "data.cardId",\n}],\n// …\nawait step.sleepUntil(\n  "wait-for-delivery-date",\n  event.data.deliverAt\n);`,
    docs: {
      label: "Cancel on events",
      href: `/docs/features/inngest-functions/cancellation/cancel-on-events?ref=${REF}-day-5`,
    },
  },
  {
    day: 6,
    primitive: "Concurrency keys",
    title: "One customer per lane",
    teaser: "“One customer sent 20 cards and now everyone else is waiting.”",
    body: "Give every account its own limit. Someone sending 20 cards no longer pushes another customer's single card to 19th in line.",
    code: `concurrency: [\n  { limit: 5 },\n  {\n    key: "event.data.accountId",\n    limit: 2,\n  },\n],`,
    docs: {
      label: "Concurrency",
      href: `/docs/guides/concurrency?ref=${REF}-day-6`,
    },
  },
  {
    day: 7,
    primitive: "Throttling",
    title: "Respect rate limits",
    teaser:
      "“The image API is rate-limiting us, and our retries make it worse.”",
    body: "Start four renders every ten seconds, just under the provider's five, and every call goes through first time. Concurrency caps how many run at once; throttling caps how many start.",
    code: `{\n  id: "render-card-image",\n  retries: 10,\n  throttle: {\n    limit: 4,\n    period: "10s",\n  },\n}`,
    docs: {
      label: "Throttling",
      href: `/docs/guides/throttling?ref=${REF}-day-7`,
    },
  },
  {
    day: 8,
    primitive: "Debounce",
    title: "Wait for quiet",
    teaser: "“Users smash the regenerate button and we pay for every click.”",
    body: "Eight edits in two seconds used to mean eight LLM calls. Debounce per card, and one call runs with the latest text once they stop.",
    code: `{\n  id: "regenerate-preview",\n  triggers: [cardEdited],\n  debounce: {\n    key: "event.data.cardId",\n    period: "3s",\n  },\n}`,
    docs: {
      label: "Debounce",
      href: `/docs/guides/debounce?ref=${REF}-day-8`,
    },
  },
  {
    day: 9,
    primitive: "Fan-out",
    title: "Send to everyone",
    teaser: "“Our bulk send failed halfway and 24 people got the card twice.”",
    body: "Don't loop over 50 recipients inside one step. Send one event per recipient, so a failure at number 25 retries number 25 and nobody else.",
    code: `const deliveries = recipients.map(\n  (to) =>\n    deliveryRequested.create({\n      cardId,\n      to,\n    })\n);\nawait step.sendEvent(\n  "fan-out",\n  deliveries\n);`,
    docs: {
      label: "Fan-out jobs",
      href: `/docs/guides/fan-out-jobs?ref=${REF}-day-9`,
    },
  },
  {
    day: 10,
    primitive: "Priority",
    title: "Paid users first",
    teaser: "“Paying customers are stuck behind free-tier traffic.”",
    body: "Twenty free cards are queued when two Pro cards arrive. One priority expression moves the Pro cards to the front.",
    code: `{\n  id: "create-card",\n  concurrency: { limit: 2 },\n  priority: {\n    run: \`event.data.plan == "pro"\n      ? 120 : 0\`,\n  },\n}`,
    docs: {
      label: "Priority",
      href: `/docs/guides/priority?ref=${REF}-day-10`,
    },
  },
  {
    day: 11,
    primitive: "Batching",
    title: "Batch the boring stuff",
    teaser: "“We're paying for 120 database writes that could be three.”",
    body: "Collect “card opened” events, up to 50 or five seconds at a time, and write each batch in one insert. 120 events become three writes.",
    code: `batchEvents: {\n  maxSize: 50,\n  timeout: "5s",\n},\n// …\nasync ({ events, step }) => {\n  const opens = events.map(\n    (e) => e.data\n  );\n  return step.run("insert-opens",\n    () => insertRows(opens));\n}`,
    docs: {
      label: "Batching",
      href: `/docs/guides/batching?ref=${REF}-day-11`,
    },
  },
  {
    day: 12,
    primitive: "Agent Evals",
    title: "Measure what works",
    teaser: "“We changed the prompt. Is it actually better?”",
    body: "Split traffic between two card tones, then score each card when the recipient actually reacts, days later. Real outcomes pick the winner, not guesses.",
    code: `const { result } =\n  await group.experiment(\n    "card-tone",\n    {\n      variants: { classic, warm },\n      select: experiment.weighted({\n        classic: 50,\n        warm: 50,\n      }),\n    }\n  );\nawait step.score("score-length", {\n  name: "fits-on-card",\n  value: result.text.length <= 280,\n});`,
    docs: {
      label: "Experiments",
      href: `/docs/agent-evals/experiments?ref=${REF}-day-12`,
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
    "Then build your own. We'll show three of the weirdest build-a-thon entries on the stream and pick a $5K winner on air.",
  ],
  // TODO: registration link and date are still TBD; this anchor is a
  // placeholder until then.
  cta: { label: "Save your spot", href: "#finale" },
  buildathon: {
    label: "Enter the build-a-thon",
    href: `/12-days-of-workflows/build-a-thon?ref=${REF}-finale`,
  },
  image: "/assets/v1/12-days/finale.webp",
  imageAlt:
    "A cat's paw nudges an eyeball off a shelf and down a green ramp toward a funnel balanced on the head of a woman with green lips and big curly buns.",
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
    1: {
      step: 'step.run("write-text")',
      done: "Card written, billed once",
      ms: 1_830,
    },
    2: {
      step: "NonRetriableError",
      done: "Bad prompt stopped, sender told",
      ms: 12,
    },
    3: {
      step: 'step.invoke("render-image")',
      done: "Art rendered on retry 6 of 10",
      ms: 4_200,
    },
    4: {
      step: 'step.waitForEvent("wait-for-approval")',
      done: "The sender said yes",
      ms: 41_000,
    },
    5: {
      step: 'step.sleepUntil("wait-for-delivery-date")',
      done: "Slept until Dec 25 (fast-forwarded)",
      ms: 86_400_000,
    },
    6: {
      step: "concurrency: 2/account",
      done: "Got its own lane",
      ms: 120,
    },
    7: { step: "throttle: 4/10s", done: "No 429s", ms: 640 },
    8: {
      step: "debounce: 3s",
      done: "Ran once, with the latest text",
      ms: 2_000,
    },
    9: {
      step: 'step.sendEvent("fan-out")',
      done: "Fanned out to 50 recipients",
      ms: 38,
    },
    10: { step: "priority: pro first", done: "Jumped the queue", ms: 3 },
    11: { step: "batchEvents: 50", done: "120 events, 3 writes", ms: 95 },
    12: {
      step: 'group.experiment("card-tone")',
      done: "Warm tone pulling ahead",
      ms: 7,
    },
  } as Record<number, { step: string; done: string; ms: number }>,
} as const;

/**
 * The build-a-thon page (TwelveDaysBuildathon.tsx). Entries go to
 * Segment as `12 Days Build-a-thon Submitted`; the three showcased on
 * the finale livestream are picked from there.
 *
 * Submissions close December 23. TODO: the livestream (Dec 29 or 30)
 * is still to be confirmed; add its date to `when` once it is.
 */
export const BUILDATHON = {
  chips: ["Build-a-thon", "$5K prize"],
  title: ["Build your", "weird workflow."],
  when: "Submit by December 23. Winner picked live on CodeTV.",
  cta: { label: "Submit your workflow", href: "#submit" },
  body: "Use all twelve primitives from behind the doors to build one gloriously overengineered workflow that does something really simple, the Rube Goldberg way. Toast a slice of bread. Water a plant. Say good morning.",
  rulesTitle: "The rules",
  rules: [
    "Your workflow uses every one of the twelve primitives below.",
    "It does one simple thing, in the most complicated way you can make work.",
    "It's deployed on Vercel, and the code is in a public GitHub repo.",
    "Make it weird!*",
  ],
  rulesFootnote:
    "*Weird as in a toaster that needs three approvals and a cron job to make toast. Not weirdo weird. Keep it silly, keep it kind.",
  primitivesTitle: "Your twelve moving parts",
  prizesTitle: "What you get",
  prizes: [
    "$5K cash for the winner, picked live on CodeTV.",
    "An exclusive Inngest sweatshirt for everyone who submits.",
  ],
  formTitle: "Submit your workflow",
  fields: {
    name: "Name",
    email: "Email",
    company: "Company",
    linkedin: "LinkedIn profile",
    linkedinHint: "So we can tag you when we share it.",
    vercel: "Vercel preview URL",
    github: "GitHub repo URL",
    description: "What does it do? (optional)",
    descriptionHint: "One or two sentences. The more absurd, the better.",
    confirm: "My workflow uses all twelve primitives.",
  },
  button: "Submit my workflow",
  sending: "Submitting…",
  sent: "Got it. Your workflow is in the running. Watch the finale to see if it makes the show.",
  failed: "That didn't go through. Try again?",
  back: {
    label: "Back to the calendar",
    href: `/12-days-of-workflows?ref=${REF}-build-a-thon`,
  },
  startCta: {
    label: "Start building free",
    href: `/sign-up?ref=${REF}-build-a-thon`,
  },
} as const;

/**
 * The build-a-thon section on the 12 Days page (BuildathonTeaser.tsx):
 * the short version of the rules, linking out to the full page.
 */
/** The scrolling strip under the hero that points down to the build-a-thon. */
export const BUILDATHON_MARQUEE = {
  text: "Submit your weirdest workflow for the chance to win $5K cash",
  href: `/12-days-of-workflows/build-a-thon?ref=${REF}-marquee`,
} as const;

export const BUILDATHON_TEASER = {
  eyebrow: "The build-a-thon",
  title: ["Build your", "weird workflow."],
  body: "Twelve doors, twelve primitives. Put every one of them into a single workflow that does something really simple in the most overengineered way you can make work.",
  when: BUILDATHON.when,
  guidelines: [
    "Use all twelve primitives from the calendar.",
    "Do one simple thing, the Rube Goldberg way.",
    "Deploy it on Vercel, with the code in a public GitHub repo.",
    "Make it weird!*",
  ],
  footnote: BUILDATHON.rulesFootnote,
  prizes: BUILDATHON.prizes,
  cta: {
    label: "See the full rules",
    href: `/12-days-of-workflows/build-a-thon?ref=${REF}-build-a-thon-section`,
  },
  submit: {
    label: "Submit your workflow",
    href: `/12-days-of-workflows/build-a-thon?ref=${REF}-build-a-thon-section#submit`,
  },
} as const;
