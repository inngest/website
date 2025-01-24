import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import { RiArrowRightLine } from "@remixicon/react";

import Hero from "src/components/LandingPage/Hero";
import Heading from "src/components/LandingPage/Header";
import Tiles from "src/components/LandingPage/Tiles";
import Comparison from "src/components/LandingPage/Comparison";
import CTA from "src/components/LandingPage/CTA";
import Button from "src/components/LandingPage/Button";
import MasonryGrid from "src/components/LandingPage/MasonryGrid";
import LanguagesAndPlatforms from "src/components/LandingPage/LanguagesAndPlatforms";
import FeaturesCodeBlocks from "src/components/LandingPage/FeaturesCodeBlocks";
import Resources from "src/components/LandingPage/Resources";
import ContactForm from "src/components/ContactForm";
import CodeWindow from "src/shared/CodeWindow";

export const metadata: Metadata = generateMetadata({
  title: "Traditional queues weren't built for today's workflows",
  description:
    "Inngest delivers everything your current queues lack—modern features, built-in orchestration, and zero overhead",
});

const baseCTA = "compare-to-temporal";

export default function Page() {
  return (
    <>
      <Hero
        headline="Inngest vs Temporal: Durable execution that developers love"
        subheadline="Discover a serverless, event-driven platform that developers love. Build faster, debug easier, and scale effortlessly with Inngest."
        layout="horizontal"
        children={
          <ContactForm
            className="max-w-md w-full mx-auto"
            eventName="contact.form.sent"
            eventVersion="2023-12-12.1"
            gtmEvent="Sales Lead Form Submitted"
            button="Schedule a call"
            redirectTo="https://savvycal.com/inngest/demo?utm_medium=website&utm_source=temporal-landing-page"
          />
        }
        logos={[
          {
            src: "/assets/customers/soundcloud-logo-white-horizontal.svg",
            name: "SoundCloud",
            scale: 1.5,
          },
          {
            src: "/assets/customers/tripadvisor.svg",
            name: "TripAdvisor",
            scale: 1.4,
          },
          {
            src: "/assets/customers/contentful-logo-white.svg",
            name: "Contenful",
            scale: 1.2,
          },
          {
            src: "/assets/customers/11x-logo.svg",
            name: "11x.ai",
            scale: 0.7,
          },
          {
            src: "/assets/customers/gitbook-logo-white.svg",
            name: "Gitbook",
            scale: 1.3,
          },
          {
            src: "/assets/customers/resend.svg",
            name: "Resend",
            scale: 0.8,
          },
        ]}
      />
      {/* Overtake the hero bg with z-index */}
      <section className="relative z-10 mb-14">
        <Heading
          title="Why developers choose Inngest over Temporal "
          description="Traditional queuing systems handle only the basics, leaving you to tackle the difficult parts. You've likely experienced the frustration of dealing with some or all of these common challenges: "
        />
        <Tiles
          height="large"
          tiles={[
            {
              icon: "check",
              heading: "Faster development, better DX",
              text: "Write durable functions in minutes—no steep learning curve, no complex workflow concepts.",
            },
            {
              icon: "check",
              heading: "Easily run anywhere",
              text: "Runs on servers or serverless — no stateful backend to manage. Seamlessly scales on AWS Lambda and Cloudflare Workers, or your own containers.",
            },
            {
              icon: "check",
              heading: "Built-in observability & recovery",
              text: "Debug workflows with powerful visual tools, built in metrics, and first-class event and function replay.",
            },
            {
              icon: "check",
              heading: "Seamless flow-control",
              text: "Build your product for scale with multi-tenant concurrency, parallelism, throttling, prioritization, and batching.",
            },
          ]}
        />
      </section>
      <section className="my-28 py-14">
        <Heading
          title="Differences explained"
          // description={[
          //   "Inngest is more than a queue—it's a durable execution platform designed to solve the challenges of traditional queuing systems. Managing complex workflows with multiple queues, workers, and cron jobs increases complexity and the risk of errors.",
          //   "With Inngest, workflows are modeled in code as functions and steps, simplifying the process. Built-in scheduling, batching, throttling, and multi-tenancy eliminate the need for managing infrastructure, offering a modern, efficient solution for reliable, scalable workflows.",
          // ]}
        />
        <table className="max-w-4xl mx-auto mb-12 text-left table-auto border border-subtle rounded-md divide-y divide-subtle">
          <thead>
            <tr className="grid grid-cols-3 divide-x divide-subtle">
              <th className="p-2 rounded-tl-md">Feature</th>
              <th className="p-2">Inngest</th>
              <th className="p-2 rounded-tr-md">Temporal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-subtle">
            {[
              {
                feature: "Ease of use",
                inngest: "Intuitive SDK, deploy in minutes",
                temporal: "Complex setup, steep learning curve",
              },
              {
                feature: "Observability",
                inngest: "Built-in tracing, real-time metrics",
                temporal: "Requires external monitoring tools",
              },
              {
                feature: "Architecture",
                inngest: "Serverless, scales automatically",
                temporal: "Stateful, heavy infrastructure",
              },
              {
                feature: "Recovery tool suite",
                inngest:
                  "Built-in capabilities like pausing, bulk cancel, and bulk replay",
                temporal: "?",
              },
              {
                feature: "Workflow versioning",
                inngest: "Automatic, hassle-free",
                temporal: "Manual, error-prone",
              },
              {
                feature: "Time to delivery",
                inngest: "Minutes",
                temporal: "Weeks",
              },
            ].map((row) => (
              <tr className="grid grid-cols-3 divide-x divide-subtle">
                <td className="p-2">{row.feature}</td>
                <td className="p-2">{row.inngest}</td>
                <td className="p-2">{row.temporal}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <CTA
          text="Schedule a demo"
          href={`/contact?ref=${baseCTA}-comparison`}
        />
      </section>

      {/* What devs are saying about Inngest */}
      <section className="my-28 py-14 bg-codeEditor">
        <Heading
          title="What devs are saying about Inngest"
          // description={[
          //   "Easily add concurrency, prioritization, debouncing, throttling, and multi-tenant fairness to any function, without any implementation. Inngest’s native flow control provides a comprehensive, out-of-the-box queuing experience, allowing you to focus more on building your product, and less on managing systems.",
          // ]}
          // layout="horizontal"
        />
        {/* TODO quotes */}
        <LanguagesAndPlatforms />

        {/* <CTA text="Contact us" href={`/contact?ref=${baseCTA}`} /> */}
        <div className="flex items-center justify-center">
          <Button href={`/contact?ref=${baseCTA}`}>Contact us</Button>
          {/* <Button href={demoURL} variant="link">
            Schedule a demo
          </Button> */}
        </div>
      </section>
      <section className="my-28 pt-8">
        <Heading
          title="Check out some features you might enjoy from Inngest to fit your use case"
          description={[
            "Say goodbye to complexity and infrastructure management. Build better workflows with Inngest today.",
          ]}
        />
        <MasonryGrid
          columns={2}
          items={[
            {
              title: "Durable functions",
              description:
                "Simplify retries, timeouts, and concurrency handling for reliable backend workflows.",
              image:
                "/assets/landing-pages/durable-workflows/graphic-retries.svg",
            },
            {
              title: "Workflow orchestration",
              description:
                "Coordinate multi-step workflows with event-driven orchestration and full execution visibility.",
              image:
                "/assets/landing-pages/legacy-queuing/graphic-step-orchestration.svg",
            },
            {
              title: "Flow control",
              description:
                "Manage task execution with ease, including parallelism, rate limiting, throttling, and prioritization.",
              image:
                "/assets/landing-pages/legacy-queuing/graphic-multi-concurrency.svg",
            },
            {
              title: "Recovery tool suite",
              description:
                "Handle errors with automatic retries, debugging tools, and a seamless workflow recovery.",
              image:
                "/assets/landing-pages/durable-workflows/graphic-replay.svg",
            },
          ]}
        />
      </section>

      <section className="my-28 py-14">
        <Heading title="Native simplicity, transparent execution" />
        <div className="md:grid md:grid-cols-2">
          <div></div>
        </div>
        <Comparison
          items={[
            {
              style: "before",
              title: "Temporal",
              children: (
                <div className="flex flex-col gap-2">
                  <p className="mb-8">
                    Temporal code is proxied through its library, altering the
                    runtime. Inngest uses native language primitives for direct
                    execution, making debugging simpler. Our open-source SDKs
                    are fully transparent.
                  </p>
                  <CodeWindow
                    className="bg-transparent rounded-sm"
                    header="activities.ts"
                    snippet={`export async function getUser(userId: string) {
  const user = await db.getUser(userId);
  if (!user) {
    throw InvalidAccountError('User not found');
  }
  return user;
}
export async function sendWelcomeEmail(email: string) {
  // ...
}
export async function startTrial(userId: string) {
  // ...
}`}
                  />
                  <CodeWindow
                    className="bg-transparent rounded-sm"
                    header="workflow.ts"
                    snippet={`import { proxyActivities } from '@temporalio/workflow';
import { ApplicationFailure } from '@temporalio/common';

export async function welcomeWorkflow(
  userSignup: { id: string }
) {
  const {
    getUser,
    sendWelcomeEmail,
    startTrial
  } = proxyActivities<typeof activities>({
    retry: {
      initialInterval: '1 second',
      maximumInterval: '1 minute',
      backoffCoefficient: 2,
      maximumAttempts: 4,
      nonRetryableErrorTypes: ['InvalidAccountError'],
    },
    startToCloseTimeout: '1 minute',
  });

  const user = await getUser(userSignup.id);

  await sendWelcomeEmail(user.email);

  try {
    await startTrial(user.id);
  } catch (e) {
    throw ApplicationFailure.create({
      message: 'Failed to start trial'
    });
  }

  return 'Workflow complete';
}`}
                  />
                  <CodeWindow
                    className="bg-transparent rounded-sm"
                    header="worker.ts"
                    snippet={`import { Worker } from '@temporalio/worker';
import * as activities from './activities';
import { namespace, taskQueueName } from './shared';

async function run() {
  // Workflows are loaded from the workflowsPath
  // which modifies the code at runtime
  const worker = await Worker.create({
    workflowsPath: require.resolve('./workflows'),
    activities,
    namespace: 'acme-app',
    taskQueue: 'user-workflows',
  });

  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});`}
                  />
                </div>
              ),
            },
            {
              style: "after",
              title: "Inngest",
              children: (
                <div className="flex flex-col gap-2">
                  <p className="mb-8">
                    Inngest offers a simple, event-driven mental model where
                    workflows are functions tied to events, with each step
                    clearly defined. It's serverless-first and provides built-in
                    observability for seamless tracking.
                  </p>
                  <CodeWindow
                    className="bg-transparent rounded-sm"
                    header="workflows.ts"
                    snippet={`import { Inngest, NonRetriableError } from 'inngest';

export const inngest = new Inngest({
  id: 'acme-app',
});

export const welcomeWorkflow = inngest.createFunction(
  { id: 'welcome-workflow', retries: 4 },
  { event: 'user.signup'},
  async ({ event, step }) => {
    const user = await step.run('get-user', async () => {
      const user = await db.getUser(userId);
      if (!user) {
        throw NonRetriableError('User not found');
      }
      return user;
    });

    await step.run('send-welcome-email', async () => {
      await sendWelcomeEmail(user.email);
    });

    await step.run('start-trial', async () => {
      await startTrial(user.id);
    });

    return 'Workflow complete';
  }
)
`}
                  />
                  <CodeWindow
                    className="bg-transparent rounded-sm"
                    header="server.ts"
                    snippet={`import { serve } from 'inngest/express';
import { inngest, welcomeWorkflow } from './workflows';

app.use('/api/inngest', serve({
  client: inngest,
  functions: [welcomeWorkflow]
}));

app.listen(3000);`}
                  />
                </div>
              ),
            },
          ]}
        />

        <CTA
          text="Schedule a demo"
          href={`/contact?ref=${baseCTA}-comparison`}
        />
      </section>

      <section className="my-28 py-14">
        <Heading
          title="Learn more about Inngest"
          description="Discover why Inngest is the ideal queuing solution for modern development teams."
        />
        <Resources
          items={[
            {
              type: "blog",
              title: "5 Reasons Why Your Queue is Slowing You Down",
              description:
                "Common pitfalls of traditional queues and how Inngest can help.",
              url: `/blog/why-your-queue-is-slowing-you-down?ref=${baseCTA}`,
            },
            {
              type: "docs",
              title: "Basic example: Simple background job",
              description:
                "A guide on how to create the basic, queued background job and trigger it with the Inngest SDK.",
              url: `/docs/guides/background-jobs?ref=${baseCTA}`,
            },
            {
              type: "docs",
              title: "Flow control configuration",
              description:
                "Learn about the powerful options including throttling, concurrency controls, rate limiting, debounce and priority.",
              url: `/docs/guides/flow-control?ref=${baseCTA}`,
            },
          ]}
        />
      </section>
      <section className="my-28">
        <Heading
          title="Chat with our team today"
          description="Speak with a solutions engineer to learn if Inngest is right for your queuing and orchestration needs."
        />
        <div className="flex items-center justify-center">
          <Button href={`/contact?ref=${baseCTA}`}>Contact us</Button>
          {/* <Button href={demoURL} variant="link">
            Schedule a demo
          </Button> */}
        </div>
      </section>
    </>
  );
}
