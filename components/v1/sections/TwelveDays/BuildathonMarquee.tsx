import { Fragment } from "react";
import Link from "next/link";
import { BUILDATHON_MARQUEE } from "@/components/v1/sections/TwelveDays/data";

const REPEAT = 4;

function Row({ decorative = false }: { decorative?: boolean }) {
  return (
    <span
      aria-hidden={decorative ? true : undefined}
      className="flex shrink-0 items-center"
    >
      {Array.from({ length: REPEAT }, (_, i) => (
        <Fragment key={i}>
          <span className="shrink-0 px-6">{BUILDATHON_MARQUEE.text}</span>
          <span aria-hidden="true" className="shrink-0 text-[#0BDD48]">
            ✦
          </span>
        </Fragment>
      ))}
    </span>
  );
}

/**
 * A strip between the hero and the calendar that scrolls the build-a-thon
 * pitch across the page, since its own section is far down. The whole
 * strip links to the build-a-thon page; it pauses while hovered or
 * focused, and stands still for reduced motion.
 */
export default function BuildathonMarquee() {
  return (
    <Link
      href={BUILDATHON_MARQUEE.href}
      aria-label={BUILDATHON_MARQUEE.text}
      className="block overflow-hidden border-y-[3px] border-[#010101] bg-[#010101] py-4 font-sans text-[20px] font-black uppercase leading-none tracking-[-0.01em] text-[#ECFE08] focus-visible:outline focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-[#0035F1] sm:text-[26px]"
    >
      <span className="v1-12days-marquee flex w-max">
        <Row />
        <Row decorative />
      </span>
    </Link>
  );
}
