#!/usr/bin/env node
/**
 * One-shot codemod: rewrite raw colour literals in Tailwind `className`
 * utilities to v1 semantic tokens (see utils/v1/color-tokens.mjs).
 *
 * Scope is intentionally narrow + behaviour-preserving:
 *   - Only `<prefix>-[#hex]` / `<prefix>-[rgb/rgba(...)]` utility literals.
 *   - Only values that resolve to an EXACT-RGB v1 token; untokenised values
 *     (code-syntax palette, near-misses) are left untouched.
 *   - Variant chains (`md:`, `hover:`, …) are preserved.
 *   - SVG `fill="#…"`/`stroke="#…"` attributes and JS colour constants are
 *     NOT touched — they aren't className utilities and often carry canvas /
 *     gradient data.
 *
 * Dry-run by default (prints every change). Pass `--write` to apply.
 * Usage: node scripts/codemod-v1-colors.mjs [path] [--write]
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { COLOR_PREFIXES, resolveColor } from "../utils/v1/color-tokens.mjs";

const ROOT = process.cwd();
const args = process.argv.slice(2);
const WRITE = args.includes("--write");
const TARGET = args.find((a) => !a.startsWith("--")) || "components/v1";

const LITERAL = new RegExp(
  `\\b(${COLOR_PREFIXES.join("|")})-\\[(#[0-9a-fA-F]{3,8}|rgba?\\([^\\]]*\\))\\]`,
  "g"
);

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
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(tsx|ts)$/.test(name)) files.push(p);
  }
})(join(ROOT, TARGET));

let changed = 0;
let filesChanged = 0;
for (const file of files) {
  const src = readFileSync(file, "utf8");
  let fileHits = 0;
  const out = src.replace(LITERAL, (whole, prefix, value) => {
    const token = resolveColor(value, prefix);
    if (token === null) return whole; // untokenised — leave raw
    fileHits++;
    changed++;
    const next = `${prefix}-${token}`;
    console.log(`  ${relative(ROOT, file)}  ${whole}  ->  ${next}`);
    return next;
  });
  if (fileHits > 0) {
    filesChanged++;
    if (WRITE) writeFileSync(file, out);
  }
}

console.log(
  `\n${WRITE ? "✓ applied" : "(dry-run)"} ${changed} replacement(s) across ${filesChanged} file(s) in ${TARGET}` +
    (WRITE ? "" : " — pass --write to apply")
);
