// Builds the sandboxes hero stipple: one nested square (a thick outer
// frame and a smaller square inside it), the same mark as the icon,
// scaled to the band `cover` keeps visible on the portrait frame.
// The frame, the inner square, and the gap between them are all
// stippled, so the dots land across the area they pour through
// instead of collapsing onto an outline.
//
// Re-run: pnpm v1:extract-sandboxes-dots

import { writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), "..");
const OUTPUT_JSON = path.join(
  ROOT,
  "public/assets/v1/sandboxes-hero/dots.json"
);

const FRAME_W = 1000;
const FRAME_H = 1600;

// Square panel crops the 1000×1600 frame to roughly y 300–1300.
// Sitting the mark in that band fills the hero instead of floating
// in the middle of a dark margin.
const OX = 0;
const OY = 300;
const SIZE = 1000;
const FRAME_THICK = 168;
const INNER = 380;
// Unstippled hairline so the two squares stay separate once the
// gap between them is filled in.
const GUTTER = 16;

const pts = [];

function push(x, y) {
  if (x < 0 || y < 0 || x > FRAME_W || y > FRAME_H) return;
  pts.push(Math.round(x * 10) / 10, Math.round(y * 10) / 10);
}

function region(x, y) {
  const lx = x - OX;
  const ly = y - OY;
  if (lx < 0 || ly < 0 || lx > SIZE || ly > SIZE) return null;
  const inFrame =
    lx < FRAME_THICK ||
    ly < FRAME_THICK ||
    lx > SIZE - FRAME_THICK ||
    ly > SIZE - FRAME_THICK;
  if (inFrame) {
    const nearHole =
      lx > FRAME_THICK - GUTTER &&
      ly > FRAME_THICK - GUTTER &&
      lx < SIZE - (FRAME_THICK - GUTTER) &&
      ly < SIZE - (FRAME_THICK - GUTTER);
    return nearHole ? null : "frame";
  }
  const inset = (SIZE - INNER) / 2;
  const inInner =
    lx >= inset && ly >= inset && lx <= inset + INNER && ly <= inset + INNER;
  if (inInner) {
    const edge =
      lx < inset + GUTTER ||
      ly < inset + GUTTER ||
      lx > inset + INNER - GUTTER ||
      ly > inset + INNER - GUTTER;
    return edge ? null : "inner";
  }
  return "gap";
}

// The two squares and the area between them land at nearly the same
// density. A gutter, not an empty field, is what separates them.
const STEP = { frame: 9, inner: 9, gap: 11 };

let seed = 7;
function rand() {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
}

for (const kind of ["frame", "inner", "gap"]) {
  const step = STEP[kind];
  for (let y = OY; y <= OY + SIZE; y += step) {
    for (let x = OX; x <= OX + SIZE; x += step) {
      if (region(x, y) !== kind) continue;
      const j = kind === "gap" ? 3.2 : 1.6;
      push(x + (rand() - 0.5) * j, y + (rand() - 0.5) * j);
    }
  }
}

await mkdir(path.dirname(OUTPUT_JSON), { recursive: true });
await writeFile(OUTPUT_JSON, JSON.stringify({ w: FRAME_W, h: FRAME_H, pts }));

let minX = Infinity;
let minY = Infinity;
let maxX = -Infinity;
let maxY = -Infinity;
for (let i = 0; i < pts.length; i += 2) {
  minX = Math.min(minX, pts[i]);
  maxX = Math.max(maxX, pts[i]);
  minY = Math.min(minY, pts[i + 1]);
  maxY = Math.max(maxY, pts[i + 1]);
}

console.log(
  `sandboxes dots: ${
    pts.length / 2
  } dots, bounds ${minX},${minY} – ${maxX},${maxY} → ${path.relative(
    ROOT,
    OUTPUT_JSON
  )}`
);
