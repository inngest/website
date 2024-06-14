"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";

import Container from "./Container";
import CodeWindow from "src/shared/CodeWindow";
import {
  RiGridLine,
  RiBrainLine,
  RiArchiveDrawerLine,
  RiFlowChart,
  RiGitForkLine,
  RiBox1Line,
} from "@remixicon/react";
import Card from "./Card";

const snippetDurableWorkflow = `
export const processVideo = inngest.createFunction(
  fnOptions, fnListener,
  async ({ event, step }) => {
    const transcript = await step.run('transcribe-video',
      async () => deepgram.transcribe(event.data.videoUrl)
    )
    const summary = await step.run('summarize-transcript',
      async () => llm.createCompletion({
        model: "gpt-3.5-turbo",
        prompt: createSummaryPrompt(transcript),
      })
    )
    await step.run('write-to-db',
      async () => db.videoSummaries.upsert({
        videoId: event.data.videoId,
        transcript,
        summary,
      })
    )
  }
);
`;

const snippetAI = `
export const userWorkflow = inngest.createFunction(
  fnOptions, fnListener,
  async ({ event, step }) => {
    const similar = await step.run("query-vectordb",
      async () => {
        const embedding = createEmedding(event.data.input);
        return await index.query({
          vector: embedding, topK: 3
        }).matches;
      });
    const data = await step.run("generate-llm-response",
      async () =>
        await llm.createCompletion({
          model: "gpt-3.5-turbo",
          prompt: createPromptForSummary(similar),
        });
      );
    await step.run("save-to-db", async () => {
      await db.summaries.create({
        requestID: event.data.requestID, data
      });
    });
  }
);
`;

const snippetAIAgent = `
export const agent = inngest.createFunction(
  fnOptions, fnListener,
  async ({ event, step }) => {
    const plan = await step.run("create-plan", async () => {
      await llm.createCompletion({
        model: "gpt-3.5-turbo",
        prompt: createAgentPrompt(event.data.input),
      });
    });
    const reviewed = await step.waitForEvent('approval', {
      event: 'agent/plan.reviewed',
      timeout: '1h',
    });
    if (!reviewed.data.approved) return { status: "rejected" }
    const ctx = {};
    for (let action of plan.actions) {
      ctx[action.id] = await step.invoke('execute-action', {
        function: ACTIONS[action.function],
        data: ctx,
      });
    }
    // ...
  }
);
`;

const snippetBackgroundJobs = `
export const welcomeEmail = inngest.createFunction(
  {
    name: "Send welcome email",
    id: "send-welcome-email",
    concurrency: {
      limit: 10,
    }
  },
  {
    event: "clerk/user.created"
  },
  async ({ event, step }) => {
    await step.run('send-email', async () => {
      return await resend.emails.send({
        from: 'noreply@inngest.com',
        to: event.user.email,
        subject: "Welcome to Inngest!",
        react: WelcomeEmail(),
      });
    });
  }
);
`;

const snippetWorkflowEngine = `
export const engine = inngest.createFunction(
  fnOptions, fnListener,
  async ({ event, step }) => {
    const workflow = await step.run('load-workflow',
      async () =>
        db.workflows.find({
          where: { id: event.data.workflowID }
        });
    );

    for (let action of workflow) {
      const result = await step.run("run-action",
        async () => {
          return runAction(event, action);
        }
      );
    }
  }
);
`;

