import PageShell from "@/components/v1/PageShell";
import Customers from "@/components/v1/sections/ScheduledJobs/Customers";
import Faq from "@/components/v1/sections/ScheduledJobs/Faq";
import Features from "@/components/v1/sections/ScheduledJobs/Features";
import Hero from "@/components/v1/sections/ScheduledJobs/Hero";
import InPractice from "@/components/v1/sections/ScheduledJobs/InPractice";
import OrchestrationComparison from "@/components/v1/sections/ScheduledJobs/OrchestrationComparison";
import Problems from "@/components/v1/sections/ScheduledJobs/Problems";
import WhatIsOrchestration from "@/components/v1/sections/ScheduledJobs/WhatIsOrchestration";

export default function ScheduledJobs() {
  return (
    <PageShell>
      {/* `overflow-x-clip` on the page wrapper as a defence-in-depth
          guard so no individual section can introduce a horizontal
          scrollbar on mobile (canvas / motion transforms, decorative
          images, long unbroken strings etc). */}
      <div className="overflow-x-clip">
        <Hero />
        <WhatIsOrchestration />
        <Problems />
        <InPractice />
        <OrchestrationComparison />
        <Features />
        <Customers />
        <Faq />
      </div>
    </PageShell>
  );
}
