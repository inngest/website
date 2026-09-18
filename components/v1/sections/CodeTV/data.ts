import type { Line } from "@/components/v1/sections/shared/CodeBlock";

/**
 * CodeTV × Inngest Web Dev Challenge landing copy.
 * Team write-ups live in `TEAMS`. Gallery stills and the YouTube embed
 * are still filling in as the episode lands.
 */

export const PAGE_REF = "codetv-web-dev-challenge";

/** Indexing starts at 00:00 America/Los_Angeles. Keep in sync with next-sitemap.config.js. */
export const INDEXABLE_AT = "2026-09-22T00:00:00-07:00";

/** Set when the episode drops. Watch swaps the placeholder for the embed. */
export const EPISODE_YOUTUBE_ID: string | null = null;

/** Click-to-color gag in the set gallery. */
export const SCOTT = {
  before: "/assets/v1/events/codetv/scott-before.jpg",
  after: "/assets/v1/events/codetv/scott-after.jpg",
  beforeAlt: "Scott mid-debug, pre-Inngest",
  afterAlt: "Scott after being given Inngest",
} as const;

export const EPISODE_FACTS: {
  label: string;
  value: string;
  live?: boolean;
}[] = [
  { label: "When", value: "August 25" },
  { label: "Filmed", value: "Portland, OR" },
  { label: "Sponsor", value: "Inngest" },
  { label: "Status", value: "Challenge open", live: true },
];

export const QUICKSTARTS = [
  {
    eyebrow: "Quickstart",
    title: "Next.js",
    href: "/docs/getting-started/nextjs-quick-start",
    logo: "/assets/v1/start-building/nextjs.png",
    invert: true,
  },
  {
    eyebrow: "Quickstart",
    title: "Node.js",
    href: "/docs/getting-started/nodejs-quick-start",
    logo: "/assets/v1/start-building/node.svg",
    invert: false,
  },
  {
    eyebrow: "Quickstart",
    title: "Python",
    href: "/docs/getting-started/python-quick-start",
    logo: "/assets/v1/start-building/python.svg",
    invert: true,
  },
] as const;

export const RESOURCE_LINKS = [
  {
    title: "Steps",
    body: "Turn any work into a named checkpoint that retries on its own.",
    href: "/docs/learn/inngest-steps",
  },
  {
    title: "Sleeps",
    body: "Pause for minutes or months without an idle worker.",
    href: "/docs/features/inngest-functions/steps-workflows/sleeps",
  },
  {
    title: "Wait for an event",
    body: "Park the function until the world happens, then continue.",
    href: "/docs/features/inngest-functions/steps-workflows/wait-for-event",
  },
  {
    title: "Retries",
    body: "Failed steps come back automatically from the last checkpoint.",
    href: "/docs/features/inngest-functions/error-retries/retries",
  },
] as const;

export const TEAMS = [
  {
    id: "team-1",
    number: "01",
    name: "Off the Bench",
    members: ["Syscily", "Nadira"],
    image: "/assets/v1/events/codetv/team-1.jpg",
    imageAlt: "Syscily and Nadira of Off the Bench on the CodeTV set",
    built:
      "Off the Bench is an app that lets players and coaches make asynchronous updates to schedules and locations for rec team leagues.",
  },
  {
    id: "team-2",
    number: "02",
    name: "Meatbags",
    members: ["Brian", "Scott"],
    image: "/assets/v1/events/codetv/team-2.jpg",
    imageAlt: "Scott and Brian of Meatbags on the CodeTV set",
    built:
      "Meatbags is the nightmare scenario of an agentic manager that understands your current work and provides demoralizing feedback in real time.",
  },
  {
    id: "team-3",
    number: "03",
    name: "Mailbug",
    members: ["Business Goose", "Eli"],
    image: "/assets/v1/events/codetv/team-3.jpg",
    imageAlt: "Business Goose and Eli of Mailbug on the CodeTV set",
    built:
      "Email sucks. Mailbug to the rescue. This app analyzes emails and intelligently sorts by real priority and impact, so you don't have to.",
  },
] as const;

