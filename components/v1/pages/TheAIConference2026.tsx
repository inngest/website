"use client";

import PageShell from "@/components/v1/PageShell";
import LogoMarquee from "@/components/v1/sections/Home/LogoMarquee";
import Button from "@/components/v1/Button";
import Chip from "@/components/v1/sections/shared/Chip";
import EventCardLarge from "@/components/v1/sections/Events/EventCardLarge";
import { ALL_EVENTS, isPastEvent } from "@/components/v1/sections/Events/data";

const COVER_IMAGE = "/assets/v1/events/the-ai-conference-2026.png";

const EVENT = {
  id: "the-ai-conference-2026",
  title: "Meet Inngest at The AI Conference",
  date: "September 30 – October 1, 2026",
  startsAt: "2026-09-30T09:00:00-07:00",
  endsAt: "2026-10-01T18:00:00-07:00",
  location: "Pier 48, San Francisco, CA | Booth #136",
  description:
    "Inngest is agent infrastructure that lives in your codebase—write your logic as functions and get retries, flow control, and full observability with zero extra infra.\n\nWe're sponsoring The AI Conference at Pier 48. Come by booth #136 to see Inngest running, talk through the agent or workflow you're building, and grab some swag while you're there.",
};

const REGISTER_URL = "https://aiconference.com/";

export default function TheAIConference2026() {
  // Derived from the shared events data rather than a hand-copied list, so
  // this rail can't drift from /events as event details change.
  const otherEvents = ALL_EVENTS.filter(
    (ev) => ev.id !== EVENT.id && !isPastEvent(ev)
  );

  return (
    <PageShell>
      <section
        aria-labelledby="event-hero-heading"
        className="relative w-full overflow-hidden text-v1-frost"
      >
        {/* Right panel — hero cover image */}
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
              {/* Title + date */}
              <div className="flex flex-col gap-6">
                <h1
                  id="event-hero-heading"
                  className="text-v1-heading-lg text-[40px] leading-[1.207] sm:text-[48px] lg:text-[58px]"
                >
                  {EVENT.title}
                </h1>
                <p className="v1-trim font-v1Body text-[14px] leading-[20px]">
                  {EVENT.date}
                </p>
              </div>

              {/* Location */}
              <div className="flex flex-col gap-4">
                <p className="text-v1-label-md uppercase">Location</p>
                <p className="text-v1-body-sm">{EVENT.location}</p>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-4">
                <p className="text-v1-label-md uppercase">Description</p>
                {EVENT.description.split("\n\n").map((para, i) => (
                  <p
                    key={i}
                    className={`text-v1-body-sm${i > 0 ? " mt-4" : ""}`}
                  >
                    {para}
                  </p>
                ))}
              </div>

              {isPastEvent(EVENT) ? (
                <Chip
                  variant="solid"
                  size="md"
                  className="self-start font-normal"
                >
                  Past event
                </Chip>
              ) : (
                <Button asChild variant="accent" className="self-start">
                  <a
                    href={REGISTER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Register to attend →
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Mobile cover */}
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

      {/* Other upcoming events */}
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
