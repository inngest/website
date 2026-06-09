import ButtonLink from "@/components/v1/ButtonLink";
import StippleCtaSection from "@/components/v1/sections/shared/StippleCtaSection";

/**
 * Page-closing CTA — uses the shared `StippleCtaSection` chrome
 * (same as Pricing/StartForFree). Strings + buttons are the only
 * per-page customisation.
 */

export default function StartBuilding() {
  return (
    <StippleCtaSection
      headingId="bg-jobs-start-heading"
      heading={
        <>
          Build better
          <br />
          apps today
        </>
      }
      body={
        <>
          Add Inngest to your project in minutes.
          <br className="hidden lg:inline" />{" "}
          Free to start, no credit card required.
        </>
      }
    >
      <ButtonLink href="/sign-up?ref=background-jobs" prefetch={false} variant="primary">
        Start Free
      </ButtonLink>
      <ButtonLink href="/docs/quick-start?ref=background-jobs" variant="secondary">
        Quick start guide →
      </ButtonLink>
    </StippleCtaSection>
  );
}
