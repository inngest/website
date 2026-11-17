"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { reveals } from "@/utils/v1/reveals";
import {
  COLORS,
  DAILY_PRIZES,
  DAYS,
  prizeFor,
  RAFFLE,
  raffleDayAt,
  unlockAt,
  UNLOCK_DATES,
  YEAR,
} from "@/components/v1/sections/TwelveDays/data";
import PrizeSticker from "@/components/v1/sections/TwelveDays/PrizeSticker";
import {
  buttonClass,
  POSTER_EYEBROW,
  POSTER_TITLE,
} from "@/components/v1/sections/TwelveDays/poster";
import {
  openRaffle,
  useRaffleState,
} from "@/components/v1/sections/TwelveDays/useRaffle";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * The daily raffle: how it works, today's prize, this visitor's entries,
 * and a December calendar with each day's prize as a neon-outlined
 * sticker on its date. The entry itself is the pop-up (RaffleDialog),
 * which also opens from today's door.
 */
export default function RaffleSection({ now }: { now: Date | null }) {
  const { days } = useRaffleState();
  const today = now ? raffleDayAt(now) : null;
  const before = now ? now.getTime() < unlockAt(1).getTime() : true;
  const enteredToday = today !== null && days.includes(today);
  // Before the raffle opens, tease the first prize.
  const featured = prizeFor(today ?? 1);

  return (
    <section
      id="raffle"
      aria-labelledby="twelve-days-raffle-heading"
      className="relative w-full scroll-mt-20"
      style={{ backgroundColor: COLORS.green, color: COLORS.ink }}
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-12 px-6 py-16 sm:px-9 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start">
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

          {/* Today's prize, front and centre, with the entry button. */}
          {featured && (
            <motion.div
              {...reveals.item(0)}
              className="flex flex-col gap-5 rounded-xl border-[3px] border-[#010101] bg-[#010101] p-6 text-white shadow-[8px_8px_0_#ffffff] sm:p-8"
            >
              <p className="font-v1Label text-[13px] text-[#ECFE08]">
                {today !== null
                  ? `${RAFFLE.todaysPrize} · Day ${today}`
                  : `Day 1 prize · December ${UNLOCK_DATES[0]}`}
              </p>
              <div className="flex items-center gap-6">
                <div className="flex h-[120px] w-[120px] shrink-0 items-center justify-center">
                  <PrizeSticker prize={featured} size={104} glow />
                </div>
                <div className="flex min-w-0 flex-col gap-2">
                  <p className="font-sans text-[28px] font-black leading-[1.05] tracking-[-0.02em]">
                    {featured.prize}
                  </p>
                  <p className="text-[16px] leading-[1.3] text-white/75">
                    {featured.pun}
                  </p>
                </div>
              </div>
              {today !== null ? (
                <button
                  type="button"
                  onClick={() => openRaffle(today)}
                  className={
                    buttonClass(enteredToday ? "ghost" : "lime") +
                    " w-full sm:w-auto sm:self-start"
                  }
                >
                  {enteredToday ? `${RAFFLE.entered} ✓` : RAFFLE.enter}
                </button>
              ) : (
                <p className="font-v1Label text-[14px]">
                  {before ? RAFFLE.notYet : RAFFLE.closed}
                </p>
              )}
              <p className="border-t border-white/20 pt-4 font-v1Label text-[13px]">
                {RAFFLE.tracker}: {days.length} of {UNLOCK_DATES.length}
              </p>
            </motion.div>
          )}
        </div>

        <PrizeCalendar today={today} entered={days} now={now} />
      </div>
    </section>
  );
}

/**
 * Two weeks of December (Sun 6 – Sat 19), each door's day carrying its
 * prize. On phones it drops the weekday grid for a plain list of the
 * twelve days.
 */
function PrizeCalendar({
  today,
  entered,
  now,
}: {
  today: number | null;
  entered: number[];
  now: Date | null;
}) {
  // The weekday the first door falls on fixes how many blank cells
  // lead the grid (December 7, 2026 is a Monday).
  const lead = new Date(Date.UTC(YEAR, 11, UNLOCK_DATES[0])).getUTCDay();
  const trail = (7 - ((lead + DAILY_PRIZES.length) % 7)) % 7;

  return (
    <motion.div {...reveals.body} className="flex flex-col gap-4">
      <h3 className="font-sans text-[32px] font-black leading-[1] tracking-[-0.02em]">
        {RAFFLE.calendar.title} {YEAR}
      </h3>
      <ol className="grid grid-cols-2 gap-2 pl-0 sm:grid-cols-4 lg:grid-cols-7">
        {WEEKDAYS.map((d) => (
          <li
            key={d}
            aria-hidden="true"
            className="hidden list-none pb-1 font-v1Label text-[13px] lg:block"
          >
            {d}
          </li>
        ))}
        {Array.from({ length: lead }, (_, i) => (
          <li
            key={`lead-${i}`}
            aria-hidden="true"
            className="hidden list-none rounded-lg border-2 border-dashed border-[#010101]/30 lg:block"
          >
            <span className="block p-3 font-v1Label text-[14px] text-[#010101]/40">
              {UNLOCK_DATES[0] - lead + i}
            </span>
          </li>
        ))}
        {DAILY_PRIZES.map((p) => {
          const lesson = DAYS.find((d) => d.day === p.day);
          const isToday = p.day === today;
          const isPast =
            now !== null &&
            today !== p.day &&
            unlockAt(p.day).getTime() < now.getTime();
          const didEnter = entered.includes(p.day);
          return (
            <li
              key={p.day}
              className={
                "relative flex min-h-[176px] list-none flex-col gap-2 rounded-lg border-2 bg-[#010101] p-3 text-white " +
                (isToday
                  ? "border-[#ECFE08] shadow-[0_0_0_3px_#ECFE08]"
                  : "border-[#010101]") +
                (isPast ? " opacity-60" : "")
              }
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-sans text-[24px] font-black leading-none">
                  {UNLOCK_DATES[p.day - 1]}
                </span>
                {isToday ? (
                  <span className="rounded bg-[#ECFE08] px-1.5 py-0.5 font-v1Label text-[11px] text-[#010101]">
                    {RAFFLE.calendar.today}
                  </span>
                ) : didEnter ? (
                  <span className="font-v1Label text-[11px] text-[#ECFE08]">
                    {RAFFLE.calendar.entered} ✓
                  </span>
                ) : null}
              </div>
              <div className="flex flex-1 items-center justify-center py-1">
                <PrizeSticker
                  prize={p}
                  size={64}
                  color={isToday ? "#ECFE08" : "#FFFFFF"}
                  glow={isToday}
                />
              </div>
              <p className="font-v1Label text-[12px] leading-[1.3]">
                {p.prize}
              </p>
              <p className="sr-only">
                Day {p.day}, {lesson?.primitive}: {p.pun}
              </p>
            </li>
          );
        })}
        {Array.from({ length: trail }, (_, i) => (
          <li
            key={`trail-${i}`}
            aria-hidden="true"
            className="hidden list-none rounded-lg border-2 border-dashed border-[#010101]/30 lg:block"
          >
            <span className="block p-3 font-v1Label text-[14px] text-[#010101]/40">
              {UNLOCK_DATES[UNLOCK_DATES.length - 1] + i + 1}
            </span>
          </li>
        ))}
      </ol>
      <p className="font-v1Label text-[14px]">
        <span className="rounded bg-[#010101] px-2 py-1 text-[#ECFE08]">
          Dec 29
        </span>{" "}
        {RAFFLE.calendar.grand}: {RAFFLE.calendar.grandPrize}
      </p>
    </motion.div>
  );
}
