"use client";

import { useEffect, useRef } from "react";

/**
 * Per-card animated dot field for the About "Our Team" grid — the
 * canvas replacement for the old static `sphere.svg`. Dot POSITIONS
 * are parsed straight from that SVG, so the crater/wave the dots
 * already curve around is reproduced pixel-for-pixel and the cards
 * stay on-brand at rest.
 *
 * On hover a single gravity well — the footer's mechanic — is anchored
 * at that baked crater's centre (detected in `rebuild`) and pushes the
 * surrounding dots radially outward (gaussian falloff) while drifting
 * on a slow lissajous, so the EXISTING crater breathes instead of a
 * new one appearing. The displaced dots tint salmon (the footer's
 * accent-tracks-displacement rule). Displacement + tint both scale
 * with `hoverBlend`, so at rest the dots sit untouched at their
 * baked-in positions.
 *
 * Dots are clipped by the parent's `overflow-hidden`, so they always
 * stay inside the card.
 *
 * Performance: up to 27 mount in the grid, so the rAF loop runs ONLY
 * while a card is hovered (plus the short settle tail) — at rest each
 * paints a single static frame. The SVG is fetched + parsed once and
 * shared across every instance. Hover binds only on hover-capable
 * pointers; static + neutral under `prefers-reduced-motion`.
 */

const SPHERE_SRC = "/assets/v1/about-team/sphere.svg";
const VIEW_W = 406.653; // sphere.svg viewBox
const VIEW_H = 405;
const ACCENT = [253, 138, 114] as const; // Salmon/100 (#fd8a72)
// The dot export runs right to the viewBox edges (cx 0.49→407.25,
// cy 1.33→405.88), so filling the photo area edge-to-edge lands the
// outermost dots on the card's 1px gradient ring and they bleed through
// it. Inset the field a few px so the dots clear the border cleanly.
const EDGE_INSET = 4;

type RawDot = { x: number; y: number; r: number };

// Fetch + parse the dot positions once, shared across all cards.
let dotsPromise: Promise<RawDot[]> | null = null;
function loadSphereDots(): Promise<RawDot[]> {
  if (!dotsPromise) {
    dotsPromise = fetch(SPHERE_SRC)
      .then((r) => r.text())
      .then((svg) => {
        const out: RawDot[] = [];
        const re = /<circle cx="([\d.]+)" cy="([\d.]+)" r="([\d.]+)"/g;
        let m: RegExpExecArray | null;
        while ((m = re.exec(svg))) {
          out.push({ x: +m[1], y: +m[2], r: +m[3] });
        }
        return out;
      })
      .catch(() => []);
  }
  return dotsPromise;
}

