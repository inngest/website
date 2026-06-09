import SharedFaq, { type Faq as FaqItem } from "@/components/v1/sections/AI/Faq";

/**
 * Compare-to-Temporal FAQ — reuses the shared AI/Faq accordion with the
 * Temporal-specific question set.
 */

const FAQS: FaqItem[] = [
  {
    id: "scale",
    question: "Can Inngest handle the same scale as Temporal?",
    answer:
      "Inngest orchestrates AI workflows by invoking your functions via HTTP between steps. You write workflows as normal async functions and wrap logic in step.run(). Inngest handles retry logic, state, and scheduling between steps — no extra queues, workers, or stateful backends required.",
    link: { label: "Quick-start guide", href: "/docs/getting-started/nextjs-quick-start" },
  },
  {
    id: "prototypes",
    question: "Is Inngest just for prototypes and small apps?",
    answer:
      "No. This is a common misconception based on how easy Inngest is to get started with. Ease of setup is a product decision, not a capacity ceiling. Inngest runs production workloads at companies processing millions of events daily. Small teams ship faster with it. Large teams don't outgrow it.",
  },
  {
    id: "temporal-cloud",
    question: "Doesn't Temporal Cloud remove the infrastructure burden?",
    answer:
      "Partially. Temporal Cloud removes the need to self-host the Temporal cluster, but you still run and manage your own worker fleet — the processes that pull and execute your workflows. With Inngest, there are no workers to run at all. Your existing deployment is the worker. Inngest invokes your functions via HTTP.",
  },
  {
    id: "open-source",
    question: "Is Inngest open-source? Can I self-host it?",
    answer:
      "Yes. Inngest is open-source and can be self-hosted. The cloud product adds managed infrastructure, observability, and reliability on top — but the core engine is yours to run.",
  },
  {
    id: "github-stars",
    question: "Temporal has far more GitHub stars — doesn't that mean it's better?",
    answer:
      "Temporal has been around longer and targets a different audience — large engineering teams with dedicated platform engineers who can manage distributed worker infrastructure. Inngest is newer and optimized for teams who want durable execution without that operational overhead. Stars reflect history and audience, not fit for your use case.",
  },
  {
    id: "migrate",
    question: "Can I migrate from Temporal to Inngest?",
    answer:
      "Yes. The core concepts map directly: Temporal Workflows become Inngest functions, Activities become step.run() calls. The main shift is architectural — you stop running workers and let Inngest invoke your existing deployment instead. Most teams migrate incrementally, running both in parallel during the transition.",
  },
  {
    id: "cost",
    question: "How does cost actually compare?",
    answer:
      "Temporal Cloud starts at $100/month plus the cost of running your own worker fleet — compute, scaling, and maintenance. Inngest starts at $75/month with no workers to run. At scale, the more meaningful difference is operational cost: Inngest removes an entire infrastructure layer that Temporal requires you to manage.",
  },
  {
    id: "ai-advantage",
    question: "Where does Inngest have a specific advantage for AI workloads?",
    answer:
      "Temporal's execution model requires workflow code to be strictly deterministic — it replays history to reconstruct state after failures. LLMs are inherently non-deterministic, which means you have to carefully isolate every model call inside an Activity to prevent replay errors. Inngest was architected around steps from the start, with no determinism requirement on the orchestration layer. Every LLM call is naturally a step. There's no replay model to design around, no risk of non-deterministic code causing execution failures, and no mental overhead separating \"workflow code\" from \"activity code.\" For AI, that's a meaningful difference.",
  },
];

export default function Faq() {
  return <SharedFaq faqs={FAQS} heading="FAQ" />;
}
