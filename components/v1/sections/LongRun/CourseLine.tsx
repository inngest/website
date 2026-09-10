"use client";

import { motion } from "motion/react";
import { cn } from "@/utils/v1/cn";

/**
 * Decorative line along the bottom of the hero, drawn once on mount. Two
 * variants, because the two markets aren't running the same metaphor.
 *
 * `route` — a stylised trace of the NYC marathon course (Staten Island
 * start, the long Brooklyn straight, the Queens turn, First Avenue north,
 * the Bronx hook, then down into Central Park).
 *
 * `day` — San Francisco, where the campaign is about hours rather than
 * distance. A single day's arc: up through the morning, the long working
 * plateau, then past the point it would normally come back down — it
 * climbs off the right edge instead of landing, because the whole SF
 * argument is that the work doesn't stop at five.
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

// The day. Deliberately gentler than the route — no borough hooks, just a
// morning climb, a long plateau across the working hours, and a final rise
// that leaves the frame rather than resolving.
const DAY =
  "M 20 156 C 120 156 180 120 300 112 C 420 104 480 96 620 94 C 760 92 840 96 980 90 C 1080 86 1140 72 1220 60 C 1300 48 1360 30 1420 16";

const PATHS = { route: ROUTE, day: DAY } as const;

export type CourseLineVariant = keyof typeof PATHS;

export default function CourseLine({
  className,
  drawDurationMs = 2200,
  variant = "route",
}: {
  className?: string;
  /** How long the draw-on takes. Longer reads as "a long run". */
  drawDurationMs?: number;
  /** `route` for the NYC marathon trace, `day` for the SF clock. */
  variant?: CourseLineVariant;
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
        d={PATHS[variant]}
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
