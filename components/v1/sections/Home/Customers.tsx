import Testimonials from "@/components/v1/sections/shared/Testimonials";
import { HOME_SECTION_TITLE } from "@/components/v1/sections/shared/sectionTitle";
import { HOME_TESTIMONIAL_SLIDES } from "@/components/v1/sections/shared/testimonialSlides";

/**
 * Home page testimonials section — the shared carousel with the home
 * slide deck and the brand-mark watermark backdrop, on the standard
 * section rhythm. The title/body start at the quote column so they
 * align with the logos and quote, and the portrait fills its column.
 */
export default function Customers() {
  return (
    <Testimonials
      slides={HOME_TESTIMONIAL_SLIDES}
      title="Stories from production"
      titleClassName={HOME_SECTION_TITLE}
      body="Inngest is for any human or agent that wants to focus on what code does, not how it fails."
      watermark
      compact
      alignHeadingToQuote
      // Let the portrait fill its grid column (the shared Portrait caps
      // itself at 332px otherwise), so it carries the same visual
      // weight as the quote beside it.
      portraitClassName="sm:max-w-none"
    />
  );
}
