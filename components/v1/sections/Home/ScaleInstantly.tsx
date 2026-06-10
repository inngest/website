"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { reveals } from "@/utils/v1/reveals";
import { BlackReveal } from "@/components/v1/sections/shared/BlackReveal";
import GradientFrame from "@/components/v1/sections/shared/GradientFrame";
import Section from "@/components/v1/sections/shared/Section";
import { V1_SECTION_TITLE } from "@/components/v1/sections/shared/sectionTitle";

interface Capability {
  title: string;
  body: string;
  /** Natural intrinsic dimensions; rendered inside a 32×32 slot. */
  icon: string;
  iconWidth: number;
  iconHeight: number;
}

const CAPABILITIES: Capability[] = [
  {
    title: "AI Agents",
    body: "Pause mid-execution, wait for input, then resume exactly where you left off.",
    icon: "/assets/v1/scale-instantly/ai-agents.svg",
    iconWidth: 27.77,
    iconHeight: 32,
  },
  {
    title: "API Endpoints",
    body: "Long-running endpoints that survive timeouts, failures, and deploys.",
    icon: "/assets/v1/scale-instantly/api-endpoints.svg",
    iconWidth: 30.02,
    iconHeight: 25.71,
  },
  {
    title: "Workflows",
    body: "Each step retries independently. No failed run restarts from scratch.",
    icon: "/assets/v1/scale-instantly/workflows.svg",
    iconWidth: 32,
    iconHeight: 32,
  },
  {
    title: "Schedules",
    body: "Missed runs recover automatically. Every execution is logged and replayable.",
    icon: "/assets/v1/scale-instantly/schedules.svg",
    iconWidth: 32,
    iconHeight: 12.85,
  },
  {
    title: "Serverless",
    body: "Functions persist state across invocations without a database.",
    icon: "/assets/v1/scale-instantly/serverless.svg",
    iconWidth: 32,
    iconHeight: 20.52,
  },
  {
    title: "Events",
    body: "Fan out thousands of jobs per event. Every one tracked, retriable, and replayable.",
    icon: "/assets/v1/scale-instantly/events.svg",
    iconWidth: 21.65,
    iconHeight: 32,
  },
];

export default function ScaleInstantly() {
  return (
    <Section aria-label="Durability belongs in code" className="relative">
      <GradientFrame
        variant="charcoal"
        className="rounded-md"
        innerClassName="relative flex flex-col gap-[29px] px-4 pb-[72px] pt-11 lg:gap-20 lg:px-11 lg:pt-16"
      >
        <Header />
        <CapabilityGrid />
      </GradientFrame>
    </Section>
  );
}

function Header() {
  return (
    <div className="flex flex-col gap-12">
      <motion.h2 {...reveals.heading} className={V1_SECTION_TITLE}>
        Durability belongs in code
      </motion.h2>
      <div
        className="
          grid grid-cols-1 gap-4
          lg:grid-cols-[448fr_774fr] lg:items-start lg:gap-x-4 lg:gap-y-10
        "
      >
        <div className="flex flex-col gap-6 lg:pr-8 lg:pt-11">
          <motion.p
            {...reveals.body}
            className="text-v1-heading-sm text-v1-frost !text-[clamp(1.25rem,4vw,1.625rem)] !leading-[1.2]"
          >
            Inngest collapses event-driven complexity into APIs in your
            codebase.
          </motion.p>
          <motion.p
            {...reveals.body}
            className="text-v1-body-lg-loose text-v1-frost !text-[clamp(1rem,3vw,1.125rem)] !leading-[1.45]"
          >
            <span className="block">
              Because durability lives in code&mdash;not tied to any specific
              infrastructure pattern&mdash;the same primitives that power your
              background jobs also power agents and apps. And because Inngest
              handles execution, you get full observability by default.
            </span>
            <span className="mt-[1.5em] block">
              No new infrastructure. No new instrumentation. No new architecture
              when there&rsquo;s a new &lsquo;right way&rsquo; to build in 6
              weeks&rsquo; time.
            </span>
          </motion.p>
        </div>
        <GradientFrame className="relative rounded-md" variant="charcoal">
          <BlackReveal block>
            <DashboardVideo />
          </BlackReveal>
        </GradientFrame>
      </div>
    </div>
  );
}

// Click-to-load YouTube facade for the "Observability by default" demo
// (same video used on /platform/durable-execution). The dashboard
// screenshot is the poster; clicking swaps in the autoplaying player so
// the heavy iframe stays off the initial load until the user opts in.
const OBSERVABILITY_VIDEO_ID = "QQoBDK0OePw";

function DashboardVideo() {
  const [playing, setPlaying] = useState(false);
  return (
    <div
      className="relative w-full overflow-hidden bg-v1-jetBlack"
      style={{ aspectRatio: "1275 / 824" }}
    >
      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube.com/embed/${OBSERVABILITY_VIDEO_ID}?autoplay=1&rel=0`}
          title="Observability by default — Inngest"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : (
        <>
          <img
            src="/assets/v1/scale-instantly/dashboard.webp"
            alt="Inngest run dashboard showing a SQL Agent function with timing, function input, and run history"
            width={1275}
            height={824}
            loading="lazy"
            decoding="async"
            draggable={false}
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="absolute inset-0 block h-full w-full select-none object-cover object-left-top"
          />
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label="Play observability demo"
            className="group absolute inset-0 flex cursor-pointer items-center justify-center"
          >
            <span className="flex size-[80px] items-center justify-center rounded-full bg-v1-frost/15 backdrop-blur-md motion-safe:transition-transform group-hover:scale-110">
              <span className="flex size-[64px] items-center justify-center rounded-full bg-v1-frost/85">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="ml-[3px] size-7 text-v1-jetBlack"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </span>
          </button>
        </>
      )}
    </div>
  );
}

function CapabilityGrid() {
  return (
    <ul
      className="
        grid grid-cols-1 gap-[22px]
        lg:grid-cols-3 lg:gap-[58px]
      "
    >
      {CAPABILITIES.map((c, i) => (
        <CapabilityTile key={c.title} capability={c} index={i} />
      ))}
    </ul>
  );
}

function CapabilityTile({
  capability,
  index,
}: {
  capability: Capability;
  index: number;
}) {
  return (
    <motion.li
      {...reveals.item(index)}
      className="flex cursor-default flex-col gap-2"
    >
      <div className="flex items-center gap-[10px]">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center">
          {/* Hover lift on the icon intentionally disabled — the
              tiles read as a static reference grid rather than a
              hover-driven micro-interaction. */}
          <img
            src={capability.icon}
            alt=""
            aria-hidden="true"
            width={capability.iconWidth}
            height={capability.iconHeight}
            className="block"
          />
        </span>
        <h3 className="text-v1-heading-xs text-v1-frost lg:text-v1-heading-card">
          {capability.title}
        </h3>
      </div>
      <p className="text-pretty text-v1-heading-xs-loose text-[#B3B3B3]">
        {capability.body}
      </p>
    </motion.li>
  );
}
