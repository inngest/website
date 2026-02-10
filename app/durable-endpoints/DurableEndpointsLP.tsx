import Image from "next/image";
import Header from "src/components/LandingPage/Header";
import Feature from "src/components/LandingPage/Feature";
import Tiles from "src/components/LandingPage/Tiles";
import Comparison from "src/components/LandingPage/Comparison";
import { H1 } from "src/components/LandingPage/Heading";
import { Button } from "components/RedesignedLanding/Button";
import Resources from "src/components/LandingPage/Resources";
import Link from "next/link";

const ref = "product-durable-endpoints";

export function DurableEndpointsLP({
  heroCTAs,
  heroFeature,
}: {
  heroCTAs?: { href: string; text: string }[];
  heroFeature?: React.ReactNode;
  showCTAs?: boolean;
}) {
  return (
    <div className="relative text-basis">
      <div className="relative z-10">
        <Hero ctas={heroCTAs} featured={heroFeature} />

        {/* Harden your API endpoints without queues */}
        <section className="my-28">
          <Header
            title="Scale without refactoring"
            description="All of your users deserve the same level of reliability from your product. Durable Endpoints lets you provide that experience from Day 1, without extra infra."
          />

          {/* Placeholder for central illustration */}
          <div className="mx-auto my-12 flex h-[400px] max-w-[950px] items-center justify-center rounded-lg">
            <Image
              src="/assets/durable-endpoints/queues-vs-inngest.png"
              alt="Inngest traces showing durable endpoint execution"
              width={750}
              height={400}
            />
          </div>

          <Comparison
            items={[
              {
                style: "before",
                title: "Traditional Path to API Durability",
                children: (
                  <ul className="list-disc space-y-2 pl-4 text-subtle">
                    <li>Refactor your entire codebase</li>
                    <li>Manage separate queueing and event streams</li>
                    <li>Debug across multiple systems</li>
                    <li>Months to make code "production ready"</li>
                  </ul>
                ),
              },
              {
                style: "after",
                title: "Inngest Durable Endpoints",
                children: (
                  <ul className="list-disc space-y-2 pl-4 text-subtle">
                    <li>Add one line of code to your existing API endpoints</li>
                    <li>No new infra to deploy or manage</li>
                    <li>All retries and failures handled transparently</li>
                    <li>Ship in minutes, not months</li>
                  </ul>
                ),
              },
            ]}
          />
        </section>

        {/* Your API code, made durable */}
        <section className="my-28">
          <Header
            title="Wrap your API in Steps, and ship it."
            description="Durable Endpoints makes your APIs bulletproof without any architectural changes. Handle failures automatically. Scale gracefully. Replay events. Observe everything."
          />

          {/* Feature 1: Add Steps to API code */}
          <Feature
            heading="1. Add Steps to API code"
            text="Wrap your API endpoint's critical logic with steps to transform them into unbreakable unit of work. No refactoring of your backend, no changes in your frontend."
            layout="left"
            content={{
              code: {
                snippet: `export default inngest.endpoint(async (req, { step }) => {
  const { contactId, source } = await req.json();

  const contact = await step.run("fetch-contact", () =>
    sources[source].getContact(contactId)
  );
  const enriched = await step.run("enrich-data", () =>
    clearbit.enrich(contact.email)
  );
  await step.run("sync-to-crm", () =>
    salesforce.upsertContact({ ...contact, ...enriched })
  );

  return Response.json({ synced: true });
});`,
                language: "typescript",
              },
            }}
          />

          {/* Feature 2: Trace success path with zero latency */}
          <Feature
            heading="2. Trace success path with zero latency"
            text="When everything works, your users get their results immediately with no added latency. It's exactly as fast as your original API. No waiting, no polling, no compromise."
            layout="right"
            content={{
              image: {
                src: "/assets/durable-endpoints/API-traces-success.png",
                alt: "Illustration showing API response timings",
                width: 750,
                height: 400,
              },
            }}
          />

          {/* Feature 3: Handle failures automatically */}
          <Feature
            heading="3. Handle failures automatically"
            text="Any failing steps gets automatically retried by Inngest's durable execution engine. The API consumer gets redirected to an Inngest URL to wait for its final result."
            layout="left"
            content={{
              image: {
                src: "/assets/durable-endpoints/API-traces-retries.png",
                alt: "Illustration showing API response timings",
                width: 750,
                height: 400,
              },
            }}
          />

          {/* Feature 4: Observe everything */}
          <Feature
            heading="4. Observe everything."
            text="You can't debug quickly if you're grepping logs or referencing external instrumentation. Investigate and repair quickly with built-in observability."
            layout="right"
            content={{
              image: {
                src: "/assets/durable-endpoints/o11y.png",
                alt: "Illustration showing API response timings",
                width: 750,
                height: 400,
              },
            }}
          />
        </section>

        {/* All the benefits of durable workflows */}
        <section className="my-28">
          <Header
            title="All the benefits of durable workflows, none of the overhead."
            description="Add production-grade reliability features without leaving your API codebase. Zero setup, zero new infrastructure. One line of code."
          />
          <Tiles
            height="large"
            tiles={[
              {
                heading: "Automatic Recovery",
                text: "Retry failed steps automatically, with exponential backoff. No more manual error handling, no more scattered logic.",
              },
              {
                heading: "Built for Events",
                text: 'Trigger, cancel, or hold ("wait for") runs based on event properties or other conditions.',
              },
              {
                heading: "Zero Refactoring",
                text: "Add durability to existing APIs without changing your architecture or rewriting code. Meet you where you're at in your codebase...",
              },
              {
                heading: "Built-in Observability",
                text: "See exactly what's happening in your APIs with automatic logging, tracing, and metrics for every step...",
              },
            ]}
          />
        </section>

        {/* Start scaling today */}
        <section className="my-28 pt-14">
          <Header
            title="Start building today"
            description="Build your first Durable Endpoint with these helpful resources"
          />
          <Resources
            items={[
              {
                type: "blog",
                title: "Introducing: Durable Endpoints",
                description:
                  "Learn why we built Durable Endpoints, and find some code examples you can use.",
                url: `/blog/introducing-durable-endpoints?ref=${ref}`,
              },
              {
                type: "example",
                title: "DeepResearch built with Durable Endpoints",
                description:
                  "See Durable Endpoints in action with our DeepResearch example. Checkout the repository and try it locally.",
                url: `https://github.com/inngest/inngest-js/tree/main/examples/durable-endpoints-deepresearch#readme`,
              },
              {
                type: "docs",
                title: "Durable Execution reference",
                description:
                  "Explore the Durable Endpoints TypeScript SDK reference with the complete list of options and use case examples.",
                url: `/docs/reference/typescript/durable-endpoints?ref=${ref}`,
              },
            ]}
          />
        </section>
      </div>
    </div>
  );
}

