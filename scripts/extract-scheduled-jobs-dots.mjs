// Extracts the scheduled-jobs (cron) hero swirl pattern into a static JSON
// catalogue of dot centres, radii, and colour.
//
// Source: `scripts/assets/scheduled-jobs-particle.svg` — the Illustrator
// export "Inngest.Particle10", a 500×500 viewBox of white dots on a black
// `<rect>`. The export encodes dots two ways in the same file: most as
// real `<circle cx cy r>` elements, and a subset as tiny *filled closed
// paths* (a 4-segment cubic loop `M … c … s … Z`) that render as a disc.
// We keep the real circles verbatim and convert each filled path via its
// bounding box (centre = bbox midpoint, radius = mean half-extent), so the
// manifest carries the SVG's exact positions, per-dot size fade, and fill.
//
// (`scripts/svg-filled-paths-to-circles.mjs` turns the same source into an
// explicit-circle SVG for design hand-off; the dots here are sampled
// identically.)
//
// Paths use only M / c / s / Z (all cubics, no arcs).
//
// Re-run after the design changes:  pnpm v1:extract-sj-dots

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), "..");
const SOURCE = path.join(ROOT, "scripts/assets/scheduled-jobs-particle.svg");
const OUTPUT_JSON = path.join(
  ROOT,
  "public/assets/v1/scheduled-jobs-hero/dots.json",
);

// Segments per cubic when flattening a filled-path dot to a polyline. The
// loops are sub-unit discs, so 24 segments puts the bbox extent well under
// a thousandth of a unit off the true circle.
const CUBIC_SEGMENTS = 24;

function flattenCubic(p0, p1, p2, p3, out, n = CUBIC_SEGMENTS) {
  // Appends points for t in (0, 1]; p0 is already the last point in `out`.
  for (let k = 1; k <= n; k++) {
    const t = k / n;
    const mt = 1 - t;
    const a = mt * mt * mt;
    const b = 3 * mt * mt * t;
    const c = 3 * mt * t * t;
    const e = t * t * t;
    out.push([
      a * p0[0] + b * p1[0] + c * p2[0] + e * p3[0],
      a * p0[1] + b * p1[1] + c * p2[1] + e * p3[1],
    ]);
  }
}

function pathToPolyline(d) {
  const toks = d.match(/[MmZzLlCcSs]|-?\d*\.?\d+(?:[eE][-+]?\d+)?/g);
  if (!toks) return [];
  const pts = [];
  let i = 0;
  let cmd = "";
  let prevCmd = "";
  let cx = 0;
  let cy = 0;
  let sx = 0;
  let sy = 0;
  let pcx = 0; // previous cubic's 2nd control point (for smooth s/S)
  let pcy = 0;
  const num = () => parseFloat(toks[i++]);
  while (i < toks.length) {
    if (/[A-Za-z]/.test(toks[i])) cmd = toks[i++];
    switch (cmd) {
      case "M":
        cx = num(); cy = num(); sx = cx; sy = cy; pts.push([cx, cy]); cmd = "L"; break;
      case "m":
        cx += num(); cy += num(); sx = cx; sy = cy; pts.push([cx, cy]); cmd = "l"; break;
      case "L":
        cx = num(); cy = num(); pts.push([cx, cy]); break;
      case "l":
        cx += num(); cy += num(); pts.push([cx, cy]); break;
      case "C": {
        const c1 = [num(), num()]; const c2 = [num(), num()]; const e = [num(), num()];
        flattenCubic([cx, cy], c1, c2, e, pts); [pcx, pcy] = c2; [cx, cy] = e; break;
      }
      case "c": {
        const c1 = [cx + num(), cy + num()]; const c2 = [cx + num(), cy + num()]; const e = [cx + num(), cy + num()];
        flattenCubic([cx, cy], c1, c2, e, pts); [pcx, pcy] = c2; [cx, cy] = e; break;
      }
      case "S": {
        const refl = /[CcSs]/.test(prevCmd);
        const c1 = refl ? [2 * cx - pcx, 2 * cy - pcy] : [cx, cy];
        const c2 = [num(), num()]; const e = [num(), num()];
        flattenCubic([cx, cy], c1, c2, e, pts); [pcx, pcy] = c2; [cx, cy] = e; break;
      }
      case "s": {
        const refl = /[CcSs]/.test(prevCmd);
        const c1 = refl ? [2 * cx - pcx, 2 * cy - pcy] : [cx, cy];
        const c2 = [cx + num(), cy + num()]; const e = [cx + num(), cy + num()];
        flattenCubic([cx, cy], c1, c2, e, pts); [pcx, pcy] = c2; [cx, cy] = e; break;
      }
      case "Z":
      case "z":
        pts.push([sx, sy]); cx = sx; cy = sy; break;
      default:
        i++; // unknown token — skip defensively
    }
    prevCmd = cmd;
  }
  return pts;
}

