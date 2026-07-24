"use client";

import { motion } from "motion/react";
import { reveals } from "@/utils/v1/reveals";
import { cn } from "@/utils/v1/cn";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";

interface Problem {
  id: string;
  /** White line-art icon, exported @2x (~252px). */
  icon: string;
  /** Heading/Sm label — stored uppercase to match the design copy. */
  label: string;
  body: string;
}

const PROBLEMS: Problem[] = [
  {
    id: "grepping-logs",
    icon: "/assets/v1/observability/grepping-logs.png",
    label: "GREPPING LOGS",
    body: "One-off scripts just to answer basic questions",
  },
  {
    id: "no-step-level-content",
    icon: "/assets/v1/observability/no-step-level.png",
    label: "NO STEP-LEVEL CONTENT",
    body: "See the failure, not where or why",
  },
  {
    id: "slow-resolution",
    icon: "/assets/v1/observability/slow-resolution.png",
    label: "SLOW RESOLUTION",
    body: "Correlation can cost you hours",
  },
];

export default function PipelineBreaks() {
  return (
    <Section aria-labelledby="ob-pipeline-breaks-heading" className="relative">
      <SectionHeader
        id="ob-pipeline-breaks-heading"
        title={
          <>
            Your pipeline breaks at 2am&mdash;
            <br aria-hidden="true" />
            now what?
          </>
        }
        body="Finding the answer used to mean grepping logs and hunting trace IDs. Here's the problem with the standard way of resolving incidents:"
        bodyClassName="max-w-[655px]"
      />

      {/* Problems — icon above a bordered caption card. 3-up at lg (cards
          abut into one bordered strip via -ml-px); stacked on mobile. */}
      <div className="mt-10 sm:mt-20 lg:mt-24">
        <ul className="grid list-none grid-cols-1 gap-y-16 pl-0 sm:gap-y-12 lg:grid-cols-3 lg:gap-y-0">
          {PROBLEMS.map((p, i) => (
            <motion.li
              key={p.id}
              {...reveals.item(i)}
              className="flex list-none flex-col items-center gap-[28px] sm:gap-[52px] lg:gap-16"
            >
              <img
                src={p.icon}
                alt=""
                aria-hidden="true"
                className="h-[96px] w-auto max-w-none shrink-0 sm:h-[112px] lg:h-[126px]"
              />
              <div
                className={cn(
                  "flex w-full flex-1 flex-col items-center justify-center gap-4 border border-v1-carbon-100 px-5 py-6 text-center sm:gap-7 sm:px-6 sm:py-8",
                  i > 0 && "lg:-ml-px",
                )}
              >
                {/* Label keeps its bespoke 20px/1.2 mobile size — a
                    scaled-down Heading/Sm with no matching token. */}
                <p className="text-[20px] leading-[1.2] tracking-[-0.01em] sm:text-v1-heading-sm">
                  {p.label}
                </p>
                <p className="text-v1-body-sm sm:text-v1-body-lg">
                  {p.body}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
