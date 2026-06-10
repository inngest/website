"use client";

import { useEffect, useRef } from "react";
import PageShell from "@/components/v1/PageShell";
import LogoMarquee from "@/components/v1/sections/Home/LogoMarquee";

const EVENT = {
  title: "Meet Inngest at AI Engineer World's Fair",
  date: "June 29 – July 2, 2026",
  location: "Moscone West, San Francisco, CA 94103 | Booth #U-G26",
  description:
    "Inngest is agent infrastructure that lives in your codebase — write your logic as functions and get retries, control flow, and full observability with zero extra infra. If you're building agents or tired of babysitting background jobs, come see it in practice at booth #U-G26 all week.\n\nWant dedicated time? Book a slot with the team below.",
};

const GCAL_URL =
  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ3G2ScOpUcmeFwEPSbRH3BdtK8fY627O4WX8dOeVA3s7Lzt17qKiIxu_4VgEHXJZ_Fgdj7EpB67?gv=true";

function SchedulingButton() {
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Inject the Google Calendar scheduling CSS
    const link = document.createElement("link");
    link.href =
      "https://calendar.google.com/calendar/scheduling-button-script.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // Inject the scheduling script, then initialise the button
    const script = document.createElement("script");
    script.src =
      "https://calendar.google.com/calendar/scheduling-button-script.js";
    script.async = true;
    script.onload = () => {
      const cal = (window as { calendar?: { schedulingButton?: { load: (opts: object) => void } } }).calendar;
      if (targetRef.current && cal?.schedulingButton) {
        cal.schedulingButton.load({
          url: GCAL_URL,
          color: "#fb6142",
          label: "Schedule time with us",
          target: targetRef.current,
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(script);
    };
  }, []);

  return <div ref={targetRef} />;
}

export default function AIEngineerWorldsFair() {
  return (
    <PageShell>
      <section
        aria-labelledby="event-hero-heading"
        className="relative w-full overflow-hidden text-v1-frost"
      >
        {/* Right panel — muted placeholder (no cover image for this event) */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 right-0 top-[80px] hidden w-1/2 overflow-hidden bg-v1-surfaceElevated lg:block"
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "url(/assets/v1/events/event-placeholder.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </div>

        <div className="relative mx-auto grid w-full max-w-[1440px] grid-cols-1 lg:grid-cols-2">
          <div className="flex flex-col px-6 pb-16 pt-[104px] sm:px-9 lg:pb-[72px] lg:pl-[70px] lg:pr-8 lg:pt-[152px]">
            <div className="flex w-full flex-col gap-10 lg:gap-[51px] lg:pr-8">
              {/* Title + date */}
              <div className="flex flex-col gap-4">
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

              {/* Location */}
              <div className="flex flex-col gap-4">
                <p className="text-v1-label-md uppercase">Location</p>
                <p className="text-v1-body-sm">{EVENT.location}</p>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-4">
                <p className="text-v1-label-md uppercase">Description</p>
                {EVENT.description.split("\n\n").map((para, i) => (
                  <p key={i} className="text-v1-body-sm">
                    {para}
                  </p>
                ))}
              </div>

              {/* Google Calendar scheduling button */}
              <SchedulingButton />
            </div>
          </div>

          {/* Mobile cover */}
          <div className="relative min-h-[300px] overflow-hidden bg-v1-surfaceElevated lg:hidden">
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "url(/assets/v1/events/event-placeholder.png)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </div>
        </div>
      </section>

      <LogoMarquee />
    </PageShell>
  );
}
