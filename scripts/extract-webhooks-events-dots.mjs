// Extracts the webhooks-events hero particle pattern into a static JSON
// catalogue of dot centres, radii, and colour.
//
// Source: `scripts/assets/webhooks-events-particle.svg` — the Illustrator
// export where each dot is a round-cap dash (`stroke-dasharray: 0 ~10`)
// along a cubic <path>. Each dash renders as a circle of diameter =
// stroke-width, repeating every `gap` units of arc length. We flatten
// each path, step along its arc length at the dash period, and emit one
// dot per dash — radius = stroke-width / 2, colour = the stroke colour —
// so StippleCanvas reproduces the SVG's per-dot size variation and fill.
//
// (`scripts/svg-paths-to-circles.mjs` turns the same source into an
// explicit-circle SVG for design hand-off; the dots here are sampled
// identically, so no intermediate circle artifact is committed.)
//
// Paths use only M / c / s / Z (all cubics, no arcs).
//
// Re-run after the design changes:  pnpm v1:extract-we-dots

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), "..");
const SOURCE = path.join(ROOT, "scripts/assets/webhooks-events-particle.svg");
const OUTPUT_JSON = path.join(
  ROOT,
  "public/assets/v1/webhooks-events-hero/dots.json",
);

// Segments per cubic when flattening to a polyline for arc-length
// stepping. The dash period is ~10 source-units over gentle curves, so
// 48 keeps the resampled dot spacing even to well under a dot radius.
const CUBIC_SEGMENTS = 48;

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
let srcW = 1000;
let srcH = 1000;
const vb = svg.match(/viewBox="([^"]+)"/);
if (vb) {
  const p = vb[1].split(/\s+/).map(Number);
  if (p.length === 4) {
    srcW = p[2];
    srcH = p[3];
  }
}

// Dot colour = the stroke colour shared by every path (`stroke: #fff`).
const strokeMatch = svg.match(/stroke:\s*(#[0-9a-fA-F]{3,8}|rgba?\([^)]*\))/);
const fill = strokeMatch ? strokeMatch[1] : "#ffffff";

// Per-class style: dash gap + stroke width. Only blocks carrying a
// stroke-width are dot classes (the shared fill/stroke rule has none).
const styleByClass = new Map();
const ruleRe = /\.st(\d+)\s*\{([^}]*)\}/g;
let rm;
while ((rm = ruleRe.exec(svg)) !== null) {
  const w = rm[2].match(/stroke-width:\s*([\d.]+)px/);
  if (!w) continue;
  const dash = rm[2].match(/stroke-dasharray:\s*0\s+([\d.]+)/);
  styleByClass.set(`st${rm[1]}`, {
    width: parseFloat(w[1]),
    gap: dash ? parseFloat(dash[1]) : 10,
  });
}

const pts = [];
const rs = [];
let paths = 0;
const pathRe = /class="(st\d+)"\s+d="([^"]+)"/g;
let pmatch;
while ((pmatch = pathRe.exec(svg)) !== null) {
  const style = styleByClass.get(pmatch[1]);
  if (!style) continue;
  const poly = pathToPolyline(pmatch[2]);
  if (poly.length < 2) continue;
  paths++;
  const r = style.width / 2;
  // Step along arc length at the dash period; first dot at offset 0.
  let acc = 0;
  let next = 0;
  pts.push(poly[0][0], poly[0][1]);
  rs.push(r);
  next += style.gap;
  for (let k = 1; k < poly.length; k++) {
    const x0 = poly[k - 1][0];
    const y0 = poly[k - 1][1];
    const x1 = poly[k][0];
    const y1 = poly[k][1];
    const seg = Math.hypot(x1 - x0, y1 - y0);
    if (seg === 0) continue;
    while (acc + seg >= next) {
      const t = (next - acc) / seg;
      pts.push(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t);
      rs.push(r);
      next += style.gap;
    }
    acc += seg;
  }
}

// 1dp positions (sub-panel-pixel at the rendered size); 2dp radii —
// StippleCanvas normalises radii against their own max, so 2dp is plenty
// (matches the flow-control extractor).
for (let i = 0; i < pts.length; i++) pts[i] = Math.round(pts[i] * 10) / 10;
for (let i = 0; i < rs.length; i++) rs[i] = Math.round(rs[i] * 100) / 100;

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
  `extract-we-dots: ${dotCount} dots from ${paths} paths in ${path.basename(SOURCE)} → ${path.relative(ROOT, OUTPUT_JSON)} (fill ${fill}, ${Date.now() - t0}ms)`,
);
