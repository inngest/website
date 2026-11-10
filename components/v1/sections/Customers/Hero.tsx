"use client";

import { motion } from "motion/react";
import ButtonLink from "@/components/v1/ButtonLink";
import { reveals } from "@/utils/v1/reveals";

export default function Hero() {
  return (
    <section
      aria-labelledby="customers-hero-heading"
      className="relative mx-auto w-full max-w-[1440px] px-6 pb-2 pt-[87px] text-v1-frost sm:pb-4 lg:px-8 lg:pb-6 lg:pt-[140px]"
    >
      <div className="flex flex-col items-start gap-8 lg:max-w-[860px]">
        <motion.h1
          {...reveals.heading}
          id="customers-hero-heading"
          className="text-v1-display-sm uppercase leading-[1.25] [font-size:clamp(2.25rem,4.6vw,4rem)]"
        >
          {/* On mobile the headline wraps naturally as one continuous
              phrase; the three-line layout only kicks in from lg,
              where the line breaks are intentional. */}
          <span className="lg:block">Our customers deliver </span>
          <span className="lg:block">reliable products for </span>
          <span className="lg:block">their customers.</span>
        </motion.h1>
        <motion.div
          {...reveals.item(1)}
          className="flex flex-wrap items-center gap-3"
        >
          <ButtonLink href="/sign-up?ref=customers" variant="primary">
            Start free
          </ButtonLink>
          <ButtonLink href="/contact?ref=customers" variant="secondary">
            Contact sales
          </ButtonLink>
        </motion.div>
      </div>
    </section>
  );
}
