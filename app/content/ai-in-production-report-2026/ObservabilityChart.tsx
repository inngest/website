"use client";

import { useEffect, useRef, useState } from "react";

const THEMES = [
  "Observability & debugging",
  "Agent state & durability",
  "Non-determinism",
  "Scale, infra & cost",
  "Tooling fragmentation",
  "Evals & output quality",
  "Testing & integration",
  "Unclear / N/A",
];

const ROWS = [
  { label: "Up to 10", n: 47, color: "#FFBAC7", textDark: true },
  { label: "11–50",    n: 40, color: "#FF5234", textDark: false },
  { label: "51–500",   n: 27, color: "#A93020", textDark: false },
  { label: "500+",     n: 16, color: "#5C1A18", textDark: false },
];

const UNCLEAR_COL_INDEX = 7;
const GRAY = "#7a7a7a";

// rows × cols, null = empty cell
const DATA: (number | null)[][] = [
  [9, 12, 2, 7, 3, 4, 3, 7],
  [8, 7, 4, 5, 6, 3, 2, 5],
  [10, 3, 6, 3, 3, null, 1, 1],
  [4, 2, 7, null, 2, 1, null, null],
];

const MAX_VALUE = 12;
const MIN_BUBBLE = 16;
const MAX_BUBBLE = 64;

const sizeFor = (v: number) =>
  MIN_BUBBLE + (MAX_BUBBLE - MIN_BUBBLE) * Math.sqrt(v / MAX_VALUE);

type Hovered = { r: number; c: number } | null;

export function ObservabilityChart() {
  const [animated, setAnimated] = useState(false);
  const [hovered, setHovered] = useState<Hovered>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="mt-4">
      <div className="overflow-x-auto">
        <div className="min-w-[680px]">
          {/* Column headers */}
          <div className="grid grid-cols-[88px_repeat(8,1fr)] gap-x-2 pb-4">
            <div />
            {THEMES.map((theme) => (
              <div
                key={theme}
                className="text-center text-[11px] font-medium leading-tight text-white/70"
              >
                {theme}
              </div>
            ))}
          </div>

          {/* Rows */}
          {ROWS.map((row, r) => (
            <div
              key={row.label}
              className="grid grid-cols-[88px_repeat(8,1fr)] items-center gap-x-2 border-t border-white/5 py-2"
              style={{ minHeight: MAX_BUBBLE + 16 }}
            >
              <div className="flex flex-col text-xs text-white/70">
                <span>{row.label}</span>
                <span className="text-white/30">n={row.n}</span>
              </div>
              {DATA[r].map((value, c) => {
                if (value == null) return <div key={c} />;
                const isUnclear = c === UNCLEAR_COL_INDEX;
                const color = isUnclear ? GRAY : row.color;
                const textColor =
                  isUnclear || row.textDark ? "#0a0a0a" : "#ffffff";
                const isHovered = hovered?.r === r && hovered?.c === c;
                const dim = hovered !== null && !isHovered;
                const size = sizeFor(value);
                return (
                  <div
                    key={c}
                    className="flex items-center justify-center"
                    onMouseEnter={() => setHovered({ r, c })}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => setHovered({ r, c })}
                  >
                    <div
                      className="flex cursor-crosshair items-center justify-center rounded-full"
                      style={{
                        width: animated ? size : 0,
                        height: animated ? size : 0,
                        background: color,
                        opacity: dim ? 0.25 : 1,
                        transform: isHovered ? "scale(1.12)" : "scale(1)",
                        transition: `width 0.6s cubic-bezier(0.4,0,0.2,1) ${
                          r * 0.05 + c * 0.02
                        }s, height 0.6s cubic-bezier(0.4,0,0.2,1) ${
                          r * 0.05 + c * 0.02
                        }s, opacity 0.15s, transform 0.15s`,
                      }}
                    >
                      <span
                        className="text-[11px] font-semibold tabular-nums"
                        style={{ color: textColor }}
                      >
                        {value}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm italic text-white/50">
        19% of responses name observability as the core unsolved problem — the
        highest of any theme, and equal across AI (18%) and non-AI (21%) teams.
      </p>
    </div>
  );
}
