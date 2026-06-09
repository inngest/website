#!/usr/bin/env node
/**
 * v1 design-system lint — guards the typography + spacing token system
 * (see docs/v1-design-system.md). Flags the four ways code drifts off the
 * tokens:
 *
 *   A. raw `font-v1{Display,Heading,Body,Label}` → bypasses the type token
 *      (which carries size/line-height/letter-spacing/cap-trim).
 *   B. hand-written `[text-box-trim]` / `[text-box-edge]` → use a token's
 *      baked trim, or `.v1-cap-trim` / `.v1-trim`.
 *   C. arbitrary type size `[font-size:…]` / `text-[Npx]` → use a token.
 *   D. arbitrary spacing px on padding/margin/gap → use the scale utility
 *      (on-scale) or snap to the nearest scale value (off-scale).
 *
 * Reports by default (warnings). Pass `--strict` to exit non-zero when any
 * violation is found (use per-directory in CI as pages migrate). Pass a path
 * to scan a subtree, e.g. `node scripts/lint-v1-tokens.mjs components/v1/sections/Pricing`.
 *
 * Usage: node scripts/lint-v1-tokens.mjs [path] [--strict]
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { COLOR_PREFIXES, resolveColor } from "../utils/v1/color-tokens.mjs";

const ROOT = process.cwd();
const args = process.argv.slice(2);
const STRICT = args.includes("--strict");
const TARGET = args.find((a) => !a.startsWith("--")) || "components/v1";

// Spacing scale (Figma Spacing-N) → Tailwind utility suffix.
const SCALE = {
  2: "0.5", 4: "1", 6: "1.5", 8: "2", 12: "3", 16: "4", 24: "6",
  32: "8", 40: "10", 48: "12", 64: "16", 80: "20", 96: "24", 160: "40",
};
const SCALE_PX = Object.keys(SCALE).map(Number);
const nearest = (n) =>
  SCALE_PX.reduce((a, b) => (Math.abs(b - n) < Math.abs(a - n) ? b : a));

const SPACE_PROP =
  "gap-x|gap-y|gap|space-x|space-y|px|py|pt|pb|pl|pr|p|mx|my|mt|mb|ml|mr|m";

const RULES = [
  {
    id: "A-raw-font",
    re: /font-v1(?:Display|Heading|Body|Label)\b/g,
    msg: "raw font-family — use a `text-v1-*` token (carries size/lh/trim)",
  },
  {
    id: "B-raw-trim",
    re: /\[text-box-(?:trim|edge):/g,
    msg: "hand-written cap-trim — use a token's trim, `.v1-cap-trim`, or `.v1-trim`",
  },
  {
    id: "C-arbitrary-type",
    re: /\[font-size:|\btext-\[\d/g,
    msg: "arbitrary type size — use a `text-v1-*` token",
  },
  {
    id: "D-arbitrary-spacing",
    re: new RegExp(`\\b(?:${SPACE_PROP})-\\[(\\d+(?:\\.\\d+)?)px\\]`, "g"),
    msg: null, // computed per-match (on/off scale)
  },
  {
    id: "E-raw-color",
    // `<prefix>-[#hex]` or `<prefix>-[rgb/rgba(...)]` — colour literal in a
    // Tailwind utility. Resolved per-match to a v1 token (hit) or, when no
    // token matches the value, an advisory (leave raw / add a token).
    re: new RegExp(
      `\\b(${COLOR_PREFIXES.join("|")})-\\[(#[0-9a-fA-F]{3,8}|rgba?\\([^\\]]*\\))\\]`,
      "g"
    ),
    msg: null, // computed per-match (token suggestion / no-token advisory)
  },
];

const files = [];
(function walk(dir) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const name of entries) {
    if (name === "node_modules" || name.startsWith(".")) continue;
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p);
    else if (/\.(tsx|ts)$/.test(name)) files.push(p);
  }
})(join(ROOT, TARGET));

// Strip line + block comments so doc-comment examples don't false-positive.
function isCommented(line, idx, inBlock) {
  if (inBlock) return true;
  const lineStart = line.slice(0, idx);
  if (lineStart.includes("//")) return true;
  if (/^\s*\*/.test(line)) return true; // JSDoc continuation
  return false;
}

