import { type CSSProperties, type ReactNode } from "react";

/**
 * Nav-text label that fills with the salmon brand colour from left to
 * right on hover (instead of the radial-from-cursor `BleedLabel`).
 * Pure CSS — two stacked `background-image` gradients (salmon on top,
 * frost base underneath), `background-clip: text` clips the paint to
 * the letterforms, hover animates the salmon's `background-size` from
 * 0 % to 100 % width. Same trick as `.v1-hyperlink` but for the fill
 * instead of the underline.
 *
 * Triggers on `:hover` / `:focus-visible` of the nearest anchor or
 * button ancestor, so the wipe fires when the user hovers anywhere in
 * the surrounding nav cell — not just over the glyphs themselves.
 */
export function WipeLabel({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      className={`v1-wipe-label inline-block ${className ?? ""}`.trim()}
      style={style}
    >
      {children}
    </span>
  );
}