const t0 = Date.now();
const svg = await readFile(SOURCE, "utf8");

// viewBox → reported source space (StippleCanvas normalises against it).
let srcW = 500;
let srcH = 500;
const vb = svg.match(/viewBox="([^"]+)"/);
if (vb) {
  const p = vb[1].split(/\s+/).map(Number);
  if (p.length === 4) {
    srcW = p[2];
    srcH = p[3];
  }
}

// Dot colour = the shared `.st0` fill (`fill: #fff`).
const fillMatch = svg.match(
  /\.st0\s*\{[^}]*fill:\s*(#[0-9a-fA-F]{3,8}|rgba?\([^)]*\))/,
);
const fill = fillMatch ? fillMatch[1] : "#fff";

const pts = [];
const rs = [];

// 1) Real <circle cx cy r> — emit verbatim.
let circles = 0;
const circleRe =
  /<circle\b[^>]*\bcx="([^"]+)"[^>]*\bcy="([^"]+)"[^>]*\br="([^"]+)"[^>]*\/>/g;
let cm;
while ((cm = circleRe.exec(svg)) !== null) {
  pts.push(parseFloat(cm[1]), parseFloat(cm[2]));
  rs.push(parseFloat(cm[3]));
  circles++;
}

// 2) Filled closed-path dots → bbox midpoint (centre) + mean half-extent (r).
let paths = 0;
const pathRe = /<path\b[^>]*\bd="([^"]+)"[^>]*\/>/g;
let pm;
while ((pm = pathRe.exec(svg)) !== null) {
  const poly = pathToPolyline(pm[1]);
  if (poly.length < 3) continue;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const [x, y] of poly) {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
  pts.push((minX + maxX) / 2, (minY + maxY) / 2);
  rs.push((maxX - minX + (maxY - minY)) / 4); // mean of the two half-extents
  paths++;
}

// 2dp positions (the 500-unit source maps to a ~480px panel, so 0.01u is
// far below a device pixel); 3dp radii — the dots are sub-unit (~0.09–0.25)
// and StippleCanvas normalises radii against their own max, so 3dp keeps
// the depth fade smooth while staying compact.
for (let i = 0; i < pts.length; i++) pts[i] = Math.round(pts[i] * 100) / 100;
for (let i = 0; i < rs.length; i++) rs[i] = Math.round(rs[i] * 1000) / 1000;

const dotCount = pts.length / 2;
await mkdir(path.dirname(OUTPUT_JSON), { recursive: true });
await writeFile(
  OUTPUT_JSON,
  JSON.stringify({
    source: path.basename(SOURCE),
    w: srcW,
    h: srcH,
    dotCount,
    fill,
    pts,
    rs,
  }),
);

console.log(
  `extract-sj-dots: ${dotCount} dots (${circles} circles + ${paths} paths) in ${path.basename(SOURCE)} → ${path.relative(ROOT, OUTPUT_JSON)} (fill ${fill}, ${Date.now() - t0}ms)`,
);
