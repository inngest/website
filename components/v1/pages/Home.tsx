import PageShell from "@/components/v1/PageShell";
import CapabilityRows, {
  CapabilitiesHeading,
} from "@/components/v1/sections/Home/CapabilityRows";
import BluePixelBand from "@/components/v1/sections/Home/BluePixelBand";
import Customers from "@/components/v1/sections/Home/Customers";
import Hero from "@/components/v1/sections/Home/Hero";
import ItDoesntHaveToBeHard from "@/components/v1/sections/Home/ItDoesntHaveToBeHard";
import LogoMarquee from "@/components/v1/sections/Home/LogoMarquee";
import LogoStrip from "@/components/v1/sections/Home/LogoStrip";
import Quote from "@/components/v1/sections/Home/Quote";
import StartBuilding from "@/components/v1/sections/Home/StartBuilding";
import TrustedInBigLeagues from "@/components/v1/sections/Home/TrustedInBigLeagues";
import UseCaseBand from "@/components/v1/sections/Home/UseCaseBand";

export default function Home() {
  return (
    <PageShell>
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
      <div className="home-desktop-7">
        {/* The hero image lightens toward the logos; the page grain
            darkens away from the top. Their meeting point is the seam
            above the logo strip. The layer is pulled through the
            frame's padding and the gap so that edge lands on the strip. */}
        <div className="relative w-full">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-10 bottom-[-3rem] left-1/2 z-0 w-screen -translate-x-1/2 bg-cover bg-center bg-no-repeat bg-[url(/assets/v1/hero/.compressed/inngest-hero-mobile.avif)] lg:-top-20 lg:bottom-[-6rem] lg:bg-[url(/assets/v1/hero/.compressed/inngest-hero.avif?v=3)]"
          />
          <div className="relative z-10">
            <Hero />
          </div>
        </div>
        <div className="relative z-10 -mx-6 w-[calc(100%+3rem)] lg:-mx-8 lg:w-[calc(100%+4rem)]">
          <LogoStrip contained />
        </div>
        <div className="relative flex w-full flex-col items-center gap-12 lg:gap-24">
          <div className="relative w-full">
            <Quote />
            <BluePixelBand />
          </div>
          <CapabilitiesHeading />
        </div>
        <CapabilityRows />
      </div>
      <Customers />
      <UseCaseBand />
      <ItDoesntHaveToBeHard />
      <TrustedInBigLeagues />
      <StartBuilding />
      <LogoMarquee />
    </PageShell>
  );
}
