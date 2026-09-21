import type { Line } from "@/components/v1/sections/shared/CodeBlock";

/**
 * CodeTV × Inngest Web Dev Challenge landing copy.
 * Team write-ups live in `TEAMS`. Gallery stills and the YouTube embed
 * are still filling in as the episode lands.
 */

export const PAGE_REF = "codetv-web-dev-challenge";

export const SUBMIT_APP_HREF =
  "https://docs.google.com/forms/d/e/1FAIpQLSdbJ784vS_A-CdVOV3va-V1htF2vTLinAMHq2Hn4b7QCwmy_Q/viewform?usp=publish-editor";

export const CHALLENGE_STATUS_LEAD = "Challenge Open";
export const CHALLENGE_STATUS_REST = "Submissions close on October 6";
export const CHALLENGE_STATUS = `${CHALLENGE_STATUS_LEAD} - ${CHALLENGE_STATUS_REST}`;

/** Indexing starts at 00:00 America/Los_Angeles. Keep in sync with next-sitemap.config.js. */
export const INDEXABLE_AT = "2026-09-22T00:00:00-07:00";

const CODETV_CDN = "https://cdn.inngest.com/codetv-hackathon-landing-page";

/** Original still on the CodeTV CDN. `copy` is the `(1)` export suffix. */
function still(n: number, copy?: 1) {
  const filename =
    copy === 1
      ? `Web_Dev_Challenge_S3_E6_Stills-${n} (1).jpg`
      : `Web_Dev_Challenge_S3_E6_Stills-${n}.jpg`;
  return `${CODETV_CDN}/${encodeURIComponent(filename)}`;
}

export const HERO_IMAGE = still(139, 1);

/** CodeTV Web Dev Challenge S3.E6. */
export const EPISODE_YOUTUBE_ID = "pui1mW9sexM";

/** Click-to-color gag in the set gallery. */
export const SCOTT = {
  before: still(111, 1),
  after: still(12),
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
  { label: "Status", value: CHALLENGE_STATUS, live: true },
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

export const PRIZES = [
  {
    place: "First Prize",
    description: "1 year of Inngest Pro + Anti-Infra Hoodie",
    image: "/assets/v1/events/codetv/prizes/anti-infra-hoodie.jpg",
    imageAlt: "The back of the Anti-Infra hoodie",
  },
  {
    place: "Second Prize",
    description: "3 months of Pro + Anti-Infra shirt",
    image: "/assets/v1/events/codetv/prizes/anti-infra-shirt.png",
    imageAlt: "The Anti-Infra t-shirt",
  },
  {
    place: "Third Prize",
    description: "1 month of Pro + exclusive sticker pack",
    image: null as string | null,
    imageAlt: "Exclusive sticker pack and one month of Inngest Pro",
    visual: "stickers" as const,
  },
] as const;

export const TEAMS = [
  {
    id: "team-1",
    number: "01",
    name: "Off the Bench",
    members: ["Syscily", "Nadira"],
    image: still(35, 1),
    imageAlt: "Syscily and Nadira of Off the Bench on the CodeTV set",
    built:
      "Off the Bench is an app that lets players and coaches make asynchronous updates to schedules and locations for rec team leagues.",
  },
  {
    id: "team-2",
    number: "02",
    name: "Meatbags",
    members: ["Brian", "Scott"],
    image: still(52),
    imageAlt: "Scott and Brian of Meatbags on the CodeTV set",
    built:
      "Meatbags is my nightmare (the app not the team). An agentic manager that provides demoralizing feedback in real time? Help.",
  },
  {
    id: "team-3",
    number: "03",
    name: "Mailbug",
    members: ["Business Goose", "Eli"],
    image: still(61),
    imageAlt: "Business Goose and Eli of Mailbug on the CodeTV set",
    built:
      "Email sucks. Mailbug to the rescue. This app analyzes emails and intelligently sorts by real priority and impact, so you don't have to.",
  },
] as const;

export const GALLERY = [
  {
    src: still(140),
    alt: "The CodeTV Web Dev Challenge cast together on set",
    className: "aspect-[3/2] lg:col-span-8",
  },
  {
    src: still(22),
    alt: "A camera filming the Web Dev Challenge",
    className: "aspect-[3/2] lg:col-span-4 lg:aspect-auto",
  },
  {
    src: still(146),
    alt: "Teams watching a demo on the CodeTV set",
    className: "aspect-[3/2] lg:col-span-8",
  },
  {
    src: still(27),
    alt: "A briefing under the Web Dev Challenge clock",
    className: "aspect-[3/2] lg:col-span-6",
  },
  {
    src: still(132),
    alt: "Two contestants collaborating at a laptop",
    className: "aspect-[3/2] lg:col-span-6",
  },
  {
    src: still(130),
    alt: "A huddle around a monitor during the challenge",
    className: "aspect-[3/2] lg:col-span-6",
  },
  {
    src: still(28),
    alt: "Two contestants taking a coffee break at the desk",
    className: "aspect-[3/2] lg:col-span-6",
  },
  {
    src: still(148, 1),
    alt: "The teams on the bleachers mid-episode",
    className: "aspect-[3/2] lg:col-span-8",
  },
  {
    src: still(4, 1),
    alt: "On set during the CodeTV Web Dev Challenge",
    className: "aspect-[3/2] lg:col-span-4 lg:aspect-auto",
  },
  {
    src: still(15),
    alt: "Two builders collaborating at the desk during the challenge",
    className: "aspect-[3/2] lg:col-span-4",
  },
  {
    src: still(35, 1),
    alt: "Builders on the Web Dev Challenge set",
    className: "aspect-[3/2] lg:col-span-4",
  },
  {
    src: still(9, 1),
    alt: "Clapperboard and crew on the Web Dev Challenge set",
    className: "aspect-[3/2] lg:col-span-4",
  },
  {
    src: still(2),
    alt: "Behind the scenes on the CodeTV set",
    className: "aspect-[3/2] lg:col-span-8",
  },
  {
    src: still(46),
    alt: "The host laughing on set while cameras roll",
    className: "aspect-[3/2] lg:col-span-6",
  },
  {
    src: still(75, 1),
    alt: "The host with a contestant on the CodeTV lounge set",
    className: "aspect-[3/2] lg:col-span-6",
  },
  {
    src: still(11, 1),
    alt: "A contestant directing from behind the desks",
    className: "aspect-[3/2] lg:col-span-8",
  },
  {
    src: still(18),
    alt: "A camera operator filming in front of the Inngest mark",
    className: "aspect-[3/2] lg:col-span-4 lg:aspect-auto",
  },
  {
    src: still(47),
    alt: "The Anti Infra hoodie on the CodeTV lounge set",
    className: "aspect-[3/2] lg:col-span-4 lg:aspect-auto",
  },
  {
    src: still(129),
    alt: "Teams watching under the Web Dev Challenge sign",
    className: "aspect-[3/2] lg:col-span-8",
  },
  {
    src: still(113),
    alt: "Builders watching a run come together on a monitor",
    className: "aspect-[3/2] lg:col-span-6",
  },
  {
    src: still(39),
    alt: "A contestant pointing to camera on the lounge set",
    className: "aspect-[3/2] lg:col-span-6",
  },
  {
    src: still(42),
    alt: "A contestant on the CodeTV lounge set",
    className: "aspect-[3/2] lg:col-span-6",
  },
  {
    src: still(135, 1),
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
