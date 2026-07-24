"use client";

import { useEffect, useRef, type CSSProperties } from "react";

/**
 * Continuous scroll-coupled reveal — for every element registered via
 * the returned `register` callback, a single rAF-coalesced scroll
 * listener writes a `--reveal` custom property in [0, 1] keyed off
 * the element's own viewport position:
 *
 *   reveal = 0  →  element's top sits at the viewport bottom
 *   reveal = 1  →  element's top has reached ~40 % from the top
 *
 * CSS consumes `--reveal` to interpolate opacity + translateY (see
 * `SCROLL_REVEAL_STYLE`). Reveal REVERSES as you scroll back up — the
 * motion is coupled to the scroll position itself, not a timer.
 *
 * `prefers-reduced-motion` pins every registered element at 1.
 */
export function useScrollReveal() {
  const targets = useRef<Set<HTMLElement>>(new Set());
  const reduceMotion = useRef(false);

  useEffect(() => {
    reduceMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let raf = 0;
    const tick = () => {
      raf = 0;
      const vh = window.innerHeight || 1;
      const startY = vh; // reveal begins when top hits the viewport bottom
      const endY = vh * 0.4; // reveal completes when top hits ~40 % from top
      targets.current.forEach((el) => {
        if (reduceMotion.current) {
          el.style.setProperty("--reveal", "1");
          return;
        }
        const top = el.getBoundingClientRect().top;
        const t = (startY - top) / (startY - endY);
        const clamped = Math.max(0, Math.min(1, t));
        const eased = 1 - Math.pow(1 - clamped, 3); // ease-out cubic
        el.style.setProperty("--reveal", eased.toFixed(4));
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return useRef((el: HTMLElement | null) => {
    if (!el) return;
    targets.current.add(el);
  }).current;
}

/**
 * Inline style that consumes `--reveal` (set by `useScrollReveal`) to
 * drive opacity + a 32 px translateY. Pure transform + opacity →
 * composites on the GPU.
 */
export const SCROLL_REVEAL_STYLE: CSSProperties = {
  opacity: "var(--reveal, 0)",
  transform: "translate3d(0, calc((1 - var(--reveal, 0)) * 32px), 0)",
  willChange: "opacity, transform",
};
