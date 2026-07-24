"use client";

import { useEffect, useRef } from "react";

/**
 * Inlines the evals-dashboard SVG and animates it in once when it scrolls
 * into view, matching the home "Traces, metrics, evals" feel: stroked
 * structure + chart lines DRAW ON (stroke-dashoffset) while filled content
 * (text, swatches) RISES + fades in. Everything cascades top-to-bottom by
 * vertical position. Plays once; respects reduced-motion.
 *
 * Uses CSS @keyframes (not transitions) so the start state lives in the
 * `from` frame — the draw-on can't snap to the end if timing is off, which
 * is exactly what was happening before. The export has no layer ids, so
 * paths are classified at runtime by attribute and staggered by bbox Y.
 */
const SVG_SRC = "/assets/v1/agent-evals/evals.svg";
const ASPECT = "785 / 425";
const EASE = "cubic-bezier(0.16, 0.84, 0.3, 1)";
const STYLE_ID = "ae-anim-keyframes";

function ensureKeyframes() {
  if (document.getElementById(STYLE_ID)) return;
  const st = document.createElement("style");
  st.id = STYLE_ID;
  st.textContent = `
@keyframes ae-draw { from { stroke-dashoffset: var(--ae-len); opacity: 0 } to { stroke-dashoffset: 0; opacity: 1 } }
@keyframes ae-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: translateY(0) } }
@keyframes ae-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes ae-pop { from { opacity: 0; transform: scale(0.4) } to { opacity: 1; transform: scale(1) } }`;
  document.head.appendChild(st);
}

export default function AnimatedEvals() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;
    let io: IntersectionObserver | null = null;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const yOf = (p: SVGGraphicsElement) => {
      try {
        return p.getBBox().y;
      } catch {
        return 0;
      }
    };

    fetch(SVG_SRC)
      .then((r) => r.text())
      .then((markup) => {
        if (cancelled || !host) return;
        ensureKeyframes();
        host.innerHTML = markup;
        const svg = host.querySelector("svg");
        if (!svg) return;
        svg.removeAttribute("width");
        svg.removeAttribute("height");
        svg.setAttribute("class", "block h-full w-full");

        const paths = Array.from(svg.querySelectorAll<SVGPathElement>("path"));
        const isStroke = (p: SVGPathElement) => {
          const s = p.getAttribute("stroke");
          return !!s && s !== "none";
        };
        const strokes = paths.filter(isStroke);
        const fills = paths.filter(
          (p) => !isStroke(p) && (p.getAttribute("fill") ?? "none") !== "none"
        );
        if (reduce) return; // leave fully visible

        // ── Hidden start state (matches each keyframe's `from`) ────────
        type Item = {
          p: SVGGraphicsElement;
          y: number;
          kind: "draw" | "fade" | "rise" | "pop";
        };
        const items: Item[] = [];
        for (const p of strokes) {
          let len = 0;
          try {
            len = p.getTotalLength();
          } catch {
            /* non-pathable */
          }
          p.style.opacity = "0";
          if (len) {
            p.style.setProperty("--ae-len", `${len}`);
            p.style.strokeDasharray = `${len}`;
            p.style.strokeDashoffset = `${len}`;
            items.push({ p, y: yOf(p), kind: "draw" });
          } else {
            items.push({ p, y: yOf(p), kind: "fade" });
          }
        }
        for (const p of fills) {
          p.style.opacity = "0";
          p.style.transform = "translateY(14px)";
          items.push({ p, y: yOf(p), kind: "rise" });
        }
        // Dots (the lollipop markers) are <circle>s — pop them in AFTER
        // the lines have drawn. scale() needs fill-box so it grows from
        // each dot's own centre rather than the SVG origin.
        const dots = Array.from(
          svg.querySelectorAll<SVGCircleElement>("circle")
        );
        for (const c of dots) {
          c.style.transformBox = "fill-box";
          c.style.transformOrigin = "center";
          c.style.opacity = "0";
          c.style.transform = "scale(0.4)";
          items.push({ p: c, y: yOf(c), kind: "pop" });
        }

        const ys = items.map((i) => i.y);
        const minY = Math.min(...ys, 0);
        const span = Math.max(1, Math.max(...ys, 1) - minY);

        // Lines finish drawing at ~LINE_END ms; dots start just after.
        const LINE_END = 1100;
        const play = () => {
          for (const { p, y, kind } of items) {
            const band = (y - minY) / span; // 0 top → 1 bottom
            if (kind === "draw") {
              const delay = Math.round(band * 450);
              p.style.animation = `ae-draw 1000ms ${EASE} ${delay}ms forwards`;
            } else if (kind === "fade") {
              const delay = Math.round(band * 450);
              p.style.animation = `ae-fade 360ms ease-out ${delay}ms forwards`;
            } else if (kind === "rise") {
              const delay = Math.round(200 + band * 700);
              p.style.animation = `ae-rise 480ms ${EASE} ${delay}ms forwards`;
            } else {
              // dots — pop in after the lines have come in
              const delay = Math.round(LINE_END + band * 150);
              p.style.animation = `ae-pop 260ms ${EASE} ${delay}ms forwards`;
            }
          }
        };

        io = new IntersectionObserver(
          (entries) => {
            for (const e of entries) {
              if (e.isIntersecting) {
                io?.disconnect();
                io = null;
                play();
                return;
              }
            }
          },
          { rootMargin: "0px 0px -15% 0px", threshold: 0.15 }
        );
        io.observe(host);
      })
      .catch(() => {
        /* leave the reserved box empty on fetch failure */
      });

    return () => {
      cancelled = true;
      io?.disconnect();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      role="img"
      aria-label="Inngest dashboard showing run traces, scores, and eval metrics."
      className="block w-full overflow-hidden"
      style={{ aspectRatio: ASPECT, backgroundColor: "#020202" }}
    />
  );
}
