import Testimonials from "@/components/v1/sections/shared/Testimonials";
import { type Slide } from "@/components/v1/sections/shared/TestimonialsCarousel";
import { HOME_SECTION_TITLE } from "@/components/v1/sections/shared/sectionTitle";

// Same carousel layout as the homepage "Stories from production" section,
// with quotes from early-stage teams. Quotes are copied word for word from
// the customer stories and testimonials already on the site.
const STARTUP_SLIDES: Slide[] = [
  {
    id: "day-ai",
    label: "Day.ai",
    logo: { src: "/assets/v1/logos/day-ai.svg", width: 159, height: 50 },
    testimonial: {
      quote:
        "Inngest is like the nervous system of Day AI, it makes things reliable by default so we can focus on building.",
      authorName: "Erik Munson",
      authorTitle: "Founding Engineer",
      caseStudyHref: "/customers/day-ai?ref=startups-stories",
      portrait: "/assets/v1/customers/dayai-erik-munson.png",
      portraitAlt: "Erik Munson, Founding Engineer at Day.ai",
    },
  },
  {
    id: "outtake",
    label: "Outtake",
    logo: { src: "/assets/v1/logos/outtake.svg", width: 181, height: 32 },
    testimonial: {
      quote:
        "Inngest gives us fine-grained control over errors, and how they propagate, so we can just focus on what the agents should do, not what to do when they fail.",
      authorName: "Diego Escobedo",
      authorTitle: "Founding Engineer",
      caseStudyHref: "/customers/outtake?ref=startups-stories",
      portrait: "/assets/v1/customers/outtake-diego-escobedo.png",
      portraitAlt: "Diego Escobedo, Founding Engineer at Outtake",
    },
  },
  {
    id: "featured",
    label: "Featured",
    // White lockup from the Featured customer story (1001×206).
    logo: {
      src: "https://cdn.inngest.com/customers/featured/04_Featured_Main%20Logo_White_RGB.png",
      width: 155,
      height: 32,
    },
    testimonial: {
      quote:
        "Inngest helps our trains (workflows) run; without losing sleep or manually shoveling coal into an engine.",
      authorName: "Brett Farmiloe",
      authorTitle: "CTO, Featured",
      caseStudyHref: "/customers/featured?ref=startups-stories",
      // Stippled from the team photo on the Featured customer story.
      portrait: "/assets/v1/customers/featured-brett-farmiloe.webp",
      portraitAlt: "Brett Farmiloe and the Featured team",
    },
  },
];

export default function StartupStories() {
  return (
    <Testimonials
      slides={STARTUP_SLIDES}
      title="Startups building on Inngest"
      titleClassName={HOME_SECTION_TITLE}
      body="Early teams use Inngest to ship reliable products without building the infrastructure underneath."
      watermark
      compact
      alignHeadingToQuote
      portraitClassName="sm:max-w-none"
    />
  );
}
