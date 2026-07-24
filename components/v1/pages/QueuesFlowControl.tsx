import PageShell from "@/components/v1/PageShell";
import Hero from "@/components/v1/sections/QueuesFlowControl/Hero";
import ProblemsGrid from "@/components/v1/sections/QueuesFlowControl/ProblemsGrid";
import Fairness from "@/components/v1/sections/QueuesFlowControl/Fairness";
import Primitives from "@/components/v1/sections/QueuesFlowControl/Primitives";
import AgentFlow from "@/components/v1/sections/QueuesFlowControl/AgentFlow";
import Testimonials from "@/components/v1/sections/QueuesFlowControl/Testimonials";
import FinalCta from "@/components/v1/sections/QueuesFlowControl/FinalCta";

export default function QueuesFlowControl() {
  return (
    <PageShell>
      <div className="overflow-x-clip">
        <Hero />
        <ProblemsGrid />
        <Fairness />
        <Primitives />
        <AgentFlow />
        <Testimonials />
        <FinalCta />
      </div>
    </PageShell>
  );
}
