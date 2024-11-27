import { type Metadata } from "next";
import Image from "next/image";
import { generateMetadata } from "src/utils/social";
import Tiles from "src/components/LandingPage/Tiles";
import Header from "src/components/LandingPage/Header";
import Feature from "src/components/LandingPage/Feature";
import { H1, H2 } from "src/components/LandingPage/Heading";
import CTA from "src/components/LandingPage/CTA";
import Button from "src/components/LandingPage/Button";
import FeaturesCodeBlocks from "src/components/LandingPage/FeaturesCodeBlocks";
import Resources from "src/components/LandingPage/Resources";
import CaseStudy from "src/components/LandingPage/CaseStudy";
import Quote from "src/components/Quote";
import { RiArrowRightLine } from "@remixicon/react";

export const metadata: Metadata = generateMetadata({
  title: "AI",
  description:
    "Orchestration for AI workflows and AI agents. Build, iterate and ship to production with confidence.",
});

const ref = "ai-landing-page";

export default function Page() {
  return (
    <div className="relative text-basis">
      {/* The background needs to be here with negative position to bleed under the header nav */}
      <div className="absolute z-0 top-[-84px] w-full h-[calc(100vw/1728*1219)] bg-[url(/assets/ai/2024-11-27-hero-background.png)] bg-cover bg-no-repeat bg-bottom"></div>

      <div className="relative z-10">
        <Hero />

        <section className="my-28">
          <Header
            title="Meet the demands of complex AI workflows"
            description="Inngest simplifies the orchestration of AI agents, ensuring your applications run reliably and efficiently in production. From complex agentic workflows to long-running processes, Inngest provides the tools you need to focus on building AI applications while leaving the complexities of orchestration to us."
          />
          <Tiles
            height="large"
            tiles={[
              {
                heading: "Reliable orchestration",
                text: "Handle workflows across multiple models, external tools, and data sources with full observability and retries to gracefully manage failures.",
              },
              {
                heading: "Efficient resource management",
                text: (
                  <>
                    Use <Code>step.ai.infer</Code> to proxy long-running LLM
                    requests, reducing serverless compute costs while gaining
                    enhanced telemetry.
                  </>
                ),
              },
              {
                heading: "Rapid iteration",
                text: "Debug agentic workflows locally with Inngest's Dev Server for faster development and testing.",
              },
              {
                heading: "Scalable for production",
                text: "Deliver AI applications with the reliability and observability needed to understand and optimize customer workloads in production.",
              },
              {
                heading: "Focus on AI engineering",
                text: "Use Inngest's SDKs, including AgentKit, to define workflows in code and leave orchestration complexities to us.",
              },
            ]}
          />
        </section>

        <section className="my-28">
          <Header
            title="AgentKit: The fastest way to build production-ready AI workflows"
            description="AgentKit is a framework for building and orchestrating AI agents, from single-model inference to multi-agent systems, enabling reliable AI at scale."
          />
          <Feature
            heading="Simplified orchestration"
            text="Define complex AI workflows in code, including agentic orchestration, and let the AgentKit handle the heavy lifting of managing dependencies, retries, and failures with ease."
            ctas={[
              {
                href: `/docs/agent-kit/overview?ref=${ref}`,
                text: "Get started",
              },
            ]}
            content={{
              code: {
                snippet: `// Define simple agents
const writer = new Agent({
  name: "writer",
  system: "You are an expert writer. " +
    "You write readable, concise, simple content.",
  model: openai({ model: "gpt-4o", step }),
});

// Compose into networks of agents that can work together
const network = new Network({
  agents: [writer],
  defaultModel: openai({ model: "gpt-4o", step }),
})`,
                language: "typescript",
              },
            }}
          />
          <Feature
            heading="Locally debug for faster iteration"
            text="Debug and test your workflows locally with Inngest's Dev Server, providing the tools to iterate quickly and refine agentic workflows before shipping to production."
            content={{
              image: {
                src: "/assets/ai/2024-11-27-prompt-debug.png",
                alt: "Screenshot of the Inngest prompt playground",
                height: 414,
                width: 663,
              },
            }}
            layout="right"
          />
          <Feature
            heading="Production-grade reliability"
            text="AgentKit workflows are production-ready with reliable orchestration, full observability, and the ability to seamlessly integrate external tools and models"
            content={{
              image: {
                src: "/assets/ai/2024-11-27-trace-view.png",
                alt: "Screenshot of the Inngest trace view with AI steps",
                height: 414,
                width: 663,
              },
              fullBleed: true,
            }}
          />
        </section>

        <section className="my-28">
          <Header
            title={
              <>
                Introducing <Code>step.ai</Code> APIs
              </>
            }
            description="Overview copy: Seamlessly integrate reliable, retryable steps and achieve full observability across your AI applications and agentic workflows. These APIs are designed to simplify development and production, empowering you to iterate rapidly and ship production-ready AI products with confidence."
          />
          <FeaturesCodeBlocks
            features={[
              {
                title: (
                  <>
                    Extend existing code reliability with{" "}
                    <Code>step.ai.wrap</Code>
                  </>
                ),
                description:
                  "Wrap any AI SDK with step.ai.wrap to ensure reliable execution of AI tasks. Gain complete visibility into request and response data, with built-in retries to handle failures gracefully and keep workflows running smoothly.",
                codeBlock: `import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export default inngest.createFunction(
  { id: "summarize-contents" },
  { event: "app/ticket.created" },
  async ({ event, step }) => {

    // This calls generateText with the given arguments, adding AI observability,
    // metrics, datasets, and monitoring to your calls.
    const { text } = await step.ai.wrap("using-vercel-ai", generateText, {
      model: openai("gpt-4-turbo"),
      prompt: "What is love?"
    });

  }
);`,
              },
              {
                title: (
                  <>
                    Secure inference with <Code>step.ai.infer</Code>
                  </>
                ),
                description:
                  "Offload inference requests securely to any inference API using step.ai.infer, powered by Inngest's infrastructure. This reduces serverless compute costs while providing enhanced observability into every inference request and response.",
                codeBlock: `export default inngest.createFunction(
  { id: "summarize-contents" },
  { event: "app/ticket.created" },
  async ({ event, step }) => {

    // This calls your model's chat endpoint, adding AI observability,
    // metrics, datasets, and monitoring to your calls.
    const response = await step.ai.infer("call-openai", {
      model: step.ai.models.openai({ model: "gpt-4o" }),
      body: {
        messages: [{
          role: "assistant",
          content: "Write instructions for improving short term memory",
        }],
      },
    });
  }
);`,
              },
            ]}
          />
        </section>

        <section className="my-28 py-14">
          <CaseStudy
            title="Aomni: Productionizing AI-driven sales flows using serverless LLMs"
            description={[
              "Learn how Aomni built and scaled their AI research analyst to deliver deal-critical insights, analysis and automations to strategic sellers.",
              "Aomni leverages Inngest's platform for orchestration of chained LLM calls, including tree of thought, chain of thought, and retrieval augmented generation (RAG).",
            ]}
            href={`/customers/aomni?ref=${ref}`}
            image="/assets/ai/2024-11-27-customer-aomni.webp"
          />

          <Quote
            text={`For anyone who is building multi-step AI agents (such as AutoGPT type systems), I highly recommend building it on top of Inngest's job queue orchestration framework, the traceability it provides out of the box is super useful, plus you get timeouts & retries for free.`}
            attribution={{
              name: "David Zhang",
              title: "Founder, Aomni",
              avatar: "/assets/customers/aomni-david.jpg",
            }}
            variant="box"
          />
        </section>

        <section className="my-28 pt-14">
          <Header
            title="Learn more about Inngest"
            description="Explore how Inngest's orchestration and tooling can help you bring your AI use case to production."
          />
          <Resources
            items={[
              {
                type: "docs",
                title: "AgentKit",
                description:
                  "Learn how to use AgentKit to build, test and deploy reliable AI workflows.",
                url: `/docs/agent-kit/overview?ref=${ref}`,
              },
              {
                type: "blog",
                title: "The principles of produciton AI",
                description:
                  "How LLM evaluations, guardrails, and orchestration shape safe and reliable AI experiences.",
                url: `/blog/principles-of-production-ai?ref=${ref}`,
              },
              {
                type: "blog",
                title:
                  "Agentic workflow example: importing CRM contacts with Next.js and OpenAI o1",
                description:
                  "A reimagined contacts importer leveraging the power of reasoning models with Inngest",
                url: `/blog/agentic-workflow-example?ref=${ref}`,
              },
            ]}
          />
        </section>

        <section>
          <div className="mt-12 px-6 flex items-center justify-center tracking-tight text-basis text-center">
            <div className="max-w-xl mx-auto mt-4 flex flex-col gap-6">
              <H2>AI early access program</H2>
              <p className="text-lg md:text-xl">
                Be the first to get access to and stay in the loop about our
                latest AI features, including <code>step.ai</code>,{" "}
                <strong>AgentKit</strong> and more.
              </p>
              <CTA
                href={`ai/early-access?ref=${ref}`}
                text="Sign up for early access"
              />
            </div>
          </div>
          <img
            className="max-w-6xl w-full mx-auto"
            src="/assets/ai/early-access-isometric-ui-image.png"
          />
        </section>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <div className="py-8 mx-auto max-w-[1728px] grid md:grid-cols-2 gap-12">
      <div className="flex flex-row items-center justify-end">
        <div className="flex flex-col gap-8 md:max-w-[600px]">
          <H1 variant="contrast">
            Ship AI workflows and Agents to production faster
          </H1>
          <p className="text-subtle text-lg sm:text-xl text-balance md:max-w-[540px]">
            Iterate rapidly, orchestrate reliably, and scale with complete
            control. With a developer-first approach, Inngest handles the
            infrastructure, so you can focus on building AI applications — not
            backend complexity.
          </p>
          <div className="flex flex-row gap-4">
            <Button variant="primary" href={`ai/early-access?ref=${ref}`}>
              Sign up for early access
            </Button>
            <Button variant="link" href={`ai/early-access?ref=${ref}`}>
              Explore the docs <RiArrowRightLine className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <Image
        src="/assets/ai/2024-11-27-hero-image.png"
        alt="Mosaic screenshot of the Inngest dashboard showing a trace view for an AI workflow"
        width={941}
        height={621}
      />
    </div>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="text-accent-xIntense tracking-tight">{children}</code>
  );
}
