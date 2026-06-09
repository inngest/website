// One-off: convert a "filled-dot" particle SVG into one where every dot
// is an explicit <circle cx cy r>.
//
// Some Illustrator exports (e.g. Inngest.Particle10) draw each dot two
// ways in the same file: most as real <circle> elements, but a subset
// as tiny *filled closed paths* (a 4-segment cubic loop, `M … c … s … Z`)
// that visually render as a disc. This normalises the file so every dot
// is a <circle>: real circles pass through untouched; each filled path is
// flattened to a polyline, and its bounding box gives the centre
// (bbox midpoint) and radius (mean half-extent).
//
//   node scripts/svg-filled-paths-to-circles.mjs <in.svg> <out.svg>

import { readFile, writeFile } from "node:fs/promises";

const IN = process.argv[2];
const OUT = process.argv[3];
if (!IN || !OUT) {
  console.error(
    "usage: node scripts/svg-filled-paths-to-circles.mjs <in.svg> <out.svg>",
  );
  process.exit(1);
}

const CUBIC_SEGMENTS = 24;

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

let vbW = 500;
let vbH = 500;
let viewBox = "0 0 500 500";
const vb = svg.match(/viewBox="([^"]+)"/);
if (vb) {
  viewBox = vb[1];
  const p = vb[1].split(/\s+/).map(Number);
  if (p.length === 4) { vbW = p[2]; vbH = p[3]; }
}

const r4 = (v) => Math.round(v * 1e4) / 1e4;

const circles = [];

// 1) Real <circle> elements pass through untouched (already the target form).
let kept = 0;
const circleRe = /<circle\b[^>]*\bcx="([^"]+)"[^>]*\bcy="([^"]+)"[^>]*\br="([^"]+)"[^>]*\/>/g;
let cm;
while ((cm = circleRe.exec(svg)) !== null) {
  circles.push(
    `<circle cx="${r4(parseFloat(cm[1]))}" cy="${r4(parseFloat(cm[2]))}" r="${r4(parseFloat(cm[3]))}"/>`,
  );
  kept++;
}

// 2) Filled closed-path dots → bbox midpoint (centre) + mean half-extent (r).
let converted = 0;
const pathRe = /<path\b[^>]*\bd="([^"]+)"[^>]*\/>/g;
let pm;
while ((pm = pathRe.exec(svg)) !== null) {
  const poly = pathToPolyline(pm[1]);
  if (poly.length < 3) continue;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const [x, y] of poly) {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const r = ((maxX - minX) + (maxY - minY)) / 4; // mean of the two half-extents
  circles.push(`<circle cx="${r4(cx)}" cy="${r4(cy)}" r="${r4(r)}"/>`);
  converted++;
}

// Match the source root (viewBox only, no width/height, same version) so the
// file scales identically in any context. Black background rect, white dots.
const out = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="${viewBox}">
  <rect x="0" y="0" width="${vbW}" height="${vbH}"/>
  <g fill="#fff">
    ${circles.join("\n    ")}
  </g>
</svg>
`;

await writeFile(OUT, out);
console.log(
  `wrote ${OUT}: ${circles.length} circles (${kept} kept, ${converted} from paths)`,
);
