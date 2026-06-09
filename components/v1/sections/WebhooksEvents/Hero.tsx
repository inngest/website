"use client";

import SplitHero from "@/components/v1/sections/shared/SplitHero";
import WebhooksEventsDotsCanvas from "@/components/v1/sections/WebhooksEvents/WebhooksEventsDotsCanvas";

export default function Hero() {
  return (
    <SplitHero
      docsHref="/docs?ref=webhooks-events"
      signupHref="/sign-up?ref=webhooks-events"
      breadcrumbs={[
        { label: "Use Cases" },
        { label: "Webhooks & Events" },
      ]}
      headlineId="we-hero-headline"
      srHeadline="Never drop an event."
      leftHeadlineClassName="lg:text-v1-display-sm lg:whitespace-nowrap"
      leftHeadlineLines={["Never drop"]}
      rightHeadline={
        <span className="block whitespace-nowrap">An event.</span>
      }
      bodyLines={[
        "Inline event handling often fails silently. Inngest",
        "reliably executes your functions, retries on failure, and",
        "shows you exactly what happened.",
      ]}
      canvas={({ isDesktop }) =>
        isDesktop && (
          <WebhooksEventsDotsCanvas className="block h-full w-full" />
        )
      }
    />
  );
}
