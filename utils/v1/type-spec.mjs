/*
 * v1 typography spec — single source of truth for the type scale.
 *
 * Consumed by scripts/generate-typography-tokens.mjs, which writes
 * utils/v1/typography.tokens.json — read by the v1TypographyPlugin in
 * tailwind.config.js to register `text-v1-{name}` utilities.
 *
 * Re-run the generator after editing this file:
 *   node scripts/generate-typography-tokens.mjs
 *
 * Each entry: font-family + design-spec sizing. `trim: "cap"` (default)
 * applies Capsize cap-height trim via ::before/::after pseudo-elements.
 * `trim: "none"` is for flowing copy where the natural line-box leading
 * needs to remain visible.
 *
 * Fluid sizing:
 *   `fluid` (string, usually `clamp(...)`) overrides the px-converted
 *   font-size. The base `fontSize` (px) is still required for Capsize
 *   trim computation — its em-unit outputs scale correctly with the
 *   clamp's resolved value, so trim stays pixel-correct across the range.
 *   `responsive` (`{ lg: { fluid: ... } }`) keys breakpoint-specific
 *   `fluid` overrides — the plugin emits each as a nested media query.
 */

export const STYLES = [
  {
    name: "v1-display-lg",
    metricsKey: "whyteInktrap",
    fontFamily:
      '"Whyte Inktrap", Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 100,
    leading: 80,
    letterSpacing: "-0.01em",
  },
  {
    name: "v1-display-sm",
    metricsKey: "whyteInktrap",
    fontFamily:
      '"Whyte Inktrap", Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 64,
    leading: 80, // 1.25 * 64
    letterSpacing: "-0.01em",
  },
  {
    // Figma "Display/Md" (FontSize-10). Sits between display-sm (64) and
    // display-lg (100); used by larger section/hero titles that cap at
    // 80px. Cap-trimmed (default).
    name: "v1-display-md",
    metricsKey: "whyteInktrap",
    fontFamily:
      '"Whyte Inktrap", Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 80,
    leading: 100, // 1.25 * 80
    letterSpacing: "-0.01em",
  },
  // Subsection display heading — used by section-titles inside cards
  // ("Stuff your CISO needs to see"). Cap-height trimmed (default) so
  // the bounding box hugs the visible glyph height, matching Figma's
  // auto-trimmed text rendering.
  {
    name: "v1-display-xs",
    metricsKey: "whyteInktrap",
    fontFamily:
      '"Whyte Inktrap", Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 40,
    leading: 50, // 1.25 * 40
    letterSpacing: "-0.01em",
  },
  {
    name: "v1-heading-lg",
    metricsKey: "whyte",
    fontFamily:
      'WhyteV1, Whyte, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 58,
    leading: 70,
    letterSpacing: "-0.01em",
  },
  {
    name: "v1-heading-sm",
    metricsKey: "whyte",
    fontFamily:
      'WhyteV1, Whyte, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 26,
    leading: 31.2, // 1.2 * 26
    letterSpacing: "-0.01em",
  },
  {
    // 20/30 Whyte regular — Figma "Heading/Xs" (FontSize-4). List-item /
    // inline headings sitting beside a 24px icon (e.g. the Privacy page's
    // service names). Cap-trimmed so the row hugs the icon height. NB: the
    // `-loose` sibling below stays 18px for the legacy ScaleInstantly body.
    name: "v1-heading-xs",
    metricsKey: "whyte",
    fontFamily:
      'WhyteV1, Whyte, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 20,
    leading: 30, // 1.5 * 20
    letterSpacing: "-0.01em",
  },
  {
    name: "v1-body-lg",
    metricsKey: "circularXX",
    fontFamily:
      'CircularXX, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 18,
    leading: 27, // 1.5 * 18
    letterSpacing: "-0.01em",
  },
  // 20/30 CircularXX — feature-card body copy. Untrimmed so the
  // natural line-box leading provides the breathing room between
  // heading and body the design relies on.
  {
    name: "v1-body-md",
    metricsKey: "circularXX",
    fontFamily:
      'CircularXX, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 20,
    leading: 30, // 1.5 * 20
    letterSpacing: "-0.01em",
    trim: "none",
  },
  {
    name: "v1-body-sm",
    metricsKey: "circularXX",
    fontFamily:
      'CircularXX, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 16,
    leading: 24,
    letterSpacing: "-0.01em",
  },
  // 14/20 CircularXX — Figma "text-sm/Regular". Card dates, secondary
  // body copy. Untrimmed (body text is not cap-trimmed) and no tracking
  // (Figma letter-spacing 0), so it sits below body-sm in the scale.
  {
    name: "v1-body-xs",
    metricsKey: "circularXX",
    fontFamily:
      'CircularXX, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 14,
    leading: 20,
    trim: "none",
  },
  {
    name: "v1-label-md",
    metricsKey: "whyteMono",
    fontFamily:
      'WhyteMonoV1, WhyteMono, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace',
    fontSize: 16,
    leading: 16,
  },
  {
    // Semantic role token for section eyebrows (the small kicker above a
    // heading). Same metrics as v1-label-md today, but named by role so
    // every eyebrow can be retuned in one place. Cap-trimmed so the gap
    // to the heading below it stays exact. Apply `uppercase` + a
    // contextual color (e.g. text-white / text-v1-frost) at the call site.
    name: "v1-eyebrow",
    metricsKey: "whyteMono",
    fontFamily:
      'WhyteMonoV1, WhyteMono, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace',
    fontSize: 16,
    leading: 16,
  },
  {
    name: "v1-label-sm",
    metricsKey: "whyteMono",
    fontFamily:
      'WhyteMonoV1, WhyteMono, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace',
    fontSize: 12,
    leading: 15, // 1.25 * 12
  },
  {
    // 11px Whyte Mono with positive tracking — the letter-spaced uppercase
    // overline/kicker style (e.g. DurableExecution AnyCode, DownloadGateForm
    // sections). Distinct from `eyebrow` (16px, no tracking): smaller and
    // wide-spaced. Cap-trimmed like the other labels. Apply `uppercase` +
    // weight (font-semibold) + a contextual colour at the call site; the
    // token bakes only family/size/leading/tracking/trim. Consolidates the
    // drifted 0.04–0.1em variants onto a single 0.1em canonical.
    name: "v1-label-spaced",
    metricsKey: "whyteMono",
    fontFamily:
      'WhyteMonoV1, WhyteMono, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace',
    fontSize: 11,
    leading: 11, // 1.0 — single-line kicker
    letterSpacing: "0.1em",
  },
  {
    name: "v1-caption",
    metricsKey: "circularXX",
    fontFamily:
      'CircularXX, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 12,
    leading: 12.757,
  },
  // ───── Untrimmed variants for flowing copy ──────────────────────────
  // Same specs as their non-loose siblings but without the cap-height
  // trim, so the natural line-box leading (top + bottom of the block)
  // remains visible. Use these when the text sits adjacent to other
  // text and trim would collapse the design's intended breathing room.
  {
    name: "v1-heading-xs-loose",
    metricsKey: "whyte",
    fontFamily:
      'WhyteV1, Whyte, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 18,
    leading: 27,
    letterSpacing: "-0.01em",
    trim: "none",
  },
  {
    name: "v1-body-lg-loose",
    metricsKey: "circularXX",
    fontFamily:
      'CircularXX, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 18,
    leading: 27,
    letterSpacing: "-0.01em",
    trim: "none",
  },
  {
    name: "v1-heading-sm-loose",
    metricsKey: "whyte",
    fontFamily:
      'WhyteV1, Whyte, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 26,
    leading: 32, // matches Figma's literal 32px (vs the trimmed sibling's 31.2)
    trim: "none",
  },
  {
    name: "v1-body-sm-loose",
    metricsKey: "circularXX",
    fontFamily:
      'CircularXX, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 16,
    leading: 24,
    trim: "none",
  },
  // ───── New steps not previously in the system ───────────────────────
  // 32/40 Whyte regular — card/cell titles (e.g. ScaleInstantly
  // capability blurbs). Untrimmed because each title sits directly
  // above body copy where the natural leading provides the breathing
  // room Figma's design relies on.
  {
    name: "v1-heading-card",
    metricsKey: "whyte",
    fontFamily:
      'WhyteV1, Whyte, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 32,
    leading: 40,
    trim: "none",
  },
  // 32/40 Whyte regular — Figma "Heading/Md" (FontSize-6, lineHeight
  // 40, letter-spacing -1). Page / article + section titles (the
  // Customer Story template's headline and "Related stories"). Same
  // size as heading-card but cap-height trimmed, so Figma's 24px gaps
  // above/below the title map 1:1 to CSS instead of inheriting the
  // line-box leading.
  {
    name: "v1-heading-md-cap",
    metricsKey: "whyte",
    fontFamily:
      'WhyteV1, Whyte, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 32,
    leading: 40, // 1.25 * 32
    letterSpacing: "-0.01em",
  },
  // 32/48 Whyte regular — section subhead paired with a display
  // headline (e.g. ScaleInstantly's "Any code. On any platform.").
  // Untrimmed so the 1.5 leading provides breathing room between the
  // subhead and the body copy that follows.
  {
    name: "v1-heading-md",
    metricsKey: "whyte",
    fontFamily:
      'WhyteV1, Whyte, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 32,
    leading: 48,
    letterSpacing: "-0.01em",
    trim: "none",
  },
  // 37/55 Whyte regular — pull quotes / testimonial bodies. Sized
  // off Figma's literal 36.97px for pixel parity.
  {
    name: "v1-quote",
    metricsKey: "whyte",
    fontFamily:
      'WhyteV1, Whyte, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 36.97,
    leading: 55.455, // 1.5 * 36.97
    letterSpacing: "-0.01em",
    trim: "none",
  },
  // 20/24 Whyte regular — byline / attribution blocks (author name +
  // title under a quote). Sized off Figma's literal 20.54/24.648.
  {
    name: "v1-byline",
    metricsKey: "whyte",
    fontFamily:
      'WhyteV1, Whyte, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 20.54,
    leading: 24.648,
    trim: "none",
  },
  // 14.378/27 Whyte Mono — inline code / SQL / terminal blocks. The
  // leading is intentionally larger than the font size so multi-line
  // code reads with comfortable line spacing. Sized verbatim from
  // Figma's SQL editor visualisation.
  {
    name: "v1-code",
    metricsKey: "whyteMono",
    fontFamily:
      'WhyteMonoV1, WhyteMono, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace',
    fontSize: 14.378,
    leading: 27,
    trim: "none",
  },
  // ───── Fluid heroes ────────────────────────────────────────────────
  // Home Hero ("UNBREAKABLE AGENTS / INVISIBLE INFRA.") — Whyte Inktrap
  // display, line-height 1 (tight). Mobile clamps 40 → 64 px on a 10vw
  // curve; desktop swaps to a longer 40 → 100 px range on a 7vw curve
  // to fill the absolute Figma 1440 layout. Trim is computed from the
  // 64 px base; em-unit margins scale correctly to whichever value the
  // clamp resolves at runtime.
  {
    name: "v1-display-hero",
    metricsKey: "whyteInktrap",
    fontFamily:
      '"Whyte Inktrap", Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 64,
    leading: 64, // ratio 1.0
    letterSpacing: "-0.01em",
    fluid: "clamp(2.5rem, 10vw, 4rem)",
    responsive: {
      lg: { fluid: "clamp(2.5rem, 7vw, 6.25rem)" },
    },
    // Untrimmed: the hero composes two display headlines as adjacent
    // blocks with tuned mt-3 / mt-[63px] margins. Cap-height trim
    // would collapse those gaps by ~12 px from each edge, so we
    // keep the natural line-box leading visible.
    trim: "none",
  },
];
