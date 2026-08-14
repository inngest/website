import PageShell from "@/components/v1/PageShell";
import CaseStudies from "@/components/v1/sections/DurableExecution/CaseStudies";
import FinalCTA from "@/components/v1/sections/DurableExecution/FinalCTA";
import Hero from "@/components/v1/sections/DurableExecution/Hero";
import Problems from "@/components/v1/sections/DurableExecution/Problems";
import TemporalComparison from "@/components/v1/sections/DurableExecution/TemporalComparison";
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
      <Problems />
      <TemporalComparison />
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
