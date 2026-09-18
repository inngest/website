"use client";

import {
  type SocialQuote,
  type SocialQuoteSource,
} from "@/data/socialQuotes";
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

const SOURCE_LABEL: Record<SocialQuoteSource, string> = {
  x: "X",
  linkedin: "LinkedIn",
  reddit: "Reddit",
};

function SourceIcon({ source }: { source: SocialQuoteSource }) {
  const className = "size-4 shrink-0 text-v1-frost/70";
  if (source === "x") return <RiTwitterXFill className={className} aria-hidden />;
  if (source === "linkedin")
    return <RiLinkedinBoxFill className={className} aria-hidden />;
  return <RiRedditFill className={className} aria-hidden />;
}

/**
 * Featured community quote — same card chrome as /customers StoryCard
 * (gradient surface, 8px radius, cursor tilt, salmon spotlight).
 * Avatar + chips stand in for the brand wordmark + tags.
 */
export default function FeaturedSocialQuote({
  quote,
  refTag = "community",
}: {
  quote: SocialQuote;
  refTag?: string;
}) {
  const sourceHref = `${quote.sourceUrl}${
    quote.sourceUrl.includes("?") ? "&" : "?"
  }ref=${refTag}-featured`;

  return (
    <a
      href={sourceHref}
      target="_blank"
      rel="noopener noreferrer"
      onPointerMove={onCursorTiltMove}
      onPointerLeave={onCursorTiltLeave}
      style={CURSOR_TILT_SEED}
      className="group/card relative isolate flex h-full flex-col gap-[10px] rounded-[8px] border border-v1-strong bg-[linear-gradient(297deg,rgba(33,33,33,0)_-2.25%,#020202_46.83%)] pb-8 pl-8 pr-6 pt-4 motion-safe:transition-[transform,border-color,box-shadow] motion-safe:duration-[500ms] motion-safe:ease-v1-in hover:[--lift:-4px] hover:border-[#a3a3a3] hover:shadow-[0_28px_60px_-32px_rgba(0,0,0,0.55)]"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 rounded-[8px] opacity-0 motion-safe:transition-opacity motion-safe:duration-[500ms] motion-safe:ease-v1-in group-hover/card:opacity-100"
        style={{
          background:
            "radial-gradient(360px circle at var(--mx) var(--my), rgba(255, 210, 195, 0.09), rgba(255, 210, 195, 0.02) 45%, transparent 70%)",
        }}
      />

      <span className="flex h-[75px] w-full items-center justify-between gap-4">
        <span className="flex min-w-0 items-center gap-3">
          {quote.authorAvatar ? (
            <img
              src={quote.authorAvatar}
              alt=""
              width={48}
              height={48}
              className="size-12 shrink-0 rounded-full object-cover"
            />
          ) : (
            <span
              aria-hidden
              className="flex size-12 shrink-0 items-center justify-center rounded-full border border-v1-strong bg-v1-surfaceElevated font-v1Heading text-[18px] text-v1-frost"
            >
              {quote.authorName.charAt(0)}
            </span>
          )}
          <span className="min-w-0">
            <span className="block truncate font-v1Body text-[16px] leading-[24px] text-v1-frost">
              {quote.authorName}
            </span>
            {quote.authorTitle ? (
              <span className="block truncate font-v1Body text-[14px] leading-[20px] text-v1-frost/70">
                {quote.authorTitle}
              </span>
            ) : null}
          </span>
        </span>
        <SourceIcon source={quote.source} />
      </span>

      <div className="flex flex-1 flex-col gap-8 pr-8">
        <div className="flex flex-col gap-[26px]">
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
          <blockquote className="text-v1-heading-sm text-v1-frost motion-safe:transition-colors group-hover/card:text-v1-accent-salmon">
            &ldquo;{quote.quote}&rdquo;
          </blockquote>
        </div>
        <span className="text-v1-label-md mt-auto inline-flex items-baseline uppercase text-v1-frost motion-safe:transition-colors group-hover/card:text-v1-accent-salmon">
          View original
          <span
            aria-hidden="true"
            className="ml-2 inline-block motion-safe:transition-transform motion-safe:duration-[400ms] motion-safe:ease-v1-in group-hover/card:translate-x-[6px]"
          >
            →
          </span>
        </span>
      </div>
    </a>
  );
}
