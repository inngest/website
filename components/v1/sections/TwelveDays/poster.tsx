import type { ReactNode } from "react";

/**
 * Poster type for the campaign: a huge, heavy line and a mono
 * line in between, as on the "Huge day for people who refuse to stop
 * running" art. Circular Black is the closest real heavy grotesk the
 * site serves; the mono is the site's Whyte Mono.
 */
export const POSTER_HUGE =
  "font-sans font-black leading-[0.86] tracking-[-0.03em] text-[clamp(64px,14vw,188px)]";

export const POSTER_MONO =
  "font-v1Label leading-[1.05] tracking-[0.02em] text-[clamp(20px,3.4vw,46px)]";

/** Section heading, same voice at a smaller size. */
export const POSTER_TITLE =
  "font-sans font-black leading-[0.9] tracking-[-0.02em] text-[clamp(40px,7vw,96px)]";

export const POSTER_EYEBROW = "font-v1Label text-[15px]";

/** Pill chip, like the "The AI Conference · San Francisco" tags. */
export function Chip({
  children,
  tone = "light",
}: {
  children: ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <span
      className={
        "inline-flex items-center rounded-full px-3 py-1 font-v1Label text-[14px] " +
        (tone === "light"
          ? "bg-white/35 text-[#020202]"
          : "bg-[#020202] text-white")
      }
    >
      {children}
    </span>
  );
}

export type ButtonTone =
  | "ink"
  | "outline"
  | "white"
  | "yellow"
  | "green"
  | "salmon"
  | "ghost";

const BUTTON_TONES: Record<ButtonTone, string> = {
  ink: "border-[#020202] bg-[#020202] text-white hover:bg-white hover:text-[#020202]",
  outline:
    "border-[#020202] bg-transparent text-[#020202] hover:bg-[#020202] hover:text-white",
  white:
    "border-[#020202] bg-white text-[#020202] hover:bg-[#020202] hover:text-white",
  yellow:
    "border-[#F7DA10] bg-[#F7DA10] text-[#020202] hover:border-white hover:bg-white",
  green:
    "border-[#0BDD48] bg-[#0BDD48] text-[#020202] hover:border-white hover:bg-white",
  salmon:
    "border-[#F65C4F] bg-[#F65C4F] text-[#020202] hover:border-white hover:bg-white",
  ghost:
    "border-white bg-transparent text-white hover:bg-white hover:text-[#020202]",
};

/**
 * The one button style on this page: the site Button's shape and type
 * (rounded-md, label, 42px tall) in the campaign's colours.
 * Hover only swaps colours; nothing moves.
 */
export function buttonClass(tone: ButtonTone, size: "md" | "sm" = "md") {
  return (
    "inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-md border-2 font-v1Label font-semibold tracking-[0.05rem] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#F7DA10] disabled:cursor-not-allowed disabled:opacity-50 motion-safe:transition-colors motion-safe:duration-200 " +
    (size === "md"
      ? "h-[42px] min-w-[124px] px-5 text-[12px] "
      : "h-8 px-3 text-[12px] ") +
    BUTTON_TONES[tone]
  );
}
