"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/utils/v1/cn";

/**
 * Hero code from Desktop - 7 node 515:3125.
 * The snippet is a continuous upward reel: lines fade out at the top
 * and re-enter from the bottom. Every `step.run` stays larger than
 * the surrounding code, with a soft salmon glow.
 */

const GREY = "#9B9B9B";
const GREEN = "#4afa7d";
const BLUE = "#4c74ee";

const LINE_H = 20;
const PX_PER_SEC = 24;

function StepRun() {
  return (
    <span className="hero-step-run">
      <span className="hero-step-dot">step.</span>
      <span className="hero-step-name">run</span>
    </span>
  );
}

function Call({ children }: { children: ReactNode }) {
  return <span style={{ color: BLUE }}>{children}</span>;
}

type Line = () => ReactNode;

const LINES: Line[] = [
  () => "\u00a0",
  () => (
    <>
      {"import { "}
      <span style={{ color: GREEN }}>copyFromURL, upload, list</span>
      {' } from "./s3-client"'}
    </>
  ),
  () => "\u00a0",
  () => "export default inngest.createFunction(",
  () => "  {",
  () => '    id: "import-product-images",',
  () => '    triggers: [{ event: "shop/product.imported" }],',
  () => "    retries: 3,",
  () => "  },",
  () => "  async ({ event, step }) => {",
  () => "\u00a0",
  () => (
    <>
      {"    const uploadedImageURLs = await "}
      <StepRun />
      {'("copy-images-to-'}
    </>
  ),
  () => 's3", async () => {',
  () => (
    <>
      {"      return "}
      <Call>copyFromURL</Call>
      (event.data.imageURLs)
    </>
  ),
  () => "    });",
  () => "\u00a0",
  () => (
    <>
      {"    const manifestURL = await "}
      <StepRun />
      {'("save-image-manifest",'}
    </>
  ),
  () => "async () => {",
  () => (
    <>
      {"      return "}
      <Call>upload</Call>
      (JSON.stringify(uploadedImageURLs));
    </>
  ),
  () => "    });",
  () => "\u00a0",
  () => (
    <>
      {"    const files = await "}
      <StepRun />
      {'("list-product-files", async () => {'}
    </>
  ),
  () => (
    <>
      {"      return "}
      <Call>list</Call>
      (manifestURL);
    </>
  ),
  () => "    });",
  () => "  },",
  () => ");",
];

const PERIOD = LINES.length * LINE_H;
const COPIES = [0, 1] as const;

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

export default function HeroCodeScroll() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);
  const [entered, setEntered] = useState(false);
  const [reelBlur, setReelBlur] = useState(12);

  useEffect(() => {
    setReduced(prefersReducedMotion());
  }, []);

  useEffect(() => {
    if (reduced) {
      setEntered(true);
      setReelBlur(0);
      return;
    }
    const id = window.setTimeout(() => setEntered(true), 40);
    return () => window.clearTimeout(id);
  }, [reduced]);

  useEffect(() => {
    if (reduced) {
      setReelBlur(0);
      if (trackRef.current) trackRef.current.style.transform = "none";
      return;
    }

    let frame = 0;
    let offset = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!viewport || !track) {
        frame = requestAnimationFrame(tick);
        return;
      }

      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      offset = (offset + PX_PER_SEC * dt) % PERIOD;
      track.style.transform = `translate3d(0, ${-offset}px, 0)`;

      const viewRect = viewport.getBoundingClientRect();
      const leaving = clamp(
        (window.innerHeight * 0.12 - viewRect.top) /
          (window.innerHeight * 0.75),
        0,
        1
      );
      setReelBlur(
        Math.max(entered ? 0 : 12, lerp(0, 10, smoothstep(0.55, 1, leaving)))
      );

      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced, entered]);

  return (
    <div
      ref={viewportRef}
      className="hero-code-reel relative h-[min(22rem,60vw)] w-full max-w-[588px] shrink-0 overflow-hidden lg:h-[400px] lg:flex-none"
    >
      <pre
        className={cn(
          "hero-code-pre m-0 overflow-visible whitespace-pre font-v1Mono text-[14px]",
          entered && "hero-code-pre--in"
        )}
        style={{
          color: GREY,
          lineHeight: `${LINE_H}px`,
          filter:
            reduced || reelBlur < 0.2
              ? undefined
              : `blur(${reelBlur.toFixed(2)}px)`,
        }}
      >
        <code
          ref={trackRef}
          className="hero-code-track block will-change-transform"
        >
          {COPIES.flatMap((copy) =>
            LINES.map((line, i) => (
              <div
                key={`${copy}-${i}`}
                className="hero-code-line"
                style={{ height: LINE_H }}
              >
                {line()}
              </div>
            ))
          )}
        </code>
      </pre>
    </div>
  );
}
