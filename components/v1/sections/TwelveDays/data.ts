/**
 * "The 12 Days of Workflows" — Inngest × CodeTV holiday campaign, in
 * the Build for the Lonng Run brand.
 *
 * Copy for inngest.com/12-days-of-workflows. Twelve short video lessons,
 * one Inngest primitive each, behind an advent calendar whose doors
 * unlock at midnight Eastern, one a day from December 7 to 18.
 * Ends with a live CodeTV episode building a Rube Goldberg machine out
 * of all twelve.
 *
 * Copy follows Lauren's review (Notion: "12 Days of Workflows: Landing
 * page copy", November 12). CodeTV participation and the
 * finale details stay provisional until approved,
 * and the lesson list waits on the final lineup (Mitch). Everything the
 * page says lives here so those land as data edits, not layout changes.
 */

/** Ref tag for links on this page. Each door's sign-up and docs links add `-day-N`. */
export const REF = "12-days-of-workflows";

/**
 * The course repo: every lesson's code, plus how to run it. Linked from
 * the "New to Inngest?" block, each open door and the build-a-thon's
 * primitives list.
 */
export const COURSE_REPO = {
  label: "Get the course repo",
  doorLabel: "Code on GitHub",
  buildLabel: "Start from the course repo",
  href: "https://github.com/inngest/12-days-of-workflows/blob/main/README.md",
} as const;

/** Year the calendar runs. */
export const YEAR = 2026;

/** Doors unlock at midnight here; dates on the page are shown in it. */
export const TIMEZONE = "America/New_York";

/**
 * The December date each door opens: one a day, weekends included,
 * December 7–18.
 */
export const UNLOCK_DATES = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

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
/**
 * The 12 Days brand palette, and nothing else: yellow, salmon, green,
 * black and white.
 */
