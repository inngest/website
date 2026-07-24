"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { V1_CYCLE_MS } from "@/utils/v1/springs";

/**
 * The carousel "reel" engine shared by the redesign's tab-driven
 * carousels (/ai + /webhooks-events UseCases and /observability
 * FullObservability). It owns the parts those sections had each
 * re-implemented identically:
 *
 *   • active index + "user took control" latch (a click/chevron stops
 *     auto-advance permanently),
 *   • an IntersectionObserver in-view gate so an offscreen section
 *     never burns the interval,
 *   • the auto-advance interval itself — gated on inView,
 *     !userTookControl, reduced-motion, and a pause counter,
 *   • a hover/focus pause counter (rows call pause()/resume() so the
 *     reel holds while the cursor rests on one).
 *
 * Layout, illustrations, chevrons (ArrowPreviewButton) and any
 * scroll-into-view behaviour stay with the individual sections — this
 * hook is deliberately headless.
 */
export interface ReelCarousel {
  /** Active item index. */
  active: number;
  /** Raw setter — set the active index without latching control. */
  setActive: (i: number) => void;
  /** User selection: jump to `i` and stop auto-advancing. */
  select: (i: number) => void;
  /** Advance one step (wraps); latches control. */
  next: () => void;
  /** Step back one (wraps); latches control. */
  prev: () => void;
  /** True while the section is on screen. */
  inView: boolean;
  /** True once the user has clicked a row/chevron. */
  userTookControl: boolean;
  /** Convenience: auto-advancing right now (inView && !userTookControl). */
  cycling: boolean;
  /** Attach to the section element for the in-view gate. */
  sectionRef: RefObject<HTMLElement | null>;
  /** Hold the reel (e.g. pointer entered a row). Re-entrant. */
  pause: () => void;
  /** Release a hold from a prior pause(). Re-entrant. */
  resume: () => void;
}

interface Options {
  /** ms between auto-advances. Defaults to the shared V1 cycle. */
  cycleMs?: number;
  rootMargin?: string;
  threshold?: number;
}

export function useReelCarousel(
  count: number,
  {
    cycleMs = V1_CYCLE_MS,
    rootMargin = "0px 0px -10% 0px",
    threshold = 0.15,
  }: Options = {}
): ReelCarousel {
  const [active, setActive] = useState(0);
  const [userTookControl, setUserTookControl] = useState(false);
  const [inView, setInView] = useState(false);
  // Re-entrant hold counter: each hovered/focused row adds one; the
  // interval skips a tick whenever it's > 0.
  const pauseRef = useRef(0);
  const sectionRef = useRef<HTMLElement | null>(null);

  // IO gate — don't cycle while offscreen.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) setInView(e.isIntersecting);
      },
      { rootMargin, threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, threshold]);

  // Auto-advance. Gated on inView + !userTookControl + !reduceMotion,
  // and skips ticks while a pause hold is active.
  useEffect(() => {
    if (!inView || userTookControl || count <= 1) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (pauseRef.current > 0) return;
      setActive((a) => (a + 1) % count);
    }, cycleMs);
    return () => window.clearInterval(id);
  }, [inView, userTookControl, count, cycleMs]);

  const select = (i: number) => {
    setActive(i);
    setUserTookControl(true);
  };
  const next = () => {
    setUserTookControl(true);
    setActive((a) => (a + 1) % count);
  };
  const prev = () => {
    setUserTookControl(true);
    setActive((a) => (a - 1 + count) % count);
  };
  const pause = () => {
    pauseRef.current += 1;
  };
  const resume = () => {
    pauseRef.current = Math.max(0, pauseRef.current - 1);
  };

  return {
    active,
    setActive,
    select,
    next,
    prev,
    inView,
    userTookControl,
    cycling: inView && !userTookControl,
    sectionRef,
    pause,
    resume,
  };
}
