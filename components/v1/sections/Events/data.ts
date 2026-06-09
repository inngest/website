// Events page mock data. Placeholder copy until events are sourced
// from a real backend/CMS — shapes here are the contract the section
// components render against.
// TODO: source UPCOMING / ALL_EVENTS from CMS; keep EventItem as the shape.

export const LOCATIONS = [
  "ONLINE",
  "LOS ANGELES, CA",
  "DENVER, CO",
  "AUSTIN, TX",
  "NEW YORK, NY",
] as const;

export const TOPICS = [
  "TOPIC GOES HERE",
  "TOPIC GOES HERE",
  "TOPIC GOES HERE",
  "TOPIC GOES HERE",
  "TOPIC GOES HERE",
] as const;

export const SORTS = ["DATE", "ALPHABETICAL"] as const;
export type Sort = (typeof SORTS)[number];

export interface EventItem {
  id: string;
  title: string;
  date: string;
  location: string;
  topics: string[];
  excerpt: string;
  href: string;
  recording?: boolean;
}

export const UPCOMING: EventItem[] = [
  {
    id: "u1",
    title: "Event title goes here",
    date: "MM/DD/YYYY",
    location: "ONLINE",
    topics: ["TAG GOES HERE", "TAG GOES HERE", "TAG GOES HERE"],
    excerpt: "Diam quam dolor sed mus venenatis est vitae.",
    href: "/events/sample",
  },
  {
    id: "u2",
    title: "Event title goes here",
    date: "MM/DD/YYYY",
    location: "NEW YORK, NY",
    topics: ["TAG GOES HERE", "TAG GOES HERE", "TAG GOES HERE"],
    excerpt: "Diam quam dolor sed mus venenatis est vitae.",
    href: "/events/sample",
  },
];

export const ALL_EVENTS: EventItem[] = [
  { id: "e1", title: "Event title goes here", date: "MM/DD/YYYY", location: "ONLINE", topics: ["TOPIC GOES HERE"], excerpt: "Diam quam dolor sed mus venenatis est vitae.", href: "/events/sample" },
  { id: "e2", title: "Event title goes here", date: "MM/DD/YYYY", location: "LOS ANGELES, CA", topics: ["TOPIC GOES HERE"], excerpt: "Diam quam dolor sed mus venenatis est vitae.", href: "/events/sample" },
  { id: "e3", title: "Event title goes here", date: "MM/DD/YYYY", location: "DENVER, CO", topics: ["TOPIC GOES HERE"], excerpt: "Diam quam dolor sed mus venenatis est vitae.", href: "/events/sample", recording: true },
  { id: "e4", title: "Event title goes here", date: "MM/DD/YYYY", location: "AUSTIN, TX", topics: ["TOPIC GOES HERE"], excerpt: "Diam quam dolor sed mus venenatis est vitae.", href: "/events/sample", recording: true },
  { id: "e5", title: "Event title goes here", date: "MM/DD/YYYY", location: "NEW YORK, NY", topics: ["TOPIC GOES HERE"], excerpt: "Diam quam dolor sed mus venenatis est vitae.", href: "/events/sample" },
  { id: "e6", title: "Event title goes here", date: "MM/DD/YYYY", location: "ONLINE", topics: ["TOPIC GOES HERE"], excerpt: "Diam quam dolor sed mus venenatis est vitae.", href: "/events/sample" },
];

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
    location: "ONLINE",
    topics: ["TAG GOES HERE", "TAG GOES HERE", "TAG GOES HERE"],
    excerpt: "Diam quam dolor sed mus venenatis est vitae.",
    href: "/events/sample-2",
  },
  {
    id: "o2",
    title: "Event title goes here",
    date: "MM/DD/YYYY",
    location: "NEW YORK, NY",
    topics: ["TAG GOES HERE", "TAG GOES HERE", "TAG GOES HERE"],
    excerpt: "Diam quam dolor sed mus venenatis est vitae.",
    href: "/events/sample-3",
  },
];
