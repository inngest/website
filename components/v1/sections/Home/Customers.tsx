import Testimonials, {
  EDGE_TESTIMONIALS_TITLE,
} from "@/components/v1/sections/shared/Testimonials";
import { HOME_TESTIMONIAL_SLIDES } from "@/components/v1/sections/shared/testimonialSlides";

/**
 * Home page testimonials section — the shared carousel with the home
 * slide deck, the "For humans and agents…" title, and the brand-mark
 * watermark backdrop.
 */
export default function Customers() {
  return (
    <Testimonials
      slides={HOME_TESTIMONIAL_SLIDES}
      watermark
      title={EDGE_TESTIMONIALS_TITLE}
      className="px-6 pb-[130px] pt-20 lg:px-8 lg:pb-40"
    />
  );
}
