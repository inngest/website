"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { reveals } from "@/utils/v1/reveals";
import {
  COLORS,
  RAFFLE,
  raffleDayAt,
  unlockAt,
  UNLOCK_DATES,
} from "@/components/v1/sections/TwelveDays/data";
import {
  buttonClass,
  POSTER_EYEBROW,
  POSTER_TITLE,
} from "@/components/v1/sections/TwelveDays/poster";
import {
  openRaffle,
  useRaffleState,
} from "@/components/v1/sections/TwelveDays/useRaffle";

/**
 * The daily raffle: how it works, the prizes, this visitor's entries so
 * far, and a button for today's entry. The entry itself is the pop-up
 * (RaffleDialog), which also opens from today's door.
 */
export default function RaffleSection({ now }: { now: Date | null }) {
  const { days } = useRaffleState();
  const today = now ? raffleDayAt(now) : null;
  const before = now ? now.getTime() < unlockAt(1).getTime() : true;
  const enteredToday = today !== null && days.includes(today);

  return (
    <section
      id="raffle"
      aria-labelledby="twelve-days-raffle-heading"
      className="relative w-full scroll-mt-20"
      style={{ backgroundColor: COLORS.green, color: COLORS.ink }}
    >
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-12 px-6 py-16 sm:px-9 sm:py-20 lg:grid-cols-2 lg:items-start lg:px-8 lg:py-24">
        <div className="flex flex-col gap-6">
          <motion.p {...reveals.body} className={POSTER_EYEBROW}>
            {RAFFLE.eyebrow}
          </motion.p>
          <motion.h2
            {...reveals.heading}
            id="twelve-days-raffle-heading"
            className={POSTER_TITLE}
          >
            <span className="block text-white">{RAFFLE.title[0]}</span>
            <span className="block">{RAFFLE.title[1]}</span>
          </motion.h2>
          <motion.p
            {...reveals.body}
            className="max-w-[560px] text-[18px] leading-[28px] sm:text-[20px] sm:leading-[30px]"
          >
            {RAFFLE.body}
          </motion.p>
          <motion.ol {...reveals.body} className="flex flex-col gap-2 pl-0">
            {RAFFLE.steps.map((step, i) => (
              <li
                key={step}
                className="flex list-none items-baseline gap-3 font-v1Label text-[15px]"
              >
                <span
                  aria-hidden="true"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#010101] text-[13px] text-[#ECFE08]"
                >
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </motion.ol>
          <motion.div
            {...reveals.body}
            className="flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            {today !== null ? (
              <button
                type="button"
                onClick={() => openRaffle(today)}
                className={buttonClass(enteredToday ? "white" : "ink")}
              >
                {enteredToday
                  ? `${RAFFLE.entered} ✓`
                  : `${RAFFLE.enter} (Day ${today})`}
              </button>
            ) : (
              <p className="font-v1Label text-[15px]">
                {before ? RAFFLE.notYet : RAFFLE.closed}
              </p>
            )}
          </motion.div>
          <p className="font-v1Label text-[12px]">
            {RAFFLE.rules.lead}{" "}
            <Link
              href={RAFFLE.rules.href}
              className="underline underline-offset-4 hover:no-underline"
            >
              {RAFFLE.rules.label}
            </Link>
          </p>
        </div>

        <motion.div
          {...reveals.item(0)}
          className="flex flex-col gap-6 rounded-xl border-[3px] border-[#010101] bg-white p-6 shadow-[8px_8px_0_#010101] sm:p-8"
        >
          <h3 className={`${POSTER_EYEBROW} text-[#F55C50]`}>
            {RAFFLE.prizesTitle}
          </h3>
          <ul className="flex flex-col pl-0">
            {RAFFLE.prizes.map((p, i) => (
              <li
                key={p.name}
                className={
                  "flex list-none flex-col gap-1 py-4 " +
                  (i > 0 ? "border-t-2 border-[#010101]" : "pt-0")
                }
              >
                <span className="font-sans text-[28px] font-black leading-[1.05] tracking-[-0.02em]">
                  {p.name}
                </span>
                <span className="text-[16px] leading-[1.3]">{p.note}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-3 border-t-2 border-[#010101] pt-5">
            <p className="font-v1Label text-[13px]">
              {RAFFLE.tracker}: {days.length} of {UNLOCK_DATES.length}
            </p>
            <ol
              aria-label={`${RAFFLE.tracker}: ${days.length} of ${UNLOCK_DATES.length} days`}
              className="grid grid-cols-6 gap-2 pl-0 sm:grid-cols-12"
            >
              {UNLOCK_DATES.map((_, i) => {
                const d = i + 1;
                const entered = days.includes(d);
                return (
                  <li
                    key={d}
                    aria-label={`Day ${d}: ${
                      entered ? "entered" : "not entered"
                    }`}
                    className={
                      "flex aspect-square list-none items-center justify-center rounded-md border-2 border-[#010101] font-v1Label text-[12px] " +
                      (entered
                        ? "bg-[#010101] text-[#ECFE08]"
                        : d === today
                        ? "bg-[#ECFE08]"
                        : "bg-white text-[#010101]/50")
                    }
                  >
                    {entered ? "✓" : d}
                  </li>
                );
              })}
            </ol>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
