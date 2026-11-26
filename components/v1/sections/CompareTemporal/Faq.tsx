import SharedFaq, {
  type Faq as FaqItem,
} from "@/components/v1/sections/AI/Faq";

/**
 * Compare-to-Temporal FAQ — reuses the shared AI/Faq accordion with the
 * Temporal-specific question set.
 */

const FAQS: FaqItem[] = [
  {
    id: "temporal-alternative",
    question: "Is there a Temporal alternative?",
    answer:
      "Yes. Inngest is a Temporal alternative built for teams that want durable execution without running workers, a cluster, or a separate queue. You write normal async functions, wrap side effects in step.run(), and Inngest invokes your existing HTTP app. Among Temporal competitors, Inngest is the option that keeps your current deployment as the runtime instead of asking you to operate a new one.",
  },
  {
    id: "inngest-vs-temporal-differences",
    question: "What are the Inngest vs Temporal differences?",
    answer:
      "The core Inngest vs Temporal difference is architecture. Temporal requires workers that poll a cluster, either self-hosted or on Temporal Cloud. Inngest has no workers: it calls your existing deployment over HTTP. Temporal workflow code must be deterministic because it replays history. Inngest uses step memoization, so non-deterministic LLM calls do not need a separate Activity layer. Inngest also ships native rate limiting, per-key concurrency, and step-level traces that Temporal typically requires you to build.",
  },
  {
    id: "scale",
    question: "Can Inngest handle the same scale as Temporal?",
    answer:
      "Yes. Inngest runs production workloads at 100k+ executions per second, and the ceilings that matter at scale are published per plan: queue depth runs from 100,000 on Free to 10 million and up on Business, and concurrency scales alongside it. Ease of setup is a product decision, not a capacity ceiling. Where Temporal still has the edge is at mega-enterprise scale, with a platform team already operating the cluster behind it.",
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
    id: "self-host-both",
    question: "Can I self-host Inngest and Temporal?",
    answer:
      "Both, yes. Temporal’s server is open source and self-hostable. It needs a persistence database — Cassandra, MySQL, or PostgreSQL — and a visibility store. Elasticsearch or OpenSearch is the usual choice once search gets large; current servers can also use MySQL or PostgreSQL for advanced visibility. You keep four services running: frontend, history, matching, and Temporal’s internal worker. Inngest is open source and self-hostable too. A single node runs on an embedded store and SQLite, and a real installation points at external Redis and PostgreSQL. Neither is free of operational work, and Temporal has more of it.",
  },
  {
    id: "worker-fleet-cost",
    question: "What does Temporal cost once you include the worker fleet?",
    answer:
      "Temporal Cloud bills Actions from $50 per million plus Active and Retained Storage by the gigabyte-hour, with a support plan on top. The worker fleet is separate and it’s yours: the compute the workers run on, the capacity you size for peak, and the rotation that gets paged when a worker deployment goes wrong. Temporal is explicit that your Workflow and Activity code only runs in Workers under your control, on Cloud included.",
  },
  {
    id: "time-to-first",
    question: "How long does it take to get a first durable workflow running?",
    answer:
      "On Inngest, minutes. One command starts a local execution environment, and wrapping an existing function in step.run() gives you a durable workflow you can trigger and inspect. Shipping it is one HTTP route and a key. On Temporal, the first run waits on infrastructure you have to stand up first, which means a service to reach, a database behind it, and a worker process written, registered and deployed.",
  },
  {
    id: "github-stars",
    question:
      "Temporal has far more GitHub stars — doesn't that mean it's better?",
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
      "Temporal Cloud no longer charges an entry plan fee. Developer support carries no base monthly charge and bills 10% of usage, with Actions from $50 per million plus storage by the gigabyte-hour, and Business is the greater of $500 a month or 10% of usage, with 2.5 million Actions and a storage allocation included before overage. On top of either, you pay for the worker fleet, which Temporal doesn’t run. Inngest starts free, Pro starts at $99 a month, and no fleet appears in the bill.",
  },
  {
    id: "other-alternatives",
    question: "What other Temporal alternatives should I look at?",
    answer:
      "If Inngest isn’t the fit, the usual shortlist is Trigger.dev, Restate, DBOS, AWS Step Functions and Cloudflare Workflows, plus hand-rolled queues like BullMQ or Celery. Trigger.dev runs your code on their compute, which is the opposite trade from Inngest’s. Step Functions and Workflows tie you to one cloud. A queue gets you retries and little else, with no checkpointing, no long sleeps, and nothing to query when a job half-ran.",
  },
  {
    id: "ai-advantage",
    question: "Where does Inngest have a specific advantage for AI workloads?",
    answer:
      'Temporal\'s execution model requires workflow code to be strictly deterministic — it replays history to reconstruct state after failures. LLMs are inherently non-deterministic, which means you have to carefully isolate every model call inside an Activity to prevent replay errors. Inngest was architected around steps from the start, with no determinism requirement on the orchestration layer. Every LLM call is naturally a step. There\'s no replay model to design around, no risk of non-deterministic code causing execution failures, and no mental overhead separating "workflow code" from "activity code." For AI, that\'s a meaningful difference.',
  },
];

export default function Faq() {
  return <SharedFaq faqs={FAQS} heading="FAQ" />;
}
