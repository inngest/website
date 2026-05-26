import { type Metadata } from "next";

import PlanCard from "src/components/RedesignedPricing/PlanCard";
import { PricingCalculatorPage } from "src/components/RedesignedPricing/PricingCalculator";
import { generateMetadata } from "src/utils/social";

import {
  FEATURES,
  PLANS,
  sections,
  PLAN_NAMES,
} from "src/components/RedesignedPricing/plans";

import GridBackground from "src/components/RedesignedLanding/GridBackground";
import ComparisonTable from "src/components/RedesignedPricing/ComparisonTable";
import PaygCard from "src/components/RedesignedPricing/PaygCard";
import PricingTestimonial from "src/components/RedesignedPricing/PricingTestimonial";
import PricingTrustSection from "src/components/RedesignedPricing/PricingTrust";
import PricingTitle from "src/components/RedesignedPricing/Title";

export const metadata: Metadata = generateMetadata({
  title: "Pricing",
  description:
    "Pricing plans that scale with you, from our Free Tier all the way to custom Enterprise pricing.",
});

const HOST = "https://www.inngest.com";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Inngest Pricing",
  description:
    "Pricing plans that scale with you, from our Free Tier all the way to custom Enterprise pricing.",
  url: `${HOST}/pricing`,
  publisher: {
    "@type": "Organization",
    name: "Inngest",
    url: HOST,
  },
  mainEntity: [
    {
      "@type": "Offer",
      name: "Hobby",
      description:
        "Get started with modern durable execution for free, no credit card required.",
      price: "0",
      priceCurrency: "USD",
      url: `${HOST}/pricing`,
    },
    {
      "@type": "Offer",
      name: "Pro",
      description:
        "The metrics and concurrency you need for early stage production products.",
      price: "75",
      priceCurrency: "USD",
      url: `${HOST}/pricing`,
    },
    {
      "@type": "Offer",
      name: "Enterprise",
      description:
        "Ensure reliability at scale, with advanced recovery and dedicated support.",
      url: `${HOST}/contact`,
    },
  ],
};

export default function Pricing() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="max-w-screen relative">
        <GridBackground />
        <div className="relative">
          <PricingTitle />
          <div className="z-10 mx-auto mb-8 grid max-w-[1222px] grid-cols-1 gap-2 text-center md:grid-cols-2 lg:grid-cols-3 lg:gap-x-0">
            {PLANS.filter((p) => p.hideFromCards !== true).map((p, idx) => (
              <PlanCard
                key={p.name}
                content={p}
                idx={idx}
                total={PLANS.length}
              />
            ))}
          </div>
          <PaygCard />
          <PricingCalculatorPage />
          <PricingTestimonial />
          <ComparisonTable
            plans={PLANS.filter((p) => p.name !== PLAN_NAMES.payAsYouGo)}
            features={FEATURES}
            sections={sections}
          />
          <div className="py-16 md:py-24">
            <PricingTrustSection />
          </div>
        </div>
      </div>
    </>
  );
}
