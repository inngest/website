"use client";

import SplitHero from "@/components/v1/sections/shared/SplitHero";
import ObservabilityDotsCanvas from "@/components/v1/sections/Observability/ObservabilityDotsCanvas";

export default function Hero() {
  return (
    <SplitHero
      breadcrumbs={[
        { label: "Observability" },
      ]}
      palette="blue"
      headlineId="ob-hero-headline"
      srHeadline="Stop debugging from a distance."
      leftHeadlineLines={["Stop", "Debugging"]}
      rightHeadline={
        <>
          <span className="block">From a</span>
          <span className="block">Distance.</span>
        </>
      }
      bodyLines={[
        "Logs and APM tools tell you when your pipeline",
        "breaks—not where, why, or for whom. Inngest",
        "provides deep insight into context at the step level—",
        "so you can fix fast.",
      ]}
      docsHref="/docs?ref=observability"
      signupHref="/sign-up?ref=observability"
      canvas={({ isDesktop }) =>
        isDesktop && (
          <ObservabilityDotsCanvas className="block h-full w-full" />
        )
      }
    />
  );
}
