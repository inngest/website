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

type HoveredBar = { band: string; type: "ai" | "noAi" } | null;
type TooltipState = { band: string; type: "ai" | "noAi"; x: number; y: number } | null;

function ReliabilityChartInner({ width, onTooltip, onHide, hovered }: {
  width: number;
  onTooltip: (band: string, type: "ai" | "noAi", x: number, y: number) => void;
  onHide: () => void;
  hovered: HoveredBar;
}) {
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
      <svg width={width} height={height} style={{ cursor: "crosshair" }}>
        <Group left={MARGIN.left} top={MARGIN.top}>
          <GridRows scale={yScale} width={innerWidth} stroke={GRID_COLOR} strokeDasharray="4,4" numTicks={5} />

          {DATA.map((d) => {
            const x0    = xBand(d.band) ?? 0;
            const aiH   = animated ? innerHeight - yScale(d.ai)   : 0;
            const noAiH = animated ? innerHeight - yScale(d.noAi) : 0;
            const aiHov   = hovered?.band === d.band && hovered?.type === "ai";
            const noAiHov = hovered?.band === d.band && hovered?.type === "noAi";

            return (
              <Group key={d.band} left={x0}>
                <Bar
                  x={xGroup("ai") ?? 0} y={yScale(d.ai)} width={barW} height={aiH} fill={AI_COLOR} rx={3}
                  onMouseEnter={(e) => onTooltip(d.band, "ai", e.clientX, e.clientY)}
                  onMouseMove={(e)  => onTooltip(d.band, "ai", e.clientX, e.clientY)}
                  onMouseLeave={onHide}
                  style={{
                    opacity: hovered && !aiHov ? 0.25 : 1,
                    filter: aiHov ? "brightness(1.2)" : "none",
                    transition: "height 0.7s cubic-bezier(0.4,0,0.2,1), opacity 0.15s, filter 0.15s",
                    cursor: "crosshair",
                  }}
                />
                <Bar
                  x={xGroup("noAi") ?? 0} y={yScale(d.noAi)} width={barW} height={noAiH} fill={NOAI_COLOR} rx={3}
                  onMouseEnter={(e) => onTooltip(d.band, "noAi", e.clientX, e.clientY)}
                  onMouseMove={(e)  => onTooltip(d.band, "noAi", e.clientX, e.clientY)}
                  onMouseLeave={onHide}
                  style={{
                    opacity: hovered && !noAiHov ? 0.25 : 1,
                    filter: noAiHov ? "brightness(1.4)" : "none",
                    transition: "height 0.7s cubic-bezier(0.4,0,0.2,1) 0.1s, opacity 0.15s, filter 0.15s",
                    cursor: "crosshair",
                  }}
                />
              </Group>
            );
          })}

          <AxisBottom top={innerHeight} scale={xBand} stroke={AXIS_COLOR} tickStroke="transparent"
            tickLabelProps={{ fill: LABEL_COLOR, fontSize: 12, textAnchor: "middle", fontFamily: "inherit" }} />
          <AxisLeft scale={yScale} stroke="transparent" tickStroke="transparent" numTicks={5}
            tickFormat={(v) => `${v}%`}
            tickLabelProps={{ fill: LABEL_COLOR, fontSize: 11, textAnchor: "end", dx: -4, fontFamily: "inherit" }} />
        </Group>
      </svg>
    </div>
  );
}

export function ReliabilityChart() {
  const [hovered, setHovered] = useState<HoveredBar>(null);
  const [tooltip, setTooltip] = useState<TooltipState>(null);

  const showTooltip = (band: string, type: "ai" | "noAi", x: number, y: number) => {
    setHovered({ band, type });
    setTooltip({ band, type, x, y });
  };
  const hideTooltip = () => { setHovered(null); setTooltip(null); };

  const tooltipData = tooltip ? DATA.find((d) => d.band === tooltip.band) : null;
  const isAi = tooltip?.type === "ai";

  return (
    <div className="relative mt-4">
      <div className="mb-4 flex flex-wrap gap-6">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm" style={{ background: AI_COLOR }} />
          <span className="text-xs text-white/70">AI in production</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm" style={{ background: NOAI_COLOR }} />
          <span className="text-xs text-white/70">No AI in production</span>
        </div>
      </div>

      <ParentSize>
        {({ width }) =>
          width > 0 ? (
            <ReliabilityChartInner
              width={width}
              onTooltip={showTooltip}
              onHide={hideTooltip}
              hovered={hovered}
            />
          ) : null
        }
      </ParentSize>

      {tooltip && tooltipData && (
        <div
          className="pointer-events-none fixed z-50 rounded-lg border border-white/10 bg-[#111] px-4 py-3 shadow-xl"
          style={{ left: tooltip.x + 16, top: tooltip.y - 80 }}
        >
          <p className="mb-0.5 text-xs text-white/40">{tooltipData.band}</p>
          <p className="mb-2 text-xs font-medium" style={{ color: isAi ? AI_COLOR : "rgba(255,255,255,0.5)" }}>
            {isAi ? "AI in production" : "No AI in production"}
          </p>
          <p className="text-3xl font-bold tabular-nums" style={{ color: isAi ? AI_COLOR : "white" }}>
            {isAi ? tooltipData.ai : tooltipData.noAi}
            <span className="text-base font-normal text-white/40">%</span>
          </p>
          <p className="mt-1 font-mono text-xs text-white/30">
            n = {isAi ? tooltipData.aiN : tooltipData.noAiN}
          </p>
        </div>
      )}

      <p className="mt-4 text-sm italic text-white/50">
        AI teams are twice as likely to be in the 26–50% band (20% vs. 10%).
        Non-AI teams are more likely to be lean — 43% spending less than 10% vs. 32% of AI teams.
      </p>
    </div>
  );
}
