"use client";

import SplitHero from "@/components/v1/sections/shared/SplitHero";
import ScheduledJobsDotsCanvas from "@/components/v1/sections/ScheduledJobs/ScheduledJobsDotsCanvas";

export default function Hero() {
  return (
    <SplitHero
      docsHref="/docs/guides/scheduled-functions?ref=scheduled-jobs"
      signupHref="/sign-up?ref=scheduled-jobs"
      breadcrumbs={[
        { label: "Use Cases" },
        { label: "Crons & Scheduled Jobs" },
      ]}
      headlineId="cron-hero-headline"
      srHeadline="Your cron jobs should do more than run."
      leftHeadlineClassName="lg:whitespace-nowrap"
      leftHeadlineLines={["Your cron jobs should"]}
      rightHeadline={
        <>
          <span className="block whitespace-nowrap">Do more</span>
          <span className="block whitespace-nowrap">than run.</span>
        </>
      }
      bodyLines={[
        "Infrastructure-agnostic serverless workflow",
        "orchestration: sleep, fan-out, retry, and recover",
        "on any deploy—with step-level observability.",
      ]}
      canvas={({ isDesktop }) =>
        isDesktop && (
          <ScheduledJobsDotsCanvas className="block h-full w-full" />
        )
      }
    />
  );
}
