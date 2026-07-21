import ButtonLink from "@/components/v1/ButtonLink";
import StippleCtaSection from "@/components/v1/sections/shared/StippleCtaSection";

// Below-the-fold CTA. On the legacy /yc page this came for free from the
// global `FooterCTA` baked into the v0 footer ("In the middle of chaos" /
// "Develop reliable AI products, every time" / Let's Talk / docs link).
// v1 pages don't inherit that banner, so it's ported explicitly here with
// the shared `StippleCtaSection` chrome, keeping the same copy and links.
export default function BottomCta() {
  return (
    <StippleCtaSection
      headingId="yc-cta-heading"
      heading="Develop reliable AI products, every time."
      body="Talk to our team about running reliable AI products at scale — or dive into the docs yourself."
    >
      <ButtonLink href="/contact?ref=yc-footer-cta" variant="primary" wide>
        Let's Talk
      </ButtonLink>
      <ButtonLink href="/docs?ref=yc-footer-cta" variant="secondary" wide>
        Read our docs
      </ButtonLink>
    </StippleCtaSection>
  );
}
