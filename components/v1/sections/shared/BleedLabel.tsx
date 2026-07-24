"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { useRadialBleed } from "@/utils/v1/useRadialBleed";

/**
 * Text-bleed hover effect — same vocabulary as the secondary Button
 * bleed, but the radial gradient is clipped to the text glyphs via
 * `background-clip: text`. On hover, the salmon "paints" into the
 * letterforms from the exact cursor entry point and retracts on
 * leave; outside the bleed radius the base frost colour reads
 * through.
 *
 * Both the salmon fill and the frost base are stacked
 * `background-image` layers on a single span (no DOM duplication),
 * with the salmon radial sitting on top of a flat frost linear-
 * gradient. As `--r` grows the salmon overtakes the frost; on
 * retract, salmon shrinks and the frost re-emerges.
 *
 * Reduced-motion: pointer-leave still snaps r→0 over the hook's
 * 360 ms rAF, but since the gradient itself isn't a CSS transition
 * the effect remains visible. Users who can't see motion still get
 * a clear "this is hoverable" cue.
 */

// Default colours reference v1 design tokens via CSS custom properties
// — never inline hex strings (which silently drift away from the
// token system). Override per-instance via the `baseColor` /
// `fillColor` props if a section needs a different palette.
const SALMON = "rgb(var(--color-v1-salmon-200))";
const BLEED_BASE = "rgb(var(--color-v1-bleed-base))";

export function BleedLabel({
  children,
  className,
  style,
  baseColor = BLEED_BASE,
  fillColor = SALMON,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Base text colour (visible when r = 0). Defaults to v1-frost. */
  baseColor?: string;
  /** Bleed-fill colour (visible inside the growing radius). Defaults
   *  to v1-accent-salmon. */
  fillColor?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const { bleedAt, retract } = useRadialBleed(ref, "transparent");

  // `--v1-bleed-fill` can be set on any ancestor to override the
  // default salmon (e.g. footer sets blue to match the dot sphere).
  // Same for `--v1-bleed-base` if the surrounding text colour ever
  // diverges from frost.
  const backgroundImage =
    `radial-gradient(circle at var(--x, 50%) var(--y, 50%), var(--v1-bleed-fill, ${fillColor}) 0px, var(--v1-bleed-fill, ${fillColor}) var(--r, 0px), transparent var(--r, 0px)),` +
    `linear-gradient(var(--v1-bleed-base, ${baseColor}), var(--v1-bleed-base, ${baseColor}))`;

  return (
    <span
      ref={ref}
      onPointerEnter={(e) => bleedAt(e.clientX, e.clientY)}
      onPointerLeave={() => retract()}
      onFocus={(e) => {
        const r = (e.currentTarget as HTMLSpanElement).getBoundingClientRect();
        bleedAt(r.left + r.width / 2, r.top + r.height / 2);
      }}
      onBlur={() => retract()}
      className={`inline-block ${className ?? ""}`}
      style={{
        ...style,
        color: "transparent",
        WebkitTextFillColor: "transparent",
        backgroundImage,
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
      }}
    >
      {children}
    </span>
  );
}
