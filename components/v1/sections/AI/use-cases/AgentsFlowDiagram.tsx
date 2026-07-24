"use client";

import { useId } from "react";
import { useAnimatedStep } from "@/components/v1/sections/AI/use-cases/useAnimatedStep";

/**
 * Plan → Tool Call → Evaluate → Complete, drawn as a vertical column
 * of four boxes connected by short dashed arrows. A pair of dashed
 * circular arcs flanks the column on either side, visually
 * suggesting that Complete loops back round to Plan. Coordinates
 * mirror the design frame (238 × 341).
 *
 * Animation: an "active" step cycles through Plan / Tool Call /
 * Evaluate (1.5s each) and the connector leading out of the active
 * node marches its dashes toward the next box. Complete stays green
 * throughout because it represents the success state, not a step in
 * the live loop — the side arcs carry the "loop continues" cue. The
 * interval pauses while the diagram is offscreen so a user scrolling
 * past doesn't return to find it mid-cycle.
 *
 * Reduced-motion users get the static frame; the `v1-agents-march`
 * keyframe collapses to a no-op under
 * `@media (prefers-reduced-motion: reduce)` in styles/v1.css.
 */

const AGENTS_STEP_MS = 1500;
const AGENTS_STEP_COUNT = 3;

// Three connector arrows between (Plan→ToolCall, ToolCall→Evaluate,
// Evaluate→Complete). All three pick up the blue accent when their
// upstream node is the active step — Complete's permanent green is
// applied only to the node itself, not the connectors (the third
// connector is white in static state).
const CONNECTORS = [
  { yTop: 33.89, yBottom: 79.08 },
  { yTop: 131.77, yBottom: 176.96 },
  { yTop: 236.89, yBottom: 282.08 },
];

export const NATURAL_W = 238;
export const NATURAL_H = 341;
const W = NATURAL_W;
const H = NATURAL_H;
// All colors pulled from v1 design tokens (see styles/v1.css). The
// modern `rgb(var(--...) / α)` form lets us layer alpha over the
// space-separated RGB triplets stored in the CSS variables.
const BLUE = "rgb(var(--color-v1-accent-blue))";
const GREEN = "rgb(var(--color-v1-accent-green))";
const WHITE = "rgb(var(--color-v1-frost))";
const INACTIVE = "rgb(var(--color-v1-carbon-200) / 0.6)";
const ARC_WHITE = "rgb(var(--color-v1-frost) / 0.6)";

const CONNECTOR_MARCH = "v1-agents-march 900ms linear infinite";
const ARC_MARCH = "v1-agents-march 2400ms linear infinite";

// Transition applied to <line> and <path> elements that own a
// `stroke`. CSS transitions don't propagate from <g> to descendants,
// so each child element needs this class directly to crossfade the
// connector colour when the active step changes.
const STROKE_TRANSITION =
  "motion-safe:transition-[stroke] motion-safe:duration-300";

export default function AgentsFlowDiagram() {
  const { ref, step, inView } = useAnimatedStep<HTMLDivElement>(
    AGENTS_STEP_COUNT,
    AGENTS_STEP_MS
  );
  // Scope SVG marker IDs to this instance so multiple AgentsFlowDiagrams
  // on the same page don't collide on `url(#agents-arc-white)` etc.
  const uid = useId();
  const arcWhiteMarkerId = `${uid}-arc-white`;
  const arcBlueMarkerId = `${uid}-arc-blue`;

  return (
    <div
      ref={ref}
      className="relative shrink-0"
      style={{ width: W, height: H }}
      aria-hidden="true"
    >
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        className="absolute inset-0 overflow-visible"
      >
        <defs>
          <marker
            id={arcWhiteMarkerId}
            viewBox="0 0 8 8"
            refX="7"
            refY="4"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path
              d="M 0 0 L 8 4 L 0 8"
              fill="none"
              stroke={ARC_WHITE}
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </marker>
          <marker
            id={arcBlueMarkerId}
            viewBox="0 0 8 8"
            refX="7"
            refY="4"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path
              d="M 0 0 L 8 4 L 0 8"
              fill="none"
              stroke={BLUE}
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </marker>
        </defs>

        {/* Circular (not half-elliptical) arcs — the curves are arc
            segments of a large circle (r≈118) whose center sits near
            the column's vertical axis, so the endpoints arrive at an
            angle rather than ending in a horizontal tangent. */}
        <path
          d="M 46 24.65 A 119 119 0 0 0 46 212.13"
          fill="none"
          stroke={ARC_WHITE}
          strokeWidth="1.3"
          strokeDasharray="1.5 4"
          strokeLinecap="round"
          markerEnd={`url(#${arcWhiteMarkerId})`}
          style={inView ? { animation: ARC_MARCH } : undefined}
        />
        <path
          d="M 189 213.64 A 118 118 0 0 0 189 23.13"
          fill="none"
          stroke={BLUE}
          strokeWidth="1.3"
          strokeDasharray="1.5 4"
          strokeLinecap="round"
          markerEnd={`url(#${arcBlueMarkerId})`}
          style={inView ? { animation: ARC_MARCH } : undefined}
        />

        {CONNECTORS.map((c, i) => {
          const isActive = step === i;
          const color = isActive ? BLUE : INACTIVE;
          return (
            <g key={i}>
              <line
                x1={118}
                y1={c.yTop}
                x2={118}
                y2={c.yBottom - 4}
                stroke={color}
                strokeWidth="1.3"
                strokeDasharray="1.5 4"
                strokeLinecap="round"
                className={STROKE_TRANSITION}
                style={isActive ? { animation: CONNECTOR_MARCH } : undefined}
              />
              <path
                d={`M ${118 - 4} ${c.yBottom - 5} L 118 ${c.yBottom} L ${118 + 4} ${c.yBottom - 5}`}
                fill="none"
                stroke={color}
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={STROKE_TRANSITION}
              />
            </g>
          );
        })}
      </svg>

      <FlowNode label="Plan" left={55.98} top={0} active={step === 0} />
      <FlowNode label="Tool Call" left={55.98} top={97.89} active={step === 1} />
      <FlowNode label="Evaluate" left={55.98} top={203.89} active={step === 2} />
      <FlowNode label="Complete" left={56} top={308.89} variant="complete" />
    </div>
  );
}

function FlowNode({
  label,
  left,
  top,
  active,
  variant,
}: {
  label: string;
  left: number;
  top: number;
  active?: boolean;
  variant?: "complete";
}) {
  const isComplete = variant === "complete";
  const color = isComplete ? GREEN : active ? BLUE : WHITE;
  return (
    <div
      className="absolute flex h-[32px] items-center justify-center gap-1.5 rounded-md border px-4 motion-safe:transition-[border-color,color] motion-safe:duration-300"
      style={{
        left,
        top,
        width: 123,
        borderColor: color,
        color,
      }}
    >
      {isComplete ? (
        <span
          aria-hidden="true"
          className="block size-[12px] rounded-full"
          style={{ backgroundColor: GREEN }}
        />
      ) : null}
      <span className="font-v1Mono text-[10px] uppercase leading-[16px] sm:text-[12px]">
        {label}
      </span>
    </div>
  );
}
