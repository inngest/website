"use client";

import { COLORS, LIVESTREAM } from "@/components/v1/sections/TwelveDays/data";
import { useCalendarClock } from "@/components/v1/sections/TwelveDays/useCalendarClock";

/** How long before the start the player replaces the countdown. */
const PLAYER_LEAD_MS = 15 * 60_000;

/** Days, hours and minutes left, rounded up to the next minute. */
function remaining(ms: number) {
  const totalMinutes = Math.max(0, Math.ceil(ms / 60_000));
  return {
    day: Math.floor(totalMinutes / 1440),
    hour: Math.floor((totalMinutes % 1440) / 60),
    minute: totalMinutes % 60,
  };
}

/**
 * The card conveyor animation (a standalone page, so it can run its own
 * loop). It's drawn on a 1536×864 board with a blank white sign hanging
 * at the top; SIGN is that sign's face as a share of the board, so the
 * countdown can sit exactly on it.
 */
const CONVEYOR_SRC = "/assets/v1/12-days/live/card-conveyor.html";
const SIGN = { left: 29.11, top: 3.23, width: 41.8, height: 51.9 };

/**
 * What /12-days-of-workflows/live shows. Before the stream: cards
 * riding a conveyor under a sign with the days, hours and minutes left
 * (on phones, just the sign). From 15 minutes before the start, the YouTube player once
 * `LIVESTREAM.youtubeId` is set; past the start without one, a "going
 * live any second" line. The clock honours `?now=` off production.
 */
export default function LiveStage() {
  const now = useCalendarClock();
  const { live, youtubeId } = LIVESTREAM;
  const start = new Date(LIVESTREAM.start).getTime();
  const left = now ? start - now.getTime() : null;

  if (youtubeId && left !== null && left <= PLAYER_LEAD_MS) {
    return (
      <div className="overflow-hidden rounded-xl border-[3px] border-[#020202] bg-[#020202] shadow-[8px_8px_0_#020202]">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0`}
          title={live.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="aspect-video w-full"
        />
      </div>
    );
  }

  const parts = left !== null ? remaining(left) : null;
  const copy = live.countdown;

  return (
    <div
      className="relative overflow-hidden rounded-xl border-[3px] border-[#020202] text-[#020202] shadow-[8px_8px_0_#020202] sm:aspect-video"
      style={{ backgroundColor: COLORS.salmon }}
    >
      <iframe
        src={CONVEYOR_SRC}
        title=""
        aria-hidden="true"
        tabIndex={-1}
        className="pointer-events-none absolute inset-0 hidden h-full w-full border-0 sm:block"
      />

      {/* The countdown, on the conveyor's sign. On phones it stands alone. */}
      <div
        className="relative flex items-center justify-center p-6 sm:absolute sm:p-0 sm:[height:var(--h)] sm:[left:var(--l)] sm:[top:var(--t)] sm:[width:var(--w)]"
        style={
          {
            "--l": `${SIGN.left}%`,
            "--t": `${SIGN.top}%`,
            "--w": `${SIGN.width}%`,
            "--h": `${SIGN.height}%`,
          } as React.CSSProperties
        }
      >
        <div
          role="timer"
          aria-live="off"
          className="flex w-full flex-col items-center justify-center gap-3 rounded-[20px] border-[#020202] bg-white px-4 py-6 text-center sm:h-full sm:gap-[clamp(4px,0.9vw,12px)] sm:!border-0 sm:bg-transparent sm:py-3"
          style={{
            borderTopWidth: 1.5,
            borderLeftWidth: 1.5,
            borderRightWidth: 7,
            borderBottomWidth: 7,
            borderStyle: "solid",
          }}
        >
          {left !== null && left <= 0 ? (
            <p className="font-sans text-[clamp(20px,2.4vw,30px)] font-black leading-[1.1]">
              {copy.starting}
            </p>
          ) : (
            <>
              <p className="font-v1Label text-[13px] sm:text-[clamp(11px,1.3vw,17px)]">
                {copy.lead}
              </p>
              <div className="flex items-start justify-center gap-[clamp(10px,2vw,28px)]">
                {(["day", "hour", "minute"] as const).map((unit) => {
                  const n = parts ? parts[unit] : null;
                  const [one, many] = copy.units[unit];
                  return (
                    <div key={unit} className="flex flex-col items-center">
                      <span className="font-sans text-[44px] font-black tabular-nums leading-[0.9] tracking-[-0.02em] sm:text-[clamp(32px,5.4vw,72px)]">
                        {n === null ? "–" : n}
                      </span>
                      <span className="font-v1Label text-[12px] sm:text-[clamp(10px,1.2vw,15px)]">
                        {n === 1 ? one : many}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="font-v1Label text-[13px] sm:text-[clamp(11px,1.3vw,17px)]">
                {copy.tail}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
