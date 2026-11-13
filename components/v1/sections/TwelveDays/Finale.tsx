"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { reveals } from "@/utils/v1/reveals";
import {
  COLORS,
  FINALE,
  LIVESTREAM,
} from "@/components/v1/sections/TwelveDays/data";
import LivestreamForm from "@/components/v1/sections/TwelveDays/LivestreamForm";
import { Chip, POSTER_TITLE } from "@/components/v1/sections/TwelveDays/poster";

/**
 * The finale: a live CodeTV episode building a Rube Goldberg machine
 * out of everything behind the doors, where the build-a-thon winners
 * are picked. The art sits in a YouTube-style player so it's obvious
 * this is a CodeTV stream.
 *
 * TODO: swap the art for Jason's photo inside the player once CodeTV
 * sends one we're cleared to use.
 */
export default function Finale() {
  return (
    <section
      id="finale"
      aria-labelledby="twelve-days-finale-heading"
      className="relative w-full scroll-mt-20 overflow-hidden"
      style={{ backgroundColor: COLORS.salmon, color: COLORS.ink }}
    >
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-12 px-6 py-16 sm:px-9 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)] lg:items-center lg:px-8 lg:py-24">
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
          {/* Registering here adds them to the livestream list: reminders
              and the calendar invite go out from Customer.io. */}
          <motion.div
            {...reveals.body}
            id="register"
            className="flex max-w-[520px] scroll-mt-24 flex-col gap-3"
          >
            <p className="font-v1Label text-[15px]">
              {LIVESTREAM.form.title} · {LIVESTREAM.when}
            </p>
            <LivestreamForm />
          </motion.div>
        </div>

        <motion.div
          {...reveals.item(0)}
          className="mx-auto w-full max-w-[480px]"
        >
          {/* A YouTube-style player: video area, then the title row. */}
          <div className="overflow-hidden rounded-xl border-[3px] border-[#010101] bg-white shadow-[8px_8px_0_#010101]">
            <div className="relative aspect-video overflow-hidden bg-[#F55C50]">
              <Image
                src={FINALE.image}
                alt={FINALE.imageAlt}
                width={1300}
                height={1405}
                sizes="(max-width: 1024px) 480px, 34vw"
                className="absolute left-1/2 top-0 h-auto w-[78%] -translate-x-1/2 -translate-y-[6%]"
              />
              <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded bg-[#FF0000] px-2 py-0.5 font-v1Label text-[12px] font-semibold text-white">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-white"
                />
                {FINALE.player.live}
              </span>
              {/* Play button */}
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 flex h-12 w-[68px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[14px] bg-[#FF0000]"
              >
                <span className="ml-1 block h-0 w-0 border-y-[10px] border-l-[17px] border-y-transparent border-l-white" />
              </span>
            </div>
            <div className="flex items-center gap-3 border-t-[3px] border-[#010101] p-4">
              <span
                aria-hidden="true"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#010101] font-v1Label text-[11px] font-semibold text-[#ECFE08]"
              >
                TV
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="truncate font-sans text-[16px] font-black leading-[1.2]">
                  {FINALE.player.title}
                </span>
                <span className="font-v1Label text-[13px] text-[#010101]/60">
                  {FINALE.player.channel}
                </span>
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
