import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import { RiArrowRightLine } from "@remixicon/react";

import Hero from "src/components/LandingPage/Hero";
import Heading from "src/components/LandingPage/Header";
import CTA from "src/components/LandingPage/CTA";
import FeaturesCodeBlocks from "src/components/LandingPage/FeaturesCodeBlocks";
import Resources from "src/components/LandingPage/Resources";
import MasonryGrid from "src/components/LandingPage/MasonryGrid";
import Video from "src/components/LandingPage/Video";
import Quote from "src/components/Quote";

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
    // Steps that are prone to failure are automatically retried
    // Successful steps are cached and never re-run if a following step fails
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
              title: "Long running, durable workflows",
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
              title: "Wait for additional events",
              description:
                "Pause your workflow and resume with events for simple, decoupled systems.",
              codeBlock: `export const onboardingNudge = inngest.createFunction(
  { id: "send-onboarding-nudge-email" },
  { event: "app/account.created" },
  async ({ event, step }) => {
    // The function will pause and only resume when the matching
    // event is received. Events enable highly decoupled, declarative workflows
    const onboardingCompleted = await step.waitForEvent(
      "wait-for-onboarding-completion",
      { event: "app/onboarding.completed", timeout: "3d", if: \`async.data.userId === $\{event.data.userId}\` }
    );
    // Take different paths of your workflow based on inbound events
    if (!onboardingCompleted) {
      // if no event is received within 3 days, onboardingCompleted will be null
    } else {
      // if the event is received, onboardingCompleted will be the event payload object
    }
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

        <MasonryGrid
          items={[
            {
              title: "Run steps in series or parallel",
              description:
                "Easily run parts of your workflow code in parallel, event on serverless. Always retried automatically on error.",
              image:
                "/assets/landing-pages/legacy-queuing/graphic-step-orchestration.svg",
            },
            {
              title: "Pause functions for additional input",
              description:
                "Use step.waitForEvent() to pause your function until another event is received. Create human-in the middle workflows or communicate between long running jobs with events.",
              image:
                "/assets/landing-pages/durable-workflows/graphic-wait-for-event.svg",
            },
            {
              title: "Durable sleep for hours or weeks",
              description:
                "Pause your function and schedule to resume it after a specific period of time. Your code stops running and Inngest resumes it when the time is right.",
              image:
                "/assets/landing-pages/legacy-queuing/graphic-scheduling.svg",
            },
            {
              title: "Declarative job cancellation",
              description:
                "Cancel jobs just by sending an event. No need to keep track of running jobs, Inngest can automatically match long running functions with cancellation events to kill jobs declaratively.",
              image:
                "/assets/landing-pages/legacy-queuing/graphic-cancellation.svg",
            },
            {
              title: "Automatic retries",
              description:
                "Every step of your function is retried whenever it throws an error. Customize the number of retries to ensure your functions are reliably executed.",
              image:
                "/assets/landing-pages/durable-workflows/graphic-retries.svg",
            },
            {
              title: "Replay workflow functions",
              description:
                "Forget dead letter queues. Fix your issues then replay a failed function in a single click.",
              image:
                "/assets/landing-pages/durable-workflows/graphic-replay.svg",
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
          title="Visual debugging and observability"
          description={[
            "Our visual function timeline UI makes debugging easier than ever. See exactly what happened in your function, and when without grepping logs.",
            "Use the same tools from your local-first development server to the Inngest platform.",
          ]}
        />

        <Video src="/assets/homepage/video/2024-09-dev-server-4k.mp4" />
      </section>

      <section className="my-28 py-14">
        <Quote
          text={
            `One of my goals was to simplify a complex workflow in a cloud world. If the abstractions exist, let's use them so engineers can focus on the business problem, not the not the infrastructure-as-code and primitives problem. The best infrastructure is the one you don't have to manage.`
            // `I wanted to find a solution that would let us just write the code, not manage the infrastructure around queues, concurrency, retries, error handling, prioritization... I don't think that developers should be even configuring and managing queues themselves in 2024.`
          }
          attribution={{
            name: "Matthew Drooker",
            title: "CTO, SoundCloud",
            // logo: "/assets/customers/soundcloud-logo-white-horizontal.svg",
            avatar: "/assets/customers/soundcloud-matthew-drooker.jpg",
          }}
          caseStudy={`/customers/soundcloud?ref=${baseCTA}`}
          variant="box"
        />
      </section>

      <section className="my-28 py-14">
        <Heading
          title="Start building today"
          description="Dive into our resources and learn how Inngest is the best solution for durable workflows."
        />
        <Resources
          items={[
            {
              type: "docs",
              title: "Guide: Steps & Workflows",
              description:
                "Learn how to use steps as building blocks for creating reliable workflows that run for hours and recover from failures.",
              url: `/docs/features/inngest-functions/steps-workflows?ref=${baseCTA}`,
            },
            {
              type: "blog",
              title: "What are Durable Functions? A visual primer",
              description:
                "An article with animated illustrations to cover the inner workings of Durable Functions",
              url: `/blog/durable-functions-a-visual-javascript-primer?ref=${baseCTA}`,
            },
            {
              type: "docs",
              title: "Running tasks in parallel",
              description:
                "True workflow step parallelization on servers or serverless.",
              url: `/docs/guides/step-parallelism?ref=${baseCTA}`,
            },
          ]}
        />
      </section>
    </>
  );
}
