import ButtonLink from "@/components/v1/ButtonLink";
import StoryCard from "@/components/v1/sections/shared/StoryCard";
import type { RelatedStory } from "@/components/v1/sections/CustomerStory/types";

/* ------------------------------------------------------------------ *
 * Related stories (162:17554).                                       *
 * ------------------------------------------------------------------ */
export default function RelatedStories({
  related,
}: {
  related: RelatedStory[];
}) {
  if (related.length === 0) return null;
  return (
    <section
      aria-labelledby="related-stories-heading"
      className="relative mx-auto w-full max-w-[1440px] px-6 py-[52px] text-v1-frost sm:px-8 lg:px-[70px]"
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <h2
            id="related-stories-heading"
            className="text-v1-heading-md-cap text-white"
          >
            Related stories
          </h2>
          <ButtonLink href="/customers?ref=customer-story" variant="secondary" size="md">
            View all customer stories
          </ButtonLink>
        </div>
        <ul className="grid list-none grid-cols-1 gap-4 pl-0 md:grid-cols-3">
          {related.map((s) => (
            <li key={s.href} className="list-none">
              <StoryCard
                href={s.href}
                logo={s.logo}
                brand={s.logoAlt}
                tags={s.tags}
                title={s.title}
                body={s.body}
                logoHeight={s.logoHeight}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
