"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Continuous IntersectionObserver visibility — unlike `useReveal` (which
 * latches `true` once and disconnects), this toggles `inView` every time
 * the element enters or leaves the viewport. The shared basis for
 * "auto-advance only while on screen" across the v1 carousels, so every
 * deck pauses/resumes on the same threshold.
 *
 * Default `rootMargin: "-10% 0px"` requires the element to be meaningfully
 * on screen (not just grazing an edge) before it counts as in view.
 *
 *   const [ref, inView] = useInView<HTMLElement>();
 */
export function useInView<T extends Element>(opts?: {
  rootMargin?: string;
  threshold?: number | number[];
}): [React.RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  const rootMargin = opts?.rootMargin ?? "-10% 0px";
  const threshold = opts?.threshold ?? 0;
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin, threshold },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [rootMargin, threshold]);
  return [ref, inView];
}
