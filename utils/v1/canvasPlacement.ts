// Shared placement/sizing helpers for the v1 particle canvases
// (InngestLogoCanvas + StippleCanvas), modelled on CSS object-position /
// transform-origin so both canvases speak the same vocabulary.
//
//   - `Gravity` + `GRAVITY` — 9-point gravity (CSS object-position
//     keywords). Each entry gives the canvas fraction (x,y) AND the
//     matching origin fraction (ox,oy); they're equal per keyword so the
//     subject snaps flush to that point. Override x/y and origin
//     separately to DECOUPLE them (transform-origin + translate).
//   - `resolveCoord` — a canvas-space length: number = px, "NN%" =
//     fraction of the axis extent, undefined = opted out.
//   - `resolveOriginOffset` — which point of the SUBJECT pins to (x,y):
//     bare number = 0..1 fraction of the subject's own extent, "NN%" /
//     "NNpx" = standard length-percentage.

import { resolveToPx } from "@/utils/v1/resolveToPx";

/** 9-point gravity — which point of the subject pins to the same point
 *  of the canvas (mirrors CSS `object-position` keywords). */
export type Gravity =
  | "top-left"
  | "top"
  | "top-right"
  | "left"
  | "center"
  | "right"
  | "bottom-left"
  | "bottom"
  | "bottom-right";

// Each gravity → canvas fraction (x,y) and the subject's pinned origin
// fraction (ox,oy); they match so the subject snaps flush to that point.
export const GRAVITY: Record<
  Gravity,
  { x: number; y: number; ox: number; oy: number }
> = {
  "top-left": { x: 0, y: 0, ox: 0, oy: 0 },
  top: { x: 0.5, y: 0, ox: 0.5, oy: 0 },
  "top-right": { x: 1, y: 0, ox: 1, oy: 0 },
  left: { x: 0, y: 0.5, ox: 0, oy: 0.5 },
  center: { x: 0.5, y: 0.5, ox: 0.5, oy: 0.5 },
  right: { x: 1, y: 0.5, ox: 1, oy: 0.5 },
  "bottom-left": { x: 0, y: 1, ox: 0, oy: 1 },
  bottom: { x: 0.5, y: 1, ox: 0.5, oy: 1 },
  "bottom-right": { x: 1, y: 1, ox: 1, oy: 1 },
};

// Strict px + % parser for a canvas-space coordinate. Returns
// `undefined` (not 0) when the value is missing so the caller can branch
// on "user opted out". Bare numbers and "NNpx" are pixels; "NN%" is a
// fraction of the axis extent. Other CSS units warn + fall back via
// resolveToPx (which renders unsupported units inert).
export function resolveCoord(
  v: number | string | undefined,
  axisExtent: number,
  label = "canvasPlacement",
): number | undefined {
  if (v === undefined) return undefined;
  return resolveToPx(v, axisExtent, { label });
}

// Anchor-axis spec — DIFFERENT semantics from `resolveCoord`: bare
// numbers are a 0..1 fraction of the SUBJECT's own extent, so
// `originX={0.5}` means "the subject's horizontal centre" (compare CSS
// `transform-origin: 50%`). "NN%" / "NNpx" strings fall back to standard
// length-percentage resolution.
const PX_OR_BARE = /^(-?\d+(?:\.\d+)?)(?:px)?$/;
const PCT = /^(-?\d+(?:\.\d+)?)%$/;
export function resolveOriginOffset(
  v: number | string | undefined,
  extent: number,
  fallbackFraction: number,
  label = "canvasPlacement",
): number {
  if (v === undefined) return fallbackFraction * extent;
  if (typeof v === "number") return v * extent;
  const trimmed = v.trim();
  const pctMatch = PCT.exec(trimmed);
  if (pctMatch) return (parseFloat(pctMatch[1]) / 100) * extent;
  const pxMatch = PX_OR_BARE.exec(trimmed);
  if (pxMatch) return parseFloat(pxMatch[1]);
  if (process.env.NODE_ENV !== "production") {
    console.warn(
      `[${label}] Unsupported origin value "${v}". Use a 0..1 number, "NN%", or "NNpx".`,
    );
  }
  return fallbackFraction * extent;
}
