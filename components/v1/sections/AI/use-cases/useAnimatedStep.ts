"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * Cycles a step counter 0..stepCount-1 on a fixed interval, but only
 * while the referenced element is in view. Returns the current step and
 * the ref to attach to the diagram's root so the IntersectionObserver
 * has something to watch.
 *
 * Used by per-use-case diagrams (AgentsFlowDiagram, MultiStepLLMDiagram)
 * which both want the same "advance a state machine while visible,
 * pause off-screen" behaviour without a fresh copy of the IO + interval
 * boilerplate.
 */
export function useAnimatedStep<T extends HTMLElement = HTMLDivElement>(
  stepCount: number,
  stepMs: number
): { ref: RefObject<T | null>; step: number; inView: boolean } {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "-10% 0px" }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const id = window.setInterval(
      () => setStep((s) => (s + 1) % stepCount),
      stepMs
    );
    return () => window.clearInterval(id);
  }, [inView, stepCount, stepMs]);

  return { ref, step, inView };
}
