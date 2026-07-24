"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/utils/v1/cn";
import {
  type Gravity,
  GRAVITY,
  resolveCoord,
  resolveOriginOffset,
} from "@/utils/v1/canvasPlacement";

/**
 * Inngest-logomark stipple watermark — scroll-driven particle field
 * sized and positioned relative to the host section. Four phases
 * tied to the section's centre offset from viewport centre:
 *
 *   1. Pre-enter: particles parked off-screen right, invisible.
 *   2. Enter (centre rising from +0.5 vh to 0): each particle eases
 *      from its scatter seed to its sampled logo seat, alpha 0 →
 *      `PARTICLE_TARGET_OPACITY`, colour salmon → frost.
 *   3. Settled (around viewport centre): full stipple logo with
 *      sub-pixel breathing and a cursor-driven repulsion field.
 *   4. Exit (centre falling 0 to -0.5 vh): staggered burst rightward,
 *      alpha → 0, clearing before the next section appears.
 *
 * `prefers-reduced-motion: reduce` snaps to settled, freezes the
 * breathing, and disables hover; the exit still plays.
 */

// Default source: the pre-extracted dot dataset (one normalized point
// per real stipple dot, framing baked to match the original asset).
// Pass an image `src` to fall back to runtime pixel-sampling instead.
const DEFAULT_DOTS_SRC = "/assets/v1/quote/stipple-logomark-dots.json";

// Tight dot-bbox dimensions — the logo's intrinsic aspect (particles
// fill 0..1, no framing). Used for aspect-preserving sizing.
const DEFAULT_DESIGN_LOGO_W = 664.8;
const DEFAULT_DESIGN_LOGO_H = 390.9;

// The legacy "design" right-overflow placement now lives in
// `./logomarkPlacement` (LOGOMARK_DESIGN_WIDTH / LOGOMARK_DESIGN_X) so
// callers can use it via `width` + `x` + `originX={0}`.

// Gravity / GRAVITY / resolveCoord / resolveOriginOffset are shared with
// StippleCanvas via @/utils/v1/canvasPlacement (imported above).

// Intermediate sampling width — dot-y sources collapse to 1–2 px
// blurs at display width and miss most dots; native widths are
// wasteful.
const SAMPLE_WIDTH = 1600;
const DEFAULT_SAMPLE_THRESHOLD = 60;

const ENTER_STAGGER = 0.3;
const EXIT_STAGGER = 0.2;

const EXIT_ANGLE_CENTER = 0;
const EXIT_ANGLE_SPREAD = Math.PI / 2;

const DEFAULT_PARTICLE_SIZE = 1.5;
// Full-opacity particles at the settled state. Parents apply their
// own `opacity-XX` (opacity-50 for Quote, opacity-15 for the
// Customers watermark) to compose the final visual.
const PARTICLE_TARGET_OPACITY = 1;

const DEFAULT_SCATTER = "#fb5536"; // salmon
const FORMED_R = 0xfe;
const FORMED_G = 0xfe;
const FORMED_B = 0xfe;
const FROST = "#fefefe";

// Cache one LUT per scatterColor so repeated mounts with the same
// colour share the table.
const COLOR_LUT_CACHE = new Map<string, string[]>();
function getColorLUT(scatterHex: string): string[] {
  const cached = COLOR_LUT_CACHE.get(scatterHex);
  if (cached) return cached;
  const hex = scatterHex.replace("#", "");
  const sr = parseInt(hex.slice(0, 2), 16);
  const sg = parseInt(hex.slice(2, 4), 16);
  const sb = parseInt(hex.slice(4, 6), 16);
  const lut = new Array<string>(256);
  for (let i = 0; i < 256; i++) {
    const t = i / 255;
    const r = (sr + (FORMED_R - sr) * t) | 0;
    const g = (sg + (FORMED_G - sg) * t) | 0;
    const b = (sb + (FORMED_B - sb) * t) | 0;
    lut[i] = `rgb(${r},${g},${b})`;
  }
  COLOR_LUT_CACHE.set(scatterHex, lut);
  return lut;
}

