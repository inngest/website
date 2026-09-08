"use client";

import { motion } from "motion/react";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import { V1_HEADER_CONTENT_MT } from "@/components/v1/sections/shared/sectionShell";
import { reveals } from "@/utils/v1/reveals";
import { V1_SECTION_TITLE } from "@/components/v1/sections/shared/sectionTitle";
import { DURATIONS, FAILURES } from "@/components/v1/sections/LongRun/data";

/**
 * "The longer something runs, the more there is to go wrong."
 *
 * A ladder of run lengths — agent, marathon, migration, service — that puts
 * the campaign's marathon on the same axis as real production work, then
 * turns to what actually goes wrong and lands the product truth: retry the
 * step, not the chain.
 */
export default function Durations() {
  return (
    <Section
      aria-labelledby="long-run-durations-heading"
      containerClassName="flex flex-col"
    >
      <SectionHeader
        id="long-run-durations-heading"
        eyebrow="The problem"
        title={<>The longer something runs, the more there is to go wrong.</>}
      />

      {/* The ladder. Each row is subject / verb / length on one baseline,
          with a rule between rows so it reads as a table of run lengths
          rather than a list of sentences. */}
      <ul
        className={`${V1_HEADER_CONTENT_MT} flex list-none flex-col border-t border-v1-subtle pl-0`}
      >
        {DURATIONS.map((d, i) => (
          <motion.li
            key={d.subject}
            {...reveals.item(i)}
            className="flex list-none flex-col gap-2 border-b border-v1-subtle py-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8 lg:py-8"
          >
            <span className="text-v1-heading-sm text-v1-frost">
              {d.subject} <span className="text-v1-frost/55">{d.verb}</span>
            </span>
            <span className="text-v1-heading-sm text-v1-frost sm:text-right">
              {d.length}
            </span>
          </motion.li>
        ))}
      </ul>

      {/* The turn: what goes wrong, then the answer. */}
      <div className="mt-v1-stack-lg grid grid-cols-1 gap-v1-stack lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-6">
          <motion.p
            {...reveals.body}
            className="text-v1-eyebrow uppercase text-v1-frost/55"
          >
            And when something does go wrong
          </motion.p>
          <ul className="flex list-none flex-col gap-3 pl-0">
            {FAILURES.map((f, i) => (
              <motion.li
                key={f}
                {...reveals.item(i)}
                className="text-v1-heading-xs-loose list-none text-v1-frost/80"
              >
                {f}
              </motion.li>
            ))}
          </ul>
          <motion.p
            {...reveals.item(FAILURES.length)}
            className="text-v1-body-lg-loose"
          >
            Go back to zero and run the whole thing again?
          </motion.p>
        </div>

        {/* The product truth, given the weight of a display line. */}
        <motion.p {...reveals.heading} className={V1_SECTION_TITLE}>
          Retry the step.
          <br />
          <span className="text-v1-accent-salmon-light">Not the chain.</span>
        </motion.p>
      </div>
    </Section>
  );
}
