"use client";

import Image from "next/image";
import { cn } from "@/utils/v1/cn";
import ReelCarousel from "@/components/v1/sections/shared/ReelCarousel";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";

interface Primitive {
  id: string;
  api: string;
  body: string;
  illustration: string;
}

const PRIMITIVES: Primitive[] = [
  {
    id: "step-run",
    api: "step.run",
    body: "The core unit of durability. Wrap any piece of work and it becomes a named checkpoint — retried automatically on failure, result cached so it never re-runs if a later step fails.",
    illustration: "/assets/v1/durable-execution/primitives/d1.svg",
  },
  {
    id: "step-sleep",
    api: "step.sleep",
    body: "Suspend a workflow mid-execution for seconds or months at zero cost. No polling loops, no cron jobs, no workers spinning in the background. Resumes exactly where it stopped.",
    illustration: "/assets/v1/durable-execution/primitives/d2.svg",
  },
  {
    id: "step-wait-for-event",
    api: "step.waitForEvent",
    body: "Suspend until a matching external event arrives — an approval, webhook, or user action — then resume with the event data in hand. The function waits at zero cost, however long it takes.",
    illustration: "/assets/v1/durable-execution/primitives/d3.svg",
  },
  {
    id: "step-invoke",
    api: "step.invoke",
    body: "Call another function and wait for its result as a durable step. Compose workflows across functions without losing the durability guarantee. Each child function is independently traced and retried.",
    illustration: "/assets/v1/durable-execution/primitives/d4.svg",
  },
  {
    id: "parallel-steps",
    api: "Parallel steps",
    body: "Send one or more events from within a running function — as a durable step. Fan out to multiple downstream workflows without worrying about partial sends if the function retries.",
    illustration: "/assets/v1/durable-execution/primitives/d5.svg",
  },
  {
    id: "custom-retries",
    api: "Custom retries",
    body: "“Retry everything 3 times” causes more problems than it solves. Zero retries for payments. Exponential backoff for flaky APIs. Immediate retry for bad LLM JSON. Configured per function, not globally inherited.",
    illustration: "/assets/v1/durable-execution/primitives/d6.svg",
  },
];

export default function Primitives() {
  return (
    <Section
      aria-labelledby="de-primitives-heading"
      className="relative"
    >
      <SectionHeader
        id="de-primitives-heading"
        eyebrow="Primitives"
        title="Write durability directly into code."
        body="Steps—or units of work—run once, cache their result, and retry independently on failure. Write normal code, wrap functions in steps, and Inngest does the rest."
        bodyClassName="max-w-[680px]"
      />

      <div className="mt-v1-stack">
        <ReelCarousel
          items={PRIMITIVES}
          getId={(p) => p.id}
          getTitle={(p) => p.api}
        >
        <ReelCarousel.MobileNav itemNoun="primitive" />

        <ReelCarousel.Panel<Primitive>
          heightClass="h-[clamp(360px,40vw,556px)]"
          paddingClass="px-4 py-8 sm:px-10 lg:px-16"
        >
          {(p) => (
            <Image
              src={p.illustration}
              alt={`${p.api} illustration`}
              width={578}
              height={274}
              priority={p.id === "step-run"}
              className="h-auto w-full max-w-[578px]"
            />
          )}
        </ReelCarousel.Panel>

        <ReelCarousel.Directory<Primitive>
          className="mt-10 lg:mt-11"
        >
          {({ item, isActive }) => (
            <span className="flex flex-1 flex-col gap-2 font-v1Heading">
              <span className="text-[28px] leading-10 tracking-[-0.01em] lg:leading-[1.2] lg:[font-size:clamp(1.25rem,1.75vw,1.625rem)]">
                {item.api}
              </span>
              <span
                className={cn(
                  "text-pretty text-lg leading-[1.5] tracking-[-0.01em] motion-safe:transition-colors motion-safe:duration-300 lg:[font-size:clamp(0.8125rem,1.05vw,1rem)]",
                  isActive ? "text-v1-frost" : "text-v1-frost/80",
                )}
              >
                {item.body}
              </span>
            </span>
          )}
        </ReelCarousel.Directory>
        </ReelCarousel>
      </div>
    </Section>
  );
}

