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
        {/* Same opening as the live homepage: the hero image covers the
            first screen and the page grain continues from the logo row. */}
        <div className="relative -mx-6 -mt-10 w-[calc(100%+3rem)] lg:-mx-8 lg:-mt-20 lg:w-[calc(100%+4rem)]">
          <div className="relative min-h-svh">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-1/2 z-0 w-screen -translate-x-1/2 bg-[url(/assets/v1/hero/.compressed/inngest-hero-mobile.avif)] bg-cover bg-center bg-no-repeat lg:bg-[url(/assets/v1/hero/.compressed/inngest-hero.avif?v=3)]"
            />
            <div className="relative z-10 mx-auto flex h-full w-full max-w-[1440px] flex-col items-center px-6 pt-10 lg:px-8 lg:pt-20">
              <Hero />
            </div>
          </div>
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
