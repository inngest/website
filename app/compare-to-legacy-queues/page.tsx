import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import { RiArrowRightLine } from "@remixicon/react";

import Hero from "src/components/LandingPage/Hero";
import Heading from "src/components/LandingPage/Heading";
import Tiles from "src/components/LandingPage/Tiles";
import Comparison from "src/components/LandingPage/Comparison";
import CTA from "src/components/LandingPage/CTA";
import MasonryGrid from "src/components/LandingPage/MasonryGrid";
import LanguagesAndPlatforms from "src/components/LandingPage/LanguagesAndPlatforms";

export const metadata: Metadata = generateMetadata({
  title: "Traditional queues weren't built for today's workflows",
  description:
    "Inngest delivers everything your current queues lack—modern features, built-in orchestration, and zero overhead",
});

const baseCTA = "compare-to-legacy-queues";

export default function Page() {
  return (
    <>
      <Hero
        headline="Traditional queues weren't built for today's workflows"
        subheadline="Inngest delivers everything your current queues lack — modern features, built-in orchestration, and zero overhead"
        ctas={[
          {
            href: `/contact?ref=${baseCTA}-hero`,
            text: "Contact us",
            kind: "button",
          },
          {
            href: `/docs?ref=${baseCTA}-hero`,
            text: (
              <>
                Read the docs <RiArrowRightLine className="w-4 h-4" />
              </>
            ),
            kind: "link",
          },
        ]}
      />
      {/* Overtake the hero bg with z-index */}
      <section className="relative z-10 mb-14">
        <Heading
          title="Your message queue isn't delivering for you"
          description="Traditional queuing systems handle only the basics, leaving you to tackle the difficult parts. You've likely experienced the frustration of dealing with some or all of these common challenges: "
        />
        <Tiles
          tiles={[
            {
              text: "No native support for throttling, rate limiting, debouncing, or dynamic prioritization",
            },
            {
              text: "Cumbersome and complex workflow management spanning queues, workers, and crons",
            },
            {
              text: "Limited support for multi-tenant workloads",
            },
            {
              text: "Lack of job management capabilities including cancel, replay, status checks",
            },
            {
              text: "Insufficient built-in observability and monitoring tools",
            },
          ]}
        />
      </section>
      <section className="my-28 py-14">
        <Heading
          title="Transform your queueing system with Inngest's durable execution"
          description={[
            "Inngest is more than a queue—it's a durable execution platform designed to solve the challenges of traditional queuing systems. Managing complex workflows with multiple queues, workers, and cron jobs increases complexity and the risk of errors.",
            "With Inngest, workflows are modeled in code as functions and steps, simplifying the process. Built-in scheduling, batching, throttling, and multi-tenancy eliminate the need for managing infrastructure, offering a modern, efficient solution for reliable, scalable workflows.",
          ]}
        />
        <Comparison
          items={[
            {
              style: "before",
              title: "Traditional Queue Systems",
              image:
                "/assets/landing-pages/legacy-queuing/traditional-queue-systems.svg",
            },
            {
              style: "after",
              title: "Inngest",
              image:
                "/assets/landing-pages/legacy-queuing/inngest-comparison.svg",
            },
          ]}
        />

        <CTA
          text="Chat with a solutions export"
          href={`/contact?ref=${baseCTA}-comparison`}
        />
      </section>
      <section className="my-28 py-14 bg-codeEditor">
        <Heading
          title="The complete queuing solution you've been looking for"
          description={[
            "Easily add concurrency, prioritization, debouncing, throttling, and multi-tenant fairness to any function, without any implementation. Inngest’s native flow control provides a comprehensive, out-of-the-box queuing experience, allowing you to focus more on building your product, and less on managing systems.",
          ]}
          layout="horizontal"
        />
        <MasonryGrid
          items={[
            {
              title: "Throttling and rate limiting",
              description:
                "Use throttling and rate-limiting to manage throughput across your functions. Handle spikes of traffic and ensure limited resources are protected, applying limits at a global or even user specific level.",
              image:
                "/assets/landing-pages/legacy-queuing/graphic-throttling.svg",
              className: "row-span-4",
            },
            {
              title: "Fair, multi-tenant concurrency",
              description:
                "Built-in multi-tenant support allows for account and user-level management and concurrency in a single line of code. Ensure fair resource distribution and eliminate noisy-neighbor issues to scale efficiently across multiple clients or environments.",
              image:
                "/assets/landing-pages/legacy-queuing/graphic-multi-concurrency.svg",
              className: "row-span-3",
            },
            {
              title: "Declarative cancellation",
              description:
                "Automatically cancel functions whenever events happen in your system — without API calls, recording job IDs, or storing state.",
              image:
                "/assets/landing-pages/legacy-queuing/graphic-cancellation.svg",
              className: "row-span-3",
            },
            {
              title: "Step function orchestration",
              description:
                "Simplify workloads that typically span multiple queues and workers by writing step functions that define multi-stage workflows directly in code. All business logic and context stays in one easy to understand function, not spread across multiple workers.",
              // TODO
              image:
                "/assets/landing-pages/legacy-queuing/graphic-cancellation.svg",
              className: "row-span-4",
            },
            {
              title: "Debouncing",
              description:
                "Prevent wasted work and costs by debouncing functions automatically.",
              image:
                "/assets/landing-pages/legacy-queuing/graphic-debounce.svg",
              className: "row-span-3",
            },
            {
              title: "Native batch processing",
              description:
                "Combine multiple requests into a single function for high-volume, low-cost execution - no code or infrastructure changes required. Improve performance, reduce overhead, and simplify workflows.",
              image:
                "/assets/landing-pages/legacy-queuing/graphic-batching.svg",
              className: "row-span-3",
            },
            {
              title: "Comprehensive built-in observability",
              description:
                "Monitor workflow performance and address issues as they arise, allowing you to troubleshoot quickly, identify bottlenecks, and continuously optimize your system - without relying on external tools. ",
              image:
                "/assets/landing-pages/legacy-queuing/graphic-observability.svg",
              className: "row-span-4",
            },
            {
              title: "Sleep, scheduling, and cron",
              description:
                "Built-in scheduling enables you to pause or schedule jobs for minutes or weeks into the future. Additionally, create cron jobs along side your queued jobs by setting a cron expression trigger.",
              image:
                "/assets/landing-pages/legacy-queuing/graphic-scheduling.svg",
              className: "row-span-3",
            },
            {
              title: "Dynamic Prioritization",
              description:
                "Push important jobs to the front of the queue whilst still ensuring fairness and QoS for other users, with a single line of code.",
              image:
                "/assets/landing-pages/legacy-queuing/graphic-prioritization.svg",
              className: "row-span-3",
            },
          ]}
        />
        <LanguagesAndPlatforms />
      </section>
    </>
  );
}
