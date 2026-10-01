import PageShell from "@/components/v1/PageShell";
import ButtonLink from "@/components/v1/ButtonLink";
import StippleCtaSection from "@/components/v1/sections/shared/StippleCtaSection";
import Hero from "@/components/v1/sections/CodeTV/Hero";
import Marquee from "@/components/v1/sections/CodeTV/Marquee";
import Prizes from "@/components/v1/sections/CodeTV/Prizes";
import Watch from "@/components/v1/sections/CodeTV/Watch";
import HowItKeepsRunning from "@/components/v1/sections/CodeTV/HowItKeepsRunning";
import ResourceKit from "@/components/v1/sections/CodeTV/ResourceKit";
import Teams from "@/components/v1/sections/CodeTV/Teams";
import Gallery from "@/components/v1/sections/CodeTV/Gallery";
import { appendRef } from "@/utils/v1/ref";
import {
  PAGE_REF,
  SUBMIT_APP_HREF,
} from "@/components/v1/sections/CodeTV/data";
import { V1_SECTION_PADDING_Y_COMPACT } from "@/components/v1/sections/shared/sectionShell";

export default function CodeTVWebDevChallenge() {
  return (
    <PageShell>
      <Hero />
      <Marquee />
      <Watch />
      <Teams />
      <Prizes />
      <ResourceKit />
      <HowItKeepsRunning />
      <Gallery />
      <StippleCtaSection
        headingId="codetv-cta-heading"
        heading="Build the thing that keeps going."
        body="Write the function. Walk away. Inngest keeps the work running — through a crash, after an event, while you're off doing something else."
        footnote="Free tier · No workers to babysit"
        containerClassName="max-w-[780px]"
        className={V1_SECTION_PADDING_Y_COMPACT}
      >
        <ButtonLink
          href={SUBMIT_APP_HREF}
          variant="accent"
          target="_blank"
          rel="noreferrer"
          prefetch={false}
        >
          Submit your app
        </ButtonLink>
        <ButtonLink
          href={appendRef("/sign-up", `${PAGE_REF}-cta`)}
          prefetch={false}
          variant="secondary"
        >
          Start building free
        </ButtonLink>
        <ButtonLink href="#resource-kit" variant="secondary">
          Go to the Resource Kit
        </ButtonLink>
      </StippleCtaSection>
    </PageShell>
  );
}
