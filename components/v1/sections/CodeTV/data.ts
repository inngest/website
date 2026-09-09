import type { Line } from "@/components/v1/sections/shared/CodeBlock";

/**
 * CodeTV × Inngest Web Dev Challenge landing copy.
 * Team names, people, portraits, and "what they built" are placeholders
 * until the episode details land.
 */

export const PAGE_REF = "codetv-web-dev-challenge";

/** Set when the episode drops. Watch swaps the placeholder for the embed. */
export const EPISODE_YOUTUBE_ID: string | null = null;

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
  },
  {
    eyebrow: "Quickstart",
    title: "Node.js",
    href: "/docs/getting-started/nodejs-quick-start",
  },
  {
    eyebrow: "Quickstart",
    title: "Python",
    href: "/docs/getting-started/python-quick-start",
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
    name: "Team 1",
    members: ["Name forthcoming", "Name forthcoming"],
    image: "/assets/v1/events/codetv/team-1.jpg",
    imageAlt: "Team 1 on the CodeTV Web Dev Challenge set",
    built:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. They shipped something that keeps running while they do anything else — coffee, a walk, a crash, a deploy. Placeholder copy until we write up the real build.",
  },
  {
    id: "team-2",
    number: "02",
    name: "Team 2",
    members: ["Name forthcoming", "Name forthcoming"],
    image: "/assets/v1/events/codetv/team-2.jpg",
    imageAlt: "Team 2 on the CodeTV Web Dev Challenge set",
    built:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Four hours on the clock, a function that waits for the world, and a demo that still works after they walk away. Description forthcoming.",
  },
  {
    id: "team-3",
    number: "03",
    name: "Team 3",
    members: ["Name forthcoming", "Name forthcoming"],
    image: "/assets/v1/events/codetv/team-3.jpg",
    imageAlt: "Team 3 on the CodeTV Web Dev Challenge set",
    built:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. The brief was impossible on purpose. They built anyway. Full write-up forthcoming once the episode is locked.",
  },
] as const;

export const MARQUEE = [
  "While you sleep",
  "Through a crash",
  "After an event",
  "While you grab coffee",
  "Across a deploy",
  "Anything's possible",
] as const;

export const GALLERY = [
  {
    src: "/assets/v1/events/codetv/group.jpg",
    alt: "The CodeTV Web Dev Challenge cast on set",
    className: "aspect-[3/2] lg:col-span-8",
  },
  {
    src: "/assets/v1/events/codetv/pointing.jpg",
    alt: "On set during the CodeTV Web Dev Challenge",
    className: "aspect-[2/3] lg:col-span-4",
  },
  {
    src: "/assets/v1/events/codetv/coding-desk.jpg",
    alt: "Two builders collaborating at the desk during the challenge",
    className: "aspect-[3/2] lg:col-span-4",
  },
  {
    src: "/assets/v1/events/codetv/studio-pair.jpg",
    alt: "Builders on the Web Dev Challenge set",
    className: "aspect-[3/2] lg:col-span-4",
  },
  {
    src: "/assets/v1/events/codetv/clapperboard.jpg",
    alt: "Clapperboard and crew on the Web Dev Challenge set",
    className: "aspect-[3/2] lg:col-span-4",
  },
  {
    src: "/assets/v1/events/codetv/at-the-desk.jpg",
    alt: "A contestant mid-build at the workstation",
    className: "aspect-[2/3] lg:col-span-4",
  },
  {
    src: "/assets/v1/events/codetv/bts-glam.jpg",
    alt: "Behind the scenes on the CodeTV set",
    className: "aspect-[3/2] lg:col-span-8",
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
