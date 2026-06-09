import PageShell from "@/components/v1/PageShell";
import AILoops from "@/components/v1/sections/Observability/AILoops";
import FasterResolution from "@/components/v1/sections/Observability/FasterResolution";
import FinalCTA from "@/components/v1/sections/Observability/FinalCTA";
import FullObservability from "@/components/v1/sections/Observability/FullObservability";
import Hero from "@/components/v1/sections/Observability/Hero";
import Insights from "@/components/v1/sections/Observability/Insights";
import PipelineBreaks from "@/components/v1/sections/Observability/PipelineBreaks";

export default function Observability() {
  return (
    <PageShell>
      <div className="overflow-x-clip">
        <Hero />
        <PipelineBreaks />
        <FullObservability />
        <FasterResolution />
        <Insights />
        <AILoops />
        <FinalCTA />
      </div>
    </PageShell>
  );
}
