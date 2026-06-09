"use client";

import { motion } from "motion/react";
import { reveals } from "@/utils/v1/reveals";

export default function Hero() {
  return (
    <section
      aria-labelledby="about-hero-heading"
      // Two equal flex-1 columns with `gap-[56px]` centred vertically.
      // Mobile falls back to a stacked layout with tighter horizontal
      // pad. Top padding follows the shared v1 hero scaffold (64 / 88 /
      // 120) so the fixed Header doesn't overlap the title — same
      // values used by ContactForm, SalesInquiryForm, etc.
      className="relative mx-auto w-full max-w-[1440px] px-6 pb-16 pt-[87px] text-v1-frost sm:px-9 sm:pb-20 lg:px-[70px] lg:pb-[90px] lg:pt-[120px]"
    >
      <div className="flex flex-col items-stretch justify-center gap-10 sm:gap-12 lg:flex-row lg:items-center lg:gap-[56px]">
        {/* Left column — `h-[272px]` justify-between rail puts the
            title at the top and the subtitle at the bottom. The fixed
            height only applies at lg where the right column anchors
            that visual rhythm. Width is 604px (flex-1 takes the
            remainder after the fixed 640px right column). */}
        <div className="flex flex-1 flex-col items-start justify-between gap-8 lg:gap-12">
          <motion.h1
            {...reveals.heading}
            id="about-hero-heading"
            // Clamp scales the Display/Md title down on mobile so the
            // two-word heading still reads at one or two lines.
            className="text-v1-display-sm uppercase leading-[1.25] [font-size:clamp(2.75rem,7.5vw,5rem)]"
          >
            About Inngest
          </motion.h1>
          <motion.p
            {...reveals.body}
            className="text-v1-body-lg text-v1-frost"
          >
            Inngest is the observable execution layer for agents and
            workflows &mdash; from the first function to full production.
          </motion.p>
        </div>
        {/* Right column — fixed `w-[640px] h-[272px]` rail split into
            two equal flex-1 halves, each paragraph bottom-aligned
            (`justify-end`) inside its half. That structure — not a flat
            gap — is what produces the vertical rhythm. At lg it's a
            fixed 640px (the left column flexes to fill the rest); below
            lg it falls back to a simple stacked layout. */}
        <motion.div
          {...reveals.item(2)}
          className="flex flex-1 flex-col gap-[1.5em] text-v1-body-lg-loose text-v1-frost lg:h-[272px] lg:w-[640px] lg:flex-none lg:gap-0"
        >
          <div className="flex flex-col justify-end lg:flex-1">
          <p>
            Engineers spend half their time on the code that propels
            their apps forward, and half their time just keeping that
            code from failing. We think that ratio sucks. So in 2022, we
            released a new way to build and optimize event-driven
            workflows without leaving your codebase. Inngest is{" "}
            <a
              href="https://github.com/inngest/inngest"
              target="_blank"
              rel="noreferrer"
              className="text-v1-accent-salmon-light motion-safe:transition-colors hover:underline"
            >
              open core
            </a>{" "}
            and can be run on any developer&apos;s laptop or on Inngest
            Cloud, using any compute platform.
          </p>
          </div>
          <div className="flex flex-col justify-end lg:flex-1">
          <p>
            We&rsquo;re mostly a team of grizzled engineers who have no
            desire to return to a world of hand-rolled queues, manual
            retry logic, and full architecture rebuilds when the
            &ldquo;right&rdquo; way to build something changes. We also
            have a few marketers and sellers who don&rsquo;t really
            understand but bet that was really hard 🤍
          </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
