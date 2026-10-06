import ButtonLink from "@/components/v1/ButtonLink";
import StippleCtaSection from "@/components/v1/sections/shared/StippleCtaSection";

const SIGNUP_URL = "/sign-up?ref=sandboxes-final";

export default function FinalCTA() {
  return (
    <StippleCtaSection
      headingId="sandboxes-final-cta-heading"
      heading="Give the code somewhere to run."
      body="Sandboxes are in open beta. Create one from a function and it shows up on the trace beside every other step."
      containerClassName="max-w-[1100px]"
      bodyClassName="max-w-[420px]"
    >
      <ButtonLink href={SIGNUP_URL} variant="primary">
        Start free
      </ButtonLink>
    </StippleCtaSection>
  );
}
