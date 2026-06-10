import ButtonLink from "@/components/v1/ButtonLink";
import StippleCtaSection from "@/components/v1/sections/shared/StippleCtaSection";

const SIGNUP_URL = "/sign-up?ref=durable-execution-final";
const QUICKSTART_URL = "/docs/quick-start?ref=durable-execution-final";

export default function FinalCTA() {
  return (
    <StippleCtaSection
      headingId="de-final-cta-heading"
      heading="Stop building infrastructure around your infrastructure."
      body="Add durability to any function in minutes. Works with your existing code, wherever it runs."
      containerClassName="max-w-[1100px]"
    >
      <ButtonLink href={SIGNUP_URL} variant="primary">
        Start Free
      </ButtonLink>
      <ButtonLink href={QUICKSTART_URL} variant="secondary">
        Quick Start Guide
      </ButtonLink>
    </StippleCtaSection>
  );
}
