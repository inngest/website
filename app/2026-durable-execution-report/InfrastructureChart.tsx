"use client";

import { useEffect, useRef, useState } from "react";

const MAX_NET = 40;

const DATA = [
  { label: "Durable execution + evals + low burden",                net: 36, conf: 49, unconf: 13, sig: "**",  significant: true  },
  { label: "Durable execution + evals",                             net: 33, conf: 60, unconf: 27, sig: "**",  significant: true  },
  { label: "Evals + fast debug",                                    net: 32, conf: 32, unconf: 0,  sig: "***", significant: true  },
  { label: "Durable execution + orch-native insights + low burden",  net: 34, conf: 47, unconf: 13, sig: "ns",  significant: false },
  { label: "Durable execution + fast debug",                        net: 30, conf: 37, unconf: 7,  sig: "ns",  significant: false },
  { label: "Orch-native insights + fast debug",                     net: 27, conf: 27, unconf: 0,  sig: "ns",  significant: false },
];

type TooltipState = { data: typeof DATA[0]; x: number; y: number } | null;

function SigBadge({ sig, significant }: { sig: string; significant: boolean }) {
  if (!significant) {
    return (
      <span className="inline-flex items-center rounded px-2 py-0.5 font-mono text-xs text-white/40" style={{ background: "rgba(255,255,255,0.08)" }}>
        ns
      </span>
    );
  }
  const stars = sig === "***" ? 3 : 2;
  return (
    <span className="inline-flex items-center gap-0.5 rounded px-2 py-0.5" style={{ background: "rgba(168,239,60,0.15)" }}>
      {Array.from({ length: stars }).map((_, i) => (
        <svg key={i} width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M5 1l1.12 2.27L8.5 3.6l-1.75 1.7.41 2.4L5 6.5 2.84 7.7l.41-2.4L1.5 3.6l2.38-.33L5 1z" stroke="#a8ef3c" strokeWidth="0.8" strokeLinejoin="round" />
        </svg>
      ))}
    </span>
  );
}

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
              {/* Label row */}
              <div className="flex items-center justify-between gap-4">
                <p
                  className="text-sm font-medium leading-tight"
                  style={{ color: d.significant ? "white" : "rgba(255,255,255,0.4)" }}
                >
                  {d.label}
                </p>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <p className="font-mono text-xs font-medium" style={{ color: d.significant ? "#a8ef3c" : "rgba(255,255,255,0.3)" }}>
                      {d.conf}% conf
                    </p>
                    <p className="font-mono text-xs text-white/30">
                      {String(d.unconf).padStart(2, "0")}% unconf
                    </p>
                  </div>
                  <SigBadge sig={d.sig} significant={d.significant} />
                </div>
              </div>

              {/* Bar */}
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
          className="pointer-events-none fixed z-50 rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 shadow-xl"
          style={{ left: tooltip.x + 14, top: tooltip.y - 64 }}
        >
          <p className="mb-1 font-mono text-xs text-white/40 leading-snug max-w-[220px]">{tooltip.data.label}</p>
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-bold" style={{ color: "#a8ef3c" }}>
              Net +{tooltip.data.net}pp
            </p>
            <p className="font-mono text-xs text-white/60">
              {tooltip.data.conf}% confident · {tooltip.data.unconf}% unconfident
            </p>
            <p className="font-mono text-xs text-white/40">
              sig: {tooltip.data.sig}
            </p>
          </div>
        </div>
      )}

      <p className="mt-4 font-mono text-xs text-white/30">
        Net = % confident (n=73) minus % unconfident (n=15). *** p&lt;0.01, ** p&lt;0.05, * p&lt;0.10, ns not significant. Greyed rows shown for context only.
      </p>
    </div>
  );
}
