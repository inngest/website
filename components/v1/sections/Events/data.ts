// Events page mock data. Placeholder copy until events are sourced
// from a real backend/CMS — shapes here are the contract the section
// components render against.
// TODO: source UPCOMING / ALL_EVENTS from CMS; keep EventItem as the shape.

export const LOCATIONS = [
  "SAN FRANCISCO, CA",
  "NEW YORK, NY",
  "ONLINE",
] as const;

export const TOPICS = [
  "Events",
  "Meetups",
  "Innhouse",
  "Happy Hours",
  "Webinars",
] as const;

export const SORTS = ["DATE", "ALPHABETICAL"] as const;
export type Sort = (typeof SORTS)[number];

export interface EventItem {
  id: string;
  title: string;
  date: string;
  /** ISO 8601 start time for sorting (display copy stays in `date`). */
  startsAt: string;
  location: string;
  topics: string[];
  excerpt: string;
  href: string;
  recording?: boolean;
  image?: string;
  /** Tile/card image fit. Use `contain` for text-heavy graphics. */
  imageFit?: "cover" | "contain";
}

export function isPastEvent(ev: { startsAt: string }): boolean {
  return new Date(ev.startsAt).getTime() < Date.now();
}

// Past events first (most recently completed leads), then upcoming
// events after (soonest leads).
export function sortEventsByDate(events: EventItem[]): EventItem[] {
  const past = events
    .filter((ev) => isPastEvent(ev))
    .sort((a, b) => b.startsAt.localeCompare(a.startsAt));
  const upcoming = events
    .filter((ev) => !isPastEvent(ev))
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  return [...past, ...upcoming];
}

export const UPCOMING: EventItem[] = [
  {
    id: "aiewf-2026",
    title: "Meet Inngest at AI Engineer World's Fair",
    date: "June 29 – July 2, 2026",
    startsAt: "2026-06-29",
    location: "San Francisco, CA",
    topics: ["Events"],
    excerpt:
      "Find us at booth #U-G26 all week at Moscone West. Schedule time with the team or come by to see Inngest in action.",
    href: "/events/ai-engineer-worlds-fair-2026",
    image: "/assets/v1/events/social-card-v2.png",
  },
  {
    id: "voice-demo-to-production-agent",
    title:
      "From Voice Demo to Production Agent: Building Reliable AI Workflows",
    date: "Wednesday, July 29, 2026 · 11AM PT / 2PM ET",
    startsAt: "2026-07-29T11:00:00-07:00",
    location: "ONLINE",
    topics: ["Webinars"],
    excerpt:
      "Amanda Martin (Vapi) and Sterling Chin (Inngest) build a production-ready AI voice agent live, covering durable workflows, retries, and evaluations.",
    href: "/events/from-voice-demo-to-production-agent",
    image: "/assets/v1/events/voice-demo-to-production-agent.png",
    imageFit: "contain",
  },
  {
    id: "inngest-supper-club",
    title: "Inngest Supper Club",
    date: "Wednesday, July 29, 2026 · 6 PM (dinner ~7 PM)",
    startsAt: "2026-07-29T18:00:00-04:00",
    location: "NEW YORK, NY",
    topics: ["Meetups", "At Capacity"],
    excerpt:
      "An intimate dinner in Peasant's wine cellar in Nolita — no decks, no pitch, just food, wine, and conversation.",
    href: "/events/inngest-supper-club",
    image: "/assets/v1/events/inngest-supper-club.png",
    imageFit: "contain",
  },
  {
    id: "coffee-chats-with-inngest",
    title: "Coffee Chats with Inngest",
    date: "Wednesday, July 29, 2026 · 8–10 AM EDT",
    startsAt: "2026-07-29T08:00:00-04:00",
    location: "NEW YORK, NY",
    topics: ["Meetups"],
    excerpt:
      "Swing by Stone Street Cafe before work — coffee and a pastry on us, no agenda, just conversation about durable execution.",
    href: "/events/coffee-chats-with-inngest",
    image: "/assets/v1/events/coffee-chats-with-inngest.png",
    imageFit: "contain",
  },
];

