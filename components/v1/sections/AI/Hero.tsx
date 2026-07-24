"use client";

import SplitHero from "@/components/v1/sections/shared/SplitHero";
import AICubeCanvas from "@/components/v1/sections/AI/AICubeCanvas";

export default function Hero() {
  return (
    <SplitHero
      docsHref="/docs/examples/ai-agents-and-rag?ref=ai"
      signupHref="/sign-up?ref=ai"
      breadcrumbs={[
        { label: "Use Cases" },
        { label: "AI Workflows & Agents" },
      ]}
      headlineId="ai-hero-headline"
      srHeadline="Instantly durable AI code."
      leftHeadlineLines={["Instantly", "Durable"]}
      rightHeadlineClassName="whitespace-nowrap"
      rightHeadline="AI Code."
      bodyLines={[
        "AI fails unpredictably. APIs crash, context windows",
        "overflow, LLMs get rate limited. Wrap code in",
        "functions that checkpoint, wait, and offload without",
        "extra infrastructure.",
      ]}
      canvas={({ isDesktop }) =>
        isDesktop && (
          <AICubeCanvas className="block h-full w-full" />
        )
      }
    />
  );
}
