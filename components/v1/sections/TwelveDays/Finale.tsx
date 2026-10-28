"use client";

import { motion, useReducedMotion } from "motion/react";
import ButtonLink from "@/components/v1/ButtonLink";
import { reveals } from "@/utils/v1/reveals";
import { COLORS, FINALE } from "@/components/v1/sections/TwelveDays/data";
import { Chip, POSTER_TITLE } from "@/components/v1/sections/TwelveDays/poster";

/**
 * The finale: a live CodeTV episode building a Rube Goldberg machine
 * out of everything behind the doors. The animated "keep all your weird
 * workflows running" poster loops beside it.
 */
export default function Finale() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="finale"
      aria-labelledby="twelve-days-finale-heading"
      className="relative w-full scroll-mt-20 overflow-hidden"
      style={{ backgroundColor: COLORS.salmon, color: COLORS.ink }}
    >
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-12 px-6 py-16 sm:px-9 sm:py-20 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-center lg:px-8 lg:py-24">
        <div className="flex flex-col gap-6">
          <motion.ul
            {...reveals.body}
            className="flex list-none flex-wrap gap-2 pl-0"
          >
            {FINALE.chips.map((c, i) => (
              <li key={c} className="list-none">
                <Chip tone={i === 0 ? "dark" : "light"}>{c}</Chip>
              </li>
            ))}
          </motion.ul>
          <motion.h2
            {...reveals.heading}
            id="twelve-days-finale-heading"
            className={POSTER_TITLE}
          >
            <span className="block text-white">{FINALE.title[0]}</span>
            <span className="block">{FINALE.title[1]}</span>
          </motion.h2>
          {FINALE.body.map((p) => (
            <motion.p
              key={p}
              {...reveals.body}
              className="max-w-[560px] text-[18px] leading-[28px] sm:text-[20px] sm:leading-[30px]"
            >
              {p}
            </motion.p>
          ))}
          <motion.div {...reveals.body}>
            <ButtonLink
              href={FINALE.cta.href}
              prefetch={false}
              variant="primary"
              className="!w-full !border-[#010101] !bg-[#010101] !text-white hover:!bg-white hover:!text-[#010101] sm:!w-auto"
            >
              {FINALE.cta.label}
            </ButtonLink>
          </motion.div>
        </div>

        <motion.div
          {...reveals.item(0)}
          className="mx-auto w-full max-w-[380px] overflow-hidden rounded-xl border-[3px] border-[#010101] shadow-[8px_8px_0_#010101]"
        >
          {/* Decorative loop: muted, no controls. Paused for reduced
              motion, where it shows its first frame. */}
          <video
            src={FINALE.video}
            aria-label={FINALE.videoLabel}
            autoPlay={!reduceMotion}
            loop
            muted
            playsInline
            preload="metadata"
            width={1080}
            height={1920}
            className="block h-auto w-full"
          />
        </motion.div>
      </div>
    </section>
  );
}
