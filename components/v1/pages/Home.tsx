import PageShell from "@/components/v1/PageShell";
import Customers from "@/components/v1/sections/Home/Customers";
import FeatureCards from "@/components/v1/sections/Home/FeatureCards";
import Hero from "@/components/v1/sections/Home/Hero";
import HowItWorks from "@/components/v1/sections/Home/HowItWorks";
import ItDoesntHaveToBeHard from "@/components/v1/sections/Home/ItDoesntHaveToBeHard";
import LogoMarquee from "@/components/v1/sections/Home/LogoMarquee";
import LogoStrip from "@/components/v1/sections/Home/LogoStrip";
import Quote from "@/components/v1/sections/Home/Quote";
import ScaleInstantly from "@/components/v1/sections/Home/ScaleInstantly";
import StartBuilding from "@/components/v1/sections/Home/StartBuilding";
import TrustedInBigLeagues from "@/components/v1/sections/Home/TrustedInBigLeagues";

export default function Home() {
  return (
    <PageShell>
      {/* Preload the LCP-critical grain so it starts fetching alongside
          the HTML — eliminates the black flash before the bg paints. */}
      <link
        rel="preload"
        as="image"
        href="/assets/v1/page/.compressed/grain-bg.webp"
        type="image/webp"
        fetchPriority="high"
      />
      <Hero />
      <LogoStrip contained />
      <Quote />
      <FeatureCards />
      <ScaleInstantly />
      <Customers />
      <ItDoesntHaveToBeHard />
      <HowItWorks />
      <TrustedInBigLeagues />
      <StartBuilding />
      <LogoMarquee />
    </PageShell>
  );
}
