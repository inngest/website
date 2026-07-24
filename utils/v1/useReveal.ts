"use client";

import { useEffect, useRef, useState } from "react";

/**
 * One-shot IntersectionObserver reveal. Sets `visible = true` the
 * first time `ref` crosses the viewport (with a slight bottom
 * margin so the reveal lands before the element fully enters), then
 * disconnects so it never re-fires.
 *
 * Used by section grids that want a single staggered fade-in on
 * entry rather than the scroll-coupled `useScrollReveal`.
 */
export function useReveal<T extends Element>(opts?: {
  rootMargin?: string;
  threshold?: number;
}) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
            break;
          }
        }
      },
      {
        rootMargin: opts?.rootMargin ?? "0px 0px -10% 0px",
        threshold: opts?.threshold ?? 0.12,
      }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [opts?.rootMargin, opts?.threshold]);
  return { ref, visible };
}
