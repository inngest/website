"use client";

import SplitHero from "@/components/v1/sections/shared/SplitHero";
import DurableExecutionDotsCanvas from "@/components/v1/sections/DurableExecution/DurableExecutionDotsCanvas";

export default function Hero() {
  return (
    <SplitHero
      breadcrumbs={[{ label: "Durable Execution" }]}
      palette="blue"
      headlineId="de-hero-headline"
      srHeadline="Code that works, without extra workers."
      leftHeadlineLines={["Code that", "works,"]}
      rightHeadline={
        <>
          <span className="block">Without</span>
          <span className="block">Extra</span>
          <span className="block">Workers.</span>
        </>
      }
      bodyLines={[
        "What is durable execution? Fault-tolerant code that",
        "finishes even when APIs fail or servers restart.",
        "Inngest checkpoints every step and retries",
        "automatically—so workflows resume where they left off.",
      ]}
      docsHref="/docs/learn/how-functions-are-executed?ref=durable-execution"
      signupHref="/sign-up?ref=durable-execution"
      canvas={({ isDesktop }) =>
        isDesktop && (
          <DurableExecutionDotsCanvas className="block h-full w-full" />
        )
      }
    />
  );
}
