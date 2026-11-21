import ButtonLink from "@/components/v1/ButtonLink";
import StippleCtaSection from "@/components/v1/sections/shared/StippleCtaSection";

// Same closing CTA as /yc, with startups ref tags.
export default function BottomCta() {
  return (
    <StippleCtaSection
      headingId="startups-cta-heading"
      heading="Develop reliable AI products, every time."
      body="Talk to our team about running reliable AI products at scale, or dive into the docs yourself."
    >
      <ButtonLink
        href="/contact?ref=startups-footer-cta"
        variant="primary"
        wide
      >
        Let's Talk
      </ButtonLink>
      <ButtonLink href="/docs?ref=startups-footer-cta" variant="secondary" wide>
        Read our docs
      </ButtonLink>
    </StippleCtaSection>
  );
}
