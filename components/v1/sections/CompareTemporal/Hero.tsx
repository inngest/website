"use client";

import { motion } from "motion/react";
import ButtonLink from "@/components/v1/ButtonLink";
import HeroDashboard from "@/components/v1/sections/CompareTemporal/HeroDashboard";
import { tweens } from "@/utils/v1/springs";

/**
 * Ivory hero matching the design export (ivory-bg-inngest.png). Built as
 * real HTML rather than the flat PNG — the export has a transparent
 * background with dark text, so it would be invisible dropped onto the
 * dark page. Light band at the top: ivory background, near-black
 * headline + copy, salmon "Read the docs" CTA, dark-outline "Build for
 * free" CTA, and the runs dashboard bleeding flush to the right edge.
 */

const IVORY = "#F3F1EA";
const INK = "#1A1A1A"; // headline
const SUBINK = "#2E2C28"; // body copy — dark warm gray

// Returns motion props for a staggered entry. `color` is merged INTO
// the returned style so a separate `style={{ color }}` prop doesn't
// clobber it (later JSX prop wins, and the spread carries its own
// style object).
const entry = (delay: number, color?: string) => {
  const style: React.CSSProperties = {
    opacity: 0,
    transform: "translateY(14px)",
    willChange: "transform, opacity",
    ...(color ? { color } : {}),
  };
  return {
    style,
    initial: false as const,
    animate: { opacity: 1, y: 0 } as const,
    transition: { ...tweens.entry, delay: delay / 1000 },
  };
};

const DOCS_URL = "/docs?ref=compare-to-temporal";
const SIGNUP_URL = "/sign-up?ref=compare-to-temporal";

// Fine fractal-noise grain (clean, resolution-independent) for the
// ivory hero. Rendered at low opacity via soft-light.
const NOISE_BG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export default function Hero() {
  return (
    <section
      aria-labelledby="ct-hero-headline"
      className="relative overflow-x-clip"
      style={{ backgroundColor: IVORY }}
    >
      <h1 id="ct-hero-headline" className="sr-only">
        The developer experience Temporal wishes it had.
      </h1>

      {/* Fine sand-grain over the ivory — SVG fractal noise (clean, not
          pixelated) at low opacity via soft-light. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 mix-blend-soft-light"
        style={{ backgroundImage: NOISE_BG, opacity: 0.45 }}
      />

      <div className="relative z-[1] flex flex-col lg:flex-row lg:items-center">
        {/* Left rail — aligned to the page container's left edge; on
            wide screens the padding grows to keep it level with the
            max-w-[1440px] sections elsewhere on the page. */}
        <div className="flex flex-col gap-8 px-6 pb-12 pt-[120px] sm:gap-10 sm:px-9 sm:pt-[140px] lg:flex-1 lg:py-[155px] lg:pl-[max(2rem,calc((100vw-1440px)/2+2rem))] lg:pr-[56px]">
          <motion.p
            aria-hidden="true"
            className="text-v1-display-hero uppercase lg:!text-[clamp(2.5rem,5vw,4.75rem)] lg:leading-[1.02] lg:tracking-[-0.025em]"
            {...entry(60, INK)}
          >
            <span className="block">The DX</span>
            <span className="block">Temporal</span>
            <span className="block">wish it had.</span>
          </motion.p>

          <motion.p
            className="max-w-[480px] text-v1-body-lg [font-size:clamp(0.95rem,1.2vw,1.0625rem)] [line-height:1.55]"
            {...entry(280, SUBINK)}
          >
            AI fails unpredictably. APIs crash, context windows overflow,
            LLMs get rate limited. Wrap code in functions that checkpoint,
            wait, and offload without extra infrastructure.
          </motion.p>

          <motion.div
            className="flex flex-col gap-[18px] sm:flex-row sm:items-center"
            {...entry(460)}
          >
            <ButtonLink
              href={DOCS_URL}
              variant="accent"
              className="!w-full sm:!w-auto"
            >
              Read the docs
            </ButtonLink>
            {/* Dark-outline CTA — `secondaryLight` is the frost-ring
                secondary recoloured to ink for this ivory hero. */}
            <ButtonLink
              href={SIGNUP_URL}
              variant="secondaryLight"
              className="!w-full sm:!w-auto"
            >
              Build for free
            </ButtonLink>
          </motion.div>
        </div>

        {/* Right rail — runs dashboard, flush to the right edge of the
            page (left corners rounded, right edge bleeds). Sized at 56%
            but capped (max-w) so it stops scaling on ultra-wide screens;
            the left rail (flex-1) absorbs the surplus width instead. */}
        <motion.div
          className="w-full px-6 pb-20 sm:px-9 lg:min-w-0 lg:w-[56%] lg:max-w-[1080px] lg:px-0 lg:py-[155px]"
          {...entry(360)}
        >
          <HeroDashboard />
        </motion.div>
      </div>
    </section>
  );
}