export const ALL_EVENTS: EventItem[] = sortEventsByDate([
  {
    id: "aiewf-2026",
    title: "Meet Inngest at AI Engineer World's Fair",
    date: "June 29 – July 2, 2026",
    startsAt: "2026-06-29",
    location: "SAN FRANCISCO, CA",
    topics: ["Events"],
    excerpt:
      "Find us at booth #U-G26 all week at Moscone West. Schedule time with the team or come by to see Inngest in action.",
    href: "/events/ai-engineer-worlds-fair-2026",
    image: "/assets/v1/events/social-card-v2.png",
  },
  {
    id: "aiewf-lunch",
    title: "Innhouse lunch with E2B",
    date: "Wednesday, July 1 · 12–2 PM PDT",
    startsAt: "2026-07-01T12:00:00-07:00",
    location: "SAN FRANCISCO, CA",
    topics: ["Innhouse"],
    excerpt:
      "Grab-and-go from Señor Sisig, matcha & coffee, swag, and a rooftop DJ just steps away from Moscone West. Co-hosted with E2B.",
    href: "https://luma.com/umyvwvek?utm_source=inngest",
    image: "/assets/v1/events/innhouse-card.png",
  },
  {
    id: "aiewf-dan-talk",
    title: "Your agent architecture has a half-life of 6 months",
    date: "Wednesday, July 1 · 12:05–12:25 PM PT",
    startsAt: "2026-07-01T12:05:00-07:00",
    location: "SAN FRANCISCO, CA",
    topics: ["Events"],
    excerpt:
      "Dan Farrelly on building agent architecture that survives the next trend cycle — Expo Stage 1 at AI Engineer World's Fair.",
    href: "/events/your-agent-architecture-half-life",
    image: "/assets/v1/events/agent-architecture-half-life.png",
    imageFit: "contain",
  },
  {
    id: "aiewf-afterparty",
    title: "AI World's Fair Afterparty",
    date: "Wednesday, July 1 · 6–9 PM PDT",
    startsAt: "2026-07-01T18:00:00-07:00",
    location: "SAN FRANCISCO, CA",
    topics: ["Happy Hours"],
    excerpt:
      "Join Tailscale, Docker, Aikido Security, Inngest and Rootly for an evening of digital darts, custom cocktails, and networking.",
    href: "https://luma.com/2avil0ni",
    image: "/assets/v1/events/june-sf-engineer.png",
  },
  {
    id: "aiewf-breakfast-nebius",
    title: "No Half-Baked Agents: Breakfast w/ Inngest & Nebius",
    date: "Thursday, July 2 · 8–9:30 AM PT",
    startsAt: "2026-07-02T08:00:00-07:00",
    location: "SAN FRANCISCO, CA",
    topics: ["Innhouse"],
    excerpt:
      "Breakfast tacos, coffee & matcha with the teams building the GPU infrastructure and reliability layer your agents depend on — just steps from Moscone West.",
    href: "/events/no-half-baked-agents-breakfast",
    image: "/assets/v1/events/no-half-baked-agents-breakfast.png",
  },
  {
    id: "aiewf-ai-in-prod",
    title: "{AI} in Production",
    date: "Thursday, July 2 · 6–8 PM PDT",
    startsAt: "2026-07-02T18:00:00-07:00",
    location: "SAN FRANCISCO, CA",
    topics: ["Meetups"],
    excerpt:
      "Join Cursor, Arcade, Vapi, and Inngest at Inngest HQ for an evening of AI in production war stories, demos, and networking. Free with RSVP.",
    href: "https://luma.com/5kvakl4z",
    image: "/assets/v1/events/ai-in-prod-meetup.png",
  },
  {
    id: "voice-demo-to-production-agent",
    title:
      "From Voice Demo to Production Agent: Building Reliable AI Workflows",
    date: "Wednesday, July 29, 2026 · 11AM PT / 2PM ET",
    startsAt: "2026-07-29T11:00:00-07:00",
    location: "ONLINE",
    topics: ["Webinars"],
    excerpt:
      "Amanda Martin (Vapi) and Sterling Chin (Inngest) build a production-ready AI voice agent live, covering durable workflows, retries, and evaluations.",
    href: "/events/from-voice-demo-to-production-agent",
    image: "/assets/v1/events/voice-demo-to-production-agent.png",
    imageFit: "contain",
  },
  {
    id: "inngest-supper-club",
    title: "Inngest Supper Club",
    date: "Wednesday, July 29, 2026 · 6 PM (dinner ~7 PM)",
    startsAt: "2026-07-29T18:00:00-04:00",
    location: "NEW YORK, NY",
    topics: ["Meetups", "At Capacity"],
    excerpt:
      "An intimate dinner in Peasant's wine cellar in Nolita — no decks, no pitch, just food, wine, and conversation.",
    href: "/events/inngest-supper-club",
    image: "/assets/v1/events/inngest-supper-club.png",
    imageFit: "contain",
  },
  {
    id: "coffee-chats-with-inngest",
    title: "Coffee Chats with Inngest",
    date: "Wednesday, July 29, 2026 · 8–10 AM EDT",
    startsAt: "2026-07-29T08:00:00-04:00",
    location: "NEW YORK, NY",
    topics: ["Meetups"],
    excerpt:
      "Swing by Stone Street Cafe before work — coffee and a pastry on us, no agenda, just conversation about durable execution.",
    href: "/events/coffee-chats-with-inngest",
    image: "/assets/v1/events/coffee-chats-with-inngest.png",
    imageFit: "contain",
  },
]);

