import { cn } from "@/utils/v1/cn";

/**
 * Shared v1 form-field surface: carbon-500 fill (#020202 — no v1
 * Tailwind utility, so literal), 35%-steel hairline border, 4px radius,
 * 16px CircularXX text, 50%-frost placeholder.
 *
 * `FIELD_BASE` is the common chrome; single-line inputs add a fixed
 * height (`INPUT_CLASSES`) and the textarea adds its own padding +
 * height (`TEXTAREA_CLASSES`).
 */
export const FIELD_BASE =
  "w-full rounded-[4px] border border-v1-steel/35 bg-v1-surfaceBase px-4 font-v1Body text-[16px] text-v1-frost placeholder:text-v1-frost/50 focus:border-v1-frost/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-v1-frost/25";

/** Single-line input: fixed 44px box. */
export const INPUT_CLASSES = cn(FIELD_BASE, "h-[44px]");

/** Multi-line input: 125px box, full 16px padding, 24px line-height. */
export const TEXTAREA_CLASSES = cn(
  FIELD_BASE,
  "h-[125px] resize-y p-4 leading-[24px]",
);
