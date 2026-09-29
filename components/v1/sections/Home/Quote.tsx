"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { cn } from "@/utils/v1/cn";
import { reveals } from "@/utils/v1/reveals";
import { useIsDesktop } from "@/utils/v1/hooks/useIsDesktop";
import { V1_SECTION_TITLE } from "@/components/v1/sections/shared/sectionTitle";
import DevServerTour from "@/components/v1/sections/Home/DevServerTour";
import InstallCommandButton from "@/components/v1/sections/Home/InstallCommandButton";
import {
  LOGOMARK_DESIGN_WIDTH,
  LOGOMARK_DESIGN_X,
} from "@/components/v1/sections/shared/logomarkPlacement";

const InngestLogoCanvas = dynamic(
  () => import("@/components/v1/sections/shared/InngestLogoCanvas"),
  { ssr: false }
);

/**
 * First section below the fold: centred header + subtext over the
 * stippled logomark field, the same install command as the hero, then
 * the local dev server with a looping tour. The CTA sits above the dev
 * server so it's reachable without scrolling past the frame.
 */
export default function Quote() {
  // Drop particle count on mobile so the logomark reads as a faint
  // stipple instead of a solid silhouette.
  const isDesktop = useIsDesktop();

  return (
    <section
      aria-label="Why Inngest"
      className="relative isolate overflow-x-clip"
    >
      {/* Canvas wrapper extends 120 px above (just enough that the
          chain-logo particles can stream in from the bottom-right of
          the logo bar section above — never higher than the logo
          bar itself) and 35 vh below so the field bleeds into the
          section underneath. aria-hidden + pointer-events-none so
          the canvas doesn't interfere with surrounding content. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -bottom-[35vh] top-0 opacity-15 lg:-top-[60px] lg:opacity-50"
      >
        <InngestLogoCanvas
          width={LOGOMARK_DESIGN_WIDTH}
          x={LOGOMARK_DESIGN_X}
          originX={0}
          enterRange={1.8}
          exitRange={1.3}
          maxParticles={isDesktop ? undefined : 3000}
        />
      </div>

      {/* Asymmetric padding: the top is kept tight so the heading and the
          top of the dev server frame come into view as the hero scrolls
          past, rather than needing a second scroll. */}
      <div className="relative z-10 mx-auto max-w-[1440px] px-6 pb-10 pt-10 lg:px-8 lg:pb-[clamp(40px,4.5vh,64px)] lg:pt-[clamp(40px,4.5vh,64px)]">
        <div className="flex flex-col items-center gap-v1-stack text-center">
          {/* Held to one line from lg up — the clamp scales with the
              viewport, so the full rail always has room for it. Mobile
              wraps, where a single line would overflow. */}
          <motion.h2
            {...reveals.heading}
            className={cn(V1_SECTION_TITLE, "lg:whitespace-nowrap")}
          >
            The DX in Durable Execution
          </motion.h2>
          <motion.p
            {...reveals.body}
            className="max-w-[52rem] font-v1Body text-[18px] leading-[28px] tracking-[-0.01em] text-[#B3B3B3] lg:max-w-none lg:whitespace-nowrap lg:text-[clamp(1rem,1.5vw,1.25rem)] lg:leading-[1.5]"
          >
            However it&rsquo;s written, wherever it runs&mdash;Inngest makes it
            unbreakable. Start locally, scale instantly.
          </motion.p>
        </div>

        <motion.div
          {...reveals.body}
          className="mt-8 flex justify-center lg:mt-10"
        >
          <InstallCommandButton />
        </motion.div>

        <motion.div
          {...reveals.body}
          className="mx-auto mt-8 max-w-[1200px] lg:mt-10"
        >
          <DevServerTour />
        </motion.div>
      </div>
    </section>
  );
}