export const MARQUEE = [
  "Challenge open",
  "Challenge open",
  "Challenge open",
  "Challenge open",
  "Challenge open",
  "Challenge open",
  "Challenge open",
  "Challenge open",
  "Challenge open",
  "Challenge open",
  "Challenge open",
  "Challenge open",
] as const;

export const GALLERY = [
  {
    src: "/assets/v1/events/codetv/group-peace.jpg",
    alt: "The CodeTV Web Dev Challenge cast together on set",
    className: "aspect-[3/2] lg:col-span-8",
  },
  {
    src: "/assets/v1/events/codetv/camera.jpg",
    alt: "A camera filming the Web Dev Challenge",
    className: "aspect-[3/2] lg:col-span-4 lg:aspect-auto",
  },
  {
    src: "/assets/v1/events/codetv/studio-audience.jpg",
    alt: "Teams watching a demo on the CodeTV set",
    className: "aspect-[3/2] lg:col-span-8",
  },
  {
    src: "/assets/v1/events/codetv/briefing.jpg",
    alt: "A briefing under the Web Dev Challenge clock",
    className: "aspect-[3/2] lg:col-span-6",
  },
  {
    src: "/assets/v1/events/codetv/coding-pair.jpg",
    alt: "Two contestants collaborating at a laptop",
    className: "aspect-[3/2] lg:col-span-6",
  },
  {
    src: "/assets/v1/events/codetv/huddle.jpg",
    alt: "A huddle around a monitor during the challenge",
    className: "aspect-[3/2] lg:col-span-6",
  },
  {
    src: "/assets/v1/events/codetv/coffee-break.jpg",
    alt: "Two contestants taking a coffee break at the desk",
    className: "aspect-[3/2] lg:col-span-6",
  },
  {
    src: "/assets/v1/events/codetv/bleachers.jpg",
    alt: "The teams on the bleachers mid-episode",
    className: "aspect-[3/2] lg:col-span-8",
  },
  {
    src: "/assets/v1/events/codetv/pointing.jpg",
    alt: "On set during the CodeTV Web Dev Challenge",
    className: "aspect-[3/2] lg:col-span-4 lg:aspect-auto",
  },
  {
    src: "/assets/v1/events/codetv/coding-desk.jpg",
    alt: "Two builders collaborating at the desk during the challenge",
    className: "aspect-[3/2] lg:col-span-4 lg:aspect-auto",
  },
  {
    src: "/assets/v1/events/codetv/studio-pair.jpg",
    alt: "Builders on the Web Dev Challenge set",
    className: "aspect-[3/2] lg:col-span-4 lg:aspect-auto",
  },
  {
    src: "/assets/v1/events/codetv/clapperboard.jpg",
    alt: "Clapperboard and crew on the Web Dev Challenge set",
    className: "aspect-[3/2] lg:col-span-4 lg:aspect-auto",
  },
  {
    src: "/assets/v1/events/codetv/bts-glam.jpg",
    alt: "Behind the scenes on the CodeTV set",
    className: "aspect-[3/2] lg:col-span-8",
  },
  {
    src: "/assets/v1/events/codetv/host-cameras.jpg",
    alt: "The host laughing on set while cameras roll",
    className: "aspect-[3/2] lg:col-span-6",
  },
  {
    src: "/assets/v1/events/codetv/host-hoodie.jpg",
    alt: "The host with a contestant on the CodeTV lounge set",
    className: "aspect-[3/2] lg:col-span-6",
  },
  {
    src: "/assets/v1/events/codetv/hoodie-directing.jpg",
    alt: "A contestant directing from behind the desks",
    className: "aspect-[3/2] lg:col-span-8",
  },
  {
    src: "/assets/v1/events/codetv/steadicam.jpg",
    alt: "A camera operator filming in front of the Inngest mark",
    className: "aspect-[3/2] lg:col-span-4 lg:aspect-auto",
  },
  {
    src: "/assets/v1/events/codetv/hoodie-back.jpg",
    alt: "The Anti Infra hoodie on the CodeTV lounge set",
    className: "aspect-[3/2] lg:col-span-4 lg:aspect-auto",
  },
  {
    src: "/assets/v1/events/codetv/challenge-sign.jpg",
    alt: "Teams watching under the Web Dev Challenge sign",
    className: "aspect-[3/2] lg:col-span-8",
  },
  {
    src: "/assets/v1/events/codetv/watching-code.jpg",
    alt: "Builders watching a run come together on a monitor",
    className: "aspect-[3/2] lg:col-span-6",
  },
  {
    src: "/assets/v1/events/codetv/contestant-point.jpg",
    alt: "A contestant pointing to camera on the lounge set",
    className: "aspect-[3/2] lg:col-span-6",
  },
  {
    src: "/assets/v1/events/codetv/contestant-lounge.jpg",
    alt: "A contestant on the CodeTV lounge set",
    className: "aspect-[3/2] lg:col-span-6",
  },
  {
    src: "/assets/v1/events/codetv/desk-laugh.jpg",
    alt: "Two builders laughing at the desk during the challenge",
    className: "aspect-[3/2] lg:col-span-6",
  },
] as const;

