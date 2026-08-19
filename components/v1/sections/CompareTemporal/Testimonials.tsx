import SocialQuotesSection from "@/components/v1/sections/shared/SocialQuotesSection";

/**
 * "Teams that chose Inngest over Temporal" — third-party quotes that
 * mention Temporal or DX vs Temporal, not the generic home carousel.
 */
export default function CompareTemporalTestimonials() {
  return (
    <SocialQuotesSection
      headingId="ct-testimonials-heading"
      title="Teams comparing Inngest and Temporal"
      description="Developers on UX, DX, and why they switched from hand-rolled queues or Temporal-style orchestration."
      quoteIds={[
        "posthog-temporal-ux",
        "claire-temporal-dx",
        "skylar-temporal-dx",
      ]}
      columns={3}
      refTag="compare-to-temporal"
    />
  );
}
