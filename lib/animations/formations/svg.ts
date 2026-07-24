import type { FormationPoint } from '../core/types';
import { pickN } from '../core/utils';

/** Fetches an SVG URL into a blob-backed <img>, so getImageData stays untainted. */
export async function loadSvgImage(src: string): Promise<HTMLImageElement> {
  let svgText: string;
  if (/^\s*<svg/i.test(src)) {
    svgText = src;
  } else {
    const res = await fetch(src);
    if (!res.ok) throw new Error(`SVG fetch failed: ${src} (${res.status})`);
    svgText = await res.text();
  }
  const blob = new Blob([svgText], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  try {
    return await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`SVG decode failed: ${src}`));
      img.src = url;
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

type Opts = {
  count: number;
  W: number;
  H: number;
  cx?: number;
  cy?: number;
  maxSize?: number;
};

/**
 * Rasterizes an SVG to an offscreen canvas and picks dot positions weighted
 * by alpha. Preserves logos encoded as dithered masks.
 */
export function svgFormation(img: HTMLImageElement | null, opts: Opts): FormationPoint[] | null {
  const { count, W, H } = opts;
  if (!img) return null;

  const cx = opts.cx ?? W * 0.72;
  const cy = opts.cy ?? H * 0.5;
  const maxSize = opts.maxSize ?? Math.min(W * 0.42, H * 0.7);
  const scale = Math.min(maxSize / img.width, maxSize / img.height);
  const drawW = img.width * scale;
  const drawH = img.height * scale;

  const off = document.createElement('canvas');
  off.width = W; off.height = H;
  const octx = off.getContext('2d')!;
  octx.drawImage(img, cx - drawW / 2, cy - drawH / 2, drawW, drawH);

  let data: Uint8ClampedArray;
  try {
    data = octx.getImageData(0, 0, W, H).data;
  } catch {
    return null; // tainted — caller should fall back
  }

  // Weighted alpha sampling: probability of including a pixel ∝ its alpha.
  let nonzero = 0;
  for (let i = 3; i < data.length; i += 4) if (data[i] > 0) nonzero++;

  const candidates: FormationPoint[] = [];
  const step = 2;
  const target = count * 3;
  const expected = nonzero / 4;
  const pScale = Math.min(1, target / Math.max(1, expected));
  for (let py = 0; py < H; py += step) {
    for (let px = 0; px < W; px += step) {
      const idx = (py * W + px) * 4;
      const a = data[idx + 3];
      if (a > 10 && Math.random() < (a / 255) * pScale) {
        candidates.push({ x: px, y: py, z: 0 });
      }
    }
  }
  if (candidates.length < 100) return null;
  return pickN(candidates, count);
}
