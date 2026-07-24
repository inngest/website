"use client";

/**
 * AI page "three pillars" section — display headline (sticky at lg+)
 * paired with three numbered feature rows. Single column below lg.
 */

import { motion } from "motion/react";
import { reveals } from "@/utils/v1/reveals";
import { cn } from "@/utils/v1/cn";
import Section from "@/components/v1/sections/shared/Section";
import { V1_SECTION_TITLE } from "@/components/v1/sections/shared/sectionTitle";

interface Pillar {
  number: string;
  title: string;
  /** Designer-locked body lines; render as block spans, nowrap at lg+. */
  bodyLines: string[];
}

const PILLARS: Pillar[] = [
  {
    number: "01",
    title: "Stay in your codebase",
    bodyLines: [
      "Add automatic retries to code, while",
      "controlling flow during surprise spikes.",
    ],
  },
  {
    number: "02",
    title: "Serverless-first",
    bodyLines: [
      "Run long running agents on any runtime,",
      "even serverless.",
    ],
  },
  {
    number: "03",
    title: "Agent-native observability",
    bodyLines: [
      "Treat all model calls like first-class events.",
      "See everything without extra tooling.",
    ],
  },
];

export default function Unbreakable() {
  return (
    <Section
      aria-labelledby="ai-unbreakable-heading"
      className="relative isolate overflow-x-clip"
      containerClassName="relative flex flex-col gap-v1-stack-lg lg:flex-row lg:items-start lg:gap-x-16"
    >
      {/* Flex split: the headline column takes all leftover space while
          the pillar column sizes to its content (capped at 550px), so
          the headline keeps its breathing room and never wraps at any
          width. Below lg both stack. `min-w-0` lets the headline column
          shrink instead of forcing the row wider. */}
      <div className="relative lg:sticky lg:top-[22vh] lg:self-start lg:flex-1 lg:min-w-0">
        <h2
          id="ai-unbreakable-heading"
          className={cn(V1_SECTION_TITLE, "relative z-10")}
        >
          {["Make your AI", "Unbreakable without", "Touching", "Infrastructure"].map(
            (line, i) => (
              <motion.span key={i} {...reveals.item(i)} className="block">
                {line}
              </motion.span>
            ),
          )}
        </h2>
      </div>

      {/* Lg rows expand to min-h-[24vh] so the column is taller than
          the viewport, giving the sticky headline real scroll room. */}
      <ol className="flex flex-col gap-[60px] lg:gap-0 lg:max-w-[550px]">
        {PILLARS.map((pillar, i) => (
          <PillarRow key={pillar.number} pillar={pillar} index={i} />
        ))}
      </ol>
    </Section>
  );
}

function PillarRow({ pillar, index }: { pillar: Pillar; index: number }) {
  return (
    <motion.li
      {...reveals.item(index)}
      className="flex flex-col gap-[7px] lg:min-h-[24vh] lg:justify-center"
    >
      <p className="font-v1Mono text-[20.54px] leading-[41px] tracking-[-0.01em]">
        {pillar.number}
      </p>
      <p className="font-v1Heading text-[28px] leading-[1.17] tracking-[-0.01em] lg:leading-[1.05] lg:[font-size:clamp(1.5rem,1.95vw,2.05rem)]">
        {pillar.title}
      </p>
      {/* Body inherits `basis`. The lg fluid clamp is kept bespoke: it
          shrinks the designer-locked nowrap lines to fit the pillar
          column at narrow widths. */}
      <p className="text-v1-body-lg lg:[font-size:clamp(0.875rem,1.05vw,1.125rem)]">
        {pillar.bodyLines.map((line, j) => (
          <span key={j} className="lg:block lg:whitespace-nowrap">
            {line}
          </span>
        ))}
      </p>
    </motion.li>
  );
}
