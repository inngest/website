"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/utils/v1/cn";
import {
  TONGUE_SWOOSH_SVG,
  TONGUE_SWOOSH_VIEWBOX,
} from "@/components/v1/sections/LongRun/tongueSwooshSvg";

/**
 * The campaign illustration, animated by scroll: the cup runs along the
 * tongue as the page moves. Scrolling down drives it forward; scrolling
 * up reverses the run cycle and flips the character to face the other
 * way, so it runs backwards.
 *
 * Ported from the design canvas artboard ("Running friend"), which drove
 * the same maths through template bindings. The port keeps the motion
 * identical and changes only how it is applied: the markup is injected
 * once, then each frame writes attributes on the sixteen `data-a` nodes
 * directly. React never re-renders the tree, so a frame costs sixteen
 * attribute writes instead of a diff over ~55KB of path data.
 *
 * Reduced motion is honoured by never starting the loop — the static
 * markup already carries a sensible resting pose, so the artwork simply
 * stands still.
 */

/** Distance in px of scroll per full stride. */
const STEP_LENGTH = 110;
/** Idle delay before the sweat droplet fades out, matching the source. */
const IDLE_MS = 220;

/** Top edge of the tongue, sampled along x — the cup's feet follow it. */
const EDGE: ReadonlyArray<readonly [number, number]> = [
  [413, 220],
  [481, 242],
  [645, 306],
  [804, 336],
  [900, 325],
  [1032, 276],
  [1150, 200],
  [1276, 147],
  [1336, 112],
];

function topAt(x: number): number {
  for (let i = 1; i < EDGE.length; i++) {
    if (x <= EDGE[i][0]) {
      const [ax, ay] = EDGE[i - 1];
      const [bx, by] = EDGE[i];
      return ay + ((by - ay) * (x - ax)) / (bx - ax);
    }
  }
  return EDGE[EDGE.length - 1][1];
}

const round = (n: number) => Math.round(n * 100) / 100;

