import type { SVGProps } from "react";

/**
 * Chip glyphs for the "Some things are built to keep going" section.
 *
 * Scoped to this page rather than added to `NavIcons`: those are 24×24
 * filled menu glyphs, and these are 16×16 stroked marks sized to sit
 * inside a 12px label. Authored with `currentColor` so each chip's tone
 * colours its icon with no per-icon wiring.
 */
export type KeepGoingIconName =
  | "search"
  | "gear"
  | "person"
  | "sparkle"
  | "code"
  | "loop"
  | "clock"
  | "cross"
  | "pause";

/** Path data only — every glyph shares the same stroke treatment below. */
const PATHS: Record<KeepGoingIconName, string> = {
  search:
    "M7 2.75a4.25 4.25 0 1 0 0 8.5 4.25 4.25 0 0 0 0-8.5ZM10.2 10.2 13.75 13.75",
  gear: "M8 5.6a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8ZM8 1.4v2.1M8 12.5v2.1M1.4 8h2.1M12.5 8h2.1M3.33 3.33l1.48 1.48M11.19 11.19l1.48 1.48M12.67 3.33l-1.48 1.48M4.81 11.19l-1.48 1.48",
  person:
    "M8 2.6a2.7 2.7 0 1 0 0 5.4 2.7 2.7 0 0 0 0-5.4ZM2.9 14c0-2.82 2.28-5.1 5.1-5.1s5.1 2.28 5.1 5.1",
  sparkle:
    "M8 1.4 9.55 6.45 14.6 8 9.55 9.55 8 14.6 6.45 9.55 1.4 8 6.45 6.45Z",
  code: "M5.8 4.3 2 8l3.8 3.7M10.2 4.3 14 8l-3.8 3.7",
  loop: "M13.6 8a5.6 5.6 0 1 1-1.98-4.27M13.9 1.3v3.1h-3.1",
  clock: "M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2ZM8 4.6V8l2.5 1.55",
  cross: "M4.2 4.2 11.8 11.8M11.8 4.2 4.2 11.8",
  pause: "M6.1 3.6v8.8M9.9 3.6v8.8",
};

export default function KeepGoingIcon({
  name,
  ...props
}: { name: KeepGoingIconName } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