// Cursor field is intentionally soft — particles displace slowly,
// across a wider area, like fingertips dragging through fine sand.
const CURSOR_RADIUS = 140;
const CURSOR_RADIUS_SQ = CURSOR_RADIUS * CURSOR_RADIUS;
const CURSOR_FORCE = 38;
const CURSOR_EASE = 0.07;

interface Particle {
  tx: number;
  ty: number;
  sx: number;
  sy: number;
  exDir: number;
  eyDir: number;
  enterStagger: number;
  exitStagger: number;
  phase: number;
  /** Per-dot alpha multiplier from the source (1 = strongest). */
  a: number;
  cursorOffsetX: number;
  cursorOffsetY: number;
}

function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function easeInCubic(t: number) {
  return t * t * t;
}

// Scans every pixel of the source at the intermediate resolution and
// shuffles the lit-pixel set (red-channel > `threshold`). Positions
// stay in intermediate coords so the result rescales to any display
// size at render time without a re-scan. Used only for an image `src`;
// the default dot dataset is loaded pre-extracted.
interface SampledLogo {
  points: Array<{ x: number; y: number }>;
  // Source's own intermediate render dims so callers can rescale
  // sampled coords to display dims accurately.
  width: number;
  height: number;
}

function sampleLogo(
  img: HTMLImageElement,
  sampleW: number,
  sampleH: number,
  threshold: number
): SampledLogo {
  const off = document.createElement("canvas");
  off.width = sampleW;
  off.height = sampleH;
  const oc = off.getContext("2d");
  if (!oc) return { points: [], width: sampleW, height: sampleH };
  oc.drawImage(img, 0, 0, sampleW, sampleH);
  const data = oc.getImageData(0, 0, sampleW, sampleH).data;
  const points: Array<{ x: number; y: number }> = [];
  // The threshold filters which pixels qualify as "lit" — lower
  // values capture soft anti-aliased edges (good for stippled
  // sources where the artwork already has feathery edges); higher
  // values only capture the interior of crisp vector glyphs (good
  // for SVG wordmarks where you want sharp letter outlines).
  for (let y = 0; y < sampleH; y++) {
    for (let x = 0; x < sampleW; x++) {
      if (data[(y * sampleW + x) * 4] > threshold) {
        points.push({ x, y });
      }
    }
  }
  for (let i = points.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [points[i], points[j]] = [points[j], points[i]];
  }
  return { points, width: sampleW, height: sampleH };
}

// Module-level cache keyed by source URL so multiple instances of
// the canvas (Quote / Customers / LogoMarquee) share one image
// decode + pixel scan. Without this, each instance pays ~50–80 ms
// decoding and scanning the same source independently at mount.
const sampleCache = new Map<string, Promise<SampledLogo>>();

function loadLogoSamples(
  src: string,
  sampleW: number,
  sampleH: number,
  threshold: number
): Promise<SampledLogo> {
  // Cache key includes threshold so callers requesting crisp vs soft
  // sampling don't share each other's pixel scan.
  const cacheKey = `${src}|${threshold}`;
  const cached = sampleCache.get(cacheKey);
  if (cached) return cached;
  const promise = new Promise<SampledLogo>((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(sampleLogo(img, sampleW, sampleH, threshold));
    img.onerror = reject;
    img.src = src;
  });
  sampleCache.set(cacheKey, promise);
  return promise;
}

// A sample point normalized to 0..1 of the logo's tight bbox, with
// `a` = the dot's relative alpha (1 = strongest). Image-sampled points
// use a = 1 (no per-dot tone).
interface DotPoint {
  x: number;
  y: number;
  a: number;
}

// Module cache for the pre-extracted dot dataset (flat
// `[x,y,a,…]`, pre-shuffled so `maxParticles` trimming stays spatially
// even). Shared across instances by URL.
const dotsCache = new Map<string, Promise<DotPoint[]>>();

