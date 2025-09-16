import Image from "next/image";
import clsx from "clsx";
import Tiles from "src/components/LandingPage/Tiles";
import Header from "src/components/LandingPage/Header";
import Feature from "src/components/LandingPage/Feature";
import {
  H1,
  H2,
  commonClassNames,
  gradientClassNames,
} from "src/components/LandingPage/Heading";
import CTA from "src/components/LandingPage/CTA";
import { Button } from "components/RedesignedLanding/Button";
import FeaturesCodeBlocks from "src/components/LandingPage/FeaturesCodeBlocks";
import Resources from "src/components/LandingPage/Resources";
import CaseStudy from "src/components/LandingPage/CaseStudy";
import Quote from "src/components/Quote";
import Link from "next/link";

const ref = "product-ai";

export function AIPage({
  heroCTAs,
  heroFeature,
  showCTAs = true,
}: {
  heroCTAs?: { href: string; text: string }[];
  heroFeature?: React.ReactNode;
  showCTAs?: boolean;
}) {
  return (
    <div className="relative text-basis">
      {/* The background needs to be here with negative position to bleed under the header nav */}
      {/* <div className="absolute top-[-84px] z-0 h-[200vw] w-full bg-[url(/assets/ai/2024-11-27-hero-background.png)] bg-cover bg-top bg-no-repeat sm:h-[calc(100vw/1728*1219)]"></div> */}

      <div className="relative z-10">
        <Hero ctas={heroCTAs} featured={heroFeature} />

        <div className="my-12 flex flex-col items-center gap-6 sm:pb-8">
          <p className="mx-8 text-balance text-sm text-subtle">
            Trusted by companies innovating with AI:
          </p>
          <div className="mx-8 grid grid-cols-2 flex-wrap gap-x-4 gap-y-6 sm:flex sm:gap-x-10 sm:gap-y-8 lg:flex-nowrap">
            {[
              {
                src: "/assets/customers/cohere-logo-white.svg",
                name: "Cohere",
                scale: 1.3,
              },
              {
                src: "/assets/customers/browser-use-white.svg",
                name: "Browser Use",
                scale: 1.6,
              },
              {
                src: "/assets/customers/gumroad-logo.svg",
                name: "Gumroad",
                scale: 1.6,
              },
              {
                src: "/assets/customers/day-ai-logo.svg",
                name: "Day.ai",
                scale: 1.1,
              },
              {
                src: "/assets/customers/aomni-logo.svg",
                name: "Aomni",
                scale: 1.3,
              },
              {
                src: "/assets/customers/11x-logo.svg",
                name: "11x",
                scale: 0.9,
              },
            ].map(({ src, name, scale = 1 }, idx) => (
              <Image
                key={idx}
                src={src}
                alt={name}
                title={name}
                width={120 * 0.8 * scale}
                height={30 * 0.8 * scale}
                className={clsx(
                  "width-auto m-auto opacity-80 grayscale invert transition-all dark:invert-0",
                  `max-h-[${36 * scale}px]`,
                  idx === 4 && "hidden sm:block",
                  idx > 4 && "hidden xl:block"
                )}
              />
            ))}
          </div>
        </div>

        <section className="my-14 sm:my-28">
          <h2
            className={`mb-12 text-center text-[1.32rem] ${commonClassNames} ${gradientClassNames}`}
          >
            Built to support any AI use case
          </h2>
          <div className="mx-auto grid w-[300px] grid-cols-3 gap-6 text-sm">
            {[
              "RAG",
              "Multi-model chains",
              "Embedding pipelines",

              "GraphRAG",
              "Tree of Thoughts",
              "Tool use",
              "Prompt chaining",
              "Guardrails",
              "Observability",
              "Scoring",
              // "Hallucination detection",
              // "Cost monitoring",
            ].map((u, idx) => (
              <span
                key={idx}
                className={clsx(
                  "font-mono uppercase text-subtle",
                  idx % 2 === 1 && "text-right",
                  u.length > 10 ? "col-span-2" : "col-span-1"
                )}
              >
                {u}
              </span>
            ))}
          </div>
        </section>

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

        <section className="my-32">
          <Header
            title="AgentKit: The fastest way to build production-ready AI workflows"
            description="AgentKit is a framework for building and orchestrating AI agents, from single-model inference to multi-agent systems, enabling reliable AI at scale."
          />
          <Feature
            heading="Simplified orchestration"
            text="Define complex AI workflows in code, including agentic orchestration, and let the AgentKit handle the heavy lifting of managing dependencies, retries, and failures with ease."
            ctas={
              showCTAs
                ? [
                    {
                      href: `https://agentkit.inngest.com/?ref=${ref}`,
                      text: "Get started",
                    },
                  ]
                : []
            }
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
        </section>

        <section className="my-32">
          <Header
            title="Production-grade reliability"
            description="AgentKit workflows are production-ready with reliable orchestration, full observability, and the ability to seamlessly integrate external tools and models"
          />
          <Image
            className="mx-auto max-w-[938]"
            src="/assets/ai/2024-11-27-trace-with-tools.png"
            alt="Screenshot of the Inngest trace view with AI steps"
            width={938}
            height={289}
          />
        </section>

        <section className="my-32">
          <Header
            title={
              <>
                Introducing <Code>step.ai</Code> APIs
              </>
            }
            description="Seamlessly integrate reliable, retryable steps and achieve full observability across your AI applications and agentic workflows. These APIs are designed to simplify development and production, empowering you to iterate rapidly and ship production-ready AI products with confidence."
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
                url: `https://agentkit.inngest.com/?ref=${ref}`,
              },
              {
                type: "blog",
                title: "The principles of production AI",
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

        {/* {showCTAs && (
          <section>
            <div className="mt-12 flex items-center justify-center px-6 text-center tracking-tight text-basis">
              <div className="mx-auto mt-4 flex max-w-xl flex-col gap-6">
                <H2>This is AI product development, redefined</H2>
                <p className="text-balance text-lg md:text-xl">
                  Want to know more about how Inngest can level up your
                  production? Let's talk.
                </p>
                <CTA href={`/contact?ref=${ref}`} text="Book a demo" />
              </div>
            </div>
            <img
              className="mx-auto w-full max-w-6xl"
              src="/assets/ai/early-access-isometric-ui-image.png"
            />
          </section>
        )} */}
      </div>
    </div>
  );
}

