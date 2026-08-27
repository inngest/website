import path from "node:path";
import sharp from "sharp";

const WIDTH = 2048;
const HEIGHT = 1024;
const CX = WIDTH / 2;
const SHIFT = 72;
const BASE = path.join(
  process.cwd(),
  "public/assets/blog/best-job-queue-alternatives/featured-image-source.png",
);
const OUT = path.join(
  process.cwd(),
  "public/assets/blog/best-job-queue-alternatives/featured-image.png",
);

const base = await sharp(BASE).resize(WIDTH, HEIGHT).png().toBuffer();
const blurred = await sharp(base).blur(30).png().toBuffer();

// Repaint the full text stack (header through tool list), keep diagram + logo.
const textMaskSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="${CX}" cy="${380 + SHIFT}" rx="860" ry="340" fill="white"/>
</svg>`;

const textMask = await sharp(Buffer.from(textMaskSvg)).png().toBuffer();
const textPatch = await sharp(blurred)
  .composite([{ input: textMask, blend: "dest-in" }])
  .png()
  .toBuffer();

const overlaySvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <text
    x="${CX}"
    y="${568 + SHIFT}"
    text-anchor="middle"
    dominant-baseline="middle"
    fill="none"
    stroke="#ffffff"
    stroke-width="2.2"
    opacity="0.13"
    font-family="Inter, Helvetica, Arial, sans-serif"
    font-size="268"
    font-weight="700"
  >JOB QUEUES</text>

  <rect x="${CX - 118}" y="${118 + SHIFT}" width="236" height="46" rx="23" fill="#E8553A"/>
  <text
    x="${CX}"
    y="${148 + SHIFT}"
    text-anchor="middle"
    dominant-baseline="middle"
    fill="#ffffff"
    font-family="Inter, Helvetica, Arial, sans-serif"
    font-size="22"
    font-weight="700"
    letter-spacing="3"
  >COMPARISON</text>

  <text
    x="${CX}"
    y="${248 + SHIFT}"
    text-anchor="middle"
    dominant-baseline="middle"
    fill="#E8553A"
    font-family="Inter, Helvetica, Arial, sans-serif"
    font-size="108"
    font-weight="700"
    letter-spacing="-2"
  >2026</text>

  <text
    x="${CX}"
    y="${390 + SHIFT}"
    text-anchor="middle"
    dominant-baseline="middle"
    fill="#ffffff"
    font-family="Inter, Helvetica, Arial, sans-serif"
    font-size="92"
    font-weight="700"
    letter-spacing="-1"
  >Job Queue Alternatives</text>

  <text
    x="${CX}"
    y="${470 + SHIFT}"
    text-anchor="middle"
    dominant-baseline="middle"
    fill="#ffffff"
    opacity="0.92"
    font-family="Inter, Helvetica, Arial, sans-serif"
    font-size="28"
    font-weight="600"
    letter-spacing="4"
  >BULLMQ · CELERY · TEMPORAL · INNGEST</text>
</svg>`;

const overlay = await sharp(Buffer.from(overlaySvg)).png().toBuffer();

await sharp(base)
  .composite([
    { input: textPatch, top: 0, left: 0 },
    { input: overlay, top: 0, left: 0 },
  ])
  .png()
  .toFile(OUT);

console.log(`Wrote ${OUT}`);
