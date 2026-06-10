import SharedFaq, { type Faq as FaqItem } from "@/components/v1/sections/AI/Faq";

// Cron / scheduled-jobs FAQ content. Reuses the AI page's FAQ
// accordion component (now prop-driven on `faqs` + `heading`) so
// the visual vocabulary stays identical across landing pages.

const FAQS: FaqItem[] = [
  {
    id: "is-cron-service",
    question: "Is Inngest a cron job service?",
    answer:
      "Inngest is not just a cron service. It adds durable, step-based execution to scheduled jobs — so if a scheduled job fails mid-run, only the failed step retries, not the whole job.",
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
