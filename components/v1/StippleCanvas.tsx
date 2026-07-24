"use client";

import { useEffect, useRef } from "react";
import { resolveToPx } from "@/utils/v1/resolveToPx";
import {
  type Gravity,
  GRAVITY,
  resolveCoord,
  resolveOriginOffset,
} from "@/utils/v1/canvasPlacement";

/**
 * Shared stipple-field canvas — particle field rendered from a
 * pre-baked dot-centre JSON manifest derived from the source asset.
 *
 * Backs the v1 section-hero stipple fields (durable-execution, AI cube,
 * observability, scheduled-jobs, webhooks-events, queues-flow-control,
 * background-jobs, events) via thin `*DotsCanvas` wrappers. Render
 * pipeline: single `beginPath` /
 * `fill`; a one-shot entrance reveal, then a STATIC field. Ambient
 * drift and the gaussian cursor crater are opt-in and default OFF — the
 * heroes don't use perpetual dot motion — with entrance tuning still
 * matching AICubeCanvas / HillsDotsCanvas so the stipples read as one
 * vocabulary.
 *
 * Sizing + placement mirror CSS: `fit` (object-fit cover/contain/fill)
 * or an explicit `width`/`height` (background-size), positioned via
 * `anchor` + `x`/`y` + `originX`/`originY` (object-position /
 * transform-origin — shared with InngestLogoCanvas via
 * `@/utils/v1/canvasPlacement`). `zoom`/`offsetX`/`offsetY`/`rotateDeg`
 * are an extra transform layer applied on top.
 *
 * `prefers-reduced-motion: reduce` skips ambient drift entirely.
 */

// Shared white stipple fill for every StippleCanvas hero (kept in step
// with AICubeCanvas / HillsDotsCanvas) so they read as one vocabulary.
// The mild per-dot alpha lets dots compound a touch brighter where the
// field is dense — reads fine on these silhouettes.
const PARTICLE_FILL = "rgba(255, 255, 255, 0.8)";
const PARTICLE_RADIUS_CSS_DEFAULT = 0.6;

const AMBIENT_FREQ_X = 0.00065;
const AMBIENT_FREQ_Y = 0.00078;

const ORBIT_RX = 0.16;
const ORBIT_RY = 0.12;
const ORBIT_FX = 0.1;
const ORBIT_FY = 0.075;
const ORBIT_PX = Math.PI * 0.4;
const ORBIT_PY = Math.PI * 1.7;

const CRATER_RAMP_MS = 600;
const ENTER_DURATION_MS = 1600;
const ENTER_STAGGER = 0.45;

interface DotsManifest {
  w: number;
  h: number;
  pts: number[]; // flat [x0, y0, x1, y1, ...]
  /** Per-dot radius factor in source-space units. When present, each
   *  particle paints at `particleRadiusCss * (rs[i] / max(rs))` so the
   *  manifest's relative dot-size variation is preserved. Manifests
   *  without `rs` (extracted from PNG screenshots) paint uniformly. */
  rs?: number[];
  /** Dot colour baked from the source art (e.g. the SVG's `<g fill>`).
   *  Used as the paint colour when the consumer doesn't pass an explicit
   *  `particleFill`; absent manifests fall back to the shared frost. */
  fill?: string;
}

/**
 * Scaling mode (CSS `object-fit`). Ignored when an explicit
 * `width`/`height` is given (that's a `background-size` override).
 * - `cover`: uniform scale = max(sx, sy), fills the canvas (default).
 *   Dot radius tracks the scale so the field zooms as a whole.
 * - `contain`: uniform scale = min(sx, sy), fits inside the canvas.
 * - `fill`: independent X/Y scales — non-uniform stretch to the canvas.
 */
export type Fit = "cover" | "contain" | "fill";

const SHARED_MANIFEST_CACHE = new Map<string, Promise<DotsManifest>>();
function loadManifest(src: string, inlineId: string): Promise<DotsManifest> {
  const cached = SHARED_MANIFEST_CACHE.get(src);
  if (cached) return cached;
  let promise: Promise<DotsManifest>;
  if (typeof document !== "undefined") {
    const inline = document.getElementById(inlineId);
    if (inline?.textContent) {
      promise = Promise.resolve(
        JSON.parse(inline.textContent) as DotsManifest,
      );
    } else {
      promise = fetch(src).then((r) => r.json());
    }
  } else {
    promise = fetch(src).then((r) => r.json());
  }
  SHARED_MANIFEST_CACHE.set(src, promise);
  return promise;
}

