/**
 * Shared section-title class for v1 marketing pages.
 *
 * Mirrors the `Display/Sm` style: the cap-trimmed `text-v1-display-sm`
 * token (64px / line-height 1.25 / -0.01em, native `text-box-trim`) scaled
 * down responsively via a clamp that caps at the token's 64px. Keeping this
 * in one place guarantees every section title renders identically at every
 * width — compose with `cn()` for per-section extras (color, margins).
 *
 * NOTE: lives under components/ (not utils/) so Tailwind's content scanner
 * still emits the arbitrary `[font-size]` / `[line-height]` values.
 */
export const V1_SECTION_TITLE =
  "text-v1-display-sm text-v1-frost uppercase [font-size:clamp(2rem,4.6vw,4rem)] [line-height:1.25]";

/**
 * Homepage section titles: the same Whyte Inktrap face as the hero H1,
 * sentence case (not the all-caps display lockup), and one step smaller
 * than the 72px hero so the fold has a clear type hierarchy.
 */
export const HOME_SECTION_TITLE =
  "normal-case font-v1Heading text-v1-frost [font-size:clamp(2rem,5vw,4.5rem)] leading-[1.2] tracking-[-3px]";
