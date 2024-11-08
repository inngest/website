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
  title: "Create user-customizable workflows in your product",
  description:
    "Build user-defined workflows directly in your product leveraging Inngest as the battle-tested orchestration engine.",
});

const baseCTA = "workflow-engine";

export default function Page() {
  return (
    <>
      <Hero
        headline="Launch customizable workflows, in weeks"
        subheadline="Build user-defined workflows directly in your product leveraging Inngest as the battle-tested orchestration engine."
        ctas={[
          {
            href: `/contact?ref=${baseCTA}-hero`,
            text: "Chat with solutions engineering",
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
      <section className="relative mb-14">
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

        <Image
          className="mx-auto max-w-4xl rounded-md"
          src="/assets/blog/introducing-workflow-kit/workflow-kit-architecture-dark.jpg"
          alt="Workflow Kit architecture"
          width={896}
          height={(896 / 744) * 445}
        />

        <CTA
          text="Chat with a solutions expert"
          href={`/contact?ref=${baseCTA}`}
        />
      </section>

      <section className="my-28 py-14">
        <Heading
          title="Announcing: Workflow Kit by Inngest"
          description={[
            "Workflow Kit enables you to build user-defined workflows with Inngest by providing a set of workflow actions to the Workflow Engine while using the pre-built React components to build your Workflow Editor UI.",
            "Fully open source and available on npm. Install and start building today.",
          ]}
        />

        <FeaturesCodeBlocks
          features={[
            {
              title: "Define available actions",
              description:
                "Define re-usable actions that your users can use to build their own workflows.",
              codeBlock: `import { Engine } from "@inngest/workflow";

const workflowEngine = new Engine({
  actions: [
    {
      kind: "add_ToC",
      name: "Add a Table of Content",
      description: "Add a Table of Content",
      handler: async ({ event, step, workflowAction }) => {
        await step.run("generate-toc-for-article", async () => {
          await openai.chat.completions.create({ /* ... */ })
        });
      },
    },
    // ...
  ],
  loader: async function (event) {
    return loadWorkflowFromDatabase(event)
  },
});`,
            },
            {
              title: "Drop-in ready React components",
              description:
                "Use a pre-built workflow editor UI built on React Flow.",
              codeBlock: `import { Editor, Provider, Sidebar } from "@inngest/workflow/ui";
import { actions } from "@/inngest/workflowActions";

export const AutomationEditor = ({ workflow }: { workflow: Workflow }) => {
  const [workflowDraft, updateWorkflowDraft] =
    useState<typeof workflow>(workflow);

  return (
    <Provider
      key={workflowDraft?.id}
      workflow={workflowDraft?.workflow}
      trigger={{
        event: {
          name: workflowDraft.trigger,
        },
      }}
      availableActions={actions}
      onChange={(updated) => {
        updateWorkflowDraft({ ...workflowDraft, workflow: updated });
      }}
    >
      <Editor>
        <Sidebar position="right">
          <></>
        </Sidebar>
      </Editor>
    </Provider>
  );
};`,
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
