"use client";

import { motion } from "motion/react";
import Section from "@/components/v1/sections/shared/Section";
import { V1_SECTION_TITLE } from "@/components/v1/sections/shared/sectionTitle";
import { reveals } from "@/utils/v1/reveals";
import { TRUTH } from "@/components/v1/sections/LongRun/data";

/**
 * Section 04 — the product truth, answering section 03 directly.
 *
 * The five capabilities are a description list: each is a claim plus the
 * one line that makes it concrete, so the section can be skimmed on the
 * bold lines alone and still make the argument.
 */
export default function ProductTruth() {
  return (
    <Section
      aria-labelledby="long-run-truth-heading"
      containerClassName="flex flex-col gap-v1-stack"
    >
      <div className="grid grid-cols-1 gap-v1-stack lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-6">
          <motion.p
            {...reveals.body}
            className="text-v1-eyebrow uppercase text-v1-frost/55"
          >
            {TRUTH.eyebrow}
          </motion.p>
          <motion.h2
            {...reveals.heading}
            id="long-run-truth-heading"
            className={V1_SECTION_TITLE}
          >
            <span className="block">{TRUTH.title[0]}</span>
            <span className="block text-v1-accent-salmon-light">
              {TRUTH.title[1]}
            </span>
          </motion.h2>
        </div>

        <motion.p
          {...reveals.body}
          className="text-v1-body-lg-loose lg:self-end"
        >
          {TRUTH.lead}
        </motion.p>
      </div>

      <dl className="grid grid-cols-1 gap-x-8 gap-y-10 border-t border-v1-subtle pt-10 sm:grid-cols-2 lg:grid-cols-3">
        {TRUTH.capabilities.map((c, i) => (
          <motion.div key={c.id} {...reveals.item(i)} className="flex flex-col gap-3">
            <dt className="text-v1-heading-xs text-v1-frost">{c.title}</dt>
            <dd className="text-v1-body-sm-loose">{c.body}</dd>
          </motion.div>
        ))}
      </dl>
    </Section>
  );
}
