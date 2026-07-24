import TestimonialsCarousel from "@/components/v1/sections/shared/TestimonialsCarousel";
import { HOME_TESTIMONIAL_SLIDES } from "@/components/v1/sections/shared/testimonialSlides";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import { V1_HEADER_CONTENT_MT } from "@/components/v1/sections/shared/sectionShell";

/**
 * "Teams that chose Inngest over Temporal" — reuses the shared home
 * testimonial deck (Cohere / Outtake / Day.ai), kept in the page's own
 * SectionHeader + carousel chrome so the compare-to-temporal heading
 * and styling stay intact.
 */

// Page-specific section: the compare-to-temporal heading copy differs from
// the standard testimonials title, so this composes the shared SectionHeader
// + carousel directly rather than the shared Testimonials section.
export default function CompareTemporalTestimonials() {
  return (
    <Section
      aria-labelledby="ct-testimonials-heading"
      className="relative"
      containerClassName="flex flex-col"
    >
      <SectionHeader
        id="ct-testimonials-heading"
        titleClassName="lg:max-w-[960px]"
        title="Teams that chose Inngest over Temporal."
      />
      <div className={V1_HEADER_CONTENT_MT}>
        <TestimonialsCarousel
          slides={HOME_TESTIMONIAL_SLIDES}
          portraitClassName="mix-blend-luminosity"
          directionMode="always-left"
          bylineStaggerMs={0}
          disablePortraitReveal
        />
      </div>
    </Section>
  );
}
