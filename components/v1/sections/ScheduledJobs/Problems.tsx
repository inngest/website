"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { cn } from "@/utils/v1/cn";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import { reveals } from "@/utils/v1/reveals";

// "DID YOUR CRON FINISH?" — single headline + 4 problem cards in a
// row at lg+, stacked on mobile. Each card has the designed icon
// PNG at the top (from /assets/v1/scheduled-jobs/), a top hairline
// border, an uppercase label, and a short body.

interface Problem {
  id: string;
  label: string;
  body: string;
  iconSrc: string;
  iconAlt: string;
  iconWidth: number;
  iconHeight: number;
  /** Per-icon visual cap. The "No retries" and "Can't do more
   *  than run" PNGs read smaller than the other two at the shared
   *  100 px cap, so they get bumped up here to balance the row. */
  iconMaxPx?: number;
  /** Per-card body copy max-width (lg+) so longer copy wraps to more
   *  lines instead of stretching to the full card width. */
  bodyMaxPx: number;
}

const PROBLEMS: Problem[] = [
  {
    id: "no-observability",
    label: "No observability",
    body:
      "Did it finish? Was the output correct? You shouldn't have to build custom logging to know.",
    iconSrc: "/assets/v1/scheduled-jobs/1.png",
    iconAlt: "",
    iconWidth: 182,
    iconHeight: 178,
    bodyMaxPx: 240,
  },
  {
    id: "no-retries",
    label: "No retries",
    body:
      "If your cron fails halfway through, it's gone. Wait until the next scheduled run, or write recoveries.",
    iconSrc: "/assets/v1/scheduled-jobs/2.png",
    iconAlt: "",
    iconWidth: 304,
    iconHeight: 167,
    iconMaxPx: 118,
    bodyMaxPx: 250,
  },
  {
    id: "no-directives",
    label: "No directives",
    body:
      "Traditional crons can't sleep mid-function, fan-out to parallel jobs, or cancel a scheduled run based on business logic.",
    iconSrc: "/assets/v1/scheduled-jobs/3.png",
    iconAlt: "",
    iconWidth: 183,
    iconHeight: 183,
    bodyMaxPx: 312,
  },
  {
    id: "cant-do-more",
    label: "Can't do more than run",
    body:
      "Traditional crons can't sleep mid-function, fan-out to parallel jobs, or cancel a scheduled run based on business logic.",
    iconSrc: "/assets/v1/scheduled-jobs/4.png",
    iconAlt: "",
    iconWidth: 276,
    iconHeight: 202,
    iconMaxPx: 118,
    bodyMaxPx: 312,
  },
];

export default function Problems() {
  return (
    <Section
      aria-labelledby="cron-problems-heading"
      className="relative"
      containerClassName="flex flex-col gap-v1-stack"
    >
      <SectionHeader
        id="cron-problems-heading"
        title="Did your cron finish?"
        body="Platform-specific cron jobs all have the same problem: they fire and forget. You have no idea if the job succeeded, how long it took, or why it failed at 3am."
        bodyClassName="max-w-[655px]"
      />
      {/* Layout matches the design:
          - At lg, the row is a fixed 331 px tall with each column
            `justify-between` — icons hang at the top, cards align
            flush at the bottom edge regardless of body length.
          - Card itself is a hairline-bordered rectangle with centred
            uppercase label + centred body text inside.
          - Cards sit flush against each other on lg+ so adjacent
            borders share a 1px line (collapsed via `-ml-px`).
          - Mobile + sm: stack vertically; sm 2-col with same pattern. */}
      <ul className="grid list-none grid-cols-1 gap-y-10 pl-0 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-14 lg:grid-cols-4 lg:gap-0 lg:h-[331px] lg:py-6">
        {PROBLEMS.map((p, i) => (
          <motion.li
            key={p.id}
            {...reveals.item(i)}
            className="group flex list-none flex-col items-center lg:h-full lg:justify-between"
          >
            {/* Icon scales up slightly on card hover — same transform
                as DurableExecution's ProblemsGrid icon row. */}
            <div className="mb-8 flex h-[130px] w-[130px] items-center justify-center motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out motion-safe:group-hover:scale-110 lg:mb-0 lg:h-[100px] lg:w-auto">
              <Image
                src={p.iconSrc}
                alt={p.iconAlt}
                width={p.iconWidth}
                height={p.iconHeight}
                className="h-auto w-auto object-contain"
                style={{
                  maxWidth: `${p.iconMaxPx ?? 100}px`,
                  maxHeight: `${p.iconMaxPx ?? 100}px`,
                }}
              />
            </div>
            <div
              className={cn(
                "flex w-full flex-col items-center justify-center gap-6 border border-v1-carbon-100 px-4 py-5 text-center",
                // On lg+ collapse adjacent borders so the four cards
                // read as a single row with 1 px dividers.
                "lg:-ml-px lg:first:ml-0",
              )}
            >
              <p className="text-v1-label-md uppercase text-v1-frost">
                {p.label}
              </p>
              <p
                className="text-v1-body-sm"
                style={{ maxWidth: `${p.bodyMaxPx}px` }}
              >
                {p.body}
              </p>
            </div>
          </motion.li>
        ))}
      </ul>
    </Section>
  );
}
