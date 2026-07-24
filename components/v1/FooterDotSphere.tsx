"use client";

import { useEffect, useRef } from "react";

/**
 * Dot-grid footer background with a single hidden gravity well. The
 * dots sit on a regular lattice; one invisible attractor pushes the
 * dots radially outward via a gaussian falloff, producing a single
 * "crater" — empty centre ringed by clustered dots. The attractor
 * walks a slow lissajous orbit so the bulge breathes.
 *
 *   - 24 px grid spacing, 1–2 px dots, cool-grey at low alpha
 *   - blue tint only on dots that are pushed AND sit on the left
 *     side of the attractor
 *   - falloff:  strength * exp(-d² / radius²)
 *   - one attractor, slow orbit (~80–120 s loop)
 *
 * Renders below content (`pointer-events: none`, `absolute inset-0`).
 * Paused on `document.hidden`; static under `prefers-reduced-motion`.
 */
export default function FooterDotSphere({
  /** Grid spacing in CSS pixels. */
  spacing = 24,
  /** Peak displacement (px) at the attractor's centre. */
  strength = 140,
  /** Gaussian falloff radius (px). Controls how wide the well is. */
  radius = 460,
  /** Orbit-speed multiplier applied to both lissajous frequencies.
   *  1 = live default (~87s X / 116s Y loop). The test pages bump
   *  this so the bulge breathes faster during design review. */
  speed = 1,
}: {
  spacing?: number;
  strength?: number;
  radius?: number;
  speed?: number;
} = {}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const hoverCapable = window.matchMedia("(hover: hover)").matches;
    // Re-read on each rebuild so monitor changes / browser zoom pick
    // up the new DPR instead of rasterising against the stale value
    // captured at mount.
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    type Dot = {
      gx: number;
      gy: number;
      size: number;
      tone: number;
      entryY: number;
    };

    let W = 0;
    let H = 0;
    let dots: Dot[] = [];
    // The single attractor's anchor — orbit is computed from this each frame.
    let anchorX = 0;
    let anchorY = 0;
    // Orbit radii (fractions of W / H), incommensurate frequencies + phases.
    const orbitRx = 0.16;
    const orbitRy = 0.12;
    const orbitFx = 0.072 * speed; // rad/s ⇒ ~87 s/loop on X at speed=1
    const orbitFy = 0.054 * speed; // rad/s ⇒ ~116 s/loop on Y at speed=1
    const orbitPx = Math.PI * 0.4;
    const orbitPy = Math.PI * 1.7;

    const rebuild = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = parent.clientWidth;
      H = parent.clientHeight;
      canvas.width = Math.max(1, Math.round(W * dpr));
      canvas.height = Math.max(1, Math.round(H * dpr));
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Centre the dot lattice with equal padding on every edge.
      const cols = Math.max(2, Math.floor(W / spacing));
      const rows = Math.max(2, Math.floor(H / spacing));
      const startX = (W - spacing * (cols - 1)) / 2;
      const startY = (H - spacing * (rows - 1)) / 2;
      dots = [];
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          dots.push({
            gx: startX + col * spacing,
            gy: startY + row * spacing,
            size: Math.random() < 0.8 ? 1 : 1.6,
            tone: 0.22 + Math.random() * 0.32,
            // Stable per-dot entry Y above the canvas — computed
            // once here so the spray trajectory is deterministic
            // (no per-frame Math.random() jitter).
            entryY: -120 - Math.random() * 220,
          });
        }
      }

      // Anchor the attractor slightly left of centre, mid-height, so
      // the sphere has room to drift without clipping the right edge.
      anchorX = W * 0.5;
      anchorY = H * 0.55;
    };
    rebuild();

    let visible = false;
    let entryProgress = 0;
    let frame = 0;
    // Entry is scroll-coupled, not time-based — dots progress as the
    // user scrolls toward the footer. Sticky max so once the logo is
    // fully formed it stays formed even if the user scrolls back up.
    let maxEntryProgress = 0;
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const updateScrollEntryProgress = () => {
      const rect = canvas.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // 0 when the canvas top sits at the viewport bottom (entry
      // begins as the canvas just starts to come into view), 1 when
      // the canvas top crosses ~15 % of the viewport (entry
      // completes by the time the user reaches the footer).
      const raw = (vh - rect.top) / (vh * 0.85);
      const sp = Math.max(0, Math.min(1, raw));
      if (sp > maxEntryProgress) maxEntryProgress = sp;
    };
    updateScrollEntryProgress();
    window.addEventListener("scroll", updateScrollEntryProgress, {
      passive: true,
    });
    window.addEventListener("resize", updateScrollEntryProgress, {
      passive: true,
    });

    // Hover state — when the cursor is over the canvas's bounding box
    // (the footer area), the attractor's TARGET position lerps from
    // its drift position toward the cursor. The actual attractor
    // position then follows the target via a spring (tension + light
    // friction), so it overshoots and damped-oscillates back when the
    // cursor stops — a soft jello jiggle, not a snap.
    let hoverBlend = 0;
    let targetHoverBlend = 0;
    let mouseX = 0;
    let mouseY = 0;
    // Attractor position + velocity for the spring. Initialised to
    // the drift origin so the first frame renders cleanly.
    let attrX = W * 0.5;
    let attrY = H * 0.55;
    let attrVX = 0;
    let attrVY = 0;
    // Spring constants. Tension/friction tuned for visible overshoot
    // (~5-8 % overshoot then 2-3 quiet swings before settling).
    const SPRING_TENSION = 0.10;
    const SPRING_FRICTION = 0.18;

    const NEUTRAL = "186, 188, 200";
    const ACCENT = "1, 60, 246";

    const draw = (now: number) => {
      frame = requestAnimationFrame(draw);
      // Scroll-coupled entry — read the sticky max so the formed
      // state holds when scrolling back up.
      entryProgress = maxEntryProgress;
      const t = reduceMotion ? 0 : now / 1000;

      // Drift position — single slow lissajous orbit.
      const driftX = anchorX + Math.cos(t * orbitFx + orbitPx) * W * orbitRx;
      const driftY = anchorY + Math.sin(t * orbitFy + orbitPy) * H * orbitRy;

      // Lerp hoverBlend toward target — slower than before so the
      // attractor doesn't whip toward the cursor instantly. ~250 ms
      // ramp on enter, ~700 ms decay on leave.
      const blendRate = targetHoverBlend > hoverBlend ? 0.08 : 0.03;
      hoverBlend += (targetHoverBlend - hoverBlend) * blendRate;

      // Spring target: drift when idle, cursor when fully hovered.
      const targetAttrX = driftX + (mouseX - driftX) * hoverBlend;
      const targetAttrY = driftY + (mouseY - driftY) * hoverBlend;
      // Hooke's law + friction → under-damped spring. Produces the
      // jello jiggle when the cursor stops moving (the spring keeps
      // bouncing for a couple of cycles before settling).
      attrVX += (targetAttrX - attrX) * SPRING_TENSION;
      attrVY += (targetAttrY - attrY) * SPRING_TENSION;
      attrVX *= 1 - SPRING_FRICTION;
      attrVY *= 1 - SPRING_FRICTION;
      attrX += attrVX;
      attrY += attrVY;

      ctx.clearRect(0, 0, W, H);

      const r2 = radius * radius;
      // Per-dot entry: dot starts at the right edge (entryX) and
      // lerps to its final lattice position. Per-dot timing
      // staggers by gx so the rightmost dots arrive first and the
      // leftmost arrive last — reads as a spray sweeping from
      // right to left as it forms the logo.
      const ENTRY_RIGHT_OFFSET = 80;
      const STAGGER_SPAN = 0.45;
      for (const d of dots) {
        // Compute final position (with attractor displacement).
        const dx = d.gx - attrX;
        const dy = d.gy - attrY;
        const d2 = dx * dx + dy * dy;
        const dist = Math.sqrt(d2);
        const mag = strength * Math.exp(-d2 / r2);

        let finalX = d.gx;
        let finalY = d.gy;
        if (mag > 0.01 && dist > 0.0001) {
          const inv = mag / dist;
          finalX = d.gx + dx * inv;
          finalY = d.gy + dy * inv;
        }

        // Per-dot entry progress — left dots start later so the
        // rightmost lights up first.
        const dotStartT = (1 - d.gx / W) * STAGGER_SPAN;
        const dotProgress = Math.max(
          0,
          Math.min(1, (entryProgress - dotStartT) / (1 - dotStartT)),
        );
        const easedDot = easeOutCubic(dotProgress);

        // Dots enter from above-right of the canvas — top-right
        // diagonal trajectory so the spray reads as "coming in
        // from up high" rather than purely horizontally.
        const entryX = W + ENTRY_RIGHT_OFFSET;
        const drawX = entryX + (finalX - entryX) * easedDot;
        const drawY = d.entryY + (finalY - d.entryY) * easedDot;

        // Blue only on dots left of the attractor AND being displaced.
        const intensity = mag / strength; // 0..1
        const blueT = d.gx < attrX ? intensity : 0;

        const alpha = d.tone * (1 + blueT * 1.4) * dotProgress;
        if (alpha <= 0.005) continue;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = blueT > 0.04 ? `rgb(${ACCENT})` : `rgb(${NEUTRAL})`;
        ctx.beginPath();
        ctx.arc(drawX, drawY, d.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (reduceMotion && entryProgress >= 1) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !frame) {
          frame = requestAnimationFrame(draw);
        }
      },
      // Generous bottom rootMargin so the rAF loop is already running
      // when the user scrolls toward the footer — the entry itself is
      // driven by scroll position (updateScrollEntryProgress), not by
      // this trigger.
      { threshold: 0, rootMargin: "0px 0px 80% 0px" }
    );
    io.observe(canvas);

    const onResize = () => rebuild();
    window.addEventListener("resize", onResize);

    // Cursor-attractor hover effect intentionally disabled — the
    // attractor stays on its lissajous drift only. `mouseX/Y`,
    // `targetHoverBlend`, and `hoverCapable` above are dead-weight
    // but kept inline so re-enabling is a single listener block.
    void mouseX;
    void mouseY;
    void hoverCapable;
    void targetHoverBlend;

    const onVis = () => {
      if (document.hidden && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else if (!document.hidden && visible && !frame && !reduceMotion) {
        frame = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      io.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", updateScrollEntryProgress);
      window.removeEventListener("resize", updateScrollEntryProgress);
      // (Cursor-attractor listeners disabled — no cleanup needed.)
      document.removeEventListener("visibilitychange", onVis);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [spacing, strength, radius]);

  return <canvas ref={canvasRef} className="block h-full w-full" />;
}
