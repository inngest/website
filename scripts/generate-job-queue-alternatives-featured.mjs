import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const WIDTH = 2048;
const HEIGHT = 1024;
const CX = WIDTH / 2;
const BASE = path.join(
  "/Users/laurencraigie/.cursor/projects/Users-laurencraigie-Documents-Cursor-website/assets/featured-image-v2.png",
);
const OUT = path.join(
  process.cwd(),
  "public/assets/blog/best-job-queue-alternatives/featured-image.png",
);

const texture = await sharp(BASE)
  .resize(WIDTH, HEIGHT)
  .blur(72)
  .modulate({ brightness: 0.82, saturation: 0.75 })
  .png()
  .toBuffer();

const logoPatch = await sharp(BASE)
  .resize(WIDTH, HEIGHT)
  .extract({ left: 1876, top: 56, width: 96, height: 96 })
  .png()
  .toBuffer();

const overlaySvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(${CX}, 0)">
    <text
      x="-430"
      y="555"
      text-anchor="middle"
      dominant-baseline="middle"
      fill="none"
      stroke="#ffffff"
      stroke-width="2.4"
      opacity="0.1"
      font-family="Inter, Helvetica, Arial, sans-serif"
      font-size="235"
      font-weight="700"
    >JOB</text>
    <text
      x="430"
      y="555"
      text-anchor="middle"
      dominant-baseline="middle"
      fill="none"
      stroke="#ffffff"
      stroke-width="2.4"
      opacity="0.1"
      font-family="Inter, Helvetica, Arial, sans-serif"
      font-size="235"
      font-weight="700"
    >QUEUES</text>

    <rect x="-118" y="118" width="236" height="46" rx="23" fill="#E8553A"/>
    <text
      x="0"
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
      x="0"
      y="248"
      text-anchor="middle"
      dominant-baseline="middle"
      fill="#E8553A"
      font-family="Inter, Helvetica, Arial, sans-serif"
      font-size="108"
      font-weight="700"
      letter-spacing="-2"
    >2026</text>

    <text
      x="0"
      y="390"
      text-anchor="middle"
      dominant-baseline="middle"
      fill="#ffffff"
      font-family="Inter, Helvetica, Arial, sans-serif"
      font-size="92"
      font-weight="700"
      letter-spacing="-1"
    >Job Queue Alternatives</text>

    <text
      x="0"
      y="470"
      text-anchor="middle"
      dominant-baseline="middle"
      fill="#ffffff"
      opacity="0.92"
      font-family="Inter, Helvetica, Arial, sans-serif"
      font-size="28"
      font-weight="600"
      letter-spacing="4"
    >BULLMQ · CELERY · TEMPORAL · INNGEST</text>
  </g>

  <g fill="#ffffff" stroke="#ffffff" stroke-width="8" stroke-linejoin="round" stroke-linecap="round">
    <rect x="1580" y="760" width="22" height="22" fill="#ffffff" stroke="none"/>
    <rect x="1720" y="640" width="22" height="22" fill="#ffffff" stroke="none"/>
    <rect x="1860" y="520" width="22" height="22" fill="#ffffff" stroke="none"/>
    <rect x="1720" y="400" width="22" height="22" fill="#ffffff" stroke="none"/>
    <rect x="1860" y="280" width="22" height="22" fill="#ffffff" stroke="none"/>
    <rect x="1980" y="160" width="22" height="22" fill="#ffffff" stroke="none"/>
    <path fill="none" d="M1591 771 L1591 900 L1720 900"/>
    <path fill="none" d="M1720 900 L1720 651"/>
    <path fill="none" d="M1731 640 L1860 640 L1860 531"/>
    <path fill="none" d="M1731 411 L1860 411 L1860 291"/>
    <path fill="none" d="M1871 520 L1980 520 L1980 171"/>
    <path fill="none" d="M1871 280 L1940 280 L1940 171 L1991 171"/>
  </g>
</svg>`;

const overlay = await sharp(Buffer.from(overlaySvg)).png().toBuffer();

await sharp(texture)
  .composite([
    { input: overlay, top: 0, left: 0 },
    { input: logoPatch, top: 56, left: 1876 },
  ])
  .png()
  .toFile(OUT);

console.log(`Wrote ${OUT}`);
