import PageShell from "@/components/v1/PageShell";
import ComparisonTable from "@/components/v1/sections/Pricing/ComparisonTable";
import Faq from "@/components/v1/sections/Pricing/Faq";
import Hero from "@/components/v1/sections/Pricing/Hero";
import HowItWorks from "@/components/v1/sections/Pricing/HowItWorks";
import PricingCalculator from "@/components/v1/sections/Pricing/PricingCalculator";
import StartForFree from "@/components/v1/sections/Pricing/StartForFree";
import TrustedInBigLeagues from "@/components/v1/sections/Pricing/TrustedInBigLeagues";

export default function Pricing() {
  return (
    <PageShell>
      <link
        rel="preload"
        as="image"
        href="/assets/v1/page/.compressed/grain-bg.webp"
        type="image/webp"
        fetchPriority="high"
      />
      <div className="overflow-x-clip">
        <Hero />
        <PricingCalculator />
        <ComparisonTable />
        <TrustedInBigLeagues />
        <HowItWorks />
        <Faq />
        <StartForFree />
      </div>
    </PageShell>
  );
}
