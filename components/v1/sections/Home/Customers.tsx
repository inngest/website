import Testimonials from "@/components/v1/sections/shared/Testimonials";
import { HOME_TESTIMONIAL_SLIDES } from "@/components/v1/sections/shared/testimonialSlides";

/**
 * Home page testimonials section — the shared carousel with the home
 * slide deck and the brand-mark watermark backdrop. Padding is tighter
 * than the shared default: it sits between two dense sections, so the
 * full rhythm would leave the rail floating.
 */
export default function Customers() {
  return (
    <Testimonials
      slides={HOME_TESTIMONIAL_SLIDES}
      title="Stories from production"
      body="Inngest is for any human or agent that wants to focus on what code does, not how it fails."
      watermark
      compact
      portraitClassName="sm:mx-auto sm:max-w-[clamp(180px,19vw,280px)]"
      className="px-6 pb-12 pt-10 lg:px-8 lg:pb-16 lg:pt-12"
    />
  );
}