interface Particle {
  /** Per-particle radius multiplier (1 when the manifest is rs-less). */
  rScale: number;
  hx: number;
  hy: number;
  ox: number;
  oy: number;
  phaseX: number;
  phaseY: number;
  seedX: number;
  seedY: number;
  enterStagger: number;
}

export interface StippleCanvasProps {
  /** Inlined-in-SSR script tag id holding the manifest JSON. */
  manifestInlineId: string;
  /** Fallback URL fetched when the inline script isn't present. */
  manifestSrc: string;
  /** Scaling mode (CSS `object-fit`). Default `cover`. Ignored when an
   *  explicit `width`/`height` is given. */
  fit?: Fit;
  /** Explicit pattern size (CSS `background-size`). `number` = px,
   *  `"NN%"` = fraction of the canvas axis. If only one axis is given
   *  the other is derived from the manifest's aspect ratio; pass both to
   *  stretch. When set, overrides `fit` and paints dots at a fixed CSS
   *  radius (decoupled from the footprint). */
  width?: number | string;
  height?: number | string;
  /** Shrink-only caps on the explicit size, aspect-preserving. Same unit
   *  rules as `width`/`height`. */
  maxWidth?: number | string;
  maxHeight?: number | string;
  /** 9-point gravity (CSS `object-position` keywords) — pins the
   *  matching point of the pattern to the same point of the canvas.
   *  Default `center`. Override with `x`/`y` (canvas point) and
   *  `originX`/`originY` (pattern point) to decouple them for arbitrary
   *  placement / overflow. */
  anchor?: Gravity;
  /** Canvas-space point the pattern's `(originX, originY)` lands on.
   *  `number` = px, `"NN%"` = fraction of the canvas axis. Overrides the
   *  horizontal/vertical placement implied by `anchor`. */
  x?: number | string;
  y?: number | string;
  /** Which point of the **pattern** pins to `(x, y)` (CSS
   *  `transform-origin`). Bare `number` = 0..1 fraction of the pattern's
   *  own extent (`0.5` = centre); `"NN%"` / `"NNpx"` as usual. Defaults
   *  to the `anchor`'s matching point. */
  originX?: number | string;
  originY?: number | string;
  className?: string;
  style?: React.CSSProperties;
  onReady?: () => void;
  /** Fill for every particle dot. When omitted, the manifest's baked
   *  `fill` is used if present, otherwise the shared frost stipple. */
  particleFill?: string;
  craterStrengthPx?: number;
  craterRadiusPx?: number;
  particleRadiusCss?: number;
  /** Lower bound on the per-dot radius factor when the manifest
   *  carries `rs`. Default `0` lets the smallest dot shrink all the
   *  way to its raw normalised size — set to e.g. `0.4` to keep the
   *  inner ring visible when the SVG's depth fade is too aggressive
   *  for the panel size. Has no effect on `rs`-less manifests (which
   *  paint at uniform size anyway). */
  particleRadiusMinFactor?: number;
  /** Per-dot ambient drift amplitude (px). Independent per-particle, so
   *  it shimmers organic shapes but waves straight lines — set to 0 for
   *  geometric patterns (e.g. the observability perspective fan). */
  ambientAmpPx?: number;
  /** Clockwise rotation (degrees) applied around the source's centre
   *  before scaling into screen space. 0 (default) preserves the
   *  source orientation. Use to nudge a baked manifest to match the
   *  design without re-running the extractor. */
  rotateDeg?: number;
  /** Uniform zoom factor applied around the canvas centre after the
   *  fit/size base scale. 1 (default) leaves the base untouched;
   *  values >1 enlarge the pattern (positions and dot radii both
   *  scale up), values <1 shrink it. The panel-centre source point
   *  stays put under zoom — corners crop in or out symmetrically. */
  zoom?: number;
  /** Translates the pattern after layout + zoom. Positive `offsetX`
   *  shifts right; positive `offsetY` shifts down. Accepts:
   *    - `number` — absolute CSS pixels
   *    - `"NNpx"` — same, as a string
   *    - `"NN%"`  — percentage of the canvas axis (cssW / cssH)
   *  Use to nudge a baked manifest off-centre without re-running the
   *  extractor (paired well with `zoom` to frame a specific corner). */
  offsetX?: number | string;
  offsetY?: number | string;
}


