import ButtonLink from "@/components/v1/ButtonLink";
import StippleCtaSection from "@/components/v1/sections/shared/StippleCtaSection";

// "Stop building infrastructure around your infrastructure."
// Reuses the shared StippleCtaSection chrome (stippled Inngest-logomark
// watermark + headline/body/button row) the Pricing and BackgroundJobs
// pages also use, so the page-closing CTA stays consistent across surfaces.

const SIGNUP_URL = "/sign-up?ref=observability-final";
const CONTACT_URL = "/get-in-touch?ref=observability-final";

export default function FinalCTA() {
  return (
    <StippleCtaSection
      headingId="ob-final-cta-heading"
      heading="Stop building infrastructure around your infrastructure."
      body="Add observability to any function in minutes. Works with your existing code, wherever it runs."
      containerClassName="max-w-[1100px]"
      bodyClassName="max-w-[391px]"
    >
      <ButtonLink href={SIGNUP_URL} variant="primary">
        Create free account
      </ButtonLink>
      <ButtonLink href={CONTACT_URL} variant="secondary">
        Talk to the team
      </ButtonLink>
    </StippleCtaSection>
  );
}
