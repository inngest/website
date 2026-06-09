"use client";

import Image from "next/image";
import Link from "next/link";
import Chip from "@/components/v1/sections/shared/Chip";
import { LOGO_HEIGHT } from "@/components/v1/sections/Customers/data";
import {
  CURSOR_TILT_SEED,
  onCursorTiltMove,
  onCursorTiltLeave,
} from "@/utils/v1/cursorFx";

/**
 * Customer-story card — the shared component used both
 * in the /customers grid and as a "Related stories" card on the
 * customer-story template. Brand wordmark over a black-gradient surface,
 * tag pills, Heading/Sm title, clamped body, and a "Read the story →"
 * cue. Cursor-tilt (±2°/1.5°) + 4px lift + salmon spotlight + shadow on
 * hover; CURSOR_TILT_SEED applies the perspective transform.
 */

export interface StoryCardProps {
  href: string;
  logo: string;
  /** Brand name — used as the wordmark's alt text. */
  brand: string;
  tags: string[];
  title: string;
  body: string;
  /** Wordmark render height; width auto-derives. Defaults to the shared
   *  24px the /customers grid uses; the related-stories row passes the
   *  per-brand heights from the comp (21/24/29). */
  logoHeight?: number;
}

export default function StoryCard({
  href,
  logo,
  brand,
  tags,
  title,
  body,
  logoHeight = LOGO_HEIGHT,
}: StoryCardProps) {
  return (
    <Link
      href={href}
      onPointerMove={onCursorTiltMove}
      onPointerLeave={onCursorTiltLeave}
      style={CURSOR_TILT_SEED}
      // "Background-Gradient-Black" — 297deg diagonal from
      // transparent carbon-400 (top-right) to solid carbon-500
      // (bottom-left). Stops at -2.25% / 46.83%.
      // Cursor-tilt (±2°/1.5° via --rx/--ry) + 4 px lift + salmon
      // spotlight + shadow on hover. CURSOR_TILT_SEED applies the
      // perspective transform consuming those vars.
      // Card: rounded-8, 1px #7c7c7c border, padding
      // pt-16 pr-24 pb-32 pl-32, gradient bg, gap-10 between the logo
      // block and the content block (NOT a uniform 32px).
      className="group/card relative isolate flex h-full flex-col gap-[10px] rounded-[8px] border border-v1-strong bg-[linear-gradient(297deg,rgba(33,33,33,0)_-2.25%,#020202_46.83%)] pb-8 pl-8 pr-6 pt-4 motion-safe:transition-[transform,border-color,box-shadow] motion-safe:duration-[500ms] motion-safe:ease-v1-in hover:[--lift:-4px] hover:border-[#a3a3a3] hover:shadow-[0_28px_60px_-32px_rgba(0,0,0,0.55)]"
    >
      {/* Cursor-tracked salmon spotlight — opacity 0 → 1 on
          group hover. Mirrors HoverCardShell's spotlight. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 rounded-[8px] opacity-0 motion-safe:transition-opacity motion-safe:duration-[500ms] motion-safe:ease-v1-in group-hover/card:opacity-100"
        style={{
          background:
            "radial-gradient(360px circle at var(--mx) var(--my), rgba(255, 210, 195, 0.09), rgba(255, 210, 195, 0.02) 45%, transparent 70%)",
        }}
      />
      {/* Brand wordmark — vertically centered in the 75 px logo
          frame. */}
      <span className="flex h-[75px] w-full items-center">
        <Image
          src={logo}
          alt={brand}
          width={logoHeight * 8}
          height={logoHeight}
          style={{ height: logoHeight, width: "auto" }}
          className="block object-contain object-left"
          unoptimized
        />
      </span>
      {/* Content block — extra pr-32 so the content
          right edge is inset 56 px from the card (24 card + 32 frame).
          Outer gap-32 separates the tags+text group from the read-story
          row; inner gap-26 stacks tags above the text block; innermost
          gap-20 separates title from body. */}
      <div className="flex flex-1 flex-col gap-8 pr-8">
        <div className="flex flex-col gap-[26px]">
          <div className="flex flex-wrap items-center gap-2">
            {tags.map((t) => (
              <Chip key={t} size="sm" variant="gradient">
                {t}
              </Chip>
            ))}
          </div>
          <div className="flex flex-col gap-[20px]">
            <h3 className="text-v1-heading-sm text-v1-frost motion-safe:transition-colors group-hover/card:text-v1-accent-salmon">
              {title}
            </h3>
            <p className="line-clamp-2 font-v1Body text-[16px] leading-[24px] text-v1-frost">
              {body}
            </p>
          </div>
        </div>
        <span className="text-v1-label-md mt-auto inline-flex items-baseline uppercase text-v1-frost motion-safe:transition-colors group-hover/card:text-v1-accent-salmon">
          Read the story
          <span
            aria-hidden="true"
            className="ml-2 inline-block motion-safe:transition-transform motion-safe:duration-[400ms] motion-safe:ease-v1-in group-hover/card:translate-x-[6px]"
          >
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
