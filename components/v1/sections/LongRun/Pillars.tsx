"use client";

import { motion } from "motion/react";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import { V1_HEADER_CONTENT_MT } from "@/components/v1/sections/shared/sectionShell";
import { reveals } from "@/utils/v1/reveals";
import { PILLARS } from "@/components/v1/sections/LongRun/data";

/**
 * The three campaign pillars (deck p.5) — built to keep running, changing,
 * getting better. Kickers lead because they carry the campaign voice; the
 * one-word capability name sits under each as the thing it maps to.
 */
export default function Pillars() {
  return (
    <Section
      aria-labelledby="long-run-pillars-heading"
      containerClassName="flex flex-col"
    >
      <SectionHeader
        id="long-run-pillars-heading"
        eyebrow="Why us"
        title={
          <>
            Long-running isn&apos;t just how long something executes. It&apos;s
            whether what you build can survive what comes next.
          </>
        }
      />

      <ul
        className={`${V1_HEADER_CONTENT_MT} grid list-none grid-cols-1 gap-10 pl-0 lg:grid-cols-3 lg:gap-8`}
      >
        {PILLARS.map((p, i) => (
          <motion.li
            key={p.id}
            {...reveals.item(i)}
            className="flex list-none flex-col gap-6 border-t border-v1-subtle pt-8"
          >
            <p className="text-v1-heading-xs uppercase text-v1-frost">
              {p.kicker}
            </p>
            <p className="text-v1-label-md uppercase text-v1-accent-salmon-light">
              {p.title}
            </p>
            <p className="text-v1-body-sm-loose">{p.body}</p>
          </motion.li>
        ))}
      </ul>
    </Section>
  );
}
