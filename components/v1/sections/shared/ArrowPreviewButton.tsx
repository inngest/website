"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { springs } from "@/utils/v1/springs";
import { cn } from "@/utils/v1/cn";

// Width of the collapsed (icon-only) pill — also the height of the
// fully rounded button so it reads as a perfect circle at rest.
const PILL_HEIGHT = 40;

/**
 * Pill-shaped prev/next button pinned to the left/right edge of a
 * carousel surface. Default state is a 40px circle with just the
 * chevron; hover expands the pill width to reveal the upcoming title.
 *
 * Two hover triggers, in priority order:
 *
 *   1. AdvanceClick proximity events (`cursor-near` / `cursor-far`)
 *      dispatched on this element when the global cursor enters a
 *      70px buffer around the button. Used on /ai UseCases
 *      where the surrounding AdvanceClick wrapper drives state via
 *      proximity instead of standard pointer events (the surface
 *      itself owns the cursor disk).
 *   2. Standard pointer events (`pointerenter` / `pointerleave`) —
 *      the fallback for surfaces NOT wrapped in AdvanceClick.
 *
 * Both feed the same `hovered` state, so either trigger works.
 *
 * Originally lived in `components/v1/sections/AI/UseCases.tsx` —
 * lifted to shared so /observability FullObservability and any other
 * carousel can reuse the exact same pill-expand vocabulary instead
 * of reimplementing it (and getting the chevron alignment wrong).
 */
export function ArrowPreviewButton({
  direction,
  title,
  onClick,
}: {
  direction: "prev" | "next";
  title: string;
  onClick: () => void;
}) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const textRef = useRef<HTMLSpanElement | null>(null);
  const [hovered, setHovered] = useState(false);
  // Natural width of the title text — measured once after mount so
  // we can animate to a concrete pixel value instead of relying on
  // motion's `width: 'auto'` handling (which causes a flash of
  // layout on the first transition).
  const [textWidth, setTextWidth] = useState(0);
  useEffect(() => {
    if (textRef.current) setTextWidth(textRef.current.offsetWidth);
  }, [title]);

  useEffect(() => {
    const el = buttonRef.current;
    if (!el) return;
    const onNear = () => setHovered(true);
    const onFar = () => setHovered(false);
    el.addEventListener("cursor-near", onNear);
    el.addEventListener("cursor-far", onFar);
    return () => {
      el.removeEventListener("cursor-near", onNear);
      el.removeEventListener("cursor-far", onFar);
    };
  }, []);

  const isPrev = direction === "prev";
  // 16px of horizontal breathing room between the chevron and the
  // title text once expanded. Width = chevron cell (40) + text width
  // + trailing padding (16).
  const expandedWidth = PILL_HEIGHT + textWidth + 16;

  return (
    <motion.button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      data-cursor-hide
      aria-label={`${isPrev ? "Previous" : "Next"}: ${title}`}
      suppressHydrationWarning
      initial={false}
      animate={{
        width: hovered && textWidth > 0 ? expandedWidth : PILL_HEIGHT,
        backgroundColor:
          hovered && textWidth > 0
            ? "rgb(var(--color-v1-carbon-400))"
            : "rgb(var(--color-v1-jet-black) / 0.6)",
      }}
      transition={springs.glide}
      style={{
        height: PILL_HEIGHT,
        borderRadius: PILL_HEIGHT / 2,
        willChange: "width, background-color",
      }}
      className={cn(
        "absolute top-1/2 z-20 hidden -translate-y-1/2 items-center overflow-hidden border border-v1-frost text-v1-frost backdrop-blur-sm lg:inline-flex",
        isPrev ? "left-[13px] flex-row" : "right-[13px] flex-row-reverse",
      )}
    >
      <span
        className="relative shrink-0"
        style={{ width: PILL_HEIGHT - 2, height: PILL_HEIGHT }}
      >
        <ChevronIcon direction={direction} />
      </span>
      <motion.span
        ref={textRef}
        aria-hidden="true"
        suppressHydrationWarning
        initial={false}
        animate={{
          opacity: hovered && textWidth > 0 ? 1 : 0,
          x: hovered && textWidth > 0 ? 0 : isPrev ? -6 : 6,
        }}
        transition={springs.glide}
        className={cn(
          "whitespace-nowrap font-v1Mono text-[12px] uppercase leading-none",
          isPrev ? "pr-4" : "pl-4",
        )}
      >
        {title}
      </motion.span>
    </motion.button>
  );
}

export function ChevronIcon({ direction }: { direction: "prev" | "next" }) {
  const slide =
    "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2";
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={slide}
    >
      <path
        d={
          direction === "prev"
            ? "M 15 6 L 9 12 L 15 18"
            : "M 9 6 L 15 12 L 9 18"
        }
      />
    </svg>
  );
}