function Hero({
  ctas = [
    {
      href: `/contact?ref=${ref}`,
      text: "Book a demo",
      variant: "default",
    },
    {
      href: `/docs/features/inngest-functions/steps-workflows/step-ai-orchestration?ref=${ref}`,
      text: "Explore the docs",
      variant: "link",
    },
  ],
  featured,
}: {
  ctas?: {
    href: string;
    text: string | React.ReactNode;
    variant?: "default" | "link";
  }[];
  featured?: React.ReactNode;
}) {
  return (
    <div className="sm:px-auto mx-auto grid max-w-[1728px] gap-12 px-4 py-8 md:grid-cols-2">
      <div className="flex flex-row items-center justify-end text-center md:text-left">
        <div className="flex shrink flex-col gap-8 md:py-8 md:pl-4 lg:max-w-[580px]">
          <H1 variant="contrast">
            Ship AI workflows and Agents to production faster
          </H1>
          <p className="text-balance text-lg text-subtle sm:text-xl md:max-w-[540px]">
            Iterate rapidly, orchestrate reliably, and scale with complete
            control. With a developer-first approach, Inngest handles the
            infrastructure, so you can focus on building AI applications — not
            backend complexity.
          </p>
          <div className="flex flex-row flex-wrap justify-center gap-4 md:justify-start">
            {ctas.map((cta) => (
              <Button variant={cta.variant} asChild>
                <Link href={cta.href}>{cta.text}</Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
      {featured ? (
        featured
      ) : (
        <Image
          className="px-4 sm:px-0"
          src="/assets/ai/2024-11-27-hero-image.png"
          alt="Mosaic screenshot of the Inngest dashboard showing a trace view for an AI workflow"
          width={941}
          height={621}
        />
      )}
    </div>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="tracking-tight text-accent-xIntense">{children}</code>
  );
}
