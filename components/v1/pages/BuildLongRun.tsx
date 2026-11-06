"use client";

import PageShell from "@/components/v1/PageShell";
import LogoStrip from "@/components/v1/sections/Home/LogoStrip";
import StartBuilding from "@/components/v1/sections/Home/StartBuilding";
import Hero from "@/components/v1/sections/BuildLongRun/Hero";
import BuildDifference from "@/components/v1/sections/BuildLongRun/BuildDifference";
import BuildUseCases from "@/components/v1/sections/BuildLongRun/BuildUseCases";
import OnTheGround from "@/components/v1/sections/BuildLongRun/OnTheGround";
import BuildResources from "@/components/v1/sections/BuildLongRun/BuildResources";
import { BUILD_SECTION_PADDING } from "@/components/v1/sections/BuildLongRun/buildHeadings";

/**
 * inngest.com/build-long-run — the "Build for the Lonng Run" campaign page
 * behind the San Francisco placements. step.run/sf points here.
 *
 * Product-led, campaign second: hero → the product difference → use
 * cases → quick starts → the San Francisco programming → resources.
 *
 * Live but unlisted. The route sends `noindex, nofollow`, is excluded
 * from the sitemap, and nothing on the site links to it, so the only
 * way in is the URL on a poster.
 */
export default function BuildLongRun() {
  return (
    <PageShell>
      <div className="overflow-x-clip">
        <Hero />
        {/* Customer logos sit directly under the hero, per design — the
            swoosh above bleeds over them. */}
        <LogoStrip contained />
        <BuildDifference />
        <BuildUseCases />
        <StartBuilding
          refTag="build-long-run-start-building"
          title="Start building."
          titleClassName="normal-case"
          className={BUILD_SECTION_PADDING}
        />
        <OnTheGround />
        <BuildResources />
      </div>
    </PageShell>
  );
}
