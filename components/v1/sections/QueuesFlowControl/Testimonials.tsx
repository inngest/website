import Testimonials from "@/components/v1/sections/shared/Testimonials";
import { HOME_TESTIMONIAL_SLIDES } from "@/components/v1/sections/shared/testimonialSlides";

// Reuse the home page slide deck verbatim — single source of truth per
// testimonial so updates land everywhere. Uniform-direction swipes, no
// byline stagger, no portrait paint-bar reveal (same as the home rail).
export default function QueuesFlowControlTestimonials() {
  return (
    <Testimonials
      slides={HOME_TESTIMONIAL_SLIDES}
      portraitClassName="mix-blend-luminosity"
      directionMode="always-left"
      bylineStaggerMs={0}
      disablePortraitReveal
    />
  );
}
