"use client";

import { motion } from "motion/react";
import Section from "@/components/v1/sections/shared/Section";
import LogoStrip from "@/components/v1/sections/Home/LogoStrip";
import { V1_SECTION_TITLE } from "@/components/v1/sections/shared/sectionTitle";
import { reveals } from "@/utils/v1/reveals";
import { PROOF, PROOF_STATS } from "@/components/v1/sections/LongRun/data";

/**
 * Section 06 — proof. Answers "should I believe this?".
 *
 * The headline production figure is intentionally not written yet: both
 * candidate claims need Product/Data to validate the number before it goes
 * on a public page, so `PROOF_STATS` is empty and the stat row renders
 * only once it isn't. Until then the section stands on the customer logo
 * strip, which is proof that's already public and already true.
 */
export default function Proof() {
  return (
    <Section
      aria-labelledby="long-run-proof-heading"
      containerClassName="flex flex-col gap-v1-stack"
    >
      <div className="flex flex-col gap-6">
        <motion.p
          {...reveals.body}
          className="text-v1-eyebrow uppercase text-v1-frost/55"
        >
          {PROOF.eyebrow}
        </motion.p>
        <motion.h2
          {...reveals.heading}
          id="long-run-proof-heading"
          className={V1_SECTION_TITLE}
        >
          {PROOF.title.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </motion.h2>
      </div>

      {PROOF_STATS.length > 0 && (
        <dl className="grid grid-cols-1 gap-8 border-t border-v1-subtle pt-10 sm:grid-cols-2">
          {PROOF_STATS.map((stat, i) => (
            <motion.div
              key={stat.figure}
              {...reveals.item(i)}
              className="flex flex-col gap-3"
            >
              <dt className="text-v1-display-xs uppercase text-v1-accent-salmon-light">
                {stat.figure}
              </dt>
              <dd className="text-v1-body-sm-loose">{stat.caption}</dd>
            </motion.div>
          ))}
        </dl>
      )}

      <motion.div {...reveals.item(1)}>
        <LogoStrip contained />
      </motion.div>
    </Section>
  );
}
