// One-off: convert a dashed-path particle SVG (dots drawn as
// `stroke-dasharray: 0 N` round-cap dashes along cubic <path>s) into an
// equivalent SVG where every dot is an explicit <circle cx cy r>.
//
// The geometry is identical: each dash renders as a round cap = a circle
// of diameter = stroke-width, centred every `gap` units of arc length.
// We sample those centres and emit one <circle r=stroke-width/2> each.
//
//   node scripts/svg-paths-to-circles.mjs <in.svg> <out.svg>

import { readFile, writeFile } from "node:fs/promises";

const IN = process.argv[2];
const OUT = process.argv[3];
// Optional: clamp the minimum dot radius to this fraction of the largest
// dot radius (0 = faithful, no clamp; 1 = every dot uniform at the rim
// size, flattening the depth fade so inner dots read as bright as outer).
const MIN_R_FACTOR = Number(process.argv[4] || 0);
if (!IN || !OUT) {
  console.error(
    "usage: node scripts/svg-paths-to-circles.mjs <in.svg> <out.svg> [minRadiusFactor 0..1]",
  );
  process.exit(1);
}

const CUBIC_SEGMENTS = 48;

function flattenCubic(p0, p1, p2, p3, out, n = CUBIC_SEGMENTS) {
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
  let pcx = 0;
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
        i++;
    }
    prevCmd = cmd;
  }
  return pts;
}

const svg = await readFile(IN, "utf8");

let vbW = 1000;
let vbH = 1000;
let viewBox = "0 0 1000 1000";
const vb = svg.match(/viewBox="([^"]+)"/);
if (vb) {
  viewBox = vb[1];
  const p = vb[1].split(/\s+/).map(Number);
  if (p.length === 4) { vbW = p[2]; vbH = p[3]; }
}

// Per-class stroke width + dash gap (only blocks carrying a stroke-width).
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

const r2 = (v) => Math.round(v * 100) / 100;
const r3 = (v) => Math.round(v * 1000) / 1000;

// Largest dot radius across all dot classes — the clamp floor references
// it so MIN_R_FACTOR is expressed relative to the rim's dot size.
let maxR = 0;
for (const s of styleByClass.values()) maxR = Math.max(maxR, s.width / 2);
const rFloor = MIN_R_FACTOR * maxR;

const circles = [];
let paths = 0;
const pathRe = /class="(st\d+)"\s+d="([^"]+)"/g;
let pm;
while ((pm = pathRe.exec(svg)) !== null) {
  const style = styleByClass.get(pm[1]);
  if (!style) continue;
  const poly = pathToPolyline(pm[2]);
  if (poly.length < 2) continue;
  paths++;
  const r = r3(Math.max(style.width / 2, rFloor));
  const emit = (x, y) => circles.push(`<circle cx="${r2(x)}" cy="${r2(y)}" r="${r}"/>`);
  let acc = 0;
  let next = 0;
  emit(poly[0][0], poly[0][1]);
  next += style.gap;
  for (let k = 1; k < poly.length; k++) {
    const [x0, y0] = poly[k - 1];
    const [x1, y1] = poly[k];
    const seg = Math.hypot(x1 - x0, y1 - y0);
    if (seg === 0) continue;
    while (acc + seg >= next) {
      const t = (next - acc) / seg;
      emit(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t);
      next += style.gap;
    }
    acc += seg;
  }
}

// Match the source's root attributes (viewBox only, no width/height, same
// version) so the file scales identically to the original in any context.
const out = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="${viewBox}">
  <rect x="0" y="0" width="${vbW}" height="${vbH}"/>
  <g fill="#fff">
    ${circles.join("\n    ")}
  </g>
</svg>
`;

await writeFile(OUT, out);
console.log(`wrote ${OUT}: ${circles.length} circles from ${paths} paths`);
