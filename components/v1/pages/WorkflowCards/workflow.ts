/**
 * The Inngest Card Shop's "weird workflow": one card, all twelve
 * primitives from the 12 Days of Workflows series — the build-a-thon
 * rule — used in a needlessly complex way to make a greeting card.
 *
 * Everything here is pure and deterministic — the same input always
 * produces the same card — so the page (which animates the run trace)
 * and the OG image route (which renders the card as a PNG) agree
 * without either one storing anything. The `nonce` is what "Rerun"
 * bumps to get a different card for the same name.
 *
 * The Inngest function this is pretending to be lives in
 * WORKFLOW_SOURCE below and is shown on the page. Its syntax follows
 * the series' code samples.
 */

import { CHARACTER_IDS, type CharacterId } from "./characters";

export const CARD_KINDS = ["participating", "completed", "stuck"] as const;
export type CardKind = typeof CARD_KINDS[number];

/** The series' days, in order. `label` is what the card's trace shows. */
export const DAYS = [
  { label: "step.run", topic: "durable steps" },
  { label: "RetryAfterError", topic: "failing fast" },
  { label: "step.invoke", topic: "composing functions" },
  { label: "step.waitForEvent", topic: "waiting for a human" },
  { label: "sleepUntil+cancelOn", topic: "scheduling and cancellation" },
  { label: "concurrency key", topic: "concurrency with keys" },
  { label: "throttle", topic: "throttling" },
  { label: "debounce", topic: "debounce" },
  { label: "step.sendEvent", topic: "fan-out" },
  { label: "priority", topic: "priority" },
  { label: "batchEvents", topic: "event batching" },
  { label: "group.experiment", topic: "Agent Evals experiments" },
] as const;

export type CardInput = {
  name: string;
  kind: CardKind;
  /** 1–12. Used by "participating" and "stuck". */
  day: number;
  /** Bumped by "Rerun" for a different card with the same name. */
  nonce: number;
  /** Optional GitHub username; its avatar goes on the card. */
  github: string;
  /** Which face-in-hole character the face goes in. */
  character: CharacterId;
};

export type Palette = {
  id: string;
  label: string;
  bg: string;
  fg: string;
  muted: string;
  accent: string;
  panel: string;
  panelFg: string;
  bar: string;
  barAlt: string;
};

/** done: finished. current: today's step. pending: hasn't run yet. */
export type RowStatus = "done" | "current" | "pending";

export type TraceRow = {
  day: number;
  primitive: string;
  /** Where the bar starts and how wide it is, both 0–1 of the track. */
  offset: number;
  width: number;
  /** Dashed bars are steps that spent their time waiting. */
  waiting: boolean;
  status: RowStatus;
  duration: string;
  /** What this step did to the card, shown in the page's run log. */
  log: string;
};

export type Speck = { x: number; y: number; size: number; opacity: number };

export type CardSpec = {
  input: CardInput;
  palette: Palette;
  eyebrow: string;
  headline: string;
  greeting: string;
  stamps: string[];
  serial: string;
  runId: string;
  snow: Speck[];
  glitter: Speck[];
  /** Ornament garland: y offsets (0–1) for the 12 ornaments, one per day. */
  garland: number[];
  /** One letter per ornament (or "" for a plain one): the name, centered. */
  garlandLetters: string[];
  /** The function's id, e.g. "make-a-card-for-riley". */
  functionId: string;
  /** The card's only real text: a giant word and one short line. */
  big: string;
  small: string;
  trace: TraceRow[];
};

const MAX_NAME = 28;

