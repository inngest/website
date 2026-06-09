import PageShell from "@/components/v1/PageShell";
import CaseStudies from "@/components/v1/sections/DurableExecution/CaseStudies";
import FinalCTA from "@/components/v1/sections/DurableExecution/FinalCTA";
import ProblemsGrid from "@/components/v1/sections/QueuesFlowControl/ProblemsGrid";
import Hero from "@/components/v1/sections/DurableExecution/Hero";
import Primitives from "@/components/v1/sections/DurableExecution/Primitives";
import ControlFlow from "@/components/v1/sections/DurableExecution/ControlFlow";
import Observability from "@/components/v1/sections/DurableExecution/Observability";
import Frictionless from "@/components/v1/sections/DurableExecution/Frictionless";
import AnyCode from "@/components/v1/sections/DurableExecution/AnyCode";
import LocalFirst from "@/components/v1/sections/DurableExecution/LocalFirst";

export default function DurableExecution() {
  return (
    <PageShell>
      <Hero />
      <ProblemsGrid
        labelledById="de-problems-headline"
        eyebrow="The problem"
        headline={
          <>
            <span className="block">Your pipelines will fail.</span>
            <span className="block">Then what?</span>
          </>
        }
        intro="The best queues are good at one thing: making sure a job gets picked up. For workflows with API calls or human-in-the-loop pauses, you need to make sure your code can run, sleep, wait, and retry as needed."
      />
      <Primitives />
      <ControlFlow />
      <Observability />
      <AnyCode />
      <Frictionless />
      <LocalFirst />
      <CaseStudies />
      <FinalCTA />
    </PageShell>
  );
}
