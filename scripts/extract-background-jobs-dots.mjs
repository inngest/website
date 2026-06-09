// Extracts the background-jobs hero stippled-mountains pattern into a
// static JSON catalogue of dot centres.
//
// Source: the figma export (`scripts/assets/background-jobs-dots.png`),
// a 4096×4096 RGBA stipple with low-alpha gray dots on a transparent
// canvas. Procedure mirrors `extract-dot-swirl.mjs`: blob-scan the
// alpha channel above a threshold, emit one entry per dot with its
// centroid + radius in design-pixel space (1440 hero column units),
// then project those into the same coordinate frame the runtime
// canvas will use.
//
// Re-run after the design changes:  pnpm v1:extract-bg-jobs-dots

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), "..");
const SOURCE = path.join(ROOT, "scripts/assets/background-jobs-dots.png");
const OUTPUT_JSON = path.join(
  ROOT,
  "public/assets/v1/background-jobs-hero/dots.json"
);

// Native resolution to scan at. The source is 4096×4096; reading it
// raw gives us ~2.5 raster-px per dot core, plenty for centroid
// recovery and well under a second to scan.
const RENDER_W = 4096;
const RENDER_H = 4096;

// Source dots are gray (RGB ~24) with low alpha (~65/255). We
// threshold on alpha — anything below 40 is considered background.
// Tuned so soft dot halos don't bridge into oversized blobs.
const ALPHA_THRESHOLD = 40;
const MIN_BLOB_PX = 4;
const MAX_BLOB_PX = 400; // safety cap — caps merged-cluster outliers

// Reference frame for the manifest. We emit dot positions normalised
// to the IMAGE (0..1 of its width/height) so the runtime can scale +
// position the field with the same anchor logic used for the static
// image (figma: image is 932 square, anchored at top -44.44 inside a
// 799 px panel — i.e. image height = 932/799 = 116.71% of panel
// height, centred horizontally).
const IMG_PANEL_SIZE = 932.479;

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

// Project raster-space centroids into PANEL space:
//   image_px = (raster_px / RENDER_W) * IMG_PANEL_SIZE
//   panel_px = image_px + IMG_OFFSET_{X,Y}
// Then normalise to [0..1] relative to PANEL_{W,H} so the runtime
// can scale to whatever width/height the panel ends up at.
const round = (v, p = 4) => Math.round(v * 10 ** p) / 10 ** p;
// Image-space normalised coords [0..1] of the 932-px square figma
// image, then projected to source px. The field renders as a uniform
// stipple, so the raster pass's per-dot radius/alpha are dropped —
// only x/y survive.
const inside = rasterDots
  .map((d) => ({ x: d.rx / info.width, y: d.ry / info.height }))
  .filter((d) => d.x >= 0 && d.x <= 1 && d.y >= 0 && d.y <= 1);

const out = {
  source: path.basename(SOURCE),
  // Source space = the 932-px square image. StippleCanvas reads
  // `{w,h,pts}` with pts in source px (stride-2), same as every other
  // hero manifest. 1dp keeps it sub-pixel at the rendered panel size.
  w: IMG_PANEL_SIZE,
  h: IMG_PANEL_SIZE,
  dotCount: inside.length,
  pts: inside.flatMap((d) => [
    round(d.x * IMG_PANEL_SIZE, 1),
    round(d.y * IMG_PANEL_SIZE, 1),
  ]),
};

await writeFile(OUTPUT_JSON, JSON.stringify(out));
console.log(
  `wrote ${path.relative(ROOT, OUTPUT_JSON)} (${inside.length} dots)`
);
