"use client";

import { motion } from "motion/react";
import { reveals } from "@/utils/v1/reveals";

export default function Hero() {
  return (
    <section
      aria-labelledby="events-hero-heading"
      // Hero box is 225px tall with the title vertically centred (84.5px
      // above + below the 56px cap-trimmed title). The dot-pattern
      // artwork is a page-level backdrop (see Backdrop) so the hero is
      // just a layout container. At lg the title lands at y≈160 (below
      // the fixed Header) and the hero ends at y≈301; the 60px gap
      // before "Upcoming Events" is owned by that section's pt.
      className="relative mx-auto flex w-full max-w-[1440px] flex-col items-center justify-center pb-16 pl-6 pr-6 pt-[110px] text-v1-frost sm:pb-[88px] sm:pl-9 sm:pr-9 sm:pt-[130px] lg:pb-[85px] lg:pl-8 lg:pr-16 lg:pt-40"
    >
      <motion.h1
        {...reveals.heading}
        id="events-hero-heading"
        // Display/Md — 80 px Inktrap regular, leading 1.25,
        // tracking -0.01em (= -0.8px @ 80px), uppercase, capsize-trimmed,
        // whitespace-nowrap (two words fit one line at lg). Mobile
        // clamps down so the title doesn't overflow narrow screens.
        className="text-center text-v1-display-sm uppercase leading-[1.25] text-white [font-size:clamp(2.75rem,7.5vw,5rem)] lg:whitespace-nowrap"
      >
        Event Schedule
      </motion.h1>
    </section>
  );
}
