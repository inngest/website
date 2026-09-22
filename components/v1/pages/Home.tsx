import PageShell from "@/components/v1/PageShell";
import ButtonLink from "@/components/v1/ButtonLink";
import Customers from "@/components/v1/sections/Home/Customers";
import DurabilityInCode from "@/components/v1/sections/Home/DurabilityInCode";
import Hero from "@/components/v1/sections/Home/Hero";
import HowItWorks from "@/components/v1/sections/Home/HowItWorks";
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
      <section
        aria-label="Dev Server UI preview"
        className="relative h-[420px] bg-v1-jetBlack sm:h-[560px] lg:h-[720px]"
      >
        <iframe
          src="/dev/"
          title="Inngest Dev Server UI preview"
          loading="lazy"
          tabIndex={-1}
          aria-hidden="true"
          className="pointer-events-none h-full w-full border-0"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/25 px-6">
          <ButtonLink href="/dev/" variant="accent">
            Explore the Dev Server UI
          </ButtonLink>
        </div>
      </section>
      <LogoStrip contained />
      <Quote />
      <DurabilityInCode />
      <UseCaseBand />
      <Customers />
      <ItDoesntHaveToBeHard />
      <HowItWorks />
      <TrustedInBigLeagues />
      <StartBuilding />
      <LogoMarquee />
    </PageShell>
  );
}
