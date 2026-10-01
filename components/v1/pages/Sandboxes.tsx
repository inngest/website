import PageShell from "@/components/v1/PageShell";
import FinalCTA from "@/components/v1/sections/Sandboxes/FinalCTA";
import Hero from "@/components/v1/sections/Sandboxes/Hero";
import UseCases from "@/components/v1/sections/Sandboxes/UseCases";
import WhyInngest from "@/components/v1/sections/Sandboxes/WhyInngest";

/**
 * /platform/sandboxes — durable sandboxes for code that has to run.
 * Open beta. The hero canvas is the shared stipple entrance.
 */
export default function Sandboxes() {
  return (
    <PageShell>
      <div className="overflow-x-clip">
        <Hero />
        <UseCases />
        <WhyInngest />
        <FinalCTA />
      </div>
    </PageShell>
  );
}
