// Extracts the queues-flow-control hero particle pattern from the
// Particle04 SVG export. The SVG is a 500×500 viewBox containing
// many thousand `<circle cx cy r>` elements; we walk them all and
// emit a `{w, h, pts: [x1, y1, x2, y2, ...]}` manifest the shared
// `StippleCanvas` consumes.
//
// Re-run after the design changes:  pnpm v1:extract-qfc-dots

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), "..");
const SOURCE = path.join(ROOT, "scripts/assets/Inngest.Particle04.svg");
const OUTPUT_JSON = path.join(
  ROOT,
  "public/assets/v1/queues-flow-control-hero/dots.json",
);

const t0 = Date.now();

const svg = await readFile(SOURCE, "utf8");

// Pull viewBox to know the source space we should report. Falls back
// to the 500×500 default Inngest's particle exports use if missing.
const viewBoxMatch = svg.match(/viewBox="([^"]+)"/);
let srcW = 500;
let srcH = 500;
if (viewBoxMatch) {
  const parts = viewBoxMatch[1].split(/\s+/).map(Number);
  if (parts.length === 4) {
    srcW = parts[2];
    srcH = parts[3];
  }
}

// Walk every `<circle cx cy r>` — accept arbitrary attribute ordering.
// We keep `r` so StippleCanvas can preserve the SVG's depth-cued dot
// fade (radii shrink from outer edges to inner cube faces).
const circleRe = /<circle\b[^/]*\/>/g;
const cxRe = /\bcx="([\d.+-]+)"/;
const cyRe = /\bcy="([\d.+-]+)"/;
const rRe = /\br="([\d.+-]+)"/;

const pts = [];
const rs = [];
let m;
let skipped = 0;
while ((m = circleRe.exec(svg)) !== null) {
  const tag = m[0];
  const cx = tag.match(cxRe);
  const cy = tag.match(cyRe);
  const r = tag.match(rRe);
  if (!cx || !cy) {
    skipped++;
    continue;
  }
  const x = Number(cx[1]);
  const y = Number(cy[1]);
  const radius = r ? Number(r[1]) : 1;
  if (Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(radius)) {
    // 1-decimal coords: in the 500-unit viewBox these land within
    // ~0.2px at the rendered panel size — invisible — and shave ~13KB
    // gzipped off the SSR-inlined manifest vs 2dp. Radii normalise
    // against their own max in the canvas, so 2dp is plenty.
    pts.push(Math.round(x * 10) / 10, Math.round(y * 10) / 10);
    rs.push(Math.round(radius * 100) / 100);
  } else {
    skipped++;
  }
}

const dotCount = pts.length / 2;

await mkdir(path.dirname(OUTPUT_JSON), { recursive: true });
await writeFile(
  OUTPUT_JSON,
  JSON.stringify({
    source: path.relative(ROOT, SOURCE),
    w: srcW,
    h: srcH,
    dotCount,
    pts,
    rs,
  }),
);

const ms = Date.now() - t0;
console.log(
  `extract-qfc-dots: ${dotCount} dots from ${path.basename(SOURCE)} → ${path.relative(ROOT, OUTPUT_JSON)} (skipped ${skipped}, ${ms}ms)`,
);
