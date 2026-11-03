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
 * The build-a-thon, short version: the brief, the guidelines and the
 * prizes on a cream field, linking out to the full rules and the entry
 * form at /12-days-of-workflows/build-a-thon.
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
          <motion.p
            {...reveals.body}
            className="font-v1Label text-[15px] uppercase"
          >
            {BUILDATHON_TEASER.when}
          </motion.p>
          <motion.div
            {...reveals.body}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <Link
              href={BUILDATHON_TEASER.cta.href}
              className={buttonClass("ink") + " w-full sm:w-auto"}
            >
              {BUILDATHON_TEASER.cta.label}
            </Link>
            <Link
              href={BUILDATHON_TEASER.submit.href}
              className={buttonClass("outline") + " w-full sm:w-auto"}
            >
              {BUILDATHON_TEASER.submit.label}
            </Link>
          </motion.div>
        </div>

        <motion.div
          {...reveals.item(0)}
          className="flex flex-col gap-6 rounded-xl border-[3px] border-[#010101] bg-white p-6 shadow-[8px_8px_0_#010101] sm:p-8"
        >
          <ol className="flex flex-col gap-3 pl-0">
            {BUILDATHON_TEASER.guidelines.map((g, i) => (
              <li
                key={g}
                className="flex list-none gap-3 text-[18px] leading-[28px]"
              >
                <span className="font-v1Label text-[#F55C50]">{i + 1}.</span>
                {g}
              </li>
            ))}
          </ol>
          <p className="text-[14px] italic leading-[22px] text-[#010101]/70">
            {BUILDATHON_TEASER.footnote}
          </p>
          <ul className="flex flex-col gap-2 border-t-2 border-[#010101] pl-0 pt-5">
            {BUILDATHON_TEASER.prizes.map((p) => (
              <li
                key={p}
                className="list-none font-v1Label text-[14px] uppercase leading-[1.4]"
              >
                {p}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
