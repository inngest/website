"use client";

import { MotionConfig } from "motion/react";
import { type ReactNode } from "react";

/**
 * Wraps the v1 page tree with a single MotionConfig so every spring
 * downstream honors `prefers-reduced-motion: reduce` automatically —
 * users with the OS setting get instant transitions, no per-component
 * `motion-safe:` plumbing needed for motion-library nodes. CSS-only
 * keyframes still need their own `motion-safe:` gates.
 */
export function MotionRoot({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
