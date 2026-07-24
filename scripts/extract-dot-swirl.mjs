// Extracts the hero dot-swirl into a static JSON catalogue of dots.
//
// The source SVG (`scripts/assets/dot-swirl-source.svg`) is the Figma
// export of the swirl layer. Internally it embeds a 4096×4096 stipple
// PNG and transforms it with a rotation+scale matrix to create the
// swirl — so we MUST rasterise the SVG itself (not the raw embedded
// PNG) to get the dots in their final positions. After rendering we
// run a connected-component blob scan and emit per-dot position,
// radius, colour and alpha in design-pixel coordinates (1440 × 875
// reference frame).
//
// Re-run after the design changes:  pnpm v1:extract-dot-swirl

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), "..");
const SOURCE_SVG = path.join(ROOT, "scripts/assets/dot-swirl-source.svg");
const OUTPUT_JSON = path.join(ROOT, "public/assets/v1/hero/dot-swirl.json");

// The Figma SVG draws the pattern into a `<rect x=-287 y=-80
// width=1905 height=1684>` but clips it to a 1440 × 875 viewBox.
// We override the viewBox to the rect's natural extent so we capture
// every dot the pattern produces — those extra dots fall outside the
// reference viewport and become the bleed that fills wider screens.
const RECT_X = -287;
const RECT_Y = -80;
const RECT_WIDTH = 1905;
const RECT_HEIGHT = 1684;
// The original Figma reference viewport, centred inside the rect.
// Dots are emitted in this frame so a (0, 0) dot sits at the
// viewport centre at runtime.
const DESIGN_CENTER_X = 720; // 1440 / 2 in the original viewBox
const DESIGN_CENTER_Y = 437.5; // 875 / 2
// Super-sample factor for blob detection. Each design pixel becomes
// SUPERSAMPLE × SUPERSAMPLE raster pixels — fine enough that small
// dots stay separable, coarse enough that scan stays under ~1 s.
const SUPERSAMPLE = 5;

// Source PNG dots have soft alpha halos that bridge neighbours at
// low thresholds, merging adjacent dots into oversized blobs.
// 180 keeps the halos out and forces blob detection to find the
// solid dot cores only — at SUPERSAMPLE=5 the cores stay separate.
const ALPHA_THRESHOLD = 180;
const MIN_BLOB_PX = SUPERSAMPLE * SUPERSAMPLE; // ≈ 1 design-pixel

function extractDots(rgba, w, h) {
  const visited = new Uint8Array(w * h);
  const stack = new Int32Array(w * h);
  const dots = [];

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (visited[i]) continue;
      visited[i] = 1;
      if (rgba[i * 4 + 3] < ALPHA_THRESHOLD) continue;

      let top = 0;
      stack[top++] = i;
      let sumX = 0;
      let sumY = 0;
      let count = 0;
      let peakAlpha = 0;
      let peakIdx = i;

      while (top > 0) {
        const j = stack[--top];
        const a = rgba[j * 4 + 3];
        if (a < ALPHA_THRESHOLD) continue;
        const px = j % w;
        const py = (j / w) | 0;
        sumX += px;
        sumY += py;
        count++;
        if (a > peakAlpha) {
          peakAlpha = a;
          peakIdx = j;
        }
        if (px > 0) {
          const k = j - 1;
          if (!visited[k]) {
            visited[k] = 1;
            stack[top++] = k;
          }
        }
        if (px < w - 1) {
          const k = j + 1;
          if (!visited[k]) {
            visited[k] = 1;
            stack[top++] = k;
          }
        }
        if (py > 0) {
          const k = j - w;
          if (!visited[k]) {
            visited[k] = 1;
            stack[top++] = k;
          }
        }
        if (py < h - 1) {
          const k = j + w;
          if (!visited[k]) {
            visited[k] = 1;
            stack[top++] = k;
          }
        }
      }

      if (count >= MIN_BLOB_PX) {
        const baseIdx = peakIdx * 4;
        dots.push({
          // Centroid + radius in raster-pixel space.
          rx: sumX / count,
          ry: sumY / count,
          rr: Math.sqrt(count / Math.PI),
          // RGB sampled at the brightest pixel; alpha is its alpha.
          // Sharp has already pre-multiplied the SVG's fill-opacity
          // (0.3) into the alpha channel, so this is the final dot
          // weight as the design intends.
          r: rgba[baseIdx],
          g: rgba[baseIdx + 1],
          b: rgba[baseIdx + 2],
          a: peakAlpha,
        });
      }
    }
  }
  return dots;
}

const t0 = Date.now();
console.log(`reading ${path.relative(ROOT, SOURCE_SVG)}`);

// Override the SVG's natural width/height so sharp renders at the
// super-sampled resolution. ViewBox is preserved (0 0 1440 875), so
// the matrix transform inside is applied correctly.
const svgRaw = await readFile(SOURCE_SVG, "utf8");
const renderW = RECT_WIDTH * SUPERSAMPLE;
const renderH = RECT_HEIGHT * SUPERSAMPLE;
// Override the SVG's width/height/viewBox to the inner rect's
// natural extent so the full pattern is rendered (not just the
// 1440×875 visible portion). Strip fill-opacity="0.3" so dots stay
// above the blob-detect threshold; runtime re-applies it.
const svgRetargeted = svgRaw
  .replace(
    /<svg[^>]*>/,
    `<svg width="${RECT_WIDTH}" height="${RECT_HEIGHT}" viewBox="${RECT_X} ${RECT_Y} ${RECT_WIDTH} ${RECT_HEIGHT}" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">`
  )
  .replace(/fill-opacity="[^"]*"/g, "");

const { data, info } = await sharp(Buffer.from(svgRetargeted))
  .resize(renderW, renderH, { fit: "fill" })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
console.log(`rendered ${info.width}×${info.height} (${info.channels}ch)`);

const rasterDots = extractDots(data, info.width, info.height);
console.log(`extracted ${rasterDots.length} dots in ${Date.now() - t0}ms`);

// Project raster-space dots into design-pixel space, expressed as
// offsets from the design-viewport centre so the runtime can place
// them at (width/2 + dx, height/2 + dy). Clamp radius to filter
// the rare merged-blob outlier — Figma's dots genuinely vary in
// size (they swell toward the swirl's centre), but a 20+ px blob
// always means two adjacent dots fused.
const MAX_DOT_RADIUS_PX = 5;
const round = (v, p = 3) => Math.round(v * 10 ** p) / 10 ** p;
const dots = rasterDots.map((d) => {
  const designX = RECT_X + d.rx / SUPERSAMPLE;
  const designY = RECT_Y + d.ry / SUPERSAMPLE;
  return {
    dx: round(designX - DESIGN_CENTER_X),
    dy: round(designY - DESIGN_CENTER_Y),
    r: round(Math.min(MAX_DOT_RADIUS_PX, d.rr / SUPERSAMPLE), 3),
    color: `rgb(${d.r},${d.g},${d.b})`,
    alpha: round(d.a / 255, 4),
  };
});

const out = {
  source: path.basename(SOURCE_SVG),
  rectWidth: RECT_WIDTH,
  rectHeight: RECT_HEIGHT,
  superSample: SUPERSAMPLE,
  dotCount: dots.length,
  dots,
};

await writeFile(OUTPUT_JSON, JSON.stringify(out));
console.log(`wrote ${path.relative(ROOT, OUTPUT_JSON)}`);