function loadDotSamples(dotsSrc: string): Promise<DotPoint[]> {
  const cached = dotsCache.get(dotsSrc);
  if (cached) return cached;
  const promise = fetch(dotsSrc)
    .then((r) => r.json())
    .then((json: { points: number[] }) => {
      // Flat [x0,y0,a0, x1,y1,a1,…] — `a` is the per-dot alpha (the
      // ref image's tonal variation), preserved so the rendered
      // watermark matches the source's soft edges.
      const flat = json.points;
      const out: DotPoint[] = [];
      for (let i = 0; i + 2 < flat.length; i += 3) {
        out.push({ x: flat[i], y: flat[i + 1], a: flat[i + 2] });
      }
      return out;
    });
  dotsCache.set(dotsSrc, promise);
  return promise;
}

interface InngestLogoCanvasProps {
  // Optional image source. When omitted (the default), the canvas
  // renders the pre-extracted dot dataset (`DEFAULT_DOTS_SRC`). When
  // set, the image is runtime-sampled instead — a pre-stippled raster
  // (white-on-dark) or solid silhouette (red-channel > threshold = ink).
  src?: string;
  // Design-space logo dimensions; used to compute aspect for the
  // intermediate sampler and (in `anchor="center"`) to fit the logo
  // into the canvas wrapper.
  designW?: number;
  designH?: number;
  // 9-point gravity controlling where the logo sits in the canvas —
  // mirrors CSS `object-position` keywords (e.g. `bottom-right`). The
  // logo contain-fits the canvas (unless `width`/`height` is given) and
  // snaps to this point. Override with `x`/`y`/`originX`/`originY` for
  // arbitrary placement or overflow. Defaults to `center`.
  anchor?: Gravity;
  // Scroll windows in viewport-height fractions, measured from the
  // canvas's centre. Larger `enterRange` makes the logo start
  // forming earlier (further before centre); larger `exitRange`
  // keeps it on-screen longer after the section passes centre.
  enterRange?: number;
  exitRange?: number;
  // Direction in radians the particles fly toward on exit. Default 0
  // (positive X = right). Pass Math.PI / 2 for "downward" exits.
  exitAngleCenter?: number;
  // Half-spread (radians) around the centre angle. Default PI/2 — a
  // 90° cone. Larger = more directional variance.
  exitAngleSpread?: number;
  // Pixel red-channel threshold that classifies a sample pixel as
  // "lit". Higher = crisper letter outlines for SVG sources (drops
  // the anti-aliased halo); lower = captures more of soft stipple
  // edges in raster sources. Default 60 keeps soft sources happy;
  // pass ~170 for crisp vector wordmarks.
  sampleThreshold?: number;
  // When false, particles never burst rightward — the logo just
  // forms and stays. Used by the LogoMarquee at the page bottom.
  enableExit?: boolean;
  // Hard cap on rendered particle count, trimmed (after sampling) from
  // a shuffled set so the thinning stays spatially even. Omit to render
  // every loaded point — for the dot dataset that's the source image's
  // exact dot count; for an image `src` it's every sampled pixel, so
  // image callers should set a cap. Mainly used to thin density on
  // mobile.
  maxParticles?: number;
  // Caps the auto-scale applied in `anchor="center"` mode. Defaults
  // to no cap (logo grows to fit the wrapper). Pass `1` when the
  // wrapper is intentionally much larger than the design (e.g. a
  // full-viewport scatter area) and the logo should stay at its
  // design dimensions.
  maxScale?: number;
  // When true, particles seed off-canvas LEFT (and exit there too)
  // instead of the default right-side seed. Used when the watermark
  // should appear to "fade in from the left" as the user scrolls.
  enterFromLeft?: boolean;
  /** Edge length of each square particle in CSS px. */
  particleSize?: number;
  /** Hex colour the particles start at during the enter animation,
   *  lerping toward FROST (#fefefe) as they form. */
  scatterColor?: string;
  /** Extra classes merged onto the rendered `<canvas>`. Useful for
   *  overriding the default `absolute inset-0 h-full w-full` sizing —
   *  e.g. pass `"h-[150vh]"` or `"static"` to detach from the parent
   *  bounding box. Tailwind-merged so later utilities win. */
  className?: string;
  /** Where on the canvas the logo's `(originX, originY)` anchor lands,
   *  measured from canvas top-left. Numbers are pixels; strings like
   *  `"50%"` are a fraction of canvas width. Overrides the horizontal
   *  placement implied by `anchor` when set. */
  x?: number | string;
  /** Same as `x`, vertical axis. Overrides the default vertically-centred
   *  placement when set. */
  y?: number | string;
  /** Which point on the **logo's** bounding box is pinned to `(x, y)`.
   *  Mirrors CSS `transform-origin` with an added pixel mode. Accepts:
   *    - number `0..1` — fraction of the logo width (`0.5` = centre)
   *    - `"NN%"` — same, as a string
   *    - `"NNpx"` / `"NN"` — absolute pixels from the logo's left edge
   *  Defaults to `0.5` (centre). Use `originX=1, originY=0` with
   *  `x="100%", y="0%"` to align the logo's top-right corner to the
   *  canvas top-right; `originX="20px"` anchors 20 px in from the
   *  left edge. */
  originX?: number | string;
  /** Same as `originX`, vertical axis. */
  originY?: number | string;
  /** Explicit logo width on the canvas. Numbers are pixels; strings
   *  like `"60%"` are a fraction of canvas width. Overrides the size
   *  implied by `anchor` when set. If only one of `width` / `height`
   *  is given, the other is derived from `designW / designH` so the
   *  aspect ratio is preserved. Pass both to stretch. */
  width?: number | string;
  /** Same as `width`, vertical axis (number = px, `"NN%"` = fraction
   *  of canvas height). */
  height?: number | string;
  /** Caps the rendered logo width. Same unit rules as `width`.
   *  Commonly paired with `width="100%"` to fill-up-to a ceiling. */
  maxWidth?: number | string;
  /** Same as `maxWidth`, vertical axis. */
  maxHeight?: number | string;
}

