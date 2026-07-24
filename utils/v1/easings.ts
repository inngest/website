/**
 * Named cubic-bezier easing curves used across the v1 redesign.
 *
 * Why this file exists: per-property CSS `transition:` shorthands
 * have to be authored as inline strings (you can't apply a Tailwind
 * easing class to a single `transition-[opacity, border-radius]`
 * channel). Without a shared module, the same curve gets pasted into
 * every consumer and drifts.
 *
 * CSS keyframe definitions in `styles/v1-animations.css` keep their
 * curves inline — they can't import from JS.
 */

/**
 * v1's standard ease-in/out for interactive transitions. Same shape
 * as Tailwind's `ease-v1-in` utility (see `tailwind.config.js`); use
 * this constant when authoring per-property transitions inline.
 */
export const EASE_V1_IN = "cubic-bezier(0.22, 0.61, 0.27, 1)";

/**
 * Paint-collapse / wipe curve. A sharp accelerate-into-the-middle,
 * decelerate-out shape used by every left-to-right bar reveal
 * (BlackReveal, TestimonialsCarousel paint, RevealOverlay, etc.) so
 * those wipes all read with the same physical grammar.
 */
export const EASE_V1_WIPE = "cubic-bezier(0.7, 0, 0.15, 1)";

/**
 * Same wipe curve as `EASE_V1_WIPE`, but expressed as the 4-tuple
 * control points that `motion/react`'s `transition.ease` expects.
 * Keep the values bit-identical to `EASE_V1_WIPE` so a tuning
 * change lands in both consumers at once.
 */
export const EASE_V1_WIPE_BEZIER = [0.7, 0, 0.15, 1] as const;

/**
 * Long-tail expo-out used by motion's `tweens.entry` for scripted
 * entrance cadences (hero word reveals, line cascades). Inline this
 * constant when authoring per-property CSS animations that need to
 * settle in the same shape as the motion-driven entries.
 */
export const EASE_V1_ENTRY = "cubic-bezier(0.16, 1, 0.3, 1)";
