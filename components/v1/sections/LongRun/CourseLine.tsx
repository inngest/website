"use client";

import { motion } from "motion/react";
import { cn } from "@/utils/v1/cn";

/**
 * Decorative marathon course line — a stylised trace of the NYC route
 * (Staten Island start, the long Brooklyn straight, the Queens turn, First
 * Avenue north, the Bronx hook, then down into Central Park), drawn once
 * on mount.
 *
 * Purely ornamental: `aria-hidden`, no markers, no labels. The legible
 * version of the course is the Course section's route strip, which is real
 * text. Reduced motion is handled centrally by PageShell's
 * `<MotionConfig reducedMotion="user">` — the path just appears drawn.
 */

// Traced against the real course shape rather than an abstract squiggle:
// the Verrazzano rise, the long Brooklyn run north, the kink into Queens,
// the Queensboro crossing, First Avenue, the Bronx hook, and the final
// bend into the park.
const ROUTE =
  "M 20 150 C 90 150 120 108 190 104 C 300 98 360 118 470 110 C 560 104 610 74 700 78 C 760 81 790 118 850 116 C 920 114 950 62 1010 58 C 1060 55 1085 84 1130 80 C 1200 74 1230 34 1300 30 L 1420 30";

export default function CourseLine({
  className,
  drawDurationMs = 2200,
}: {
  className?: string;
  /** How long the draw-on takes. Longer reads as "a long run". */
  drawDurationMs?: number;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 176"
      // The trace stretches to fill whatever band it's given — fine for a
      // single stroke, and `non-scaling-stroke` keeps it a true 2px at any
      // aspect so the line never smears. (Anything with a *shape* — dots,
      // markers — would distort here, which is why there are none.)
      preserveAspectRatio="none"
      className={cn("w-full", className)}
    >
      <motion.path
        d={ROUTE}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          duration: drawDurationMs / 1000,
          ease: [0.22, 1, 0.36, 1],
        }}
      />
    </svg>
  );
}
