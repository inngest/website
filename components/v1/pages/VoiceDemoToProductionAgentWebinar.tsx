"use client";

import PageShell from "@/components/v1/PageShell";
import LogoMarquee from "@/components/v1/sections/Home/LogoMarquee";
import Button from "@/components/v1/Button";
import EventCardLarge from "@/components/v1/sections/Events/EventCardLarge";
import SpotlightFrame from "@/components/v1/sections/Events/SpotlightFrame";
import { sortEventsByDate } from "@/components/v1/sections/Events/data";

const COVER_IMAGE = "/assets/v1/events/voice-demo-to-production-agent.png";

const EVENT = {
  title: "From Voice Demo to Production Agent: Building Reliable AI Workflows",
  date: "Wednesday, July 29, 2026 · 11AM PT / 2PM ET",
  location: "Online · Virtual Webinar",
};

const REGISTER_URL = "https://luma.com/lqnm60ut";

const SPEAKERS = [
  {
    name: "Amanda Martin",
    role: "Head of Developer Relations, Vapi",
    avatar: "/assets/v1/events/amanda-martin-headshot.jpg",
  },
  {
    name: "Sterling Chin",
    role: "Head of Developer Relations, Inngest",
    avatar: "/assets/v1/events/sterling-chin-headshot.png",
  },
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
    id: "aiewf-breakfast-nebius",
    title: "No Half-Baked Agents: Breakfast w/ Inngest & Nebius",
    date: "Thursday, July 2 · 8–9:30 AM PT",
    startsAt: "2026-07-02T08:00:00-07:00",
    location: "San Francisco, CA",
    topics: ["breakfast", "nebius", "gpu"],
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
]);

export default function VoiceDemoToProductionAgentWebinar() {
  return (
    <PageShell>
      <section
        aria-labelledby="event-hero-heading"
        className="relative w-full overflow-hidden text-v1-frost"
      >
        <div
          aria-hidden="true"
          className="absolute bottom-0 right-0 top-[80px] hidden w-1/2 overflow-hidden bg-v1-surfaceElevated lg:block"
        >
          {COVER_IMAGE && (
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${COVER_IMAGE})`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />
          )}
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
              </div>

              <div className="flex flex-col gap-4">
                <p className="text-v1-label-md uppercase">Location</p>
                <p className="text-v1-body-sm">{EVENT.location}</p>
              </div>

              <div className="flex flex-col gap-4">
                <p className="text-v1-label-md uppercase">Description</p>
                <p className="text-v1-body-sm">
                  In this live session, <strong>Amanda Martin (Vapi)</strong>{" "}
                  and <strong>Sterling Chin (Inngest)</strong> will build a
                  production-ready AI voice agent from scratch, and show how
                  modern agent infrastructure comes together.
                </p>
                <p className="mt-4 text-v1-body-sm">
                  You&apos;ll see how Vapi handles natural voice conversations
                  while Inngest powers the durable workflows behind the
                  scenes—including orchestration, retries, long-running
                  execution, and AI evaluations to measure quality over time.
                </p>
                <p className="mt-4 text-v1-body-sm">
                  Whether you&apos;re building customer support, scheduling
                  assistants, internal copilots, or autonomous agents,
                  you&apos;ll leave with practical patterns for shipping
                  reliable AI systems instead of impressive demos.
                </p>
              </div>

              <Button asChild variant="accent" className="self-start">
                <a href={REGISTER_URL} target="_blank" rel="noopener noreferrer">
                  Register here →
                </a>
              </Button>
            </div>
          </div>

          <div className="relative min-h-[300px] overflow-hidden bg-v1-surfaceElevated lg:hidden">
            {COVER_IMAGE && (
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${COVER_IMAGE})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            )}
          </div>
        </div>
      </section>

      <section
        aria-labelledby="event-speakers-heading"
        className="relative mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 py-8 text-v1-frost sm:px-9 lg:gap-10 lg:px-[70px]"
      >
        <h2
          id="event-speakers-heading"
          className="text-v1-heading-md-cap text-white"
        >
          Speakers
        </h2>
        <ul className="grid list-none grid-cols-1 gap-6 pl-0 sm:grid-cols-2 lg:max-w-[900px]">
          {SPEAKERS.map((speaker) => (
            <li key={speaker.name} className="list-none">
              <SpotlightFrame
                className="rounded-[10px]"
                innerClassName="flex gap-4 p-4 sm:gap-5 sm:p-5"
              >
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-v1-surfaceElevated sm:h-24 sm:w-24">
                  <img
                    src={speaker.avatar}
                    alt={speaker.name}
                    loading="lazy"
                    className="h-full w-full object-cover mix-blend-luminosity"
                  />
                </div>
                <div className="flex min-w-0 flex-col gap-1 sm:gap-2">
                  <p className="text-[18px] font-normal leading-[24px] tracking-[-0.18px] text-white">
                    {speaker.name}
                  </p>
                  <p className="text-[14px] leading-[20px] text-v1-frost/80">
                    {speaker.role}
                  </p>
                </div>
              </SpotlightFrame>
            </li>
          ))}
        </ul>
      </section>

      <LogoMarquee />

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
          {OTHER_EVENTS.map((ev) => (
            <li key={ev.id} className="list-none">
              <EventCardLarge ev={ev} newTab={ev.href.startsWith("http")} />
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}