const hits = []; // token-bypass violations (count toward --strict)
const advisories = []; // off-scale spacing — needs design judgment, never fails CI
for (const file of files) {
  const lines = readFileSync(file, "utf8").split("\n");
  let inBlock = false;
  lines.forEach((line, i) => {
    const opensBlock = line.includes("/*");
    const closesBlock = line.includes("*/");
    const lineInBlock = inBlock; // state at start of this line
    if (opensBlock && !closesBlock) inBlock = true;
    else if (closesBlock) inBlock = false;

    for (const rule of RULES) {
      rule.re.lastIndex = 0;
      let m;
      while ((m = rule.re.exec(line))) {
        if (isCommented(line, m.index, lineInBlock)) continue;
        let msg = rule.msg;
        if (rule.id === "D-arbitrary-spacing") {
          const px = Number(m[1]);
          if (SCALE[px] === undefined) {
            // Off-scale: micro-nudges (<8px) are legit; everything else is
            // an advisory (snap to nearest, or confirm it's intentional).
            if (px >= 8) {
              advisories.push({
                file: relative(ROOT, file),
                line: i + 1,
                text: m[0],
                msg: `off-scale — nearest is ${nearest(px)}px (snap, or confirm intentional)`,
              });
            }
            continue;
          }
          msg = `on-scale \`${px}px\` — use \`*-${SCALE[px]}\`${px === 48 ? " / `v1-stack`" : px === 96 ? " / `v1-stack-lg`" : ""}`;
        }
        if (rule.id === "E-raw-color") {
          const prefix = m[1];
          const value = m[2];
          const token = resolveColor(value, prefix);
          if (token === null) {
            // No v1 token matches this colour (code-syntax palette, near-miss,
            // untokenised dark). Advisory — leave raw or mint a token.
            advisories.push({
              file: relative(ROOT, file),
              line: i + 1,
              text: m[0],
              msg: "no v1 colour token for this value — leave raw or add a token",
            });
            continue;
          }
          msg = `raw colour — use \`${prefix}-${token}\``;
        }
        hits.push({
          file: relative(ROOT, file),
          line: i + 1,
          rule: rule.id,
          text: m[0],
          msg,
        });
      }
    }
  });
}

// Report
const byRule = {};
for (const h of hits) (byRule[h.rule] ||= []).push(h);

if (hits.length === 0 && advisories.length === 0) {
  console.log(`✓ v1 token lint: clean in ${TARGET} (${files.length} files)`);
  process.exit(0);
}

if (hits.length) {
  console.log(`v1 token lint — ${hits.length} violation(s) in ${TARGET} (${files.length} files scanned)\n`);
  for (const rule of RULES) {
    const list = byRule[rule.id];
    if (!list?.length) continue;
    console.log(`▸ ${rule.id} — ${list.length}`);
    for (const h of list) {
      console.log(`  ${h.file}:${h.line}  ${h.text}  — ${h.msg}`);
    }
    console.log("");
  }
}

if (advisories.length) {
  console.log(`▸ advisory: ${advisories.length} off-scale spacing value(s) — snap to nearest or confirm intentional (does NOT fail --strict):`);
  for (const a of advisories) {
    console.log(`  ${a.file}:${a.line}  ${a.text}  — ${a.msg}`);
  }
  console.log("");
}

if (STRICT && hits.length) {
  console.error(`✗ --strict: failing on ${hits.length} violation(s) (advisories excluded).`);
  process.exit(1);
}
console.log("(report-only; pass --strict to fail CI on violations)");
process.exit(0);
