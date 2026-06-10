"use client";

import { type ReactNode } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import GradientFrame from "@/components/v1/sections/shared/GradientFrame";
import InlineCode from "@/components/v1/sections/shared/InlineCode";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import { V1_HEADER_CONTENT_MT } from "@/components/v1/sections/shared/sectionShell";
import { reveals } from "@/utils/v1/reveals";

interface Feature {
  id: string;
  title: string;
  body: ReactNode;
  docsHref?: string;
}

const FEATURES: Feature[] = [
  {
    id: "fan-out-at-scale",
    title: "Fan-out at scale",
    body: (
      <>
        Send an array of events from within your cron. Each one
        spawns an independent job with its own retries. No batching
        logic needed.
      </>
    ),
    docsHref: "/docs/guides/fan-out-jobs",
  },
  {
    id: "serverless-first",
    title: "Serverless-first",
    body: (
      <>
        Scheduled jobs run on your existing deployment. No
        dedicated workers, no separate infrastructure — just your
        code, invoked on schedule.
      </>
    ),
    docsHref: "/docs/platform/deployment",
  },
  {
    id: "schedule-in-timezones",
    title: "Schedule in timezones",
    body: (
      <>
        Use <InlineCode>TZ=America/New_York</InlineCode> prefix in
        your cron expression. Inngest handles DST and timezone math
        so your jobs run when your users expect.
      </>
    ),
    docsHref: "/docs/guides/scheduled-functions",
  },
  {
    id: "cancel-before-firing",
    title: "Cancel before firing",
    body: (
      <>
        A function sleeping until tomorrow can be automatically
        cancelled the moment a matching event arrives. No stored
        job IDs.
      </>
    ),
    docsHref: "/docs/features/inngest-functions/cancellation/cancel-on-events",
  },
  {
    id: "mix-cron-and-events",
    title: "Mix cron and events",
    body: (
      <>
        Trigger functions by schedule and/or event; run your daily
        report automatically, or trigger on demand.
      </>
    ),
    docsHref: "/docs/features/events-triggers",
  },
  {
    id: "full-visibility",
    title: "Full visibility into every run",
    body: (
      <>
        See execution history, step-level traces, and failure
        reasons for every run. No more guessing if your cron fired.
      </>
    ),
    docsHref: "/docs/platform/monitor/inspecting-function-runs",
  },
];

export default function Features() {
  return (
    <Section aria-labelledby="cron-features-heading" className="relative">
      {/* Section contents sit in a black-gradient frame (radius 8) with
          a gradient stroke. Desktop frame padding
          is asymmetric: 40px left / 16px right / 64px vertical — the
          right is lighter because each grid cell carries its own 64px
          right padding (lg:pr-16); scaled down below lg. */}
      <GradientFrame
        variant="black"
        className="rounded-[8px]"
        innerClassName="flex flex-col px-6 py-10 sm:px-8 lg:py-16 lg:pl-10 lg:pr-4"
      >
        <SectionHeader
          id="cron-features-heading"
          eyebrow="Why modern teams choose Inngest for scheduled jobs"
          title={
            <>
              <span className="block">Everything for</span>
              <span className="block">production pipelines</span>
            </>
          }
        />

        <ul className={`${V1_HEADER_CONTENT_MT} grid list-none grid-cols-1 gap-x-4 gap-y-10 pl-0 sm:grid-cols-2 sm:gap-y-12 lg:grid-cols-3 lg:gap-y-16`}>
          {FEATURES.map((f, i) => (
            <motion.li
              key={f.id}
              {...reveals.item(i)}
              className="flex list-none flex-col gap-6 sm:pr-8 lg:pr-16"
            >
              <h3 className="text-v1-heading-sm text-v1-frost">
                {f.title}
              </h3>
              <p className="text-v1-body-sm">{f.body}</p>
              {f.docsHref && (
                <Link
                  href={f.docsHref}
                  prefetch={false}
                  className="inline-flex w-fit items-center gap-1 rounded border border-v1-frost/20 px-3 py-1 font-v1Mono text-[11px] uppercase tracking-[0.08em] text-v1-frost/70 motion-safe:transition-colors motion-safe:duration-200 hover:border-v1-frost/50 hover:text-v1-frost"
                >
                  See Docs
                </Link>
              )}
            </motion.li>
          ))}
        </ul>
      </GradientFrame>
    </Section>
  );
}
