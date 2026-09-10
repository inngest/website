"use client";

import { motion } from "motion/react";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import { V1_HEADER_CONTENT_MT } from "@/components/v1/sections/shared/sectionShell";
import { V1_SECTION_TITLE } from "@/components/v1/sections/shared/sectionTitle";
import { reveals } from "@/utils/v1/reveals";
import { cn } from "@/utils/v1/cn";
import { DURATIONS, FAILURES } from "@/components/v1/sections/LongRun/data";

/**
 * "Long-running" is the one word the whole campaign rests on, and the one
 * word a poster, a drink sleeve or a run club can't define. This section
 * is the definition — it only appears on the markets whose activations are
 * conversational rather than a thing you walk past.
 *
 * Structure is a ladder, then a turn. The ladder puts an agent run and a
 * marathon on the same axis as a migration and a service, which stops the
 * campaign metaphor from being decoration: these really are the same order
 * of magnitude, and all of them are longer than the ~30 seconds a request
 * gets. The request row is first so the rest of the ladder reads as
 * everything that breaks the assumption underneath it.
 *
 * The turn then names the failures and stops on the question. It does not
 * answer it: this section sits directly above WhatItIs, whose heading is
 * the answer ("Retry the step. Not the chain.") and whose snippet shows
 * it. Landing the payoff here too put the same six words on screen twice
 * within a scroll.
 */
export default function LongRunning() {
  return (
    <Section
      aria-labelledby="long-run-meaning-heading"
      className="bg-v1-canvasSubtle"
      containerClassName="flex flex-col"
    >
      <SectionHeader
        id="long-run-meaning-heading"
        eyebrow="The term"
        title={<>What “long-running” actually means.</>}
        body="It's the word on the poster, so it's worth being exact about it. Anything that outlives a single request is long-running — which is most of what an agent does."
        bodyClassName="max-w-[640px]"
      />

      {/* The ladder. Subject and length share a baseline with a rule
          between rows, so it reads as a table of run lengths rather than a
          list of sentences. The request row is muted: it's the baseline
          everything else is measured against, not one of the claims. */}
      <ul
        className={cn(
          V1_HEADER_CONTENT_MT,
          "flex list-none flex-col border-t border-v1-subtle pl-0"
        )}
      >
        {DURATIONS.map((d, i) => {
          const isBaseline = i === 0;
          return (
            <motion.li
              key={d.subject}
              {...reveals.item(i)}
              className={cn(
                "flex list-none flex-col gap-2 border-b border-v1-subtle py-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8 lg:py-8",
                isBaseline && "opacity-55"
              )}
            >
              <span className="text-v1-heading-sm text-v1-frost">
                {d.subject} <span className="text-v1-frost/55">{d.verb}</span>
              </span>
              <span
                className={cn(
                  "text-v1-heading-sm sm:text-right",
                  isBaseline ? "text-v1-frost" : "text-v1-accent-salmon-light"
                )}
              >
                {d.length}
              </span>
            </motion.li>
          );
        })}
      </ul>

      {/* The turn: what goes wrong up there, then the question the next
          section answers. */}
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
        </div>

        {/* Left hanging on purpose — WhatItIs is the next thing on the
            page, and it opens with the answer. */}
        <motion.p {...reveals.heading} className={V1_SECTION_TITLE}>
          Go back to zero and{" "}
          <span className="text-v1-accent-salmon-light">
            run the whole thing again?
          </span>
        </motion.p>
      </div>
    </Section>
  );
}
