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
          {flowControlFeatures.map(({ title, description, href, icon }) => (
            <FeatureCard
              title={title}
              description={description}
              href={href}
              icon={icon}
            />
          ))}
        </div>
      </section>

      <section className="my-32">
        <Heading
          level={2}
          title="Durable execution"
          lede={
            <>
              Write resilient code that automatically retries, sleeps, pauses,
              fans-out, and more. Inngest functions allow you to write and run
              code that is simple to read and write, but powerful for the most
              complex of systems.
            </>
          }
        />
        <div className="my-16 grid grid-cols-3 gap-8">
          {durableExecutionFeatures.map(({ title, description, href }) => (
            <FeatureCard title={title} description={description} href={href} />
          ))}
        </div>
      </section>

      <section className="my-32">
        <Heading
          level={2}
          title="Observability and tools at your fingertips"
          lede={
            <>
              Inngest provides a suite of tools to help you understand what's
              happening in your application. From logs to metrics to tracing, we
              have you covered.
            </>
          }
        />
        <div className="my-16 grid grid-cols-3 gap-8">
          {platformFeatures.map(({ title, description, href }) => (
            <FeatureCard title={title} description={description} href={href} />
          ))}
        </div>
      </section>

      <section
        className={`my-32 p-px
        rounded-md bg-gradient-to-tl from-green-800/60 via-orange-300/60 to-rose-900/60
      shadow-[0_10px_100px_0_rgba(52,211,153,0.20)]`}
      >
        <div className="px-8 py-8 rounded-md bg-slate-1000">
          <Heading
            level={2}
            title="Enterprise ready"
            lede={
              <>
                The Inngest platform has been designed from the ground up with
                security and data privacy in mind. It's been battle tested so
                you can trust it to run your most critical workloads.
              </>
            }
            className="text-center"
            ledeClassName="mx-auto"
          />
          <div className="mt-16 mb-8 grid grid-cols-3 gap-x-8 gap-y-16">
            {enterpriseFeatures.map(({ title, description }) => (
              <FeatureCard title={title} description={description} />
            ))}
          </div>
        </div>
      </section>

      <section className="my-32">
        <Heading
          level={2}
          title="Ready to learn more?"
          className="text-center"
          lede={
            <>
              Chat with a solutions engineer that can answer all of your
              questions:
            </>
          }
          ledeClassName="mx-auto"
        />
        <div className="my-16 text-center">
          <Button href="/contact?ref=platform" size="lg" arrow="right">
            Get in touch
          </Button>
        </div>
      </section>
    </div>
  );
}

const flowControlFeatures = [
  {
    title: "Fine-grained concurrency",
    description: (
      <>
        Avoid noisy neighbors. Use <em>any key</em>, like a User ID, to limit
        the number of functions that can run concurrently for that key.
      </>
    ),
    href: "/docs/guides/concurrency",
    icon: "/assets/platform/icon-concurrency.svg",
  },
  {
    title: "Global resource concurrency",
    description:
      "Limit concurrency across several functions for a specific resource, like OpenAI API calls.",
    href: "/docs/guides/concurrency",
    icon: "/assets/platform/icon-concurrency-global.svg",
  },
  {
    title: "Prioritization",
    description:
      "Dynamically determine the execution order of functions based on any data. No separate queues required.",
    href: "/docs/reference/functions/run-priority",
    icon: "/assets/platform/icon-priority.svg",
  },
  {
    title: "Idempotency",
    description:
      "Prevent duplicate work with two different approaches to ensure functions are only run once.",
    href: "/docs/guides/handling-idempotency",
    icon: "/assets/platform/icon-idempotency.svg",
  },
  {
    title: "Debounce",
    description:
      "Avoid unnecessary function invocations by adding debounce delays to functions.",
    href: "/docs/reference/functions/debounce",
    icon: "/assets/platform/icon-debounce.svg",
  },
  {
    title: "Rate limiting",
    description:
      "Limit the number of function invocations for everything or a specific resource key.",
    href: "/docs/reference/functions/rate-limit",
    icon: "/assets/platform/icon-rate-limit.svg",
  },
  {
    title: "Batch processing",
    description:
      "Handle high load by processing events in batches. Ideal for bulk operations.",
    href: "/docs/guides/batching",
    icon: "/assets/platform/icon-batch.svg",
  },
];

const durableExecutionFeatures = [
  {
    title: "Serverless, servers, or both",
    description:
      "Functions can run on any serverless platform or any cloud provider. You deploy the code, Inngest handles the rest.",
    href: "TODO",
  },
  {
    title: "Sleep, delay, schedule",
    description:
      "Functions can sleep or be scheduled for days, weeks, or months in the future.",
    href: "TODO",
  },
  {
    title: "Pause for additional data",
    description:
      "Create human-in-the-middle flows that wait for additional input.",
    href: "TODO",
  },
  {
    title: "Automatically retry on errors",
    description:
      "Create human-in-the-middle flows that wait for additional input.",
    href: "TODO",
  },
  // TODO
];

const platformFeatures = [
  {
    title: "Metrics and monitoring",
    description:
      "View your system at a glance or dig into a specific function to easily see what's happening without any additional instrumentation.",
    href: "TODO",
  },
  {
    title: "Logging and tracing",
    description:
      "View, filter, and search logs for any function. Trace the path of an event through the most complex of workflows.",
    href: "TODO",
  },
  {
    title: "On-demand branch development environments",
    description:
      "Spin up a full development environment for every branch, automatically. Or create dedicated environments for testing.",
    href: "TODO",
  },
  // TODO
];

const enterpriseFeatures = [
  {
    title: "SOC 2 Compliance",
    description: "Regular audits and compliance with SOC 2 Type 2.",
  },
  {
    title: "100k+ executions per second",
    description:
      "Designed for your heavy workloads with capacity for bursting.",
  },
  {
    title: "SSO & SAML",
    description: "Single sign-on and SAML support for enterprise customers.",
  },
  {
    title: "E2E Encryption",
    description:
      "Encrypt all data that passes through Inngest with end-to-end encryption middleware.",
  },
  {
    title: "Low latency",
    description: "Inngest is designed to be low latency for all functions.",
  },
  {
    title: "HIPAA BAA Available",
    description: "Ready to handle sensitive healthcare data.",
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
  icon,
}: {
  title?: string;
  description: string | React.ReactElement;
  href?: string;
  img?: string;
  icon?: string;
}) {
  return (
    <div className="flex flex-col items-start gap-4 text-body">
      {icon && <img src={icon} className="w-8 h-8" />}
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
      {href && (
        <p>
          <Link href={href}>Learn more &gt; </Link>
        </p>
      )}
    </div>
  );
}
