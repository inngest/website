import FeaturedSocialQuote from "@/components/v1/sections/Community/FeaturedSocialQuote";
import { getSocialQuotes } from "@/data/socialQuotes";

/**
 * Crawlable quote block for legacy LandingPage routes (v0). Uses the
 * same customer-card chrome as v1 quote highlights.
 */
export default function LandingSocialQuotes({
  quoteIds,
  refTag,
}: {
  quoteIds: string[];
  refTag: string;
}) {
  const quotes = getSocialQuotes(quoteIds);
  if (quotes.length === 0) return null;

  return (
    <section className="my-28 py-14">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="mb-4 text-3xl font-semibold text-white">
          What developers say about switching to Inngest
        </h2>
        <p className="mb-10 max-w-3xl text-lg text-white/70">
          Named sources on BullMQ, broker setup, and moving background jobs off
          DIY queues — with links to the original posts.
        </p>
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {quotes.map((quote) => (
            <li key={quote.id} className="list-none">
              <FeaturedSocialQuote quote={quote} refTag={refTag} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
