"use client";

import { motion } from "motion/react";
import Section from "@/components/v1/sections/shared/Section";
import { reveals } from "@/utils/v1/reveals";
import { V1_SECTION_TITLE } from "@/components/v1/sections/shared/sectionTitle";

/**
 * The poster line, given a whole section to breathe (deck p.33). Same copy
 * as the printed and DOOH creative, so someone who read it on the street
 * meets it again here and knows they're in the right place.
 */
export default function PosterQuote() {
  return (
    <Section
      aria-label="Campaign poster line"
      containerClassName="flex flex-col items-start gap-8 lg:!max-w-[1100px]"
    >
      <motion.p {...reveals.heading} className={V1_SECTION_TITLE}>
        You wouldn&apos;t try new shoes on race day.
      </motion.p>
      <motion.p
        {...reveals.body}
        className="text-v1-heading-xs-loose text-v1-accent-salmon-light"
      >
        Your agents deserve evals too.
      </motion.p>
    </Section>
  );
}
