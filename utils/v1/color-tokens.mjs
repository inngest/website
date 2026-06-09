/*
 * v1 colour-token lookup — maps raw colour literals (hex / rgb / rgba) back to
 * the semantic Tailwind utilities defined in styles/v1.css + tailwind.config.js.
 *
 * Consumed by:
 *   - scripts/lint-v1-tokens.mjs  (rule E — flags raw colours, suggests a token)
 *   - scripts/codemod-v1-colors.mjs (one-shot migration of className literals)
 *
 * Resolution is context-aware: the same RGB triple can be several tokens
 * (124 124 124 is carbon-300 / text-light / border-strong / code-comment), so
 * the utility *prefix* (text-/bg-/border-) selects the semantic name, falling
 * back to the context-independent `colors.v1.*` token (carbon-N / accent-* /
 * primary-* / frost / steel / jetBlack), which works with any prefix.
 *
 * Keys are normalised "r g b" triples (space-separated, matching the CSS-var
 * format). Only values that have a real utility are listed; anything absent
 * (the code-syntax palette, near-misses like #ff5536, untokenised darks) is
 * intentionally left raw.
 */

// triple -> { generic?, text?, bg?, border? } — each a token suffix (the part
// after the `text-`/`bg-`/`border-`/`fill-`… prefix). `generic` comes from
// theme.extend.colors.v1.* and is valid with ANY colour-consuming prefix.
export const COLOR_TOKENS = {
  // ── Carbon neutral ramp + base ──────────────────────────────────────
  "255 255 255": { generic: "v1-frost" }, // also carbon-0; frost is the brand token
  "254 254 254": { generic: "v1-carbon-50", text: "v1-alwaysWhite" },
  "242 242 242": { generic: "v1-carbon-100" },
  "205 205 205": { generic: "v1-carbon-200", border: "v1-contrast" }, // also code-bracket
  "124 124 124": { generic: "v1-carbon-300", text: "v1-light", border: "v1-strong" }, // also code-comment
  "33 33 33": { generic: "v1-carbon-400", bg: "v1-surfaceElevated" },
  "2 2 2": { generic: "v1-carbon-500", bg: "v1-surfaceBase" },
  "0 0 0": { generic: "v1-jetBlack", bg: "v1-surfaceOverlay" },
  "122 122 122": { generic: "v1-steel" },

  // ── Text semantics (no matching primitive) ──────────────────────────
  "246 246 246": { text: "v1-basis" },
  "204 204 204": { text: "v1-subtle" }, // also code-bracket (205 != 204)
  "155 155 155": { text: "v1-muted" },

  // ── Background semantics (no matching primitive) ────────────────────
  "28 28 28": { bg: "v1-canvasBase" },
  "36 36 36": { bg: "v1-canvasSubtle" },
  "53 53 53": { bg: "v1-canvasMuted", border: "v1-subtle" },
  "75 75 75": { bg: "v1-surfaceMuted", border: "v1-muted" },
  "18 18 18": { bg: "v1-codeEditor" },

  // ── Border semantics ────────────────────────────────────────────────
  "35 137 241": { border: "v1-active" },

  // ── Brand accents + primary ramp (context-independent) ──────────────
  "251 85 54": { generic: "v1-accent-salmon" },
  "253 138 114": { generic: "v1-accent-salmon-light" },
  "217 74 43": { generic: "v1-accent-salmon-dark" },
  "247 98 70": { generic: "v1-accent-salmon-gradient" },
  "1 60 246": { generic: "v1-accent-blue" },
  "1 51 245": { generic: "v1-accent-blue-gradient" },
  "11 221 72": { generic: "v1-accent-green" },
  "102 189 139": { generic: "v1-primary-intense" },
  "44 155 99": { generic: "v1-primary-moderate" },
  "2 122 72": { generic: "v1-primary-subtle" },
  "1 84 48": { generic: "v1-primary-2xSubtle" },
  "0 77 43": { generic: "v1-primary-3xSubtle" },
  "143 117 183": { generic: "v1-code-keyword" },
};

// Prefixes that take a v1 colour token. `text/bg/border` may resolve to a
// context-specific semantic; the rest only ever take the generic token.
const CONTEXT_PREFIXES = new Set(["text", "bg", "border"]);
export const COLOR_PREFIXES = [
  "text", "bg", "border", "fill", "stroke", "from", "via", "to",
  "ring", "outline", "decoration", "caret", "accent", "divide", "placeholder",
];

// "#7c7c7c" | "#fff" | "rgb(124,124,124)" | "rgba(124, 124, 124, .35)" ->
// { triple: "124 124 124", alpha: number|null } | null
export function parseColor(raw) {
  const s = raw.trim();
  let m;
  if ((m = s.match(/^#([0-9a-fA-F]{3,8})$/))) {
    let hex = m[1];
    if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
    if (hex.length !== 6 && hex.length !== 8) return null;
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const alpha = hex.length === 8 ? Math.round((parseInt(hex.slice(6, 8), 16) / 255) * 100) / 100 : null;
    return { triple: `${r} ${g} ${b}`, alpha };
  }
  if ((m = s.match(/^rgba?\(\s*([0-9]+)[ ,]+([0-9]+)[ ,]+([0-9]+)\s*(?:[,/]\s*([0-9.]+%?))?\s*\)$/))) {
    const triple = `${+m[1]} ${+m[2]} ${+m[3]}`;
    let alpha = null;
    if (m[4] != null) alpha = m[4].endsWith("%") ? parseFloat(m[4]) / 100 : parseFloat(m[4]);
    return { triple, alpha };
  }
  return null;
}

// Resolve a raw colour + utility prefix to a full Tailwind class suffix
// (e.g. "v1-light", or "v1-strong/[0.35]"). Returns null if no token matches.
export function resolveColor(raw, prefix) {
  const parsed = parseColor(raw);
  if (!parsed) return null;
  const entry = COLOR_TOKENS[parsed.triple];
  if (!entry) return null;
  const suffix =
    (CONTEXT_PREFIXES.has(prefix) && entry[prefix]) || entry.generic || null;
  if (!suffix) return null;
  if (parsed.alpha != null && parsed.alpha !== 1) {
    return `${suffix}/[${parsed.alpha}]`;
  }
  return suffix;
}
