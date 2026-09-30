"use client";

import { motion } from "motion/react";
import Section from "@/components/v1/sections/shared/Section";
import KeepGoingIcon from "@/components/v1/sections/NycLongRun/KeepGoingIcons";
import {
  NYC_ACCENT,
  NYC_SECTION_PADDING,
  NYC_SECTION_TITLE,
} from "@/components/v1/sections/NycLongRun/nycHeadings";
import { cn } from "@/utils/v1/cn";
import { reveals } from "@/utils/v1/reveals";
import {
  NYC_KEEP_GOING,
  type NycKeepGoingTone,
} from "@/components/v1/sections/NycLongRun/data";

/**
 * Section 02 — "Some things are built to keep going."
 *
 * Sits between the logo strip and the product difference: it names what a
 * lonng run is actually made of before the page explains what Inngest
 * does about it.
 *
 * The chips are the argument. Set as a wrapping run rather than a list so
 * the block reads as a pile-up — "this keeps going" — before any single
 * item is read, which is why they lead the section on desktop and the
 * copy sits beside them.
 */

/** Tone → border/text pair. Green runs, warm waits, salmon breaks. */
const TONES: Record<NycKeepGoingTone, string> = {
  green: "border-v1-accent-green/40 text-v1-accent-green",
  warm: "border-v1-accent-salmon-light/40 text-v1-accent-salmon-light",
  salmon: "border-v1-accent-salmon/45 text-v1-accent-salmon",
};

export default function KeepGoing() {
  return (
    <Section
      aria-labelledby="nyc-keep-going-heading"
      className={NYC_SECTION_PADDING}
      containerClassName="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center lg:gap-16"
    >
      {/* Chips lead on desktop; on mobile the copy reads first, so the
          order flips rather than opening on an unexplained tag cloud. */}
      <ul className="order-2 flex list-none flex-wrap gap-2.5 pl-0 lg:order-1">
        {NYC_KEEP_GOING.work.map((item, i) => (
          <motion.li
            key={item.label}
            {...reveals.item(i)}
            className={cn(
              "inline-flex list-none items-center gap-2 rounded-full border px-4 py-2",
              TONES[item.tone]
            )}
          >
            <KeepGoingIcon name={item.icon} className="shrink-0" />
            <span className="text-v1-label-sm">{item.label}</span>
          </motion.li>
        ))}
      </ul>

      <div className="order-1 flex flex-col gap-6 lg:order-2">
        <motion.p {...reveals.body} className="text-v1-eyebrow uppercase">
          <span className={NYC_ACCENT}>{NYC_KEEP_GOING.eyebrowAccent}</span>{" "}
          <span className="text-v1-frost/70">{NYC_KEEP_GOING.eyebrow}</span>
        </motion.p>

        <motion.h2
          {...reveals.heading}
          id="nyc-keep-going-heading"
          className={NYC_SECTION_TITLE}
        >
          {NYC_KEEP_GOING.title}
        </motion.h2>

        <div className="flex flex-col gap-4">
          {NYC_KEEP_GOING.body.map((line, i) => (
            <motion.p
              key={line}
              {...reveals.item(i)}
              className="text-v1-body-lg-loose max-w-[560px]"
            >
              {line}
            </motion.p>
          ))}
        </div>
      </div>
    </Section>
  );
}
