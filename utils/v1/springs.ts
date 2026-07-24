import { type SpringOptions, type Transition } from "motion/react";

/**
 * v1 motion vocabulary. Single source of truth — every spring on the
 * v1 redesign reads from one of these names, never inline numbers.
 *
 *   <motion.div transition={springs.lift} animate={{ y: -8 }} />
 *
 * When to reach for which:
 *  - `snap`    — fast, decisive, no overshoot (taps, toggles)
 *  - `lift`    — cards / surfaces moving on hover (most micro-interactions)
 *  - `glide`   — long horizontal / width / layout shifts (carousels, pills)
 *  - `bounce`  — playful 3D pop (icons, success ticks) — use sparingly
 *  - `jelly`   — multi-cycle "expensive jello" reverb on release
 *
 * `tweens.entry` is for scripted entrance cadences (hero word
 * reveals, line cascades) where staggered delays have to land on
 * exact beats. Springs work for physics; tweens work for choreography.
 *
 * Non-motion/react animations (CSS keyframes, canvas particle math,
 * lerps without velocity) live in their own systems. Don't force
 * them through this vocabulary.
 */
export const springs = {
  snap: { type: "spring", stiffness: 280, damping: 30 },
  lift: { type: "spring", stiffness: 110, damping: 12 },
  glide: { type: "spring", stiffness: 140, damping: 28 },
  bounce: { type: "spring", stiffness: 70, damping: 10, mass: 1.2 },
  jelly: { type: "spring", stiffness: 50, damping: 3, mass: 1.5 },
  // Hover-OUT release: one big overshoot, smaller second, ~1.8s settle.
  // Used by card bodies (FeatureCards/Primitives) so the retract reads
  // as a heavier physical layer than the snap hover-in.
  release: { type: "spring", stiffness: 90, damping: 8, mass: 1.2 },
  // Looser sibling of `release` for accent layers (icons, badges) that
  // should wobble a touch longer than their parent card body.
  releaseLoose: { type: "spring", stiffness: 90, damping: 6, mass: 1.2 },
  // Carousel snap — punchier than `snap`, with one decisive bounce
  // past the target before settling (~440ms total). Used by the
  // HowItWorks horizontal track when it lands on a new card.
  snapTight: { type: "spring", stiffness: 200, damping: 18 },
} as const satisfies Record<string, Transition>;

export const tweens = {
  entry: { type: "tween", duration: 0.7, ease: [0.16, 1, 0.3, 1] },
} as const satisfies Record<string, Transition>;

/**
 * Same physics, stripped of `type` for `useSpring()` consumers
 * (which take SpringOptions, not Transition). Tuning-locked to
 * `springs.*` so swapping APIs gives the same feel.
 */
export const springConfigs = {
  snap: { stiffness: 280, damping: 30 },
  lift: { stiffness: 110, damping: 12 },
  glide: { stiffness: 140, damping: 28 },
  bounce: { stiffness: 70, damping: 10, mass: 1.2 },
  jelly: { stiffness: 50, damping: 3, mass: 1.5 },
  release: { stiffness: 90, damping: 8, mass: 1.2 },
  releaseLoose: { stiffness: 90, damping: 6, mass: 1.2 },
  snapTight: { stiffness: 200, damping: 18 },
} as const satisfies Record<string, SpringOptions>;

export type SpringName = keyof typeof springs;
export type TweenName = keyof typeof tweens;

/**
 * Shared auto-cycle cadence for "show me each option in turn" reels
 * (TrustedInBigLeagues topic carousel, Lifecycle tab nav, UseCases
 * grid). Tuned long enough to read a body copy + screenshot without
 * skimming — every consumer reads from here so the page beats at
 * one rhythm.
 */
export const V1_CYCLE_MS = 7000;
