"use client";

import { motion } from "motion/react";
import ButtonLink from "@/components/v1/ButtonLink";
import Section from "@/components/v1/sections/shared/Section";
import { V1_SECTION_TITLE } from "@/components/v1/sections/shared/sectionTitle";
import { reveals } from "@/utils/v1/reveals";
import RunTimeline from "@/components/v1/sections/LongRun/RunTimeline";
import {
  SF_TECHNICAL_PROOF,
  SF_PROOF_ANCHOR,
} from "@/components/v1/sections/LongRun/data";

/**
 * Section 04 — technical proof.
 *
 * The one module the campaign is meant to share: a multi-step run where a
 * step fails, that step alone retries, and execution continues without
 * replaying the work already completed. Copy and visual are colocated so
 * NYC, the city-agnostic cut and campaign content can adopt it whole
 * rather than each rebuilding the idea.
 *
 * ── PENDING TECHNICAL APPROVAL ───────────────────────────────────────
 * The run below is ILLUSTRATIVE, not a recording of a real execution, and
 * is labelled as such on the page — see the caption under the panel. It
 * asserts only what the surrounding copy asserts: a failed step retries,
 * completed steps don't repeat. No timings, throughput, guarantees or API
 * behaviour are claimed.
 *
 * To swap in the approved demo: replace <RunTimeline /> below with the
 * real asset and delete the illustrative caption. Keep the two claims the
 * copy depends on intact, and keep the no-autoplay-audio and
 * reduced-motion behaviour.
 * ─────────────────────────────────────────────────────────────────────
 */
export default function TechnicalProof() {
  return (
    <Section
      id={SF_PROOF_ANCHOR}
      aria-labelledby="long-run-technical-proof-heading"
      // The hero and closer CTAs both jump here, so leave room for the
      // fixed header to clear the heading on landing.
      className="scroll-mt-24 bg-v1-canvasSubtle"
      containerClassName="grid grid-cols-1 items-center gap-v1-stack lg:grid-cols-2 lg:gap-16"
    >
      <div className="flex flex-col gap-v1-stack">
        <motion.h2
          {...reveals.heading}
          id="long-run-technical-proof-heading"
          className={V1_SECTION_TITLE}
        >
          <span className="block">{SF_TECHNICAL_PROOF.title[0]}</span>
          <span className="block text-v1-accent-salmon-light">
            {SF_TECHNICAL_PROOF.title[1]}
          </span>
        </motion.h2>

        <div className="flex flex-col gap-6">
          <motion.p {...reveals.body} className="text-v1-body-lg-loose">
            {SF_TECHNICAL_PROOF.body}
          </motion.p>
          <motion.p
            {...reveals.item(1)}
            className="text-v1-body-sm-loose text-v1-frost/70"
          >
            {SF_TECHNICAL_PROOF.supporting}
          </motion.p>
        </div>
      </div>

      <motion.div
        {...reveals.item(1)}
        className="flex w-full min-w-0 flex-col gap-3"
      >
        <RunTimeline />
        {/* Stated plainly rather than implied: this is a diagram of the
            behaviour, not a capture of the product. */}
        <p className="text-v1-label-sm uppercase text-v1-frost/45">
          Illustrative run — not a product recording
        </p>
      </motion.div>
    </Section>
  );
}
