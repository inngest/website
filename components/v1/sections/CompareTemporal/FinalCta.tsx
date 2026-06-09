import ButtonLink from "@/components/v1/ButtonLink";
import StippleCtaSection from "@/components/v1/sections/shared/StippleCtaSection";

/**
 * Page-closing CTA — reuses the shared StippleCtaSection chrome
 * (animated Inngest-logomark stipple watermark), same as
 * Pricing/StartForFree and BackgroundJobs/StartBuilding. Only the
 * strings + buttons are page-specific.
 */
export default function FinalCta() {
  return (
    <StippleCtaSection
      headingId="ct-final-cta-heading"
      // Display lockup breaks after "functions", with the left rail wide
      // enough that line 1 stays on one line and the looser 1.25
      // line-height + 42px stack gap of the design.
      containerClassName="lg:max-w-none lg:gap-[42px]"
      headingClassName="lg:leading-[1.25]"
      heading={
        <>
          Build durable functions
          <br /> in minutes, not weeks.
        </>
      }
      body={
        <>
          No workers to deploy. No queues to configure.
          <br /> Connect Inngest to your existing codebase and ship your first
          durable function today.
        </>
      }
      bodyClassName="max-w-[480px] text-v1-frost"
      footnote="No credit card required · Free tier · Deploy in minutes"
    >
      <ButtonLink
        href="/sign-up?ref=compare-to-temporal-final"
        prefetch={false}
        variant="primary"
        className="max-sm:!min-w-0 max-sm:!flex-1"
      >
        Start building free
      </ButtonLink>
      <ButtonLink
        href="/docs?ref=compare-to-temporal-final"
        variant="secondary"
        className="max-sm:!min-w-0 max-sm:!flex-1"
      >
        Read the docs
      </ButtonLink>
    </StippleCtaSection>
  );
}
