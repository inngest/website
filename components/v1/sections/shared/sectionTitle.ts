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
