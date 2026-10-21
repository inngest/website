"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { reveals } from "@/utils/v1/reveals";
import {
  COLORS,
  DAYS,
  SONG,
  unlockAt,
} from "@/components/v1/sections/TwelveDays/data";
import {
  POSTER_EYEBROW,
  POSTER_TITLE,
} from "@/components/v1/sections/TwelveDays/poster";

const ORDINALS = [
  "first",
  "second",
  "third",
  "fourth",
  "fifth",
  "sixth",
  "seventh",
  "eighth",
  "ninth",
  "tenth",
  "eleventh",
  "twelfth",
];

/**
 * The cumulative verse for the latest open day, counting back down to
 * day one, the way the song goes. Only sings what's been unlocked.
 * "Sing it" runs a karaoke pass, lighting each line in turn.
 */
export default function SongSoFar({ now }: { now: Date | null }) {
  const open = now
    ? DAYS.filter((d) => unlockAt(d.day).getTime() <= now.getTime())
    : [];
  const latest = open.length;
  // Index of the line being sung, or null when not singing. Line -1 is
  // the "On the Nth day…" intro.
  const [singing, setSinging] = useState<number | null>(null);

  useEffect(() => {
    if (singing === null) return;
    if (singing >= latest) {
      const id = window.setTimeout(() => setSinging(null), 900);
      return () => window.clearTimeout(id);
    }
    const id = window.setTimeout(
      () => setSinging((n) => (n === null ? null : n + 1)),
      singing === -1 ? 1400 : 750
    );
    return () => window.clearTimeout(id);
  }, [singing, latest]);

  const lit = (i: number) =>
    singing === null ? null : singing === i ? "on" : "off";

  return (
    <section
      aria-labelledby="twelve-days-song-heading"
      className="relative w-full"
      style={{ backgroundColor: COLORS.lime, color: COLORS.ink }}
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 py-16 sm:px-9 sm:py-20 lg:px-8 lg:py-24">
        <motion.p {...reveals.body} className={POSTER_EYEBROW}>
          {SONG.eyebrow}
        </motion.p>

        {/* Holds its space before the clock mounts. */}
        <div className="min-h-[120px]">
          {now === null ? null : latest === 0 ? (
            <h2 id="twelve-days-song-heading" className={POSTER_TITLE}>
              The first verse drops December 1.
            </h2>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setSinging(singing === null ? -1 : null)}
                className="mb-6 rounded-full border-[3px] border-[#010101] bg-white px-5 py-2.5 font-v1Label text-[14px] uppercase shadow-[4px_4px_0_#010101] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
              >
                {singing === null ? "🎤 Sing it" : "■ Stop"}
              </button>
              <h2
                id="twelve-days-song-heading"
                className="font-v1Label text-[clamp(22px,3.4vw,40px)] uppercase leading-[1.1] transition-opacity duration-200"
                style={{ opacity: lit(-1) === "off" ? 0.3 : 1 }}
              >
                On the {ORDINALS[latest - 1]} day of workflows, Inngest gave to
                me:
              </h2>
              <ol className="mt-8 flex list-none flex-col gap-1 pl-0">
                {open
                  .slice()
                  .reverse()
                  .map((d, i) => (
                    <motion.li
                      key={d.day}
                      animate={
                        lit(i) === "on"
                          ? { opacity: 1, scale: 1.04, x: 12 }
                          : lit(i) === "off"
                          ? { opacity: 0.3, scale: 1, x: 0 }
                          : { opacity: 1, scale: 1, x: 0 }
                      }
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                      style={{ transformOrigin: "left center" }}
                      className={
                        "font-sans font-black uppercase leading-[0.95] tracking-[-0.02em] " +
                        (i === 0
                          ? "text-[clamp(36px,6vw,80px)]"
                          : "text-[clamp(22px,3vw,40px)]")
                      }
                    >
                      {latest > 1 && d.day === 1
                        ? `And ${d.gift.charAt(0).toLowerCase()}${d.gift.slice(
                            1
                          )}.`
                        : `${d.gift}${d.day === 1 ? "." : ","}`}
                    </motion.li>
                  ))}
              </ol>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
