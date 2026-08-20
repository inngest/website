import SharedFaq, { type Faq as FaqItem } from "@/components/v1/sections/AI/Faq";

// Cron / scheduled-jobs FAQ content. Reuses the AI page's FAQ
// accordion component (now prop-driven on `faqs` + `heading`) so
// the visual vocabulary stays identical across landing pages.

const FAQS: FaqItem[] = [
  {
    id: "what-is-serverless-orchestration",
    question: "What is serverless workflow orchestration?",
    answer:
      "It is coordinating multi-step jobs—schedules, events, data workflows, and approvals—on serverless or container deploys without running your own queue workers. Inngest persists step state and retries so distributed serverless execution stays reliable across timeouts and deploys.",
  },
  {
    id: "infrastructure-agnostic",
    question: "What does infrastructure-agnostic workflow mean?",
    answer:
      "Your orchestration is not tied to one cloud's cron service or a visual workflow builder. Inngest invokes functions over HTTP on Vercel, AWS, GCP, or any HTTP server, so the same code runs wherever you deploy.",
  },
  {
    id: "vs-step-functions-temporal",
    question:
      "How does Inngest compare to AWS Step Functions and Temporal for serverless?",
    answer:
      "Step Functions are AWS-centric and often use ASL or a visual workflow builder. Temporal requires a cluster and worker processes. Inngest is infrastructure-agnostic: no workers to run, cron and events in one function, and per-step retries on your existing deploy.",
  },
  {
    id: "is-cron-service",
    question: "Is Inngest a cron job service?",
    answer:
      "Inngest is not just a cron service. It adds durable, step-based serverless workflow orchestration to scheduled jobs — so if a scheduled job fails mid-run, only the failed step retries, not the whole job.",
  },
  {
    id: "hitl-approval",
    question:
      "Can I model human-in-the-loop approval workflow state machine patterns?",
    answer:
      "Yes. Use step.sleep, step.sleepUntil, or step.waitForEvent to pause a run until an approval event arrives, then continue the same function. That covers HITL approval patterns without a separate state machine service.",
  },
  {
    id: "replace-existing",
    question: "Can Inngest replace my existing cron jobs?",
    answer:
      "Yes. You define a schedule directly in code using a cron expression, and Inngest triggers execution on time. No separate cron daemon, server, or infrastructure required.",
  },
  {
    id: "missed-window",
    question: "What happens if a scheduled job misses its execution window?",
    answer:
      "Inngest queues missed runs and executes them as soon as your deployment is available. Runs are never silently skipped.",
  },
  {
    id: "serverless-platforms",
    question: "Can I run cron jobs on Vercel or serverless platforms?",
    answer:
      "Yes. Inngest triggers scheduled jobs via HTTP, so they run on any serverless platform without a persistent process. Vercel's built-in cron limits don't apply.",
  },
  {
    id: "multiple-functions",
    question: "Can one event trigger multiple functions?",
    answer:
      "Yes. A single event sent to Inngest can fan out to multiple functions running in parallel, each with their own retries and execution state. No custom pub/sub logic required.",
  },
  {
    id: "cron-and-event",
    question:
      "Can the same function be triggered by both a schedule and an event?",
    answer:
      "Yes. A single Inngest function can be triggered by a cron schedule and an event. You can run a daily report automatically and trigger it immediately on demand without duplicating logic.",
  },
  {
    id: "did-it-run",
    question: "How do I know if a scheduled job actually ran?",
    answer:
      "Every scheduled run has a full execution trace in the Inngest dashboard — start time, step duration, failures, and output. You don't need to dig through logs to confirm execution.",
  },
];

export default function Faq() {
  return <SharedFaq faqs={FAQS} heading="FAQ" />;
}
