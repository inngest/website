/**
 * Shared bits for painting a 1-2 px gradient-stroke ring as an
 * overlay child. Used by `GradientFrame` (rounded-md panels) and
 * `Chip` (rounded-full pills); any future surface with the same
 * "Gradient Stroke" style should reuse this rather than
 * re-stating the mask gymnastics.
 *
 * Usage:
 *   <span aria-hidden style={{ background: GRADIENT_RING_FILL, ...GRADIENT_RING_MASK }}
 *     className="pointer-events-none absolute inset-0 rounded-full p-[1px]" />
 *
 * The padding sets the ring thickness; the mask-composite then
 * subtracts the inner content-box from the full padding-box so only
 * the padding band paints, behaving like a real `border` (whatever
 * sits behind shows through if the surface fill has alpha).
 */

const C300 = "var(--color-v1-carbon-300)";

// Shared stops — same `#7C7C7C` ramp used everywhere the
// "Gradient Stroke" style appears (ring border, horizontal dividers
// inside cards, code-block header rule, …). Keep in sync; if a
// downstream surface needs a different opacity ramp, add a new
// constant rather than forking these. Stops match the source
// SVG's linearGradient defs verbatim.
const RING_STOPS = `rgb(${C300} / 0.35) 0%, rgb(${C300} / 0.55) 32%, rgb(${C300} / 0.02) 72%, rgb(${C300} / 0.5) 100%`;
const RING_STOPS_HOVER = `rgb(${C300} / 0.8) 0%, rgb(${C300} / 1) 32%, rgb(${C300} / 0.35) 72%, rgb(${C300} / 1) 100%`;
const DIVIDER_STOPS = `rgb(${C300} / 0.35) 0%, rgb(${C300} / 0.55) 31.73%, rgb(${C300} / 0.02) 71.64%, rgb(${C300} / 0.5) 100%`;

export const GRADIENT_RING_FILL = `linear-gradient(135deg, ${RING_STOPS})`;
/** Brighter variant of `GRADIENT_RING_FILL` for hover/active states.
 *  Same 135° angle + stop positions, opacity ramped up so the ring
 *  reads as "lit". Use anywhere the default ring fades in to a
 *  highlighted state so the two stay in lockstep. */
export const GRADIENT_RING_FILL_HOVER = `linear-gradient(135deg, ${RING_STOPS_HOVER})`;

/** In-card horizontal divider rule — `121deg` matches the source
 *  gradient vector (atan(289 / 476) ≈ 31° below horizontal),
 *  so the rule reads as a true horizontal slice of the same gradient
 *  the surrounding GradientFrame ring paints. Apply to a 1-px-tall
 *  `<div>` (e.g. between a card's photo area and its meta strip,
 *  between a code-block's header and its body). */
export const GRADIENT_DIVIDER_FILL = `linear-gradient(121deg, ${DIVIDER_STOPS})`;

// `no-repeat` is required — without it some engines tile the
// degenerate mask gradient and the ring breaks on the top/left
// edges.
export const GRADIENT_RING_MASK = {
  WebkitMask:
    "linear-gradient(black, black) content-box, linear-gradient(black, black)",
  WebkitMaskComposite: "xor",
  WebkitMaskRepeat: "no-repeat",
  mask: "linear-gradient(black, black) content-box, linear-gradient(black, black)",
  maskComposite: "exclude",
  maskRepeat: "no-repeat",
} as const;
