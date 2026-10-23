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
