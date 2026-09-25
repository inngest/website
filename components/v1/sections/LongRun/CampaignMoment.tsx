"use client";

import { motion } from "motion/react";
import Section from "@/components/v1/sections/shared/Section";
import { V1_SECTION_TITLE } from "@/components/v1/sections/shared/sectionTitle";
import { reveals } from "@/utils/v1/reveals";
import { MOMENT, type Market } from "@/components/v1/sections/LongRun/data";

/**
 * Section 07 — the campaign moment, deliberately placed after the product
 * story so the marathon reads as payoff rather than as a delay.
 *
 * Intentionally light on CTAs: its job is to connect the page back to the
 * poster, chalk or panel the visitor originally walked past, not to
 * convert. Conversion is section 08's job.
 */
export default function CampaignMoment({ market }: { market: Market }) {
  // Only NYC's moment is authored. A market without one renders nothing
  // rather than borrowing New York's copy — "one weekend in New York"
  // doesn't transfer, and a wrong city here would undo the whole point
  // of the section.
  const moment = MOMENT[market];
  if (!moment) return null;

  return (
    <Section
      aria-labelledby="long-run-moment-heading"
      className="border-y border-v1-subtle bg-v1-surfaceBase"
      containerClassName="flex flex-col gap-v1-stack"
    >
      <div className="grid grid-cols-1 gap-v1-stack lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-6">
          <motion.p
            {...reveals.body}
            className="text-v1-eyebrow uppercase text-v1-frost/55"
          >
            {moment.eyebrow}
          </motion.p>
          <motion.h2
            {...reveals.heading}
            id="long-run-moment-heading"
            className={V1_SECTION_TITLE}
          >
            {moment.title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </motion.h2>
        </div>

        <div className="flex flex-col gap-6 lg:self-end">
          {moment.body.map((para, i) => (
            <motion.p
              key={para}
              {...reveals.item(i)}
              className="text-v1-body-lg-loose"
            >
              {para}
            </motion.p>
          ))}
        </div>
      </div>

      {/* Campaign photography slot. Rendered as a labelled placeholder
          rather than silently omitted so it's obvious in review that real
          assets are still outstanding — this must not ship empty. */}
      <motion.div
        {...reveals.item(1)}
        role="img"
        aria-label={moment.mediaNote}
        className="flex min-h-[260px] items-center justify-center rounded-lg border border-dashed border-v1-muted px-6 py-16 text-center lg:min-h-[420px]"
      >
        <span className="text-v1-label-sm uppercase text-v1-frost/45">
          {moment.mediaNote}
        </span>
      </motion.div>

      <motion.p {...reveals.body} className="text-v1-heading-xs text-v1-frost">
        {moment.kicker}
      </motion.p>
    </Section>
  );
}
