import SharedFaq, { type Faq as FaqItem } from "@/components/v1/sections/AI/Faq";

const FAQS: FaqItem[] = [
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
      "Yes. Inngest is open-source and can be self-hosted. The cloud product adds managed infrastructure, observability, and reliability on top — but the core engine is yours to run.",
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
  return <SharedFaq faqs={FAQS} heading="FAQ" refTag="pricing" />;
}
