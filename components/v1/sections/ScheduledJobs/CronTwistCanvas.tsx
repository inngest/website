"use client";

import { useEffect, useRef } from "react";

// Stippled twisted-petal shape for the /scheduled-jobs hero.
//
// Two point-symmetric "petals" meet tip-to-tip at the canvas centre
// on a diagonal axis. Each petal is the lens-shaped intersection of
// two circles — an outer (gentle) arc and an inner (tighter) arc.
// Dots are rejection-sampled with density proportional to
// 1 / distance_to_seam, so dots pile up into a near-continuous bright
// line where the petals meet (the "caustic"). Per-dot ambient sin/cos
// sway keeps the field reading as alive.
//
// Background: near-black with very faint random noise grain painted
// once into a separate buffer so we don't redraw it every frame.

interface Dot {
  x: number;
  y: number;
  alpha: number;
  size: number;
  phase: number;
}

const BG_COLOR = "#181818";
const DOT_COLOR = "rgb(232, 232, 230)";

// Per-dot ambient sway (CSS-space amplitude). Subtle — half a pixel
// at the rim, scales down to ~0 near the seam (the bright line
// shouldn't wobble).
const AMBIENT_AMP = 0.9;
const AMBIENT_FREQ_X = 0.00065;
const AMBIENT_FREQ_Y = 0.00078;

// Target dot counts per petal. Rejection sampler runs until we hit
// this many accepted samples (or burn through MAX_SAMPLES attempts
// as a safety cap).
const DOTS_PER_PETAL = 9000;
const MAX_SAMPLES_PER_PETAL = 120_000;

interface CronTwistCanvasProps {
  className?: string;
  style?: React.CSSProperties;
  onReady?: () => void;
}

