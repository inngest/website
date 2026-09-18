import { type ReactNode } from "react";
import { getSocialQuotes, type SocialQuote } from "@/data/socialQuotes";
import FeaturedSocialQuote from "@/components/v1/sections/Community/FeaturedSocialQuote";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import { cn } from "@/utils/v1/cn";

interface SocialQuotesSectionProps {
  /** Stable ids from `data/socialQuotes.ts`. */
  quoteIds: string[];
  /** Optional override when passing `quotes` directly. */
  quotes?: SocialQuote[];
  title: ReactNode;
  description?: ReactNode;
  headingId: string;
  refTag: string;
  /** 1 = stack, 2 = two-up, 3 = three-up at lg. */
  columns?: 1 | 2 | 3;
  className?: string;
}

const COLUMN_CLASS: Record<1 | 2 | 3, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 lg:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
};

/**
 * Crawlable third-party quotes for comparison and use-case pages.
 * Uses the same card chrome as /customers StoryCards.
 */
export default function SocialQuotesSection({
  quoteIds,
  quotes: quotesOverride,
  title,
  description,
  headingId,
  refTag,
  columns = 2,
  className,
}: SocialQuotesSectionProps) {
  const quotes = quotesOverride ?? getSocialQuotes(quoteIds);
  if (quotes.length === 0) return null;

  return (
    <Section
      aria-labelledby={headingId}
      className={cn("relative", className)}
      containerClassName="flex flex-col"
    >
      <SectionHeader id={headingId} title={title} body={description} />
      <ul
        className={cn(
          "mt-12 grid gap-6 lg:mt-16 lg:gap-8",
          COLUMN_CLASS[columns]
        )}
      >
        {quotes.map((quote) => (
          <li key={quote.id} className="min-h-0 list-none">
            <FeaturedSocialQuote quote={quote} refTag={refTag} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
