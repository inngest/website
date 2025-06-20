import { type Metadata } from "next";
import AccordionSection from "src/components/RedesignedLanding/AccordionSection";

import { generateMetadata } from "src/utils/social";
import Hero from "../components/RedesignedLanding/Hero";
import Testimonial from "src/components/RedesignedLanding/Testimonial";
import TestimonialCarousel from "src/components/RedesignedLanding/TestimonialCarousel";
import TrustFeaturesSection from "src/components/RedesignedLanding/Trust";
import OrchestrationSection from "src/components/RedesignedLanding/FeatureOverview";
import FeatureNavigate from "src/components/RedesignedLanding/FeatureNavigate/FeatureNavigate";

export const metadata: Metadata = generateMetadata({
  title: "AI and backend workflows, orchestrated at any scale",
  description:
    "Inngest's durable functions replace queues, state management, and scheduling to enable any developer to write reliable, multi-step code faster without touching infrastructure.",
  image: "/assets/homepage/open-graph-june-2025.png",
});

export default function Page() {
  return (
    <div className="bg-stone-950">
      <Hero />
      <OrchestrationSection />
      <FeatureNavigate />
      <Testimonial />
      <AccordionSection />
      <TrustFeaturesSection />
      <TestimonialCarousel />
    </div>
  );
}
