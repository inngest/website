"use client";

import { motion } from "motion/react";
import Section from "@/components/v1/sections/shared/Section";
import { V1_SECTION_TITLE } from "@/components/v1/sections/shared/sectionTitle";
import { reveals } from "@/utils/v1/reveals";
import { PROBLEM, type Market } from "@/components/v1/sections/LongRun/data";

/**
 * Section 03 — the problem.
 *
 * Five ways a long run dies, then the bad option nobody wants, set at
 * display weight so it lands as the page's low point before section 04
 * answers it. The section sits on the darker surface so the turn is
 * visible as a change in ground, not just in copy.
 */
export default function Problem({ market }: { market: Market }) {
  // Only markets with authored problem copy render this section — the
  // failure tally is written to lead into that market's statement, so a
  // borrowed one would land wrong.
  const copy = PROBLEM[market];
  if (!copy) return null;

  return (
    <Section
      aria-labelledby="long-run-problem-heading"
      className="border-y border-v1-subtle bg-v1-surfaceBase"
      containerClassName="flex flex-col gap-v1-stack"
    >
      <div className="flex flex-col gap-6">
        <motion.p
          {...reveals.body}
          className="text-v1-eyebrow uppercase text-v1-frost/55"
        >
          {copy.eyebrow}
        </motion.p>
        <motion.h2
          {...reveals.heading}
          id="long-run-problem-heading"
          className={V1_SECTION_TITLE}
        >
          {copy.title.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </motion.h2>
      </div>

      {/* The five failures, on rules so they read as a tally. */}
      <ul className="flex list-none flex-col border-t border-v1-subtle pl-0">
        {copy.failures.map((f, i) => (
          <motion.li
            key={f}
            {...reveals.item(i)}
            className="list-none border-b border-v1-subtle py-5 text-v1-heading-xs-loose text-v1-frost/80 lg:py-6"
          >
            {f}
          </motion.li>
        ))}
      </ul>

      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          {copy.setup.map((line) => (
            <motion.p
              key={line}
              {...reveals.body}
              className="text-v1-body-lg-loose"
            >
              {line}
            </motion.p>
          ))}
        </div>

        <motion.p
          {...reveals.heading}
          // Steps up past the section title (Display/Sm) at lg so the bad
          // option is the loudest thing on the page — it's the low point
          // section 04 answers.
          className="text-v1-display-xs uppercase text-v1-accent-salmon-light sm:text-v1-display-sm lg:text-v1-display-md"
        >
          {copy.statement.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </motion.p>

        {copy.rebuttal && (
          <motion.p
            {...reveals.item(1)}
            className="text-v1-heading-xs uppercase text-v1-frost"
          >
            {copy.rebuttal}
          </motion.p>
        )}
      </div>
    </Section>
  );
}
