import { minWidth } from "../breakpoints";
import { useMediaQuery } from "./useMediaQuery";

/**
 * True at the v1 "desktop" breakpoint (Tailwind `lg` and up). Use to
 * short-circuit desktop-only rendering paths (particle/canvas
 * backgrounds, absolute hero layouts). For other thresholds, call
 * `useMediaQuery` directly rather than adding more named aliases here.
 */
export function useIsDesktop(): boolean {
  return useMediaQuery(minWidth("lg"));
}
