/**
 * Lightweight abstract SVG glyphs for the Durable Execution problem
 * strip. Static stroke geometry + one SMIL-animated spark each — no
 * images, no JS timers. Sparks pause under prefers-reduced-motion.
 */

import type { ReactNode } from "react";

const LINE = "rgb(255 255 255 / 0.32)";
const LINE_DIM = "rgb(255 255 255 / 0.16)";
const SALMON = "rgb(251 85 54)";
const BLUE = "rgb(96 140 255)";
const GREEN = "rgb(11 221 72)";

const STROKE = 1.5;
const STROKE_DIM = 1.25;

function Spark({
  color,
  path,
  dur,
  begin = "0s",
}: {
  color: string;
  path: string;
  dur: string;
  begin?: string;
}) {
  return (
    <g className="de-lifecycle-spark">
      <animateMotion
        dur={dur}
        begin={begin}
        repeatCount="indefinite"
        path={path}
      />
      <circle r="5.5" fill={color} opacity={0.22} />
      <circle r="2.5" fill={color} />
    </g>
  );
}

function GlyphShell({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <svg
      viewBox="0 0 120 100"
      width={160}
      height={133}
      aria-hidden="true"
      className="de-lifecycle-glyph h-auto w-full max-w-[160px]"
    >
      <title>{label}</title>
      {children}
    </svg>
  );
}

function Node({ cx, cy }: { cx: number; cy: number }) {
  return (
    <circle
      cx={cx}
      cy={cy}
      r="3.5"
      fill="rgb(31 31 31)"
      stroke={LINE}
      strokeWidth={STROKE}
    />
  );
}

/**
 * Automatic retries: progress through steps, fail with room to spare,
 * loop back to the last checkpoint, then finish.
 */
export function RetriesGlyph() {
  // Nodes at 18 / 50 / 82; failure X sits further out at ~108.
  const path =
    "M18,50 H50 H82 H100 Q110,50 110,36 Q110,24 96,24 H50 Q38,24 38,50 H82 H112";
  return (
    <GlyphShell label="Automatic retries">
      <path
        d="M18,50 H112"
        fill="none"
        stroke={LINE_DIM}
        strokeWidth={STROKE_DIM}
      />
      <path
        d="M100,50 Q110,50 110,36 Q110,24 96,24 H50 Q38,24 38,50"
        fill="none"
        stroke={LINE}
        strokeWidth={STROKE}
        strokeLinecap="square"
        strokeDasharray="3 3"
      />
      <path
        d="M18,50 H82"
        fill="none"
        stroke={LINE}
        strokeWidth={STROKE}
        strokeLinecap="square"
      />
      <Node cx={18} cy={50} />
      <Node cx={50} cy={50} />
      <Node cx={82} cy={50} />
      {/* Failure mark — spaced clear of the last checkpoint */}
      <path
        d="M104,42 L112,58 M112,42 L104,58"
        stroke={LINE}
        strokeWidth={STROKE}
        strokeLinecap="square"
        opacity={0.7}
      />
      <Spark color={SALMON} path={path} dur="6.5s" />
    </GlyphShell>
  );
}

/** Fan out: one trunk splits into three branches (radial, not L→R only). */
export function FanOutGlyph() {
  const path = "M60,18 V48 L28,88";
  return (
    <GlyphShell label="Fan out events">
      <path
        d="M60,18 V48"
        fill="none"
        stroke={LINE}
        strokeWidth={STROKE}
        strokeLinecap="square"
      />
      <path
        d="M60,48 L28,88"
        fill="none"
        stroke={LINE}
        strokeWidth={STROKE}
        strokeLinecap="square"
      />
      <path
        d="M60,48 L60,90"
        fill="none"
        stroke={LINE}
        strokeWidth={STROKE}
        strokeLinecap="square"
      />
      <path
        d="M60,48 L92,88"
        fill="none"
        stroke={LINE}
        strokeWidth={STROKE}
        strokeLinecap="square"
      />
      <Node cx={60} cy={18} />
      <Node cx={60} cy={48} />
      <g className="de-lifecycle-spark" opacity={0.55}>
        <animateMotion
          dur="6.5s"
          begin="0.8s"
          repeatCount="indefinite"
          path="M60,18 V48 L60,90"
        />
        <circle r="5" fill={BLUE} opacity={0.2} />
        <circle r="2.25" fill={BLUE} />
      </g>
      <g className="de-lifecycle-spark" opacity={0.4}>
        <animateMotion
          dur="6.5s"
          begin="1.6s"
          repeatCount="indefinite"
          path="M60,18 V48 L92,88"
        />
        <circle r="5" fill={BLUE} opacity={0.2} />
        <circle r="2.25" fill={BLUE} />
      </g>
      <Spark color={BLUE} path={path} dur="6.5s" />
    </GlyphShell>
  );
}

