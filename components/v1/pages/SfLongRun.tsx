"use client";

import PageShell from "@/components/v1/PageShell";
import LogoStrip from "@/components/v1/sections/Home/LogoStrip";
import StartBuilding from "@/components/v1/sections/Home/StartBuilding";
import Hero from "@/components/v1/sections/SfLongRun/Hero";
import SfDifference from "@/components/v1/sections/SfLongRun/SfDifference";
import SfUseCases from "@/components/v1/sections/SfLongRun/SfUseCases";
import OnTheGround from "@/components/v1/sections/SfLongRun/OnTheGround";
import SfResources from "@/components/v1/sections/SfLongRun/SfResources";
import { SF_SECTION_PADDING } from "@/components/v1/sections/SfLongRun/sfHeadings";

/**
 * inngest.com/sf-long-run — the "Build for the long run" campaign page
 * behind the San Francisco placements. step.run/sf points here.
 *
 * Product-led, campaign second: hero → the product difference → use
 * cases → quick starts → the San Francisco programming → resources.
 *
 * Live but unlisted. The route sends `noindex, nofollow`, is excluded
 * from the sitemap, and nothing on the site links to it, so the only
 * way in is the URL on a poster.
 */
export default function SfLongRun() {
  return (
    <PageShell>
      <div className="overflow-x-clip">
        <Hero />
        {/* Customer logos sit directly under the hero, per design — the
            swoosh above bleeds over them. */}
        <LogoStrip contained />
        <SfDifference />
        <SfUseCases />
        <StartBuilding
          refTag="sf-long-run-start-building"
          title="Start building."
          titleClassName="normal-case"
          className={SF_SECTION_PADDING}
        />
        <OnTheGround />
        <SfResources />
      </div>
    </PageShell>
  );
}
