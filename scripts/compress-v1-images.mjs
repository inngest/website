#!/usr/bin/env node
/**
 * Compress the heaviest v1 image assets — outputs to a `.compressed/`
 * sibling directory next to each original so nothing gets overwritten.
 * Compare side-by-side; swap the code path only if the compressed
 * version is visually acceptable.
 *
 *   node scripts/compress-v1-images.mjs
 *
 * Run from repo root. Requires `sharp` (already in deps).
 */
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const TARGETS = [
  // [src,                                          quality, optional resize]
  ["public/assets/v1/hero/grain-bg.webp",           60],
  ["public/assets/v1/page/grain-bg.webp",           62],
  ["public/assets/v1/lifecycle/setup.png",          72],
  ["public/assets/v1/textures/noise-dark.webp",     62],
  ["public/assets/v1/go-deeper/banner.webp",        72],
];

function outPath(src, ext) {
  const dir = path.dirname(src);
  const base = path.basename(src, path.extname(src));
  return path.join(dir, ".compressed", `${base}.${ext}`);
}

async function compress(src, quality) {
  const meta = await sharp(src).metadata();
  const srcBytes = (await fs.stat(src)).size;

  const webpOut = outPath(src, "webp");
  await fs.mkdir(path.dirname(webpOut), { recursive: true });
  await sharp(src).webp({ quality, effort: 6 }).toFile(webpOut);
  const webpBytes = (await fs.stat(webpOut)).size;

  const avifOut = outPath(src, "avif");
  await sharp(src).avif({ quality: Math.max(quality - 10, 40), effort: 6 }).toFile(avifOut);
  const avifBytes = (await fs.stat(avifOut)).size;

  const fmt = (b) => (b / 1024).toFixed(0).padStart(5) + " KB";
  const pct = (b) => (((srcBytes - b) / srcBytes) * 100).toFixed(0).padStart(3) + "%";
  console.log(src);
  console.log(`  source:  ${fmt(srcBytes)}   ${meta.width}×${meta.height} ${meta.format}`);
  console.log(`  → webp:  ${fmt(webpBytes)}   q=${quality}   ${pct(webpBytes)} saved`);
  console.log(`  → avif:  ${fmt(avifBytes)}   q=${quality - 10}   ${pct(avifBytes)} saved`);
  console.log();
}

(async () => {
  console.log("Compressing to public/assets/v1/**/.compressed/*\n");
  for (const [src, q] of TARGETS) await compress(src, q);
  console.log("Done. Originals untouched. Open the .compressed/ versions in");
  console.log("Preview / Figma and compare — if any drop in quality is");
  console.log("visible, leave that one on the original.");
})();
