import PageShell from "@/components/v1/PageShell";
import Hero from "@/components/v1/sections/CompareTemporal/Hero";
import LogoStrip from "@/components/v1/sections/Home/LogoStrip";
import WhyChoose from "@/components/v1/sections/CompareTemporal/WhyChoose";
import CodeComparison from "@/components/v1/sections/CompareTemporal/CodeComparison";
import FeatureComparison from "@/components/v1/sections/CompareTemporal/FeatureComparison";
import DesignedForAI from "@/components/v1/sections/CompareTemporal/DesignedForAI";
import Testimonials from "@/components/v1/sections/CompareTemporal/Testimonials";
import MissionCritical from "@/components/v1/sections/CompareTemporal/MissionCritical";
import CtaBand from "@/components/v1/sections/CompareTemporal/CtaBand";
import Faq from "@/components/v1/sections/CompareTemporal/Faq";
import FinalCta from "@/components/v1/sections/CompareTemporal/FinalCta";

/**
 * /compare-to-temporal — the v1 redesign of the "Inngest vs
 * Temporal" comparison landing page. Built entirely from the v1
 * component library (see components/v1/sections/CompareTemporal/ plus
 * reused shared/Home sections). The live page at
 * app/(landing-pages)/compare-to-temporal still uses the legacy
 * LandingPage components and is left untouched until we swap.
 */
export default function CompareToTemporal() {
  return (
    <PageShell>
      <link
        rel="preload"
        as="image"
        href="/assets/v1/page/.compressed/grain-bg.webp"
        type="image/webp"
        fetchPriority="high"
      />
      <div data-wcag-cta className="overflow-x-clip">
        {/* Sections land here, top → bottom:
            Hero · LogoStrip · WhyChoose (3 cards) · CodeComparison ·
            FeatureComparison · DesignedForAI · Testimonials ·
            MissionCritical · CtaBand · Faq · FinalCta */}
        <Hero />
        <LogoStrip />
        <WhyChoose />
        <CodeComparison />
        <FeatureComparison />
        <DesignedForAI />
        <Testimonials />
        <MissionCritical />
        <CtaBand />
        <Faq />
        <FinalCta />
      </div>
    </PageShell>
  );
}
