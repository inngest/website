import PageShell from "@/components/v1/PageShell";
import CommunityQuotesExplorer from "@/components/v1/sections/Community/CommunityQuotesExplorer";
import FeaturedSocialQuote from "@/components/v1/sections/Community/FeaturedSocialQuote";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import StippleCtaSection from "@/components/v1/sections/shared/StippleCtaSection";
import ButtonLink from "@/components/v1/ButtonLink";
import { SOCIAL_QUOTES, getSocialQuotes } from "@/data/socialQuotes";

const FEATURED_QUOTE_IDS = ["posthog-temporal-ux", "claire-temporal-dx"];

/**
 * Canonical index of third-party mentions — crawlable HTML with
 * attribution and source links for SEO/AEO consensus signals.
 */
export default function Community() {
  const featured = getSocialQuotes(FEATURED_QUOTE_IDS);

  return (
    <PageShell>
      <div className="overflow-x-clip">
        <Section
          aria-labelledby="community-heading"
          className="relative pt-24 lg:pt-32"
          containerClassName="flex flex-col"
        >
          <SectionHeader
            id="community-heading"
            eyebrow="Community"
            title="What builders are saying"
            body="Love from across the social sphere."
            bodyClassName="max-w-[640px]"
          />

          <ul className="mt-10 grid grid-cols-1 gap-6 lg:mt-12 lg:grid-cols-2">
            {featured.map((quote) => (
              <li key={quote.id} className="list-none">
                <FeaturedSocialQuote quote={quote} refTag="community" />
              </li>
            ))}
          </ul>

          <div id="browse-quotes" className="mt-10 scroll-mt-28 lg:mt-12">
            <CommunityQuotesExplorer
              quotes={SOCIAL_QUOTES}
              featuredIds={FEATURED_QUOTE_IDS}
            />
          </div>
        </Section>

        <StippleCtaSection
          headingId="community-cta-heading"
          heading="See why teams switch to Inngest"
          body="Start with the free tier — no workers, no broker, no credit card."
          footnote="Free tier · Deploy in minutes"
        >
          <ButtonLink
            href="/sign-up?ref=community-cta"
            prefetch={false}
            variant="primary"
          >
            Start building free
          </ButtonLink>
          <ButtonLink href="/docs?ref=community-cta" variant="secondary">
            Read the docs
          </ButtonLink>
        </StippleCtaSection>
      </div>
    </PageShell>
  );
}
