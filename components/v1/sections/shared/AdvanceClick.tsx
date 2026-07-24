"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
  type MouseEvent,
  type Ref,
} from "react";

/**
 * Wraps a carousel-style surface and adds three behaviours:
 *
 *   1. Clicking anywhere on the surface (except on a real
 *      `<button>` / `<a>`) calls `onAdvance` — the whole surface is
 *      the next-slide affordance.
 *   2. A fixed-positioned cursor follower replaces the native
 *      pointer with a frosted-glass disk + → arrow.
 *   3. Proximity hand-off to bleedable buttons: any descendant with
 *      `data-bleed-button` gets a `bleed-in` / `bleed-out` custom
 *      event dispatched as the cursor enters / leaves a 40 px
 *      buffer around it. The follower disk simultaneously fades
 *      out — same "cursor disappears INTO the button" choreography
 *      we use on Primitives' Docs pill.
 *
 * Hidden below md (touch-likely surfaces don't get the follower).
 *
 * Keyboard-reachable as a single button via Enter/Space.
 */
interface AdvanceClickProps {
  onAdvance: () => void;
  /** Optional previous-step handler. When supplied, the surface
   *  becomes directional: hovering the left half flips the disk's
   *  arrow to point left and clicks invoke onPrev; the right half
   *  keeps the standard next-advance behaviour. */
  onPrev?: () => void;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
  /** Suppress the floating cursor disk while keeping the
   *  click-anywhere-to-advance behaviour, proximity hand-off, and
   *  keyboard activation. Used by carousels where the section's own
   *  visual language (handle, dots) already cues advancement. */
  hideCursor?: boolean;
}

const BUTTON_PROXIMITY = 70;

