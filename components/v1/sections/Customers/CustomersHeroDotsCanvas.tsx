"use client";

import { useEffect, useRef } from "react";

/**
 * Customers hero sphere stipple field — particle canvas rendered from
 * a pre-baked dot-centre JSON manifest extracted from the source
 * PNG by `scripts/extract-customers-hero-dots.mjs`. Each entry is one
 * stipple position normalised to the image's [0..1] coordinate frame,
 * so the runtime can scale the field to whatever panel size the
 * wrapper provides while preserving the silhouette + density
 * exactly.
 *
 * Same family as `AICubeCanvas` and `HillsDotsCanvas`:
 *   - Pour-in entrance: each particle has an off-canvas seed + random
 *     stagger, eases into its home position via easeOutCubic. Gated on
 *     the canvas being visible so it plays when scrolled into view,
 *     not on mount.
 *   - Ambient sway: tiny per-particle elliptical drift around home,
 *     so the field reads "alive" without any one dot's motion being
 *     obvious.
 *
 * No gaussian crater / attractor — the sphere silhouette stays whole.
 * `prefers-reduced-motion: reduce` snaps to a single static frame.
 */

const DOTS_SRC = "/assets/v1/customers-hero/dots.json";

const PARTICLE_FILL = "rgba(255, 255, 255, 0.85)";
const MIN_DRAW_RADIUS = 0.85;

const AMBIENT_AMP = 0.9;
const AMBIENT_FREQ_X = 0.00065;
const AMBIENT_FREQ_Y = 0.00078;

const ENTER_DURATION_MS = 1600;
const ENTER_STAGGER = 0.45;

// Manifest extraction baked these in the bbox-normalised image-pixel
// frame; the runtime rescales radii via `imgPx / MANIFEST_IMAGE_SIZE`.
const MANIFEST_IMAGE_SIZE = 2084;

// Alpha quantisation buckets for the draw pass. Visually identical to
// per-dot alpha at this density; reduces fillStyle/state churn from
// O(dots) to O(buckets).
const ALPHA_BUCKETS = 32;

interface DotsManifest {
  imageSize: number;
  dotCount: number;
  /** Flat [x0, y0, r0, a0, x1, y1, r1, a1, …] in image [0..1]. */
  pts: number[];
}

let manifestPromise: Promise<DotsManifest> | null = null;
function loadManifest(): Promise<DotsManifest> {
  if (manifestPromise) return manifestPromise;
  manifestPromise = fetch(DOTS_SRC).then((r) => {
    if (!r.ok) {
      throw new Error(
        `CustomersHeroDotsCanvas: failed to load ${DOTS_SRC} (${r.status})`,
      );
    }
    return r.json();
  });
  // Reset the cached promise on failure so a remount can retry instead
  // of inheriting the rejection forever.
  manifestPromise.catch(() => {
    manifestPromise = null;
  });
  return manifestPromise;
}

interface CustomersHeroDotsCanvasProps {
  className?: string;
  style?: React.CSSProperties;
  /**
   * How the square stipple is fit into the (likely non-square) panel.
   * "contain" preserves the full silhouette with letterboxing;
   * "cover" fills the panel and crops the overflow.
   */
  fit?: "contain" | "cover";
  onReady?: () => void;
}

