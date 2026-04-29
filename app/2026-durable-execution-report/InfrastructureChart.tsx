"use client";

import { useEffect, useRef, useState } from "react";

const MAX_NET = 40;

const DATA = [
  { label: "Durable execution + using evals + report declining reliability overhead",                                  net: 36, conf: 49, unconf: 13, significant: true  },
  { label: "Durable execution + using evals",                                                                          net: 33, conf: 60, unconf: 27, significant: true  },
  { label: "Durable execution + using orchestration platform for observability + report declining reliability overhead", net: 34, conf: 47, unconf: 13, significant: true  },
  { label: "Using evals + report under an hour to debug",                                                              net: 32, conf: 32, unconf: 0,  significant: false },
  { label: "Durable execution + report under an hour to debug",                                                        net: 30, conf: 37, unconf: 7,  significant: false },
  { label: "Using orchestration platform for observability + report under an hour to debug",                           net: 27, conf: 27, unconf: 0,  significant: false },
];

type TooltipState = { data: typeof DATA[0]; x: number; y: number } | null;

export function InfrastructureChart() {
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
    <div ref={ref} className="mt-4">
      <p className="mb-4 font-mono text-xs uppercase tracking-widest text-white/40">
        Strongest positive combinations
      </p>

      <div className="flex flex-col gap-3">
        {DATA.map((d, i) => {
          const isHov = hovered === i;
          const dimmed = hovered !== null && !isHov;
          return (
            <div
              key={d.label}
              className="flex flex-col gap-1.5 cursor-crosshair"
              style={{ opacity: dimmed ? 0.35 : 1, transition: "opacity 0.15s" }}
              onMouseEnter={() => setHovered(i)}
              onMouseMove={(e) => setTooltip({ data: d, x: e.clientX, y: e.clientY })}
              onMouseLeave={() => { setHovered(null); setTooltip(null); }}
            >
              <p
                className="text-sm font-medium leading-tight"
                style={{ color: d.significant ? "white" : "rgba(255,255,255,0.4)" }}
              >
                {d.label}
              </p>
              <div className="relative h-2 w-full rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                <div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    background: d.significant ? "#a8ef3c" : "rgba(255,255,255,0.25)",
                    width: animated ? `${(d.net / MAX_NET) * 100}%` : "0%",
                    transition: `width 0.7s cubic-bezier(0.4,0,0.2,1) ${i * 0.07}s`,
                    filter: isHov ? "brightness(1.3)" : "none",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {tooltip && (
        <div
          className="pointer-events-none fixed z-50 rounded-lg border border-white/10 bg-[#111] px-4 py-3 shadow-xl"
          style={{ left: tooltip.x + 16, top: tooltip.y - 80 }}
        >
          <p className="mb-2 text-xs text-white leading-snug max-w-[200px]">{tooltip.data.label}</p>
          <p className="text-2xl font-bold tabular-nums" style={{ color: tooltip.data.significant ? "#a8ef3c" : "rgba(255,255,255,0.5)" }}>
            +{tooltip.data.net}<span className="text-sm font-normal ml-0.5">pp net</span>
          </p>
          <div className="mt-2 flex flex-col gap-0.5 border-t border-white/10 pt-2">
            <div className="flex items-center justify-between gap-6">
              <span className="text-xs text-white/40">Confident</span>
              <span className="font-mono text-xs font-medium text-white/80">{tooltip.data.conf}%</span>
            </div>
            <div className="flex items-center justify-between gap-6">
              <span className="text-xs text-white/40">Unconfident</span>
              <span className="font-mono text-xs text-white/50">{tooltip.data.unconf}%</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
