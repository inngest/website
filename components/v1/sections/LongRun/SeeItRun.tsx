"use client";

import { motion } from "motion/react";
import ButtonLink from "@/components/v1/ButtonLink";
import Section from "@/components/v1/sections/shared/Section";
import { V1_SECTION_TITLE } from "@/components/v1/sections/shared/sectionTitle";
import { reveals } from "@/utils/v1/reveals";
import RunTimeline from "@/components/v1/sections/LongRun/RunTimeline";
import { SEE_IT_RUN } from "@/components/v1/sections/LongRun/data";

/**
 * Section 05 — the hero technical proof.
 *
 * The hero CTA points here, so this is the section that has to pay off
 * "see how it works": a run that breaks and keeps going. The visual is
 * deliberately the simplest technically accurate version — a real
 * multi-step run failing at one step, retrying that step, and finishing —
 * so it can be reused across markets, paid and social rather than rebuilt
 * per surface.
 */
export default function SeeItRun() {
  return (
    <Section
      id="long-run-see-it-run"
      aria-labelledby="long-run-see-it-run-heading"
      // The hero CTA jumps here, so leave room for the fixed header to
      // clear the heading on landing.
      className="scroll-mt-24 bg-v1-canvasSubtle"
      containerClassName="grid grid-cols-1 items-center gap-v1-stack lg:grid-cols-2 lg:gap-16"
    >
      <div className="flex flex-col gap-v1-stack">
        <div className="flex flex-col gap-6">
          <motion.p
            {...reveals.body}
            className="text-v1-eyebrow uppercase text-v1-frost/55"
          >
            {SEE_IT_RUN.eyebrow}
          </motion.p>
          <motion.h2
            {...reveals.heading}
            id="long-run-see-it-run-heading"
            className={V1_SECTION_TITLE}
          >
            {SEE_IT_RUN.title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </motion.h2>
        </div>

        <div className="flex flex-col items-start gap-8">
          <motion.p {...reveals.body} className="text-v1-body-lg-loose">
            {SEE_IT_RUN.payoff}
          </motion.p>
          <motion.div {...reveals.item(2)}>
            <ButtonLink href={SEE_IT_RUN.ctaHref} variant="primary">
              {SEE_IT_RUN.ctaLabel} →
            </ButtonLink>
          </motion.div>
        </div>
      </div>

      <motion.div {...reveals.item(1)} className="w-full min-w-0">
        <RunTimeline />
      </motion.div>
    </Section>
  );
}
