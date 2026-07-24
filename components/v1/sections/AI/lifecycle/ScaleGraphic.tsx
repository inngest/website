"use client";

/**
 * Scale tab graphic — flow-control legend + createFunction code
 * snippet showing concurrency / throttle / priority knobs. The code
 * types itself out on mount with a blinking caret at the tail.
 */

import { useRef } from "react";
import { useTypewriter } from "@/components/v1/sections/AI/lifecycle/lifecycleFx";

const LEGEND = [
  { label: "Concurrency Keys", color: "#FFFFFF" },
  { label: "Throttle by period", color: "#A6E3A1" },
  { label: "Priority queueing", color: "#FFD580" },
  { label: "Per-step cost tracking", color: "#9CC4FF" },
  { label: "Insights SQL", color: "#FF9CB6" },
];

const CODE = `createFunction({
  concurrency: { limit: 5, key: 'event.data.userId' },
  throttle:    { limit: 100, period: '1m' },
  priority:    { run: 'event.data.plan == "pro"' }
}); // no custom rate-limit code required`;

export default function ScaleGraphic() {
  const ref = useRef<HTMLDivElement>(null);
  const { visible, done } = useTypewriter(CODE, 12, ref);
  return (
    <div
      ref={ref}
      role="img"
      aria-label="Flow-control configuration with concurrency, throttle, and priority knobs"
      className="relative h-full w-full overflow-hidden bg-gradient-to-r from-[#070707] via-[#0a0a0a]/95 to-transparent"
      style={{ aspectRatio: "1600 / 1293" }}
    >
      {/* Legend row */}
      <div className="absolute inset-x-[7%] top-[28%] flex flex-wrap items-center gap-x-[18px] gap-y-2">
        {LEGEND.map((l, i) => (
          <span
            key={l.label}
            className="v1-lc-fade-up flex items-center gap-1.5 font-v1Mono uppercase text-v1-frost/85"
            style={{
              fontSize: "clamp(12px, 1.55cqw, 15px)",
              animation: `v1LifecycleFadeUp 500ms ease-out ${i * 90}ms both`,
            }}
          >
            <span
              aria-hidden="true"
              className="block"
              style={{
                width: "min(8px, 0.65cqw)",
                height: "min(8px, 0.65cqw)",
                backgroundColor: l.color,
              }}
            />
            {l.label}
          </span>
        ))}
      </div>

      {/* Code snippet — typewriter on mount, colorised on completion. */}
      <pre
        className="absolute inset-x-[7%] top-[44%] font-v1Mono leading-[1.6] text-v1-frost/85"
        style={{ fontSize: "clamp(13px, 1.7cqw, 17px)" }}
      >
        {done ? <ColorizedCode /> : visible}
        {!done && (
          <span
            aria-hidden="true"
            className="ml-0.5 inline-block align-[-2px] bg-v1-frost/85"
            style={{
              width: "0.55em",
              height: "1em",
              animation: "v1LifecycleBlink 1s steps(2) infinite",
            }}
          />
        )}
      </pre>
    </div>
  );
}

function ColorizedCode() {
  return (
    <>
      {"createFunction({"}
      {"\n  concurrency: { limit: "}
      <span className="text-[#FFD580]">5</span>
      {", key: "}
      <span className="text-[#A6E3A1]">{"'event.data.userId'"}</span>
      {" },"}
      {"\n  throttle:    { limit: "}
      <span className="text-[#FFD580]">100</span>
      {", period: "}
      <span className="text-[#A6E3A1]">{"'1m'"}</span>
      {" },"}
      {"\n  priority:    { run: "}
      <span className="text-[#A6E3A1]">{"'event.data.plan == \"pro\"'"}</span>
      {" }"}
      {"\n}); // no custom rate-limit code required"}
    </>
  );
}
