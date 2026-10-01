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
      <div className="home-desktop-7">
        <div className="flex w-full flex-col gap-6 lg:gap-8">
          <Hero />
          <div className="-mx-6 w-[calc(100%+3rem)] lg:-mx-8 lg:w-[calc(100%+4rem)]">
            <LogoStrip contained />
          </div>
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
