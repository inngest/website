"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Reveal `text` character-by-character. Returns the visible substring
 * and a `done` flag. Used by the Setup and Scale lifecycle graphics.
 *
 * Behaviour:
 * - Respects `prefers-reduced-motion: reduce` — snaps immediately to
 *   the full text instead of animating in.
 * - If a `containerRef` is provided, gates the start on intersection
 *   so users landing mid-page (with the section below the fold) see
 *   the animation play when they scroll to it instead of finishing
 *   silently off-screen. Without a ref, the typewriter starts on mount.
 *
 * The companion keyframes (`v1LifecycleBlink`, `v1LifecycleBarFill`,
 * `v1LifecycleFadeUp`, `v1LifecyclePulse`) live in
 * `styles/v1-animations.css` so they're shipped once per page instead
 * of injected via `<style>` per graphic.
 */
export function useTypewriter(
  text: string,
  speed = 14,
  containerRef?: RefObject<Element | null>
): {
  visible: string;
  done: boolean;
} {
  const [count, setCount] = useState(0);
  const [active, setActive] = useState(!containerRef);

  useEffect(() => {
    if (!containerRef) return;
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActive(true);
            io.disconnect();
            return;
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [containerRef]);

  useEffect(() => {
    if (!active) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) {
      setCount(text.length);
      return;
    }
    setCount(0);
    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      setCount((c) => {
        if (c >= text.length) return c;
        return c + 1;
      });
    };
    const id = window.setInterval(tick, speed);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [text, speed, active]);

  return { visible: text.slice(0, count), done: count >= text.length };
}