export default function CustomersHeroDotsCanvas({
  className,
  style,
  fit = "contain",
  onReady,
}: CustomersHeroDotsCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // Keep onReady out of the effect deps so a fresh parent callback
  // reference doesn't tear down and restart the canvas/pour-in.
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Track reduced-motion live so an OS-level toggle takes effect
    // immediately (without needing the user to reload the page).
    const motionMql = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduceMotion = motionMql.matches;
    const onMotionChange = (e: MediaQueryListEvent) => {
      reduceMotion = e.matches;
      if (reduceMotion) {
        // Snap to static frame on the next tick; an existing rAF
        // will pick up the new value and self-cancel.
        if (!raf && particleCount > 0) raf = requestAnimationFrame(tick);
      } else if (visible && !raf) {
        // Re-enter motion: restart the loop (entry already complete
        // by now, so this just resumes ambient drift).
        startLoop();
      }
    };
    motionMql.addEventListener("change", onMotionChange);

    // ─── Particle SoA (struct-of-arrays) ─────────────────────────
    // Hot per-frame loop only touches typed-array slots — no object
    // dereferences, no per-frame allocations. Sized once the manifest
    // resolves; re-sizing the canvas does NOT rebuild these (entry
    // params are preserved across resizes so a mid-pour layout shift
    // doesn't restart the animation).
    let particleCount = 0;
    let homeX: Float32Array = new Float32Array(0);
    let homeY: Float32Array = new Float32Array(0);
    // Pour-in entry params, fixed per particle for the canvas's
    // lifetime. seedOffX/Y are deltas added to homeX/Y so resizes
    // re-anchor the pour to the new home positions automatically.
    let seedOffX: Float32Array = new Float32Array(0);
    let seedOffY: Float32Array = new Float32Array(0);
    let stagger: Float32Array = new Float32Array(0);
    let phaseX: Float32Array = new Float32Array(0);
    let phaseY: Float32Array = new Float32Array(0);
    let manifestNX: Float32Array = new Float32Array(0); // [0..1] in image space
    let manifestNY: Float32Array = new Float32Array(0);
    let manifestNR: Float32Array = new Float32Array(0); // image-pixel radius
    let drawR: Float32Array = new Float32Array(0); // post-scale CSS px
    let alpha: Float32Array = new Float32Array(0);

    // Alpha-bucket draw buffers, hoisted out of the frame loop to
    // amortise allocation across the whole canvas lifetime. Each
    // bucket holds interleaved [x, y, r, x, y, r, …]; `bucketCount`
    // tracks valid triples (reset to 0 each frame instead of
    // reallocating). Sized at manifest-load to max possible (every
    // dot in one bucket).
    const bucketData: Float32Array[] = new Array(ALPHA_BUCKETS);
    const bucketCount = new Int32Array(ALPHA_BUCKETS);
    for (let b = 0; b < ALPHA_BUCKETS; b++) {
      bucketData[b] = new Float32Array(0);
    }

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let cssW = 1;
    let cssH = 1;
    let imgPx = 1;
    let imgLeft = 0;
    let imgTop = 0;

    let entryStartMs = -1;
    let visible = false;
    let raf = 0;
    let cancelled = false;
    let readyFired = false;

    function rebuildFromManifest(manifest: DotsManifest) {
      const pts = manifest.pts;
      particleCount = (pts.length / 4) | 0;
      manifestNX = new Float32Array(particleCount);
      manifestNY = new Float32Array(particleCount);
      manifestNR = new Float32Array(particleCount);
      alpha = new Float32Array(particleCount);
      homeX = new Float32Array(particleCount);
      homeY = new Float32Array(particleCount);
      drawR = new Float32Array(particleCount);
      seedOffX = new Float32Array(particleCount);
      seedOffY = new Float32Array(particleCount);
      stagger = new Float32Array(particleCount);
      phaseX = new Float32Array(particleCount);
      phaseY = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        const j = i * 4;
        manifestNX[i] = pts[j];
        manifestNY[i] = pts[j + 1];
        manifestNR[i] = pts[j + 2];
        alpha[i] = pts[j + 3];
        // Pour from off-canvas top-left, randomised so dots arrive
        // in a sweep instead of a single laser line. Stored as a
        // DELTA from the home position so resizing the canvas
        // automatically re-anchors the seed.
        seedOffX[i] = -(0.25 + Math.random() * 0.35);
        seedOffY[i] = -(0.4 + Math.random() * 0.4);
        stagger[i] = Math.random() * ENTER_STAGGER;
        phaseX[i] = Math.random() * Math.PI * 2;
        phaseY[i] = Math.random() * Math.PI * 2;
      }

      // Bucket capacity = particle count (worst case: all in one).
      for (let b = 0; b < ALPHA_BUCKETS; b++) {
        bucketData[b] = new Float32Array(particleCount * 3);
      }
    }

    function placeHomes() {
      if (particleCount === 0) return;
      imgPx = fit === "cover" ? Math.max(cssW, cssH) : Math.min(cssW, cssH);
      imgLeft = (cssW - imgPx) / 2;
      imgTop = (cssH - imgPx) / 2;
      const radiusScale = imgPx / MANIFEST_IMAGE_SIZE;
      for (let i = 0; i < particleCount; i++) {
        homeX[i] = imgLeft + manifestNX[i] * imgPx;
        homeY[i] = imgTop + manifestNY[i] * imgPx;
        const r = manifestNR[i] * radiusScale;
        drawR[i] = r < MIN_DRAW_RADIUS ? MIN_DRAW_RADIUS : r;
      }
    }

    function applySize(widthPx: number, heightPx: number) {
      cssW = Math.max(1, Math.round(widthPx));
      cssH = Math.max(1, Math.round(heightPx));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      placeHomes();
    }

    function resizeFromRect() {
      // Only used for the initial sizing — RO callbacks pass the
      // measured size directly, avoiding a forced layout flush.
      const rect = canvas.getBoundingClientRect();
      applySize(rect.width, rect.height);
    }

    function tick(now: number) {
      raf = requestAnimationFrame(tick);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cssW, cssH);

      const enterT = reduceMotion
        ? 1
        : entryStartMs < 0
          ? 0
          : Math.min(
              1,
              (now - entryStartMs) /
                (ENTER_DURATION_MS * (1 + ENTER_STAGGER)),
            );
      const entering = enterT < 1;

      // Reset bucket counts. Allocations are reused across frames.
      for (let b = 0; b < ALPHA_BUCKETS; b++) bucketCount[b] = 0;

      // Pre-compute ambient frequency products once per frame so the
      // inner loop is a single sin/cos per axis per dot.
      const ambFx = now * AMBIENT_FREQ_X;
      const ambFy = now * AMBIENT_FREQ_Y;

      for (let i = 0; i < particleCount; i++) {
        const hx = homeX[i];
        const hy = homeY[i];
        const ox = reduceMotion ? 0 : Math.sin(ambFx + phaseX[i]) * AMBIENT_AMP;
        const oy = reduceMotion ? 0 : Math.cos(ambFy + phaseY[i]) * AMBIENT_AMP;

        let x = hx + ox;
        let y = hy + oy;
        let fadeAlpha = 1;

        if (entering) {
          const s = stagger[i];
          // Per-particle local progress, shared between position
          // lerp and alpha fade — same expression, computed once.
          const local = enterT > s ? (enterT - s) / (1 - s) : 0;
          const eased = 1 - (1 - local) * (1 - local) * (1 - local);
          // Seed is a delta scaled by panel size (offsets are
          // viewport-relative so the pour distance scales with the
          // canvas).
          const seedX = hx + seedOffX[i] * cssW;
          const seedY = hy + seedOffY[i] * cssH;
          x = seedX + (x - seedX) * eased;
          y = seedY + (y - seedY) * eased;
          fadeAlpha = local;
        }

        const a = alpha[i] * fadeAlpha;
        if (a < 0.01) continue;

        // Quantise alpha to a bucket index and append to that
        // bucket's interleaved Float32 buffer.
        let bIdx = (a * ALPHA_BUCKETS) | 0;
        if (bIdx >= ALPHA_BUCKETS) bIdx = ALPHA_BUCKETS - 1;
        const buf = bucketData[bIdx];
        const c = bucketCount[bIdx];
        const off = c * 3;
        buf[off] = x;
        buf[off + 1] = y;
        buf[off + 2] = drawR[i];
        bucketCount[bIdx] = c + 1;
      }

      ctx.fillStyle = PARTICLE_FILL;
      for (let b = 0; b < ALPHA_BUCKETS; b++) {
        const count = bucketCount[b];
        if (count === 0) continue;
        ctx.globalAlpha = (b + 0.5) / ALPHA_BUCKETS;
        const buf = bucketData[b];
        ctx.beginPath();
        for (let k = 0; k < count; k++) {
          const off = k * 3;
          const x = buf[off];
          const y = buf[off + 1];
          const r = buf[off + 2];
          ctx.moveTo(x + r, y);
          ctx.arc(x, y, r, 0, Math.PI * 2);
        }
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (!readyFired && particleCount > 0) {
        readyFired = true;
        onReadyRef.current?.();
      }

      // Reduced motion: paint one static frame and stop the loop —
      // ambient drift and pour are skipped, nothing else changes.
      if (reduceMotion) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    }

    function startLoop() {
      if (raf || particleCount === 0) return;
      raf = requestAnimationFrame(tick);
      if (reduceMotion) return;
      // Double-rAF gate so the canvas has painted one frame with
      // dots at their off-canvas seed positions (invisible) before
      // t=0 — guarantees the pour-in is visible from frame zero,
      // including on fast/cached manifest loads.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (cancelled) return;
          if (entryStartMs < 0) entryStartMs = performance.now();
        });
      });
    }

    // Initial sizing — ResizeObserver fires on .observe() too, but
    // doing it eagerly here means the first frame after manifest
    // load already has correct homes.
    resizeFromRect();
    const ro = new ResizeObserver((entries) => {
      // contentRect is delivered by the observer; reading it avoids
      // the synchronous layout flush that getBoundingClientRect()
      // would trigger inside the callback.
      const entry = entries[0];
      if (!entry) return;
      const rect = entry.contentRect;
      applySize(rect.width, rect.height);
    });
    ro.observe(canvas);

    loadManifest().then((manifest) => {
      if (cancelled) return;
      rebuildFromManifest(manifest);
      placeHomes();
      if (visible || reduceMotion) startLoop();
    });

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) startLoop();
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVis = () => {
      if (document.hidden && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!document.hidden && visible && !raf && !reduceMotion) {
        raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelled = true;
      io.disconnect();
      ro.disconnect();
      motionMql.removeEventListener("change", onMotionChange);
      document.removeEventListener("visibilitychange", onVis);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [fit]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={style}
    />
  );
}
