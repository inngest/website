import { readFile, writeFile } from "node:fs/promises";
import { STYLES } from "../utils/v1/type-spec.mjs";

/*
 * Generates utils/v1/typography.tokens.json from utils/v1/type-spec.mjs.
 * Consumed by the v1TypographyPlugin in tailwind.config.js, which
 * registers each entry as a `text-v1-{name}` Tailwind component.
 *
 * Run after editing the spec or re-extracting font metrics:
 *   node scripts/generate-typography-tokens.mjs
 *
 * Trim is selective (titles/labels, not body): tokens with `trim: "cap"`
 * (default) bake cap-height/baseline trim margins into the JSON so the
 * plugin can apply native trim + a ::before/::after fallback — matching
 * Figma's "Vertical trim: Cap height". Tokens with `trim: "none"` are
 * for flowing copy where the natural line-box leading must remain.
 */

/*
 * Cap-height trim, computed directly from the font's OpenType metrics
 * (replaces the @capsizecss/core dependency). For trim-both with cap /
 * alphabetic edges the margins reduce to a closed form:
 *
 *   trim = perFontConst − lineHeightRatio / 2   (in em)
 *
 * where, with scales s = metric / unitsPerEm and contentArea =
 * ascent + |descent| + lineGap:
 *   capEdge  const = contentArea/2 − ascent + capHeight
 *   baseEdge const = contentArea/2 − |descent|
 *
 * The em output scales with font-size, so one value is size-independent.
 * Verified to reproduce @capsizecss/core's output exactly for every v1
 * font (see the metrics in utils/v1/font-metrics.json).
 */
function precomputeValues({ fontSize, leading, fontMetrics: m }) {
  const ascent = m.ascent / m.unitsPerEm;
  const descent = Math.abs(m.descent) / m.unitsPerEm;
  const lineGap = m.lineGap / m.unitsPerEm;
  const capHeight = m.capHeight / m.unitsPerEm;
  const halfContent = (ascent + descent + lineGap) / 2;
  const ratio = leading / fontSize;
  const em = (v) => `${Math.round(v * 10000) / 10000}em`;
  return {
    fontSize: `${fontSize}px`,
    lineHeight: `${leading}px`,
    capHeightTrim: em(halfContent - ascent + capHeight - ratio / 2),
    baselineTrim: em(halfContent - descent - ratio / 2),
  };
}

const FONT_METRICS = JSON.parse(
  await readFile(
    new URL("../utils/v1/font-metrics.json", import.meta.url),
    "utf8"
  )
);

// Strip the "v1-" prefix from each token key — the Tailwind plugin re-adds
// it as `text-v1-{key}`. Keeps the JSON shape ergonomic for consumers.
const tokens = {};
for (const style of STYLES) {
  const fontMetrics = FONT_METRICS[style.metricsKey];
  const values = precomputeValues({
    fontSize: style.fontSize,
    leading: style.leading,
    fontMetrics,
  });
  const trim = style.trim ?? "cap";
  const key = style.name.replace(/^v1-/, "");
  // Fluid tokens swap the emitted font-size to `style.fluid` and use a
  // unitless line-height so leading tracks the clamp's resolved value;
  // trim margins emit in em and scale correctly with both. `responsive`
  // passes through for the plugin to emit as media queries.
  tokens[key] = {
    fontFamily: style.fontFamily,
    fontSize: style.fluid ?? values.fontSize,
    lineHeight: style.fluid
      ? String(style.leading / style.fontSize)
      : values.lineHeight,
    fontWeight: 400,
    ...(style.letterSpacing && { letterSpacing: style.letterSpacing }),
    trim,
    ...(trim === "cap" && {
      capHeightTrim: values.capHeightTrim,
      baselineTrim: values.baselineTrim,
    }),
    ...(style.responsive && { responsive: style.responsive }),
  };
}

const jsonPath = new URL("../utils/v1/typography.tokens.json", import.meta.url);
await writeFile(jsonPath, JSON.stringify(tokens, null, 2) + "\n");
console.log(`✓ Wrote ${jsonPath.pathname}`);
