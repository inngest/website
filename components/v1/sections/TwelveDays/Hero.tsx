"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import ButtonLink from "@/components/v1/ButtonLink";
import { clearHeroPanel, setHeroPanel } from "@/utils/v1/heroNav";
import { tweens } from "@/utils/v1/springs";
import {
  COLORS,
  DAYS,
  HERO,
  unlockAt,
} from "@/components/v1/sections/TwelveDays/data";
import { formatCountdown } from "@/components/v1/sections/TwelveDays/useCalendarClock";
import {
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

/** One line of status under the CTA: what's open and what's next. */
function status(now: Date | null): string | null {
  if (!now) return null;
  const next = DAYS.find((d) => unlockAt(d.day).getTime() > now.getTime());
  if (!next) return "All twelve doors are open.";
  const wait = formatCountdown(unlockAt(next.day).getTime() - now.getTime());
  return `Door ${next.day} opens in ${wait}`;
}

/**
 * Poster-style hero: salmon field, a huge white line, a mono line, a
 * huge black line — set like the "Huge day for people who refuse to
 * stop running" posters — with the rat-wheel contraption on the right.
 */
export default function Hero({ now }: { now: Date | null }) {
  const line = status(now);
  const reduceMotion = useReducedMotion();
  // The contraption leans toward the cursor, a few degrees at most.
  const tiltX = useSpring(useMotionValue(0), { stiffness: 120, damping: 14 });
  const tiltY = useSpring(useMotionValue(0), { stiffness: 120, damping: 14 });
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
      onPointerMove={(e) => {
        if (reduceMotion || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        tiltY.set(((e.clientX - r.left) / r.width - 0.5) * 12);
        tiltX.set(-((e.clientY - r.top) / r.height - 0.5) * 8);
      }}
      onPointerLeave={() => {
        tiltX.set(0);
        tiltY.set(0);
      }}
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
            {...entry(400)}
            className="mt-8 max-w-[620px] font-sans text-[22px] font-black leading-[1.15] sm:text-[26px]"
          >
            {HERO.tagline}
          </motion.p>

          <motion.p
            {...entry(440)}
            className="mt-4 max-w-[560px] text-[18px] leading-[28px] sm:text-[20px] sm:leading-[30px]"
          >
            {HERO.body}
          </motion.p>

          <motion.div
            {...entry(540)}
            className="mt-8 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center"
          >
            <ButtonLink
              href={HERO.cta.href}
              prefetch={false}
              variant="primary"
              className="!w-full !border-[#010101] !bg-[#010101] !text-white hover:!bg-white hover:!text-[#010101] sm:!w-auto"
            >
              {HERO.cta.label}
            </ButtonLink>
            <ButtonLink
              href={HERO.secondaryCta.href}
              prefetch={false}
              variant="primary"
              className="!w-full !border-[#010101] !bg-transparent !text-[#010101] hover:!bg-[#010101] hover:!text-white sm:!w-auto"
            >
              {HERO.secondaryCta.label}
            </ButtonLink>
          </motion.div>
          {/* Reserves its line before the clock mounts so nothing jumps.
              Not a live region: it ticks every second. */}
          <motion.p
            {...entry(600)}
            className="mt-5 min-h-[20px] font-v1Label text-[15px] uppercase"
          >
            {line}
          </motion.p>
        </div>

        {/* The contraption: rat on a wheel, a hand, a mug, a mouth. */}
        <motion.div
          {...entry(380)}
          className="relative mx-auto mt-12 w-full max-w-[360px] self-end [perspective:1200px] lg:mt-0 lg:max-w-none"
        >
          <motion.div style={{ rotateX: tiltX, rotateY: tiltY }}>
            <Image
              src="/assets/v1/12-days/contraption.webp"
              alt="A rat in a green vest running on a wheel, which tips a hand to pour coffee from a green mug into a wide-open mouth."
              width={760}
              height={1499}
              priority
              sizes="(max-width: 1024px) 360px, 34vw"
              className="h-auto w-full"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