export default function TongueSwoosh({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Resolve each animated node once; a frame then costs only writes.
    const q = <T extends Element>(name: string) =>
      host.querySelector<T>(`[data-a="${name}"]`);
    const nodes = {
      runner: q<SVGGElement>("runner"),
      flip: q<SVGGElement>("flip"),
      bob: q<SVGGElement>("bob"),
      armL: q<SVGGElement>("armL"),
      armR: q<SVGGElement>("armR"),
      legL: q<SVGGElement>("legL"),
      legR: q<SVGGElement>("legR"),
      shadowL: q<SVGGElement>("shadowL"),
      shadowR: q<SVGGElement>("shadowR"),
      sweat: q<SVGGElement>("sweat"),
      blinkL: q<SVGPathElement>("blinkL"),
      blinkR: q<SVGPathElement>("blinkR"),
      tongues: Array.from(
        host.querySelectorAll<SVGGElement>('[data-a="tongue"]')
      ),
      sparks: [1, 2, 3, 4].map((i) => q<SVGPathElement>(`sp${i}`)),
    };
    const SPARK_CENTRES: ReadonlyArray<readonly [number, number]> = [
      [191.9, 159.9],
      [185.9, 129.1],
      [167.8, 163],
      [173.4, 125],
    ];

    let distance = 0;
    let direction = 1;
    let moving = false;
    let frame = 0;
    let idleTimer: ReturnType<typeof setTimeout> | undefined;

    const draw = () => {
      frame = 0;
      const doc = document.scrollingElement || document.documentElement;
      const y = window.scrollY || doc.scrollTop || 0;

      // Progress tracks the artwork's own journey across the viewport, not
      // absolute scroll position: 0 as it enters from the bottom, 1 as it
      // leaves the top. The artboard used `scrollY / (0.6 * viewport)`,
      // which worked there because the art sat centred in its own
      // full-height container. Here it sits near the top of a long page,
      // so that formula finished the run within half a screen and then
      // froze while the artwork was still on its way out. Tying it to the
      // element means the cup runs for exactly as long as it is visible.
      const box = host.getBoundingClientRect();
      const vh = window.innerHeight || doc.clientHeight;
      const span = vh + box.height;
      const progress = Math.min(1, Math.max(0, (vh - box.top) / span));

      // Direction is what makes scrolling up run the cycle backwards.
      if (y > distance) direction = 1;
      else if (y < distance) direction = -1;
      distance = y;

      const phase = (distance / STEP_LENGTH) * Math.PI * 2;
      const swing = (1 - Math.cos(phase)) / 2;
      const lift = Math.abs(Math.sin(phase));

      // Position along the tongue, with the feet tracking its top edge.
      const x = 1280 - (1280 - 480) * progress;
      const footY = topAt(x) + 68;
      const slope = (topAt(x + 40) - topAt(x - 40)) / 80;
      const tilt = Math.max(
        -15,
        Math.min(15, 0.5 * ((Math.atan(slope) * 180) / Math.PI))
      );

      // Blink on every third half-stride.
      const strides = Math.max(distance, 0) / (STEP_LENGTH / 2);
      const strideIndex = Math.floor(strides);
      const f = strides - strideIndex;
      const closing =
        strideIndex % 3 === 2 && f > 0.2 && f < 0.8
          ? Math.sin((Math.PI * (f - 0.2)) / 0.6)
          : 0;
      const blink = round(Math.max(0.08, 1 - 0.92 * closing));

      const t = (((distance / (STEP_LENGTH * 2)) % 1) + 1) % 1;
      const sweatOp = moving ? (t < 0.2 ? t / 0.2 : 1 - (t - 0.2) / 0.8) : 0;

      nodes.runner?.setAttribute(
        "transform",
        `translate(${round(x - 1060)} ${round(footY - 335)}) rotate(${round(
          tilt
        )} 1060 335)`
      );
      nodes.flip?.setAttribute(
        "transform",
        direction < 0 ? "matrix(-1 0 0 1 2120 0)" : "matrix(1 0 0 1 0 0)"
      );
      nodes.bob?.setAttribute("transform", `translate(0 ${round(-12 * lift)})`);
      nodes.armL?.setAttribute(
        "transform",
        `rotate(${round(24 - 46 * swing)} 1025 238)`
      );
      nodes.armR?.setAttribute(
        "transform",
        `rotate(${round(-24 + 46 * swing)} 1089 254)`
      );
      nodes.legL?.setAttribute(
        "transform",
        `rotate(${round(-38 * swing)} 1042 291)`
      );
      nodes.legR?.setAttribute(
        "transform",
        `rotate(${round(34 * swing)} 1075 290)`
      );

      const shadowScale = round(1 - 0.18 * lift);
      const shadowOp = String(round(0.31 * (1 - 0.4 * lift)));
      nodes.shadowL?.setAttribute("opacity", shadowOp);
      nodes.shadowL?.setAttribute(
        "transform",
        `translate(1026 344) scale(${shadowScale}) translate(-1026 -344)`
      );
      nodes.shadowR?.setAttribute("opacity", shadowOp);
      nodes.shadowR?.setAttribute(
        "transform",
        `translate(1107 316) scale(${shadowScale}) translate(-1107 -316)`
      );

      nodes.sweat?.setAttribute("opacity", String(round(sweatOp)));
      nodes.sweat?.setAttribute(
        "transform",
        `translate(${round(-8 + 24 * t)} ${round(8 - 24 * t)})`
      );

      nodes.blinkL?.setAttribute(
        "transform",
        `translate(0 232) scale(1 ${blink}) translate(0 -232)`
      );
      nodes.blinkR?.setAttribute(
        "transform",
        `translate(0 236) scale(1 ${blink}) translate(0 -236)`
      );

      const tongueRot = `rotate(${round(
        0.8 * Math.sin(distance / 1100)
      )} 260 300)`;
      for (const g of nodes.tongues) g.setAttribute("transform", tongueRot);

      nodes.sparks.forEach((node, i) => {
        if (!node) return;
        const k = (Math.sin(distance / 90 + [0, 1.6, 3.1, 4.7][i]) + 1) / 2;
        const [cx, cy] = SPARK_CENTRES[i];
        node.setAttribute("opacity", String(round(0.35 + 0.65 * k)));
        node.setAttribute(
          "transform",
          `translate(${cx} ${cy}) scale(${round(
            0.45 + 0.7 * k
          )}) translate(${-cx} ${-cy})`
        );
      });
    };

    const onScroll = () => {
      moving = true;
      if (!frame) frame = requestAnimationFrame(draw);
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        moving = false;
        if (!frame) frame = requestAnimationFrame(draw);
      }, IDLE_MS);
    };

    draw(); // Settle into the right pose for the current scroll position.
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
      clearTimeout(idleTimer);
    };
  }, []);

  return (
    <div
      ref={hostRef}
      // Decorative: the surrounding copy carries the meaning, and the
      // motion is ambient. Never intercepts a CTA click.
      aria-hidden="true"
      className={cn("pointer-events-none select-none", className)}
      style={{
        // Reserve the artwork's height before paint so the hero doesn't
        // reflow when the markup lands.
        aspectRatio: `${TONGUE_SWOOSH_VIEWBOX.width} / ${TONGUE_SWOOSH_VIEWBOX.height}`,
      }}
      dangerouslySetInnerHTML={{ __html: TONGUE_SWOOSH_SVG }}
    />
  );
}
