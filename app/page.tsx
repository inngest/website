import { type Metadata } from "next";

import Footer from "src/components/RedesignedLanding/Footer";
import { generateMetadata } from "src/utils/social";
import Hero2 from "../components/RedesignedLanding/Hero";
import TestimonialCarousel from "src/components/RedesignedLanding/TestimonialCarousel";
import Testimonial from "src/components/RedesignedLanding/Testimonial";
import TrustFeaturesSection from "src/components/RedesignedLanding/Trust";
import OrchestrationSection from "src/components/RedesignedLanding/FeatureOverview";

export const metadata: Metadata = generateMetadata({
  title: "AI and backend workflows, orchestrated at any scale",
  description:
    "Inngest's durable functions replace queues, state management, and scheduling to enable any developer to write reliable, multi-step code faster without touching infrastructure.",
  image: "/assets/homepage/open-graph.png",
});

export default function Page() {
  return (
    <div>
      <Hero2 />
      <OrchestrationSection />
      <TrustFeaturesSection />
      <Testimonial />
      <TestimonialCarousel />
      <Footer />
    </div>
  );
}
