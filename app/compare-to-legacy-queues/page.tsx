import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import { RiArrowRightLine } from "@remixicon/react";

import Hero from "src/components/LandingPage/Hero";
import Heading from "src/components/LandingPage/Heading";
import Tiles from "src/components/LandingPage/Tiles";
import Comparison from "src/components/LandingPage/Comparison";
import CTA from "src/components/LandingPage/CTA";

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
          title="Transform your queueing system with Inngest’s durable execution"
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
    </>
  );
}
