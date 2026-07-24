"use client";

import { motion } from "motion/react";
import { reveals } from "@/utils/v1/reveals";
import GradientFrame from "@/components/v1/sections/shared/GradientFrame";
import NumberedSection from "@/components/v1/sections/DownloadGateForm/NumberedSection";

export default function ConfidentTeams() {
  const STRONG = [
    { text: "Durable execution + using evals + report declining reliability overhead", weight: 0.85 },
    { text: "Durable execution + using orchestration platform for observability + report declining reliability overhead", weight: 0.98 },
    { text: "Durable execution + using evals", weight: 0.45 },
    { text: "Using evals + report under an hour to debug", weight: 0.65 },
    { text: "Durable execution + report under an hour to debug", weight: 0.6 },
    { text: "Using orchestration platform for observability + report under an hour to debug", weight: 0.55 },
  ];

  // The last editorial section adds the 120px gap below the column
  // before the full-bleed "Get the full report" band.
  return (
    <NumberedSection
      number="04"
      title="What separates confident teams"
      lead="Three infrastructure layers separate confident AI teams from the rest."
      body="What separates the most confident AI teams isn't bigger budgets or bigger teams — it's tighter integration between three infrastructure layers: orchestration that persists state and handles failures, observability that lives inside the workflow, and evals connected to where things actually break. When those layers share context, confidence follows."
      className="pb-[120px]"
    >
      <motion.div {...reveals.body} className="mt-8">
        <GradientFrame
          variant="black"
          className="rounded-[10px]"
          innerClassName="px-8 py-7"
        >
          <p className="font-v1Label text-[11px] font-semibold uppercase tracking-[0.1em] text-v1-frost/55">
            Strongest positive combinations
          </p>
          <ul className="mt-3 flex list-none flex-col gap-2.5 pl-0">
            {STRONG.map((s, i) => {
              const isGreen = i < 3;
              return (
                <li key={i} className="list-none">
                  <p
                    className={`text-[14px] leading-[1.4] ${isGreen ? "text-v1-frost" : "text-v1-frost/55"
                      }`}
                  >
                    {s.text}
                  </p>
                  <div className="relative mt-1 h-[6px] w-full overflow-hidden rounded-full bg-v1-frost/[0.08]">
                    <span
                      aria-hidden="true"
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{
                        width: `${s.weight * 100}%`,
                        backgroundColor: isGreen ? "#ABE039" : "#5C5C5C",
                      }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </GradientFrame>
      </motion.div>
      <motion.p
        {...reveals.body}
        className="mt-8 text-v1-body-sm-loose italic text-v1-frost"
      >
        The full report breaks down these combinations by team size
        with complete chart data and statistical significance.
      </motion.p>
    </NumberedSection>
  );
}
