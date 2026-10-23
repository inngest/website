"use client";

import { motion } from "motion/react";
import BeforeAfterSlider from "@/components/v1/sections/shared/BeforeAfterSlider";
import Section from "@/components/v1/sections/shared/Section";
import {
  BUILD_SECTION_PADDING,
  BUILD_SECTION_TITLE,
} from "@/components/v1/sections/BuildLongRun/buildHeadings";
import { cn } from "@/utils/v1/cn";
import { reveals } from "@/utils/v1/reveals";
import { BUILD_DIFFERENCE } from "@/components/v1/sections/BuildLongRun/data";

/**
 * Section 02 — "It doesn't have to be hard."
 *
 * Reuses the homepage's before/after assets through the shared
 * `BeforeAfterSlider`, rather than importing Home's section wholesale:
 * that component's body is two designer-locked `whitespace-nowrap` lines
 * sized for a narrow 362fr column, which this longer paragraph would
 * break. Same slider, same art, layout that fits the copy.
 */
export default function BuildDifference() {
  return (
    <Section
      aria-labelledby="long-run-difference-heading"
      className={cn("relative", BUILD_SECTION_PADDING)}
      containerClassName="grid grid-cols-1 gap-8 lg:grid-cols-[854fr_420fr] lg:items-center lg:gap-16"
    >
      <BeforeAfterSlider
        ariaLabel="Drag to compare the before and after states"
        before={
          <img
            src={BUILD_DIFFERENCE.before.src}
            alt={BUILD_DIFFERENCE.before.alt}
            className="absolute inset-0 block h-full w-full object-cover"
            draggable={false}
          />
        }
        after={
          <img
            src={BUILD_DIFFERENCE.after.src}
            alt={BUILD_DIFFERENCE.after.alt}
            className="absolute inset-0 block h-full w-full object-cover"
            draggable={false}
          />
        }
        beforeOverlay={
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.10) 60%, rgba(0,0,0,0) 100%)",
            }}
          />
        }
        afterOverlay={
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 90% at 80% 30%, rgba(255, 240, 230, 0.14), rgba(255, 240, 230, 0) 70%)",
            }}
          />
        }
      />
      <div className="flex flex-col gap-6">
        <motion.h2
          {...reveals.heading}
          id="long-run-difference-heading"
          className={BUILD_SECTION_TITLE}
        >
          {BUILD_DIFFERENCE.title[0]}
        </motion.h2>
        <motion.p {...reveals.body} className="text-v1-body-lg-loose">
          {BUILD_DIFFERENCE.body}
        </motion.p>
      </div>
    </Section>
  );
}
