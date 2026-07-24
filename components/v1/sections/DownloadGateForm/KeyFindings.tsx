"use client";

import { motion } from "motion/react";
import { reveals } from "@/utils/v1/reveals";
import { SECTION } from "@/components/v1/sections/DownloadGateForm/layout";

export default function KeyFindings() {
  return (
    <section
      aria-labelledby="benchmark-key-findings-heading"
      className={`${SECTION} pb-0 pt-[56px] text-v1-frost`}
    >
      <motion.p
        {...reveals.body}
        className="text-v1-label-md uppercase text-v1-frost"
      >
        Key findings — preview
      </motion.p>
      <motion.h2
        {...reveals.heading}
        id="benchmark-key-findings-heading"
        className="mt-4 text-v1-heading-card v1-cap-trim tracking-[-0.01em] text-v1-frost"
      >
        What 130 engineers told us about running AI in production.
      </motion.h2>
      <motion.p
        {...reveals.body}
        className="mt-4 text-v1-body-sm-loose text-v1-frost"
      >
        A preview of what&apos;s inside. We wanted to know what&apos;s
        causing failures, and which infrastructure choices — across
        orchestration, observability, evals, and agent frameworks —
        actually reduce the burden of reliability. Download our full
        report to go deeper with team-size breakouts, complete charts,
        and the statistical significance behind every finding.
      </motion.p>
    </section>
  );
}
