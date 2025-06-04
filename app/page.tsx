import { type Metadata } from "next";

import FeatureOverview from "src/components/RedesignedLanding/FeatureOverview";
import FlowAccordion from "src/components/RedesignedLanding/FlowAccoridion/FlowControl";
import GridBackground from "src/components/RedesignedLanding/GridBackground";
import RecoveryAccordion from "src/components/RedesignedLanding/RecoveryAccoridion/RecoveryTools";
import { generateMetadata } from "src/utils/social";

export const metadata: Metadata = generateMetadata({
  title: "AI and backend workflows, orchestrated at any scale",
  description:
    "Inngest's durable functions replace queues, state management, and scheduling to enable any developer to write reliable, multi-step code faster without touching infrastructure.",
  image: "/assets/homepage/open-graph.png",
});

export default function Page() {
  return (
    <div>
      <FeatureOverview />
      <div className="relative mx-auto w-full max-w-7xl rounded-xl bg-stone-950 py-20 shadow-2xl backdrop-blur-sm">
        <GridBackground />
        <div className="relative flex flex-col lg:gap-28">
          <FlowAccordion />
          <RecoveryAccordion />
        </div>
      </div>
    </div>
  );
}