export default function CronTwistCanvas({
  className,
  style,
  onReady,
}: CronTwistCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let dots: Dot[] = [];
    let bgPattern: HTMLCanvasElement | null = null;
    let cssW = 0;
    let cssH = 0;
    let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    let readyFired = false;

    /** Distance from (x, y) to the diagonal seam (top-right → bottom-left
     *  through canvas centre). Seam equation: y = -x + H. */
    function distToSeam(x: number, y: number): number {
      return Math.abs(x + y - cssH) / Math.SQRT2;
    }

    function generateBackgroundNoise(): HTMLCanvasElement {
      const buf = document.createElement("canvas");
      buf.width = cssW;
      buf.height = cssH;
      const bctx = buf.getContext("2d");
      if (!bctx) return buf;
      bctx.fillStyle = BG_COLOR;
      bctx.fillRect(0, 0, cssW, cssH);
      // Sparse dim grain — 1 px pixels at varying low alpha. Density
      // tuned so it reads as quiet film grain, not visible texture.
      const grainCount = Math.floor(cssW * cssH * 0.012);
      for (let i = 0; i < grainCount; i++) {
        const x = Math.random() * cssW;
        const y = Math.random() * cssH;
        const a = 0.04 + Math.random() * 0.08;
        const v = 90 + Math.floor(Math.random() * 60);
        bctx.fillStyle = `rgba(${v},${v},${v},${a.toFixed(3)})`;
        bctx.fillRect(x | 0, y | 0, 1, 1);
      }
      return buf;
    }

    /** Top petal: lens-shaped intersection of two disks.
     *  - Outer disk (gentle outer arc): large radius, centre offset
     *    down-right of canvas.
     *  - Inner disk (tighter inner arc along the seam): smaller
     *    radius, centre offset up-right.
     *  A point is inside the petal iff it sits inside the outer
     *  disk AND outside the inner disk AND above the seam line.
     *  Bottom petal is the 180° rotation about canvas centre.
     */
    function describePetals() {
      const cx = cssW / 2;
      const cy = cssH / 2;
      const scale = Math.min(cssW, cssH);
      // Outer arc — wide, gentle. Centre well outside the canvas to
      // the lower-right; radius big enough that its arc kisses the
      // upper-left margin and the canvas centre.
      const outer = {
        cx: cx + scale * 0.55,
        cy: cy + scale * 0.95,
        r: scale * 1.32,
      };
      // Inner arc — tight curve along the seam side. Centre below
      // the upper-right corner; radius tuned so the arc bites into
      // the seam from above-right and meets the centre tip.
      const inner = {
        cx: cx + scale * 0.45,
        cy: cy - scale * 0.32,
        r: scale * 0.78,
      };
      return { outer, inner, cx, cy };
    }

    function isInsideTopPetal(
      x: number,
      y: number,
      ps: ReturnType<typeof describePetals>,
    ): boolean {
      // Above (or on) the seam line: x + y < H (since seam is y = -x + H).
      if (x + y > cssH + 4) return false;
      const dxO = x - ps.outer.cx;
      const dyO = y - ps.outer.cy;
      if (dxO * dxO + dyO * dyO > ps.outer.r * ps.outer.r) return false;
      const dxI = x - ps.inner.cx;
      const dyI = y - ps.inner.cy;
      if (dxI * dxI + dyI * dyI < ps.inner.r * ps.inner.r) return false;
      return true;
    }

    function isInsideBottomPetal(
      x: number,
      y: number,
      ps: ReturnType<typeof describePetals>,
    ): boolean {
      // 180° rotation about canvas centre: (x', y') = (W - x, H - y).
      // Inside-bottom-petal iff the rotated point is inside-top-petal.
      return isInsideTopPetal(cssW - x, cssH - y, ps);
    }

    function generateDots(): Dot[] {
      if (cssW < 2 || cssH < 2) return [];
      const ps = describePetals();
      const out: Dot[] = [];
      // Bounding box for each petal is the full canvas (cheap & fine).
      // For the seam-density weighting we use SEAM_GRADIENT_SCALE so
      // the falloff is in screen-space pixels regardless of canvas
      // size. Scaled by `scale` so it tracks viewport changes.
      const scale = Math.min(cssW, cssH);
      const SEAM_GRADIENT_SCALE = scale * 0.22;
      const seedPetal = (
        check: (x: number, y: number, ps: ReturnType<typeof describePetals>) => boolean,
      ) => {
        let kept = 0;
        let attempts = 0;
        while (kept < DOTS_PER_PETAL && attempts < MAX_SAMPLES_PER_PETAL) {
          attempts++;
          const x = Math.random() * cssW;
          const y = Math.random() * cssH;
          if (!check(x, y, ps)) continue;
          // Density weight — 1 near seam, falls to ~0.18 at the rim.
          const d = distToSeam(x, y);
          const density = 1 / (1 + (d / SEAM_GRADIENT_SCALE) * 1.4);
          if (Math.random() > density) continue;
          // Per-dot alpha + size: brighter & slightly bigger toward
          // the seam so the bright line reads crisply.
          const seamProx = density; // [~0.18, 1]
          const alpha = 0.55 + 0.45 * seamProx;
          const size = 0.9 + 0.7 * seamProx;
          out.push({
            x,
            y,
            alpha,
            size,
            phase: Math.random() * Math.PI * 2,
          });
          kept++;
        }
      };
      seedPetal(isInsideTopPetal);
      seedPetal(isInsideBottomPetal);
      return out;
    }

    function resize() {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      cssW = Math.max(1, Math.floor(rect.width));
      cssH = Math.max(1, Math.floor(rect.height));
      dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      canvas.width = cssW * dpr;
      canvas.height = cssH * dpr;
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bgPattern = generateBackgroundNoise();
      dots = generateDots();
    }

    function frame(t: number) {
      // Paint the cached noise background once per frame (cheap —
      // a single drawImage of the prebaked buffer).
      if (bgPattern) {
        ctx.drawImage(bgPattern, 0, 0, cssW, cssH);
      } else {
        ctx.fillStyle = BG_COLOR;
        ctx.fillRect(0, 0, cssW, cssH);
      }
      ctx.fillStyle = DOT_COLOR;
      const ampScale = (alpha: number) => {
        // Quieter sway for the brightest seam dots (they should read
        // as a steady caustic line, not a vibrating one).
        const dim = (1 - alpha) + 0.25;
        return AMBIENT_AMP * Math.min(1, dim);
      };
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        const amp = ampScale(d.alpha);
        const dx = Math.sin(t * AMBIENT_FREQ_X + d.phase) * amp;
        const dy = Math.cos(t * AMBIENT_FREQ_Y + d.phase * 1.31) * amp;
        ctx.globalAlpha = d.alpha;
        ctx.beginPath();
        ctx.arc(d.x + dx, d.y + dy, d.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (!readyFired) {
        readyFired = true;
        onReady?.();
      }
      raf = requestAnimationFrame(frame);
    }

    resize();
    raf = requestAnimationFrame(frame);
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [onReady]);

  return <canvas ref={canvasRef} className={className} style={style} />;
}