export const COLORS = {
  yellow: "#F7DA10",
  salmon: "#F65C4F",
  green: "#0BDD48",
  ink: "#020202",
  white: "#FFFFFF",
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
      href: `/docs/durable-execution/primitives/step-run?ref=${REF}-day-1`,
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
      href: `/docs/durable-execution/guides-and-advanced/error-handling/inngest-errors?ref=${REF}-day-2`,
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
      href: `/docs/durable-execution/primitives/step-invoke?ref=${REF}-day-3`,
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
      href: `/docs/durable-execution/primitives/step-waitforevent?ref=${REF}-day-4`,
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
      href: `/docs/durable-execution/guides-and-advanced/cancellation/events?ref=${REF}-day-5`,
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
      href: `/docs/durable-execution/flow-control/concurrency?ref=${REF}-day-6`,
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
      href: `/docs/durable-execution/flow-control/throttling?ref=${REF}-day-7`,
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
      href: `/docs/durable-execution/flow-control/debounce?ref=${REF}-day-8`,
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
      href: `/docs/durable-execution/guides-and-advanced/patterns/fan-out?ref=${REF}-day-9`,
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
      href: `/docs/durable-execution/flow-control/priority?ref=${REF}-day-10`,
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
      href: `/docs/durable-execution/flow-control/batching?ref=${REF}-day-11`,
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

/** Door front colours from Savannah's design, cycled by day. */
export const DOOR_FACES = [
  { bg: "#0BDD48", num: "#FFFFFF" },
  { bg: "#F7DA10", num: "#020202" },
  { bg: "#F65C4F", num: "#FFFFFF" },
];

/**
 * Where each door's illustration sits in its window, in the design's
 * units (the window is 295.5 × 208). Negative `y` means the art pokes
 * out of the top. From the "12 days of workflow" page of the Long
 * Running Campaign Figma file (frame 938:13060); the art itself is
 * public/assets/v1/12-days/doors/day-N.svg.
 */
export const DOOR_ART = [
  { x: 33.8, y: -26.6, w: 224 },
  { x: 10.4, y: -26.5, w: 271 },
  { x: 7.3, y: -29.0, w: 277 },
  { x: 8.2, y: 3.5, w: 274 },
  { x: 42.5, y: -25.6, w: 207 },
  { x: 10.4, y: -37.1, w: 270 },
  { x: 41.2, y: -12.3, w: 209 },
  { x: 8.1, y: -15.9, w: 274 },
  { x: 23.5, y: -35.5, w: 245 },
  { x: 53.9, y: -36.1, w: 184 },
  { x: 23.6, y: -40.6, w: 243 },
  { x: 9.2, y: -32.0, w: 273 },
];

export const HERO = {
  chips: ["Inngest × CodeTV", "December 7–18"],
  // Set like the posters: a huge line, a mono line, a huge line. Read
  // as one heading (`label`).
  titleTop: "12 Days",
  titleMid: "of [weird]",
  titleBottom: "Workflows",
  label: "12 Days of Weird Workflows",
  body: "Twelve doors. Twelve lessons to make all your weird workflows durable. Combine them and submit your weird workflow for a chance to win cash and other prizes.",
  /** Down to the calendar: the doors and the email sign-up. */
  signup: { label: "Get the daily lessons", href: "#calendar" },
  /** For people who don't need the lessons: straight to the build-a-thon. */
  build: { label: "Submit your workflow", href: "#submit" },
} as const;

/** Section id the hero's "Explore the calendar" jumps to. */
export const CALENDAR_ID = "calendar";

// Two-sentence headlines are split: the first sentence is the poster
// title, the second a smaller line under it.
export const CALENDAR = {
  eyebrow: "The calendar",
  title: "No peeking.",
  subtitle:
    "The lessons are still wrapping themselves. Add your email to get notified when each lesson drops.",
} as const;

/**
 * Under "No peeking." (AdventCalendar.tsx), in place of the old "How it
 * works" section: the doors and the sign-up in one block. Setting up,
 * is the Day 0 door. The build-a-thon button is in the hero.
 */
export const CALENDAR_JOIN = {
  when: "December 7–18",
  title: "Open a door a day",
  body: "A five-minute lesson, the code and the docs behind every door. Sign up to get notified when each lesson drops.",
  /** "raffle" links down to the raffle section. */
  note: {
    before: "From December 7, the same sign-up enters you in that day's ",
    link: { label: "raffle", href: "#raffle" },
    after: ".",
  },
} as const;

/**
 * "New to Inngest?" under the calendar's email sign-up (NewToInngest.tsx):
 * the one place to get started, instead of a sign-up link on every door.
 */
export const NEW_TO_INNGEST = {
  lead: "New to Inngest? Get started here:",
  copy: "Copy prompt to start locally",
  copied: "Prompt copied. Paste it into your coding agent.",
  signUp: {
    label: "Start free in cloud",
    href: `/sign-up?ref=${REF}-new-to-inngest`,
  },
  /** Pasted into a coding agent (Claude Code, Cursor, …) in their project. */
  prompt: `Add Inngest to this project and run my first durable workflow locally.

1. Install the Inngest SDK for this project's language and framework.
2. Create an Inngest client and one function triggered by an event, with at least two step.run() calls.
3. Serve the function from an /api/inngest endpoint.
4. Start the Inngest Dev Server with \`npx inngest-cli@latest dev\`, send a test event, and show me the run in the Dev Server UI at http://localhost:8288.

Follow the quick start for this stack: https://www.inngest.com/docs/getting-started`,
} as const;

/**
 * Day 0: the setup door, full width above the twelve lessons
 * (AdventCalendar.tsx). Open from the start. Its buttons reuse the
 * "New to Inngest?" copy and links above.
 */
export const DAY_ZERO = {
  label: "Day 0 · Setup",
  /** On the front of the door, in the same voice as the lesson teasers. */
  teaser: "“Wait, do I need to set anything up first?”",
  cue: "Open me first",
  title: "Get set up before Day 1",
  body: "Get Inngest running locally before the first door opens, so Day 1 is all lesson and no setup.",
  steps: {
    prompt:
      "Paste the prompt into your coding agent. It adds Inngest to your project and runs your first durable workflow locally.",
    repo: "Grab the course repo. Every lesson's code is there, with how to run it.",
    cloud:
      "Start free in cloud when you're ready to deploy. You'll need a free account to win a prize.",
  },
  promptHeading: "The prompt",
  signUpHref: `/sign-up?ref=${REF}-day-0`,
} as const;

/**
 * The one sign-up form (JoinForm.tsx), in the calendar and in the raffle
 * pop-up. Before the doors open it's email only; while a day's raffle is
 * open the same submit also enters that day's raffle.
 */
export const SIGNUP = {
  prompt: "Get an email when each door opens.",
  label: "Email address",
  name: "Name",
  placeholder: "you@company.com",
  namePlaceholder: "Your name",
  button: "Sign up",
  raffleButton: "Sign up and enter today's raffle",
  /** Already signed up: one click per day after that. */
  quick: (name: string) => `Enter today's raffle as ${name}`,
  notYou: "Not you?",
  sending: "Signing you up…",
  sent: "You're on the list.",
  sentBody: "We'll email you the moment each new door opens.",
  enteredBody: (day: number) =>
    `You're in the Day ${day} raffle, and we'll email you when each new door opens. Come back tomorrow for another entry.`,
  failed: "That didn't go through. Try again?",
  /** After joining: step 2 of the journey. */
  next: { label: "Next: set up Inngest locally", href: "#day-0" },
  /** In the pop-up: points to the "New to Inngest?" block. */
  account: {
    lead: "Need an Inngest account? It's free:",
    label: "get started",
    href: "#day-0",
  },
} as const;

export const FINALE = {
  chips: ["Live on CodeTV"],
  title: ["Watch us pick the winners", "live on CodeTV."],
  body: [
    "After the last door opens, join Inngest and CodeTV live as we build one gloriously overengineered Rube Goldberg machine out of everything behind the doors.",
    "Then build your own. We'll show the weirdest build-a-thon entries on the stream and pick the winners on air.",
  ],
  /** The YouTube-style frame around the art. */
  player: {
    channel: "CodeTV",
    title: "12 Days of Workflows: the finale",
    live: "Live",
  },
  /** The player and this button both go to the countdown / stream page. */
  watch: {
    label: "Join us live",
    href: `/12-days-of-workflows/live?ref=${REF}-finale`,
  },
  image: "/assets/v1/12-days/finale.webp",
  imageAlt:
    "A cat's paw nudges an eyeball off a shelf and down a green ramp toward a funnel balanced on the head of a woman with green lips and big curly buns.",
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
  locked: "The machine comes alive December 7.",
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
 * The build-a-thon page (TwelveDaysBuildathon.tsx). Entries go to Segment
 * from the server (app/api/12-days/build-a-thon) as
 * `12 Days Build-a-thon Submitted`; Segment sends them to Attio (list +
 * Slack post) and Customer.io; the three showcased on the finale livestream are picked
 * from those.
 *
 * Submissions close December 23; the livestream is December 29.
 */
export const BUILDATHON = {
  chips: ["Build-a-thon", "Cash prizes"],
  title: ["Build your", "weird workflow."],
  when: "Submit by December 23. Winners picked live on CodeTV, December 29.",
  cta: { label: "Submit your workflow", href: "#submit" },
  body: "Use all twelve primitives to build one gloriously overengineered workflow that does something really simple, the Rube Goldberg way. Toast a slice of bread. Water a plant. Say good morning.",
  rulesTitle: "The rules",
  rules: [
    "Your workflow uses every one of the twelve primitives below.",
    "It does one simple thing, in the most complicated way you can make work.",
    "It's deployed somewhere we can try it, and the code is in a public GitHub repo.",
    "Make it weird!*",
  ],
  rulesFootnote:
    "*Weird as in a toaster that needs three approvals and a cron job to make toast. Not weirdo weird. Keep it silly, keep it kind.",
  primitivesTitle: "Your twelve moving parts",
  prizesTitle: "What you get",
  /** `note` is a small line under the amount. */
  prizes: [
    { place: "First prize", prize: "$3K USD" },
    {
      place: "Second and third prize",
      prize: "$2K USD",
      note: "Split between second and third",
    },
    {
      place: "Honorable mentions",
      prize: "A showcase on CodeTV and special Inngest swag",
    },
  ],
  formTitle: "Submit your workflow",
  fields: {
    name: "Name",
    email: "Email",
    company: "Company",
    linkedin: "LinkedIn profile",
    linkedinHint: "So we can tag you when we share it.",
    vercel: "Preview URL",
    github: "GitHub repo URL",
    description: "Pitch your workflow",
    descriptionHint: "Why is it weird, and why does it work?",
    confirm: "My workflow uses all twelve primitives.",
  },
  button: "Submit my workflow",
  sending: "Submitting…",
  sent: "Got it. Your workflow is in the running. Watch the finale to see if it makes the show.",
  /** Shown after `sent`: the finale is where the winners are picked. */
  register: {
    label: "Register for the livestream",
    href: "#register",
  },
  failed: "That didn't go through. Try again?",
} as const;

/**
 * The scrolling ticker under the hero: what's open and what's next,
 * linking down to the calendar. `idle` shows until the clock mounts.
 */
/**
 * "How it works" under the hero (HowItWorks.tsx): the journey in order,
 * each step linking to the section where it happens. Mirrors the
 * FigJam journey map.
 */
export const HOW_IT_WORKS = {
  title: "How it works",
  /** The shortcut: no need to go through the doors first. */
  skip: {
    lead: "Already know Inngest?",
    label: "Skip straight to the build-a-thon and submit",
    href: "#submit",
  },
  steps: [
    {
      when: "Now",
      title: "Join",
      body: "Get each day's lesson by email. From December 7, the same sign-up enters you in that day's raffle.",
      href: "#calendar",
      cta: "Sign up",
    },
    {
      when: "Once",
      title: "Set up",
      body: "Run Inngest locally with one copied prompt. A free cloud account is only needed to win a prize or deploy.",
      href: "#new-to-inngest",
      cta: "Get set up",
    },
    {
      when: "December 7–18",
      title: "Open a door a day",
      body: "A five-minute lesson, the code and the docs. The email links straight to that day's door.",
      href: "#calendar",
      cta: "See the doors",
    },
    {
      when: "Any time until December 23",
      title: "Build (optional)",
      body: "Combine all twelve primitives into one weird workflow and submit it for cash prizes. No need to wait for the doors.",
      href: "#build-a-thon",
      cta: "See the rules",
    },
    {
      when: "December 29",
      title: "Watch live",
      body: "We pick the build-a-thon winners live on CodeTV.",
      href: "#register",
      cta: "Register",
    },
  ],
} as const;

export const TICKER = {
  idle: "A new lesson every day, December 7–18",
  allOpen: "All twelve doors are open.",
  label: "Jump to the calendar",
} as const;

/**
 * The build-a-thon section on the 12 Days page (BuildathonTeaser.tsx):
 * the prizes, linking out to the full rules and the entry form.
 */
export const BUILDATHON_TEASER = {
  eyebrow: "The build-a-thon",
  title: ["Build your", "weird workflow."],
  prizesTitle: "The prizes",
} as const;

/**
 * The door whose raffle is open at `now`, or null. A day's raffle opens
 * with its door and closes when the next door opens (the last one stays
 * open for a day), so each entry counts for its own day only.
 */
export function raffleDayAt(now: Date): number | null {
  const t = now.getTime();
  for (let day = UNLOCK_DATES.length; day >= 1; day--) {
    const opens = unlockAt(day).getTime();
    if (t < opens) continue;
    const closes =
      day < UNLOCK_DATES.length
        ? unlockAt(day + 1).getTime()
        : opens + 24 * 60 * 60 * 1000;
    return t < closes ? day : null;
  }
  return null;
}

/**
 * One prize a day, each a pun on that day's lesson, drawn from that
 * day's entries. (The finale stream is for the build-a-thon winners;
 * the raffle has no grand prize.) `value` is the approximate retail
 * value in USD, for the official rules (check prices when buying).
 *
 * `emoji` stands in for the prize art until there are transparent
 * product cutouts: set `image` (e.g. "/assets/v1/12-days/prizes/day-1.png")
 * and the calendar shows that instead.
 */
export type DailyPrize = {
  day: number;
  prize: string;
  pun: string;
  value: number;
  emoji: string;
  /** Transparent product photo, from the prize cards in Figma. */
  image?: string;
};

export const DAILY_PRIZES: DailyPrize[] = [
  {
    day: 1,
    prize: "Garmin running watch",
    pun: "Count every step.",
    value: 300,
    emoji: "⌚",
    image: "/assets/v1/12-days/prizes/garmin-watch.png",
  },
  {
    day: 2,
    prize: "Bambu Lab A1 mini 3D printer",
    pun: "Fail fast, print again.",
    value: 300,
    emoji: "🖨️",
    image: "/assets/v1/12-days/prizes/bambu-a1-mini.png",
  },
  {
    day: 3,
    prize: "Sony noise-cancelling headphones",
    pun: "Invoke focus.",
    value: 350,
    emoji: "🎧",
    image: "/assets/v1/12-days/prizes/sony-headphones.png",
  },
  {
    day: 4,
    prize: "Ember mug + coffee subscription",
    pun: "Wait for it…",
    value: 250,
    emoji: "☕",
    image: "/assets/v1/12-days/prizes/ember-mug.png",
  },
  {
    day: 5,
    prize: "Kindle Paperwhite Signature",
    pun: "Sleep in. Cancel your plans. Read.",
    value: 200,
    emoji: "📖",
  },
  {
    day: 6,
    prize: "Nintendo Switch 2",
    pun: "Two players, one console.",
    value: 450,
    emoji: "🎮",
  },
  {
    day: 7,
    prize: "Running gear bundle",
    pun: "Pace yourself.",
    value: 300,
    emoji: "👟",
  },
  {
    day: 8,
    prize: "Custom mechanical keyboard",
    pun: "Every keypress, debounced.",
    value: 300,
    emoji: "⌨️",
  },
  {
    day: 9,
    prize: "LEGO mega set",
    pun: "One box, many parts.",
    value: 350,
    emoji: "🧱",
  },
  {
    day: 10,
    prize: "Desk upgrade: light bar + MX mouse and keys",
    pun: "Your desk, prioritized.",
    value: 350,
    emoji: "💡",
  },
  {
    day: 11,
    prize: "Breville espresso machine",
    pun: "Batch your caffeine.",
    value: 400,
    emoji: "🫘",
  },
  {
    day: 12,
    prize: "Meta Quest 3S",
    pun: "Evaluate reality.",
    value: 300,
    emoji: "🥽",
  },
];

export function prizeFor(day: number): DailyPrize | undefined {
  return DAILY_PRIZES.find((p) => p.day === day);
}

/**
 * The daily raffle (RaffleSection.tsx, RaffleDialog.tsx). One entry per
 * door per person; each day's entries win that day's prize.
 *
 * TODO before launch: the official rules at
 * /12-days-of-workflows/raffle-rules.
 */
export const RAFFLE = {
  eyebrow: "The daily raffle",
  title: ["A prize a day.", "Open the door to enter."],
  body: "Every door has a prize behind it. Enter on the day to win that day's prize. Come back tomorrow for the next one: twelve doors, twelve chances.",
  calendar: {
    title: "December",
    today: "Today",
    entered: "Entered",
  },
  todaysPrize: "Today's prize",
  enter: "Enter today's raffle",
  entered: "You're in for today",
  notYet: "The raffle opens with the first door on December 7.",
  closed: "Entries are closed. See you at the draw.",
  rules: {
    lead: "No purchase necessary. Legal US residents 18+ only, with an Inngest account (free is fine) under the email you enter. One prize per person. Void where prohibited.",
    label: "Official rules",
    href: `/12-days-of-workflows/raffle-rules?ref=${REF}-raffle`,
  },
  dialog: {
    title: (day: number) => `Day ${day} raffle`,
    body: "Enter to win today's prize. You'll also get an email when each new door opens.",
    close: "Close",
  },
} as const;

/**
 * The finale livestream: registration in the main page's finale
 * (#register; /12-days-of-workflows/livestream redirects there)
 * and the stream itself at /12-days-of-workflows/live.
 *
 * December 29, 10am Pacific. TODO: set `youtubeId` once the stream is
 * scheduled; until then the watch page shows a "coming soon" slot
 * instead of the player.
 */
export const LIVESTREAM = {
  chips: ["Live on CodeTV", "Free"],
  title: ["Watch us pick the winners", "live on CodeTV."],
  body: "After the last door opens, join Inngest and CodeTV live as we build one gloriously overengineered Rube Goldberg machine out of everything behind the doors, show the weirdest build-a-thon entries, and pick the winners on air.",
  when: "December 29 · 10am PT / 1pm ET",
  /**
   * When the stream starts, as an ISO time with its offset, and how long
   * it runs. Until `start` is set, the "add to calendar" links after
   * registering stay hidden.
   */
  start: "2026-12-29T10:00:00-08:00",
  minutes: 90,
  /** The YouTube video ID of the stream (the part after `v=`). */
  youtubeId: "",
  form: {
    title: "Save your spot",
    intro: "We'll email you the link and a reminder before we go live.",
    name: "Name",
    email: "Email",
    button: "Save my spot",
    sending: "Saving your spot…",
    sent: "You're in. We'll email you the link before we go live.",
    failed: "That didn't go through. Try again?",
  },
  watch: {
    label: "Where to watch",
    href: `/12-days-of-workflows/live?ref=${REF}-livestream`,
  },
  live: {
    chips: ["Live on CodeTV"],
    title: "12 Days of Workflows: the finale",
    /** The countdown in place of the player, before the stream. */
    countdown: {
      lead: "Come back in",
      tail: "for the livestream.",
      units: {
        day: ["day", "days"],
        hour: ["hour", "hours"],
        minute: ["minute", "minutes"],
      },
      /** Once the start time passes and the player isn't set up yet. */
      starting: "We're going live any second. Refresh in a moment.",
    },
    youtube: "Watch on YouTube",
    register: {
      label: "Save your spot",
      href: `/12-days-of-workflows?ref=${REF}-live#register`,
    },
    back: {
      label: "Back to the calendar",
      href: `/12-days-of-workflows?ref=${REF}-live`,
    },
  },
} as const;
