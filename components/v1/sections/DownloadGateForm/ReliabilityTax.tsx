"use client";

import { motion } from "motion/react";
import { reveals } from "@/utils/v1/reveals";
import GradientFrame from "@/components/v1/sections/shared/GradientFrame";
import NumberedSection from "@/components/v1/sections/DownloadGateForm/NumberedSection";

export default function ReliabilityTax() {
  return (
    <NumberedSection
      number="03"
      title="The reliability tax"
      lead="20% of AI teams spend up to half their engineering time on reliability work."
      body="That's twice the rate of non-AI teams. And for most, the burden is growing. Our report identifies which orchestration approaches correlate with lower — and higher — reliability burden."
    >
      <motion.div {...reveals.body} className="mt-8">
        <GradientFrame
          variant="black"
          className="rounded-[10px]"
          innerClassName="px-8 py-6"
        >
          <BarChart />
        </GradientFrame>
      </motion.div>
      <motion.p
        {...reveals.body}
        className="mt-8 text-v1-body-sm-loose italic text-v1-frost"
      >
        AI teams are twice as likely to be in the 26–50% band (20% vs.
        10%). Non-AI teams are more likely to be lean — 43% spending
        less than 10% vs. 32% of AI teams.
      </motion.p>
    </NumberedSection>
  );
}

function BarChart() {
  // Per the mock: 4 bands, two bars each (AI in production = pale
  // frost-blue, No AI in production = saturated indigo). Y-axis 0–50%.
  const BANDS = [
    { label: "Less than 10%", ai: 32, nonAi: 43 },
    { label: "10–25%", ai: 47, nonAi: 45 },
    { label: "26–50%", ai: 20, nonAi: 10 },
    { label: "51–75%", ai: 1, nonAi: 2 },
  ];
  const max = 50;
  const AI_FILL = "#DCE6FF";
  const NON_AI_FILL = "#5C7AE6";

  // Compressed vertical layout: shorter plot area so the chart sits
  // closer to the design's height. Plot spans y=30 (50%) to y=230 (0%)
  // — a 200px band — with band labels just below.
  const PLOT_H = 200;
  const BASE_Y = 230;

  return (
    <div>
      <div className="mb-6 flex items-center gap-5">
        <Legend swatch={AI_FILL} label="AI in production" />
        <Legend swatch={NON_AI_FILL} label="No AI in production" />
      </div>
      <svg
        viewBox="0 0 700 265"
        aria-hidden="true"
        className="h-auto w-full"
      >
        {/* Horizontal dashed gridlines at every 10% step */}
        {[0, 10, 20, 30, 40, 50].map((v) => {
          const y = BASE_Y - (v / max) * PLOT_H;
          return (
            <g key={v}>
              <line
                x1="60"
                x2="690"
                y1={y}
                y2={y}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1"
                strokeDasharray="2 4"
              />
              <text
                x="48"
                y={y + 4}
                textAnchor="end"
                fill="rgba(232,232,232,0.55)"
                fontSize="11"
              >
                {v}%
              </text>
            </g>
          );
        })}
        {BANDS.map((b, i) => {
          const groupX = 95 + i * 150;
          const aiH = (b.ai / max) * PLOT_H;
          const nonH = (b.nonAi / max) * PLOT_H;
          const baseY = BASE_Y;
          return (
            <g key={b.label}>
              <rect
                x={groupX}
                y={baseY - aiH}
                width="48"
                height={aiH}
                fill={AI_FILL}
                rx="2"
              />
              <rect
                x={groupX + 54}
                y={baseY - nonH}
                width="48"
                height={nonH}
                fill={NON_AI_FILL}
                rx="2"
              />
              <text
                x={groupX + 51}
                y={BASE_Y + 25}
                textAnchor="middle"
                fill="rgba(232,232,232,0.7)"
                fontSize="12"
              >
                {b.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 font-v1Label text-[10px] font-semibold uppercase tracking-[0.06em] text-v1-frost/75">
      <span
        aria-hidden="true"
        className="block size-3 rounded-sm"
        style={{ backgroundColor: swatch }}
      />
      {label}
    </span>
  );
}
