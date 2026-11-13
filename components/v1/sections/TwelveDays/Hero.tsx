"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { clearHeroPanel, setHeroPanel } from "@/utils/v1/heroNav";
import { tweens } from "@/utils/v1/springs";
import { COLORS, HERO } from "@/components/v1/sections/TwelveDays/data";
import {
  buttonClass,
  Chip,
  POSTER_HUGE,
  POSTER_MONO,
} from "@/components/v1/sections/TwelveDays/poster";

// Same entry as the city campaign heroes: SSR at the from-state, then
// animate in on hydration with no snap.
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

/** `npm install inngest` as a button that copies itself. */
function InstallButton() {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(id);
  }, [copied]);

  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard
          ?.writeText(HERO.install)
          .then(() => setCopied(true))
          .catch(() => {});
      }}
      aria-label={`Copy ${HERO.install}`}
      className={buttonClass("ink") + " gap-3 !font-v1Mono !text-[14px]"}
    >
      <span aria-hidden="true" className="text-[#0BDD48]">
        $
      </span>
      {HERO.install}
      <span aria-live="polite" className="text-[12px] text-white/60">
        {copied ? "Copied" : "Copy"}
      </span>
    </button>
  );
}

/**
 * Poster-style hero: salmon field, a huge white line, a mono line, a
 * huge black line — set like the "Huge day for people who refuse to
 * stop running" posters — with the cat-and-rats wreath on the right.
 */
export default function Hero() {
  // Tell the fixed header it sits on salmon, so its nav-hover wipe goes
  // dark instead of vanishing (same signal SplitHero publishes).
  const heroToken = useRef<object>({});
  useEffect(() => {
    const token = heroToken.current;
    setHeroPanel("salmon", token);
    return () => clearHeroPanel(token);
  }, []);

  return (
    <section
      aria-labelledby="twelve-days-hero-heading"
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: COLORS.salmon, color: COLORS.ink }}
    >
      <div className="relative mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-x-10 px-6 pb-16 pt-24 sm:px-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,34%)] lg:px-8 lg:pb-0 lg:pt-36">
        <div className="flex flex-col lg:pb-24">
          <motion.ul
            {...entry(40)}
            className="flex list-none flex-wrap gap-2 pl-0"
          >
            {HERO.chips.map((c) => (
              <li key={c} className="list-none">
                <Chip>{c}</Chip>
              </li>
            ))}
          </motion.ul>

          {/* Read as one heading; the three poster lines are visual. */}
          <h1
            id="twelve-days-hero-heading"
            aria-label={HERO.label}
            className="mt-8 flex flex-col lg:mt-10"
          >
            <motion.span
              {...entry(120)}
              aria-hidden="true"
              className={`${POSTER_HUGE} block text-white`}
            >
              {HERO.titleTop}
            </motion.span>
            <motion.span
              {...entry(220)}
              aria-hidden="true"
              className={`${POSTER_MONO} my-3 block max-w-[22ch]`}
            >
              {HERO.titleMid}
            </motion.span>
            <motion.span
              {...entry(320)}
              aria-hidden="true"
              // "Workflows" is too long for the poster size: scaled to
              // fill the text column's width instead.
              className={`${POSTER_HUGE} block !text-[12.4vw] lg:!text-[min(8.4vw,121px)]`}
            >
              {HERO.titleBottom}
            </motion.span>
          </h1>

          <motion.p
            {...entry(440)}
            className="mt-8 max-w-[560px] text-[18px] leading-[28px] sm:text-[20px] sm:leading-[30px]"
          >
            {HERO.body}
          </motion.p>

          <motion.div
            {...entry(540)}
            className="mt-8 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center"
          >
            <InstallButton />
            <Link
              href={HERO.cta.href}
              prefetch={false}
              className={buttonClass("outline")}
            >
              {HERO.cta.label}
            </Link>
          </motion.div>
        </div>

        {/* The wreath: a grinning black cat ringed by scarfed rats. */}
        <motion.div
          {...entry(380)}
          className="relative mx-auto mt-12 w-full max-w-[360px] lg:mt-[69px] lg:max-w-none lg:self-start"
        >
          <Image
            src="/assets/v1/12-days/wreath.webp"
            alt="A grinning black cat with a lit candle on its head, ringed by a wreath of green and yellow rats in striped scarfs, tied off with a bow and mistletoe."
            width={1400}
            height={1842}
            priority
            sizes="(max-width: 1024px) 360px, 34vw"
            className="h-auto w-full"
          />
        </motion.div>
      </div>
    </section>
  );
}
