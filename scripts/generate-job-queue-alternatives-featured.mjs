import path from "node:path";
import sharp from "sharp";

const WIDTH = 2048;
const HEIGHT = 1024;
const CX = WIDTH / 2;
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

const headerMaskSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="${CX}" cy="188" rx="780" ry="128" fill="white"/>
</svg>`;

const headerMask = await sharp(Buffer.from(headerMaskSvg)).png().toBuffer();
const headerPatch = await sharp(blurred)
  .composite([{ input: headerMask, blend: "dest-in" }])
  .png()
  .toBuffer();

const overlaySvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <text
    x="${CX}"
    y="568"
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

  <rect x="${CX - 118}" y="118" width="236" height="46" rx="23" fill="#E8553A"/>
  <text
    x="${CX}"
    y="148"
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
    y="248"
    text-anchor="middle"
    dominant-baseline="middle"
    fill="#E8553A"
    font-family="Inter, Helvetica, Arial, sans-serif"
    font-size="108"
    font-weight="700"
    letter-spacing="-2"
  >2026</text>
</svg>`;

const overlay = await sharp(Buffer.from(overlaySvg)).png().toBuffer();

await sharp(base)
  .composite([
    { input: headerPatch, top: 0, left: 0 },
    { input: overlay, top: 0, left: 0 },
  ])
  .png()
  .toFile(OUT);

console.log(`Wrote ${OUT}`);
