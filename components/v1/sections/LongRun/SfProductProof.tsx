"use client";

import { motion } from "motion/react";
import Section from "@/components/v1/sections/shared/Section";
import { V1_SECTION_TITLE } from "@/components/v1/sections/shared/sectionTitle";
import { V1_HEADER_CONTENT_MT } from "@/components/v1/sections/shared/sectionShell";
import { reveals } from "@/utils/v1/reveals";
import {
  SF_PILLARS,
  SF_PRODUCT_PROOF,
} from "@/components/v1/sections/LongRun/data";

/**
 * Section 05 — product proof.
 *
 * Three pillars, deliberately compact and text-only. No statistics,
 * testimonials or benchmarks: none have been verified, and the brief is
 * explicit that an identified gap beats fabricated proof.
 *
 * PENDING APPROVAL: product screenshots for these three pillars need
 * Lauren's and Mitchell's sign-off before they go in. Real captures do
 * exist in the repo (public/assets/v1/observability/*, agent-evals/*) and
 * would slot in beside each pillar — they are left out until cleared
 * rather than chosen unilaterally.
 */
export default function SfProductProof() {
  return (
    <Section
      aria-labelledby="long-run-product-proof-heading"
      containerClassName="flex flex-col"
    >
      <motion.h2
        {...reveals.heading}
        id="long-run-product-proof-heading"
        className={V1_SECTION_TITLE}
      >
        {SF_PRODUCT_PROOF.title.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </motion.h2>

      <dl
        className={`${V1_HEADER_CONTENT_MT} grid grid-cols-1 gap-8 border-t border-v1-subtle pt-10 lg:grid-cols-3`}
      >
        {SF_PILLARS.map((p, i) => (
          <motion.div
            key={p.id}
            {...reveals.item(i)}
            className="flex flex-col gap-3"
          >
            <dt className="text-v1-heading-xs text-v1-frost">{p.title}</dt>
            <dd className="text-v1-body-sm-loose">{p.body}</dd>
          </motion.div>
        ))}
      </dl>
    </Section>
  );
}
