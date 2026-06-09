import ButtonLink from "@/components/v1/ButtonLink";
import StippleCtaSection from "@/components/v1/sections/shared/StippleCtaSection";

export default function CTA() {
  return (
    <StippleCtaSection
      headingId="customers-cta-heading"
      heading="Build better agents today"
      body={
        <>
          Add Inngest to your project in minutes.
          <br className="hidden lg:inline" />{" "}
          Free to start, no credit card required.
        </>
      }
    >
      <ButtonLink href="/sign-up?ref=customers" variant="primary">
        Create free account
      </ButtonLink>
      <ButtonLink
        href="/docs/getting-started/nextjs-quick-start?ref=customers"
        variant="secondary"
      >
        Quick start guide →
      </ButtonLink>
    </StippleCtaSection>
  );
}
