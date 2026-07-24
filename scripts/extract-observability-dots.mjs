// Extracts the observability hero wireframe-perspective pattern into a
// static JSON catalogue of dot centres.
//
// Source: the Figma vector export (`scripts/assets/observability-particles.svg`,
// "Particle22"), a 500×500 viewBox. The dotted look is NOT discrete
// circles — it's `<polyline>` / `<line>` / `<rect>` strokes styled with
// `stroke-dasharray: 0 3; stroke-linecap: round`, i.e. a zero-length
// dash (a round cap = one dot) every 3 user units along each path. So
// we reproduce the exact dots by walking each path's arc length and
// emitting a centre every 3 units — far cleaner than rasterising the
// PNG and peak-detecting (no anti-aliased halos, no fused-dot guessing).
//
// Output is in the SVG's 500×500 source space; ObservabilityDotsCanvas
// maps that into the hero's right panel via its FigmaFrame.
//
// Re-run after the design changes:  pnpm v1:extract-observability-dots

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), "..");
const SOURCE = path.join(ROOT, "scripts/assets/observability-particles.svg");
const OUTPUT_JSON = path.join(
  ROOT,
  "public/assets/v1/observability-hero/dots.json"
);

// Dash period from the stylesheet (`stroke-dasharray: 0 3`): a dot every
// 3 user units, with the first at arc-length 0.
const DASH_PERIOD = 3;

const svg = await readFile(SOURCE, "utf8");
const t0 = Date.now();

const dots = [];

// Walk a continuous path (array of {x,y} vertices) and push a dot every
// DASH_PERIOD units of cumulative arc length, starting at 0. SVG dash
// patterns run continuously across a polyline's vertices (they don't
// reset per segment), so we accumulate across the whole path.
function walkPath(pts) {
  if (pts.length === 0) return;
  dots.push([pts[0].x, pts[0].y]);
  let acc = 0;
  let next = DASH_PERIOD;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const segLen = Math.hypot(dx, dy);
    if (segLen === 0) continue;
    const ux = dx / segLen;
    const uy = dy / segLen;
    while (next <= acc + segLen + 1e-9) {
      const d = next - acc;
      dots.push([a.x + ux * d, a.y + uy * d]);
      next += DASH_PERIOD;
    }
    acc += segLen;
  }
}

// <polyline class="st0" points="x0 y0 x1 y1 ...">
for (const m of svg.matchAll(/<polyline[^>]*\bpoints="([^"]+)"/g)) {
  const nums = m[1].trim().split(/[\s,]+/).map(Number);
  const pts = [];
  for (let i = 0; i + 1 < nums.length; i += 2) {
    pts.push({ x: nums[i], y: nums[i + 1] });
  }
  walkPath(pts);
}

// <line class="st0" x1 y1 x2 y2>
for (const m of svg.matchAll(
  /<line[^>]*\bx1="([^"]+)"[^>]*\by1="([^"]+)"[^>]*\bx2="([^"]+)"[^>]*\by2="([^"]+)"/g
)) {
  walkPath([
    { x: +m[1], y: +m[2] },
    { x: +m[3], y: +m[4] },
  ]);
}

// <rect class="st0" ...> — the centre box, walked as a closed perimeter.
for (const m of svg.matchAll(
  /<rect[^>]*\bclass="st0"[^>]*\bx="([^"]+)"[^>]*\by="([^"]+)"[^>]*\bwidth="([^"]+)"[^>]*\bheight="([^"]+)"/g
)) {
  const x = +m[1];
  const y = +m[2];
  const w = +m[3];
  const h = +m[4];
  walkPath([
    { x, y },
    { x: x + w, y },
    { x: x + w, y: y + h },
    { x, y: y + h },
    { x, y },
  ]);
}

// Drop overlap duplicates (fan lines share the vanishing point, so many
// paths emit a dot at the same origin). Coords are rounded to 1 decimal
// in the 500-unit source space: at the panel's runtime scale (~1.4–2×)
// that's ~0.15–0.2 px, i.e. sub-pixel, so it shrinks the manifest ~25%
// with no visible change and collapses dots that'd land on one pixel.
const round = (v, p = 1) => Math.round(v * 10 ** p) / 10 ** p;
const seen = new Set();
const pts = [];
let dropped = 0;
for (const [x, y] of dots) {
  const rx = round(x);
  const ry = round(y);
  const key = `${rx},${ry}`;
  if (seen.has(key)) {
    dropped++;
    continue;
  }
  seen.add(key);
  pts.push(rx, ry);
}

const out = {
  source: path.basename(SOURCE),
  w: 500,
  h: 500,
  dotCount: pts.length / 2,
  // Flat [x0,y0, x1,y1, ...] in the SVG's 500×500 source space.
  pts,
};

await mkdir(path.dirname(OUTPUT_JSON), { recursive: true });
await writeFile(OUTPUT_JSON, JSON.stringify(out));
console.log(
  `walked paths: ${dots.length} raw dots, dropped ${dropped} exact overlaps`
);
console.log(
  `wrote ${path.relative(ROOT, OUTPUT_JSON)} (${out.dotCount} dots, ${Date.now() - t0}ms)`
);