export const AdvanceClick = forwardRef<HTMLDivElement, AdvanceClickProps>(function AdvanceClick(
  {
    onAdvance,
    onPrev,
    className,
    children,
    ariaLabel = "Show next",
    hideCursor = false,
  }: AdvanceClickProps,
  forwardedRef: Ref<HTMLDivElement>
) {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const cursorArrowRef = useRef<SVGSVGElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const lastNearBtnRef = useRef<HTMLElement | null>(null);
  // Track whether the cursor is on the left or right half of the
  // wrapper so click and arrow orientation stay in sync. Only used
  // when onPrev is provided (i.e. the surface is dual-direction).
  const directionRef = useRef<"prev" | "next">("next");
  // rAF coalescing for the move handler — high-Hz mice fire mousemove
  // dozens of times between frames; doing the full querySelectorAll +
  // getBoundingClientRect sweep on each event flushes layout and
  // chatters the disk's opacity. We capture the latest pointer
  // position into `pendingRef` and process once per animation frame.
  const pendingRef = useRef<{
    x: number;
    y: number;
    target: EventTarget | null;
  } | null>(null);
  const rafRef = useRef<number | null>(null);
  // Track the disk's current visibility state so we only restyle
  // opacity when it actually flips, avoiding the redundant inline-
  // style writes that were making the CSS transition re-trigger
  // mid-flight as the user moved across the zone boundary.
  const lastOpacityRef = useRef<"0" | "1">("0");

  const setRefs = useCallback(
    (el: HTMLDivElement | null) => {
      wrapperRef.current = el;
      if (typeof forwardedRef === "function") {
        forwardedRef(el);
      } else if (forwardedRef) {
        (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
      }
    },
    [forwardedRef]
  );

  // Walk every `[data-bleed-button]` inside the wrapper and pick
  // the one whose bbox-plus-buffer the cursor sits in (or null).
  // Returns the buttons array too so callers can clear stale state.
  const findNearestBleedButton = (
    clientX: number,
    clientY: number
  ): HTMLElement | null => {
    const wrap = wrapperRef.current;
    if (!wrap) return null;
    const btns = wrap.querySelectorAll<HTMLElement>("[data-bleed-button]");
    // NodeListOf isn't iterable under the tsconfig target this repo
    // ships with — index the items manually so the build doesn't
    // need downlevelIteration.
    for (let i = 0; i < btns.length; i++) {
      const btn = btns[i];
      const r = btn.getBoundingClientRect();
      if (
        clientX >= r.left - BUTTON_PROXIMITY &&
        clientX <= r.right + BUTTON_PROXIMITY &&
        clientY >= r.top - BUTTON_PROXIMITY &&
        clientY <= r.bottom + BUTTON_PROXIMITY
      ) {
        return btn;
      }
    }
    return null;
  };

  // Cursor-hide zones — bare proximity rectangles that suppress the
  // follower disk without triggering the bleed choreography. Used
  // for controls (prev/next arrows, timeline rail) that aren't part
  // of the "click anywhere to advance" affordance but live inside
  // the same wrapper. Returns the matched element so consumers can
  // listen for 'cursor-near' / 'cursor-far' custom events for their
  // own proximity-driven UI (e.g. UseCases arrow expansion).
  const findCursorHideZone = (
    clientX: number,
    clientY: number,
  ): HTMLElement | null => {
    const wrap = wrapperRef.current;
    if (!wrap) return null;
    const zones = wrap.querySelectorAll<HTMLElement>("[data-cursor-hide]");
    for (let i = 0; i < zones.length; i++) {
      const r = zones[i].getBoundingClientRect();
      if (
        clientX >= r.left - BUTTON_PROXIMITY &&
        clientX <= r.right + BUTTON_PROXIMITY &&
        clientY >= r.top - BUTTON_PROXIMITY &&
        clientY <= r.bottom + BUTTON_PROXIMITY
      ) {
        return zones[i];
      }
    }
    return null;
  };
  const lastNearHideElRef = useRef<HTMLElement | null>(null);

  const clearActiveBleed = () => {
    const prev = lastNearBtnRef.current;
    if (prev) {
      prev.dispatchEvent(new Event("bleed-out"));
      lastNearBtnRef.current = null;
    }
  };

  const setOpacity = (cursor: HTMLDivElement, next: "0" | "1") => {
    if (lastOpacityRef.current === next) return;
    lastOpacityRef.current = next;
    cursor.style.opacity = next;
  };

  const processPending = () => {
    rafRef.current = null;
    const p = pendingRef.current;
    pendingRef.current = null;
    if (!p) return;
    const cursor = cursorRef.current;

    // Cursor disk visuals only fire when the disk is actually
    // rendered. Proximity hand-off (bleed buttons + cursor-hide
    // zones) MUST still fire even with `hideCursor` — otherwise the
    // UseCases prev/next arrow expand-on-hover stops working.
    if (cursor) {
      // Disk floats just above the pointer — bottom edge sits a
      // few px above the cursor.
      cursor.style.transform = `translate3d(${p.x - 28}px, ${p.y - 62}px, 0)`;
      if (onPrev) {
        const wrap = wrapperRef.current;
        const arrow = cursorArrowRef.current;
        if (wrap && arrow) {
          const wrect = wrap.getBoundingClientRect();
          const isLeft = p.x < wrect.left + wrect.width / 2;
          directionRef.current = isLeft ? "prev" : "next";
          arrow.style.transform = isLeft ? "scaleX(-1)" : "";
        }
      }
    } else if (onPrev) {
      // Even without the disk, the directional click handler still
      // needs to know which half of the wrapper the cursor's in.
      const wrap = wrapperRef.current;
      if (wrap) {
        const wrect = wrap.getBoundingClientRect();
        directionRef.current =
          p.x < wrect.left + wrect.width / 2 ? "prev" : "next";
      }
    }

    const overInteractive =
      p.target instanceof Element
        ? p.target.closest("button, a")
        : null;
    const nearBtn = findNearestBleedButton(p.x, p.y);
    if (nearBtn && nearBtn !== lastNearBtnRef.current) {
      if (lastNearBtnRef.current) {
        lastNearBtnRef.current.dispatchEvent(new Event("bleed-out"));
      }
      lastNearBtnRef.current = nearBtn;
      nearBtn.dispatchEvent(
        new CustomEvent("bleed-in", {
          detail: { x: p.x, y: p.y },
        })
      );
    } else if (!nearBtn && lastNearBtnRef.current) {
      clearActiveBleed();
    }

    const nearHideEl = findCursorHideZone(p.x, p.y);
    if (nearHideEl !== lastNearHideElRef.current) {
      if (lastNearHideElRef.current) {
        lastNearHideElRef.current.dispatchEvent(new Event("cursor-far"));
      }
      lastNearHideElRef.current = nearHideEl;
      if (nearHideEl) nearHideEl.dispatchEvent(new Event("cursor-near"));
    }
    if (cursor) {
      const inHideZone = nearHideEl != null;
      setOpacity(cursor, overInteractive || nearBtn || inHideZone ? "0" : "1");
    }
  };

  const moveCursor = (e: MouseEvent<HTMLDivElement>) => {
    // Capture the latest pointer event and let one rAF tick process
    // it. Subsequent mousemoves overwrite `pendingRef` until the
    // frame runs, so we never do more layout work than the display
    // can render anyway.
    pendingRef.current = { x: e.clientX, y: e.clientY, target: e.target };
    if (rafRef.current == null) {
      rafRef.current = requestAnimationFrame(processPending);
    }
  };

  const clearActiveHideZone = () => {
    const prev = lastNearHideElRef.current;
    if (prev) {
      prev.dispatchEvent(new Event("cursor-far"));
      lastNearHideElRef.current = null;
    }
  };

  const hideFollowerDisk = () => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    pendingRef.current = null;
    const cursor = cursorRef.current;
    if (cursor) setOpacity(cursor, "0");
    clearActiveBleed();
    clearActiveHideZone();
  };

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button, a")) return;
    if (onPrev && directionRef.current === "prev") {
      onPrev();
      return;
    }
    onAdvance();
  };

  return (
    <div
      ref={setRefs}
      onClick={onClick}
      onMouseEnter={moveCursor}
      onMouseMove={moveCursor}
      onMouseLeave={hideFollowerDisk}
      role="group"
      tabIndex={0}
      aria-label={ariaLabel}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          if ((e.target as HTMLElement).closest("button, a")) return;
          e.preventDefault();
          onAdvance();
        }
      }}
      className={
        "relative focus:outline-none focus-visible:ring-2 focus-visible:ring-v1-frost/30 " +
        (className ?? "")
      }
    >
      {!hideCursor && (
        <div
          ref={cursorRef}
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-v1-cursor hidden h-14 w-14 items-center justify-center rounded-full border border-v1-frost/25 bg-black text-v1-frost shadow-[0_8px_24px_-6px_rgba(0,0,0,0.6)] motion-safe:transition-opacity motion-safe:duration-[340ms] motion-safe:ease-v1-out md:flex"
          style={{
            opacity: 0,
            transform: "translate3d(-1000px, -1000px, 0)",
            willChange: "transform, opacity",
          }}
        >
          <svg
            ref={cursorArrowRef}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="M13 6l6 6-6 6" />
          </svg>
        </div>
      )}
      {children}
    </div>
  );
});
