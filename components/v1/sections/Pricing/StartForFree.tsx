import ButtonLink from "@/components/v1/ButtonLink";
import StippleCtaSection from "@/components/v1/sections/shared/StippleCtaSection";

// "START FOR FREE IN UNDER TWO MINUTES" — uses the shared
// `StippleCtaSection` chrome (animated Inngest-logomark stipple on the
// right rail, headline + body + button row on the left).

const SIGNUP = process.env.NEXT_PUBLIC_SIGNUP_URL ?? "/sign-up";
const CONTACT = "/get-in-touch?ref=pricing-start";

export default function StartForFree() {
  return (
    <StippleCtaSection
      headingId="pricing-start-heading"
      heading="Start for free in under two minutes"
      body="No credit card required."
    >
      <ButtonLink href={CONTACT} variant="primary" wide>
        Talk to Sales
      </ButtonLink>
      <ButtonLink
        href={`${SIGNUP}?ref=pricing-start`}
        variant="secondary"
        wide
      >
        Start Building
      </ButtonLink>
    </StippleCtaSection>
  );
}
