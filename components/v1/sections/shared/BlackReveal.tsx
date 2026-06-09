"use client";

import { useEffect, useState, type ReactNode } from "react";

import { useReveal } from "@/utils/v1/useReveal";
import { EASE_V1_WIPE } from "@/utils/v1/easings";

/**
 * Drop-in black-paint-then-collapse reveal for any text or image:
 *
 *   <BlackReveal>Some text</BlackReveal>
 *   <BlackReveal><Image src="..." /></BlackReveal>
 *
 * On first scroll-into-view, a black bar paints in from the left
 * over the content position (phase 1), then collapses off to the
 * right revealing the content (phase 2). The wrapped content is
 * pinned at `opacity: 0` until exactly the midpoint of the bar's
 * keyframe (50 % — the moment the bar is fully covering), then
 * snaps to visible via a JS-controlled boolean. No CSS opacity
 * interpolation, so the content never fades in over the paint
 * phase. After the full reveal completes the bar drops out of the
 * DOM and the wrapped content reverts to its natural rendering.
 *
 * Keyframes (`v1QuoteLineReveal`) live in `styles/v1-animations.css`
 * and are shared with the testimonial per-line reveal so multi-
 * line cascades and single-element reveals read with the same
 * vocabulary.
 *
 * `delay` lets callers stagger multiple reveals (e.g. line-by-line
 * or image+caption pairings); duration scales the whole keyframe.
 */
interface BlackRevealProps {
  children: ReactNode;
  /** Animation delay in ms — useful for staggering. */
  delay?: number;
  /** Total keyframe duration in ms. Default 700. */
  duration?: number;
  /** Extra classes on the outer wrapper. Default is
   *  `relative inline-block overflow-hidden`. */
  className?: string;
  /** Render the wrapper as a block-level element. Default inline-
   *  block — keeps text flow correct for inline labels. */
  block?: boolean;
  /** Color of the painting bar. Defaults to near-black (#000) — pass
   *  `"#FFFFFF"` (or any CSS color) for a white-on-dark reveal, etc. */
  fillColor?: string;
}

export function BlackReveal({
  children,
  delay = 0,
  duration = 700,
  className = "",
  block = false,
  fillColor = "#000000",
}: BlackRevealProps) {
  const reveal = useReveal<HTMLSpanElement>({
    rootMargin: "0px 0px -10% 0px",
  });
  const [hasRevealed, setHasRevealed] = useState(false);
  const [contentReady, setContentReady] = useState(false);

  useEffect(() => {
    if (!reveal.visible) return;
    let cancelled = false;
    // Snap content visible at 50 % of the keyframe — the moment the
    // bar is fully covering. After the full duration + a buffer,
    // drop the bar from the DOM.
    const snap = window.setTimeout(
      () => !cancelled && setContentReady(true),
      delay + duration / 2,
    );
    const done = window.setTimeout(
      () => !cancelled && setHasRevealed(true),
      delay + duration + 100,
    );
    return () => {
      cancelled = true;
      window.clearTimeout(snap);
      window.clearTimeout(done);
    };
  }, [reveal.visible, delay, duration]);

  // Outer span sets layout flow (block vs inline-block per the
  // `block` prop). The inner relative span mirrors that — block+full
  // for block reveals (images, full-width slabs) so the wipe covers
  // the whole column; inline-block+max-w-full for inline labels so
  // the bar only covers the actual text width, not the line.
  const outerClass = `${block ? "block" : "inline-block"} ${className}`;
  const innerLayoutClass = block
    ? "relative block w-full overflow-hidden align-baseline"
    : "relative inline-block max-w-full overflow-hidden align-baseline";

  return (
    <span
      ref={reveal.ref}
      className={outerClass}
      // CSS-disable hook: the test pages target this attribute under
      // `[data-wcag-cta]` to skip the paint-bar entirely (children
      // visible immediately, bar hidden). Live pages are unaffected.
      data-v1-paint-reveal=""
    >
      <span className={innerLayoutClass}>
        <span
          className="block"
          style={{
            opacity: hasRevealed || contentReady ? undefined : 0,
          }}
        >
          {children}
        </span>
        {!hasRevealed && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundColor: fillColor,
              transform: reveal.visible ? undefined : "scaleX(0)",
              transformOrigin: "left",
              animation: reveal.visible
                ? `v1QuoteLineReveal ${duration}ms ${EASE_V1_WIPE} ${delay}ms both`
                : undefined,
              willChange: "transform",
            }}
          />
        )}
      </span>
    </span>
  );
}
