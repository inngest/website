import { type Metadata } from "next";

import PlanCard from "src/components/RedesignedPricing/PlanCard";
import PricingCalculator, {
  PricingCalculatorPage,
} from "src/components/RedesignedPricing/PricingCalculator";
import { generateMetadata } from "src/utils/social";

import {
  FEATURES,
  PLANS,
  sections,
} from "src/components/RedesignedPricing/plans";

import GridBackground from "src/components/RedesignedLanding/GridBackground";
import ComparisonTable from "src/components/RedesignedPricing/ComparisonTable";
import PaygCard from "src/components/RedesignedPricing/PaygCard";
import PricingFooter from "src/components/RedesignedPricing/PricingFooter";
import PricingTestimonial from "src/components/RedesignedPricing/PricingTestimonial";
import PricingTrustSection from "src/components/RedesignedPricing/PricingTrust";
import PricingTitle from "src/components/RedesignedPricing/Title";

export const metadata: Metadata = generateMetadata({
  title: "Pricing",
  description:
    "Pricing plans that scale with you, from our Free Tier all the way to custom Enterprise pricing.",
});

export default function Pricing() {
  return (
    <>
      <div className="max-w-screen">
        <GridBackground />
        <PricingTitle />
        <div className="z-10 mx-auto mb-8 grid max-w-[1222px] grid-cols-1 gap-2 text-center md:grid-cols-2 lg:grid-cols-3 lg:gap-x-0">
          {PLANS.filter((p) => p.hideFromCards !== true).map((p, idx) => (
            <PlanCard key={p.name} content={p} idx={idx} total={PLANS.length} />
          ))}
        </div>
        <PaygCard />
        <PricingCalculator plans={PLANS} />
        <PricingCalculatorPage />
        <PricingTestimonial />
        <ComparisonTable
          plans={PLANS}
          features={FEATURES}
          sections={sections}
        />
        <PricingTrustSection />
        <PricingFooter />
      </div>
    </>
  );
}
