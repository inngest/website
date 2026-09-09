import { MARQUEE } from "@/components/v1/sections/CodeTV/data";

export default function Marquee() {
  const items = [...MARQUEE, ...MARQUEE];

  return (
    <div className="relative overflow-hidden border-y border-v1-subtle bg-v1-accent-salmon py-3 text-v1-frost">
      <div className="v1-codetv-marquee flex w-max gap-0">
        {items.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex shrink-0 items-center gap-4 px-4 font-v1Label text-[12px] uppercase tracking-[0.08em] sm:text-[13px]"
          >
            <span aria-hidden="true" className="text-v1-frost/50">
              ●
            </span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
