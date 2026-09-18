import { MARQUEE } from "@/components/v1/sections/CodeTV/data";

function MarqueeRow({ decorative = false }: { decorative?: boolean }) {
  return (
    <div
      aria-hidden={decorative ? true : undefined}
      className="flex shrink-0"
    >
      {MARQUEE.map((item, i) => (
        <span
          key={`${item}-${i}`}
          className="flex shrink-0 items-center gap-4 px-4 font-v1Label text-[12px] uppercase tracking-[0.08em] sm:text-[13px]"
        >
          <span
            aria-hidden="true"
            className="v1-codetv-pulse size-1.5 rounded-full bg-v1-accent-green"
          />
          {item}
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
