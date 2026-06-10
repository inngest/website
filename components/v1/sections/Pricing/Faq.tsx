import SharedFaq, { type Faq as FaqItem } from "@/components/v1/sections/AI/Faq";

const FAQS: FaqItem[] = [
  {
    id: "free-trial",
    question: "Is there a free trial for the Pro plan?",
    answer:
      "Yes — every Pro plan starts with a two-week trial at no cost. No credit card is required to sign up, and you can downgrade or cancel before the trial ends if Pro isn't the right fit.",
    link: { label: "Get started", href: "/sign-up" },
  },
  {
    id: "what-is-execution",
    question: "What counts as an execution?",
    answer:
      "An execution is a single durable function run plus each step inside it. If your function has 5 step.run() calls, one run uses 6 executions (the run itself + 5 steps).",
  },
  {
    id: "exceed-included-runs",
    question: "What happens if I exceed the included executions on my plan?",
    answer:
      "Pro plans bill metered usage above the included executions at tiered rates — the more you use, the lower the per-execution price. Hobby plans pause execution once the free quota is exhausted; upgrade to keep running.",
  },
  {
    id: "swap-plans",
    question: "Can I switch plans later?",
    answer:
      "Yes. You can upgrade from Hobby to Pro at any time, and switch to Enterprise once you need custom scale, SAML, or dedicated support. Plan changes take effect immediately and prorate the current billing cycle.",
  },
  {
    id: "self-host",
    question: "Can I self-host Inngest?",
    answer:
      "Inngest is delivered as a managed service for all plans. Enterprise customers can request dedicated execution capacity for low-latency, high-throughput workloads on shared regional infrastructure.",
  },
  {
    id: "billing-questions",
    question: "I have other billing questions. How do I get in touch?",
    answer:
      "Email us at support@inngest.com or open a support ticket from the dashboard. Pro and Enterprise customers get faster SLAs on billing and account questions.",
    link: { label: "Contact sales", href: "/get-in-touch?ref=pricing-faq" },
  },
];

export default function Faq() {
  return <SharedFaq faqs={FAQS} heading="FAQ" />;
}
