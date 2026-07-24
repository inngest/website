"use client";

import Link from "next/link";
import {
  onCursorTiltMove,
  onCursorTiltLeave,
  onCursorSpotlightMove,
  CURSOR_TILT_SEED,
  CURSOR_SPOTLIGHT_SEED,
  CURSOR_SPOTLIGHT_BG,
} from "@/utils/v1/cursorFx";

// Lift-only transform for the no-tilt path — consumes the same
// `--lift` slot CURSOR_TILT_SEED exposes (so the hover lift still
// works) but skips the perspective rotateX/rotateY.
const LIFT_ONLY_STYLE = {
  ...CURSOR_SPOTLIGHT_SEED,
  transform: "translateY(var(--lift, 0px))",
} as const;

/**
 * Shared hover-card shell — rounded panel that fades in a 1 px
 * frost border, a soft drop shadow, and a cursor-following salmon
 * spotlight on hover, plus a 4 px lift via the CURSOR_TILT_SEED's
 * `--lift` slot.
 *
 * Renders as a `next/link` when `href` is provided, otherwise a
 * plain `<div>`. Consumers control padding + gap via `className`
 * — the shell only owns the chrome (border, shadow, spotlight)
 * and the cursor-tilt wiring.
 */

interface HoverCardShellProps {
  /** When set, renders as a Next.js Link with prefetch disabled. */
  href?: string;
  className?: string;
  children: React.ReactNode;
  /**
   * Opt out of the 3D perspective tilt while keeping the spotlight,
   * lift, border-fade, and shadow. Use for passive surfaces (e.g.
   * testimonials) where "click me" affordance is unwanted.
   */
  tilt?: boolean;
}

const SHELL_CLASS =
  "group relative isolate flex h-full flex-col rounded-lg border border-transparent text-v1-frost motion-safe:transition-[transform,border-color,box-shadow] motion-safe:duration-[500ms] ease-v1-in hover:[--lift:-4px] hover:border-v1-frost/[0.18] hover:shadow-[0_28px_60px_-32px_rgba(0,0,0,0.55)]";

export default function HoverCardShell({
  href,
  className,
  children,
  tilt = true,
}: HoverCardShellProps) {
  const merged = className ? `${SHELL_CLASS} ${className}` : SHELL_CLASS;
  const spotlight = (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 rounded-lg opacity-0 motion-safe:transition-opacity motion-safe:duration-[500ms] ease-v1-in group-hover:opacity-100"
      style={{ background: CURSOR_SPOTLIGHT_BG }}
    />
  );
  // Tilt path: full perspective rotateX/rotateY + lift via
  // CURSOR_TILT_SEED. No-tilt path: only spotlight tracking +
  // translateY(--lift) — skips the perspective rotation entirely.
  const handlers = tilt
    ? {
        onPointerMove: onCursorTiltMove,
        onPointerLeave: onCursorTiltLeave,
      }
    : { onPointerMove: onCursorSpotlightMove };
  const seedStyle = tilt ? CURSOR_TILT_SEED : LIFT_ONLY_STYLE;

  if (href) {
    return (
      <Link
        href={href}
        prefetch={false}
        {...handlers}
        style={seedStyle}
        className={merged}
      >
        {spotlight}
        {children}
      </Link>
    );
  }

  return (
    <div {...handlers} style={seedStyle} className={merged}>
      {spotlight}
      {children}
    </div>
  );
}
