"use client";

import PageShell from "@/components/v1/PageShell";
import LogoMarquee from "@/components/v1/sections/Home/LogoMarquee";
import Button from "@/components/v1/Button";
import Chip from "@/components/v1/sections/shared/Chip";
import EventCardLarge from "@/components/v1/sections/Events/EventCardLarge";
import { isPastEvent, sortEventsByDate } from "@/components/v1/sections/Events/data";

const COVER_IMAGE = "/assets/v1/events/lightning-lab-ship-your-first-eval.png";

const EVENT = {
  title: "Inngest Lightning Lab: Ship Your First Eval",
  date: "Wednesday, August 12, 2026 · 11AM PT / 2PM ET",
  startsAt: "2026-08-12T14:00:00-04:00",
  location: "Online (Zoom)",
  presenter: "Mitchell Alderson, Solutions Engineer at Inngest",
};

const REGISTER_URL = "https://luma.com/inngest-r614?utm_source=eventspage";

const RECORDING_URL =
  "https://events.zoom.us/e/recording?videoId=uKbFJoUhRQKS9V71ysKkLw&eventId=Z8vtvPiATTq_LQxwlO8_ZA&organizationId=Jm1kZRVvQC6tCNBq9FaDag";

const COVERAGE = [
  "Determining a first scoring metric",
  "Attaching a scorer to a function you've already deployed",
  "Deferred scoring, so a real product outcome that lands hours or days later becomes the score",
  "Weighted experiments across models and parameters on live traffic",
];

const OTHER_EVENTS = sortEventsByDate([
  {
    id: "aiewf-2026",
    title: "Meet Inngest at AI Engineer World's Fair",
    date: "June 29 – July 2, 2026",
    startsAt: "2026-06-29",
    location: "San Francisco, CA",
    topics: ["events", "booth", "conference"],
    excerpt:
      "Find us at booth #U-G26 all week at Moscone West. Schedule time with the team or come by to see Inngest in action.",
    href: "/events/ai-engineer-worlds-fair-2026",
    image: "/assets/v1/events/social-card-v2.png",
  },
  {
    id: "aiewf-lunch",
    title: "Innhouse lunch with E2B",
    date: "Wednesday, July 1 · 12–2 PM",
    startsAt: "2026-07-01T12:00:00-07:00",
    location: "San Francisco, CA",
    topics: ["free lunch", "rooftop dj", "senor sisig"],
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
    location: "San Francisco, CA",
    topics: ["talk", "agents", "architecture"],
    excerpt:
      "Dan Farrelly on building agent architecture that survives the next trend cycle — Expo Stage 1 at AI Engineer World's Fair.",
    href: "/events/your-agent-architecture-half-life",
    image: "/assets/v1/events/agent-architecture-half-life.png",
    imageFit: "contain",
  },
  {
    id: "aiewf-afterparty",
    title: "AI World's Fair Afterparty",
    date: "Wednesday, July 1 · 6–9 PM",
    startsAt: "2026-07-01T18:00:00-07:00",
    location: "San Francisco, CA",
    topics: ["happy hour", "networking", "digital darts"],
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
    location: "San Francisco, CA",
    topics: ["breakfast", "gpu infra", "reliability"],
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
    location: "San Francisco, CA",
    topics: ["meetup", "ai", "production"],
    excerpt:
      "Join Cursor, Arcade, Vapi, and Inngest at Inngest HQ for an evening of AI in production war stories, demos, and networking. Free with RSVP.",
    href: "https://luma.com/5kvakl4z",
    image: "/assets/v1/events/ai-in-prod-meetup.png",
  },
  {
    id: "inngest-supper-club",
    title: "Inngest Supper Club",
    date: "Wednesday, July 29, 2026 · 6 PM (dinner ~7 PM)",
    startsAt: "2026-07-29T09:00:00-04:00",
    location: "New York, NY",
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
    location: "New York, NY",
    topics: ["Meetups"],
    excerpt:
      "Swing by Stone Street Cafe before work — coffee and a pastry on us, no agenda, just conversation about durable execution.",
    href: "/events/coffee-chats-with-inngest",
    image: "/assets/v1/events/coffee-chats-with-inngest.png",
    imageFit: "contain",
  },
  {
    id: "sf-rooftop-tech-mixer",
    title: "Rooftop Tech Mixer & Demo Night",
    date: "Thursday, August 20, 2026 · 5–9 PM PDT",
    startsAt: "2026-08-20T17:00:00-07:00",
    location: "San Francisco, CA",
    topics: ["mixer", "demo night", "rootly"],
    excerpt:
      "Rooftop views, drinks, and live product demos from Rootly AI, Twingate, Inngest, Spacelift, and more — cohosted with SVB.",
    href: "https://luma.com/r6o27grm",
    image: "/assets/v1/events/sf-rooftop-tech-mixer.png",
  },
  {
    id: "ai-in-production-aug-2026",
    title: "{AI} in Production",
    date: "Tuesday, August 25, 2026 · 6–8 PM PDT",
    startsAt: "2026-08-25T18:00:00-07:00",
    location: "San Francisco, CA",
    topics: ["meetup", "ai", "production"],
    excerpt:
      "Lightning talks and real lessons learned from teams shipping AI in production — cohosted with Nebius Token Factory and Flox at Inngest HQ.",
    href: "https://luma.com/inngest-77ls",
    image: "/assets/v1/events/ai-in-production-aug-2026.png",
  },
  {
    id: "inngest-supper-club-sf",
    title: "Inngest Supper Club: San Francisco",
    date: "Thursday, August 27, 2026 · 6 PM (dinner ~6:45 PM)",
    startsAt: "2026-08-27T18:00:00-07:00",
    location: "San Francisco, CA",
    topics: ["Meetups"],
    excerpt:
      "A small, low-key dinner for people building agents, workflows, and the infra underneath them — no decks, no pitch.",
    href: "/events/inngest-supper-club-sf",
    image: "/assets/v1/events/inngest-supper-club-sf.png",
    imageFit: "contain",
  },
  {
    id: "innhouse-sf-coffee-aug-2026",
    title: "Innhouse with Inngest: Coffee Chats & Pastries",
    date: "Wednesday, August 26, 2026 · 9AM–12PM PDT",
    startsAt: "2026-08-26T09:00:00-07:00",
    location: "San Francisco, CA",
    topics: ["innhouse", "coffee", "pastries"],
    excerpt:
      "Swing by the Inngest office for pastries, espresso, and good conversation — drop in anytime, no fixed schedule.",
    href: "/events/innhouse-sf-coffee-chats",
    image: "/assets/v1/events/innhouse-sf-coffee.png",
    imageFit: "contain",
  },
]);

