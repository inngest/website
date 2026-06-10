#!/usr/bin/env node
/**
 * Combine per-fragment Figma SVG exports into a single SVG per brand.
 *
 * Figma's get_design_context returns brand wordmarks as a stack of
 * separate path fragments, each absolutely positioned in the brand's
 * box via inset percentages. This script reads those fragments and
 * a per-brand config, computes the absolute pixel positions, and
 * writes one composite `<svg>` per brand.
 *
 * Usage: node scripts/combine-brand-svgs.mjs
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const PUBLIC = "public/assets/v1/logos";

const BRANDS = [
  {
    out: "elevenlabs.svg",
    width: 185.067,
    height: 24,
    parts: [
      ["elevenlabs/p0.svg", "24.66% 57.83% 1.65% 33.21%"],
      ["elevenlabs/p1.svg", "0 97.35% 1.65% 0"],
      ["elevenlabs/p2.svg", "0 92.08% 1.65% 5.27%"],
      ["elevenlabs/p3.svg", "0 81.61% 1.65% 10.54%"],
      ["elevenlabs/p4.svg", "0 77.48% 1.65% 20.01%"],
      ["elevenlabs/p5.svg", "23% 67.33% 0 24.04%"],
      ["elevenlabs/p6.svg", "23% 48.72% 0 42.65%"],
      ["elevenlabs/p7.svg", "0 29.18% 1.65% 63.18%"],
      ["elevenlabs/p8.svg", "23% 19.73% 0 71.44%"],
      ["elevenlabs/p9.svg", "0 9.01% 0 82.21%"],
      ["elevenlabs/p10.svg", "23% 0 0 92.02%"],
      ["elevenlabs/p11.svg", "23% 38.91% 1.65% 52.8%"],
    ],
  },
  {
    out: "avoca.svg",
    width: 162.353,
    height: 40,
    parts: [
      ["avoca/p0.svg", "31.11% 55.62% 15.86% 31.87%"],
      ["avoca/p1.svg", "30.41% 28.54% 15.33% 58.01%"],
      ["avoca/p2.svg", "30.46% 14.2% 15.39% 72.97%"],
      ["avoca/p3.svg", "31.11% 0.02% 15.86% 87.47%"],
      ["avoca/p4.svg", "31.16% 43.08% 15.88% 44.09%"],
      ["avoca/p5.svg", "16.4% 75.96% 7.68% 2.73%"],
      ["avoca/p6.svg", "55.46% 80.09% 0.39% 13.55%"],
      ["avoca/p7.svg", "15.44% 92.12% 47.39% 0"],
      ["avoca/p8.svg", "0 74.88% 80.51% 13.62%"],
    ],
  },
  {
    out: "11x.svg",
    width: 104.184,
    height: 37,
    parts: [
      ["11x/p0.svg", "7.37% 61.68% 5.26% 0.19%"],
      ["11x/p1.svg", "30.39% 0.47% 15.79% 79.08%"],
      ["11x/p2.svg", "12.04% 25.22% 15.79% 66.11%"],
      ["11x/p3.svg", "12.04% 39.21% 15.79% 52.12%"],
    ],
  },
  {
    out: "cohere.svg",
    width: 208,
    height: 32,
    parts: [
      ["cohere-2.svg", "6.3% 77.07% 4.81% 9.38%"],
      ["cohere-1.svg", "6.3% 9.43% 4.78% 27.36%"],
    ],
  },
  {
    out: "aomni.svg",
    width: 146,
    height: 46,
    parts: [
      ["aomni-1.svg", "21% 72.03% 21% 12.15%"],
      ["aomni-2.svg", "51.72% 87.97% 21% 3.46%"],
      ["aomni-3.svg", "30.75% 3.88% 29.59% 47.22%"],
    ],
  },
];

function parseInset(inset) {
  // parseFloat handles a trailing "%" (and "0" with no unit) gracefully.
  const [t, r, b, l] = inset.split(/\s+/).map(parseFloat);
  return { t, r, b, l };
}

function readFragment(file) {
  const raw = readFileSync(resolve(PUBLIC, file), "utf8");
  const vbMatch = raw.match(/viewBox="([^"]+)"/);
  if (!vbMatch) throw new Error(`No viewBox in ${file}`);
  const [, , vw, vh] = vbMatch[1].split(/\s+/).map(Number);
  const innerMatch = raw.match(/<svg[^>]*>([\s\S]*?)<\/svg>/);
  if (!innerMatch) throw new Error(`No svg body in ${file}`);
  return { inner: innerMatch[1].trim(), vw, vh };
}

for (const brand of BRANDS) {
  const missing = brand.parts.find(
    ([file]) => !existsSync(resolve(PUBLIC, file))
  );
  if (missing) {
    console.log(`skip ${brand.out} (missing ${missing[0]})`);
    continue;
  }
  const groups = [];
  for (const [file, inset] of brand.parts) {
    const { t, r, b, l } = parseInset(inset);
    const x = (l / 100) * brand.width;
    const y = (t / 100) * brand.height;
    const w = ((100 - l - r) / 100) * brand.width;
    const h = ((100 - t - b) / 100) * brand.height;
    const { inner, vw, vh } = readFragment(file);
    const sx = w / vw;
    const sy = h / vh;
    groups.push(
      `  <g transform="translate(${x.toFixed(4)} ${y.toFixed(4)}) scale(${sx.toFixed(6)} ${sy.toFixed(6)})">${inner}</g>`
    );
  }
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${brand.width} ${brand.height}" fill="none">\n` +
    groups.join("\n") +
    `\n</svg>\n`;
  writeFileSync(resolve(PUBLIC, brand.out), svg);
  console.log(`wrote ${brand.out} (${brand.parts.length} parts)`);
}
