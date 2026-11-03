import type { ReactNode } from "react";

/**
 * Poster type for the campaign: a huge, heavy uppercase line and a mono
 * line in between, as on the "Huge day for people who refuse to stop
 * running" art. Circular Black is the closest real heavy grotesk the
 * site serves; the mono is the site's Whyte Mono.
 */
export const POSTER_HUGE =
  "font-sans font-black uppercase leading-[0.86] tracking-[-0.03em] text-[clamp(64px,14vw,188px)]";

export const POSTER_MONO =
  "font-v1Label uppercase leading-[1.05] tracking-[0.02em] text-[clamp(20px,3.4vw,46px)]";

/** Section heading, same voice at a smaller size. */
export const POSTER_TITLE =
  "font-sans font-black uppercase leading-[0.9] tracking-[-0.02em] text-[clamp(40px,7vw,96px)]";

export const POSTER_EYEBROW = "font-v1Label text-[15px] uppercase";

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
        "inline-flex items-center rounded-full px-3 py-1 font-v1Label text-[14px] uppercase " +
        (tone === "light"
          ? "bg-white/35 text-[#010101]"
          : "bg-[#010101] text-white")
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
  | "lime"
  | "green"
  | "salmon"
  | "ghost";

const BUTTON_TONES: Record<ButtonTone, string> = {
  ink: "border-[#010101] bg-[#010101] text-white hover:bg-white hover:text-[#010101]",
  outline:
    "border-[#010101] bg-transparent text-[#010101] hover:bg-[#010101] hover:text-white",
  white:
    "border-[#010101] bg-white text-[#010101] hover:bg-[#010101] hover:text-white",
  lime: "border-[#ECFE08] bg-[#ECFE08] text-[#010101] hover:border-white hover:bg-white",
  green:
    "border-[#0BDD48] bg-[#0BDD48] text-[#010101] hover:border-white hover:bg-white",
  salmon:
    "border-[#F55C50] bg-[#F55C50] text-[#010101] hover:border-white hover:bg-white",
  ghost:
    "border-white bg-transparent text-white hover:bg-white hover:text-[#010101]",
};

/**
 * The one button style on this page: the site Button's shape and type
 * (rounded-md, uppercase label, 42px tall) in the campaign's colours.
 * Hover only swaps colours; nothing moves.
 */
export function buttonClass(tone: ButtonTone, size: "md" | "sm" = "md") {
  return (
    "inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-md border-2 font-v1Label font-semibold uppercase tracking-[0.05rem] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#ECFE08] disabled:cursor-not-allowed disabled:opacity-50 motion-safe:transition-colors motion-safe:duration-200 " +
    (size === "md"
      ? "h-[42px] min-w-[124px] px-5 text-[12px] "
      : "h-8 px-3 text-[12px] ") +
    BUTTON_TONES[tone]
  );
}
