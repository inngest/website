"use client";

import { useState } from "react";
import Link from "next/link";

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
import Card from "src/components/Card";
import Feature from "src/components/Feature";
import { Tabs } from "src/components/Tabs";

const snippetAll = `
export const processVideo = inngest.createFunction(
  { id: "process-video",
    concurrency: { limit: 5, key: "event.data.userId" } },
  { event: "video/uploaded" },
  async ({ event, step }) => {

    // step.run is a code-level transaction:  it retries automatically
    // on failure and only run once on success.
    const transcript = await step.run('transcribe-video',
      async () => deepgram.transcribe(event.data.videoUrl)
    )

    // function state is automatically managed for fault tolerance
    // across steps.
    const summary = await step.run('summarize-transcript',
      async () => llm.createCompletion({
        model: "gpt-4o",
        prompt: createSummaryPrompt(transcript),
      })
    )

    // easily chain a series of calls without managing infrastructure.
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
  { throttle: { limit: 30, period: "60s"  } /* ... */ },
  { event: "agent/request.received" },
  async ({ event, step }) => {

    // step.run is a code-level transaction:  it retries automatically
    // on failure and only run once on success.
    const similar = await step.run("query-vectordb",
      async () => {
        const embedding = createEmedding(event.data.input);
        return await index.query({
          vector: embedding, topK: 3
        }).matches;
      });

    // dynamically create deterministic user-generated agentic workflows
    const actions = await step.run("get-agent-actions",
      async () =>
        await agent.getActions({
          model: "gpt-4o",
          request: event.data.input,
          similar,
        });
      );

    // run agentic workflows by writing regular code
    for (let action of actions) {
      await step.run("run-action", async () => {
        await actions[action.id].execute(event.data.input);
      });
    }
  }
);
`;

// { debounce: { period: "5m", key: "event.data.userId"  } /* ... */ },
const snippetQueueing = `
export const importJob = inngest.createFunction(
  { priority: { run: "event.data.plan == 'paid' ? 120 : 0"  } /* ... */ },
  { event: "integration/import.initiated" },
  async ({ event, step }) => {

    // step.run is a code-level transaction:  it retries automatically
    // on failure and only run once on success, automatically backed
    // by queues.
    const data = await step.run("fetch-data-via-api", async () => {
      const credentials = await db.credentials.find(
        event.data.credentialsId);
      return await api.fetchAllRecords(credentials);
    });

    // chain calls without provisioning queues or managing state 
    await step.run("insert-data", async () => {
      await db.data.insert(data);
    });

    await step.run("run-aggregation", async () => {
      await runAggregation(db, event.data.userId);
    });
  }
);
await inngest.send({
  event: "integration/import.initiated",
  data: {/* ... */}
});
`;

const snippetDurableWorkflow = `
export const sendNotifications = inngest.createFunction(
  { id: "send-notifications" }, {/*...*/},
  async ({ event, step }) => {
    const preferences = await step.run("load-prefs", async () => {
      const user = await db.users.find(event.data.userId)
      return user.loadPreferences();
    });

    // Use language-specific idioms like Promise.all to automatically
    // parallelize steps.
    await Promise.all([
      step.run("send-to-slack", async () => {
        await app.client.chat.postMessage({
          channel: preferences.slackChannelId,
          blocks: formatBlocks(event.data.notification),
          // ...
        });
      }),
      step.run("send-via-sms", async () => {
        await client.messages.create(...);
      }),
    ]);
  }
);
`;

const snippetData = `
export const etl = inngest.createFunction(
  { batch: { maxSize: 100, timeout: "30s" }, /* ... */ },
  { event: "ecommerce/product.purchased" },
  async ({ events, step }) => {

    let enrichedData = [];
    for (let event of events) {
      const data = await step.invoke('enrich-data', {
        function: enrichDataFromThirdPartyFn,
        data: event.data,
      });
      enrichedData.push(data);
    }

    await step.run('bulk-insert', async () => {
      await db.productMetrics.insertMany(enrichedData);
    });
  }
);
`;

