"use client";

import PageShell from "@/components/v1/PageShell";
import LogoMarquee from "@/components/v1/sections/Home/LogoMarquee";
import Button from "@/components/v1/Button";
import EventCardLarge from "@/components/v1/sections/Events/EventCardLarge";
import { isPastEvent, sortEventsByDate } from "@/components/v1/sections/Events/data";

const COVER_IMAGE = "/assets/v1/events/no-half-baked-agents-breakfast.png";

const EVENT = {
  title: "No Half-Baked Agents: Breakfast w/ Inngest & Nebius",
  date: "Thursday, July 2, 2026 · 8–9:30 AM PT",
  location: "Inngest Office, San Francisco, CA",
  description:
    "The last day of AI Engineer World's Fair calls for a proper breakfast 🌮\n\nBreakfast tacos, coffee & matcha, good music, and the people building the GPU infrastructure and reliability layer your agents depend on — just steps away from Moscone West.\n\nNo agenda, just food and good company before the final day!",
};

const REGISTER_URL = "https://luma.com/3hhkw292?utm_source=inngest";

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
    id: "voice-demo-to-production-agent",
    title:
      "From Voice Demo to Production Agent: Building Reliable AI Workflows",
    date: "Wednesday, July 29, 2026 · 11AM PT / 2PM ET",
    startsAt: "2026-07-29T11:00:00-07:00",
    location: "Online",
    topics: ["webinar", "voice ai", "durable workflows"],
    excerpt:
      "Amanda Martin (Vapi) and Sterling Chin (Inngest) build a production-ready AI voice agent live, covering durable workflows, retries, and evaluations.",
    href: "/events/from-voice-demo-to-production-agent",
    image: "/assets/v1/events/voice-demo-to-production-agent.png",
    imageFit: "contain",
  },
]);

export default function NoHalfBakedAgentsBreakfast() {
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
              </div>

              <div className="flex flex-col gap-4">
                <p className="text-v1-label-md uppercase">Location</p>
                <p className="text-v1-body-sm">{EVENT.location}</p>
              </div>

              <div className="flex flex-col gap-4">
                <p className="text-v1-label-md uppercase">Description</p>
                {EVENT.description.split("\n\n").map((para, i) => (
                  <p key={i} className={`text-v1-body-sm${i > 0 ? " mt-4" : ""}`}>
                    {para}
                  </p>
                ))}
              </div>

              <Button asChild variant="accent" className="self-start">
                <a href={REGISTER_URL} target="_blank" rel="noopener noreferrer">
                  Register here →
                </a>
              </Button>
            </div>
          </div>

          <div className="relative min-h-[300px] overflow-hidden bg-v1-surfaceElevated lg:hidden">
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${COVER_IMAGE})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
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