export default function InngestLogoCanvas({
  src,
  designW = DEFAULT_DESIGN_LOGO_W,
  designH = DEFAULT_DESIGN_LOGO_H,
  anchor = "center",
  enterRange = 0.5,
  exitRange = 0.5,
  enableExit = true,
  maxParticles,
  maxScale = Infinity,
  exitAngleCenter = EXIT_ANGLE_CENTER,
  exitAngleSpread = EXIT_ANGLE_SPREAD,
  sampleThreshold = DEFAULT_SAMPLE_THRESHOLD,
  enterFromLeft = false,
  particleSize = DEFAULT_PARTICLE_SIZE,
  scatterColor = DEFAULT_SCATTER,
  className,
  x: xProp,
  y: yProp,
  originX,
  originY,
  width: widthProp,
  height: heightProp,
  maxWidth: maxWidthProp,
  maxHeight: maxHeightProp,
}: InngestLogoCanvasProps = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const colorLut = getColorLUT(scatterColor);
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const ctxEl = canvasEl.getContext("2d");
    if (!ctxEl) return;
    const canvas: HTMLCanvasElement = canvasEl;
    const ctx: CanvasRenderingContext2D = ctxEl;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const hoverCapable =
      !reduceMotion && window.matchMedia("(hover: hover)").matches;

    const sampleH = Math.max(1, Math.round(SAMPLE_WIDTH * (designH / designW)));

    // Sampled lit-pixel positions in intermediate-canvas coords,
    // already trimmed to `maxParticles`. Cached after the first
    // image load so resize rebuilds don't rescan the ImageData.
    let logoSamples: DotPoint[] | null = null;
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    // The loop only ticks while the canvas is near the viewport (set by
    // an IntersectionObserver) and the tab is visible — off-screen
    // watermarks shouldn't burn a rAF each (the homepage mounts 5).
    let onScreen = false;
    // Cached canvas offset, refreshed on scroll/resize, so the mousemove
    // handler reads it instead of forcing a layout (getBoundingClientRect)
    // on every pointer event × every canvas instance.
    let rectLeft = 0;
    let rectTop = 0;
    // Section centre offset from viewport centre, normalised by
    // viewport height. Positive = section below centre, 0 = centred,
    // negative = passed above.
    let centerOffset = 1;
    let cursorX = -9999;
    let cursorY = -9999;
    // Track previous cursor position + decaying speed so the displacement
    // force only kicks in while the cursor is actually moving — like
    // water rippling under a finger, not a static crater that forms when
    // the hand stops.
    let prevCursorX = -9999;
    let prevCursorY = -9999;
    let cursorSpeed = 0;
    let cursorActive = false;

    function buildParticles() {
      if (!logoSamples) return;

      // ── Sizing ──────────────────────────────────────────────────
      // Explicit `width` / `height` win (one axis derives the other
      // from the aspect ratio). Otherwise contain-fit to the canvas
      // (CSS `object-fit: contain`), capped at `maxScale`.
      let logoW: number;
      let logoH: number;
      const explicitW = resolveCoord(widthProp, width, "InngestLogoCanvas");
      const explicitH = resolveCoord(heightProp, height, "InngestLogoCanvas");
      if (explicitW !== undefined && explicitH !== undefined) {
        logoW = explicitW;
        logoH = explicitH;
      } else if (explicitW !== undefined) {
        logoW = explicitW;
        logoH = explicitW * (designH / designW);
      } else if (explicitH !== undefined) {
        logoH = explicitH;
        logoW = explicitH * (designW / designH);
      } else {
        const fit = Math.min(width / designW, height / designH, maxScale);
        logoW = designW * fit;
        logoH = designH * fit;
      }
      // Max constraints — shrink-only, preserving aspect ratio.
      const maxW = resolveCoord(maxWidthProp, width, "InngestLogoCanvas");
      const maxH = resolveCoord(maxHeightProp, height, "InngestLogoCanvas");
      let scaleCap = 1;
      if (maxW !== undefined && logoW > maxW) scaleCap = Math.min(scaleCap, maxW / logoW);
      if (maxH !== undefined && logoH > maxH) scaleCap = Math.min(scaleCap, maxH / logoH);
      if (scaleCap < 1) {
        logoW *= scaleCap;
        logoH *= scaleCap;
      }
      // ── Placement ───────────────────────────────────────────────
      // `anchor` is a 9-point gravity: it pins the logo's matching
      // corner/edge to the same point of the canvas (CSS
      // `object-position` keywords). `x`/`y` override the canvas point
      // and `originX`/`originY` override which point of the logo is
      // pinned — together they're the escape hatch for arbitrary
      // placement / overflow.
      const g = GRAVITY[anchor];
      const offX = resolveOriginOffset(originX, logoW, g.ox, "InngestLogoCanvas");
      const offY = resolveOriginOffset(originY, logoH, g.oy, "InngestLogoCanvas");
      const resolvedX = resolveCoord(xProp, width, "InngestLogoCanvas");
      const resolvedY = resolveCoord(yProp, height, "InngestLogoCanvas");
      const anchorX = resolvedX !== undefined ? resolvedX : g.x * width;
      const anchorY = resolvedY !== undefined ? resolvedY : g.y * height;
      const logoLeft = anchorX - offX;
      const logoTop = anchorY - offY;
      // Points arrive normalized to 0..1 of the design box (both the
      // dot dataset and the image sampler emit normalized coords), so
      // map straight into the logo's placed rect.
      particles = logoSamples.map((p) => {
        // Default exit is rightward; if particles enter from the
        // left, mirror so the same angle drives a leftward exit too
        // (no awkward right-fly-out from a left-fly-in).
        const baseAngle = enterFromLeft
          ? Math.PI - exitAngleCenter
          : exitAngleCenter;
        const angle = baseAngle + (Math.random() - 0.5) * exitAngleSpread;
        const seedX = enterFromLeft
          ? -80 - Math.random() * 240
          : width + 80 + Math.random() * 240;
        // Seed Y just above the canvas top — combined with the
        // tight (-60 px) wrapper extension in Quote.tsx, dots
        // never appear higher than the immediate bottom edge of
        // the section above.
        const seedY = -10 - Math.random() * 50;
        return {
          tx: logoLeft + p.x * logoW,
          ty: logoTop + p.y * logoH,
          sx: seedX,
          sy: seedY,
          exDir: Math.cos(angle),
          eyDir: Math.sin(angle),
          enterStagger: Math.random() * ENTER_STAGGER,
          exitStagger: Math.random() * EXIT_STAGGER,
          phase: Math.random() * Math.PI * 2,
          a: p.a,
          cursorOffsetX: 0,
          cursorOffsetY: 0,
        };
      });
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      rectLeft = rect.left;
      rectTop = rect.top;
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function updateScrollProgress() {
      const rect = canvas.getBoundingClientRect();
      rectLeft = rect.left;
      rectTop = rect.top;
      const vh = window.innerHeight || 1;
      centerOffset = (rect.top + rect.height / 2 - vh / 2) / vh;
    }

    function startLoop() {
      if (!raf && onScreen && !document.hidden) {
        raf = requestAnimationFrame(frame);
      }
    }
    function stopLoop() {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    }

    function frame(now: number) {
      const enterT = reduceMotion
        ? 1
        : clamp01((enterRange - centerOffset) / enterRange);
      const exitT = enableExit
        ? clamp01(-centerOffset / exitRange)
        : 0;

      ctx.clearRect(0, 0, width, height);

      // Section is far below or already past — nothing to render.
      // Still tick rAF so the next scroll update can re-trigger.
      if (enterT <= 0 || exitT >= 1 || particles.length === 0) {
        raf = requestAnimationFrame(frame);
        return;
      }

      const breathT = reduceMotion ? 0 : now * 0.0008;
      const exitDist = width + 240;
      // In the settled state every particle is FROST, so only touch
      // ctx.fillStyle when the colour actually changes (during enter).
      let lastStyle = "";

      // Cursor velocity for this frame, saturated to a 0..1 stir
      // factor. With a slow decay, the field "settles" within a few
      // hundred ms after the cursor stops — so particles ripple under
      // motion but return to their seat instead of holding a crater.
      if (cursorActive && prevCursorX !== -9999) {
        const vx = cursorX - prevCursorX;
        const vy = cursorY - prevCursorY;
        const instSpeed = Math.hypot(vx, vy);
        // Faster decay than rise so motion is reactive but rest is firm.
        cursorSpeed = cursorSpeed * 0.78 + instSpeed * 0.22;
      } else {
        cursorSpeed *= 0.78;
      }
      prevCursorX = cursorX;
      prevCursorY = cursorY;
      const stirFactor = Math.min(1, cursorSpeed / 6);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        const localEnter = clamp01(
          (enterT - p.enterStagger) / (1 - ENTER_STAGGER)
        );
        const enterEase = easeOutCubic(localEnter);
        // Even-paced travel (vs easeOutCubic) keeps each dot visible along
        // the whole flight instead of snapping near the seat, so the stream
        // reads the entire way in. Final position at localEnter=1 is the
        // same seat — the formed logo doesn't move.
        const moveEase = localEnter;
        // Fade in earlier in the flight so the inbound dots are visible
        // while still travelling, not only once they reach the logo.
        const fadeEase = clamp01(localEnter * 1.6);

        const localExit = clamp01(
          (exitT - p.exitStagger) / (1 - EXIT_STAGGER)
        );
        const exitEase = easeInCubic(localExit);

        const bx = p.tx + Math.cos(breathT + p.phase) * 0.4;
        const by = p.ty + Math.sin(breathT + p.phase) * 0.4;

        const baseX = lerp(p.sx, bx, moveEase);
        const baseY = lerp(p.sy, by, moveEase);
        let x = baseX + p.exDir * exitDist * exitEase;
        let y = baseY + p.eyDir * exitDist * exitEase;

        let targetOffsetX = 0;
        let targetOffsetY = 0;
        if (cursorActive && stirFactor > 0.01) {
          const cdx = x - cursorX;
          const cdy = y - cursorY;
          const dist2 = cdx * cdx + cdy * cdy;
          if (dist2 < CURSOR_RADIUS_SQ) {
            const dist = Math.sqrt(dist2);
            const falloff = 1 - dist / CURSOR_RADIUS;
            // Push scales with cursor speed — when the cursor is
            // stationary the target offset is 0 and the lerp pulls
            // every particle back toward its seat, so no crater forms.
            const push = CURSOR_FORCE * falloff * falloff * stirFactor;
            const inv = dist > 0.001 ? 1 / dist : 0;
            targetOffsetX = cdx * inv * push;
            targetOffsetY = cdy * inv * push;
          }
        }
        p.cursorOffsetX += (targetOffsetX - p.cursorOffsetX) * CURSOR_EASE;
        p.cursorOffsetY += (targetOffsetY - p.cursorOffsetY) * CURSOR_EASE;
        x += p.cursorOffsetX;
        y += p.cursorOffsetY;

        const alpha = PARTICLE_TARGET_OPACITY * fadeEase * (1 - exitEase) * p.a;
        if (alpha <= 0.02) continue;

        ctx.globalAlpha = alpha;
        const style = enterEase >= 1 ? FROST : colorLut[(enterEase * 255) | 0];
        if (style !== lastStyle) {
          ctx.fillStyle = style;
          lastStyle = style;
        }
        ctx.fillRect(x, y, particleSize, particleSize);
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    }

    const onResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      resize();
      buildParticles();
      updateScrollProgress();
    };

    let scrollFrame = 0;
    const onScroll = () => {
      if (scrollFrame) return;
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = 0;
        updateScrollProgress();
      });
    };

    const onMouseMove = (e: MouseEvent) => {
      // Cached rect (refreshed on scroll/resize) — no per-event layout.
      cursorX = e.clientX - rectLeft;
      cursorY = e.clientY - rectTop;
      cursorActive = true;
    };
    const onMouseLeave = () => {
      cursorActive = false;
    };

    const onVisibilityChange = () => {
      if (document.hidden) stopLoop();
      else startLoop();
    };

    resize();
    updateScrollProgress();

    // Gate the rAF loop on viewport proximity. The animation window is
    // ±enter/exitRange viewport-heights from centre, so expand the root
    // by that much (+50% buffer) — the loop wakes a bit before the logo
    // needs to form and sleeps once it's well clear.
    const io = new IntersectionObserver(
      (entries) => {
        onScreen = entries[entries.length - 1].isIntersecting;
        if (onScreen) {
          updateScrollProgress();
          startLoop();
        } else {
          stopLoop();
        }
      },
      {
        rootMargin: `${Math.ceil(exitRange * 100) + 50}% 0px ${
          Math.ceil(enterRange * 100) + 50
        }% 0px`,
      },
    );
    io.observe(canvas);

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    if (hoverCapable) {
      window.addEventListener("mousemove", onMouseMove, { passive: true });
      document.addEventListener("mouseleave", onMouseLeave, {
        passive: true,
      });
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    let cancelled = false;
    // Default (no `src`): render the pre-extracted dot dataset — one
    // point per real stipple dot. A custom `src` (e.g. the LogoMarquee
    // lockup) runtime-samples that image. Both resolve to points
    // normalized to 0..1 of the design box.
    const samplesPromise: Promise<DotPoint[]> = src
      ? loadLogoSamples(src, SAMPLE_WIDTH, sampleH, sampleThreshold).then(
          (sampled) =>
            // Image-sampled pixels carry no per-dot tone — render at full
            // alpha (a = 1); the dot dataset supplies real per-dot alpha.
            sampled.points.map((p) => ({
              x: p.x / sampled.width,
              y: p.y / sampled.height,
              a: 1,
            })),
        )
      : loadDotSamples(DEFAULT_DOTS_SRC);
    samplesPromise
      .then((pts) => {
        if (cancelled) return;
        // Trim per-instance — different usages can pick different
        // densities from the same shared point set.
        logoSamples = pts.slice(0, maxParticles);
        buildParticles();
      })
      .catch((err) => {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[InngestLogoCanvas] failed to load points", err);
        }
      });

    return () => {
      cancelled = true;
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
      if (scrollFrame) cancelAnimationFrame(scrollFrame);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [
    src,
    designW,
    designH,
    anchor,
    enterRange,
    exitRange,
    enableExit,
    maxParticles,
    maxScale,
    exitAngleCenter,
    exitAngleSpread,
    sampleThreshold,
    enterFromLeft,
    particleSize,
    scatterColor,
    xProp,
    yProp,
    originX,
    originY,
    widthProp,
    heightProp,
    maxWidthProp,
    maxHeightProp,
  ]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 z-0 h-full w-full",
        className,
      )}
    />
  );
}
