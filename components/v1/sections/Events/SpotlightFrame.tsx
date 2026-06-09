"use client";

import {
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import GradientFrame, {
  type GradientFrameVariant,
} from "@/components/v1/sections/shared/GradientFrame";
import {
  onCursorTiltMove,
  onCursorTiltLeave,
  onCursorSpotlightMove,
  CURSOR_TILT_SEED,
  CURSOR_SPOTLIGHT_SEED,
  CURSOR_SPOTLIGHT_BG,
} from "@/utils/v1/cursorFx";
import { cn } from "@/utils/v1/cn";

/**
 * GradientFrame card with the home "Get Started" hover: a cursor-tracked
 * salmon spotlight + 4px lift + soft shadow, optionally a subtle 3D tilt.
 *
 * Renders a passive hover `<div>` that wraps its content in the
 * GradientFrame + spotlight chrome. It owns the hover wiring (hence a
 * "use client" leaf) and nothing else — no routing, no element identity.
 * To make a card clickable, wrap it in whatever element you need:
 *
 *   <Link href={…} className="block h-full rounded-lg">
 *     <SpotlightFrame tilt>…</SpotlightFrame>
 *   </Link>
 *
 * Wrapping it this way — rather than merging the chrome onto a child via
 * cloneElement — lets the consumer stay a Server Component and keeps
 * next/link's client-side navigation: the wrapper owns the element,
 * SpotlightFrame owns the chrome.
 *
 * `tilt`: enable the perspective rotation. Only for small, clickable
 * cards — leave off for wide cards (rotation distorts) and passive
 * surfaces (tilt reads as a "click me" affordance).
 */

const ROOT =
  "group/card isolate block rounded-lg text-v1-frost ease-v1-in motion-safe:transition-[transform,box-shadow] motion-safe:duration-[500ms] hover:[--lift:-4px] hover:shadow-[0_28px_60px_-32px_rgba(0,0,0,0.55)]";

type PointerHandler = (e: ReactPointerEvent<HTMLElement>) => void;

interface SpotlightFrameProps {
  variant?: GradientFrameVariant;
  tilt?: boolean;
  /** Classes on the hover root (rounding / sizing). */
  className?: string;
  /** Classes on the GradientFrame inner (content layout). */
  innerClassName?: string;
  children: ReactNode;
}

export default function SpotlightFrame({
  variant = "black",
  tilt = false,
  className,
  innerClassName,
  children,
}: SpotlightFrameProps) {
  const handlers: {
    onPointerMove: PointerHandler;
    onPointerLeave?: PointerHandler;
  } = tilt
    ? { onPointerMove: onCursorTiltMove, onPointerLeave: onCursorTiltLeave }
    : { onPointerMove: onCursorSpotlightMove };
  const style: CSSProperties = tilt
    ? CURSOR_TILT_SEED
    : { ...CURSOR_SPOTLIGHT_SEED, transform: "translateY(var(--lift,0px))" };

  // The cursor spotlight (pointer-events-none) layers above the content as
  // a soft salmon wash on hover, clipped to the rounded frame by
  // GradientFrame's overflow.
  return (
    <div {...handlers} style={style} className={cn(ROOT, className)}>
      <GradientFrame
        variant={variant}
        className="h-full [border-radius:inherit]"
        innerClassName={innerClassName}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 opacity-0 ease-v1-in motion-safe:transition-opacity motion-safe:duration-[500ms] group-hover/card:opacity-100"
          style={{ background: CURSOR_SPOTLIGHT_BG }}
        />
        {children}
      </GradientFrame>
    </div>
  );
}
