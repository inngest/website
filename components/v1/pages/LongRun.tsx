"use client";

import PageShell from "@/components/v1/PageShell";
import LogoStrip from "@/components/v1/sections/Home/LogoStrip";
import StartBuilding from "@/components/v1/sections/LongRun/StartBuilding";
import Hero from "@/components/v1/sections/LongRun/Hero";
import Difference from "@/components/v1/sections/LongRun/Difference";
import UseCases from "@/components/v1/sections/LongRun/UseCases";
import OnTheGround from "@/components/v1/sections/LongRun/OnTheGround";
import Resources from "@/components/v1/sections/LongRun/Resources";
import { LR_SECTION_PADDING } from "@/components/v1/sections/LongRun/headings";

/**
 * inngest.com/long-run — the city-agnostic copy of the "Build for the
 * Lonng Run" campaign page, for the bare step.run domain. Copied from
 * SfLongRun; its sections live in components/v1/sections/LongRun and
 * can change without touching the SF or NYC pages. Images still load
 * from /assets/v1/sf-long-run.
 *
 * Product-led, campaign second: hero → the product difference → use
 * cases → quick starts → the campaign programming → resources.
 *
 * Not indexed yet: the route sends `noindex, nofollow` and is excluded
 * from the sitemap.
 */
export default function LongRun() {
  return (
    <PageShell>
      <div className="overflow-x-clip">
        <Hero />
        {/* Customer logos sit directly under the hero, per design — the
            swoosh above bleeds over them. */}
        <LogoStrip contained />
        <Difference />
        <UseCases />
        <StartBuilding
          refTag="long-run-start-building"
          title="Start building."
          className={LR_SECTION_PADDING}
        />
        <OnTheGround />
        <Resources />
      </div>
    </PageShell>
  );
}