export const sanitizeName = (raw: string | null | undefined) =>
  (raw ?? "")
    .replace(/[\u0000-\u001f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_NAME);

// GitHub's own rules: alphanumerics and single hyphens, up to 39 chars.
export const sanitizeGithub = (raw: string | null | undefined) => {
  const handle = (raw ?? "")
    .trim()
    .replace(/^@/, "")
    .replace(/^https?:\/\/(www\.)?github\.com\//i, "")
    .replace(/\/.*$/, "");
  return /^[a-z0-9](?:[a-z0-9]|-(?=[a-z0-9])){0,38}$/i.test(handle)
    ? handle
    : "";
};

const DEFAULT_NAME = "A Durable Human";

const firstName = (name: string) =>
  name === DEFAULT_NAME ? "friend" : name.split(" ")[0];

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Spells the name across the 12 ornaments, centered. Falls back to the
 *  first name, then a truncated one, when the full name won't fit. */
// Constructed so TS doesn't object to the "u" flag under the project's
// older compile target; every browser and Node supports it.
const LETTER_OR_DIGIT = new RegExp("[\\p{L}\\p{N}]", "u");

const garlandLettersFor = (name: string) => {
  const letters = (s: string) =>
    Array.from(s.toUpperCase()).filter((c) => LETTER_OR_DIGIT.test(c));
  let chars = letters(name);
  if (chars.length > 12) chars = letters(name.split(" ")[0]);
  chars = chars.slice(0, 12);
  const start = Math.floor((12 - chars.length) / 2);
  return Array.from({ length: 12 }, (_, i) => chars[i - start] ?? "");
};

const clampDay = (d: number) =>
  Number.isFinite(d) ? Math.min(12, Math.max(1, Math.round(d))) : 1;

/** Reads a card from URL search params, with safe defaults. */
export const parseCardInput = (
  get: (key: string) => string | null | undefined
): CardInput => {
  const kind = get("kind");
  return {
    name: sanitizeName(get("name")) || DEFAULT_NAME,
    kind: CARD_KINDS.includes(kind as CardKind)
      ? (kind as CardKind)
      : "participating",
    day: clampDay(Number(get("day") ?? 1)),
    nonce: Math.max(0, Math.floor(Number(get("n") ?? 0)) || 0),
    github: sanitizeGithub(get("gh")),
    character: CHARACTER_IDS.includes(get("c") as CharacterId)
      ? (get("c") as CharacterId)
      : "pizza",
  };
};

export const cardQuery = (input: CardInput) => {
  const params = new URLSearchParams({
    name: input.name,
    kind: input.kind,
    day: String(input.day),
    n: String(input.nonce),
  });
  if (input.github) params.set("gh", input.github);
  params.set("c", input.character);
  return params.toString();
};

// ---------------------------------------------------------------------------
// Seeded randomness (mulberry32 over an FNV-1a hash of the input)

const hash = (s: string) => {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
};

const rng = (seed: number) => {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

// ---------------------------------------------------------------------------
// The shop's inventory

const PALETTES: Palette[] = [
  {
    id: "coal",
    label: "Lump of Coal",
    bg: "#020202",
    fg: "#FEFEFE",
    muted: "#7C7C7C",
    accent: "#0BDD48",
    panel: "#212121",
    panelFg: "#CDCDCD",
    bar: "#0BDD48",
    barAlt: "#F65C4F",
  },
  {
    id: "salmon",
    label: "Smoked Salmon",
    bg: "#F65C4F",
    fg: "#020202",
    muted: "#5C1A12",
    accent: "#FEFEFE",
    panel: "#020202",
    panelFg: "#F2F2F2",
    bar: "#FD8A72",
    barAlt: "#0BDD48",
  },
  {
    id: "frost",
    label: "Fresh Frost",
    bg: "#F2F2F2",
    fg: "#020202",
    muted: "#7C7C7C",
    accent: "#D94A2B",
    panel: "#020202",
    panelFg: "#F2F2F2",
    bar: "#F65C4F",
    barAlt: "#0BDD48",
  },
  {
    id: "spruce",
    label: "Suspicious Spruce",
    bg: "#06331A",
    fg: "#F2F2F2",
    muted: "#7FB894",
    accent: "#FD8A72",
    panel: "#020202",
    panelFg: "#CDCDCD",
    bar: "#0BDD48",
    barAlt: "#FD8A72",
  },
];

// {name} is the sender's first name.
const GREETINGS = [
  "{name}, may your retries be few and your sleeps be long.",
  "We waited for an event. The event was {name}.",
  "{name} was memoized with love and replayed with even more.",
  "Somewhere, an elf is retrying {name}'s present with exponential backoff.",
  "This card was durably executed by {name}. It will outlive your relatives' opinions.",
  "{name} paused for three days and felt fine about it.",
  "Dear {name}: your gift is in a queue. It is a very nice queue.",
  "May your retries be few and your sleeps be long.",
  "Wishing you idempotent cheer and exactly-once eggnog.",
  "This card was durably executed. It will outlive your relatives' opinions.",
  "Seasons greetings from a function that paused for three days and felt fine about it.",
  "Your gift is in a queue. It is a very nice queue.",
  "Fan out the joy. Batch the leftovers.",
  "Somewhere, an elf is retrying your present with exponential backoff.",
  "No servers were provisioned in the making of this card.",
  "Happy holidays from step 7. Steps 1 through 6 send their regards.",
  "Rest. Even long-running functions sleep sometimes.",
];

// Made-up reindeer only. They are all named after flow control.
const REINDEER = [
  "Backoff",
  "Debounce",
  "Fanout",
  "Memo",
  "Cronjob",
  "Singleton",
  "Throttle",
  "Retry",
];

const VARIANTS = ["classic", "warm", "unhinged"];

const STUCK_EXCUSES = [
  "motivation/arrived",
  "coffee/brewed",
  "elf/unblocked",
  "inspiration/received",
];

const dayLabel = (day: number) => DAYS[day - 1].topic;

const HEADLINES: Record<CardKind, (day: number) => string> = {
  participating: (day) =>
    `I'm participating in the 12 Days of Workflows. Day ${day}: ${dayLabel(
      day
    )}.`,
  completed: () =>
    "I completed the 12 Days of Workflows and all I got was this card.",
  stuck: (day) =>
    `I'm on day ${day} of the 12 Days of Workflows. I'm not stuck, I'm waiting for an event.`,
};

const EYEBROWS: Record<CardKind, string> = {
  participating: "Inngest Card Shop · Run in progress",
  completed: "Inngest Card Shop · Run completed",
  stuck: "Inngest Card Shop · Run paused",
};

// ---------------------------------------------------------------------------
// The workflow

/**
 * "Runs" the card workflow. Each block below is one day's primitive, in
 * series order, and each one changes the card.
 *
 * Every block draws from the RNG whether or not its day has run yet, so
 * the same name gets the same paper, snow and greeting on day 3 as on
 * day 12 — only the trace's progress changes.
 */
export const runWeirdWorkflow = (input: CardInput): CardSpec => {
  const r = rng(hash(`${input.name.toLowerCase()}|${input.nonce}`));
  const pick = <T>(arr: readonly T[]) => arr[Math.floor(r() * arr.length)];
  const between = (min: number, max: number) => min + r() * (max - min);
  const int = (min: number, max: number) => Math.floor(between(min, max + 1));
  const specks = (count: number, size: [number, number]): Speck[] =>
    Array.from({ length: count }, () => ({
      x: r(),
      y: r(),
      size: between(size[0], size[1]),
      opacity: between(0.25, 0.9),
    }));

  // How far the run has got: completed cards finish all 12 days.
  const reached = input.kind === "completed" ? 13 : input.day;
  const statusFor = (day: number): RowStatus =>
    day < reached ? "done" : day === reached ? "current" : "pending";

  const trace: TraceRow[] = [];
  let cursor = 0;
  const addRow = (row: {
    width: number;
    waiting: boolean;
    duration: string;
    log: string;
  }) => {
    const day = trace.length + 1;
    const offset = Math.min(cursor, 0.92);
    const width = Math.max(0.03, Math.min(row.width, 1 - offset));
    const status = statusFor(day);
    trace.push({
      ...row,
      day,
      primitive: DAYS[day - 1].label,
      offset,
      width,
      status,
      duration:
        status === "pending"
          ? "queued"
          : status === "current"
          ? input.kind === "stuck"
            ? "waiting"
            : "running"
          : row.duration,
      log:
        status === "pending"
          ? `Day ${day}: hasn't run yet.`
          : status === "current" && input.kind === "stuck"
          ? `Day ${day}: waiting for "${pick(STUCK_EXCUSES)}". Any day now.`
          : row.log,
    });
    cursor = offset + width * between(0.4, 1);
  };

  // Day 1. step.run — pick the paper stock. The supplier failed twice;
  // the step retried and the paper was only paid for once.
  const palette = pick(PALETTES);
  addRow({
    width: between(0.06, 0.12),
    waiting: false,
    duration: `${int(12, 180)}ms`,
    log: `Picked "${palette.label}" paper. Failed twice, retried, billed once.`,
  });

  // Day 2. RetryAfterError — the glitter supplier said "back in 5s".
  const glitter = specks(int(24, 60), [2, 4]);
  addRow({
    width: between(0.08, 0.14),
    waiting: true,
    duration: "5s",
    log: `Glitter supplier threw RetryAfterError("5s"). Came back in 5s for ${glitter.length} pieces.`,
  });

  // Day 3. step.invoke — a separate function with retries: 10 hangs the
  // garland, because ornaments fail differently than paper.
  const garlandAmp = between(0.15, 0.45);
  const garlandPhase = r() * Math.PI * 2;
  const garland = Array.from({ length: 12 }, (_, i) =>
    Math.min(
      1,
      Math.max(
        0,
        0.5 + Math.sin(i * 0.9 + garlandPhase) * garlandAmp + (r() - 0.5) * 0.25
      )
    )
  );
  const garlandFails = int(3, 7);
  addRow({
    width: between(0.1, 0.18),
    waiting: false,
    duration: `${int(300, 1500)}ms`,
    log: `Invoked hang-the-garland (retries: 10). It dropped an ornament ${garlandFails} times, then hung all 12.`,
  });

  // Day 4. step.waitForEvent — an elf has to approve it.
  const elfNumber = int(1, 99);
  const elfTimedOut = r() < 0.25;
  addRow({
    width: between(0.15, 0.28),
    waiting: true,
    duration: elfTimedOut ? "48h timeout" : `${int(1, 47)}h`,
    log: elfTimedOut
      ? "Waited 48h for an elf. None came. Approved it ourselves."
      : `Elf #${elfNumber} sent elf/card.approved.`,
  });

  // Day 5. step.sleepUntil + cancelOn — sleep until Christmas morning
  // unless coal is delivered first. A nightly cron swept stale drafts.
  const swept = int(2, 40);
  addRow({
    width: between(0.2, 0.3),
    waiting: true,
    duration: "Dec 25",
    log: `Slept until Christmas morning. No shop/coal.delivered arrived, so it wasn't cancelled. The 3am cron swept ${swept} stale drafts.`,
  });

  // Day 6. concurrency with a key — one lane per elf.
  const elves = int(2, 9);
  addRow({
    width: between(0.05, 0.1),
    waiting: false,
    duration: `${int(1, 9)}ms`,
    log: `${elves} elves, one lane each (key: "event.data.elf"). Nobody cut the glue line.`,
  });

  // Day 7. throttle — the North Pole snow API allows 5 flakes per 10s.
  const snow = specks(int(16, 70), [3, 7]);
  addRow({
    width: between(0.12, 0.22),
    waiting: true,
    duration: `${Math.ceil(snow.length / 4) * 10}s`,
    log: `Throttled to 4 snow requests per 10s. ${snow.length} snowflakes, zero 429s.`,
  });

  // Day 8. debounce — the greeting is written once, after you stop
  // smashing "regenerate".
  const smashes = int(4, 19);
  const greeting = pick(GREETINGS).replaceAll("{name}", firstName(input.name));
  addRow({
    width: between(0.08, 0.16),
    waiting: true,
    duration: "3s",
    log: `You hit regenerate ${smashes} times. Debounced to one AI call: "${greeting}"`,
  });

  // Day 9. step.sendEvent — fan out one event per reindeer.
  const reindeer = pick(REINDEER);
  const crockford = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const runId = `01J${Array.from({ length: 23 }, () =>
    pick(crockford.split(""))
  ).join("")}`;
  addRow({
    width: 0.06,
    waiting: false,
    duration: `${int(4, 30)}ms`,
    log: `Fanned out 8 reindeer/harness.requested events. ${reindeer} retried alone; nobody got harnessed twice.`,
  });

  // Day 10. priority — this card cuts the line.
  const serial = String(int(1, 9999)).padStart(4, "0");
  addRow({
    width: between(0.04, 0.08),
    waiting: false,
    duration: "+120",
    log: `Priority +120 (you're pro at holidays). Card No. ${serial} skipped ${int(
      12,
      400
    )} free-tier cards.`,
  });

  // Day 11. batchEvents — every sparkle is an event; write them in bulk.
  const sparkles = int(60, 240);
  addRow({
    width: between(0.06, 0.12),
    waiting: true,
    duration: "5s",
    log: `${sparkles} sparkle/added events, batched 50 at a time into ${Math.ceil(
      sparkles / 50
    )} writes.`,
  });

  // Day 12. group.experiment — A/B test the card's tone, then score it.
  const variant = pick(VARIANTS);
  const score = between(0.71, 0.99).toFixed(2);
  addRow({
    width: between(0.06, 0.1),
    waiting: false,
    duration: score,
    log: `Experiment card-tone picked "${variant}". step.score: ${score}. Recipient reactions get scored later.`,
  });

  // Stamps are earned: each one only shows once its day has run.
  const ran = (day: number) => statusFor(day) === "done";
  const stamps = [
    input.kind === "completed" ? "12/12 days" : `Day ${input.day}/12`,
    ran(4) &&
      (elfTimedOut
        ? "Elf timed out · approved anyway"
        : `Approved by elf #${elfNumber}`),
    ran(5) && "Coal-proof",
    ran(12) && `Variant: ${variant} · ${score}`,
  ].filter((s): s is string => Boolean(s));

  return {
    input,
    palette,
    eyebrow: EYEBROWS[input.kind],
    headline: HEADLINES[input.kind](input.day),
    greeting,
    stamps,
    serial,
    runId,
    snow,
    glitter,
    garland,
    garlandLetters: garlandLettersFor(input.name),
    big: input.kind === "completed" ? "DONE." : `DAY ${input.day}`,
    small: {
      participating: "of 12. Going great.",
      completed: "All I got was this card.",
      stuck: "Not stuck. Waiting for an event.",
    }[input.kind],
    functionId: `make-a-card-for-${
      slugify(firstName(input.name)).slice(0, 14) || "you"
    }`,
    trace,
  };
};

/** The function the card pretends to be, shown on the page. */
export const WORKFLOW_SOURCE = `// One greeting card. All twelve primitives. None of them necessary.
export const makeACard = inngest.createFunction(
  {
    id: "make-a-weird-card",
    triggers: [cardRequested],
    concurrency: [{ key: "event.data.elf", limit: 1 }],      // Day 6
    debounce: { key: "event.data.cardId", period: "3s" },     // Day 8
    priority: { run: "event.data.plan == 'pro' ? 120 : 0" }, // Day 10
    cancelOn: [{ event: coalDelivered, match: "data.cardId" }], // Day 5
    onFailure: async ({ step }) =>                            // Day 2
      step.run("send-coal", () => sendCoal()),
  },
  async ({ event, step, group }) => {
    // Day 1: durable steps
    const paper = await step.run("pick-paper-stock", () => pickPaper());

    // Day 2: fail fast, or come back later
    const glitter = await step.run("buy-glitter", async () => {
      const res = await glitterSupplier.order();
      if (res.status === 410) throw new NonRetriableError("Out of glitter forever");
      if (res.status === 429) throw new RetryAfterError("Glitter rush", "5s");
      return res.glitter;
    });

    // Day 3: compose functions with their own retry policy
    const garland = await step.invoke("hang-the-garland", {
      function: hangTheGarland, // retries: 10
      data: { ornaments: 12 },
    });

    // Day 4: wait for a human (an elf, technically)
    const approval = await step.waitForEvent("wait-for-elf", {
      event: elfApproved,
      match: "data.cardId",
      timeout: "48h",
    });

    // Day 7: hangTheSnow is throttled to 4 per 10s
    const snow = await step.invoke("make-it-snow", { function: hangTheSnow });

    // Day 12: A/B test the tone, score the outcome
    const { result: card, experimentRef } = await group.experiment("card-tone", {
      variants: {
        classic: () => step.run("write-classic", () => writeCard("classic")),
        unhinged: () => step.run("write-unhinged", () => writeCard("unhinged")),
      },
      select: experiment.weighted({ classic: 50, unhinged: 50 }),
    });
    await step.score("score-weirdness", { name: "is-weird", value: true });

    // Day 5: deliver on Christmas morning (cancelOn above can stop it)
    await step.sleepUntil("wait-for-christmas", "2026-12-25T07:00:00Z");

    // Day 9: fan out, one event per reindeer
    await step.sendEvent(
      "harness-the-reindeer",
      reindeer.map((name) => reindeerRequested.create({ name, card }))
    );
  }
);

// Day 11: every sparkle is an event; write them 50 at a time
export const recordSparkles = inngest.createFunction(
  {
    id: "record-sparkles",
    triggers: [sparkleAdded],
    batchEvents: { maxSize: 50, timeout: "5s" },
  },
  async ({ events, step }) =>
    step.run("insert-sparkles", () => insertRows("sparkles", events))
);`;
