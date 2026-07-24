"use client";

import { motion } from "motion/react";
import CustomersHeroDotsCanvas from "@/components/v1/sections/Customers/CustomersHeroDotsCanvas";
import { reveals } from "@/utils/v1/reveals";

export default function Hero() {
  return (
    <section
      aria-labelledby="customers-hero-heading"
      className="relative isolate mx-auto w-full max-w-[1440px] px-6 pb-20 pt-[87px] text-v1-frost sm:pb-[120px] lg:min-h-[760px] lg:px-8 lg:pb-[200px] lg:pt-[140px]"
    >
      {/* Sphere stipple field — canvas-rendered from a JSON manifest
          of dot centres extracted from the source PNG. Pour-in
          lifecycle + ambient drift, no attractor (silhouette stays
          whole). Anchored to the viewport's right edge with negative
          right inset so the sphere bleeds slightly off-canvas on the
          right. The page-wrapper's `overflow-x-clip` catches the
          bleed. */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[calc(50%-50vw-40px)] top-1/2 z-0 hidden aspect-square h-auto w-[60%] -translate-y-1/2 select-none lg:block"
      >
        <CustomersHeroDotsCanvas className="block h-full w-full" />
      </div>
      <div className="relative z-10 flex flex-col gap-v1-stack lg:max-w-[860px]">
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
        <motion.p
          {...reveals.body}
          className="max-w-[450px] font-v1Body text-[18px] leading-[24px] tracking-[-0.01em] text-v1-frost"
        >
          From startups to public companies, our customers chose Inngest
          to power their products.
        </motion.p>
      </div>
    </section>
  );
}
