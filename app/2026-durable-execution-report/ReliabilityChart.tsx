"use client";

import { useMemo, useEffect, useRef, useState } from "react";
import { scaleBand, scaleLinear } from "@visx/scale";
import { Bar } from "@visx/shape";
import { Group } from "@visx/group";
import { GridRows } from "@visx/grid";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { ParentSize } from "@visx/responsive";

const DATA = [
  { band: "Less than 10%", ai: 32, noAi: 43, aiN: 28, noAiN: 18 },
  { band: "10–25%",        ai: 48, noAi: 45, aiN: 42, noAiN: 19 },
  { band: "26–50%",        ai: 20, noAi: 10, aiN: 18, noAiN: 4  },
  { band: "51–75%",        ai: 0,  noAi: 2,  aiN: 0,  noAiN: 1  },
];

const AI_COLOR   = "#a8ef3c";
const NOAI_COLOR = "rgba(168,239,60,0.35)";
const GRID_COLOR = "rgba(255,255,255,0.08)";
const AXIS_COLOR = "rgba(255,255,255,0.2)";
const LABEL_COLOR = "rgba(255,255,255,0.5)";

const MARGIN = { top: 24, right: 16, bottom: 48, left: 44 };

function ReliabilityChartInner({ width }: { width: number }) {
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

  const height = 320;
  const innerWidth  = width  - MARGIN.left - MARGIN.right;
  const innerHeight = height - MARGIN.top  - MARGIN.bottom;

  const xBand = useMemo(
    () => scaleBand({ domain: DATA.map((d) => d.band), range: [0, innerWidth], padding: 0.3 }),
    [innerWidth]
  );

  const xGroup = useMemo(
    () => scaleBand({ domain: ["ai", "noAi"], range: [0, xBand.bandwidth()], padding: 0.12 }),
    [xBand]
  );

  const yScale = useMemo(
    () => scaleLinear({ domain: [0, 55], range: [innerHeight, 0], nice: true }),
    [innerHeight]
  );

  const barW = xGroup.bandwidth();

  return (
    <div ref={ref}>
      <svg width={width} height={height}>
        <Group left={MARGIN.left} top={MARGIN.top}>
          <GridRows
            scale={yScale}
            width={innerWidth}
            stroke={GRID_COLOR}
            strokeDasharray="4,4"
            numTicks={5}
          />

          {DATA.map((d) => {
            const x0 = xBand(d.band) ?? 0;
            const aiH   = animated ? innerHeight - yScale(d.ai)   : 0;
            const noAiH = animated ? innerHeight - yScale(d.noAi) : 0;

            return (
              <Group key={d.band} left={x0}>
                {/* AI bar */}
                <Bar
                  x={xGroup("ai") ?? 0}
                  y={yScale(d.ai)}
                  width={barW}
                  height={aiH}
                  fill={AI_COLOR}
                  rx={3}
                  style={{ transition: "height 0.7s cubic-bezier(0.4,0,0.2,1), y 0.7s cubic-bezier(0.4,0,0.2,1)" }}
                />
                {/* No-AI bar */}
                <Bar
                  x={xGroup("noAi") ?? 0}
                  y={yScale(d.noAi)}
                  width={barW}
                  height={noAiH}
                  fill={NOAI_COLOR}
                  rx={3}
                  style={{ transition: "height 0.7s cubic-bezier(0.4,0,0.2,1) 0.1s, y 0.7s cubic-bezier(0.4,0,0.2,1) 0.1s" }}
                />
                {/* Value labels */}
                {d.ai > 0 && (
                  <text
                    x={(xGroup("ai") ?? 0) + barW / 2}
                    y={yScale(d.ai) - 6}
                    textAnchor="middle"
                    fill={AI_COLOR}
                    fontSize={11}
                    fontWeight={700}
                    fontFamily="inherit"
                  >
                    {d.ai}%
                  </text>
                )}
                {d.noAi > 0 && (
                  <text
                    x={(xGroup("noAi") ?? 0) + barW / 2}
                    y={yScale(d.noAi) - 6}
                    textAnchor="middle"
                    fill="rgba(168,239,60,0.7)"
                    fontSize={11}
                    fontWeight={700}
                    fontFamily="inherit"
                  >
                    {d.noAi}%
                  </text>
                )}
              </Group>
            );
          })}

          <AxisBottom
            top={innerHeight}
            scale={xBand}
            stroke={AXIS_COLOR}
            tickStroke="transparent"
            tickLabelProps={{ fill: LABEL_COLOR, fontSize: 12, textAnchor: "middle", fontFamily: "inherit" }}
          />
          <AxisLeft
            scale={yScale}
            stroke="transparent"
            tickStroke="transparent"
            numTicks={5}
            tickFormat={(v) => `${v}%`}
            tickLabelProps={{ fill: LABEL_COLOR, fontSize: 11, textAnchor: "end", dx: -4, fontFamily: "inherit" }}
          />
        </Group>
      </svg>
    </div>
  );
}

export function ReliabilityChart() {
  return (
    <div className="mt-4">
      {/* Legend */}
      <div className="mb-4 flex flex-wrap gap-6">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm" style={{ background: AI_COLOR }} />
          <span className="text-xs text-white/70">AI in production (n=88)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm" style={{ background: NOAI_COLOR }} />
          <span className="text-xs text-white/70">No AI in production (n=42)</span>
        </div>
      </div>
      <ParentSize>
        {({ width }) =>
          width > 0 ? <ReliabilityChartInner width={width} /> : null
        }
      </ParentSize>
      <p className="mt-3 font-mono text-xs text-white/40">
        Q8: Roughly what share of your team's engineering time goes to reliability
        work rather than shipping new features? % of each group in each band.
      </p>
    </div>
  );
}
