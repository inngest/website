"use client";

import { useEffect, useRef, useState } from "react";

const DATA = [
  { label: "Minutes — we have good tracing and can pinpoint fast", n: 49, pct: 38 },
  { label: "Under an hour, but it takes digging",                  n: 70, pct: 54 },
  { label: "Hours — requires significant investigation",           n: 6,  pct: 5  },
  { label: "We often can't fully explain what happened",           n: 5,  pct: 4  },
];

const BAR_COLOR   = "#a8ef3c";
const TRACK_COLOR = "rgba(255,255,255,0.08)";

type TooltipState = { data: typeof DATA[0]; x: number; y: number } | null;

export function ObservabilityChart() {
  const [animated, setAnimated] = useState(false);
  const [hovered, setHovered]   = useState<number | null>(null);
  const [tooltip, setTooltip]   = useState<TooltipState>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setAnimated(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="mt-4 flex flex-col gap-4">
      {DATA.map((d, i) => (
        <div key={d.label} className="flex items-center gap-4">
          <div className="w-56 shrink-0">
            <p className="text-sm font-medium leading-tight text-white"
               style={{ opacity: hovered !== null && hovered !== i ? 0.4 : 1, transition: "opacity 0.15s" }}>
              {d.label}
            </p>
            <p className="mt-0.5 font-mono text-xs text-white/40">n={d.n}</p>
          </div>

          <div
            className="relative flex-1 h-9 cursor-crosshair rounded"
            style={{ background: TRACK_COLOR }}
            onMouseEnter={() => setHovered(i)}
            onMouseMove={(e) => setTooltip({ data: d, x: e.clientX, y: e.clientY })}
            onMouseLeave={() => { setHovered(null); setTooltip(null); }}
          >
            <div
              className="absolute inset-y-0 left-0 rounded"
              style={{
                background: BAR_COLOR,
                width: animated ? `${d.pct}%` : "0%",
                transition: `width 0.7s cubic-bezier(0.4,0,0.2,1) ${i * 0.08}s`,
                opacity: hovered !== null && hovered !== i ? 0.3 : 1,
                filter: hovered === i ? "brightness(1.25)" : "none",
              }}
            />
          </div>
        </div>
      ))}

      {tooltip && (
        <div
          className="pointer-events-none fixed z-50 rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 shadow-xl"
          style={{ left: tooltip.x + 14, top: tooltip.y - 40 }}
        >
          <p className="text-sm font-bold text-white">{tooltip.data.pct}%</p>
          <p className="font-mono text-xs text-white/50">n = {tooltip.data.n}</p>
        </div>
      )}

      <p className="mt-2 font-mono text-xs text-white/40">
        Q5: When a workflow fails in production, how long does it typically take
        to understand what went wrong? All respondents n=130.
      </p>
    </div>
  );
}
