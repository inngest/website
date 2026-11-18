"use client";

import { motion } from "motion/react";
import { reveals } from "@/utils/v1/reveals";
import { COLORS, HOW_IT_WORKS } from "@/components/v1/sections/TwelveDays/data";
import { POSTER_EYEBROW } from "@/components/v1/sections/TwelveDays/poster";

/**
 * The journey in five numbered steps, right under the hero, so the
 * order (join, set up, a door a day, optionally build, watch live) is
 * clear before anyone scrolls. Each step links to where it happens, and
 * a shortcut goes straight to the build-a-thon form for people who
 * don't need the lessons.
 */
export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="twelve-days-how-heading"
      className="w-full scroll-mt-20"
      style={{ backgroundColor: COLORS.yellow, color: COLORS.ink }}
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-6 py-12 sm:px-9 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <h2 id="twelve-days-how-heading" className={POSTER_EYEBROW}>
            {HOW_IT_WORKS.title}
          </h2>
          {/* Steps 1–3 aren't required: anyone can build and submit now. */}
          <p className="font-v1Label text-[14px]">
            {HOW_IT_WORKS.skip.lead}{" "}
            <a
              href={HOW_IT_WORKS.skip.href}
              className="underline underline-offset-4 hover:no-underline"
            >
              {HOW_IT_WORKS.skip.label} <span aria-hidden="true">↓</span>
            </a>
          </p>
        </div>
        <ol className="grid grid-cols-1 gap-4 pl-0 sm:grid-cols-2 lg:grid-cols-5">
          {HOW_IT_WORKS.steps.map((step, i) => (
            <motion.li
              key={step.title}
              {...reveals.item(i)}
              className="flex list-none flex-col gap-3 rounded-xl border-[3px] border-[#020202] bg-white p-5 shadow-[6px_6px_0_#020202]"
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#020202] font-v1Label text-[14px] text-[#F7DA10]"
                >
                  {i + 1}
                </span>
                <span className="font-v1Label text-[13px]">{step.when}</span>
              </div>
              <h3 className="font-sans text-[24px] font-black leading-[1.05] tracking-[-0.01em]">
                {step.title}
              </h3>
              <p className="text-[15px] leading-[22px]">{step.body}</p>
              <a
                href={step.href}
                className="mt-auto inline-flex items-center gap-2 font-v1Label text-[13px] underline underline-offset-4 hover:no-underline"
              >
                {step.cta} <span aria-hidden="true">↓</span>
              </a>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
