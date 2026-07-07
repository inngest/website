// Extracts the agent-evals hero shape into a static JSON catalogue of dot
// centres for StippleCanvas.
//
// Source: scripts/assets/agentevals-particle.svg — a 1000×1600 Figma
// export where every dot is its own small filled <path> (a tiny bezier
// circle), ~2.7k of them, over background <rect>s. Unlike the
// dashed-stroke particle exports (observability etc.), there are no
// stroke-dasharray paths to walk; instead each <path> IS one dot, so we
// take the centre of each path's coordinate bounding box.
//
// Output keeps the full 1000×1600 source frame (the artboard already
// matches the hero panel's portrait aspect), so AgentEvalsDotsCanvas can
// `object-fit: cover` it with minimal cropping.
//
// Re-run after the design changes:  pnpm v1:extract-ae-dots

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), "..");
const SOURCE = path.join(ROOT, "scripts/assets/agentevals-particle.svg");
const OUTPUT_JSON = path.join(
  ROOT,
  "public/assets/v1/agent-evals-hero/dots.json"
);

// Full source artboard — dots are emitted in this coordinate space.
const FRAME_W = 1000;
const FRAME_H = 1600;

const svg = await readFile(SOURCE, "utf8");
const t0 = Date.now();

// Every dot is a `<path … d="…"/>`. The background is `<rect>`, which this
// regex skips. We pull the `d`, read every number out of it, and pair them
// as (x, y) — absolute M/C commands list coordinates in x,y pairs — then
// take the bbox centre. Each blob is only ~5 units across, so the bbox
// centre is the dot centre to sub-pixel accuracy.
const NUM_RE = /-?\d*\.?\d+(?:e-?\d+)?/gi;
const PATH_RE = /<path\b[^>]*\bd="([^"]+)"[^>]*>/gi;

const dots = [];
let m;
while ((m = PATH_RE.exec(svg)) !== null) {
  const nums = m[1].match(NUM_RE);
  if (!nums || nums.length < 2) continue;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (let i = 0; i + 1 < nums.length; i += 2) {
    const x = parseFloat(nums[i]);
    const y = parseFloat(nums[i + 1]);
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  // Clamp into the frame so dots authored slightly off-canvas don't blow
  // out the bounds the canvas scales against.
  dots.push(
    Math.round(Math.min(Math.max(cx, 0), FRAME_W) * 10) / 10,
    Math.round(Math.min(Math.max(cy, 0), FRAME_H) * 10) / 10
  );
}

await mkdir(path.dirname(OUTPUT_JSON), { recursive: true });
await writeFile(
  OUTPUT_JSON,
  JSON.stringify({ w: FRAME_W, h: FRAME_H, pts: dots })
);

console.log(
  `agent-evals dots: ${dots.length / 2} dots → ${path.relative(
    ROOT,
    OUTPUT_JSON
  )} (${Date.now() - t0}ms)`
);
