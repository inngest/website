import { type Metadata } from "next";
import Image from "next/image";
import { generateMetadata } from "src/utils/social";
import { RiArrowRightLine } from "@remixicon/react";

import Hero from "src/components/LandingPage/Hero";
import Heading from "src/components/LandingPage/Heading";
import Tiles from "src/components/LandingPage/Tiles";
import CTA from "src/components/LandingPage/CTA";
import FeaturesCodeBlocks from "src/components/LandingPage/FeaturesCodeBlocks";
import Resources from "src/components/LandingPage/Resources";
import CaseStudy from "src/components/LandingPage/CaseStudy";

export const metadata: Metadata = generateMetadata({
  title: "Durable Workflows",
  description:
    "Write complex workflows as code and let Inngest handle the rest. Inngest manages state, retries, logging and observability for you.",
});

const baseCTA = "durable-workflows";

export default function Page() {
  return (
    <>
      <Hero
        headline="Durable Workflows"
        subheadline="Write complex workflows as code and let Inngest handle the rest. Inngest manages state, retries, logging and observability for you."
        ctas={[
          {
            href: `${process.env.NEXT_PUBLIC_SUPPORT_URL}?ref=${baseCTA}`,
            text: "Get started for free",
            kind: "button",
          },
          {
            href: `/docs?ref=${baseCTA}`,
            text: (
              <>
                Read the docs <RiArrowRightLine className="w-4 h-4" />
              </>
            ),
            kind: "link",
          },
        ]}
      />

      <section className="mb-14">
        <Heading
          title="Create complex workflows with simple primitives"
          description={[
            "Inngest SDKs enable you to create complex workflows in any language. We created step.run to make writing durable code easier than ever before. ",
          ]}
        />

        {/* TODO - code examples */}
        <FeaturesCodeBlocks
          features={[
            {
              title: "Chain steps that automatically retry",
              description:
                "Decouple logic into steps that are retried automatically and cached.",
              codeBlock: `export const processVideo = inngest.createFunction(
  {
    name: "Process video upload", id: "process-video",
  },
  { event: "video.uploaded" },
  async ({ event, step }) => {
    const transcript = await step.run('transcribe-video', async () => {
      return deepgram.transcribe(event.data.videoUrl);
    });
    const summary = await step.run('summarize-transcript', async () => {
      return llm.createCompletion({
        model: "gpt-3.5-turbo",
        prompt: createSummaryPrompt(transcript),
      });
    });
    await step.run('write-to-db', async () => {
      await db.videoSummaries.upsert({
        videoId: event.data.videoId,
        transcript,
        summary,
      });
    });
  }
)`,
            },
            {
              title: "Long running, durable jobs",
              description:
                "Trigger workflows with events and pause functions for hours or days.",
              codeBlock: `export const handlePayments = inngest.createFunction(
  {
    name: "Handle payments", id: "handle-payments"
  },
  { event: "api/invoice.created" },
  async ({ event, step }) => {
    // Wait until the next billing date
    await step.sleepUntil("wait-for-billing-date", event.data.invoiceDate);

    // Steps automatically retry on error, and only run
    // once on success - automatically, with no work.
    const charge = await step.run("charge", async () => {
      return await stripe.charges.create({
        amount: event.data.amount,
      });
    });

    await step.run("update-db", async () => {
      await db.payments.upsert(charge);
    });

    await step.run("send-receipt", async () => {
      await resend.emails.send({
        to: event.user.email,
        subject: "Your receipt for Inngest",
      });
    });
  }
);`,
            },
            {
              title: "Workflows triggered by events",
              description:
                "Use Inngest functions to define triggers for your user's workflows.",
              codeBlock: `import { Engine } from "@inngest/workflow-kit";
import { loadWorkflow } from "../loaders/workflow";
import { inngest } from "./client";
import { actionsWithHandlers } from "./workflowActionHandlers";

const workflowEngine = new Engine({
  actions: actionsWithHandlers,
  loader: loadWorkflow,
});

export default inngest.createFunction(
  { id: "blog-post-workflow" },
  // Triggers
  // - When a blog post is set to "review"
  // - When a blog post is published
  [{ event: "blog-post.updated" }, { event: "blog-post.published" }],
  async ({ event, step }) => {
    // When 'run' is called, the loader function is called with access to the event
    await workflowEngine.run({ event, step });
  }
);`,
            },
          ]}
        />

        <CTA
          text="View documentation"
          href={`/docs/reference/workflow-kit?ref=${baseCTA}`}
        />
      </section>

      <section className="my-28 py-14">
        <Heading
          title="Durable workflow engine, out-of-the-box"
          description="Avoid months of development time building a workflow engine from scratch. Build on top of Inngest's SDKs and primitives to offer endless options for customizable workflows to your users."
        />
        <Tiles
          tiles={[
            {
              icon: "check",
              text: "Integrate directly into your existing codebase.",
            },
            {
              icon: "check",
              text: "Ready for scale to millions of concurrent workflows from day one.",
            },
            {
              icon: "check",
              text: "Multi-tenant aware controls to limit concurrency, rate limit, or debounce.",
            },
            {
              icon: "check",
              text: "Automatic retries for maximum durability when errors happen.",
            },
            {
              icon: "check",
              text: "Auditable, observable, and scalable with logs and real-time metrics.",
            },
          ]}
        />
        <CTA
          text="Chat with a solutions expert"
          href={`/contact?ref=${baseCTA}`}
        />
      </section>
      <section className="my-28 py-14">
        <Heading
          title="You bring the application code, we bring the engine"
          description={[
            "Allow your own users to create workflows composed of reusable logic that you define. Use our step primitives for automatically retriable steps and human-in-the-loop flows using waitForEvent",
            "Users then define linear or complex DAG-based workflows with support for parallel actions.",
          ]}
          layout="horizontal"
        />

        {/* todo dev server */}
        <Image
          className="mx-auto max-w-4xl rounded-md"
          src="/assets/blog/introducing-workflow-kit/workflow-kit-architecture-dark.jpg"
          alt="Workflow Kit architecture"
          width={896}
          height={(896 / 744) * 445}
        />
      </section>

      <section className="my-28 py-14">
        <CaseStudy
          title="Florian Works: zero to building a mission-critical workflow engine for fire departments"
          description={[
            "Florian Works develops custom-built software products for fire departments, incorporating custom workflows built directly on top of Inngest to ship reliable products faster and easier than ever before.",
            "Utilizing Inngest's core workflow engine and primitives such as step.waitForEvent, FlorianWorks ships scheduling, roster management, a rules engine, and finance management without spending effort developing custom distributed systems primitives or reliability concerns.",
          ]}
          href={`/customers/florian-works?ref=${baseCTA}`}
          image="/assets/florianworks.jpg"
        />
      </section>

      <section className="my-28 py-14">
        <Heading
          title="Start building today"
          description="Dive into our guides, documentation and other resources to learn how to build your own customizable workflow experience for your users on top of Inngest."
        />
        <Resources
          items={[
            {
              type: "docs",
              title: "Guide: Building user-defined workflows",
              description:
                "Learn how to get started using Workflow Kit's backend libraries and front-end React components.",
              url: `/docs/guides/user-defined-workflows?ref=${baseCTA}`,
            },
            {
              type: "docs",
              title: "Workflow Kit documentation",
              description:
                "Read the full reference documentation and learn how you can extend the primitives.",
              url: `/docs/reference/workflow-kit?ref=${baseCTA}`,
            },
            {
              type: "blog",
              title: "Introducing Workflow Kit",
              description:
                "Read the announcement that hit the top 5 Product Hunt product of the day.",
              url: `/blog/introducing-workflow-kit?ref=${baseCTA}`,
            },
          ]}
        />
      </section>
    </>
  );
}