export default function StippleCanvas({
  manifestInlineId,
  manifestSrc,
  fit = "cover",
  width,
  height,
  maxWidth,
  maxHeight,
  anchor = "center",
  x,
  y,
  originX,
  originY,
  className,
  style,
  onReady,
  particleFill,
  craterStrengthPx = 0,
  craterRadiusPx = 325,
  particleRadiusCss = PARTICLE_RADIUS_CSS_DEFAULT,
  particleRadiusMinFactor = 0,
  ambientAmpPx = 0,
  rotateDeg = 0,
  zoom = 1,
  offsetX = 0,
  offsetY = 0,
}: StippleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // Latest onReady held in a ref so an inline-arrow parent callback
  // doesn't restart the entrance animation by re-running the effect.
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles: Particle[] = [];
    // Paint colour: an explicit prop wins; otherwise the manifest's baked
    // `fill` (set once the manifest loads) ; otherwise the shared frost.
    let resolvedFill = particleFill ?? PARTICLE_FILL;
    let sourceW = 1;
    let sourceH = 1;
    let cssW = 1;
    let cssH = 1;
    let coverX = 1;
    let coverY = 1;
    let offX = 0;
    let offY = 0;
    // Multiplier on the painted dot radius. 1 for the frame-based
    // layouts (dots are a fixed CSS size); the cover scale for `cover`
    // so the field's dots zoom with the panel like a bitmap.
    let radiusScale = 1;
    let entryStartMs = -1;

    function recomputeCover() {
      // ── Footprint (patternW × patternH) + radiusScale ──────────────
      // An explicit width/height is a `background-size` override: the
      // pattern renders at that absolute size (px or % of canvas) and
      // dots paint at a fixed CSS radius (radiusScale = 1). Otherwise
      // `fit` is object-fit, and the dots zoom with the fit scale.
      let patternW: number;
      let patternH: number;
      const explicitW = resolveCoord(width, cssW, "StippleCanvas");
      const explicitH = resolveCoord(height, cssH, "StippleCanvas");
      if (explicitW !== undefined || explicitH !== undefined) {
        if (explicitW !== undefined && explicitH !== undefined) {
          patternW = explicitW;
          patternH = explicitH;
        } else if (explicitW !== undefined) {
          patternW = explicitW;
          patternH = explicitW * (sourceH / sourceW);
        } else if (explicitH !== undefined) {
          patternH = explicitH;
          patternW = explicitH * (sourceW / sourceH);
        } else {
          // Unreachable — the outer guard ensures one axis is set; keeps
          // the control-flow type-safe without a non-null assertion.
          patternW = sourceW;
          patternH = sourceH;
        }
        // Shrink-only max caps, aspect-preserving.
        const maxW = resolveCoord(maxWidth, cssW, "StippleCanvas");
        const maxH = resolveCoord(maxHeight, cssH, "StippleCanvas");
        let cap = 1;
        if (maxW !== undefined && patternW > maxW) cap = Math.min(cap, maxW / patternW);
        if (maxH !== undefined && patternH > maxH) cap = Math.min(cap, maxH / patternH);
        if (cap < 1) {
          patternW *= cap;
          patternH *= cap;
        }
        coverX = patternW / sourceW;
        coverY = patternH / sourceH;
        radiusScale = 1;
      } else {
        const sx = cssW / sourceW;
        const sy = cssH / sourceH;
        if (fit === "fill") {
          // Non-uniform stretch to the canvas (object-fit: fill).
          coverX = sx;
          coverY = sy;
          radiusScale = Math.sqrt(sx * sy);
        } else {
          const s = fit === "contain" ? Math.min(sx, sy) : Math.max(sx, sy);
          coverX = coverY = s;
          radiusScale = s;
        }
        patternW = sourceW * coverX;
        patternH = sourceH * coverY;
      }
      // ── Placement (object-position / transform-origin) ─────────────
      // `anchor` pins the pattern's matching point to the same point of
      // the canvas; `x`/`y` override the canvas point and
      // `originX`/`originY` override the pattern point — decoupling them
      // for arbitrary placement / overflow.
      const g = GRAVITY[anchor];
      const originOffX = resolveOriginOffset(originX, patternW, g.ox, "StippleCanvas");
      const originOffY = resolveOriginOffset(originY, patternH, g.oy, "StippleCanvas");
      const canvasX = resolveCoord(x, cssW, "StippleCanvas");
      const canvasY = resolveCoord(y, cssH, "StippleCanvas");
      offX = (canvasX !== undefined ? canvasX : g.x * cssW) - originOffX;
      offY = (canvasY !== undefined ? canvasY : g.y * cssH) - originOffY;
      // ── Transform layer (CSS transform: scale + translate) ─────────
      // Zoom about the canvas centre: scale the per-axis covers and
      // shift offsets so the canvas-centre source point stays put. (Dot
      // radius tracks zoom in the paint loop, not radiusScale.)
      if (zoom !== 1) {
        coverX *= zoom;
        coverY *= zoom;
        offX = (cssW / 2) * (1 - zoom) + offX * zoom;
        offY = (cssH / 2) * (1 - zoom) + offY * zoom;
      }
      // User offset — translation applied last so it's independent of
      // placement and zoom. Resolves "%" against the current canvas axis.
      offX += resolveToPx(offsetX, cssW, { label: "StippleCanvas" });
      offY += resolveToPx(offsetY, cssH, { label: "StippleCanvas" });
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      cssW = Math.max(1, Math.round(rect.width));
      cssH = Math.max(1, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      recomputeCover();
    }
    resize();

    let raf = 0;

    const ro = new ResizeObserver(() => {
      resize();
      // Re-arm a repaint if the loop had stopped after the field
      // settled (static canvases halt their rAF — see end of tick).
      if (!raf) raf = requestAnimationFrame(tick);
    });
    ro.observe(canvas);

    function tick(now: number) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cssW, cssH);

      if (!reduceMotion && ambientAmpPx > 0) {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.ox = Math.sin(now * AMBIENT_FREQ_X + p.phaseX) * ambientAmpPx;
          p.oy = Math.cos(now * AMBIENT_FREQ_Y + p.phaseY) * ambientAmpPx;
        }
      }

      // `entryStartMs` is set explicitly in the manifest-load handler
      // via a double-rAF (see below) — guarantees the canvas has
      // painted at least one frame with dots at their off-canvas
      // seed positions before the entry timer begins, so the
      // pour-in is always visible from frame 0 instead of starting
      // mid-flight on cached/instant manifest loads.
      const enterT =
        entryStartMs < 0
          ? 0
          : Math.min(
              1,
              (now - entryStartMs) /
                (ENTER_DURATION_MS * (1 + ENTER_STAGGER)),
            );
      const entering = enterT < 1;

      // Crater attractor lives in CSS space; dots are projected
      // per-particle below.
      const tSec = now / 1000;
      const attrX =
        cssW * 0.5 + Math.cos(tSec * ORBIT_FX + ORBIT_PX) * cssW * ORBIT_RX;
      const attrY =
        cssH * 0.5 + Math.sin(tSec * ORBIT_FY + ORBIT_PY) * cssH * ORBIT_RY;
      const r2 = craterRadiusPx * craterRadiusPx;

      let craterAmp = 0;
      if (entryStartMs >= 0) {
        const sinceEntryEndMs =
          now - entryStartMs - ENTER_DURATION_MS * (1 + ENTER_STAGGER);
        if (sinceEntryEndMs > 0) {
          craterAmp = Math.min(1, sinceEntryEndMs / CRATER_RAMP_MS);
        }
      }
      const liveStrength = craterStrengthPx * craterAmp;
      const hasCrater = liveStrength > 0.01;

      const TWO_PI = Math.PI * 2;

      ctx.fillStyle = resolvedFill;
      ctx.beginPath();
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        let sxv = p.hx + p.ox;
        let syv = p.hy + p.oy;
        if (entering) {
          const local = Math.max(
            0,
            (enterT - p.enterStagger) / (1 - p.enterStagger),
          );
          const eased = 1 - (1 - local) ** 3;
          sxv = p.seedX + (p.hx + p.ox - p.seedX) * eased;
          syv = p.seedY + (p.hy + p.oy - p.seedY) * eased;
        }
        let x = sxv * coverX + offX;
        let y = syv * coverY + offY;
        if (hasCrater) {
          const dx = x - attrX;
          const dy = y - attrY;
          const d2 = dx * dx + dy * dy;
          const mag = liveStrength * Math.exp(-d2 / r2);
          if (mag > 0.01) {
            const dist = Math.sqrt(d2);
            if (dist > 0.0001) {
              const inv = mag / dist;
              x += dx * inv;
              y += dy * inv;
            }
          }
        }
        const rDot = particleRadiusCss * p.rScale * zoom * radiusScale;
        ctx.moveTo(x + rDot, y);
        ctx.arc(x, y, rDot, 0, TWO_PI);
      }
      ctx.fill();

      // Keep looping only while something actually moves: during the
      // entrance, while the crater is (or will be) active, or while
      // ambient drift is on. A fully-settled static field — the
      // observability perspective fan, or any hero under
      // prefers-reduced-motion with no crater — stops here instead of
      // repainting an unchanging frame 60×/s. ResizeObserver re-arms.
      const animated =
        entering ||
        hasCrater ||
        craterStrengthPx > 0 ||
        (!reduceMotion && ambientAmpPx > 0);
      raf = animated ? requestAnimationFrame(tick) : 0;
    }

    let cancelled = false;
    loadManifest(manifestSrc, manifestInlineId).then((manifest) => {
      if (cancelled) return;
      // Use the SVG-baked dot colour unless the consumer set one explicitly.
      if (particleFill == null && typeof manifest.fill === "string") {
        resolvedFill = manifest.fill;
      }
      sourceW = manifest.w;
      sourceH = manifest.h;
      // Bake rotation about the source centre into the stored
      // coordinates once at load — every frame then reads the
      // already-rotated values with no extra trig.
      const theta = (rotateDeg * Math.PI) / 180;
      const cos = Math.cos(theta);
      const sin = Math.sin(theta);
      const cx = sourceW / 2;
      const cy = sourceH / 2;
      // When the manifest carries per-dot radii, normalise to a 0..1
      // factor against the maximum so `particleRadiusCss` still drives
      // the largest dot's CSS size and the rest scale down with it.
      const rs = manifest.rs;
      let invMaxR = 1;
      if (rs && rs.length > 0) {
        let maxR = 0;
        for (let i = 0; i < rs.length; i++) {
          if (rs[i] > maxR) maxR = rs[i];
        }
        if (maxR > 0) invMaxR = 1 / maxR;
      }
      const next: Particle[] = new Array(manifest.pts.length / 2);
      for (let i = 0, j = 0; i < manifest.pts.length; i += 2, j++) {
        const rawX = manifest.pts[i];
        const rawY = manifest.pts[i + 1];
        const dx = rawX - cx;
        const dy = rawY - cy;
        next[j] = {
          // Per-dot factor lerped between the configured floor and 1.
          // `particleRadiusMinFactor` defaults to 0 → raw normalised
          // factor; lift it (e.g. 0.4) to keep small dots visible.
          rScale: rs
            ? particleRadiusMinFactor +
              rs[j] * invMaxR * (1 - particleRadiusMinFactor)
            : 1,
          // Positive `rotateDeg` rotates clockwise in screen space
          // (y-axis points down on canvas), hence the sign of `sin`
          // here matches a standard CCW rotation matrix.
          hx: cx + dx * cos - dy * sin,
          hy: cy + dx * sin + dy * cos,
          ox: 0,
          oy: 0,
          phaseX: Math.random() * Math.PI * 2,
          phaseY: Math.random() * Math.PI * 2,
          seedX: -sourceW * (0.18 + Math.random() * 0.22),
          seedY: -sourceH * (0.12 + Math.random() * 0.22),
          enterStagger: Math.random() * ENTER_STAGGER,
        };
      }
      particles = next;
      recomputeCover();
      if (!raf) raf = requestAnimationFrame(tick);
      // Double rAF: the first frame paints dots at their off-canvas
      // seed positions (invisible) and lets the ResizeObserver settle
      // cssW/cssH on cached/instant loads. The second frame is when
      // we start the entry timer — guarantees the pour-in plays from
      // frame zero instead of starting mid-flight when the manifest
      // was already cached. Also gates onReady the same way so
      // parent reveal animations don't race the canvas's first paint.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (cancelled) return;
          entryStartMs = performance.now();
          onReadyRef.current?.();
        });
      });
    });

    return () => {
      cancelled = true;
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [
    manifestInlineId,
    manifestSrc,
    fit,
    width,
    height,
    maxWidth,
    maxHeight,
    anchor,
    x,
    y,
    originX,
    originY,
    particleFill,
    craterStrengthPx,
    craterRadiusPx,
    particleRadiusCss,
    particleRadiusMinFactor,
    ambientAmpPx,
    rotateDeg,
    zoom,
    offsetX,
    offsetY,
  ]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={style}
    />
  );
}
