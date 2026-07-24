// Optimizes the team-card sphere SVG. Two transforms:
//
// 1. Path → circle conversion. Figma exports each dot as a `<path>`
//    with 6 cubic-bezier segments (~600 chars). Native `<circle>`
//    elements render the same dot in ~45 chars. Figma also emits 2-3
//    duplicate paths per dot; we dedupe at the same time.
//
// 2. Crop to visible viewport. The figma sphere lives in a 692.225 ×
//    692.211 frame but each team card only shows a 406.653 × 405
//    window of it (centred horizontally, top-aligned). Dots outside
//    that window are clipped at runtime by `overflow:hidden` and just
//    bloat the file. We drop them and shift the remaining dots so the
//    output viewBox is the visible window — the runtime can then
//    render the SVG with `absolute inset-0 w-full h-full` instead of
//    the 170 %-width / translate / overflow-clip dance.
//
// Idempotent: re-running over the optimized output is a no-op (the
// extractor handles both `<path>` and `<circle>` inputs).
//
// Re-run after the figma export is refreshed:
//   pnpm v1:optimize-team-sphere

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), "..");
const TARGET = path.join(ROOT, "public/assets/v1/about-team/sphere.svg");

// Visible window in figma sphere-frame coords. Sphere is 692.225 ×
// 692.211; photo area is 406.653 × 405 centred horizontally on the
// sphere, top-aligned. So crop origin = ((692.225 − 406.653) / 2, 0)
// = (142.786, 0); crop size = 406.653 × 405. Pinned to figma node
// 1329:345554 — see the design context in components/v1/pages/
// AboutRedesign.tsx for the source frames.
const CROP_X = 142.786;
const CROP_Y = 0;
const OUT_W = 406.653;
const OUT_H = 405;

const src = await readFile(TARGET, "utf8");

const numRe = /-?\d+(?:\.\d+)?/g;
const round = (v, p = 2) => Math.round(v * 10 ** p) / 10 ** p;

// Extract a (cx, cy, r) tuple from each dot, regardless of whether the
// source uses `<path>` (figma export) or `<circle>` (already-optimised
// asset). Makes the script idempotent so a stale local copy can be
// re-optimised without re-downloading from figma.
const rawDots = [];

const pathRe = /<path[^>]*\sd="([^"]+)"[^>]*\/>/g;
let pathCount = 0;
let droppedAsBorder = 0;
for (const m of src.matchAll(pathRe)) {
  pathCount++;
  const nums = m[1].match(numRe);
  if (!nums || nums.length < 4) continue;
  const xs = [];
  const ys = [];
  for (let i = 0; i + 1 < nums.length; i += 2) {
    xs.push(parseFloat(nums[i]));
    ys.push(parseFloat(nums[i + 1]));
  }
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const w = maxX - minX;
  const h = maxY - minY;
  // Real dots are ~2-3 px square; the figma source also includes a
  // bottom-border path (`M406 405V404H0V405…`) that spans hundreds of
  // px in one axis — drop those by extent.
  if (w > 10 || h > 10) {
    droppedAsBorder++;
    continue;
  }
  rawDots.push({
    x: (minX + maxX) / 2,
    y: (minY + maxY) / 2,
    r: (w + h) / 4,
  });
}

const circleRe = /<circle[^>]*\scx="([^"]+)"[^>]*\scy="([^"]+)"[^>]*\sr="([^"]+)"[^>]*\/>/g;
let circleCount = 0;
for (const m of src.matchAll(circleRe)) {
  circleCount++;
  rawDots.push({
    x: parseFloat(m[1]),
    y: parseFloat(m[2]),
    r: parseFloat(m[3]),
  });
}

// Dedup, crop to the visible window, shift origin to (0, 0). A dot is
// kept if its centre is anywhere inside [-r, OUT_W + r] × [-r, OUT_H +
// r] — i.e. dots whose rim crosses the edge still render their visible
// arc. Figma includes those edge dots; clipping them off makes the
// rendered grid look noticeably sparser around the border.
const cropped = new Map();
for (const d of rawDots) {
  if (
    d.x < CROP_X - d.r ||
    d.x > CROP_X + OUT_W + d.r ||
    d.y < CROP_Y - d.r ||
    d.y > CROP_Y + OUT_H + d.r
  ) {
    continue;
  }
  const x = round(d.x - CROP_X, 3);
  const y = round(d.y - CROP_Y, 3);
  const r = round(d.r, 3);
  // Dedup at 0.5 px precision — figma exports each dot 2-3× with
  // identical sub-pixel positions, so this collapses true duplicates
  // without merging neighbours on the ~23-px grid.
  const key = `${Math.round(x * 2)}|${Math.round(y * 2)}|${Math.round(r * 4)}`;
  if (!cropped.has(key)) cropped.set(key, { x, y, r });
}

const circles = [...cropped.values()]
  .map((d) => `<circle cx="${d.x}" cy="${d.y}" r="${d.r}"/>`)
  .join("");

// `preserveAspectRatio="xMidYMid meet"` (the default) preserves the
// sphere's aspect under any container size — `none` was over-stretching
// dots when the runtime card width drifted from 406.653. Default
// `shape-rendering` lets the browser anti-alias normally, which matches
// figma's render. Both removed for parity.
const out = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${OUT_W} ${OUT_H}" fill="#fff" aria-hidden="true">${circles}</svg>\n`;

await writeFile(TARGET, out);
console.log(
  `source: ${pathCount} paths + ${circleCount} circles = ${rawDots.length} raw dots → in-window dedup: ${cropped.size} → ${(out.length / 1024).toFixed(1)} KB (border paths dropped: ${droppedAsBorder})`,
);
