import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";

import Container from "../layout/Container";
import Heading from "./Heading";
import CodeWindow from "../CodeWindow";
import { ArrowDownIcon } from "@heroicons/react/24/outline";

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
    title: "LLM Chains",
    content: (
      <p>
        Get your LLM apps running in production without the complexity of glue
        code and additional infrastructure.
      </p>
    ),
    bullets: [
      <>Handle complex text-generation with chain-based post-processing.</>,
      <>
        Leverage Retrieval Augmented Generation (RAG) by querying vector stores
        without complex interfaces and building ingestion functions.
      </>,
      <>Wrap steps to run exactly once to reduce extra, expensive API calls.</>,
      <>Limit concurrency and prioritize jobs ahead of others</>,
    ],
    snippet: snippetAI,
    href: "/ai?ref=homepage",
  },
  {
    title: "AI Agents",
    content: (
      <p>
        Build long-running autonomous agent functions that make decisions and
        call other functions to complete complex tasks.
      </p>
    ),
    bullets: [
      <>
        Define human-in-the-loop flows that wait for approval or additional
        input.
      </>,
      <>Create functions that track state across actions</>,
      <>Define actions as normal functions with built-in retries</>,
      <>Build a system of multiple agents that work together</>,
    ],
    snippet: snippetAIAgent,
    href: "/ai?ref=homepage",
  },
  {
    title: "Durable workflows",
    content: (
      <p>
        Combine any complex series of tasks into a single reliable workflow.
        Each task becomes a “step” which is automatically retried when errors
        happen.
      </p>
    ),
    bullets: [
      <>Run steps in parallel or series or call a child workflow.</>,
      <>
        Add durable sleep to pause your workflow for days or weeks at a time.
      </>,
      <>
        Visually debug the entire workflow without having to parse logs and
        connect the dots.
      </>,
    ],
    snippet: snippetDurableWorkflow,
    href: "/uses/durable-workflows?ref=homepage",
  },
  {
    title: "Background jobs",
    content: (
      <p>Write declarative background jobs without queues or infrastructure.</p>
    ),
    bullets: [
      <>Run your code in serverless, servers, or on the edge.</>,
      <>Fan-out work to multiple functions from a single event trigger.</>,
      <>Logs and observability metrics out-of-the-box.</>,
    ],
    snippet: snippetBackgroundJobs,
    href: "/uses/serverless-node-background-jobs?ref=homepage",
  },
  {
    title: "Workflow engines",
    content: (
      <p>
        Create a user-customizable workflow engine right in your product without
        having to build the engine itself.
      </p>
    ),
    bullets: [
      <>Build linear or complex DAG-workflows with our SDK's primitives.</>,
      <>
        Handle concurrency, prioritization and debounce in line with your user's
        limits.
      </>,
      <>
        Easily audit, observe and scale your product without breaking a sweat.
      </>,
    ],
    snippet: snippetWorkflowEngine,
    href: "/uses/workflow-engine?ref=homepage",
  },
];

export default function UseCases() {
  return (
    <Container className="mt-12">
      {/* <Heading
        title="Ship the impossible. Today."
        lede={
          <>
            Using simple primitives you can build the most complex systems
            without the stress.
          </>
        }
        className="text-center"
      /> */}

      <UseCaseGrid />

      {/* TODO - List all other use cases with links */}
    </Container>
  );
}

function UseCaseGrid() {
  const [selected, setSelected] = useState(0);
  const selectedContent = content[selected];
  return (
    <div className="max-w-6xl mx-auto my-16">
      <p className="text-slate-300 text-base md:text-lg">
        Build powerful products without the complexity:
      </p>
      <div className="mx-auto my-6 flex flex-wrap gap-x-6 gap-y-2 justify-start">
        {content.map(({ title, content, bullets, href }, idx) => (
          <Option
            key={idx}
            isSelected={selected === idx}
            onClick={() => setSelected(idx)}
          >
            {title}
            <div
              className={clsx(
                `inline-flex ml-2 overflow-hidden w-0 transition-all outline-none`,
                selected === idx && "w-4"
              )}
            >
              <ArrowDownIcon className="h-4 w-4 inline" />
            </div>
          </Option>
        ))}
      </div>
      <div
        className={`
        grid grid-rows-auto grid-cols-1 md:grid-cols-8 p-px gap-px mx-auto
        rounded-md bg-gradient-to-tl from-green-800/60 via-orange-300/60 to-rose-900/60
        transition-all
        shadow-[0_10px_100px_0_rgba(52,211,153,0.20)]`}
      >
        <div className="flex flex-col md:col-span-4 md:rounded-tl-md">
          <div className="flex flex-col gap-8 p-8 grow md:rounded-tl-md bg-slate-1000 ">
            {selectedContent.content}
            {/* </div>
          <div className="pb-8 grow bg-slate-1000"> */}
            <ul className="list-disc ml-4 flex flex-col grow gap-2">
              {selectedContent.bullets.map((b) => (
                <li>{b}</li>
              ))}
            </ul>
          </div>
          <div className="p-8 md:rounded-bl-md bg-slate-1000">
            <Link
              href={`${selectedContent.href}?ref=homepage-use-cases}`}
              className="mx-auto rounded-md font-medium px-6 py-2 bg-slate-800 hover:bg-slate-600 transition-all text-white border border-slate-800 hover:border-slate-600 hover:bg-slate-500/10 whitespace-nowrap"
            >
              <span className="hidden md:inline">
                Learn about {selectedContent.title} with Inngest
              </span>
              <span className="md:hidden">Learn more</span> →
            </Link>
          </div>
        </div>

        {/* The min height here is for the longest code snippet that we show */}
        <div className="md:col-span-4 md:min-h-[492px] md:rounded-r-md bg-slate-1000">
          <CodeWindow
            snippet={selectedContent.snippet}
            className="border-0 bg-transparent"
          />
        </div>
      </div>
    </div>
  );
}

function Option({ isSelected = false, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        `whitespace-nowrap text-base sm:text-lg md:text-xl xl:text-2xl font-semibold transition-all`,
        `hover:underline hover:text-white/90`,
        isSelected ? "text-white" : "text-slate-400"
      )}
    >
      {children}
    </button>
  );
}