// ─── Event detail page (/events/sample) ────────────────────────

export interface GuestSpeaker {
  name: string;
  role: string;
  bio: string;
  avatar: string;
}

/** The single event rendered by the detail page hero. */
export const SAMPLE_EVENT = {
  title: "Event title goes here",
  date: "MM/DD/YYYY",
  time: "1:00 PM - 4:00 PM CST",
  location: "1234 Main St. Los Angeles, CA 90002",
  description:
    "Aliquam phasellus aliquet vulputate aliquam. Consequat in interdum imperdiet rhoncus tincidunt purus. Vitae tincidunt sed feugiat ac laoreet. Interdum eu molestie nunc volutpat montes tellus et velit. Leo lectus orci lacus senectus. Egestas quis lacus mauris turpis luctus eget viverra. Ultricies turpis cursus quis",
  registerUrl: "#register",
  /** Cover image — fills the hero's right half. Falls back to a muted
   *  placeholder panel when absent. */
  image: null as string | null,
};

export const SPEAKERS: GuestSpeaker[] = [
  {
    name: "Name of Guest",
    role: "Role, Company",
    bio: "Urna purus velit massa accumsan cras metus vel pellentesque et. Bibendum aliquam et vitae egestas.",
    avatar: "/assets/v1/events/speaker-placeholder.jpg",
  },
  {
    name: "Name of Guest",
    role: "Role, Company",
    bio: "Urna turpis diam libero adipiscing varius lorem. Nisi aliquam adipiscing potenti congue mattis vitae.",
    avatar: "/assets/v1/events/speaker-placeholder.jpg",
  },
  {
    name: "Name of Guest",
    role: "Role, Company",
    bio: "Vulputate suspendisse nam augue odio pulvinar proin donec morbi blandit. Cras metus nibh tellus in.",
    avatar: "/assets/v1/events/speaker-placeholder.jpg",
  },
];

/** "Other upcoming events" cards on the detail page. */
export const OTHER_EVENTS: EventItem[] = [
  {
    id: "o1",
    title: "Event title goes here",
    date: "MM/DD/YYYY",
    startsAt: "2026-01-01",
    location: "ONLINE",
    topics: ["TAG GOES HERE", "TAG GOES HERE", "TAG GOES HERE"],
    excerpt: "Diam quam dolor sed mus venenatis est vitae.",
    href: "/events/sample-2",
  },
  {
    id: "o2",
    title: "Event title goes here",
    date: "MM/DD/YYYY",
    startsAt: "2026-01-02",
    location: "NEW YORK, NY",
    topics: ["TAG GOES HERE", "TAG GOES HERE", "TAG GOES HERE"],
    excerpt: "Diam quam dolor sed mus venenatis est vitae.",
    href: "/events/sample-3",
  },
];
