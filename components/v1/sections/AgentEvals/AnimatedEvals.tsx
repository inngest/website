"use client";

import { useEffect, useRef } from "react";

/**
 * Inlines the evals-dashboard SVG and animates it in once when it scrolls
 * into view, matching the feel of the home "Traces, metrics, evals"
 * visuals: stroked structure + chart lines DRAW ON (stroke-dashoffset),
 * while the filled content (text, swatches) STAGGERS in top-to-bottom.
 *
 * The SVG is a flat list of paths with no layer ids, so elements are
 * classified at runtime by attribute (stroke vs fill) and the fade is
 * staggered by each path's vertical position. Plays once; respects
 * reduced-motion (renders the final state immediately).
 */
const SVG_SRC = "/assets/v1/agent-evals/evals.svg";

// SVG intrinsic aspect (785 × 425) — reserve the box so there's no shift
// before the markup loads.
const ASPECT = "785 / 425";

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

    fetch(SVG_SRC)
      .then((r) => r.text())
      .then((markup) => {
        if (cancelled || !host) return;
        host.innerHTML = markup;
        const svg = host.querySelector("svg");
        if (!svg) return;
        // Make the inlined SVG fluid inside its frame.
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

        // Reduced motion: leave everything visible, no animation.
        if (reduce) return;

        // Initial hidden state.
        strokes.forEach((p) => {
          let len = 0;
          try {
            len = p.getTotalLength();
          } catch {
            /* non-pathable */
          }
          if (!len) return;
          p.style.strokeDasharray = `${len}`;
          p.style.strokeDashoffset = `${len}`;
          p.style.transition = "none";
        });
        const fillBands = fills.map((p) => {
          let y = 0;
          try {
            y = p.getBBox().y;
          } catch {
            /* ignore */
          }
          p.style.opacity = "0";
          p.style.transform = "translateY(8px)";
          p.style.transition = "none";
          return { p, y };
        });
        // Force the initial styles to commit before transitioning.
        void svg.getBoundingClientRect();

        const ys = fillBands.map((b) => b.y);
        const minY = Math.min(...ys, 0);
        const maxY = Math.max(...ys, 1);
        const span = Math.max(1, maxY - minY);

        const run = () => {
          strokes.forEach((p, i) => {
            if (!p.style.strokeDasharray) return;
            p.style.transition = `stroke-dashoffset 1100ms cubic-bezier(0.22,0.61,0.27,1) ${Math.min(
              i * 12,
              360
            )}ms`;
            p.style.strokeDashoffset = "0";
          });
          fillBands.forEach(({ p, y }) => {
            const band = (y - minY) / span; // 0 (top) → 1 (bottom)
            const delay = Math.round(220 + band * 720);
            p.style.transition = `opacity 460ms ease-out ${delay}ms, transform 460ms cubic-bezier(0.22,0.61,0.27,1) ${delay}ms`;
            p.style.opacity = "1";
            p.style.transform = "translateY(0)";
          });
        };

        io = new IntersectionObserver(
          (entries) => {
            for (const e of entries) {
              if (e.isIntersecting) {
                run();
                io?.disconnect();
                io = null;
                return;
              }
            }
          },
          { rootMargin: "0px 0px -10% 0px", threshold: 0.2 }
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
      className="block w-full"
      style={{ aspectRatio: ASPECT }}
    />
  );
}
