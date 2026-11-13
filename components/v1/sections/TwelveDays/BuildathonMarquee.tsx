import { Fragment } from "react";
import {
  CALENDAR_ID,
  DAYS,
  TICKER,
  unlockAt,
} from "@/components/v1/sections/TwelveDays/data";
import { formatCountdown } from "@/components/v1/sections/TwelveDays/useCalendarClock";

const REPEAT = 4;

/** What's open and what's next: "Door 3 opens in 2d 04:12:09". */
function status(now: Date | null): string {
  if (!now) return TICKER.idle;
  const next = DAYS.find((d) => unlockAt(d.day).getTime() > now.getTime());
  if (!next) return TICKER.allOpen;
  const wait = formatCountdown(unlockAt(next.day).getTime() - now.getTime());
  return `Door ${next.day} · ${next.primitive} · opens in ${wait}`;
}

function Row({
  text,
  decorative = false,
}: {
  text: string;
  decorative?: boolean;
}) {
  return (
    <span
      aria-hidden={decorative ? true : undefined}
      className="flex shrink-0 items-center"
    >
      {Array.from({ length: REPEAT }, (_, i) => (
        <Fragment key={i}>
          <span className="shrink-0 px-6 tabular-nums">{text}</span>
          <span aria-hidden="true" className="shrink-0 text-[#0BDD48]">
            ✦
          </span>
        </Fragment>
      ))}
    </span>
  );
}

/**
 * The countdown ticker between the hero and the calendar: which door
 * opens next and when, scrolling across the page. Links down to the
 * calendar; pauses while hovered or focused, and stands still for
 * reduced motion. Not a live region, since it ticks every second.
 */
export default function BuildathonMarquee({ now }: { now: Date | null }) {
  const text = status(now);
  return (
    <a
      href={`#${CALENDAR_ID}`}
      aria-label={TICKER.label}
      className="block overflow-hidden border-y-[3px] border-[#010101] bg-[#010101] py-4 font-sans text-[20px] font-black leading-none tracking-[-0.01em] text-[#ECFE08] focus-visible:outline focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-[#0035F1] sm:text-[26px]"
    >
      <span className="v1-12days-marquee flex w-max">
        <Row text={text} />
        <Row text={text} decorative />
      </span>
    </a>
  );
}
