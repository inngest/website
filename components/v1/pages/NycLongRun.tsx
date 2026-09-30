"use client";

import PageShell from "@/components/v1/PageShell";
import LogoStrip from "@/components/v1/sections/Home/LogoStrip";
import StartBuilding from "@/components/v1/sections/Home/StartBuilding";
import Hero from "@/components/v1/sections/NycLongRun/Hero";
import NycDifference from "@/components/v1/sections/NycLongRun/NycDifference";
import NycUseCases from "@/components/v1/sections/NycLongRun/NycUseCases";
import OnTheGround from "@/components/v1/sections/NycLongRun/OnTheGround";
import NycResources from "@/components/v1/sections/NycLongRun/NycResources";
import { NYC_SECTION_PADDING } from "@/components/v1/sections/NycLongRun/nycHeadings";

/**
 * inngest.com/nyc-long-run — the "Build for the Lonng Run" campaign page
 * behind the New York placements. step.run/nyc points here.
 *
 * Structurally the same as the San Francisco page: hero → the product
 * difference → use cases → quick starts → the city's programming →
 * resources. What differs is the city, its events, and the runner — NYC
 * gets the pizza slice rather than the coffee cup.
 */
export default function NycLongRun() {
  return (
    <PageShell>
      <div className="overflow-x-clip">
        <Hero />
        {/* Customer logos sit directly under the hero, per design — the
            swoosh above bleeds over them. */}
        <LogoStrip contained />
        <NycDifference />
        <NycUseCases />
        <StartBuilding
          refTag="nyc-long-run-start-building"
          title="Start building."
          titleClassName="normal-case"
          className={NYC_SECTION_PADDING}
        />
        <OnTheGround />
        <NycResources />
      </div>
    </PageShell>
  );
}
