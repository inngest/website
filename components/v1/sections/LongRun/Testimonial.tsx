"use client";

import { motion } from "motion/react";
import Section from "@/components/v1/sections/shared/Section";
import TestimonialsCarousel from "@/components/v1/sections/shared/TestimonialsCarousel";
import {
  LR_SECTION_PADDING,
  LR_SECTION_TITLE,
} from "@/components/v1/sections/LongRun/headings";
import { LR_TESTIMONIAL } from "@/components/v1/sections/LongRun/data";
import { cn } from "@/utils/v1/cn";
import { reveals } from "@/utils/v1/reveals";

/**
 * Section 04 — the Ordinal testimonial, between use cases and the
 * "Start building" CTA.
 *
 * Same full-width layout as the homepage's "Stories from production":
 * title + body sit in the quote column above the logo and quote, with
 * the portrait filling the column beside them. Composes
 * `TestimonialsCarousel` directly rather than the shared `Testimonials`
 * wrapper so the heading can use this page's sentence-case section
 * title. A one-slide deck renders without the pagination rail.
 */
export default function Testimonial() {
  return (
    <Section
      aria-labelledby="long-run-testimonial-heading"
      className={cn("relative", LR_SECTION_PADDING)}
    >
      <TestimonialsCarousel
        slides={[...LR_TESTIMONIAL.slides]}
        compact
        // Size to the content rather than the carousel's reserved
        // quote height, so there's no gap between logo and quote and
        // the portrait shrinks to match.
        fitContent
        portraitFill
        // Fill the grid column (the shared Portrait caps at 332px
        // otherwise). Grayscale so the color headshot sits closer to the
        // monochrome portraits used in the other testimonial sections.
        // (mix-blend-luminosity has no effect here: the section's
        // reveal transforms isolate the blend from the page background.)
        portraitClassName="sm:max-w-none grayscale"
        header={
          <div>
            <motion.h2
              {...reveals.heading}
              id="long-run-testimonial-heading"
              className={LR_SECTION_TITLE}
            >
              {LR_TESTIMONIAL.title}
            </motion.h2>
            <motion.p
              {...reveals.body}
              className="text-v1-body-lg-loose mt-3 max-w-[46rem] text-v1-frost"
            >
              {LR_TESTIMONIAL.body}
            </motion.p>
          </div>
        }
      />
    </Section>
  );
}