const content = [
  {
    title: "All",
    icon: RiGridLine,
    content: "Created for every developer and any use case.", // TODO-COPY
    highlights: [
      {
        title: "Serverless queueing and orchestration",
        content:
          "Queues are created on-demand for every function ith automatic scaling and sharding.",
      },
      {
        title:
          "Multi-tenant concurrency, throttle, debounce, priority, and more.",
        content:
          "All aspects of flow control handled by Inngest with simple configuration, with built-in support for your own multi-tenant system.",
      },
      {
        title: "Batching, fan-out, and scheduling",
        content: "Essential controls for any type of job or workflow creation.",
      },
    ],
    snippet: snippetAI,
    href: "/ai?ref=homepage",
  },
  {
    title: "AI",
    icon: RiBrainLine,
    content: "Created for every developer and every use case.", // TODO-COPY
    highlights: [
      {
        title: "Serverless queueing and orchestration",
        content:
          "Queues are created on-demand for every function ith automatic scaling and sharding.",
      },
      {
        title: "Add",
        content: "Created for every developer and every use case.",
      },
      {
        title: "Add",
        content: "Created for every developer and every use case.",
      },
    ],
    snippet: snippetAI,
    href: "/ai?ref=homepage",
  },
  {
    title: "Queuing",
    icon: ({ className }) => (
      <RiGitForkLine className={`${className} -rotate-90`} />
    ),
    content: "Created for every developer and every use case.", // TODO-COPY
    highlights: [
      {
        title: "Serverless queueing and orchestration",
        content:
          "Queues are created on-demand for every function ith automatic scaling and sharding.",
      },
      {
        title: "Add",
        content: "Created for every developer and every use case.",
      },
      {
        title: "Add",
        content: "Created for every developer and every use case.",
      },
    ],
    snippet: snippetAI,
    href: "/ai?ref=homepage",
  },
  {
    title: "Workflows",
    icon: RiFlowChart,
    content: "Created for every developer and every use case.", // TODO-COPY
    highlights: [
      {
        title: "Serverless queueing and orchestration",
        content:
          "Queues are created on-demand for every function ith automatic scaling and sharding.",
      },
      {
        title: "Add",
        content: "Created for every developer and every use case.",
      },
      {
        title: "Add",
        content: "Created for every developer and every use case.",
      },
    ],
    snippet: snippetAI,
    href: "/ai?ref=homepage",
  },
  {
    title: "Data",
    icon: RiArchiveDrawerLine,
    content: "Created for every developer and every use case.", // TODO-COPY
    highlights: [
      {
        title: "Serverless queueing and orchestration",
        content:
          "Queues are created on-demand for every function ith automatic scaling and sharding.",
      },
      {
        title: "Add",
        content: "Created for every developer and every use case.",
      },
      {
        title: "Add",
        content: "Created for every developer and every use case.",
      },
    ],
    snippet: snippetAI,
    href: "/ai?ref=homepage",
  },
  {
    title: "Product",
    icon: RiBox1Line,
    content: "Created for every developer and every use case.", // TODO-COPY
    highlights: [
      {
        title: "Serverless queueing and orchestration",
        content:
          "Queues are created on-demand for every function ith automatic scaling and sharding.",
      },
      {
        title: "Add",
        content: "Created for every developer and every use case.",
      },
      {
        title: "Add",
        content: "Created for every developer and every use case.",
      },
    ],
    snippet: snippetAI,
    href: "/ai?ref=homepage",
  },
];

export default function TabsContainer() {
  const [selected, setSelected] = useState(0);
  const selectedContent = content[selected];
  return (
    <Container>
      <div className="max-w-6xl mx-auto my-8">
        <div className="mb-8 border-b border-carbon-800">
          <Container className="mx-auto flex flex-wrap gap-y-2 justify-stretch">
            {content.map(({ title, ...tab }, idx) => (
              <Tab
                key={idx}
                isSelected={selected === idx}
                onClick={() => setSelected(idx)}
              >
                <tab.icon className="h-6 w-6 fill-[#1CB4D5]" />
                {title}
              </Tab>
            ))}
          </Container>
        </div>
        <Container className="grid grid-rows-auto grid-cols-1 md:grid-cols-8 gap-4 my-12">
          <div className="flex flex-col md:col-span-4">
            <div className="flex flex-col gap-8">
              <p className="text-2xl font-bold text-body">
                {selectedContent.content}
              </p>
              <div className="flex flex-col grow gap-4">
                {selectedContent.highlights.map(({ title, content }) => (
                  <Card>
                    <h3 className="font-bold">{title}</h3>
                    {content}
                  </Card>
                ))}
              </div>
            </div>
            <div className="pt-8">
              <Link
                href={`${selectedContent.href}?ref=homepage-use-cases}`}
                className="inline-flex mx-auto rounded-md font-medium px-6 py-2 bg-cta hover:bg-ctaHover transition-all text-carbon-1000 whitespace-nowrap"
              >
                Learn more
              </Link>
            </div>
          </div>

          {/* The min height here is for the longest code snippet that we show */}
          <div className="md:col-span-4">
            <div
              className="md:min-h-[492px] md:max-w-[520px] py-2 px-1 ml-auto border border-carbon-800 rounded-2xl
         shadow-[0_0_220px_16px_rgba(20,284,286,0.2)]"
            >
              <CodeWindow
                snippet={selectedContent.snippet}
                className="border-0 bg-transparent"
              />
            </div>
          </div>
        </Container>
      </div>
    </Container>
  );
}

function Tab({ isSelected = false, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        `flex flex-row grow gap-2 items-center justify-center p-4 -mb-px whitespace-nowrap `,
        `text-base font-semibold transition-all text-white border-b-2`,
        isSelected ? "border-[#1CB4D5]" : "border-transparent"
      )}
    >
      {children}
    </button>
  );
}
