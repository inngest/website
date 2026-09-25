"use client";

import Image from "next/image";
import { motion } from "motion/react";
import ButtonLink from "@/components/v1/ButtonLink";
import GradientFrame from "@/components/v1/sections/shared/GradientFrame";
import { tweens } from "@/utils/v1/springs";
import { CURSOR_SPOTLIGHT_SEED } from "@/utils/v1/cursorFx";
import { HERO } from "@/components/v1/sections/SfLongRun/data";
import InstallButton from "@/components/v1/sections/SfLongRun/InstallButton";
import TongueSwoosh from "@/components/v1/sections/SfLongRun/TongueSwoosh";

/**
 * Campaign hero — what someone sees after scanning a step.run/sf
 * placement. Split layout: the copy stack reads down the left column
 * with the product panel beside it, and the campaign illustration runs
 * full-bleed underneath, bleeding over the logo strip below.
 */

// SSR-renders the from-state inline so each line is at opacity 0 / y +14
// before hydration; `initial={false}` lets motion animate straight to the
// animate state without a post-hydration snap.
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

export default function Hero() {
  return (
    <section
      aria-labelledby="sf-long-run-hero-heading"
      className="relative w-full overflow-hidden bg-v1-canvasBase text-v1-frost"
      onPointerMove={(e) => {
        // Cursor spotlight: write the pointer position onto the section
        // as CSS custom properties and let one gradient overlay repaint,
        // rather than animating anything per-frame in React.
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
      {/* Copy left, product panel right. Bottom padding is deliberately
          small: the illustration below fills its canvas edge to edge, so
          this value is the whole visible gap under the CTAs. */}
      <div className="relative z-10 mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-x-12 px-6 pb-4 pt-24 sm:px-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,46%)] lg:items-center lg:px-8 lg:pt-40">
        <div className="flex flex-col">
          <motion.p {...entry(40)} className="text-v1-label-md uppercase">
            <span className="text-v1-frost">{HERO.eyebrow}</span>{" "}
            <span className="text-v1-accent-green">{HERO.eyebrowAccent}</span>
          </motion.p>

          <h1
            id="sf-long-run-hero-heading"
            className="text-v1-display-hero mt-8 uppercase text-v1-frost lg:mt-10"
          >
            {["Build for", "the long", "run."].map((line, i) => (
              <motion.span
                key={line}
                className="block"
                {...entry(120 + i * 110)}
              >
                {line}
              </motion.span>
            ))}
          </h1>

          <motion.p
            {...entry(520)}
            className="text-v1-body-lg-loose mt-10 max-w-[620px] !text-v1-frost/85"
          >
            {HERO.body}
          </motion.p>

          <motion.div
            {...entry(640)}
            className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
          >
            <ButtonLink
              href={HERO.cta.href}
              prefetch={false}
              variant="primary"
              className="!w-full !border-v1-accent-green !bg-transparent !text-v1-accent-green hover:!bg-v1-accent-green hover:!text-v1-jetBlack sm:!w-auto"
            >
              {HERO.cta.label}
            </ButtonLink>
            <InstallButton
              label={HERO.installCta.label}
              command={HERO.installCta.command}
              className="w-full sm:w-auto"
            />
          </motion.div>
        </div>

        <motion.div {...entry(700)} className="mt-12 lg:mt-0">
          <GradientFrame variant="black" className="overflow-hidden rounded-lg">
            <Image
              src={HERO.visual.src}
              alt={HERO.visual.alt}
              width={HERO.visual.width}
              height={HERO.visual.height}
              // Above the fold, so not lazy-loaded. Stating the slot width
              // lets Next pick a variant that matches the column.
              priority
              sizes="(max-width: 1024px) 92vw, 46vw"
              className="h-auto w-full"
            />
          </GradientFrame>
        </motion.div>
      </div>

      {/* Scroll-driven: the cup runs forward as the page scrolls down and
          backwards as it scrolls up. Bleeds past the hero's bottom edge
          so the swoosh runs behind the logo strip below. */}
      <TongueSwoosh className="relative z-0 -mb-16 block w-full lg:-mb-24" />
    </section>
  );
}
