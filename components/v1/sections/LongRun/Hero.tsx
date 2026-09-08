"use client";

import { motion } from "motion/react";
import ButtonLink from "@/components/v1/ButtonLink";
import { tweens } from "@/utils/v1/springs";
import { CURSOR_SPOTLIGHT_SEED } from "@/utils/v1/cursorFx";
import {
  MARKET_COPY,
  type Market,
} from "@/components/v1/sections/LongRun/data";
import CourseLine from "@/components/v1/sections/LongRun/CourseLine";

/**
 * Campaign hero — the first thing someone sees after scanning a poster or
 * a DOOH panel, so it has to land the campaign line before anything else.
 *
 * The headline is set as three stacked display lines on a salmon panel
 * (the v1 accent used by the /ai and /webhooks heroes), with the marathon
 * course drawing itself across the bottom edge. Copy is market-aware: the
 * eyebrow and lede name the city the visitor is standing in, so the page
 * reads as a continuation of the street rather than a generic product page.
 */

// Mirrors SplitHero's entry cascade so the campaign page feels like it
// belongs to the same site: SSR-render the from-state inline, then let
// motion animate straight to the animate state without a hydration snap.
const entry = (delayMs: number) => ({
  style: {
    opacity: 0,
    transform: "translateY(14px)",
    willChange: "transform, opacity",
  } as const,
  initial: false as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { ...tweens.entry, delay: delayMs / 1000 },
});

export default function Hero({ market }: { market: Market }) {
  const copy = MARKET_COPY[market];

  return (
    <section
      aria-labelledby="long-run-hero-heading"
      className="relative w-full overflow-hidden bg-v1-accent-salmon text-v1-frost"
      onPointerMove={(e) => {
        // Cursor spotlight, same technique as SplitHero: write the
        // pointer position onto the section as CSS custom properties and
        // let a single radial-gradient overlay repaint.
        const el = e.currentTarget;
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) return;
        el.style.setProperty(
          "--mx",
          `${((e.clientX - r.left) / r.width) * 100}%`
        );
        el.style.setProperty(
          "--my",
          `${((e.clientY - r.top) / r.height) * 100}%`
        );
      }}
      style={CURSOR_SPOTLIGHT_SEED}
    >
      {/* No grain overlay here, deliberately: the shared grain asset is a
          tall portrait with directional lighting baked in, so it only reads
          as texture cropped to /ai's 2/3 panel — full-bleed it puts a hard
          light/dark block across the hero. A flat panel plus the cursor
          spotlight is also closer to the printed poster. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden lg:block"
        style={{
          background:
            "radial-gradient(300px circle at var(--mx) var(--my), rgba(255, 210, 195, 0.18), transparent 78%)",
        }}
      />

      {/* Vertical padding runs a step heavier than the standard section
          box so the campaign line has room to be the loudest thing on the
          site; the top value also clears the fixed header. */}
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 py-24 sm:px-9 lg:px-8 lg:py-40">
        <motion.p
          {...entry(40)}
          className="text-v1-label-md uppercase text-v1-frost"
        >
          {copy.eyebrow}
        </motion.p>

        {/* The campaign line, set as large as the grid allows. Three lines
            on desktop; it reflows naturally below lg. */}
        <h1
          id="long-run-hero-heading"
          className="text-v1-display-hero mt-8 uppercase text-v1-frost lg:mt-10"
        >
          {["Build for", "the long", "run."].map((line, i) => (
            <motion.span key={line} className="block" {...entry(120 + i * 110)}>
              {line}
            </motion.span>
          ))}
        </h1>

        <motion.div
          {...entry(520)}
          className="mt-10 flex max-w-[560px] flex-col gap-6 lg:mt-14"
        >
          <p className="text-v1-heading-xs-loose !text-v1-frost">
            Long running humans. Long running agents.
          </p>
          <p className="text-v1-body-lg-loose !text-v1-frost/85">{copy.lede}</p>
        </motion.div>

        <motion.div
          {...entry(640)}
          className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4"
        >
          <ButtonLink
            href="/sign-up?ref=long-run-hero"
            prefetch={false}
            variant="primary"
            className="!w-full hover:!border-v1-jetBlack hover:!bg-v1-jetBlack hover:!text-v1-frost sm:!w-auto"
          >
            Build something that keeps running →
          </ButtonLink>
          <ButtonLink
            href="/docs?ref=long-run-hero"
            variant="secondary"
            className="!w-full hover:!border-v1-jetBlack hover:!bg-v1-jetBlack hover:!text-v1-frost sm:!w-auto"
          >
            Read the docs
          </ButtonLink>
        </motion.div>
      </div>

      {/* The course, drawing itself along the bottom of the panel. Purely
          decorative here — the labelled version lives in the Course
          section further down the page. */}
      <CourseLine
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[120px] text-v1-frost/45 lg:h-[176px]"
        drawDurationMs={2600}
      />
    </section>
  );
}
