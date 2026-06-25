"use client";

/**
 * "Score outcomes, not output" — display headline (sticky at lg+) with a
 * short intro, paired with three numbered pillars. Mirrors the AI page's
 * Unbreakable layout.
 */

import { motion } from "motion/react";
import { reveals } from "@/utils/v1/reveals";
import { cn } from "@/utils/v1/cn";
import Section from "@/components/v1/sections/shared/Section";
import { V1_SECTION_TITLE } from "@/components/v1/sections/shared/sectionTitle";

interface Pillar {
  number: string;
  title: string;
  body: string;
}

const PILLARS: Pillar[] = [
  {
    number: "01",
    title: "Score with step.score()",
    body: "Scoring functions is just as easy as making them durable.",
  },
  {
    number: "02",
    title: "Track outcomes, not vibes",
    body: "Track and score agents based off of what happens in your product using events.",
  },
  {
    number: "03",
    title: "Eval entire agent trajectories",
    body: "Compare variants across multi-step workflows safely, with memoization so retries never switch mid-run.",
  },
];

export default function ScoreOutcomes() {
  return (
    <Section
      aria-labelledby="agent-evals-score-heading"
      className="relative isolate overflow-x-clip"
      containerClassName="relative flex flex-col gap-v1-stack-lg lg:flex-row lg:items-start lg:gap-x-16"
    >
      <div className="relative lg:sticky lg:top-[22vh] lg:min-w-0 lg:flex-1 lg:self-start">
        <h2 id="agent-evals-score-heading" className={cn(V1_SECTION_TITLE, "relative z-10")}>
          {["Score outcomes,", "not output"].map((line, i) => (
            <motion.span key={i} {...reveals.item(i)} className="block">
              {line}
            </motion.span>
          ))}
        </h2>
        <motion.p
          {...reveals.body}
          className="mt-6 max-w-[440px] text-v1-body-lg-loose text-v1-frost"
        >
          Score agents based on user and product signals, not just based on
          what one LLM says about another.
        </motion.p>
      </div>

      <ol className="flex flex-col gap-[60px] lg:max-w-[550px] lg:gap-0">
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
      <p className="text-v1-body-lg text-[#B3B3B3] lg:[font-size:clamp(0.875rem,1.05vw,1.125rem)]">
        {pillar.body}
      </p>
    </motion.li>
  );
}
