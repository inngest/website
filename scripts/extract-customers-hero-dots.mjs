// Extracts the customers-hero sphere stipple pattern into a static JSON
// catalogue of dot centres. Same playbook as
// `extract-background-jobs-dots.mjs` — blob-scan the alpha channel,
// emit centroid + raster radius per blob, normalise to [0..1] in image
// space so the runtime canvas can scale the field to any panel size.
//
// Source: figma export at scripts/assets/customers-hero-dots.png
// (2084×2084 RGBA, white-fill dots with low-alpha halos on transparent
// background — the sphere lattice from the customers hero design).
//
// Re-run after the design changes:
//   pnpm v1:extract-customers-dots

import { writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), "..");
const SOURCE = path.join(ROOT, "scripts/assets/customers-hero-dots.png");
const OUTPUT_JSON = path.join(
  ROOT,
  "public/assets/v1/customers-hero/dots.json",
);

// Scan at native source resolution (2084 square). Up-rasterising adds
// no signal — the stipple grain is already aliased to source pixels.
const RENDER_W = 2084;
const RENDER_H = 2084;

// Dots are RGB(255) with alpha mostly in [20..255]. The sphere has
// many sub-pixel-faint stipples (the radial rays), so threshold low
// to capture them; MIN_BLOB_PX=1 keeps single-pixel dots.
const ALPHA_THRESHOLD = 18;
const MIN_BLOB_PX = 1;
const MAX_BLOB_PX = 400;

// Source canvas is square; emit normalised [0..1] coords and keep the
// reference image size for the manifest header.
const IMG_PANEL_SIZE = 2084;

// Margin (fraction of bbox) added around the dot cluster so the
// sphere doesn't touch the panel edges after bbox normalisation.
const BBOX_MARGIN = 0.04;

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

      while (top > 0) {
        const j = stack[--top];
        const a = rgba[j * 4 + 3];
        if (a < ALPHA_THRESHOLD) continue;
        const px = j % w;
        const py = (j / w) | 0;
        sumX += px;
        sumY += py;
        count++;
        if (a > peakAlpha) peakAlpha = a;
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

      if (count >= MIN_BLOB_PX && count <= MAX_BLOB_PX) {
        dots.push({
          rx: sumX / count,
          ry: sumY / count,
          rr: Math.sqrt(count / Math.PI),
          alpha: peakAlpha,
        });
      }
    }
  }
  return dots;
}

const t0 = Date.now();
console.log(`reading ${path.relative(ROOT, SOURCE)}`);

const { data, info } = await sharp(SOURCE)
  .resize(RENDER_W, RENDER_H, { fit: "fill" })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
console.log(`raster ${info.width}×${info.height} (${info.channels}ch)`);

const rasterDots = extractDots(data, info.width, info.height);
console.log(`extracted ${rasterDots.length} dots in ${Date.now() - t0}ms`);

const round = (v, p = 4) => Math.round(v * 10 ** p) / 10 ** p;
const MIN_DOT_RADIUS_DESIGN = 0.6;
const MAX_DOT_RADIUS_DESIGN = 3.5;

// Compute dot bounding box in raster space so we can re-normalise to
// [0..1] of the cluster (not the source PNG). The source has heavy
// transparent padding; without this, the runtime renders the sphere
// at a fraction of the panel size.
let minRx = Infinity;
let minRy = Infinity;
let maxRx = -Infinity;
let maxRy = -Infinity;
for (const d of rasterDots) {
  if (d.rx < minRx) minRx = d.rx;
  if (d.ry < minRy) minRy = d.ry;
  if (d.rx > maxRx) maxRx = d.rx;
  if (d.ry > maxRy) maxRy = d.ry;
}
// Preserve the cluster's aspect ratio by using a square bbox sized to
// the longer side — the sphere then stays circular under any
// (contain|cover) fit at runtime.
const cx = (minRx + maxRx) / 2;
const cy = (minRy + maxRy) / 2;
const halfSide = Math.max(maxRx - minRx, maxRy - minRy) / 2;
const bboxHalf = halfSide * (1 + BBOX_MARGIN);
const bboxMinX = cx - bboxHalf;
const bboxMinY = cy - bboxHalf;
const bboxSize = bboxHalf * 2;
console.log(
  `dot bbox (square, padded): origin=(${bboxMinX.toFixed(0)}, ${bboxMinY.toFixed(0)}) size=${bboxSize.toFixed(0)} px`,
);

// The runtime expects radii to scale with the manifest's reference
// canvas, so emit them in "bbox-pixel" space (i.e. as if the cluster
// were the full IMG_PANEL_SIZE square). Same scaling factor applies.
const radiusScale = IMG_PANEL_SIZE / bboxSize;

const dots = rasterDots.map((d) => {
  const nx = (d.rx - bboxMinX) / bboxSize;
  const ny = (d.ry - bboxMinY) / bboxSize;
  // raster radius → IMG_PANEL_SIZE-space radius via the same factor.
  const designR = (d.rr / info.width) * IMG_PANEL_SIZE * radiusScale;
  return {
    x: round(nx),
    y: round(ny),
    r: round(
      Math.min(MAX_DOT_RADIUS_DESIGN, Math.max(MIN_DOT_RADIUS_DESIGN, designR)),
    ),
    a: round(d.alpha / 255),
  };
});

const inside = dots.filter(
  (d) => d.x >= 0 && d.x <= 1 && d.y >= 0 && d.y <= 1,
);

const out = {
  source: path.basename(SOURCE),
  imageSize: IMG_PANEL_SIZE,
  dotCount: inside.length,
  // Flat array form keeps the JSON tiny: [x0,y0,r0,a0,...].
  pts: inside.flatMap((d) => [d.x, d.y, d.r, d.a]),
};

await mkdir(path.dirname(OUTPUT_JSON), { recursive: true });
await writeFile(OUTPUT_JSON, JSON.stringify(out));
console.log(
  `wrote ${path.relative(ROOT, OUTPUT_JSON)} (${inside.length} dots, ${(JSON.stringify(out).length / 1024).toFixed(1)} KB)`,
);
