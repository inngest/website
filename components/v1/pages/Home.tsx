import ButtonLink from "@/components/v1/ButtonLink";
import PageShell from "@/components/v1/PageShell";
import Capabilities from "@/components/v1/sections/Home/CapabilityRows";
import Customers from "@/components/v1/sections/Home/Customers";
import Hero from "@/components/v1/sections/Home/Hero";
import ItDoesntHaveToBeHard from "@/components/v1/sections/Home/ItDoesntHaveToBeHard";
import LogoMarquee from "@/components/v1/sections/Home/LogoMarquee";
import Quote from "@/components/v1/sections/Home/Quote";
import StartBuilding from "@/components/v1/sections/Home/StartBuilding";
import TrustedInBigLeagues from "@/components/v1/sections/Home/TrustedInBigLeagues";
import UseCaseBand from "@/components/v1/sections/Home/UseCaseBand";

/**
 * Homepage composition. Every section after the hero is a standard
 * `<Section>` on the shared 80/96/160 vertical rhythm, so the page
 * reads as a sequence of chapters rather than one long stack. The hero
 * owns the first screen (logo row anchored at the fold); the
 * capabilities chapter carries the page's one full-bleed colour moment.
 */
export default function Home() {
  return (
    <PageShell>
      <Hero />
      <Quote />
      <Capabilities />
      <Customers />
      <UseCaseBand />
      <ItDoesntHaveToBeHard />
      <TrustedInBigLeagues />
      <StartBuilding
        actions={
          <>
            <ButtonLink
              variant="primary"
              href={`${
                process.env.NEXT_PUBLIC_SIGNUP_URL ?? "/sign-up"
              }?ref=homepage-start-building`}
            >
              Start free
            </ButtonLink>
            <ButtonLink
              variant="secondary"
              href="/docs?ref=homepage-start-building"
            >
              Read the docs
            </ButtonLink>
          </>
        }
      />
      <LogoMarquee />
    </PageShell>
  );
}
