"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { CURSOR_SPOTLIGHT_SEED } from "@/utils/v1/cursorFx";

/**
 * Free-form blue split-panel hero shell. Renders arbitrary `children`
 * over a blue panel + wireframe — used by /durable-execution, whose
 * hero is a single left-aligned content block.
 *
 * NOTE: /observability and /queues-flow-control moved to SplitHero's
 * `palette="blue"` (their layout is a left/right column split, which
 * SplitHero models directly). This shell remains for the single-block
 * layout; fold it into SplitHero if that layout is ever retired.
 *
 * Layout: left 2/3 is a blue gradient panel with a soft-light grain
 * overlay and a cursor-tracked white radial spotlight; right 1/3 is a
 * dark v1-surfaceElevated panel filled with the dotted-line wireframe
 * fan (two triangular fans + a centered rectangle). Both panels shift
 * subtly with page scroll progress — the grain pulls up, the wireframe
 * pushes down — for a parallax depth cue.
 *
 * Children render inside `relative z-10` content container with the
 * canonical max-w-[1440px] horizontal rails.
 */
export function BlueWireframeHero({
  ariaLabelledBy,
  srHeading,
  children,
}: {
  ariaLabelledBy: string;
  /** Visually hidden h1 for SEO/a11y. */
  srHeading: string;
  children: ReactNode;
}) {
  const { ref, progress } = useHeroScroll();
  const grainShift = `translate3d(0, ${(-progress * 28).toFixed(2)}px, 0)`;
  const wireframeShift = `translate3d(0, ${(progress * 18).toFixed(2)}px, 0)`;
  const bluePanelRef = useRef<HTMLDivElement | null>(null);
  const handleHeroPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const el = bluePanelRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
  };

  return (
    <section
      ref={ref}
      aria-labelledby={ariaLabelledBy}
      onPointerMove={handleHeroPointerMove}
      className="relative w-full overflow-hidden bg-v1-canvasBase lg:min-h-[799px]"
    >
      {/* Left panel: blue gradient + grain + cursor spotlight */}
      <div
        ref={bluePanelRef}
        aria-hidden="true"
        style={CURSOR_SPOTLIGHT_SEED}
        className="pointer-events-none absolute inset-y-0 left-0 w-full overflow-hidden bg-v1-accent-blue lg:w-2/3"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(115deg, rgb(40, 56, 230) 0%, rgb(64, 88, 250) 45%, rgb(96, 120, 255) 75%, rgb(130, 150, 255) 100%)",
          }}
        />
        <img
          src="/assets/v1/ai-hero/grain.webp"
          alt=""
          className="pointer-events-none absolute left-0 top-[-221%] h-[727%] w-[150%] max-w-none mix-blend-soft-light motion-safe:[will-change:transform]"
          style={{ transform: grainShift }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(320px circle at var(--mx) var(--my), rgba(255, 255, 255, 0.18), transparent 78%)",
          }}
        />
      </div>

      {/* Right panel: dark + wireframe fan */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 z-20 hidden h-full w-1/3 bg-v1-surfaceElevated motion-safe:[will-change:transform] lg:block"
        style={{ transform: wireframeShift }}
      >
        <WireframeFans />
      </div>

      <h1 id={ariaLabelledBy} className="sr-only">
        {srHeading}
      </h1>

      <div className="relative z-10">{children}</div>
    </section>
  );
}

function useHeroScroll() {
  const ref = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let frame = 0;
    const tick = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const h = rect.height || 1;
      const p = Math.min(1, Math.max(0, -rect.top / h));
      setProgress(p);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
  return { ref, progress };
}

function WireframeFans() {
  const W = 360;
  const H = 800;

  const topFan: ReactElement[] = [];
  for (let i = 0; i < 26; i++) {
    const angle = (i / 25) * (Math.PI / 2.1);
    const len = W + 60;
    const x2 = Math.cos(angle) * len;
    const y2 = Math.sin(angle) * len;
    topFan.push(...dotsAlongLine(0, 0, x2, y2, 48 + i, 0.2 + (i % 4) * 0.12));
  }

  const bottomFan: ReactElement[] = [];
  for (let i = 0; i < 26; i++) {
    const angle = (i / 25) * (Math.PI / 2.1);
    const len = W + 60;
    const x2 = Math.cos(angle) * len;
    const y2 = H - Math.sin(angle) * len;
    bottomFan.push(
      ...dotsAlongLine(0, H, x2, y2, 48 + i, 0.2 + (i % 4) * 0.12, true),
    );
  }

  const centerRect = (() => {
    const cx = W * 0.62;
    const cy = H * 0.5;
    const rw = 150;
    const rh = 110;
    const x1 = cx - rw / 2;
    const y1 = cy - rh / 2;
    const dots: ReactElement[] = [];
    dots.push(...dotsAlongLine(x1, y1, x1 + rw, y1, 18, 0.55));
    dots.push(...dotsAlongLine(x1 + rw, y1, x1 + rw, y1 + rh, 14, 0.55));
    dots.push(...dotsAlongLine(x1 + rw, y1 + rh, x1, y1 + rh, 18, 0.55));
    dots.push(...dotsAlongLine(x1, y1 + rh, x1, y1, 14, 0.55));
    return dots;
  })();

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className="h-full w-full"
    >
      <g fill="rgb(232 232 232)">
        {topFan}
        {bottomFan}
        {centerRect}
      </g>
    </svg>
  );
}

function dotsAlongLine(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  count: number,
  baseOpacity: number,
  fadeFromEnd = false,
): ReactElement[] {
  const dots: ReactElement[] = [];
  const r3 = (n: number) => Math.round(n * 1000) / 1000;
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const x = x1 + (x2 - x1) * t;
    const y = y1 + (y2 - y1) * t;
    if (x < -4 || x > 400 || y < -4 || y > 820) continue;
    const fade = fadeFromEnd ? 1 - t : t;
    const opacity = baseOpacity * (0.35 + 0.65 * fade);
    dots.push(
      <circle
        key={`${x1}-${y1}-${x2}-${y2}-${i}`}
        cx={r3(x)}
        cy={r3(y)}
        r={0.7}
        opacity={r3(opacity)}
      />,
    );
  }
  return dots;
}
