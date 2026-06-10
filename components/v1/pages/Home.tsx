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
      {/* Preload the real hero LCP image (a CSS background, so it's
          invisible to the browser's preload scanner). Mobile + desktop
          variants are gated by media so only the matching one fetches. */}
      <link
        rel="preload"
        as="image"
        href="/assets/v1/hero/.compressed/inngest-hero-mobile.avif"
        type="image/avif"
        media="(max-width: 1023px)"
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        href="/assets/v1/hero/.compressed/inngest-hero.avif?v=3"
        type="image/avif"
        media="(min-width: 1024px)"
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
