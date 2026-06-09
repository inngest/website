"use client";

import { type ReactNode } from "react";
import { motion } from "motion/react";

import { useReveal } from "@/utils/v1/useReveal";
import { springs } from "@/utils/v1/springs";

/**
 * Drop-in scroll reveal for paragraphs and other body copy. Subtle
 * Y lift + opacity fade on a `springs.lift` spring — settle reads as
 * confident, not bouncy. Designed to be one-line additive — wrap any
 * paragraph and it lifts in on first scroll-into-view:
 *
 *   <ParaReveal>
 *     <p>Durability that runs on top of existing code…</p>
 *   </ParaReveal>
 *
 * Pair with `delay` (seconds) for stagger when reveals sit close
 * together. The wrapper renders as a `<div>` by default; pass
 * `as="span"` for inline reveals inside flowing text.
 */
interface ParaRevealProps {
  children: ReactNode;
  /** Animation delay in ms (for staggered cascades). */
  delay?: number;
  /** Extra classes forwarded to the wrapper element. */
  className?: string;
  /** Render as a span instead of a div — useful for inline reveals
   *  inside flowing text where a `<div>` would break the line. */
  as?: "div" | "span";
}

export function ParaReveal({
  children,
  delay = 0,
  className,
  as = "div",
}: ParaRevealProps) {
  const { ref, visible } = useReveal<HTMLElement>({
    rootMargin: "0px 0px -10% 0px",
  });

  const animate = { opacity: visible ? 1 : 0, y: visible ? 0 : 16 };
  const transition = { ...springs.lift, delay: delay / 1000 };

  if (as === "span") {
    return (
      <motion.span
        ref={ref as React.RefObject<HTMLSpanElement>}
        className={className}
        initial={false}
        animate={animate}
        transition={transition}
      >
        {children}
      </motion.span>
    );
  }
  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={className}
      initial={false}
      animate={animate}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
