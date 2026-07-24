"use client";

import { useAnimatedStep } from "@/components/v1/sections/AI/use-cases/useAnimatedStep";

/**
 * Multi-step LLM diagram — six labeled rows representing the lifecycle
 * of a multi-step Inngest function: EVENT triggers a chain of three
 * `step.ai.infer` calls plus a final `step.run("save")`, ending in
 * DONE. Each row pairs a right-aligned label with a small 5-cell
 * "step strip" (a thin rectangle divided into 5 segments, each holding
 * a filled square) and dashed vertical connectors run between strips.
 *
 * Animation: the four process rows (extract → summarize → classify →
 * save) take turns being "active" (1.5s each). The active row's strip,
 * dots and label turn green; the connector below it marches its
 * dashes downward. EVENT stays white (it's a trigger, not a step) and
 * DONE stays green (terminal state) — mirroring how the agents
 * diagram treats Plan/Complete. The cycle pauses while offscreen.
 *
 * Reduced-motion users get the static frame because the shared
 * `v1-agents-march` keyframe in styles/v1.css collapses to a no-op
 * under `prefers-reduced-motion: reduce`.
 *
 * Coordinates mirror the design frame (334 × 385).
 */

const STEP_MS = 1500;
const STEP_COUNT = 4;

export const NATURAL_W = 334;
export const NATURAL_H = 385;
const W = NATURAL_W;
const H = NATURAL_H;

// Strip geometry. Six rows of strips at 73px vertical pitch; each
// strip is 100.8 × 18.4. Five cells inside each strip, separated by
// four vertical dividers at the offsets listed below.
const STRIP_X = 233;
const STRIP_W = 100.8;
const STRIP_H = 18.4;
const STRIP_TOPS = [0, 73, 146, 219, 292, 366];

// Divider x-offsets inside a strip (4 verticals → 5 cells).
const DIVIDER_X = [20.15, 40.3, 60.46, 80.61];
// Dot x-offsets inside a strip (top-left of each 3.7px dot).
const DOT_X = [8.94, 29.22, 49.51, 69.79, 88.23];
const DOT_SIZE = 3.7;
const DOT_Y = (STRIP_H - DOT_SIZE) / 2; // vertical center inside strip

// Five connectors between the six strips. Each is a 58px-tall dashed
// vertical line centered horizontally inside the strip column.
const CONNECTOR_X = STRIP_X + STRIP_W / 2; // 283.4
const CONNECTOR_TOPS = [17, 90, 163, 236, 310];
const CONNECTOR_LEN = 58;

// Labels per row. Index 0 = EVENT (trigger), indices 1–4 = process
// steps that cycle, index 5 = DONE (terminal).
const ROW_LABELS = [
  "EVENT",
  'step.ai.infer("extract")',
  'step.run("summarize")',
  'step.ai.infer("classify")',
  'step.run("save")',
  "DONE",
];

const GREEN = "rgb(var(--color-v1-accent-green))";
const WHITE = "rgb(var(--color-v1-frost))";

const CONNECTOR_MARCH = "v1-agents-march 900ms linear infinite";

// Stroke transitions don't propagate from <g> to its children, so we
// apply this class directly to each <rect>, <path>, and <line> so the
// crossfade between white/green renders smoothly.
const STROKE_TRANSITION =
  "motion-safe:transition-[stroke,fill] motion-safe:duration-300";

export default function MultiStepLLMDiagram() {
  const { ref, step } = useAnimatedStep<HTMLDivElement>(STEP_COUNT, STEP_MS);

  // Row `i` is "active green" when: it's the currently-cycling process
  // step (i = step + 1), or it's the DONE row (always green). Otherwise
  // the row stays white (EVENT and not-yet/already-run process rows).
  const isRowGreen = (i: number) => i === step + 1 || i === 5;

  return (
    <div
      ref={ref}
      className="relative shrink-0"
      style={{ width: W, height: H }}
      aria-hidden="true"
    >
      {/* Right-aligned label column. Each label sits vertically
          centered against its row's strip (y = strip-top + strip-H/2).
          Width 224 ends just left of the strip column (8px gap). */}
      {ROW_LABELS.map((label, i) => {
        const top = STRIP_TOPS[i] + STRIP_H / 2;
        const green = isRowGreen(i);
        return (
          <div
            key={i}
            className="absolute right-[110px] -translate-y-1/2 whitespace-nowrap text-right font-v1Mono text-[10px] leading-[1.5] motion-safe:transition-colors motion-safe:duration-300 sm:text-[14px]"
            style={{ top, color: green ? GREEN : WHITE }}
          >
            {label}
          </div>
        );
      })}

      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        className="absolute inset-0 overflow-visible"
      >
        {/* Connector `i` sits between row `i` and row `i + 1`. It
            turns green + marches while the row above it is the active
            cycling step. The save → DONE connector (i = 4) also stays
            green statically because DONE is green. */}
        {CONNECTOR_TOPS.map((y, i) => {
          const isActive = i === step + 1;
          const green = isActive || i === 4;
          return (
            <line
              key={i}
              x1={CONNECTOR_X}
              y1={y}
              x2={CONNECTOR_X}
              y2={y + CONNECTOR_LEN}
              stroke={green ? GREEN : WHITE}
              strokeWidth="1"
              strokeDasharray="1.5 4"
              strokeLinecap="round"
              className={STROKE_TRANSITION}
              style={isActive ? { animation: CONNECTOR_MARCH } : undefined}
            />
          );
        })}

        {/* Strips — outline rect + 4 vertical dividers + 5 filled dots. */}
        {STRIP_TOPS.map((y, i) => {
          const green = isRowGreen(i);
          const color = green ? GREEN : WHITE;
          return (
            <g key={i}>
              <rect
                x={STRIP_X + 0.5}
                y={y + 0.5}
                width={STRIP_W - 1}
                height={STRIP_H - 1}
                fill="none"
                stroke={color}
                strokeWidth="1"
                className={STROKE_TRANSITION}
              />
              {DIVIDER_X.map((dx, j) => (
                <line
                  key={j}
                  x1={STRIP_X + dx}
                  y1={y}
                  x2={STRIP_X + dx}
                  y2={y + STRIP_H}
                  stroke={color}
                  strokeWidth="1"
                  className={STROKE_TRANSITION}
                />
              ))}
              {DOT_X.map((dx, j) => (
                <rect
                  key={j}
                  x={STRIP_X + dx}
                  y={y + DOT_Y}
                  width={DOT_SIZE}
                  height={DOT_SIZE}
                  fill={color}
                  className={STROKE_TRANSITION}
                />
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
