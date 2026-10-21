"use client";

import { motion } from "motion/react";
import { reveals } from "@/utils/v1/reveals";
import {
  COLORS,
  HOW_IT_OPENS,
  UNLOCK_FUNCTION,
} from "@/components/v1/sections/TwelveDays/data";
import {
  POSTER_EYEBROW,
  POSTER_TITLE,
} from "@/components/v1/sections/TwelveDays/poster";

/** The cron job behind the calendar, on a black field. */
export default function HowItOpens() {
  return (
    <section
      aria-labelledby="twelve-days-how-heading"
      className="relative w-full text-white"
      style={{ backgroundColor: COLORS.ink }}
    >
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-10 px-6 py-16 sm:px-9 sm:py-20 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-24">
        <div className="flex flex-col gap-5">
          <motion.p
            {...reveals.body}
            className={`${POSTER_EYEBROW} text-[#ECFE08]`}
          >
            {HOW_IT_OPENS.eyebrow}
          </motion.p>
          <motion.h2
            {...reveals.heading}
            id="twelve-days-how-heading"
            className={POSTER_TITLE}
          >
            {HOW_IT_OPENS.title}
          </motion.h2>
          <motion.p
            {...reveals.body}
            className="max-w-[520px] text-[18px] leading-[28px] text-white/80"
          >
            {HOW_IT_OPENS.body}
          </motion.p>
        </div>
        <motion.pre
          {...reveals.item(0)}
          className="overflow-x-auto rounded-xl border-[3px] p-6 font-v1Mono text-[13px] leading-[21px] text-[#0BDD48] sm:text-[14px]"
          style={{ borderColor: COLORS.green }}
        >
          <code>{UNLOCK_FUNCTION}</code>
        </motion.pre>
      </div>
    </section>
  );
}
