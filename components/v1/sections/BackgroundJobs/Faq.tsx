import AiFaq, { type Faq as FaqType } from "@/components/v1/sections/AI/Faq";

/**
 * Background-jobs FAQ — reuses the AI page's accordion component
 * verbatim, only swapping the question set. Heading stays "FAQ" to
 * match the AI page.
 */

const FAQS: FaqType[] = [
  {
    id: "is-queue",
    question: "Is Inngest a queue?",
    answer:
      "Inngest is an orchestration layer that replaces the need for separate queues. Instead of managing a broker, workers, and retry logic separately, you define steps in code and Inngest handles delivery, state, and retries between them.",
  },
  {
    id: "replace-sidekiq",
    question: "Does Inngest replace my existing job processor like Sidekiq or BullMQ?",
    questionLines: [
      "Does Inngest replace my existing job processor like Sidekiq",
      "or BullMQ?",
    ],
    answer:
      "Yes — Inngest covers the same surface as Sidekiq, BullMQ, Celery, and similar tools, while adding step-level checkpointing, native traces, and built-in concurrency/throttling. You point Inngest at your existing functions and delete the queue + worker plumbing.",
    link: { label: "Migration guide", href: "/docs/learn/migrating" },
  },
  {
    id: "serverless",
    question: "Can Inngest run background jobs on Vercel or other serverless platforms?",
    questionLines: [
      "Can Inngest run background jobs on Vercel or other serverless",
      "platforms?",
    ],
    answer:
      "Yes. Inngest invokes your functions via HTTP, so any platform that serves HTTP requests — Vercel, Netlify, AWS Lambda, Cloudflare Workers, traditional servers — can run Inngest functions without changes to your hosting setup.",
  },
  {
    id: "deploy-down",
    question: "What happens to an Inngest job if my deployment goes down mid-execution?",
    questionLines: [
      "What happens to an Inngest job if my deployment goes down",
      "mid-execution?",
    ],
    answer:
      "Inngest tracks completed steps independently of your deployment. When your app comes back up, Inngest resumes the function from the last completed step — no work is lost or duplicated.",
  },
  {
    id: "framework",
    question: "Does Inngest work with my existing framework?",
    answer:
      "Inngest ships SDKs and adapters for Next.js, Node.js, Express, Fastify, Hono, Remix, FastAPI, Flask, Django, Go, and more. If your framework speaks HTTP, Inngest works with it.",
  },
  {
    id: "scale",
    question: "How does Inngest handle jobs at scale?",
    answer:
      "Inngest is built on a distributed system that handles millions of events and function runs per day for production customers. Concurrency, throttling, and priority queuing are first-class controls — not afterthoughts — so you keep latency predictable at any volume.",
  },
];

export default function Faq() {
  return <AiFaq faqs={FAQS} />;
}
