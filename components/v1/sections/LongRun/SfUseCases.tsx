"use client";

import { motion } from "motion/react";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import { V1_HEADER_CONTENT_MT } from "@/components/v1/sections/shared/sectionShell";
import NavIcon from "@/components/v1/NavIcons";
import { reveals } from "@/utils/v1/reveals";
import { SF_USE_CASES } from "@/components/v1/sections/LongRun/data";

/**
 * Section 03 — what people actually build.
 *
 * Four equal cards, two-up at sm+ and stacked on narrow phones. Icons come
 * from the nav's existing set rather than new art, and each card is a title
 * plus one line — no performance claims, no decorative imagery.
 */
export default function SfUseCases() {
  return (
    <Section
      aria-labelledby="long-run-use-cases-heading"
      className="bg-v1-canvasSubtle"
      containerClassName="flex flex-col"
    >
      <SectionHeader
        id="long-run-use-cases-heading"
        title={<>Built for work that doesn&apos;t finish in one request.</>}
        body="From background jobs to AI agents, keep execution moving even when work takes longer than expected."
        bodyClassName="max-w-[640px]"
      />

      <ul
        className={`${V1_HEADER_CONTENT_MT} grid list-none grid-cols-1 gap-6 pl-0 sm:grid-cols-2`}
      >
        {SF_USE_CASES.map((c, i) => (
          <motion.li
            key={c.id}
            {...reveals.item(i)}
            className="flex h-full list-none flex-col gap-4 rounded-lg border border-v1-subtle p-6"
          >
            <NavIcon
              name={c.icon}
              className="h-6 w-6 text-v1-accent-salmon-light"
            />
            <h3 className="text-v1-heading-xs text-v1-frost">{c.title}</h3>
            <p className="text-v1-body-sm-loose">{c.body}</p>
          </motion.li>
        ))}
      </ul>
    </Section>
  );
}