export default function TeamDotSphere({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    // Hover fires on the whole card (incl. the meta strip), not just
    // the photo area — find the card wrapper, fall back to the parent.
    const card = canvas.closest<HTMLElement>("[data-team-card]") ?? parent;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    // Skip the hover effect on touch — `pointerenter` would fire on tap
    // and the breathing/salmon would have no real hover to belong to.
    const hoverCapable = window.matchMedia("(hover: hover)").matches;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    type Dot = { x: number; y: number; r: number };
    let raw: RawDot[] = [];
    let dots: Dot[] = [];
    let W = 0;
    let H = 0;
    // Gravity well — footer mechanic. Anchored at the baked crater's
    // centre (detected in `rebuild`); on hover it pushes nearby dots
    // radially outward (gaussian falloff) and drifts on a lissajous so
    // that same crater breathes, while the displaced dots tint salmon.
    // Both displacement and tint scale with `hoverBlend`, so at rest the
    // dots sit at their exact baked-in positions, untouched.
    let wellX = 0;
    let wellY = 0;
    let wellR = 1;
    let strength = 1;

    const rebuild = () => {
      if (!raw.length) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = parent.clientWidth;
      H = parent.clientHeight;
      if (!W || !H) return;
      canvas.width = Math.max(1, Math.round(W * dpr));
      canvas.height = Math.max(1, Math.round(H * dpr));
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const sx = (W - EDGE_INSET * 2) / VIEW_W;
      const sy = (H - EDGE_INSET * 2) / VIEW_H;
      dots = raw.map((d) => ({
        x: EDGE_INSET + d.x * sx,
        y: EDGE_INSET + d.y * sy,
        r: Math.max(0.6, d.r * sx),
      }));

      // Locate the crater that's ALREADY baked into the dots — the
      // sparsest region of the lattice (the void the dots curve
      // around). The hover well is anchored there so it breathes that
      // same crater instead of carving a new one elsewhere.
      const GX = 7;
      const GY = 7;
      const bins = new Array(GX * GY).fill(0);
      for (const d of dots) {
        const bx = Math.min(GX - 1, Math.max(0, Math.floor((d.x / W) * GX)));
        const by = Math.min(GY - 1, Math.max(0, Math.floor((d.y / H) * GY)));
        bins[by * GX + bx]++;
      }
      let minI = 0;
      for (let i = 1; i < bins.length; i++) {
        if (bins[i] < bins[minI]) minI = i;
      }
      wellX = ((minI % GX) + 0.5) / GX * W;
      wellY = (Math.floor(minI / GX) + 0.5) / GY * H;
      // Wide reach so the crater's whole ring (the visible arc, far from
      // the void) is animated and lit, not just the empty centre.
      wellR = W * 0.55;
      strength = W * 0.09; // gentle — deepens/breathes the existing crater
    };

    let hoverBlend = 0;
    let targetHoverBlend = 0;
    let frame = 0;

    // Drifting gravity well — dots are pushed radially outward with a
    // gaussian falloff and the well orbits a slow lissajous so the
    // bulge breathes (the footer's motion). Displacement + salmon both
    // scale with hoverBlend.
    const draw = (now: number) => {
      const t = now / 1000;
      const ax =
        wellX + (reduceMotion ? 0 : Math.cos(t * 0.42 + 1.3) * W * 0.09 * hoverBlend);
      const ay =
        wellY + (reduceMotion ? 0 : Math.sin(t * 0.31 + 5.3) * H * 0.07 * hoverBlend);
      const r2 = wellR * wellR;

      ctx.clearRect(0, 0, W, H);
      for (const d of dots) {
        const ex = d.x - ax;
        const ey = d.y - ay;
        const dist2 = ex * ex + ey * ey;
        const dist = Math.sqrt(dist2);
        // Peak displacement near the well, fading out; gated by hover so
        // the dots are exactly at their baked-in positions at rest.
        const mag = strength * Math.exp(-dist2 / r2) * hoverBlend;

        let x = d.x;
        let y = d.y;
        if (mag > 0.01 && dist > 0.0001) {
          const inv = mag / dist;
          x = d.x + ex * inv;
          y = d.y + ey * inv;
        }

        // 0..1 salmon amount tracks the displacement, so the dots that
        // move are the ones that light up (footer's accent rule).
        const s = mag / strength;
        const g = Math.round(255 - (255 - ACCENT[1]) * s);
        const b = Math.round(255 - (255 - ACCENT[2]) * s);
        ctx.globalAlpha = Math.min(1, 0.85 + s * 0.15);
        ctx.fillStyle = `rgb(255, ${g}, ${b})`;
        ctx.beginPath();
        ctx.arc(x, y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const step = (now: number) => {
      const rate = targetHoverBlend > hoverBlend ? 0.08 : 0.05;
      hoverBlend += (targetHoverBlend - hoverBlend) * rate;
      draw(now);
      if (targetHoverBlend === 0 && hoverBlend < 0.01) {
        hoverBlend = 0;
        draw(now); // clean rest frame
        frame = 0;
        return;
      }
      frame = requestAnimationFrame(step);
    };

    const start = () => {
      if (!frame) frame = requestAnimationFrame(step);
    };

    const onEnter = () => {
      targetHoverBlend = 1;
      if (reduceMotion) {
        hoverBlend = 1;
        draw(0); // instant salmon, no motion
        return;
      }
      start();
    };
    const onLeave = () => {
      targetHoverBlend = 0;
      if (reduceMotion) {
        hoverBlend = 0;
        draw(0);
        return;
      }
      start();
    };

    let cancelled = false;
    loadSphereDots().then((loaded) => {
      if (cancelled) return;
      raw = loaded;
      rebuild();
      draw(0); // initial static rest frame
    });

    if (hoverCapable) {
      card.addEventListener("pointerenter", onEnter);
      card.addEventListener("pointerleave", onLeave);
    }

    const ro = new ResizeObserver(() => {
      rebuild();
      if (!frame) draw(0);
    });
    ro.observe(parent);

    const onVis = () => {
      if (document.hidden && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelled = true;
      card.removeEventListener("pointerenter", onEnter);
      card.removeEventListener("pointerleave", onLeave);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
