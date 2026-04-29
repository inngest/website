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

export function ObservabilityChart() {
  const [animated, setAnimated] = useState(false);
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
          {/* Label */}
          <div className="w-56 shrink-0">
            <p className="text-sm font-medium leading-tight text-white">{d.label}</p>
            <p className="mt-0.5 font-mono text-xs text-white/40">n={d.n}</p>
          </div>

          {/* Bar track + fill */}
          <div className="relative flex-1 h-9 rounded" style={{ background: TRACK_COLOR }}>
            <div
              className="absolute inset-y-0 left-0 flex items-center rounded"
              style={{
                background: BAR_COLOR,
                width: animated ? `${d.pct}%` : "0%",
                transition: `width 0.7s cubic-bezier(0.4,0,0.2,1) ${i * 0.08}s`,
              }}
            />
            <span
              className="absolute inset-y-0 flex items-center px-3 text-sm font-bold"
              style={{
                left: animated ? `${d.pct}%` : "0%",
                transform: "translateX(-100%)",
                color: d.pct > 8 ? "#0c1f10" : BAR_COLOR,
                transition: `left 0.7s cubic-bezier(0.4,0,0.2,1) ${i * 0.08}s`,
              }}
            >
              {d.pct}%
            </span>
          </div>
        </div>
      ))}

      <p className="mt-2 font-mono text-xs text-white/40">
        Q5: When a workflow fails in production, how long does it typically take
        to understand what went wrong? All respondents n=130.
      </p>
    </div>
  );
}
