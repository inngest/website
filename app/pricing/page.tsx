import { type Metadata } from "next";
import dynamic from "next/dynamic";

import { generateMetadata } from "src/utils/social";
import PlanCard from "src/shared/Pricing/PlanCard";
import CaseStudies from "src/shared/Pricing/CaseStudies";
import { Button } from "src/shared/Button";
import PricingCalculator from "./PricingCalculator";

import { PLANS, FEATURES, sections } from "./plans";

// Disable SSR in ComparisonTable, to prevent hydration errors. It requires windows info on accordions
const ComparisonTable = dynamic(
  () => import("src/shared/Pricing/ComparisonTable"),
  {
    ssr: false,
  }
);

export const metadata: Metadata = generateMetadata({
  title: "Pricing",
  description:
    "Pricing plans that scale with you, from our Free Tier all the way to custom Enterprise pricing.",
});

export default function Pricing() {
  return (
    <div
      className="font-sans bg-canvasBase text-basis"
      style={{
        backgroundImage:
          "radial-gradient(#2C9B63, rgba(0,0,0,0.0) 80%, rgba(0,0,0,0.0))",
        backgroundSize: "1000px 1000px",
        backgroundPosition: "center 120px",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* <Header /> */}
      <div className="max-w-container-desktop m-auto px-4 md:px-6 lg:px-8 text-center">
        <h1 className="text-3xl lg:text-6xl text-basis mt-8 md:mt-20 mb-4 md:mb-16 font-bold lg:font-black tracking-tight text-balance">
          Simple pricing that scales with you
        </h1>
        <p className="text-base lg:text-xl text-basis mb-8 md:mb-24 text-balance">
          From early-stage startups to scaling enterprises, Inngest has you
          covered. Get started for free today.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2 xl:gap-4 xl:gap-x-0 text-center mb-8">
          {PLANS.filter((p) => p.hideFromCards !== true).map((p, idx) => (
            <PlanCard key={p.name} content={p} idx={idx} total={PLANS.length} />
          ))}
        </div>
        <PricingCalculator plans={PLANS} />
        <CaseStudies />

        <ComparisonTable
          plans={PLANS}
          features={FEATURES}
          sections={sections}
        />
      </div>
      <div
        className="text-center py-24"
        style={{
          backgroundImage: "url(/assets/pricing/blob.svg)",
          backgroundPosition: "center 40%",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <p className="text-2xl lg:text-3xl font-bold mb-12">
          Need help deciding which plan to choose?
        </p>
        <Button href="/contact?ref=pricing-help" variant="dark">
          Let's talk
        </Button>
      </div>

      {/* <Footer disableCta /> */}
    </div>
  );
}
