"use client";

import { useState } from "react";
import { cn } from "@/utils/v1/cn";
import { RELATED } from "./data";

// Active-state card bg — single pre-composited greydient/dot texture.
// The original design stacks two source PNGs blended with soft-light;
// this collapses them into one webp (~57 KB) with that blend already
// baked in, so it renders directly (normal blend, no runtime
// blend-mode) and needs zero extra requests.
const ACTIVE_BG_SRC = "/assets/v1/about-related/hover-bg.webp";

export default function Related() {
  // `hovered` is the card index the pointer/focus is on, or null when
  // idle. The *active* card (texture image + salmon CTA) is the hovered
  // one, falling back to the left card (index 0) when idle. The
  // carbon-400 (#212121) fill belongs to the *idle default* card only;
  // it does NOT transfer on hover, so a hovered card shows the texture
  // + salmon CTA over the plain bg.
  const [hovered, setHovered] = useState<number | null>(null);
  const activeIndex = hovered ?? 0;
  return (
    <section
      aria-label="Related content"
      // gap-10 between heading and card grid. Mobile/tablet keep the
      // v1 page rhythm.
      className="relative mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-6 pb-[100px] pt-10 text-v1-frost sm:px-9 sm:pb-[140px] sm:pt-[56px] lg:px-[70px] lg:pb-[180px] lg:pt-[65px]"
    >
      {/* Heading — ABC Whyte regular, 58 px size, 70 px line-height,
          -0.01em tracking, capsize-trimmed. */}
      <h2 className="font-v1Heading font-normal leading-[1.2] tracking-[-0.01em] text-white [text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [font-size:clamp(2rem,4.5vw,3.625rem)] lg:leading-[70px]">
        Related content
      </h2>

      {/* Card row — a solid #7C7C7C border on the outer frame plus a
          single divider between the cards; rounded-[8px] matches
          --radius-3. `onPointerLeave` resets the active card to the
          left default when the pointer exits the whole grid. */}
      <div
        onPointerLeave={() => setHovered(null)}
        className="grid grid-cols-1 overflow-hidden rounded-[8px] border border-v1-strong sm:grid-cols-2"
      >
        {RELATED.map((r, idx) => (
          <RelatedCard
            key={r.title}
            href={r.href}
            title={r.title}
            active={idx === activeIndex}
            idleDefault={hovered === null && idx === 0}
            onActivate={() => setHovered(idx)}
            onDeactivate={() => setHovered(null)}
            // First card has its inner divider on the right (sm+);
            // mobile collapses to a bottom border between rows.
            innerBorder={
              idx === 0
                ? "border-b border-v1-strong sm:border-b-0 sm:border-r"
                : ""
            }
          />
        ))}
      </div>
    </section>
  );
}

interface RelatedCardProps {
  href: string;
  title: string;
  innerBorder: string;
  /** Whether this card owns the active styling (texture + salmon CTA),
   *  i.e. it's the hovered card, or the left card while idle. */
  active: boolean;
  /** True only for the left card while idle — the one that gets the
   *  carbon-400 fill. The fill is idle-only and never transfers on
   *  hover, so it's kept separate from `active`. */
  idleDefault: boolean;
  /** Promote this card to active — wired to pointer-enter / focus. */
  onActivate: () => void;
  /** Drop back to the idle default — wired to blur. */
  onDeactivate: () => void;
}

function RelatedCard({
  href,
  title,
  innerBorder,
  active,
  idleDefault,
  onActivate,
  onDeactivate,
}: RelatedCardProps) {
  return (
    <a
      href={href}
      onPointerEnter={onActivate}
      onFocus={onActivate}
      onBlur={onDeactivate}
      // Card frame — px-6 py-[44px], gap-3 internal stack. The
      // carbon-400 (#212121) fill is applied only to the
      // idle default (left) card via `idleDefault`; the active texture
      // + salmon CTA (driven by `active`) is what transfers on hover,
      // so a hovered card never picks up the dark fill.
      className={cn(
        "group/card relative isolate flex flex-col gap-3 overflow-hidden px-6 py-[44px] motion-safe:transition-colors",
        idleDefault && "bg-v1-surfaceElevated",
        innerBorder,
      )}
    >
      {/* Active-state texture — single pre-composited greydient/dot
          image (the soft-light blend is already baked into the webp, so
          it renders with the default `normal` blend — no runtime
          blend-mode). Fades in/out as the active card changes.
          Decorative only; `pointer-events-none` keeps the whole card a
          single click target. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={ACTIVE_BG_SRC}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className={cn(
          "pointer-events-none absolute inset-0 -z-10 h-full w-full select-none object-cover motion-safe:transition-opacity motion-safe:duration-[600ms] motion-safe:ease-v1-out",
          active ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Title — Heading/Md (32 px / 40 line / -0.01em). `h-[72px]`
          so the row aligns whether the title spans 1 or 2 lines;
          `line-clamp-2` caps overflow on edge cases. */}
      <h3 className="line-clamp-2 h-[72px] text-v1-heading-md-cap text-white">
        {title}
      </h3>

      {/* Spacer — the body is empty; this 169 px slot anchors the CTA
          at the bottom of the card. */}
      <div aria-hidden="true" className="h-[169px]" />

      {/* CTA — Label/Md (16 px Mono uppercase). Salmon on the active
          card, carbon-50 otherwise. Arrow nudges right on real pointer
          hover for a subtle micro-interaction. */}
      <span
        className={cn(
          "text-v1-label-md inline-flex items-baseline uppercase motion-safe:transition-colors",
          active ? "text-v1-accent-salmon" : "text-v1-alwaysWhite",
        )}
      >
        Read article
        <span
          aria-hidden="true"
          className="ml-2 inline-block motion-safe:transition-transform motion-safe:duration-[400ms] motion-safe:ease-v1-in group-hover/card:translate-x-[6px]"
        >
          →
        </span>
      </span>
    </a>
  );
}
