import ButtonLink from "@/components/v1/ButtonLink";
import StippleCtaSection from "@/components/v1/sections/shared/StippleCtaSection";

// "Graduate from queues today." Reuses the shared stippled-logomark
// CTA chrome (also used by Observability + Pricing) so the page-closing
// CTA stays consistent across surfaces.

const SIGNUP_URL = "/sign-up?ref=queues-flow-control";
const QUICK_START_URL = "/docs/quick-start?ref=queues-flow-control";

export default function FinalCta() {
  return (
    <StippleCtaSection
      headingId="qfc-final-cta-heading"
      heading={
        <>
          Graduate from
          <span aria-hidden="true" className="hidden sm:inline">
            <br />
          </span>{" "}
          queues today.
        </>
      }
      body={
        <>
          Add Inngest to your project in minutes.
          <span aria-hidden="true" className="hidden sm:inline">
            <br />
          </span>{" "}
          Free to start, no credit card required.
        </>
      }
    >
      <ButtonLink href={SIGNUP_URL} variant="primary">
        Start Free
      </ButtonLink>
      <ButtonLink href={QUICK_START_URL} variant="secondary">
        Quick start guide →
      </ButtonLink>
    </StippleCtaSection>
  );
}
