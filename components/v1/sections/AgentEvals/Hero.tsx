"use client";

import SplitHero from "@/components/v1/sections/shared/SplitHero";
import AgentEvalsDotsCanvas from "@/components/v1/sections/AgentEvals/AgentEvalsDotsCanvas";

/**
 * /platform/agent-evals hero. Reuses the shared SplitHero shell (blue
 * palette, same as Observability / Queues) with the agent-evals stipple
 * shape on the right canvas.
 */
export default function Hero() {
  return (
    <SplitHero
      breadcrumbs={[{ label: "Agent Evals" }]}
      palette="blue"
      headlineId="agent-evals-hero-headline"
      srHeadline="Stop guessing. Prove it in production."
      leftHeadlineLines={["Stop", "guessing."]}
      rightHeadline={<>Prove it in production.</>}
      bodyLines={[
        "Comparing code, tools, or models in a sandbox",
        "might tell you whether something works, but",
        "it won’t tell you what works better. Only",
        "Inngest lets you safely experiment on",
        "production traffic, using data already",
        "collected at execution.",
      ]}
      canvas={({ isDesktop }) =>
        isDesktop ? (
          <AgentEvalsDotsCanvas className="block h-full w-full" />
        ) : null
      }
    />
  );
}
