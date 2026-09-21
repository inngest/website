import {
  CHALLENGE_STATUS_LEAD,
  CHALLENGE_STATUS_REST,
} from "@/components/v1/sections/CodeTV/data";

const REPEAT = 6;

function MarqueeRow({ decorative = false }: { decorative?: boolean }) {
  return (
    <div aria-hidden={decorative ? true : undefined} className="flex shrink-0">
      {Array.from({ length: REPEAT }, (_, i) => (
        <span
          key={i}
          className="flex shrink-0 items-center gap-3 px-5 font-v1Label text-[12px] uppercase tracking-[0.08em] sm:text-[13px]"
        >
          {CHALLENGE_STATUS_LEAD}
          <span
            aria-hidden="true"
            className="v1-codetv-pulse size-1.5 shrink-0 rounded-full bg-v1-accent-green"
          />
          {CHALLENGE_STATUS_REST}
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <div className="relative overflow-hidden border-y border-v1-subtle bg-v1-accent-salmon py-3 text-v1-frost">
      <div className="v1-codetv-marquee flex w-max">
        <MarqueeRow />
        <MarqueeRow decorative />
      </div>
    </div>
  );
}
