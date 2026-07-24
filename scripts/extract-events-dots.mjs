// Extracts the events hero particle pattern into a static JSON
// catalogue of dot centres.
//
// Source: scripts/assets/events-particle.svg ("ParticleA01"),
// a 1000×1000 viewBox. Like the durable-execution export, dots are
// stroked `<path>` elements styled with `stroke-dasharray: 0 ~10` and
// `stroke-linecap: round` — i.e. one round-capped dash every 10 user
// units along each path. We walk every path with its `d` command,
// flattening cubic Béziers to short polylines, then emit a centre
// every 10 units of accumulated arc length.
//
// Re-run after the design changes:  pnpm v1:extract-events-dots

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), "..");
const SOURCE = path.join(
  ROOT,
  "scripts/assets/events-particle.svg"
);
const OUTPUT_JSON = path.join(
  ROOT,
  "public/assets/v1/events-hero/dots.json"
);

// Dash period from the stylesheet (`stroke-dasharray: 0 10`).
const DASH_PERIOD = 10;
// Cubic-Bézier flatness: max segment length when subdividing curves
// into polylines. Smaller = more accurate at higher script cost. The
// paths here are smooth long arcs, so 1 source unit (≈0.5 px at the
// panel scale) keeps dot placement pixel-exact without ballooning the
// flattened vertex count.
const FLATTEN_STEP = 1;

const svg = await readFile(SOURCE, "utf8");
const t0 = Date.now();

const dots = [];

// Walk a continuous polyline (already flattened) and push a dot every
// DASH_PERIOD units. SVG dashes run continuously across vertices, so
// the accumulator never resets between segments.
function walkPolyline(pts) {
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

// Sample a cubic Bézier into ~equal-length steps via uniform-t
// subdivision. Good enough for visually-smooth arcs at FLATTEN_STEP
// resolution; the dot stride later corrects any minor stride drift.
function flattenCubic(p0, p1, p2, p3, out) {
  // Chord length is a reasonable upper bound on arc length for the
  // short curves Illustrator emits.
  const chord =
    Math.hypot(p3.x - p0.x, p3.y - p0.y) +
    Math.hypot(p1.x - p0.x, p1.y - p0.y) +
    Math.hypot(p2.x - p1.x, p2.y - p1.y) +
    Math.hypot(p3.x - p2.x, p3.y - p2.y);
  const steps = Math.max(2, Math.ceil(chord / FLATTEN_STEP));
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const u = 1 - t;
    const x =
      u * u * u * p0.x +
      3 * u * u * t * p1.x +
      3 * u * t * t * p2.x +
      t * t * t * p3.x;
    const y =
      u * u * u * p0.y +
      3 * u * u * t * p1.y +
      3 * u * t * t * p2.y +
      t * t * t * p3.y;
    out.push({ x, y });
  }
}

// Tokenise an SVG path's `d`. Returns an array like
// `["M", 12.3, 45.6, "c", -1, 0, ...]` with letters and numbers split.
function tokenise(d) {
  const tokens = [];
  const re = /([MmLlHhVvCcSsQqTtAaZz])|(-?\d*\.?\d+(?:e[-+]?\d+)?)/g;
  let m;
  while ((m = re.exec(d))) {
    if (m[1]) tokens.push(m[1]);
    else tokens.push(parseFloat(m[2]));
  }
  return tokens;
}

