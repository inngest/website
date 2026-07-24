import Testimonials from "@/components/v1/sections/shared/Testimonials";
import { HOME_TESTIMONIAL_SLIDES } from "@/components/v1/sections/shared/testimonialSlides";

// Webhooks page testimonial rail — same slide deck (Otto / Outtake /
// Day.ai) and config as the home page Customers rail:
// uniform-direction swipes (always-left), no byline cascade stagger,
// and no portrait paint-bar reveal.
export default function WebhooksEventsTestimonials() {
  return (
    <Testimonials
      slides={HOME_TESTIMONIAL_SLIDES}
      directionMode="always-left"
      bylineStaggerMs={0}
      disablePortraitReveal
      className="px-6 py-20 sm:px-9 lg:px-8 lg:py-[140px]"
    />
  );
}
