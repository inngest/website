import Image from "next/image";

import Link from "src/components/Link";
import Heading from "src/components/Heading";
import Command from "src/components/Command";
import { Button } from "src/shared/Button";
import Github from "src/shared/Icons/Github";

export default function Page() {
  return (
    <div className="max-w-6xl mx-auto">
      <section className="mt-32">
        <Heading
          level={1}
          title="Your application reliability layer"
          context="Platform"
          lede={
            <>
              Inngest's architecture combines an event stream, queues, and
              durable execution into a single reliability layer for your
              application. From distributed systems to serverless, Inngest is
              designed to help you build the complex with less headaches and in
              far less time.
            </>
          }
        />
        <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-4 md:gap-8">
          <Card title={"Events"} img="/assets/platform/events.png" />
          <Card
            title={"Flow control"}
            img="/assets/platform/flow-control.png"
          />
          <Card
            title={"Durable execution"}
            img="/assets/platform/durable-execution.png"
          />
        </div>
      </section>

      <section className="mt-32">
        <Heading
          level={2}
          title="The platform you need, built for you"
          lede={
            <>
              The Inngest platform combines multiple components that software
              teams typically would have to create, combine, and maintain into a
              single architecture. We've combined everything that you need into
              a single, cohesive platform solution.
            </>
          }
        />
        <div className="max-w-4xl mx-auto my-16">
          <Card
            img="/assets/platform/existing-tools.png"
            title="Everything that Inngest replaces"
          />
        </div>
        <p className="max-w-[720px] my-4 text-sm sm:text-base md:text-lg text-body">
          Inngest can be run in local development or CI as a single binary. This
          means simpler, faster feedback loops during dev and integration
          testing.
        </p>
        <div className="my-8 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 text-body">
          <Button
            href="https://github.com/inngest/inngest"
            arrow="right"
            variant="secondary"
          >
            <Github className="mr-2" />
            View the open source repo
          </Button>
          <p>or run it now</p>
          <Command command="npx inngest-cli@latest dev" />
        </div>
      </section>

      <section className="my-32">
        <Heading
          level={2}
          title="Events"
          lede={
            <>
              Inngest functions are all triggered by events. At the core of this
              is an event stream designed to scale infinitely without the
              overhead of sharding, topics and stateful consumer services.
            </>
          }
        />
        <div className="my-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <FeatureCard
            title="Send events via SDK, API or Webhook"
            description="Send events from any application to our low latency Event API using JSON. Inngest can also receive webhooks directly from a provider."
            img="/assets/platform/events-send.svg"
            href="/docs/events"
          />
          <FeatureCard
            title="Invoke, cancel, or resume with events"
            description="Invoke functions to run with a single event (or batch of events). Cancelling or resuming in-progress functions is also as easy as sending an event."
            img="/assets/platform/wait-for-event.svg"
            href="/docs/events"
          />
          <FeatureCard
            title="Full historical archive"
            description="Events are recorded for debugging, replay, or export enabling you to do more with the valuable data in your application."
            img="/assets/platform/event-archive.svg"
            href="/docs/events"
          />
        </div>
      </section>

      <section className="my-32">
        <Heading
          level={2}
          title="Flow control"
          lede={
            <>
              Managing how and when code is run in your application is extremely
              important. Inngest includes several methods for control required
              for production-grade applications.
            </>
          }
        />
        <div className="my-16 grid grid-cols-3 gap-8">
          {flowControlFeatures.map(({ title, description, href }) => (
            <FeatureCard title={title} description={description} href={href} />
          ))}
        </div>
      </section>
    </div>
  );
}

const flowControlFeatures = [
  {
    title: "User-level concurrency",
    description:
      "Avoid noisy neighbors. Use any key, like a User ID, to limit the number of functions that can run concurrently for that key.",
    href: "/docs/guides/concurrency",
  },
  {
    title: "Global resource concurrency",
    description:
      "Limit concurrency across several functions for a specific resource, like OpenAI API calls.",
    href: "/docs/guides/concurrency",
  },
  {
    title: "Prioritization",
    description:
      "Dynamically determine the execution order of functions based on any data. No separate queues required.",
    href: "/docs/reference/functions/run-priority",
  },
  {
    title: "Idempotency",
    description:
      "Prevent duplicate work with multiple methods to ensure functions are only run once.",
    href: "/docs/guides/handling-idempotency",
  },
  {
    title: "Debounce",
    description:
      "Avoid unnecessary function invocations by adding debounce delays to functions.",
    href: "/docs/reference/functions/debounce",
  },
  {
    title: "Rate limiting",
    description:
      "Limit the number of function invocations for everything or a specific resource key.",
    href: "/docs/reference/functions/rate-limit",
  },
  {
    title: "Batch processing",
    description:
      "Handle high load by processing events in batches. Ideal for bulk operations.",
    href: "/docs/guides/batching",
  },
];

function Card({ title, img }: { title?: string; img: string }) {
  return (
    <div>
      <img src={img} className="rounded-md bg-slate-300 h-72 w-full" />
      {title && <p className="mt-4 text-body text-lg text-center">{title}</p>}
    </div>
  );
}

function FeatureCard({
  title,
  description,
  href,
  img,
}: {
  title?: string;
  description: string;
  href: string;
  img?: string;
}) {
  return (
    <div className="flex flex-col gap-4 text-body">
      <h3 className="text-lg font-semibold">{title}</h3>
      {img && (
        <Image
          src={img}
          width="512"
          height="192"
          alt={title || ""}
          className="rounded-md w-full"
        />
      )}
      <p className="">{description}</p>
      <p>
        <Link href={href}>Learn more &gt; </Link>
      </p>
    </div>
  );
}