// Convert a path's `d` into a list of flattened polylines (each is an
// array of {x, y}). Supports M/L/H/V/C/S/Z (relative & absolute),
// which is everything Illustrator emits for this particle export.
function pathToPolylines(d) {
  const tokens = tokenise(d);
  const polylines = [];
  let current = [];
  let startX = 0;
  let startY = 0;
  let x = 0;
  let y = 0;
  // Previous cubic's second control reflected — used by `s`/`S` to
  // continue smooth cubics without re-specifying control point 1.
  let prevC2X = null;
  let prevC2Y = null;
  let cmd = null;
  let i = 0;
  function flushPoint(px, py) {
    if (current.length === 0) current.push({ x: px, y: py });
    else current.push({ x: px, y: py });
  }
  function endSubpath() {
    if (current.length > 1) polylines.push(current);
    current = [];
  }
  while (i < tokens.length) {
    const tok = tokens[i];
    if (typeof tok === "string") {
      cmd = tok;
      i++;
      if (cmd === "Z" || cmd === "z") {
        if (current.length > 0) current.push({ x: startX, y: startY });
        endSubpath();
        x = startX;
        y = startY;
        prevC2X = prevC2Y = null;
        continue;
      }
      continue;
    }
    const isRel = cmd === cmd?.toLowerCase();
    if (cmd === "M" || cmd === "m") {
      endSubpath();
      const nx = isRel ? x + tokens[i] : tokens[i];
      const ny = isRel ? y + tokens[i + 1] : tokens[i + 1];
      x = nx;
      y = ny;
      startX = x;
      startY = y;
      flushPoint(x, y);
      prevC2X = prevC2Y = null;
      i += 2;
      // Subsequent coordinate pairs after M act as implicit L/l.
      cmd = isRel ? "l" : "L";
    } else if (cmd === "L" || cmd === "l") {
      x = isRel ? x + tokens[i] : tokens[i];
      y = isRel ? y + tokens[i + 1] : tokens[i + 1];
      flushPoint(x, y);
      prevC2X = prevC2Y = null;
      i += 2;
    } else if (cmd === "H" || cmd === "h") {
      x = isRel ? x + tokens[i] : tokens[i];
      flushPoint(x, y);
      prevC2X = prevC2Y = null;
      i += 1;
    } else if (cmd === "V" || cmd === "v") {
      y = isRel ? y + tokens[i] : tokens[i];
      flushPoint(x, y);
      prevC2X = prevC2Y = null;
      i += 1;
    } else if (cmd === "C" || cmd === "c") {
      const c1x = isRel ? x + tokens[i] : tokens[i];
      const c1y = isRel ? y + tokens[i + 1] : tokens[i + 1];
      const c2x = isRel ? x + tokens[i + 2] : tokens[i + 2];
      const c2y = isRel ? y + tokens[i + 3] : tokens[i + 3];
      const nx = isRel ? x + tokens[i + 4] : tokens[i + 4];
      const ny = isRel ? y + tokens[i + 5] : tokens[i + 5];
      flattenCubic(
        { x, y },
        { x: c1x, y: c1y },
        { x: c2x, y: c2y },
        { x: nx, y: ny },
        current
      );
      x = nx;
      y = ny;
      prevC2X = c2x;
      prevC2Y = c2y;
      i += 6;
    } else if (cmd === "S" || cmd === "s") {
      const c1x = prevC2X != null ? 2 * x - prevC2X : x;
      const c1y = prevC2Y != null ? 2 * y - prevC2Y : y;
      const c2x = isRel ? x + tokens[i] : tokens[i];
      const c2y = isRel ? y + tokens[i + 1] : tokens[i + 1];
      const nx = isRel ? x + tokens[i + 2] : tokens[i + 2];
      const ny = isRel ? y + tokens[i + 3] : tokens[i + 3];
      flattenCubic(
        { x, y },
        { x: c1x, y: c1y },
        { x: c2x, y: c2y },
        { x: nx, y: ny },
        current
      );
      x = nx;
      y = ny;
      prevC2X = c2x;
      prevC2Y = c2y;
      i += 4;
    } else {
      // Unsupported command — skip one number and hope for the best.
      i++;
    }
  }
  endSubpath();
  return polylines;
}

for (const m of svg.matchAll(/<path[^>]*\bd="([^"]+)"/g)) {
  const polylines = pathToPolylines(m[1]);
  for (const pl of polylines) walkPolyline(pl);
}

// Drop overlap duplicates. Coords are rounded to 1 decimal in the
// 1000-unit source space (sub-pixel at runtime panel scale).
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
  w: 1000,
  h: 1000,
  dotCount: pts.length / 2,
  // Flat [x0,y0, x1,y1, ...] in the SVG's 1000×1000 source space.
  pts,
};

await mkdir(path.dirname(OUTPUT_JSON), { recursive: true });
await writeFile(OUTPUT_JSON, JSON.stringify(out));
console.log(`walked paths: ${dots.length} raw dots, dropped ${dropped}`);
console.log(
  `wrote ${path.relative(ROOT, OUTPUT_JSON)} (${out.dotCount} dots, ${Date.now() - t0}ms)`
);