const snippetProduct = `
export const workflowEngine = inngest.createFunction(
  { id: "workflow-engine" },
  { event: "api/workflow.invoked" },
  async ({ event, step }) => {

    // Deterministically load a users workflow once in a code-level
    // transaction.
    const workflow = await step.run('load-workflow',
      async () =>
        db.workflows.find({
          where: { id: event.data.workflowID }
        });
    );

    // Iterate over the user-defined workflow actions
    // use a simple stack or traverse a DAG
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

const content = [
  {
    title: "All",
    icon: RiGridLine,
    content: (
      <>
        Flexible enough for all use cases, powerful enough for advanced
        requirements.
      </>
    ),
    highlights: [
      {
        title: <>Run on serverless, servers, or both.</>,
        content: (
          <>
            Deploy your Inngest functions to your existing platform or infra,
            Inngest securely invokes your jobs wherever the code runs.
          </>
        ),
      },
      {
        title:
          "Multi-tenant concurrency, throttle, debounce, priority, and more.",
        content: (
          <>
            Control exactly how your functions are run with built-in flow
            control. Forget about queues, workers, and customer logic.
          </>
        ),
      },
      {
        title: "Batching, fan-out, and scheduling",
        content: "Essentials for any type of job or workflow creation.",
      },
    ],
    snippet: snippetAll,
    href: "/docs/features/inngest-functions?ref=homepage",
  },
  {
    title: "AI",
    icon: RiBrainLine,
    content: (
      <>Use simple primitives to build complex AI workflows and agents.</>
    ),
    highlights: [
      {
        title: "Chain steps for powerful features",
        content:
          "Run complex and expensive steps once and only once, then reuse the results. Run in parallel or in sequence.",
      },
      {
        title: "Automatic retries for flaky LLM APIs",
        content: (
          <>
            Retry requests automatically when they fail or hallucinate. Create
            more reliable AI enabled features.
          </>
        ),
      },
      {
        title: "Throttle and debounce",
        content:
          "Use throttle to keep within API limits and debounce to prevent duplicate work wasting expensive API calls.",
      },
    ],
    snippet: snippetAI,
    href: "/ai?ref=homepage",
  },
  {
    title: "Queueing",
    icon: ({ className }) => (
      <RiGitForkLine className={`${className} -rotate-90`} />
    ),
    content: (
      <>From simple background jobs to high-volume queueing workloads.</>
    ),
    highlights: [
      {
        title: "Priority",
        content:
          "Dynamically set the priority of select jobs without the need for separate queues.",
      },
      {
        title: "Batch processing",
        content:
          "Efficiently process large volumes of data to save costs and improve performance.",
      },
      {
        title: "Add steps for durability",
        content:
          "Break jobs into smaller steps for increased durability. Never re-run work unnecessarily again.",
      },
      // IDEA: Could also call out step sleep etc.
      // IDEA: Could call out fan-out
    ],
    snippet: snippetQueueing,
    href: "/uses/serverless-node-background-jobs?ref=homepage",
  },
  {
    title: "Workflows",
    icon: RiFlowChart,
    content:
      "Create complex workflows without managing state, multiple queues or scheduling.",
    highlights: [
      {
        title: "Run steps in parallel or in sequence",
        content:
          "Parallelize work to for faster execution. Run steps in sequence to ensure order and consistency.",
      },
      {
        title: "Develop and debug complex flows with ease",
        content:
          "Use Inngest's developer tools to visualize workflows during development or when debugging in production.",
      },
      {
        title: "Wait for additional input",
        content:
          "Use step.waitForEvent to pause a workflow for hours or days until additional input or events are received.",
      },
      // IDEA: Mention invoking other functions
    ],
    snippet: snippetDurableWorkflow,
    href: "/uses/durable-workflows?ref=homepage",
  },
  {
    title: "Data",
    icon: RiArchiveDrawerLine,
    content:
      "Build pipelines, ETL jobs, and data processing workflows in code, not abstract DAGs.",
    highlights: [
      {
        title: "Process data in real-time or in batch",
        content:
          "Process high volume data quickly or batch for more efficiency.",
      },
      {
        title: "Re-run failed steps without re-running the entire job",
        content:
          "Steps only run once, even if the job is re-run. No duplicated work during expensive, long import jobs.",
      },
      {
        title: "Event-driven data processing",
        content:
          "Leverage Inngest's event-driven approach that algins with how you think about your system.",
      },
    ],
    snippet: snippetData,
    href: "/customers/fey?ref=homepage",
  },
  {
    title: "Product",
    icon: RiBox1Line,
    content:
      "Extend powerful, customizable logic to your user right in your product.", // TODO-COPY
    highlights: [
      {
        title:
          "Build your own workflow system on top of Inngest's execution engine",
        content:
          "Use the Inngest SDK primitives to build a customizable workflow engine for your users without months of development.",
      },
      {
        title: "User journey automation",
        content:
          "Automate user journeys from post-signup to billing and dunning processes. Fan-out to re-use events across multiple functions.",
      },
      {
        title: "Schedule or delay execution",
        content:
          "Schedule when a function should execute at a specific time. Add delays in the middle of functions for hours, days, or weeks.",
      },
    ],
    snippet: snippetProduct,
    // TODO - This is a weird kind of link to use
    href: "/uses/workflow-engine?ref=homepage",
  },
];

export default function UseCases() {
  const [selected, setSelected] = useState(0);
  const selectedContent = content[selected];
  return (
    <Container>
      <div className="max-w-6xl mx-auto my-8">
        <div className="mb-8 border-b border-subtle">
          <Container className="mx-auto">
            <Tabs
              content={content}
              setSelected={setSelected}
              selected={selected}
            />
          </Container>
        </div>
        {/* height of the largest code snippet */}
        <Container className="grid grid-rows-auto grid-cols-1 md:grid-cols-8 gap-4 my-12 lg:min-h-[636px]">
          <div className="flex flex-col md:col-span-4">
            <div className="flex flex-col gap-12">
              <p className="text-xl font-bold text-basis text-balance">
                {selectedContent.content}
              </p>
              <div className="flex flex-col grow gap-10 max-w-md">
                {selectedContent.highlights.map(({ title, content }, idx) => (
                  <Feature title={title} description={content} key={idx} />
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
              className="md:min-h-[492px] py-2 px-1 ml-auto border border-subtle rounded-2xl
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
