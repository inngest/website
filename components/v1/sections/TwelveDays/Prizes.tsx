"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { reveals } from "@/utils/v1/reveals";
import { COLORS, DAYS, PRIZES } from "@/components/v1/sections/TwelveDays/data";
import {
  POSTER_EYEBROW,
  POSTER_TITLE,
} from "@/components/v1/sections/TwelveDays/poster";

const MILESTONES = [9, 12];

/**
 * Completion rewards, "solid days" style: a twelve-stamp card that
 * fills as lessons are marked done, with the 9 and 12 milestones called
 * out, then what each tier earns.
 */
export default function Prizes({ done }: { done: number[] }) {
  const count = done.length;

  return (
    <section
      aria-labelledby="twelve-days-prizes-heading"
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: COLORS.cream, color: COLORS.ink }}
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-12 px-6 py-16 sm:px-9 sm:py-20 lg:px-8 lg:py-24">
        <div className="flex flex-col gap-5">
          <motion.p {...reveals.body} className={POSTER_EYEBROW}>
            {PRIZES.eyebrow}
          </motion.p>
          <motion.h2
            {...reveals.heading}
            id="twelve-days-prizes-heading"
            className={POSTER_TITLE}
          >
            {PRIZES.title}
          </motion.h2>
        </div>

        {/* Stamp card. */}
        <motion.div
          {...reveals.item(0)}
          className="flex flex-col gap-4 rounded-xl border-[3px] border-[#010101] bg-white p-5 shadow-[6px_6px_0_#010101] sm:p-6"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-v1Label text-[14px] uppercase">
              Your run on this device
            </p>
            <p className="font-sans text-[28px] font-black leading-none">
              {count}/12
            </p>
          </div>
          <ol
            className="grid list-none grid-cols-6 gap-2 pl-0 sm:grid-cols-12"
            aria-label={`${count} of 12 lessons done`}
          >
            {DAYS.map((d) => {
              const isDone = done.includes(d.day);
              const milestone = MILESTONES.includes(d.day);
              return (
                <li
                  key={d.day}
                  className="flex aspect-square list-none items-center justify-center rounded-full border-[3px] border-[#010101] font-v1Label text-[14px]"
                  style={{
                    backgroundColor: isDone
                      ? COLORS.green
                      : milestone
                      ? COLORS.lime
                      : "transparent",
                  }}
                  aria-label={`Lesson ${d.day}${isDone ? ", done" : ""}`}
                >
                  {isDone ? "✓" : d.day}
                </li>
              );
            })}
          </ol>
          <p className="text-[14px] leading-[20px] text-[#010101]/70">
            {PRIZES.signIn}
          </p>
        </motion.div>

        <ul className="grid list-none grid-cols-1 gap-6 pl-0 md:grid-cols-3">
          {PRIZES.items.map((p, i) => (
            <motion.li
              key={p.kicker}
              {...reveals.item(i + 1)}
              className="flex list-none flex-col gap-3 rounded-xl border-[3px] border-[#010101] p-6 shadow-[6px_6px_0_#010101]"
              style={{
                backgroundColor: [COLORS.salmon, COLORS.lime, COLORS.green][i],
              }}
            >
              <p className="font-v1Label text-[14px] uppercase">{p.kicker}</p>
              <h3 className="font-sans text-[32px] font-black uppercase leading-[0.95]">
                {p.title}
              </h3>
              <p className="text-[16px] leading-[24px]">{p.body}</p>
            </motion.li>
          ))}
        </ul>

        {/* The pizza and the hot dog, still running. */}
        <div
          className="overflow-hidden rounded-xl border-[3px] border-[#010101] shadow-[6px_6px_0_#010101]"
          style={{ backgroundColor: COLORS.salmon }}
        >
          <Image
            src="/assets/v1/12-days/pizza-hotdog.webp"
            alt="A pizza slice and a hot dog, both with legs, running."
            width={1320}
            height={550}
            sizes="(max-width: 1440px) 92vw, 1376px"
            className="h-auto w-full"
          />
        </div>
      </div>
    </section>
  );
}
