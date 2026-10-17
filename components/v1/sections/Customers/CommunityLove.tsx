"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "@/components/v1/Link";
import { CarouselArrow } from "@/components/v1/sections/shared/CarouselArrow";
import {
  getSocialQuotes,
  SOCIAL_QUOTES,
  type SocialQuote,
  type SocialQuoteSource,
} from "@/data/socialQuotes";
import { cn } from "@/utils/v1/cn";

const SEE_MORE_HREF = "/community?ref=customers";
const PREVIEW_COUNT = 8;
const LEAD_QUOTE_IDS = ["claire-temporal-dx", "posthog-temporal-ux"];

const SOURCE_LABEL: Record<SocialQuoteSource, string> = {
  x: "X",
  linkedin: "LinkedIn",
  reddit: "Reddit",
};

function previewQuotes(): SocialQuote[] {
  const lead = getSocialQuotes(LEAD_QUOTE_IDS);
  const leadIds = new Set(lead.map((quote) => quote.id));
  const rest = [...SOCIAL_QUOTES]
    .filter((quote) => !leadIds.has(quote.id))
    .sort((a, b) => {
      const aTime = new Date(a.sortDate ?? a.date).getTime();
      const bTime = new Date(b.sortDate ?? b.date).getTime();
      return bTime - aTime;
    })
    .slice(0, PREVIEW_COUNT - lead.length);
  return [...lead, ...rest];
}

/**
 * Condensed teaser for /community. A short title and a horizontal
 * strip of quote cards — sweep to scan, then follow See more.
 */
export default function CommunityLove() {
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ prev: false, next: true });
  const quotes = previewQuotes();

  const syncEdges = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setEdges({
      prev: el.scrollLeft > 4,
      next: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    syncEdges();
    window.addEventListener("resize", syncEdges);
    return () => window.removeEventListener("resize", syncEdges);
  }, [syncEdges]);

  const sweep = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector("li");
    const distance = (card?.getBoundingClientRect().width ?? 300) + 16;
    el.scrollBy({ left: direction * distance, behavior: "smooth" });
  };

  return (
    <section
      aria-labelledby="customers-community-heading"
      className="relative pb-6 pt-1 sm:pb-8 lg:pb-12"
    >
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4 px-6 lg:px-8">
        <h2
          id="customers-community-heading"
          className="text-v1-heading-sm text-v1-frost"
        >
          What builders are saying
        </h2>
        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          <div className="hidden items-center gap-1 sm:flex">
            <SweepButton
              label="Previous quotes"
              disabled={!edges.prev}
              onClick={() => sweep(-1)}
              className="rotate-180"
            />
            <SweepButton
              label="Next quotes"
              disabled={!edges.next}
              onClick={() => sweep(1)}
            />
          </div>
          <SeeMoreLink />
        </div>
      </div>

      <ul
        ref={scrollerRef}
        onScroll={syncEdges}
        tabIndex={0}
        aria-label="Community quotes"
        className="mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1 pl-[max(1.5rem,calc((100%-1440px)/2+1.5rem))] pr-[max(1.5rem,calc((100%-1440px)/2+1.5rem))] [-ms-overflow-style:none] [scroll-padding-inline-start:max(1.5rem,calc((100%-1440px)/2+1.5rem))] [scrollbar-width:none] focus-visible:outline-none lg:pl-[max(2rem,calc((100%-1440px)/2+2rem))] lg:pr-[max(2rem,calc((100%-1440px)/2+2rem))] lg:[scroll-padding-inline-start:max(2rem,calc((100%-1440px)/2+2rem))] [&::-webkit-scrollbar]:hidden"
      >
        {quotes.map((quote) => (
          <li
            key={quote.id}
            className="w-[min(78vw,300px)] shrink-0 snap-start"
          >
            <QuoteCard quote={quote} />
          </li>
        ))}
        <li className="w-[min(78vw,220px)] shrink-0 snap-start">
          <Link
            href={SEE_MORE_HREF}
            underline={false}
            className="group/more text-v1-label-md flex h-full min-h-[156px] flex-col items-start justify-end rounded-[8px] border border-v1-strong p-5 uppercase text-v1-frost hover:border-[#a3a3a3] hover:text-v1-accent-salmon motion-safe:transition-colors"
          >
            See more
            <span
              aria-hidden
              className="mt-2 inline-block group-hover/more:translate-x-[6px] motion-safe:transition-transform motion-safe:duration-[400ms] motion-safe:ease-v1-in"
            >
              →
            </span>
          </Link>
        </li>
      </ul>
    </section>
  );
}

function SeeMoreLink() {
  return (
    <Link
      href={SEE_MORE_HREF}
      underline={false}
      className="group/more text-v1-label-md inline-flex items-center uppercase text-v1-frost hover:text-v1-accent-salmon motion-safe:transition-colors motion-safe:duration-300"
    >
      See more
      <span
        aria-hidden
        className="ml-2 inline-block group-hover/more:translate-x-[6px] motion-safe:transition-transform motion-safe:duration-[400ms] motion-safe:ease-v1-in"
      >
        →
      </span>
    </Link>
  );
}

function SweepButton({
  label,
  disabled,
  onClick,
  className,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="text-v1-frost disabled:opacity-30"
    >
      <CarouselArrow className={cn("size-8", className)} />
    </button>
  );
}

function QuoteCard({ quote }: { quote: SocialQuote }) {
  return (
    <figure className="flex h-full min-h-[156px] flex-col gap-4 rounded-[8px] border border-v1-strong bg-[linear-gradient(297deg,rgba(33,33,33,0)_-2.25%,#020202_46.83%)] p-5">
      <blockquote className="line-clamp-4 font-v1Heading text-[16px] leading-[1.4] tracking-[-0.01em] text-v1-frost">
        &ldquo;{quote.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-auto flex min-w-0 items-center gap-2.5">
        {quote.authorAvatar ? (
          <img
            src={quote.authorAvatar}
            alt=""
            width={28}
            height={28}
            className="size-7 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span
            aria-hidden
            className="flex size-7 shrink-0 items-center justify-center rounded-full border border-v1-strong font-v1Heading text-[13px] text-v1-frost"
          >
            {quote.authorName.charAt(0)}
          </span>
        )}
        <span className="min-w-0">
          <span className="block truncate font-v1Body text-[14px] leading-[18px] text-v1-frost">
            {quote.authorName}
          </span>
          <span className="block truncate font-v1Body text-[12px] leading-[16px] text-v1-frost/60">
            {SOURCE_LABEL[quote.source]}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}
