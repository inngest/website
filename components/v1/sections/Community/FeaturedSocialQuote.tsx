"use client";

import { type SocialQuote, type SocialQuoteSource } from "@/data/socialQuotes";
import Chip from "@/components/v1/sections/shared/Chip";
import {
  CURSOR_TILT_SEED,
  onCursorTiltMove,
  onCursorTiltLeave,
} from "@/utils/v1/cursorFx";
import {
  RiLinkedinBoxFill,
  RiRedditFill,
  RiTwitterXFill,
} from "@remixicon/react";
import { refLinkProps } from "@/utils/v1/ref";
import { cn } from "@/utils/v1/cn";

const SOURCE_LABEL: Record<SocialQuoteSource, string> = {
  x: "X",
  linkedin: "LinkedIn",
  reddit: "Reddit",
};

function SourceIcon({
  source,
  className,
}: {
  source: SocialQuoteSource;
  className?: string;
}) {
  const iconClass = cn("size-4 shrink-0 text-v1-frost/70", className);
  if (source === "x")
    return <RiTwitterXFill className={iconClass} aria-hidden />;
  if (source === "linkedin")
    return <RiLinkedinBoxFill className={iconClass} aria-hidden />;
  return <RiRedditFill className={iconClass} aria-hidden />;
}

/**
 * Featured community quote — same card chrome as /customers StoryCard
 * (gradient surface, 8px radius, cursor tilt, salmon spotlight).
 * Avatar + chips stand in for the brand wordmark + tags.
 */
export default function FeaturedSocialQuote({
  quote,
  refTag = "community",
  compact = false,
}: {
  quote: SocialQuote;
  refTag?: string;
  /** Smaller overlay card. Hover lifts it and washes it salmon so the
   *  source link reads as clickable. */
  compact?: boolean;
}) {
  const sourceHref = `${quote.sourceUrl}${
    quote.sourceUrl.includes("?") ? "&" : "?"
  }ref=${refTag}-featured`;

  return (
    <a
      {...refLinkProps(sourceHref)}
      target="_blank"
      rel="noopener noreferrer"
      onPointerMove={compact ? undefined : onCursorTiltMove}
      onPointerLeave={compact ? undefined : onCursorTiltLeave}
      style={compact ? undefined : CURSOR_TILT_SEED}
      className={cn(
        "group/card relative isolate flex h-full flex-col rounded-[8px] motion-safe:transition-[transform,border-color,box-shadow,background-color] motion-safe:duration-[500ms] motion-safe:ease-v1-in",
        compact
          ? "gap-2 border border-black/10 bg-white px-3.5 pb-3 pt-2.5 text-[#1A1A1A] shadow-[0_28px_48px_-16px_rgba(0,0,0,0.45)] [transform:rotate(var(--tilt,0deg))_translateY(var(--lift,0px))] hover:border-v1-accent-salmon hover:shadow-[0_32px_44px_-14px_rgba(0,0,0,0.5)] hover:[--lift:-14px]"
          : "gap-[10px] border border-v1-strong bg-[linear-gradient(297deg,rgba(33,33,33,0)_-2.25%,#020202_46.83%)] pb-8 pl-8 pr-6 pt-4 hover:border-[#a3a3a3] hover:shadow-[0_28px_60px_-32px_rgba(0,0,0,0.55)] hover:[--lift:-4px]"
      )}
    >
      {compact ? null : (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 rounded-[8px] opacity-0 group-hover/card:opacity-100 motion-safe:transition-opacity motion-safe:duration-[500ms] motion-safe:ease-v1-in"
          style={{
            background:
              "radial-gradient(360px circle at var(--mx) var(--my), rgba(255, 210, 195, 0.09), rgba(255, 210, 195, 0.02) 45%, transparent 70%)",
          }}
        />
      )}

      <span
        className={cn(
          "flex w-full items-center justify-between gap-3",
          compact ? "h-10" : "h-[75px] gap-4"
        )}
      >
        <span className="flex min-w-0 items-center gap-2.5">
          {quote.authorAvatar ? (
            <img
              src={quote.authorAvatar}
              alt=""
              width={48}
              height={48}
              className={cn(
                "shrink-0 rounded-full object-cover",
                compact ? "size-8" : "size-12"
              )}
            />
          ) : (
            <span
              aria-hidden
              className={cn(
                "flex shrink-0 items-center justify-center rounded-full border border-v1-strong bg-v1-surfaceElevated font-v1Heading text-v1-frost",
                compact
                  ? "size-8 border-black/15 bg-black/5 text-[13px] text-[#1A1A1A]"
                  : "size-12 text-[18px]"
              )}
            >
              {quote.authorName.charAt(0)}
            </span>
          )}
          <span className="min-w-0">
            <span
              className={cn(
                "block truncate font-v1Body text-v1-frost",
                compact
                  ? "text-[13px] leading-4 text-[#1A1A1A]"
                  : "text-[16px] leading-[24px]"
              )}
            >
              {quote.authorName}
            </span>
            {quote.authorTitle ? (
              <span
                className={cn(
                  "block truncate font-v1Body text-v1-frost/70",
                  compact
                    ? "text-[11px] leading-4 text-black/60"
                    : "text-[14px] leading-[20px]"
                )}
              >
                {quote.authorTitle}
              </span>
            ) : null}
          </span>
        </span>
        <SourceIcon
          source={quote.source}
          className={compact ? "text-[#1A1A1A]" : undefined}
        />
      </span>

      <div
        className={cn("flex flex-1 flex-col", compact ? "gap-3" : "gap-8 pr-8")}
      >
        <div className={cn("flex flex-col", compact ? "gap-2" : "gap-[26px]")}>
          {compact ? null : (
            <div className="flex flex-wrap items-center gap-2">
              {quote.context ? (
                <Chip size="sm" variant="gradient">
                  {quote.context}
                </Chip>
              ) : null}
              <Chip size="sm" variant="solid">
                {SOURCE_LABEL[quote.source]}
              </Chip>
            </div>
          )}
          <blockquote
            className={cn(
              compact
                ? "font-v1Body text-[14px] leading-[1.35] text-[#1A1A1A]"
                : "text-v1-heading-sm text-v1-frost group-hover/card:text-v1-accent-salmon motion-safe:transition-colors"
            )}
          >
            &ldquo;{quote.quote}&rdquo;
          </blockquote>
        </div>
        <span
          className={cn(
            "mt-auto inline-flex items-baseline uppercase motion-safe:transition-colors",
            compact
              ? "font-v1Label text-[11px] leading-none text-[#1A1A1A]"
              : "text-v1-label-md text-v1-frost group-hover/card:text-v1-accent-salmon"
          )}
        >
          View original
          <span
            aria-hidden="true"
            className="ml-2 inline-block group-hover/card:translate-x-[6px] motion-safe:transition-transform motion-safe:duration-[400ms] motion-safe:ease-v1-in"
          >
            →
          </span>
        </span>
      </div>
    </a>
  );
}