export default function LightningLabShipYourFirstEval() {
  const otherEvents = OTHER_EVENTS.filter((ev) => !isPastEvent(ev));

  return (
    <PageShell>
      <section
        aria-labelledby="event-hero-heading"
        className="relative w-full overflow-hidden text-v1-frost"
      >
        <div
          aria-hidden="true"
          className="absolute bottom-0 right-0 top-[80px] hidden w-1/2 overflow-hidden lg:block"
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${COVER_IMAGE})`,
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
        </div>

        <div className="relative mx-auto grid w-full max-w-[1440px] grid-cols-1 lg:grid-cols-2">
          <div className="flex flex-col px-6 pb-16 pt-[104px] sm:px-9 lg:pb-[72px] lg:pl-[70px] lg:pr-8 lg:pt-[152px]">
            <div className="flex w-full flex-col gap-10 lg:gap-[51px] lg:pr-8">
              <div className="flex flex-col gap-6">
                <h1
                  id="event-hero-heading"
                  className="text-v1-heading-lg text-[40px] leading-[1.207] sm:text-[48px] lg:text-[58px]"
                >
                  {EVENT.title}
                </h1>
                <p className="font-v1Body text-[14px] leading-[20px] v1-trim">
                  {EVENT.date}
                </p>
                <p className="text-v1-body-xs text-v1-frost/70">
                  Presented by {EVENT.presenter}
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <p className="text-v1-label-md uppercase">Location</p>
                <p className="text-v1-body-sm">{EVENT.location}</p>
              </div>

              <div className="flex flex-col gap-4">
                <p className="text-v1-label-md uppercase">Description</p>
                <p className="text-v1-body-sm">
                  You&apos;re already running agents in prod. Ship your first
                  eval.
                </p>
                <p className="mt-4 text-v1-body-sm">
                  Your agent already runs on Inngest; every step is durable,
                  and its state is recorded. Rich evaluation data already
                  exists as a byproduct.
                </p>
                <p className="mt-4 text-v1-body-sm">
                  In this session, we&apos;ll show you how to turn runs
                  you&apos;re already producing into continuous online scores
                  without adding a second SDK or system.
                </p>
                <p className="mt-4 text-v1-body-sm">
                  In 20 minutes, with code and live demo footage, we&apos;ll
                  cover:
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-v1-body-sm">
                  {COVERAGE.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className="mt-4 text-v1-body-sm">
                  We&apos;ll also be direct about where this doesn&apos;t fit:
                  if you need versioned offline datasets and offline
                  experiment tracking, online scoring is a complement, not a
                  replacement.
                </p>
                <p className="mt-4 text-v1-body-sm">
                  For: teams already running functions or agents on Inngest
                  who haven&apos;t turned on Agent Evals yet.
                </p>
              </div>

              {isPastEvent(EVENT) ? (
                <div className="flex flex-col items-start gap-4">
                  <Chip variant="solid" size="md" className="self-start font-normal">
                    Past event
                  </Chip>
                  <Button asChild variant="accent" className="self-start">
                    <a href={RECORDING_URL} target="_blank" rel="noopener noreferrer">
                      Watch the recording →
                    </a>
                  </Button>
                </div>
              ) : (
                <Button asChild variant="accent" className="self-start">
                  <a href={REGISTER_URL} target="_blank" rel="noopener noreferrer">
                    Register here →
                  </a>
                </Button>
              )}
            </div>
          </div>

          <div className="relative min-h-[300px] overflow-hidden bg-black lg:hidden">
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${COVER_IMAGE})`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />
          </div>
        </div>
      </section>

      <LogoMarquee />

      {otherEvents.length > 0 && (
        <section
          aria-labelledby="event-other-heading"
          className="relative mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 py-8 text-v1-frost sm:px-9 lg:gap-10 lg:px-[70px]"
        >
          <h2
            id="event-other-heading"
            className="text-v1-heading-md-cap text-white"
          >
            Other upcoming events
          </h2>
          <ul className="flex list-none flex-col gap-8 pl-0 lg:gap-10">
            {otherEvents.map((ev) => (
              <li key={ev.id} className="list-none">
                <EventCardLarge ev={ev} newTab={ev.href.startsWith("http")} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </PageShell>
  );
}
