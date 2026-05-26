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

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Inngest",
    url: "https://www.inngest.com",
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Inngest",
    url: "https://www.inngest.com",
    logo: "https://www.inngest.com/logo-with-icon-white.svg",
    sameAs: [
      "https://twitter.com/inngest",
      "https://github.com/inngest",
      "https://www.linkedin.com/company/inngest",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Inngest",
    url: "https://www.inngest.com",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    description:
      "Inngest's durable functions replace queues, state management, and scheduling to enable any developer to write reliable, multi-step code faster without touching infrastructure.",
    featureList: [
      "Durable execution with automatic retries",
      "Event-driven workflow triggers",
      "Step functions with pause and resume",
      "AI agent orchestration with human-in-the-loop",
      "Concurrency, throttling, and rate limiting",
      "Real-time observability and replay",
      "Serverless, server, and edge compatible",
    ],
    programmingLanguage: ["TypeScript", "JavaScript", "Python", "Go"],
    screenshot: "https://www.inngest.com/assets/homepage/open-graph-june-2025.png",
    sameAs: [
      "https://github.com/inngest/inngest",
      "https://twitter.com/inngest",
    ],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free tier available, no credit card required.",
      url: "https://www.inngest.com/pricing",
    },
  },
];

export default function Page() {
  return (
    <div className="bg-stone-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
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
