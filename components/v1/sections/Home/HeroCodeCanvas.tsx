"use client";

import { useEffect, useRef, useState } from "react";

import { AnimationCanvas } from "@/components/v1/sections/Home/AnimationCanvas";
import { HeroCodeScene } from "@/lib/animations/scenes/HeroCodeScene";

/**
 * Desktop hero code scene — the ORIGINAL `HeroCodeScene` (so the dot
 * field is byte-for-byte the original home page), with two interaction
 * features layered on via its own options/methods —
 *
 *   1. `loop: false` — the reel plays through every function ONCE
 *      during the intro then freezes on the last one (step.invoke),
 *      handing control to the user instead of cycling forever.
 *   2. Clickable titles — an invisible <button> overlay per title row
 *      (polled from `getTitleBounds()`); clicking jumps the reel to
 *      that function via `jumpTo()` and replays its formation.
 *
 * Intro timing (scatterMs 900 / convergeMs 2200, default particle pool)
 * — only the loop + click behaviors are layered on.
 */
export default function HeroCodeCanvas({
  code,
  className,
}: {
  code: string;
  className?: string;
}) {
  const sceneRef = useRef<HeroCodeScene | null>(null);
  // Per-function title-row bounds in CSS pixels relative to the canvas
  // top-left, polled from the scene each frame. Whole-row hit areas so
  // clicking anywhere on the function name triggers the jump.
  const [titleRows, setTitleRows] = useState<
    { funcIdx: number; x: number; y: number; w: number; h: number }[]
  >([]);

  // Poll title-row bounds. They're static once the layout is built, so
  // we only update state when the array meaningfully changes.
  useEffect(() => {
    let raf = 0;
    let mounted = true;
    const tick = () => {
      raf = 0;
      if (!mounted) return;
      const scene = sceneRef.current;
      if (scene) {
        const next = scene.getTitleBounds();
        setTitleRows((prev) => {
          if (prev.length !== next.length) return next;
          for (let i = 0; i < next.length; i++) {
            if (
              Math.abs(next[i].x - prev[i].x) > 1 ||
              Math.abs(next[i].y - prev[i].y) > 1 ||
              Math.abs(next[i].w - prev[i].w) > 1 ||
              Math.abs(next[i].h - prev[i].h) > 1 ||
              next[i].funcIdx !== prev[i].funcIdx
            ) {
              return next;
            }
          }
          return prev;
        });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      mounted = false;
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    // Wrapper inherits the className passed in by Hero — that string
    // already includes `absolute inset-0 z-v1-backdrop hidden lg:block
    // h-full w-full pointer-events-none`, so the wrapper IS the
    // positioned context the button overlay needs. (Don't add a
    // `position` style here — it would override the `absolute` from the
    // className and drop the canvas into natural flow → invisible.)
    <div className={className}>
      <AnimationCanvas
        className="block h-full w-full"
        sceneFactory={(c) => {
          // Animation timing knobs (all ms):
          //   · scatterMs   — initial code load: dots drift before they
          //                   start converging.
          //   · convergeMs  — particles converging into the titles.
          //   · loop:false  — freeze the reel on the final step after one
          //                   pass so the user can click-drive it.
          //   · timings{}   — finer per-step controls (typing speed,
          //                   dot fly-in, read-hold, accordion open). All
          //                   optional; omit to keep the defaults below.
          const scene = new HeroCodeScene(c, {
            code,
            scatterMs: 900,
            convergeMs: 2200,
            loop: false,
            // timings: {
            //   typePerCharMs: 8,     // typing speed (lower = faster)
            //   perCharSettleMs: 850, // dot→letter fly-in duration
            //   postTypePauseMs: 2200,// read-hold before next step
            //   titleSlideMs: 650,    // step.run accordion-open speed
            // },
          });
          sceneRef.current = scene;
          return scene;
        }}
      />
      {/* Click-catcher overlay. One button per function title row, sized
          to cover the whole row (bullet + name). Visually transparent —
          only affordance is the pointer cursor — clicking anywhere on
          the function name jumps the reel to that function. */}
      {titleRows.map((b) => (
        <button
          key={b.funcIdx}
          type="button"
          aria-label={`Show function ${b.funcIdx + 1}`}
          onClick={() => sceneRef.current?.jumpTo(b.funcIdx)}
          className="absolute pointer-events-auto cursor-pointer rounded-md border-0 bg-transparent p-0 outline-none focus:outline-none focus-visible:outline-none"
          style={{
            left: `${b.x}px`,
            top: `${b.y}px`,
            width: `${b.w}px`,
            height: `${b.h}px`,
          }}
        />
      ))}
    </div>
  );
}
