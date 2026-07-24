import SharedFaq, { type Faq } from "@/components/v1/sections/AI/Faq";

/**
 * Agent Evals FAQ — reuses the shared (AI-page) Faq component, just with
 * an eval-specific question set.
 */
const FAQS: Faq[] = [
  {
    id: "how-know-variant-works",
    question: "How does Inngest know if a variant is actually working?",
    answer:
      "By business and product outcomes, not just model output. Did the shopper buy what the agent recommended? Did the user complete checkout? Those are the outcomes that matter, and they happen downstream of the variant that produced them—so judging on output alone misses them entirely.",
  },
  {
    id: "llm-as-judge",
    question: "Are Inngest Evals just LLM-as-a-judge?",
    answer:
      "Nope. LLM-as-a-judge is a technique that uses an LLM model to subjectively evaluate the results of another LLM (or agent) for certain criteria. LLM-as-a-judge can tell you the response read well—that the copy was fine, the user didn’t immediately bounce—but it can’t tell you whether the product outcome happened, because that outcome arrives later, as a separate event. Inngest provides flexible scoring APIs that let you evaluate against real-life user interactions, or implement your own custom LLM-as-a-judge if you want.",
  },
  {
    id: "online-or-after",
    question: "Are Inngest evals online, or after the fact?",
    answer:
      "Online. You can run live A/B tests on real production traffic and compare variants on what users actually did, while it’s happening—not on a replayed sample after the fact.",
  },
  {
    id: "more-accurate",
    question: "How is this more accurate than existing evals?",
    answer:
      "Existing evals are mostly offline—curated test cases that only handle known-knowns. Inngest uses outcome-based signal to handle the unknowns—the wildcards—what really happens in prod. You’re not asking a model to judge itself; variants are measured against how your product actually behaved—events from real runs on real traffic—so the signal is the outcome, not an approximation of it.",
  },
  {
    id: "expensive",
    question: "Isn’t capturing all this expensive?",
    answer:
      "No. Tools that score from outside the execution sample a fraction of traffic—often around 10%—because retaining and scoring everything is cost-prohibitive for them. For Inngest, the execution data is already retained to make your code durable, so there’s nothing extra to capture or pay for. You can measure every run, not a sample.",
  },
  {
    id: "why-only-inngest",
    question: "Why can only Inngest do this?",
    answer:
      "The layer where your code is executed—agents, events, or async work—is also the layer that handles data from across your application, including product outcomes. Inngest is that layer. We let you score variants the same way you make code durable—adding primitives to existing code. Eval tools sitting outside the execution plan can correlate outcomes back to a variant manually, but it’s slow, brittle, and because of that often completely neglected. Inngest has the data attributed to the variant by default.",
  },
  {
    id: "non-ai",
    question: "Does this work for non-AI experiments too?",
    answer:
      "Yes. The same mechanism compares any two implementations—a vendor migration, a rewritten step, a new API call—on timing, error rate, and cost. AI evals are one use case, not the whole product.",
  },
  {
    id: "replace-flags",
    question: "Do I have to replace my feature flags or eval platform?",
    answer:
      "You can depending on your use case, but it’s not necessary. You can drive variant selection from a flag you already use, and keep scoring tools where they help. Inngest adds the execution-level comparison those tools can’t see on their own.",
  },
];

export default function Faq() {
  return <SharedFaq faqs={FAQS} refTag="agent-evals" />;
}
