import SharedFaq, { type Faq as FaqItem } from "@/components/v1/sections/AI/Faq";

const FAQS: FaqItem[] = [
  {
    id: "is-event-bus",
    question: "Is Inngest an event bus?",
    answer:
      "Inngest is not an event bus. It's an orchestration layer that triggers durable, step-based functions from events — so when an event fires, the resulting job runs reliably with retries, state, and full observability.",
  },
  {
    id: "replace-webhook-handler",
    question: "Does Inngest replace my existing webhook handler?",
    answer:
      "Inngest can receive webhooks directly and trigger functions from them. Instead of writing custom handler logic with retries and error handling, you define steps in code and Inngest manages execution.",
  },
  {
    id: "function-fails-after-webhook",
    question: "What happens if my function fails after receiving a webhook?",
    answer:
      "Only the failed step retries — not the entire function. Inngest tracks completed steps, so no work is duplicated and the webhook payload is never lost.",
  },
  {
    id: "deployment-goes-down",
    question:
      "What happens to an Inngest job if my deployment goes down mid-execution?",
    answer:
      "Only the failed step retries, not the entire job. Inngest tracks which steps completed and resumes from the point of failure when your deployment is back up.",
  },
  {
    id: "one-event-many-functions",
    question: "Can one event trigger multiple functions?",
    answer:
      "Yes. A single event sent to Inngest can fan out to multiple functions running in parallel, each with their own retries and execution state. No custom pub/sub logic required.",
  },
  {
    id: "delay-schedule-from-event",
    question: "Can I delay or schedule work from an incoming event?",
    answer:
      "Yes. You can trigger a function immediately from an event, delay execution by a set duration, or wait for a follow-up event before continuing — all defined in code.",
  },
  {
    id: "replay-events",
    question: "How do I replay events after a bug or outage?",
    answer:
      "Inngest stores your event history. You can replay events against a fixed version of your function — reprocessing affected runs without re-triggering the original source.",
  },
];

export default function Faq() {
  return <SharedFaq faqs={FAQS} heading="FAQ" />;
}
