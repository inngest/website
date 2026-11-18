"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { reveals } from "@/utils/v1/reveals";
import BuildathonForm from "@/components/v1/sections/TwelveDays/BuildathonForm";
import {
  BUILDATHON,
  BUILDATHON_TEASER,
  COLORS,
  DAYS,
} from "@/components/v1/sections/TwelveDays/data";
import {
  POSTER_EYEBROW,
  POSTER_TITLE,
} from "@/components/v1/sections/TwelveDays/poster";

/**
 * The build-a-thon, all on the main page: the brief, the rules, the
 * twelve primitives, the prizes and the entry form (#submit). The old
 * /12-days-of-workflows/build-a-thon page redirects here.
 */
export default function BuildathonTeaser() {
  return (
    <section
      id="build-a-thon"
      aria-labelledby="twelve-days-buildathon-heading"
      className="relative w-full scroll-mt-20"
      style={{ backgroundColor: COLORS.white, color: COLORS.ink }}
    >
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-12 px-6 py-16 sm:px-9 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)] lg:items-start lg:px-8 lg:py-24">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-6">
            <motion.p
              {...reveals.body}
              className={`${POSTER_EYEBROW} text-[#F65C4F]`}
            >
              {BUILDATHON_TEASER.eyebrow}
            </motion.p>
            <motion.h2
              {...reveals.heading}
              id="twelve-days-buildathon-heading"
              className={POSTER_TITLE}
            >
              <span className="block text-[#F65C4F]">
                {BUILDATHON_TEASER.title[0]}
              </span>
              <span className="block">{BUILDATHON_TEASER.title[1]}</span>
            </motion.h2>
            <motion.p
              {...reveals.body}
              className="max-w-[560px] text-[18px] leading-[28px] sm:text-[20px] sm:leading-[30px]"
            >
              {BUILDATHON.body}
            </motion.p>
            <motion.p {...reveals.body} className="font-v1Label text-[15px]">
              {BUILDATHON.when}
            </motion.p>
          </div>

          {/* The prizes, compact: amount and place on one line each. */}
          <motion.div
            {...reveals.item(0)}
            className="flex flex-col gap-4 rounded-xl border-[3px] border-[#020202] bg-white p-6 shadow-[8px_8px_0_#020202]"
          >
            <h3 className={`${POSTER_EYEBROW} text-[#F65C4F]`}>
              {BUILDATHON_TEASER.prizesTitle}
            </h3>
            <ul className="flex flex-col pl-0">
              {BUILDATHON.prizes.map((p, i) => (
                <li
                  key={p.place}
                  className={
                    "flex list-none flex-col gap-1 py-3 " +
                    (i > 0 ? "border-t-2 border-[#020202]" : "pt-0")
                  }
                >
                  <span className="font-v1Label text-[14px]">{p.place}</span>
                  <span
                    className={
                      "font-sans font-black tracking-[-0.02em] " +
                      (p.prize.startsWith("$")
                        ? "text-[40px] leading-[1]"
                        : "text-[20px] leading-[1.15]")
                    }
                  >
                    {p.prize}
                  </span>
                  {"note" in p && (
                    <span className="text-[15px] leading-[1.3]">{p.note}</span>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div {...reveals.body} className="flex flex-col gap-4">
            <h3 className={POSTER_EYEBROW}>{BUILDATHON.rulesTitle}</h3>
            <ol className="flex flex-col gap-3 pl-0">
              {BUILDATHON.rules.map((r, i) => (
                <li
                  key={r}
                  className="flex list-none gap-3 text-[18px] leading-[28px]"
                >
                  <span className="font-v1Label text-[#F65C4F]">{i + 1}.</span>
                  {r}
                </li>
              ))}
            </ol>
            <p className="pl-[34px] text-[14px] italic leading-[22px] text-[#020202]/70">
              {BUILDATHON.rulesFootnote}
            </p>
          </motion.div>

          <motion.div {...reveals.body} className="flex flex-col gap-4">
            <h3 className={POSTER_EYEBROW}>{BUILDATHON.primitivesTitle}</h3>
            <ol className="grid grid-cols-1 gap-2 pl-0 sm:grid-cols-2">
              {DAYS.map((d) => (
                <li
                  key={d.day}
                  className="flex list-none items-center gap-3 rounded-md border-2 border-[#020202] bg-white px-3 py-2"
                >
                  <span className="shrink-0 whitespace-nowrap font-v1Label text-[12px] text-[#020202]/60">
                    Day {d.day}
                  </span>
                  <Link
                    href={d.docs.href}
                    className="text-[16px] underline decoration-[#F65C4F] decoration-2 underline-offset-4 hover:decoration-[#020202]"
                  >
                    {d.primitive}
                  </Link>
                </li>
              ))}
            </ol>
          </motion.div>
        </div>

        {/* The entry form. Sticky on wide screens so it stays in reach
            while people read the rules. */}
        <div
          id="submit"
          className="flex scroll-mt-24 flex-col gap-5 lg:sticky lg:top-24"
        >
          <div className="flex flex-col gap-2">
            <p className={`${POSTER_EYEBROW} text-[#F65C4F]`}>
              {BUILDATHON.chips[0]}
            </p>
            <h3 className="font-sans text-[clamp(36px,4.4vw,56px)] font-black leading-[0.95] tracking-[-0.02em]">
              {BUILDATHON.formTitle}
            </h3>
            <p className="font-v1Label text-[15px]">{BUILDATHON.when}</p>
          </div>
          <BuildathonForm />
        </div>
      </div>
    </section>
  );
}