/** Isolated clean lane between thrashing neighbors. */
export function NoisyNeighborsGlyph() {
  const path = "M16,50 H104";
  return (
    <GlyphShell label="Solve noisy neighbors">
      <path
        d="M16,28 H36 L44,22 H60 L68,34 H84 L92,26 H104"
        fill="none"
        stroke={LINE}
        strokeWidth={STROKE_DIM}
        strokeDasharray="3 4"
        opacity={0.45}
      />
      <path
        d={path}
        fill="none"
        stroke={LINE}
        strokeWidth={STROKE}
        strokeLinecap="square"
      />
      <path
        d="M16,72 H28 L40,80 H56 L64,66 H80 L90,76 H104"
        fill="none"
        stroke={LINE}
        strokeWidth={STROKE_DIM}
        strokeDasharray="3 4"
        opacity={0.45}
      />
      <Spark color={GREEN} path={path} dur="5s" />
    </GlyphShell>
  );
}

/**
 * Wait: spark arrives at a hold point, dwells there (keyPoints park),
 * then continues. No orbit that reads as “falling off.”
 */
export function WaitGlyph() {
  const path = "M14,50 H60 H106";
  return (
    <GlyphShell label="Wait without polling">
      <path
        d={path}
        fill="none"
        stroke={LINE}
        strokeWidth={STROKE}
        strokeLinecap="square"
      />
      {/* Hold marker */}
      <circle
        cx="60"
        cy="50"
        r="10"
        fill="none"
        stroke={LINE_DIM}
        strokeWidth={STROKE_DIM}
        strokeDasharray="3 3"
      />
      <Node cx={60} cy={50} />
      <g className="de-lifecycle-spark">
        <animateMotion
          dur="7.5s"
          repeatCount="indefinite"
          path={path}
          keyTimes="0;0.22;0.72;1"
          keyPoints="0;0.5;0.5;1"
          calcMode="linear"
        />
        <circle r="5.5" fill={BLUE} opacity={0.22} />
        <circle r="2.5" fill={BLUE} />
      </g>
    </GlyphShell>
  );
}

/**
 * Deep observability: rewind a finished run to the step that failed
 * and inspect what happened.
 */
export function ObservabilityGlyph() {
  // Start at the end of the run, travel back to the failed step, orbit it.
  const path =
    "M108,50 H88 H58 A12,12 0 1,1 57.99,50 A12,12 0 1,1 58,50";
  return (
    <GlyphShell label="Get deep observability">
      <path
        d="M12,50 H108"
        fill="none"
        stroke={LINE_DIM}
        strokeWidth={STROKE_DIM}
      />
      <path
        d="M12,50 H58"
        fill="none"
        stroke={LINE}
        strokeWidth={STROKE}
        strokeLinecap="square"
      />
      <Node cx={20} cy={50} />
      <Node cx={40} cy={50} />
      {/* Failed step */}
      <circle
        cx="58"
        cy="50"
        r="3.5"
        fill="rgb(31 31 31)"
        stroke={SALMON}
        strokeWidth={STROKE}
        opacity={0.9}
      />
      <path
        d="M54,44 L62,56 M62,44 L54,56"
        stroke={SALMON}
        strokeWidth={STROKE}
        strokeLinecap="square"
        opacity={0.85}
      />
      {/* Later steps after the failure (dim) */}
      <Node cx={88} cy={50} />
      <Node cx={108} cy={50} />
      {/* Inspect ring around the failure */}
      <circle
        cx="58"
        cy="50"
        r="12"
        fill="none"
        stroke={LINE}
        strokeWidth={STROKE_DIM}
        strokeDasharray="3 3"
      />
      <Spark color={SALMON} path={path} dur="7s" />
    </GlyphShell>
  );
}

export const LIFECYCLE_GLYPHS = {
  retries: RetriesGlyph,
  "fan-out": FanOutGlyph,
  "noisy-neighbor": NoisyNeighborsGlyph,
  wait: WaitGlyph,
  observability: ObservabilityGlyph,
} as const;

export type LifecycleGlyphId = keyof typeof LIFECYCLE_GLYPHS;
