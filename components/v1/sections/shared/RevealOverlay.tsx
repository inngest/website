"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useReveal } from "@/utils/v1/useReveal";
import { cn } from "@/utils/v1/cn";
import { EASE_V1_WIPE } from "@/utils/v1/easings";

/**
 * One-shot black-overlay reveal. Drop into any `relative
 * overflow-hidden` container and it adds an absolute span that
 * starts covering the container and slides off in `direction` once
 * the trigger fires.
 *
 *   trigger="viewport" (default) — IntersectionObserver, one-shot.
 *   trigger="load"               — fires on first paint after mount.
 *
 * Used in: ScaleInstantly dashboard, TestimonialsCarousel portrait,
 * AI Hero cube, Home Hero section. Same visual vocabulary
 * everywhere — black bg, ease-v1-out cubic, ~700 ms.
 */

type Direction = "right" | "left" | "up" | "down";

interface RevealOverlayProps {
  /** Which way the overlay slides off. Defaults to right. */
  direction?: Direction;
  /** ms */
  duration?: number;
  /** ms delay before the slide begins. */
  delay?: number;
  /** Trigger source. */
  trigger?: "viewport" | "load";
  /**
   * Imperative gate — if provided, the slide only fires once this
   * flips true (after `trigger` would otherwise have fired). Useful
   * for "wait until the canvas painted" scenarios (see AI Hero +
   * cubeReady). Defaults to `true` (no gating).
   */
  gate?: boolean;
  /** Z-index. */
  z?: number;
  className?: string;
}

const DIR_TRANSFORM: Record<Direction, { from: string; to: string }> = {
  right: { from: "translateX(0%)", to: "translateX(101%)" },
  left: { from: "translateX(0%)", to: "translateX(-101%)" },
  down: { from: "translateY(0%)", to: "translateY(101%)" },
  up: { from: "translateY(0%)", to: "translateY(-101%)" },
};

export function RevealOverlay({
  direction = "right",
  duration = 700,
  delay = 0,
  trigger = "viewport",
  gate = true,
  z = 30,
  className,
}: RevealOverlayProps) {
  // Load-trigger: flip `loaded` true one rAF after mount so the
  // transition crosses the paint boundary (otherwise the browser
  // can collapse the from-state into the to-state and skip the
  // animation entirely).
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (trigger !== "load") return;
    const r = requestAnimationFrame(() => setLoaded(true));
    return () => cancelAnimationFrame(r);
  }, [trigger]);

  // Viewport trigger uses the shared useReveal hook. The span ref
  // observes itself — when it crosses the bottom 10 % of the
  // viewport, `visible` flips true.
  const reveal = useReveal<HTMLSpanElement>({
    rootMargin: "0px 0px -10% 0px",
  });

  const visible = trigger === "load" ? loaded : reveal.visible;
  const slid = visible && gate;
  const { from, to } = DIR_TRANSFORM[direction];

  const style: CSSProperties = {
    transform: slid ? to : from,
    transition: `transform ${duration}ms ${EASE_V1_WIPE}`,
    transitionDelay: `${delay}ms`,
    willChange: "transform",
  };

  return (
    <span
      ref={trigger === "viewport" ? reveal.ref : undefined}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 bg-black",
        className
      )}
      style={{ ...style, zIndex: z }}
    />
  );
}