function Hero({
  ctas = [
    {
      href: `/sign-up?ref=${ref}`,
      text: "Get started",
      variant: "default",
    },
    {
      href: `/docs/learn/durable-endpoints?ref=${ref}`,
      text: "Read the docs",
      variant: "outline",
    },
  ],
  featured,
}: {
  ctas?: {
    href: string;
    text: string | React.ReactNode;
    variant?: "default" | "outline" | "link";
  }[];
  featured?: React.ReactNode;
}) {
  return (
    <div className="sm:px-auto mx-auto grid max-w-[1728px] gap-12 px-4 py-8 md:grid-cols-2">
      <div className="flex flex-row items-center justify-end text-center md:text-left">
        <div className="flex shrink flex-col gap-6 md:py-8 md:pl-4 lg:max-w-[580px]">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-intense">
            Durable Endpoints
          </p>
          <H1 variant="contrast">
            Build fault-tolerant
            <br />
            API endpoints
          </H1>
          <p className="text-balance text-lg text-subtle sm:text-xl md:max-w-[540px]">
            Add automatic retries, recovery, and observability to any
            application just by wrapping your code in Steps. No queues or
            workflows to manage.
          </p>
          <div className="flex flex-row flex-wrap justify-center gap-4 md:justify-start">
            {ctas.map((cta, idx) => (
              <Button key={idx} variant={cta.variant} asChild>
                <Link href={cta.href}>{cta.text}</Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
      {featured ? (
        featured
      ) : (
        <div className="flex flex-col gap-4 px-4 sm:px-0">
          <div className="relative w-full max-w-[750px]">
            {/* TODO: Replace with actual traces image */}
            <Image
              src="/assets/durable-endpoints/durable-endpoints-hero.png"
              alt="Inngest traces showing durable endpoint execution"
              width={750}
              height={400}
            />
          </div>
        </div>
      )}
    </div>
  );
}
