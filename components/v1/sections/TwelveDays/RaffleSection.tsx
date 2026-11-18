"use client";

import { motion } from "motion/react";
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
import PrizePanel from "@/components/v1/sections/TwelveDays/PrizePanel";
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
 * The daily raffle showcase: today's prize with the entry button, and a
 * December calendar with each day's prize as a neon-outlined
 * sticker on its date. The entry itself is the pop-up (RaffleDialog),
 * which also opens from today's door; the rules live in that form.
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
          </div>

          {/* Today's prize, front and centre, with the entry button. */}
          {featured && (
            <motion.div
              {...reveals.item(0)}
              className="flex flex-col gap-5 rounded-xl border-[3px] border-[#020202] bg-[#020202] p-6 text-white shadow-[8px_8px_0_#ffffff] sm:p-8"
            >
              <p className="font-v1Label text-[13px] text-[#F7DA10]">
                {today !== null
                  ? `${RAFFLE.todaysPrize} · Day ${today}`
                  : `Day 1 prize · December ${UNLOCK_DATES[0]}`}
              </p>
              <div className="flex items-center gap-6">
                <PrizePanel
                  prize={featured}
                  className="h-[132px] w-[156px] shrink-0"
                  sizes="132px"
                  emojiClassName="text-[64px]"
                />
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
                    buttonClass(enteredToday ? "ghost" : "yellow") +
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
            className="hidden list-none rounded-lg border-2 border-dashed border-[#020202]/30 lg:block"
          >
            <span className="block p-3 font-v1Label text-[14px] text-[#020202]/40">
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
                // The prize card from Figma: slate card, thin black border
                // with a heavy bottom-right edge, date, panel, name.
                "relative flex list-none flex-col gap-3 rounded-[16px] border-[1.5px] border-b-[6px] border-r-[6px] border-[#020202] bg-[#212121] p-3 text-white " +
                (isToday
                  ? "outline outline-[3px] outline-offset-[3px] outline-[#F7DA10]"
                  : "") +
                (isPast ? " brightness-75 saturate-[.35]" : "")
              }
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-sans text-[28px] font-black leading-none tracking-[-0.01em]">
                  {UNLOCK_DATES[p.day - 1]}
                </span>
                {isToday ? (
                  <span className="rounded bg-[#F7DA10] px-1.5 py-0.5 font-v1Label text-[11px] text-[#020202]">
                    {RAFFLE.calendar.today}
                  </span>
                ) : didEnter ? (
                  <span className="font-v1Label text-[11px] text-[#F7DA10]">
                    {RAFFLE.calendar.entered} ✓
                  </span>
                ) : null}
              </div>
              <PrizePanel prize={p} className="h-[116px] w-full" sizes="96px" />
              <p className="text-center font-v1Mono text-[13px] leading-[1.5]">
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
            className="hidden list-none rounded-lg border-2 border-dashed border-[#020202]/30 lg:block"
          >
            <span className="block p-3 font-v1Label text-[14px] text-[#020202]/40">
              {UNLOCK_DATES[UNLOCK_DATES.length - 1] + i + 1}
            </span>
          </li>
        ))}
      </ol>
    </motion.div>
  );
}
