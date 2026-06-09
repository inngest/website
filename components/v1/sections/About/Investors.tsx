"use client";

import Image from "next/image";
import { motion } from "motion/react";
import GradientFrame from "@/components/v1/sections/shared/GradientFrame";
import { reveals } from "@/utils/v1/reveals";
import {
  ADVISORS,
  FEATURED_INVESTORS,
  SECONDARY_INVESTORS,
  type Investor,
} from "./data";

export default function Investors() {
  return (
    <section
      aria-labelledby="about-investors-heading"
      // Full 1440-wide frame. Mobile/sm scale the section padding down
      // per the v1 page rhythm (40 / 56 / 72).
      className="relative mx-auto w-full max-w-[1440px] pb-20 pt-10 text-v1-frost sm:pb-[120px] sm:pt-[56px] lg:pb-[180px] lg:pt-[72px]"
    >
      <div className="flex flex-col items-stretch gap-6 sm:gap-[28px] lg:gap-[35px]">
        <motion.h2
          {...reveals.heading}
          id="about-investors-heading"
          // The title block has its own `px-[70px] py-8` pad which we
          // collapse into the title element since the surrounding
          // section already supplies horizontal padding.
          className="px-6 text-v1-display-sm uppercase leading-[1.25] [font-size:clamp(2.25rem,5.4vw,4rem)] sm:px-9 lg:px-[70px] lg:py-8"
        >
          Our Investors
        </motion.h2>
        <motion.div
          {...reveals.item(1)}
          className="px-6 sm:px-9 lg:px-[72px]"
        >
          {/* The Background-Gradient-Black + gradient ring is already
              encapsulated by `<GradientFrame variant="black">`. The
              shared component also paints a true hollow gradient border
              so the page background bleeds through the inner edge —
              matching what other v1 cards use. */}
          <GradientFrame variant="black" className="rounded-[6px]">
            {/* The outer flex column inside the frame uses `gap-3`
                between the logos block and the advisors grid — no
                top/bottom padding. The row heights (`h-[213px]` /
                `h-[153px]`) provide all the vertical breathing room for
                the logo block, and each advisor cell is `h-[159px]`. */}
            <div className="flex flex-col gap-3 py-6 sm:py-8 lg:py-0">
              {/* Logo grid — inner width 1296 px (matching the outer
                  frame after `px-[72px]`). Mobile/tablet wrap rows to
                  2-up tiles so the logos stay legible. */}
              <div className="flex flex-col gap-4 px-4 sm:px-10 lg:px-[72px]">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {FEATURED_INVESTORS.map((inv) => (
                    <InvestorTile key={inv.name} investor={inv} featured />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {SECONDARY_INVESTORS.map((inv) => (
                    <InvestorTile key={inv.name} investor={inv} />
                  ))}
                </div>
              </div>
              {/* Advisors grid — 4 × 2 (mobile/tablet step down to
                  2 × N). Each cell is h-[159px] centred, padded 20 px,
                  name 18 px Medium + role 16 px Regular. */}
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 px-2 sm:gap-x-[20px] sm:gap-y-3 sm:px-10 md:grid-cols-4 lg:px-[70px]">
                {ADVISORS.map((a) => (
                  <div
                    key={a.name}
                    // Mobile shrinks to h-[100px] + p-3 so eight
                    // cards don't dominate the section; the full values
                    // (h-[159px], p-[20px], 18/16 px text) return at
                    // md+ where the grid widens to 4-up.
                    className="flex h-[100px] flex-col items-center justify-center gap-1 rounded-[4px] p-3 text-center md:h-[159px] md:p-[20px]"
                  >
                    <p className="font-v1Body text-[13px] font-medium leading-[1.3] tracking-[-0.01em] text-v1-frost md:text-[18px] md:leading-[1.5]">
                      {a.name}
                    </p>
                    <p className="font-v1Body text-[11px] leading-[1.3] tracking-[-0.01em] text-v1-frost md:text-[16px] md:leading-[1.5]">
                      {a.role}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </GradientFrame>
        </motion.div>
      </div>
    </section>
  );
}

function InvestorTile({
  investor,
  featured,
}: {
  investor: Investor;
  featured?: boolean;
}) {
  // Featured tile matches row 1 (`h-[213px]`); secondary matches
  // row 2 (`h-[153px]`). Mobile tiles drop to ~100/80 px so the rows
  // don't add hundreds of pixels of empty vertical air on small
  // screens. The SVGs were patched to use intrinsic viewBox sizing
  // (no `preserveAspectRatio="none"`), so passing `maxWidth/maxHeight`
  // lets the browser shrink them proportionally when the tile is
  // narrower than the logo's natural width.
  const tileHeight = featured
    ? "h-[100px] sm:h-[160px] md:h-[213px]"
    : "h-[80px] sm:h-[120px] md:h-[153px]";
  return (
    <div
      className={`flex ${tileHeight} items-center justify-center overflow-clip rounded-[3.762px] px-2`}
    >
      <Image
        src={investor.logo}
        alt={investor.name}
        width={investor.logoWidth}
        height={investor.logoHeight}
        // Only `maxHeight` is forced inline so the logo never grows
        // above its natural size on wide desktops. Width is left to
        // Tailwind's `max-w-full`, which clamps to the parent tile
        // — when the tile is narrower than the logo width
        // (mobile 2-up), the image shrinks proportionally rather
        // than overflowing into `overflow-clip`. Setting inline
        // `maxWidth` here would override `max-w-full` (inline beats
        // class) and reintroduce the clipping bug.
        style={{ maxHeight: investor.logoHeight }}
        className="block h-auto w-auto max-w-full object-contain"
        unoptimized
      />
    </div>
  );
}
