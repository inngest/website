import Link from "next/link";

import Container from "./Container";
import Heading from "./Heading";
import Card from "./Card";
import { RiArrowRightSLine } from "@remixicon/react";

// TODO - Links
// TODO - Copy review
const items = [
  {
    title: "Fair, multi-tenant concurrency",
    description:
      "Don't let some users starve resources for everyone else. Add account and user-level concurrency settings in a single line to ensure fairness.",
    image: "/assets/homepage/flow-control/multi-concurrency.svg",
    url: "/docs/guides/concurrency",
    className: "row-span-2",
  },
  {
    title: "Step orchestration",
    description:
      "Create step functions in code with orchestration and state automatically managed. Build complex pipelines of reliable business logic in minutes.",
    image: "/assets/homepage/flow-control/step-orchestration.svg",
    url: "/docs/guides/multi-step-functions",
    className: "row-span-3",
  },
  {
    title: "Debouncing",
    description:
      "Prevent wasted work and costs by debouncing functions automatically.",
    image: "/assets/homepage/flow-control/debouncing.svg",
    url: "/docs/guides/debounce",
    className: "row-span-2",
  },
  {
    title: "Throttle and rate-limiting",
    description:
      "Use throttling and rate-limiting to manage throughput across your functions. Handle spikes of traffic and ensure limited resources are protected, applying limits at a global or even user specific level.",
    image: "/assets/homepage/flow-control/throttle-rate-limit.svg",
    url: "/docs/guides/throttling",
    className: "row-span-3",
  },
  {
    title: "Batching",
    description:
      "Coalesce many requests into a single function run for high-volume, low cost execution — without code, orchestration, or infra changes.",
    image: "/assets/homepage/flow-control/batching.svg",
    url: "/docs/guides/concurrency",
    className: "row-span-2",
  },
  {
    title: "Dynamic prioritization",
    description:
      "Push paid or high-value users to the front of the queue whilst still ensuring fairness and QoS for other users, with a single line of code.",
    image: "/assets/homepage/flow-control/prioritization.svg",
    url: "/docs/guides/priority",
    className: "row-span-2",
  },
  {
    title: "Pause for input or more data",
    description:
      "Pause functions until something else happens in your system, then automatically resume after matching events are received — with a single line of code. Solve race conditions using `lookback` to search past events automatically.",
    image: "/assets/homepage/flow-control/pause-until.svg",
    url: "/docs/reference/functions/step-wait-for-event",
    className: "row-span-3",
  },
  {
    title: "Sleep, scheduling, and cron",
    description:
      "Sleep directly in code — in serverless functions, servers, or on the edge — and schedule functions for the future using dates or cron expressions.",
    image: "/assets/homepage/flow-control/sleep-scheduling.svg",
    url: "/docs/guides/delayed-functions",
    className: "row-span-2",
  },
  {
    title: "Declarative cancellation",
    description:
      "Automatically cancel functions whenever events happen in your system — without API calls, recording job IDs, or storing state.",
    image: "/assets/homepage/flow-control/cancel.svg",
    url: "/docs/guides/cancel-running-functions",
    className: "row-span-2",
  },
];

export default function FlowControl() {
  return (
    <Container>
      <Heading
        label="Flow control"
        title="Orchestration and flow control necessary for resilient systems"
        description={
          <>
            Inngest built flow control directly into the queue. Each function
            can configure exactly how and when it should run and combine methods
            for robust systems.
          </>
        }
        className="my-8"
      />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(({ title, description, image, url, className }, idx) => (
          <Card
            key={idx}
            className="p-8 flex flex-col gap-2 justify-between"
            wrapperClassName={className}
            variant="subtle"
          >
            <img src={image} alt={`Graphic of ${title}`} />
            <div className="flex flex-col gap-2">
              <h3 className="font-bold">
                <Link
                  href={`${url}?ref=homepage-flow-control`}
                  className="flex flex-row gap-2 items-center group hover:underline underline-offset-2 transition-all cursor-pointer"
                >
                  {title}{" "}
                  <RiArrowRightSLine className="group-hover:translate-x-1.5 relative top-px transition-transform duration-150 " />
                </Link>
              </h3>
              <p>{description}</p>
            </div>
          </Card>
        ))}
      </div>
    </Container>
  );
}
