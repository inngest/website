#!/usr/bin/env node
/**
 * Phase-2 typography analyzer (PROPOSE-ONLY — never writes files).
 *
 * Finds raw type clusters in components/v1 className strings — combinations of
 * `font-v1{Display,Heading,Body,Label}` + `text-[Npx]` + `leading-[…]` +
 * `tracking-[…]` (+ optional weight / trim) — and matches each against the
 * generated token set (utils/v1/typography.tokens.json), applying the design
 * rule: TITLES (Display/Heading family) collapse to the cap-trim token variant,
 * BODY/LABEL collapse to the trim:none variant.
 *
 * Each cluster is classified:
 *   EXACT    — family+size+line-height match exactly one token (after the
 *              title/body trim preference). Safe to collapse.
 *   NEAR     — matches on family+size but line-height differs slightly, OR a
 *              weight override (font-medium) is present. Needs a design OK.
 *   RESPONSIVE — type size/lh varies by breakpoint (md:text-[…]); no single
 *              token. Manual.
 *   NOMATCH  — no token for this family+size. Manual / candidate new token.
 *
 * Usage: node scripts/analyze-v1-typography.mjs [path]
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const TARGET = process.argv.slice(2).find((a) => !a.startsWith("--")) || "components/v1";
const TOKENS = JSON.parse(
  readFileSync(join(ROOT, "utils/v1/typography.tokens.json"), "utf8")
);

// Bucket a token's fontFamily into a class family.
function familyOf(fontFamily) {
  if (fontFamily.startsWith('"Whyte Inktrap"')) return "Display";
  if (fontFamily.startsWith("WhyteMono")) return "Label";
  if (fontFamily.startsWith("WhyteV1") || fontFamily.startsWith("Whyte")) return "Heading";
  if (fontFamily.startsWith("CircularXX")) return "Body";
  return "?";
}
const FONT_UTIL = {
  "font-v1Display": "Display",
  "font-v1Heading": "Heading",
  "font-v1Body": "Body",
  "font-v1Label": "Label",
};
const isTitleFamily = (f) => f === "Display" || f === "Heading";

// Index tokens by family -> list of {name, size, lh, ls, trim}
const byFamily = {};
for (const [name, t] of Object.entries(TOKENS)) {
  const fam = familyOf(t.fontFamily);
  (byFamily[fam] ||= []).push({
    name,
    size: parseFloat(t.fontSize), // px (NaN for clamp() fluid)
    lh: t.lineHeight,
    ls: t.letterSpacing || null,
    trim: t.trim,
  });
}

// Parse a px line-height ("27px") or unitless ratio ("1.5") to a comparable px
// given font-size; returns {px} for comparison.
function lhToPx(lhRaw, sizePx) {
  if (lhRaw == null) return null;
  if (typeof lhRaw === "string" && lhRaw.endsWith("px")) return parseFloat(lhRaw);
  const n = parseFloat(lhRaw);
  return Number.isFinite(n) ? n * sizePx : null;
}

// Find the best token for (family, sizePx, lhPx), honoring title/body trim pref.
function matchToken(family, sizePx, lhPx, wantCap) {
  const cands = (byFamily[family] || []).filter(
    (t) => Math.abs(t.size - sizePx) < 0.6
  );
  if (!cands.length) return { kind: "NOMATCH" };
  // line-height filter
  const lhEq = (t) => {
    if (lhPx == null) return true; // no leading specified — size match is enough
    const tlh = lhToPx(t.lh, t.size);
    return tlh != null && Math.abs(tlh - lhPx) < 0.6;
  };
  let exact = cands.filter(lhEq);
  if (!exact.length) {
    return { kind: "NEAR", note: "line-height differs", candidates: cands.map((c) => c.name) };
  }
  // trim preference
  const pref = exact.filter((t) => (wantCap ? t.trim === "cap" : t.trim !== "cap"));
  const pick = (pref.length ? pref : exact);
  if (pick.length === 1) return { kind: "EXACT", token: pick[0].name };
  return { kind: "NEAR", note: "ambiguous after trim pref", candidates: pick.map((c) => c.name) };
}

// ---- file walk ----
const files = [];
(function walk(dir) {
  let entries;
  try { entries = readdirSync(dir); } catch { return; }
  for (const name of entries) {
    if (name === "node_modules" || name.startsWith(".")) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(tsx|ts)$/.test(name)) files.push(p);
  }
})(join(ROOT, TARGET));

// Extract class-list string literals containing a type signal.
const STRLIT = /"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'|`((?:[^`\\]|\\.)*)`/g;
const TYPE_SIGNAL = /\bfont-v1(?:Display|Heading|Body|Label)\b|\btext-\[\d|\bleading-\[|\btracking-\[/;

const stats = { EXACT: 0, NEAR: 0, RESPONSIVE: 0, NOMATCH: 0 };
const proposals = [];

for (const file of files) {
  const src = readFileSync(file, "utf8");
  let m;
  STRLIT.lastIndex = 0;
  while ((m = STRLIT.exec(src))) {
    const content = m[1] ?? m[2] ?? m[3];
    if (!content || !TYPE_SIGNAL.test(content)) continue;
    const classes = content.split(/\s+/).filter(Boolean);
    // group by variant prefix (everything before the last ':' not inside [])
    const groups = {};
    for (const c of classes) {
      if (c.includes("${")) continue;
      // split variant prefix from utility (respect [] which can contain ':')
      let depth = 0, splitAt = -1;
      for (let i = 0; i < c.length; i++) {
        if (c[i] === "[") depth++;
        else if (c[i] === "]") depth--;
        else if (c[i] === ":" && depth === 0) splitAt = i;
      }
      const variant = splitAt >= 0 ? c.slice(0, splitAt) : "";
      const util = splitAt >= 0 ? c.slice(splitAt + 1) : c;
      (groups[variant] ||= []).push(util);
    }
    // detect responsive type variance: a type size in any non-base variant
    const variantSizes = Object.entries(groups).filter(
      ([v, utils]) => v !== "" && utils.some((u) => /^text-\[\d/.test(u))
    );
    const base = groups[""] || [];
    const fontUtil = base.find((u) => FONT_UTIL[u]);
    const sizeUtil = base.find((u) => /^text-\[[\d.]+px\]/.test(u));
    if (!fontUtil && !sizeUtil) continue; // not a real type cluster in base
    const lineNo = src.slice(0, m.index).split("\n").length;
    const loc = `${relative(ROOT, file)}:${lineNo}`;

    if (variantSizes.length) {
      stats.RESPONSIVE++;
      proposals.push({ loc, kind: "RESPONSIVE", raw: snippet(base) });
      continue;
    }
    const family = fontUtil ? FONT_UTIL[fontUtil] : null;
    const sizePx = sizeUtil ? parseFloat(sizeUtil.match(/\[([\d.]+)px\]/)[1]) : null;
    const lhUtil = base.find((u) => /^leading-\[/.test(u));
    const lhPx = lhUtil
      ? lhToPx(lhUtil.match(/\[([^\]]+)\]/)[1].replace("px", ""), sizePx)
      : null;
    const hasWeight = base.some((u) => /^font-(medium|semibold|bold|light)$/.test(u));

    if (!family || sizePx == null) {
      // e.g. font util without explicit size (token-only family) — flag NEAR
      stats.NEAR++;
      proposals.push({ loc, kind: "NEAR", note: "incomplete cluster (family or size missing)", raw: snippet(base) });
      continue;
    }
    const res = matchToken(family, sizePx, lhPx, isTitleFamily(family));
    if (res.kind === "EXACT" && hasWeight) {
      stats.NEAR++;
      proposals.push({ loc, kind: "NEAR", note: `weight override; token=${res.token}`, raw: snippet(base) });
    } else {
      stats[res.kind]++;
      proposals.push({ loc, kind: res.kind, token: res.token, note: res.note, candidates: res.candidates, raw: snippet(base) });
    }
  }
}

function snippet(base) {
  return base.filter((u) => /font-v1|text-\[|leading-\[|tracking-\[|font-(medium|semibold|bold)/.test(u)).join(" ");
}

// ---- report ----
const total = stats.EXACT + stats.NEAR + stats.RESPONSIVE + stats.NOMATCH;
console.log(`\nTypography clusters in ${TARGET}: ${total}\n`);
console.log(`  EXACT      ${stats.EXACT}  (safe collapse to one token)`);
console.log(`  NEAR       ${stats.NEAR}  (weight override / lh drift / ambiguous — design OK)`);
console.log(`  RESPONSIVE ${stats.RESPONSIVE}  (size varies by breakpoint — manual)`);
console.log(`  NOMATCH    ${stats.NOMATCH}  (no token for family+size — manual / new token)\n`);

for (const kind of ["EXACT", "NEAR", "NOMATCH", "RESPONSIVE"]) {
  const list = proposals.filter((p) => p.kind === kind);
  if (!list.length) continue;
  console.log(`▸ ${kind} — ${list.length}`);
  for (const p of list.slice(0, 12)) {
    const to = p.token ? ` -> text-v1-${p.token}` : p.candidates ? ` -> {${p.candidates.join("|")}}` : "";
    console.log(`  ${p.loc}  [${p.raw}]${to}${p.note ? "  (" + p.note + ")" : ""}`);
  }
  if (list.length > 12) console.log(`  … +${list.length - 12} more`);
  console.log("");
}
