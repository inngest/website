"use client";

import PageShell from "@/components/v1/PageShell";
import LogoMarquee from "@/components/v1/sections/Home/LogoMarquee";
import Button from "@/components/v1/Button";
import EventCardLarge from "@/components/v1/sections/Events/EventCardLarge";
import SpotlightFrame from "@/components/v1/sections/Events/SpotlightFrame";
import type { EventItem } from "@/components/v1/sections/Events/data";

const COVER_IMAGE = "/assets/v1/events/agent-architecture-half-life.png";

const SCHEDULE_URL =
  "https://www.ai.engineer/worldsfair/schedule?utm_source=inngest";

const SPEAKER = {
  name: "Dan Farrelly",
  role: "CTO & Co-founder, Inngest",
  bio: "Dan is the CTO and Co-founder of Inngest, where he's building the infrastructure layer that keeps AI agents and workflows running reliably. He was previously CTO at Buffer and has spent over a decade building open source tools, including MailDev. When he's not thinking about durable execution, he's restoring a 100-year-old craftsman bungalow one weekend at a time.",
  avatar: "/assets/v1/events/dan-farrelly-headshot.png",
  github: "https://github.com/djfarrelly",
  linkedin: "https://www.linkedin.com/in/djfarrelly",
};

const OTHER_EVENTS: EventItem[] = [
  {
    id: "aiewf-2026",
    title: "Meet Inngest at AI Engineer World's Fair",
    date: "June 29 – July 2, 2026",
    location: "San Francisco, CA",
    topics: ["events", "booth", "conference"],
    excerpt:
      "Find us at booth #U-G26 all week at Moscone West. Schedule time with the team or come by to see Inngest in action.",
    href: "/events/ai-engineer-worlds-fair-2026",
    image: "/assets/v1/events/social-card-v2.png",
  },
  {
    id: "aiewf-breakfast-nebius",
    title: "No Half-Baked Agents: Breakfast with Inngest & Nebius",
    date: "Thursday, July 2 · 8–9:30 AM PT",
    location: "San Francisco, CA",
    topics: ["breakfast", "nebius", "innhouse"],
    excerpt:
      "Breakfast tacos, coffee & matcha with the teams building the GPU infrastructure and reliability layer your agents depend on — just steps from Moscone West.",
    href: "/events/no-half-baked-agents-breakfast",
    image: "/assets/v1/events/no-half-baked-agents-breakfast.png",
  },
  {
    id: "aiewf-lunch",
    title: "innhouse lunch with E2B",
    date: "Wednesday, July 1 · 12–2 PM",
    location: "San Francisco, CA",
    topics: ["free lunch", "rooftop dj", "senor sisig"],
    excerpt:
      "Grab-and-go from Señor Sisig, matcha & coffee, swag, and a rooftop DJ just steps away from Moscone West. Co-hosted with E2B.",
    href: "https://luma.com/umyvwvek?utm_source=inngest",
    image: "/assets/v1/events/innhouse-card.png",
  },
  {
    id: "aiewf-afterparty",
    title: "AI World's Fair Afterparty",
    date: "Wednesday, July 1 · 6–9 PM",
    location: "San Francisco, CA",
    topics: ["happy hour", "networking", "digital darts"],
    excerpt:
      "Join Tailscale, Docker, Aikido Security, Inngest and Rootly for an evening of digital darts, custom cocktails, and networking.",
    href: "https://luma.com/2avil0ni",
    image: "/assets/v1/events/june-sf-engineer.png",
  },
];

export default function AgentArchitectureHalfLifeTalk() {
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
                  Your agent architecture has a half-life of 6 months
                </h1>
                <p className="font-v1Body text-[14px] leading-[20px] v1-trim">
                  Wednesday, July 1, 2026 · 12:05–12:25 PM PT
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <p className="text-v1-label-md uppercase">Location</p>
                <p className="text-v1-body-sm">
                  Moscone West, San Francisco, CA 94103 | Expo Stage 1
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <p className="text-v1-label-md uppercase">Description</p>
                <p className="text-v1-body-sm">
                  A short history of the right way to build an agent: RAG,
                  ReAct, prompt chaining, orchestrator-workers, MCP, CLI, MCP
                  again... CLI again??
                </p>
                <p className="mt-4 text-v1-body-sm">
                  Every time you adopt a trend you rebuild your architecture. In
                  this talk, Dan Farrelly, Inngest co-founder and CTO, is not
                  going to tell you what comes next. He&apos;s going to show you
                  how to build so it doesn&apos;t matter. He&apos;ll cover the
                  core primitives that show up in every production agent, how
                  bringing decisions closer to code provides more stack
                  flexibility, and why the right execution layer unlocks faster
                  iteration.{" "}
                  <a
                    href={SCHEDULE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-v1-accent-salmon"
                  >
                    View on AI Engineer World&apos;s Fair schedule here
                  </a>
                  .
                </p>
              </div>

              <Button asChild variant="accent" className="self-start">
                <a href={SCHEDULE_URL} target="_blank" rel="noopener noreferrer">
                  View on schedule →
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
        <ul className="list-none pl-0 lg:max-w-[480px]">
          <li className="list-none">
            <SpotlightFrame
              className="rounded-[10px]"
              innerClassName="flex gap-4 p-4 sm:gap-5 sm:p-5"
            >
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-v1-surfaceElevated sm:h-24 sm:w-24">
                <img
                  src={SPEAKER.avatar}
                  alt={SPEAKER.name}
                  loading="lazy"
                  className="h-full w-full object-cover mix-blend-luminosity"
                />
              </div>
              <div className="flex min-w-0 flex-col gap-2 sm:gap-3">
                <div className="flex flex-col gap-1">
                  <p className="text-[18px] font-normal leading-[24px] tracking-[-0.18px] text-white">
                    {SPEAKER.name}
                  </p>
                  <p className="text-[14px] leading-[20px] text-v1-frost/80">
                    {SPEAKER.role}
                  </p>
                </div>
                <p className="text-[14px] leading-[20px] text-v1-frost/90">
                  {SPEAKER.bio}
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[14px] leading-[20px]">
                  <a
                    href={SPEAKER.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-v1-accent-salmon"
                  >
                    GitHub
                  </a>
                  <a
                    href={SPEAKER.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-v1-accent-salmon"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </SpotlightFrame>
          </li>
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
