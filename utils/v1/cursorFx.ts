"use client";

import type { PointerEvent as ReactPointerEvent } from "react";

/**
 * Pointer handlers that write `--mx` and `--my` (0–100 % of the
 * element's bounding box) to its inline style on every move. Pair
 * with a child overlay whose `background` consumes those vars (e.g.
 * `radial-gradient(...px circle at var(--mx) var(--my), …)`).
 *
 * Returns the handler — assign it to `onPointerMove` directly. The
 * consuming element must also seed `--mx: 50%` / `--my: 50%` in its
 * inline style so the spotlight renders centred until the cursor
 * first arrives.
 */
let spotlightRaf = 0;
let spotlightTarget: HTMLElement | null = null;
let spotlightX = 0;
let spotlightY = 0;

export const onCursorSpotlightMove = (
  e: ReactPointerEvent<HTMLElement>
): void => {
  // Skip touch/pen — spotlight is a mouse-only affordance and these
  // pointer types either leave a "stuck" highlight (touch) or
  // dispatch high-frequency events we don't want to paint for.
  if (e.pointerType !== "mouse") return;
  spotlightTarget = e.currentTarget;
  spotlightX = e.clientX;
  spotlightY = e.clientY;
  if (spotlightRaf) return;
  spotlightRaf = requestAnimationFrame(() => {
    spotlightRaf = 0;
    const el = spotlightTarget;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (spotlightX - rect.left) / rect.width;
    const py = (spotlightY - rect.top) / rect.height;
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
  });
};

/**
 * Same as `onCursorSpotlightMove` but also writes `--rx` / `--ry`
 * for a ±2°/1.5° 3D tilt. Pair with a `transform:
 * perspective(900px) rotateX(var(--rx)) rotateY(var(--ry)) …` on
 * the same element.
 *
 * `onCursorTiltLeave` resets the tilt to neutral on pointer leave
 * so the card eases back to flat.
 */
export const onCursorTiltMove = (
  e: ReactPointerEvent<HTMLElement>
): void => {
  // Mouse-only, like onCursorSpotlightMove — touch/pen would set a tilt
  // that pointerleave doesn't reliably clear, leaving a card stuck.
  if (e.pointerType !== "mouse") return;
  const rect = e.currentTarget.getBoundingClientRect();
  const px = (e.clientX - rect.left) / rect.width;
  const py = (e.clientY - rect.top) / rect.height;
  const tiltY = (px - 0.5) * 4; // ±2deg
  const tiltX = (0.5 - py) * 3; // ±1.5deg
  e.currentTarget.style.setProperty("--mx", `${px * 100}%`);
  e.currentTarget.style.setProperty("--my", `${py * 100}%`);
  e.currentTarget.style.setProperty("--rx", `${tiltX}deg`);
  e.currentTarget.style.setProperty("--ry", `${tiltY}deg`);
};

export const onCursorTiltLeave = (
  e: ReactPointerEvent<HTMLElement>
): void => {
  e.currentTarget.style.setProperty("--rx", "0deg");
  e.currentTarget.style.setProperty("--ry", "0deg");
};

/**
 * Inline-style seed for a cursor-spotlight element. Spread into a
 * `style` prop alongside any element-specific styles.
 */
export const CURSOR_SPOTLIGHT_SEED = {
  ["--mx" as string]: "50%",
  ["--my" as string]: "50%",
} as const;

/**
 * Default cursor-spotlight background — a soft salmon radial glow
 * anchored to `--mx`/`--my`. Spread into an overlay child's
 * `background` (paired with `CURSOR_SPOTLIGHT_SEED` on the tracked
 * element). Shared by HoverCardShell and the Events cards so the glow
 * stays identical across the site.
 */
export const CURSOR_SPOTLIGHT_BG =
  "radial-gradient(360px circle at var(--mx) var(--my), rgba(255, 210, 195, 0.09), rgba(255, 210, 195, 0.02) 45%, transparent 70%)";

/**
 * Inline-style seed for a cursor-tilt element. Includes the
 * spotlight seed plus the neutral tilt values, and applies the
 * perspective + rotation transform that consumes `--rx` / `--ry`.
 * Spread into a `style` prop alongside any element-specific styles.
 */
export const CURSOR_TILT_SEED = {
  ["--mx" as string]: "50%",
  ["--my" as string]: "50%",
  ["--rx" as string]: "0deg",
  ["--ry" as string]: "0deg",
  transform:
    "perspective(900px) rotateX(var(--rx)) rotateY(var(--ry)) translateY(var(--lift, 0px))",
  transformStyle: "preserve-3d",
} as const;
