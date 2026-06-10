"use client";

import SplitHero from "@/components/v1/sections/shared/SplitHero";
import HillsDotsCanvas from "@/components/v1/sections/BackgroundJobs/HillsDotsCanvas";

// Hero shell shared with /ai, /webhooks-events, /scheduled-jobs via
// SplitHero — salmon two-thirds with scroll-parallaxed grain on the
// left, jet-black third with a stippled-mountains particle field on
// the right. Dot positions come from the offline extractor at
// `scripts/extract-background-jobs-dots.mjs`.

export default function Hero() {
  return (
    <SplitHero
      docsHref="/docs/patterns/jobs?ref=background-jobs"
      signupHref="/sign-up?ref=background-jobs"
      breadcrumbs={[
        { label: "Use Cases" },
        { label: "Background Jobs" },
      ]}
      headlineId="bg-jobs-hero-headline"
      srHeadline="Background jobs without the boilerplate."
      leftHeadlineClassName="lg:whitespace-nowrap"
      leftHeadlineLines={["Background jobs", "without"]}
      rightHeadline={
        <>
          <span className="block whitespace-nowrap">The</span>
          <span className="block whitespace-nowrap">boilerplate.</span>
        </>
      }
      bodyLines={[
        "One line in your existing codebase to make any",
        "function reliable. Automatic retries, recovery,",
        "checkpointing, and step-level observability to fix",
        "failures fast.",
      ]}
      canvas={({ isDesktop }) =>
        isDesktop && (
          <HillsDotsCanvas className="block h-full w-full" />
        )
      }
    />
  );
}