export const KEEP_GOING_CODE: Line[] = [
  [
    ["inngest", "id"],
    [".", "punc"],
    ["createFunction", "fn"],
    ["(", "punc"],
  ],
  [
    ["  { ", "punc"],
    ["id", "id"],
    [": ", "punc"],
    ['"keep-going"', "str"],
    [" },", "punc"],
  ],
  [
    ["  { ", "punc"],
    ["event", "id"],
    [": ", "punc"],
    ['"challenge.started"', "str"],
    [" },", "punc"],
  ],
  [
    ["  ", "punc"],
    ["async", "kw"],
    [" ({ ", "punc"],
    ["step", "id"],
    [" }) => {", "punc"],
  ],
  [
    ["    ", "punc"],
    ["await", "kw"],
    [" ", "punc"],
    ["step", "id"],
    [".", "punc"],
    ["run", "fn"],
    ["(", "punc"],
    ['"start-the-thing"', "str"],
    [", startIt)", "punc"],
  ],
  [["", "punc"]],
  [
    ["    ", "punc"],
    ["await", "kw"],
    [" ", "punc"],
    ["step", "id"],
    [".", "punc"],
    ["sleep", "fn"],
    ["(", "punc"],
    ['"grab-coffee"', "str"],
    [", ", "punc"],
    ['"20m"', "str"],
    [")", "punc"],
  ],
  [["", "punc"]],
  [
    ["    ", "punc"],
    ["await", "kw"],
    [" ", "punc"],
    ["step", "id"],
    [".", "punc"],
    ["waitForEvent", "fn"],
    ["(", "punc"],
    ['"the-world-happened"', "str"],
    [", {", "punc"],
  ],
  [
    ["      ", "punc"],
    ["event", "id"],
    [": ", "punc"],
    ['"challenge.continue"', "str"],
    [",", "punc"],
  ],
  [
    ["      ", "punc"],
    ["timeout", "id"],
    [": ", "punc"],
    ['"7d"', "str"],
    [",", "punc"],
  ],
  [["    })", "punc"]],
  [["", "punc"]],
  [
    ["    ", "punc"],
    ["await", "kw"],
    [" ", "punc"],
    ["step", "id"],
    [".", "punc"],
    ["run", "fn"],
    ["(", "punc"],
    ['"finish-it"', "str"],
    [", finishIt)", "punc"],
  ],
  [["  }", "punc"]],
  [["", "punc"]],
];
