"use client";

import { useMemo, useEffect, useRef, useState } from "react";
import { scaleBand, scaleLinear } from "@visx/scale";
import { Bar } from "@visx/shape";
import { Group } from "@visx/group";
import { ParentSize } from "@visx/responsive";

const DATA = [
  {
    label: "Minutes — we have good tracing and can pinpoint fast",
    n: 49,
    pct: 38,
  },
  {
    label: "Under an hour, but it takes digging",
    n: 70,
    pct: 54,
  },
  {
    label: "Hours — requires significant investigation",
    n: 6,
    pct: 5,
  },
  {
    label: "We often can't fully explain what happened",
    n: 5,
    pct: 4,
  },
];

const BAR_COLOR = "#a8ef3c";
const TRACK_COLOR = "rgba(255,255,255,0.08)";
const BAR_HEIGHT = 36;
const ROW_GAP = 56;
const LABEL_WIDTH = 260;
const CHART_PADDING = { top: 16, bottom: 16 };

function ObservabilityChartInner({ width }: { width: number }) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setAnimated(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const barWidth = Math.max(width - LABEL_WIDTH - 32, 100);
  const height =
    CHART_PADDING.top +
    DATA.length * BAR_HEIGHT +
    (DATA.length - 1) * (ROW_GAP - BAR_HEIGHT) +
    CHART_PADDING.bottom;

  const xScale = useMemo(
    () => scaleLinear({ domain: [0, 100], range: [0, barWidth] }),
    [barWidth]
  );

  const yScale = useMemo(
    () =>
      scaleBand({
        domain: DATA.map((d) => d.label),
        range: [CHART_PADDING.top, height - CHART_PADDING.bottom],
        padding: 0.45,
      }),
    [height]
  );

  return (
    <div ref={ref} className="w-full">
      <svg width={width} height={height}>
        {DATA.map((d) => {
          const y = yScale(d.label) ?? 0;
          const bh = yScale.bandwidth();
          const fillW = animated ? xScale(d.pct) : 0;

          return (
            <Group key={d.label}>
              {/* Track */}
              <Bar
                x={LABEL_WIDTH}
                y={y}
                width={barWidth}
                height={bh}
                fill={TRACK_COLOR}
                rx={4}
              />
              {/* Fill */}
              <Bar
                x={LABEL_WIDTH}
                y={y}
                width={fillW}
                height={bh}
                fill={BAR_COLOR}
                rx={4}
                style={{ transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)" }}
              />
              {/* Percentage label on bar */}
              <text
                x={LABEL_WIDTH + Math.max(fillW - 12, 8)}
                y={y + bh / 2}
                dominantBaseline="central"
                textAnchor="end"
                fill={d.pct > 10 ? "#0c1f10" : BAR_COLOR}
                fontSize={13}
                fontWeight={700}
                fontFamily="inherit"
              >
                {d.pct}%
              </text>
            </Group>
          );
        })}
      </svg>

      {/* Labels (outside SVG for text wrapping) */}
      <div
        className="pointer-events-none"
        style={{ marginTop: -height, height }}
      >
        {DATA.map((d) => {
          const y = yScale(d.label) ?? 0;
          const bh = yScale.bandwidth();
          return (
            <div
              key={d.label}
              className="absolute flex flex-col justify-center"
              style={{ top: y, height: bh, width: LABEL_WIDTH - 16 }}
            >
              <span className="text-sm font-medium leading-tight text-white">
                {d.label}
              </span>
              <span className="mt-0.5 font-mono text-xs text-white/40">
                n={d.n}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ObservabilityChart() {
  return (
    <div className="rounded-2xl bg-black p-6 md:p-8">
      <h3 className="mb-6 font-whyteInktrap text-2xl font-semibold text-white md:text-3xl">
        Time to understand what went wrong
      </h3>
      <div className="relative">
        <ParentSize>
          {({ width }) =>
            width > 0 ? <ObservabilityChartInner width={width} /> : null
          }
        </ParentSize>
      </div>
      <p className="mt-6 font-mono text-xs text-white/40">
        Q5: When a workflow fails in production, how long does it typically take
        to understand what went wrong? All respondents n=130.
      </p>
    </div>
  );
}
