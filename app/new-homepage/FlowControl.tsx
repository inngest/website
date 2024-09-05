// import Link from "next/link";

import Container from "./Container";
import Heading from "./Heading";
// import Card from "src/components/Card";
import Feature from "src/components/Feature";
import { RiTimeLine, RiCloseCircleLine } from "@remixicon/react";

// TODO - Links
// TODO - Copy review
const items = [
  {
    title: "Fair, multi-tenant concurrency",
    description:
      "Prevent noisy neighbor issues by limiting the concurrent resources each account or user consumes. Just a couple of lines of code.",
    icon: "/assets/platform/icon-concurrency-global.svg",
    // icon: "/assets/platform/icon-concurrency.svg",
    // image: "/assets/homepage/flow-control/multi-concurrency.svg",
    url: "/docs/guides/concurrency?ref=homepage-orchestration",
    className: "row-span-2",
  },
  {
    title: "Step orchestration & workflows",
    description:
      "Create step functions in code with orchestration and state automatically managed. Build complex pipelines of reliable business logic in minutes.",
    icon: "/assets/platform/icon-workflow.svg",
    // image: "/assets/homepage/flow-control/step-orchestration.svg",
    url: "/docs/features/inngest-functions/steps-workflows?ref=homepage-orchestration",
    className: "row-span-3",
  },
  {
    title: "Batching",
    description:
      "Coalesce many requests into a single function run for high-volume, low cost execution — without code, orchestration, or infra changes.",
    icon: "/assets/platform/icon-batch.svg",
    // image: "/assets/homepage/flow-control/batching.svg",
    url: "/docs/guides/batching?ref=homepage-orchestration",
    className: "row-span-2",
  },
  {
    title: "Throttle and rate-limiting",
    description:
      "Use throttling and rate-limiting to manage throughput across your functions. Handle spikes of traffic and ensure limited resources are protected, applying limits at a global or even user specific level.",
    icon: "/assets/platform/icon-throttle.svg",
    // image: "/assets/homepage/flow-control/throttle-rate-limit.svg",
    url: [
      {
        href: "/docs/guides/throttling?ref=homepage-orchestration",
        text: "Throttling",
      },
      {
        href: "/docs/guides/rate-limiting?ref=homepage-orchestration",
        text: "Rate limiting",
      },
    ],
    className: "row-span-3",
  },
  {
    title: "Dynamic prioritization",
    description:
      "Push paid or high-value users to the front of the queue while still ensuring fairness and quality-of-service for other users.",
    icon: "/assets/platform/icon-priority.svg",
    // image: "/assets/homepage/flow-control/prioritization.svg",
    url: "/docs/guides/priority?ref=homepage-orchestration",
    className: "row-span-2",
  },
  {
    title: "Debouncing",
    description:
      "Prevent wasted work and costs by debouncing functions triggered within a time window.",
    // image: "/assets/homepage/flow-control/debouncing.svg",
    icon: "/assets/platform/icon-debounce.svg",
    url: "/docs/guides/debounce?ref=homepage-orchestration",
    className: "row-span-2",
  },

  {
    title: "Pause for input or events",
    description: `Write functions that "wait for" additional input or events and automatically resume when matching events are received. No state management or polling required.`,
    icon: "/assets/platform/icon-pause.svg",
    // image: "/assets/homepage/flow-control/pause-until.svg",
    url: [
      {
        href: "/docs/features/inngest-functions/steps-workflows/wait-for-event?ref=homepage-orchestration",
        text: "Learn about waitForEvent",
      },
    ],
    className: "row-span-3",
  },
  {
    title: "Sleep, scheduling, and cron",
    description:
      "Sleep directly in code — in serverless functions, servers, or on the edge — and schedule functions for the future using dates or cron expressions.",
    icon: RiTimeLine,
    // image: "/assets/homepage/flow-control/sleep-scheduling.svg",
    url: [
      {
        href: "/docs/features/inngest-functions/steps-workflows/sleeps?ref=homepage-orchestration",
        text: "Sleeps",
      },
      {
        href: "/docs/guides/delayed-functions?ref=homepage-orchestration",
        text: "Scheduling",
      },
      {
        href: "/docs/guides/scheduled-functions?ref=homepage-orchestration",
        text: "Crons",
      },
    ],
    className: "row-span-2",
  },
  {
    title: "Declarative cancellation",
    description:
      "Automatically cancel functions whenever events happen in your system — without API calls, recording job IDs, or storing state.",
    // icon: "/assets/platform/icon-cancel.svg",
    icon: RiCloseCircleLine,
    // image: "/assets/homepage/flow-control/cancel.svg",
    url: "/docs/guides/cancel-running-functions?ref=homepage-orchestration",
    className: "row-span-2",
  },
];

export default function FlowControl() {
  return (
    <Container>
      <Heading
        label="Orchestration + Flow control"
        title="Orchestration and flow control necessary for resilient systems"
        description={
          <>
            Complete control over how your functions are executed without
            re-inventing the wheel. Inngest's built-in tools allow you to build
            complex workflows and run high volume jobs with fairness across your
            user base.
          </>
        }
        className="my-8"
      />

      <div className="my-16 mx-auto max-w-6xl grid grid-cols-3 gap-x-8 gap-y-10">
        {items.map(({ title, description, icon, url }, idx) => (
          <Feature
            title={title}
            description={description}
            icon={icon}
            href={url}
            key={idx}
          />
          // <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          // <Card
          //   key={idx}
          //   className="p-8 flex flex-col gap-2 justify-between"
          //   wrapperClassName={className}
          //   variant="subtle"
          // >
          //   <img src={image} alt={`Graphic of ${title}`} />
          //   <div className="flex flex-col gap-2">
          //     <h3 className="font-bold">
          //       <Link
          //         href={`${url}?ref=homepage-flow-control`}
          //         className="flex flex-row gap-2 items-center group hover:underline underline-offset-2 transition-all cursor-pointer"
          //       >
          //         {title}{" "}
          //         <RiArrowRightSLine className="group-hover:translate-x-1.5 relative top-px transition-transform duration-150 " />
          //       </Link>
          //     </h3>
          //     <p>{description}</p>
          //   </div>
          // </Card>
          // </div>
        ))}
      </div>
    </Container>
  );
}
