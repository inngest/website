import Link from "@/components/v1/Link";
import { type SocialQuote, type SocialQuoteSource } from "@/data/socialQuotes";
import { cn } from "@/utils/v1/cn";

const SOURCE_LABEL: Record<SocialQuoteSource, string> = {
  x: "X",
  linkedin: "LinkedIn",
  reddit: "Reddit",
};

function formatQuoteDate(iso: string) {
  const parsed = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return iso;
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function SocialQuoteCard({
  quote,
  className,
  refTag,
}: {
  quote: SocialQuote;
  className?: string;
  /** Appended to the source link for attribution. */
  refTag?: string;
}) {
  const sourceHref = refTag
    ? `${quote.sourceUrl}${
        quote.sourceUrl.includes("?") ? "&" : "?"
      }ref=${refTag}`
    : quote.sourceUrl;

  return (
    <figure
      className={cn(
        "bg-v1-carbon-900/30 flex h-full flex-col gap-6 border border-v1-carbon-300/40 p-6 lg:p-8",
        className
      )}
    >
      {quote.context ? (
        <p className="font-v1Mono text-[12px] uppercase tracking-[0.08em] text-v1-accent-salmon">
          {quote.context}
        </p>
      ) : null}
      <blockquote className="flex-1 font-v1Heading text-[18px] leading-[1.5] tracking-[-0.01em] text-v1-frost lg:text-[20px]">
        &ldquo;{quote.quote}&rdquo;
      </blockquote>
      <figcaption className="flex flex-col gap-1 border-t border-v1-carbon-300/30 pt-5 font-v1Body text-[14px] leading-[1.5] text-v1-frost/80">
        <span className="text-v1-frost">{quote.authorName}</span>
        {quote.authorTitle ? (
          <span className="text-v1-frost/70">{quote.authorTitle}</span>
        ) : null}
        <Link
          href={sourceHref}
          underline
          className="text-v1-body-sm mt-2 w-fit text-v1-frost/60 hover:text-v1-accent-salmon"
        >
          {quote.sourceLabel ??
            `${formatQuoteDate(quote.date)} · ${SOURCE_LABEL[quote.source]}`}
        </Link>
      </figcaption>
    </figure>
  );
}
