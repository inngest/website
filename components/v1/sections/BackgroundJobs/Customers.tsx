import Testimonials from "@/components/v1/sections/shared/Testimonials";
import { HOME_TESTIMONIAL_SLIDES } from "@/components/v1/sections/shared/testimonialSlides";
import { V1_SECTION_SHELL } from "@/components/v1/sections/shared/sectionShell";

/**
 * Background-jobs testimonials section — the shared carousel with the
 * home slide deck and the home page's brand-mark watermark layout.
 * Headingless by design. Keeps the dark-canvas treatment
 * (mix-blend-luminosity) since this section sits on canvas-base.
 */
export default function Customers() {
  return (
    <Testimonials
      slides={HOME_TESTIMONIAL_SLIDES}
      watermark
      portraitClassName="mix-blend-luminosity"
      className={V1_SECTION_SHELL}
    />
  );
}
