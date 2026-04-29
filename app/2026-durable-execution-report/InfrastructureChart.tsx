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

      <div className="flex flex-col gap-1">
        {DATA.map((d, i) => (
          <div
            key={d.label}
            className="grid items-center gap-3 py-2"
            style={{ gridTemplateColumns: "1fr 2fr auto" }}
          >
            {/* Label */}
            <p
              className="text-sm font-medium leading-tight"
              style={{ color: d.significant ? "white" : "rgba(255,255,255,0.35)" }}
            >
              {d.label}
            </p>

            {/* Bar */}
            <div className="flex items-center gap-2">
              {/* Vertical axis line */}
              <div className="h-9 w-px shrink-0" style={{ background: "rgba(255,255,255,0.15)" }} />
              <div className="relative flex-1 h-9 rounded" style={{ background: "rgba(255,255,255,0.06)" }}>
                <div
                  className="absolute inset-y-0 left-0 flex items-center justify-center rounded text-sm font-bold"
                  style={{
                    background: d.significant ? "#a8ef3c" : "rgba(255,255,255,0.2)",
                    color: d.significant ? "#0c1f10" : "rgba(255,255,255,0.5)",
                    width: animated ? `${(d.net / MAX_NET) * 100}%` : "0%",
                    minWidth: animated ? "52px" : "0px",
                    transition: `width 0.7s cubic-bezier(0.4,0,0.2,1) ${i * 0.07}s, min-width 0.7s cubic-bezier(0.4,0,0.2,1) ${i * 0.07}s`,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  +{d.net}pp
                </div>
              </div>
            </div>

            {/* Stats + badge */}
            <div className="flex items-center gap-3">
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
        ))}
      </div>

      <p className="mt-4 font-mono text-xs text-white/30">
        Net = % confident (n=73) minus % unconfident (n=15). *** p&lt;0.01, ** p&lt;0.05, * p&lt;0.10, ns not significant. Greyed rows shown for context only.
      </p>
    </div>
  );
}
