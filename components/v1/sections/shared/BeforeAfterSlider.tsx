"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

// Both ends stop EDGE_PX in from the container edges so the
// BEFORE/AFTER labels never fully clip out at the extremes.
// MAX_EDGE_RATIO caps that offset on narrow viewports.
const EDGE_PX = 120;
const MAX_EDGE_RATIO = 0.08;
const FALLBACK_MIN = 14;
const FALLBACK_MAX = 86;

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

export interface BeforeAfterSliderProps {
  /** Bottom layer, always full. Visible on the LEFT of the handle. */
  before: ReactNode;
  /** Top layer, clipped from the left. Visible on the RIGHT of the handle. */
  after: ReactNode;
  /** Optional tint overlay clipped to the BEFORE (left) side. */
  beforeOverlay?: ReactNode;
  /** Optional tint overlay clipped to the AFTER (right) side. */
  afterOverlay?: ReactNode;
  beforeLabel?: string;
  afterLabel?: string;
  ariaLabel?: string;
  /** Tailwind aspect-ratio class for the frame. */
  aspectClassName?: string;
  /** Extra classes on the outer frame (border, background, etc.). */
  className?: string;
  /** Initial slider position 0–100. Defaults to FALLBACK_MAX (BEFORE-heavy). */
  initialPosition?: number;
  /** Play the demo sweep once on first scroll-in. Default true. */
  demoSweep?: boolean;
}

export default function BeforeAfterSlider({
  before,
  after,
  beforeOverlay,
  afterOverlay,
  beforeLabel = "Before",
  afterLabel = "After",
  ariaLabel = "Drag to compare the before and after states",
  aspectClassName = "aspect-[1409/704]",
  className = "border border-v1-frost bg-v1-surfaceElevated lg:border-2",
  initialPosition = FALLBACK_MAX,
  demoSweep = true,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(initialPosition);
  const [bounds, setBounds] = useState({
    min: FALLBACK_MIN,
    max: FALLBACK_MAX,
  });
  const boundsRef = useRef(bounds);
  useEffect(() => {
    boundsRef.current = bounds;
  }, [bounds]);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const w = el.getBoundingClientRect().width;
      if (!w) return;
      const edge = Math.min(EDGE_PX, w * MAX_EDGE_RATIO);
      const minPct = (edge / w) * 100;
      setBounds({ min: minPct, max: 100 - minPct });
      setPosition((p) => clamp(p, minPct, 100 - minPct));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!demoSweep) return;
    if (typeof window === "undefined") return;
    const el = containerRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const PEAK = 30;
    const REST = 50;
    const OUT_MS = 900;
    const HOLD_MS = 200;
    const BACK_MS = 1500;
    const easeInOut = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    let raf = 0;
    let played = false;

    const play = () => {
      const baseline = boundsRef.current.max;
      const start = performance.now();
      const tick = (now: number) => {
        if (draggingRef.current) {
          raf = 0;
          return;
        }
        const elapsed = now - start;
        let next: number;
        if (elapsed < OUT_MS) {
          const t = easeInOut(elapsed / OUT_MS);
          next = baseline + (PEAK - baseline) * t;
        } else if (elapsed < OUT_MS + HOLD_MS) {
          next = PEAK;
        } else if (elapsed < OUT_MS + HOLD_MS + BACK_MS) {
          const t = easeInOut((elapsed - OUT_MS - HOLD_MS) / BACK_MS);
          next = PEAK + (REST - PEAK) * t;
        } else {
          setPosition(REST);
          raf = 0;
          return;
        }
        setPosition(
          clamp(next, boundsRef.current.min, boundsRef.current.max),
        );
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (played) return;
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio >= 0.45) {
            played = true;
            io.disconnect();
            play();
            break;
          }
        }
      },
      { threshold: [0, 0.25, 0.45, 0.6] },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [demoSweep]);

  const updateFromClientX = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = clamp(
      ((clientX - rect.left) / rect.width) * 100,
      boundsRef.current.min,
      boundsRef.current.max,
    );
    setPosition(pct);
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    updateFromClientX(e.clientX);
  };
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const STEP = 5;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setPosition((p) =>
        clamp(p - STEP, boundsRef.current.min, boundsRef.current.max),
      );
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setPosition((p) =>
        clamp(p + STEP, boundsRef.current.min, boundsRef.current.max),
      );
    } else if (e.key === "Home") {
      e.preventDefault();
      setPosition(boundsRef.current.min);
    } else if (e.key === "End") {
      e.preventDefault();
      setPosition(boundsRef.current.max);
    }
  };

  return (
    <div
      ref={containerRef}
      role="slider"
      aria-label={ariaLabel}
      aria-valuemin={bounds.min}
      aria-valuemax={bounds.max}
      aria-valuenow={Math.round(position)}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown}
      className={`relative w-full cursor-ew-resize touch-pan-y select-none overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-v1-frost ${aspectClassName} ${className}`}
    >
      {/* BEFORE layer — always full, sits underneath. */}
      <div className="pointer-events-none absolute inset-0">{before}</div>

      {/* AFTER layer — clipped from the left so the right shows AFTER on top. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ clipPath: `inset(0 0 0 ${position}%)` }}
      >
        {after}
      </div>

      {beforeOverlay ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          {beforeOverlay}
        </div>
      ) : null}
      {afterOverlay ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ clipPath: `inset(0 0 0 ${position}%)` }}
        >
          {afterOverlay}
        </div>
      ) : null}

      {/* Labels — each in a full-container clip wrapper so the slider
          cuts through them using container percentages. Smaller type
          and tighter insets on narrow frames keep the two labels from
          overrunning the centre seam and colliding at the handle. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <span className="absolute left-3 top-3 text-v1-label-sm uppercase text-v1-frost max-sm:[font-size:10px] sm:left-8 sm:top-9 sm:text-v1-label-md">
          {beforeLabel}
        </span>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ clipPath: `inset(0 0 0 ${position}%)` }}
      >
        <span className="absolute right-3 top-3 text-v1-label-sm uppercase text-v1-frost max-sm:[font-size:10px] sm:right-8 sm:top-9 sm:text-v1-label-md">
          {afterLabel}
        </span>
      </div>

      <Handle position={position} />
    </div>
  );
}

function Handle({ position }: { position: number }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 -translate-x-1/2"
      style={{ left: `${position}%` }}
    >
      <div className="h-full w-px bg-v1-frost/85" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-v1-frost text-v1-jetBlack shadow-[0_4px_18px_rgba(0,0,0,0.45)] ring-1 ring-v1-frost/40">
          <HSplitChevron size={14} strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}

function HSplitChevron({
  size,
  strokeWidth,
}: {
  size: number;
  strokeWidth: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 6 L4 12 L9 18" />
      <path d="M15 6 L20 12 L15 18" />
    </svg>
  );
}
