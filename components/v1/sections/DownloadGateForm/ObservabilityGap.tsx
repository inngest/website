"use client";

import { motion } from "motion/react";
import { reveals } from "@/utils/v1/reveals";
import NumberedSection from "@/components/v1/sections/DownloadGateForm/NumberedSection";

export default function ObservabilityGap() {
  return (
    <NumberedSection
      number="02"
      title="The observability gap"
      lead="Observability is the #1 unsolved problem engineers named in the survey."
      body="Even respondents using a mix of third-party and homegrown solutions are spending hours diagnosing failures. The report shows which observability approaches actually correlate with faster recovery."
    >
      <motion.div
        {...reveals.body}
        style={{
          borderColor: "rgb(var(--color-v1-carbon-300) / 0.35)",
          backgroundImage:
            "linear-gradient(295deg, rgba(2, 2, 2, 0.00) 1.46%, #0F0F0F 50.43%)",
          backgroundColor: "rgb(var(--color-v1-jetBlack))",
        }}
        className="mt-8 overflow-hidden rounded-[10px] border px-8 py-6"
      >
        <DotMatrix />
      </motion.div>
    </NumberedSection>
  );
}

function DotMatrix() {
  // Bubble chart: rows = team size bands (with sample counts in
  // n=...), cols = problem categories. Each cell holds an integer
  // (number of responses naming that category) inside a circle.
  // Circle size scales with the number; circle hue darkens by row
  // band — light pink at "Up to 10", deep brown at "500+". The
  // "Unclear / N/A" column gets a gray ramp instead of the salmon
  // family. Empty cells render no circle.
  const COLS = [
    "Observability\n& debugging",
    "Agent state\n& durability",
    "Non-\ndeterminism",
    "Scale, infra\n& cost",
    "Tooling\nfragmentation",
    "Evals & output\nquality",
    "Testing &\nintegration",
    "Unclear / N/A",
  ];
  const ROWS = [
    { label: "Up to 10", n: 47 },
    { label: "11–50", n: 40 },
    { label: "51–500", n: 27 },
    { label: "500+", n: 16 },
  ];

  // null = no respondents → no circle rendered.
  const VALUES: (number | null)[][] = [
    [9, 12, 2, 7, 3, 4, 3, 7],
    [8, 7, 4, 5, 6, 3, 2, 5],
    [10, 3, 6, 3, 3, null, 1, 1],
    [4, 2, 7, null, null, 2, 1, null],
  ];

  // Fill per row: light pink → deep oxblood by team-size band. The
  // "Unclear / N/A" column is a flat neutral grey at every row.
  const ROW_COLORS = ["#FFBAC7", "#FF5234", "#A93020", "#5C1A18"];
  const UNCLEAR_COLOR = "#7A7A7A";

  // Value → circle diameter (px). Roughly linear: 1 → 28px, 12 → 60px.
  const DIAMETER: Record<number, number> = {
    1: 28, 2: 34, 3: 38, 4: 42, 5: 44, 6: 48,
    7: 50, 8: 52, 9: 54, 10: 56, 11: 58, 12: 60,
  };
  const sizeFor = (n: number) => DIAMETER[n] ?? 28;

  return (
    <div className="overflow-x-auto">
      {/* Grid is intrinsically 736px (80px label + 8×82px tracks); it
          fits the card at lg and scrolls only when the viewport is
          narrower. */}
      <div className="min-w-[736px]">
        {/* Header row */}
        <div className="grid grid-cols-[80px_repeat(8,82px)] items-end pb-5">
          <div />
          {COLS.map((c) => (
            <div
              key={c}
              className="whitespace-pre-line text-center text-[9px] leading-[1.35] text-v1-frost/65"
            >
              {c}
            </div>
          ))}
        </div>

        {/* Data rows — fixed 76px row pitch (center-to-center). */}
        <div className="flex flex-col">
          {ROWS.map((row, r) => (
            <div
              key={row.label}
              className="grid h-[76px] grid-cols-[80px_repeat(8,82px)] items-center"
            >
              <div className="flex flex-col">
                <span className="text-[11px] text-v1-frost/65">
                  {row.label}
                </span>
                <span className="text-[9px] text-v1-frost/40">
                  n={row.n}
                </span>
              </div>
              {VALUES[r].map((v, c) => {
                if (v == null) {
                  return <div key={`${r}-${c}`} aria-hidden="true" />;
                }
                const isUnclear = c === COLS.length - 1;
                const color = isUnclear ? UNCLEAR_COLOR : ROW_COLORS[r];
                const size = sizeFor(v);
                // Only the light-pink top row (excluding its grey
                // "Unclear" cell) needs black text; every other fill is
                // dark enough to keep white.
                const isLight = r === 0 && !isUnclear;
                return (
                  <div
                    key={`${r}-${c}`}
                    className="flex items-center justify-center"
                  >
                    <span
                      className={`inline-flex items-center justify-center rounded-full font-semibold ${isLight ? "text-v1-jetBlack" : "text-v1-frost"
                        }`}
                      style={{
                        width: size,
                        height: size,
                        backgroundColor: color,
                        // Fixed ~7px cap height on every bubble, regardless
                        // of diameter — does not scale with size.
                        fontSize: 11,
                        // Soft drop shadow — the bubbles float off the
                        // card with a faint dark halo beneath them.
                        boxShadow: "0 6px 18px rgba(0, 0, 0, 0.45)",
                      }}
                    >
                      {v}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
