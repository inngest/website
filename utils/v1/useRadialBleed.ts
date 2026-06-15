"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";

/**
 * Animates a radial-gradient bleed that expands from a cursor point
 * to cover the element. Used by Button (secondary variant) and
 * BleedLabel for the salmon-paint hover effect.
 *
 * Writes `--x`, `--y`, `--r` to the element so the gradient lives
 * in `background-image` (reaches into the border area, no ring
 * artifact). `bleedAt(clientX, clientY)` starts; `retract()` reverses.
 */
const EASE_OUT_CUBIC = (t: number) => 1 - Math.pow(1 - t, 3);
const DURATION_MS = 360;

export function useRadialBleed(
  elRef: RefObject<HTMLElement | null>,
  fillColor: string
) {
  const rafRef = useRef(0);
  const radiusRef = useRef(0);
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const animate = useCallback(
    (targetR: number) => {
      const el = elRef.current;
      if (!el) return;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      const fromR = radiusRef.current;
      const startTime = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - startTime) / DURATION_MS);
        const r = fromR + (targetR - fromR) * EASE_OUT_CUBIC(t);
        radiusRef.current = r;
        el.style.setProperty("--r", `${r}px`);
        if (t < 1) {
          rafRef.current = requestAnimationFrame(step);
        } else {
          rafRef.current = 0;
        }
      };
      rafRef.current = requestAnimationFrame(step);
    },
    [elRef]
  );

  const bleedAt = useCallback(
    (clientX: number, clientY: number) => {
      const el = elRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      el.style.setProperty("--x", `${x}px`);
      el.style.setProperty("--y", `${y}px`);
      // maxR — distance from origin to farthest corner. Guarantees
      // the gradient reaches every pixel of the element regardless
      // of where the bleed starts (inside or outside the box).
      const maxR = Math.max(
        Math.hypot(x, y),
        Math.hypot(rect.width - x, y),
        Math.hypot(x, rect.height - y),
        Math.hypot(rect.width - x, rect.height - y)
      );
      setFilled(true);
      animate(maxR);
    },
    [elRef, animate]
  );

  const retract = useCallback(() => {
    setFilled(false);
    animate(0);
  }, [animate]);

  const bleedStyle: CSSProperties = {
    backgroundImage: `radial-gradient(circle at var(--x, 50%) var(--y, 50%), ${fillColor} 0px, ${fillColor} var(--r, 0px), transparent var(--r, 0px))`,
    backgroundOrigin: "border-box",
    backgroundClip: "border-box",
  };

  return { filled, bleedStyle, bleedAt, retract };
}
