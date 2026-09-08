"use client";

import { motion } from "motion/react";
import Section from "@/components/v1/sections/shared/Section";
import { reveals } from "@/utils/v1/reveals";
import { METAPHOR } from "@/components/v1/sections/LongRun/data";

/**
 * "Why a marathon?" (deck p.12) — the same idea in three vocabularies, with
 * `step.run()` sitting in the middle as the one that's ours. The point of
 * the section is that we didn't invent the metaphor; we're claiming it.
 */
export default function Metaphor() {
  return (
    <Section
      aria-labelledby="long-run-metaphor-heading"
      className="border-y border-v1-subtle bg-v1-surfaceBase"
      containerClassName="flex flex-col gap-v1-stack"
    >
      <motion.h2
        {...reveals.heading}
        id="long-run-metaphor-heading"
        className="text-v1-heading-card text-v1-frost"
      >
        Why a marathon?
      </motion.h2>

      <ul className="grid list-none grid-cols-1 gap-10 pl-0 sm:grid-cols-3 sm:gap-8">
        {METAPHOR.map((m, i) => (
          <motion.li
            key={m.phrase}
            {...reveals.item(i)}
            className="flex list-none flex-col gap-4"
          >
            <p className="text-v1-label-sm uppercase text-v1-frost/55">
              {m.who}
            </p>
            <p
              className={
                m.mono
                  ? "text-v1-code text-v1-accent-salmon-light"
                  : "text-v1-heading-xs text-v1-frost"
              }
            >
              {m.mono ? m.phrase : `“${m.phrase}”`}
            </p>
          </motion.li>
        ))}
      </ul>

      <motion.p
        {...reveals.body}
        className="text-v1-body-lg-loose max-w-[720px]"
      >
        Three groups of people already use the same words for the same idea: the
        thing worth doing takes longer than one sitting, and quitting halfway
        means starting over. We don&apos;t have to invent that metaphor — we
        just have to build for it.
      </motion.p>
    </Section>
  );
}
