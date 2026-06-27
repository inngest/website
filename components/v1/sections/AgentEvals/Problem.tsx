"use client";

import { motion } from "motion/react";
import { reveals } from "@/utils/v1/reveals";
import { cn } from "@/utils/v1/cn";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";

/**
 * "Your eval tool can't see business outcomes" — same layout as the
 * Observability page's "Your pipeline breaks at 2am" section (icon above
 * a bordered caption card, 3-up abutting into one strip at lg). Reuses
 * the Observability line-art icons.
 */
interface Problem {
  id: string;
  icon: string;
  label: string;
  body: string;
}

const PROBLEMS: Problem[] = [
  {
    id: "reactive",
    icon: "/assets/v1/observability/grepping-logs.png",
    label: "REACTIVE",
    body: "Today’s tools just tell you when your agent broke, not how it’s doing",
  },
  {
    id: "offline",
    icon: "/assets/v1/observability/no-step-level.png",
    label: "OFFLINE",
    body: "Testing in a sandbox against synthetic traffic is a fraction of reality",
  },
  {
    id: "expensive",
    icon: "/assets/v1/observability/slow-resolution.png",
    label: "EXPENSIVE",
    body: "Sampling your production runs because of cost means you lose valuable insights",
  },
];

export default function Problem() {
  return (
    <Section aria-labelledby="agent-evals-problem-heading" className="relative">
      <SectionHeader
        id="agent-evals-problem-heading"
        eyebrow="The problem"
        title={<>Your eval tool can’t see business outcomes</>}
        body="How do you know if your agent works? LLM as a judge? User ratings? If you want to know which variant actually performed better, you used to have to stitch together data from multiple systems, implement human reviews, and build a layer of instrumentation on top."
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
                <p className="text-[20px] leading-[1.2] tracking-[-0.01em] sm:text-v1-heading-sm">
                  {p.label}
                </p>
                <p className="text-v1-body-sm sm:text-v1-body-lg">{p.body}</p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
