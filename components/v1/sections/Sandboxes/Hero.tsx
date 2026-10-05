"use client";

import StatusTag from "@/components/v1/StatusTag";
import SandboxesDotsCanvas from "@/components/v1/sections/Sandboxes/SandboxesDotsCanvas";
import SplitHero from "@/components/v1/sections/shared/SplitHero";

/**
 * /platform/sandboxes hero. Same blue SplitHero shell and stipple
 * entrance as Observability / Agent Evals. The field is an isolated
 * machine — the product is code, so there is no UI to put there.
 */
export default function Hero() {
  return (
    <SplitHero
      breadcrumbs={[{ label: "Sandboxes" }]}
      badge={
        <StatusTag size="md" tone="frost">
          Open beta
        </StatusTag>
      }
      palette="blue"
      headlineId="sandboxes-hero-headline"
      srHeadline="A sandbox in your function. Not another service."
      leftHeadlineLines={["A sandbox in", "your function."]}
      rightHeadline={
        <>
          <span className="block">Not another</span>
          <span className="block">service.</span>
        </>
      }
      bodyLines={[
        "Your sandbox should be as durable",
        "as any other function, and just as",
        "easy to set up. When it fails, or",
        "has to wait, you don't lose the run.",
      ]}
      docsHref={null}
      signupHref="/sign-up?ref=sandboxes"
      canvas={({ isDesktop }) =>
        isDesktop ? (
          <SandboxesDotsCanvas className="block h-full w-full" />
        ) : null
      }
    />
  );
}
