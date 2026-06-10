"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
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
  href?: string;
}

const CAPABILITIES: Capability[] = [
  {
    title: "AI Agents",
    body: "Pause mid-execution, wait for input, then resume exactly where you left off.",
    icon: "/assets/v1/scale-instantly/ai-agents.svg",
    iconWidth: 27.77,
    iconHeight: 32,
    href: "/ai",
  },
  {
    title: "API Endpoints",
    body: "Long-running endpoints that survive timeouts, failures, and deploys.",
    icon: "/assets/v1/scale-instantly/api-endpoints.svg",
    iconWidth: 30.02,
    iconHeight: 25.71,
    href: "/docs/learn/durable-endpoints",
  },
  {
    title: "Workflows",
    body: "Each step retries independently. No failed run restarts from scratch.",
    icon: "/assets/v1/scale-instantly/workflows.svg",
    iconWidth: 32,
    iconHeight: 32,
    href: "/ai",
  },
  {
    title: "Schedules",
    body: "Missed runs recover automatically. Every execution is logged and replayable.",
    icon: "/assets/v1/scale-instantly/schedules.svg",
    iconWidth: 32,
    iconHeight: 12.85,
    href: "/uses/scheduled-jobs",
  },
  {
    title: "Serverless",
    body: "Functions persist state across invocations without a database.",
    icon: "/assets/v1/scale-instantly/serverless.svg",
    iconWidth: 32,
    iconHeight: 20.52,
    href: "/docs/reference/typescript/v4/extended-traces#serverless",
  },
  {
    title: "Events",
    body: "Fan out thousands of jobs per event. Every one tracked, retriable, and replayable.",
    icon: "/assets/v1/scale-instantly/events.svg",
    iconWidth: 21.65,
    iconHeight: 32,
    href: "/uses/webhooks",
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
            className="text-v1-heading-sm !text-[clamp(1.25rem,4vw,1.625rem)] !leading-[1.2] text-v1-frost"
          >
            Inngest collapses event-driven complexity into APIs in your
            codebase.
          </motion.p>
          <motion.p
            {...reveals.body}
            className="text-v1-body-lg-loose !text-[clamp(1rem,3vw,1.125rem)] !leading-[1.45] text-v1-frost"
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

function DashboardVideo() {
  return (
    <div
      className="relative w-full overflow-hidden bg-v1-jetBlack"
      style={{ aspectRatio: "1980 / 1080" }}
    >
      <video
        controls
        autoPlay
        loop
        muted
        src="https://cdn.inngest.com/homepage/june-2026-redesign-dashboard-tour-v2.mp4"
      />
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
  const inner = (
    <>
      <div className="flex items-center gap-[10px]">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center">
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
      <p className="text-v1-heading-xs-loose text-pretty text-[#B3B3B3]">
        {capability.body}
      </p>
    </>
  );

  return (
    <motion.li {...reveals.item(index)} className="flex flex-col gap-2">
      {capability.href ? (
        <Link
          href={capability.href}
          prefetch={false}
          className="-m-3 flex flex-col gap-2 rounded-md p-3 hover:bg-gradient-to-br hover:from-white/[0.06] hover:to-white/[0.02] motion-safe:transition-colors motion-safe:duration-200"
        >
          {inner}
        </Link>
      ) : (
        <div className="flex cursor-default flex-col gap-2">{inner}</div>
      )}
    </motion.li>
  );
}
