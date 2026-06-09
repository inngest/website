"use client";

import SplitHero from "@/components/v1/sections/shared/SplitHero";
import QueuesFlowControlDotsCanvas from "@/components/v1/sections/QueuesFlowControl/QueuesFlowControlDotsCanvas";

export default function Hero() {
  return (
    <SplitHero
      breadcrumbs={[
        { label: "Queues & Flow Control" },
      ]}
      palette="blue"
      headlineId="qfc-hero-headline"
      srHeadline="Don't let one user's spike be everyone else's slowdown."
      leftHeadlineLines={["Don't let", "one user's", "spike"]}
      rightHeadline={
        <>
          <span className="block">Be everyone</span>
          <span className="block">else&apos;s</span>
          <span className="block">slowdown.</span>
        </>
      }
      bodyLines={[
        "Inngest's flow control and fairness features go above",
        "and beyond basic queuing to ensure every user gets",
        "their fair share, without any additional infrastructure.",
      ]}
      docsHref="/docs/guides/flow-control?ref=queues-flow-control"
      signupHref="/sign-up?ref=queues-flow-control"
      canvas={({ isDesktop }) =>
        isDesktop && (
          <QueuesFlowControlDotsCanvas className="block h-full w-full" />
        )
      }
    />
  );
}
