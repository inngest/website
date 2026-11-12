"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { reveals } from "@/utils/v1/reveals";
import {
  BUILDATHON_TEASER,
  COLORS,
} from "@/components/v1/sections/TwelveDays/data";
import {
  buttonClass,
  POSTER_EYEBROW,
  POSTER_TITLE,
} from "@/components/v1/sections/TwelveDays/poster";

/**
 * The build-a-thon, short version: the brief and the prizes on a cream
 * field, with one link out to the full rules and the entry form at
 * /12-days-of-workflows/build-a-thon.
 */
export default function BuildathonTeaser() {
  return (
    <section
      id="build-a-thon"
      aria-labelledby="twelve-days-buildathon-heading"
      className="relative w-full scroll-mt-20"
      style={{ backgroundColor: COLORS.cream, color: COLORS.ink }}
    >
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-12 px-6 py-16 sm:px-9 sm:py-20 lg:grid-cols-2 lg:items-start lg:px-8 lg:py-24">
        <div className="flex flex-col gap-6">
          <motion.p
            {...reveals.body}
            className={`${POSTER_EYEBROW} text-[#F55C50]`}
          >
            {BUILDATHON_TEASER.eyebrow}
          </motion.p>
          <motion.h2
            {...reveals.heading}
            id="twelve-days-buildathon-heading"
            className={POSTER_TITLE}
          >
            <span className="block text-[#F55C50]">
              {BUILDATHON_TEASER.title[0]}
            </span>
            <span className="block">{BUILDATHON_TEASER.title[1]}</span>
          </motion.h2>
          <motion.p
            {...reveals.body}
            className="max-w-[560px] text-[18px] leading-[28px] sm:text-[20px] sm:leading-[30px]"
          >
            {BUILDATHON_TEASER.body}
          </motion.p>
          <motion.p {...reveals.body} className="font-v1Label text-[15px]">
            {BUILDATHON_TEASER.when}
          </motion.p>
          <motion.div {...reveals.body}>
            <Link
              href={BUILDATHON_TEASER.cta.href}
              className={buttonClass("ink") + " w-full sm:w-auto"}
            >
              {BUILDATHON_TEASER.cta.label}
            </Link>
          </motion.div>
        </div>

        <motion.div
          {...reveals.item(0)}
          className="flex flex-col gap-6 rounded-xl border-[3px] border-[#010101] bg-white p-6 shadow-[8px_8px_0_#010101] sm:p-8"
        >
          <h3 className={`${POSTER_EYEBROW} text-[#F55C50]`}>
            {BUILDATHON_TEASER.prizesTitle}
          </h3>
          <ul className="flex flex-col pl-0">
            {BUILDATHON_TEASER.prizes.map((p, i) => (
              <li
                key={p.place}
                className={
                  "flex list-none flex-col gap-1 py-4 " +
                  (i > 0 ? "border-t-2 border-[#010101]" : "pt-0")
                }
              >
                <span className="font-v1Label text-[15px]">{p.place}</span>
                <span
                  className={
                    "font-sans font-black leading-[1] tracking-[-0.02em] " +
                    (p.prize.startsWith("$")
                      ? "text-[clamp(40px,5vw,64px)]"
                      : "text-[22px] leading-[1.15]")
                  }
                >
                  {p.prize}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-[14px] italic leading-[22px] text-[#010101]/70">
            {BUILDATHON_TEASER.footnote}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
