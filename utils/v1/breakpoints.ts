/**
 * v1 breakpoint constants — single source of truth for JS-side media
 * queries. Mirrors Tailwind's default `screens`, which the project
 * doesn't override. Use these so JS-gated decisions (canvas mount,
 * drawer trigger) stay in sync with the `lg:` / `md:` utility classes.
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;

/** Builds a `(min-width: Npx)` query string from a breakpoint key. */
export const minWidth = (key: BreakpointKey): string =>
  `(min-width: ${BREAKPOINTS[key]}px)`;
