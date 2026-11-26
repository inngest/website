import FeaturedSocialQuote from "@/components/v1/sections/Community/FeaturedSocialQuote";
import { getSocialQuotes } from "@/data/socialQuotes";
import { cn } from "@/utils/v1/cn";

const QUOTES = [
  {
    id: "posthog-temporal-ux",
    pose: "lg:bottom-[17%] lg:left-[-2%] lg:z-10 lg:w-[32%] lg:[--tilt:-13deg]",
  },
  {
    id: "claire-temporal-dx",
    pose: "lg:bottom-[8%] lg:left-[28%] lg:z-20 lg:w-[32%] lg:[--tilt:6deg]",
  },
  {
    id: "skylar-temporal-dx",
    pose: "lg:bottom-[12%] lg:left-[64%] lg:z-30 lg:w-[32%] lg:[--tilt:-8deg]",
  },
] as const;

/**
 * Third-party quotes fanned across the hero dashboard. Each card keeps
 * its own tilt; hover lifts that card forward.
 */
export default function CompareTemporalTestimonials() {
  const byId = new Map(
    getSocialQuotes(QUOTES.map((q) => q.id)).map((q) => [q.id, q])
  );

  return (
    <ul
      aria-label="Teams comparing Inngest and Temporal"
      className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:pointer-events-none lg:absolute lg:inset-0 lg:mt-0 lg:block"
    >
      {QUOTES.map((item) => {
        const quote = byId.get(item.id);
        if (!quote) return null;
        return (
          <li
            key={quote.id}
            className={cn(
              "list-none lg:pointer-events-auto lg:absolute lg:hover:z-40",
              item.pose
            )}
          >
            <FeaturedSocialQuote
              quote={quote}
              refTag="compare-to-temporal"
              compact
            />
          </li>
        );
      })}
    </ul>
  );
}
