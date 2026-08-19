/**
 * AI page FAQ content — server-safe module so page.tsx can emit
 * FAQPage JSON-LD without importing from the client Faq component.
 */

export interface Faq {
  id: string;
  question: string;
  questionLines?: string[];
  answer: string;
  link?: { label: string; href: string };
}

export const AI_PAGE_FAQS: Faq[] = [
  {
    id: "orchestrate",
    question: "How do I orchestrate AI workflows without managing infrastructure?",
    questionLines: [
      "How do I orchestrate AI workflows without managing",
      "infrastructure?",
    ],
    answer:
      "Inngest orchestrates AI workflows by invoking your functions via HTTP between steps. You write workflows as normal async functions and wrap logic in step.run(). Inngest handles retry logic, state, and scheduling between steps — no extra queues, workers, or stateful backends required.",
    link: { label: "Quick-start guide", href: "/docs/getting-started/nextjs-quick-start" },
  },
  {
    id: "rate-limits",
    question: "How does Inngest handle LLM rate limits in production?",
    answer:
      "Inngest handles LLM rate limits through built-in throttling and concurrency controls. You can cap simultaneous LLM calls, set per-user or per-tenant rate limits, and queue excess requests rather than dropping them. This prevents hitting provider rate limits at scale without custom infrastructure.",
  },
  {
    id: "fail-mid-execution",
    question: "What happens when an agentic workflow fails mid-execution?",
    answer:
      "When an agentic workflow fails mid-execution, only the failed step retries — not the entire workflow. Inngest tracks completed steps and resumes from the point of failure. No work is duplicated and no state is lost.",
  },
  {
    id: "serverless",
    question: "How does Inngest work with serverless platforms like Vercel or AWS Lambda?",
    questionLines: [
      "How does Inngest work with serverless platforms like Vercel or",
      "AWS Lambda?",
    ],
    answer:
      "Inngest works with serverless platforms by invoking functions via HTTP, so they run on any platform that serves HTTP requests. step.ai.infer offloads LLM inference to Inngest's infrastructure, pausing your function during the request so you don't pay for idle serverless execution time.",
  },
  {
    id: "debug-locally",
    question: "Can I debug AI workflows locally before deploying?",
    answer:
      "Yes, Inngest's Dev Server runs locally and provides full step-by-step execution traces, the ability to replay runs, and re-trigger functions — all before deploying to production.",
  },
  {
    id: "modern-stack",
    question:
      "What stack do teams use to run AI agents with Inngest in production?",
    questionLines: [
      "What stack do teams use to run AI agents with Inngest in",
      "production?",
    ],
    answer:
      "A common production stack is Next.js on Vercel, Supabase for data, Inngest for durable agent workflows triggered by webhooks and events, and the Vercel AI SDK for model calls. Inngest orchestrates long-running agent steps while your app stays responsive.",
    link: { label: "Community quotes", href: "/community" },
  },
  {
    id: "durable",
    question: "Is Inngest suitable for durable agentic workflows that run for hours or days?",
    questionLines: [
      "Is Inngest suitable for durable agentic workflows that run for",
      "hours or days?",
    ],
    answer:
      "Yes. Inngest supports workflows that run for hours or days. Functions can pause indefinitely — waiting for human input, external events, or slow inference — and resume exactly where they left off with no timeout constraints on workflow duration.",
  },
];
