import SharedFaq, { type Faq as FaqItem } from "@/components/v1/sections/AI/Faq";

const FAQS: FaqItem[] = [
  {
    id: "what-is-execution",
    question: 'What counts as one "execution"?',
    answer:
      "An execution is metered per function run and per step inside that run. A function with 5 step.run() calls uses 6 executions total — 1 for the run, 5 for the steps. If you're estimating usage, count steps, not just runs.",
  },
  {
    id: "typical-workflow-executions",
    question: "How many executions does a typical workflow use?",
    answer:
      "It depends heavily on step count. A simple 2-3 step job might use 3-4 executions per run. A multi-step AI agent with tool calls, retries, or sub-agent handoffs can use significantly more — often 10+ executions per run. Model your usage against your actual step count, not the headline execution number.",
  },
  {
    id: "exceed-included-runs",
    question: "What happens when I exceed my plan's included executions?",
    answer:
      "On Pro, overage is metered at tiered rates that decrease as volume grows (from $0.000050 down to $0.000015 per execution, based on current published rates). On Free, there's no metered overage — execution pauses once you hit the free quota, and you'll need to upgrade to resume.",
  },
  {
    id: "which-limits",
    question: "Which limits are most likely to affect me?",
    answer:
      "Executions are the most common constraint for most accounts. Concurrency, seats, workers, span data, and events each have their own separate limits and overage rates, but they typically become relevant only at higher scale or with specific usage patterns (e.g., many team members, high trace volume).",
  },
  {
    id: "bill-change",
    question: "Can my bill change from month to month?",
    answer:
      "Yes. Because execution volume, concurrency, and several other dimensions are each billed independently, your bill can vary if usage spikes on any one of them — not just total execution count.",
  },
  {
    id: "included-vs-addon",
    question: "What's included versus billed as an add-on?",
    answer:
      "Core execution, concurrency, seats, and workers are part of your plan's base allowance and overage rates. Advanced observability and HIPAA compliance are separate paid add-ons, not included in the base Pro or Enterprise price.",
  },
  {
    id: "compare-temporal-trigger",
    question:
      "How does Inngest's pricing model compare to Temporal's or Trigger.dev's?",
    answer:
      'The three vendors bill on different units. Temporal charges per "action" — a workflow start plus one charge for every step (called an activity) inside it, so cost rises directly with how many steps a run has. Trigger.dev charges a flat per-run fee plus metered wall-clock compute time, so a slower step (a bigger file, a slow API call) raises the bill even at the same step count.',
  },
  {
    id: "which-vendor-cheapest",
    question: "Which vendor is cheapest for my workload?",
    answer:
      "It depends on how many steps your typical run has and how long each step takes to execute — that's the number to check before comparing sticker prices, not the headline monthly rate. A third-party cost comparison modeled 500,000 runs/month at 4 steps each against each vendor's published rates and found the ranking can flip depending on step count and compute duration per step — so we'd recommend running your own numbers against your actual workflow shape rather than relying on any one published comparison, including this one.",
  },
  {
    id: "why-cost-differs",
    question:
      "Why might the same workload cost different amounts on different platforms?",
    answer:
      'Because "cost per run" depends on three separate variables that each vendor weights differently: step count, compute time per step, and whether overage is metered continuously or in fixed tiers. A workflow with few, fast steps and one with many, slow steps won\'t rank vendors the same way.',
  },
  {
    id: "swap-plans",
    question: "Can I switch plans later?",
    answer:
      "Yes. You can upgrade from Free to Pro at any time, and switch to Enterprise once you need custom scale, SAML, or dedicated support. Plan changes take effect immediately and prorate the current billing cycle.",
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
    link: { label: "Contact sales", href: "/contact?ref=pricing-faq" },
  },
];

export default function Faq() {
  return (
    <SharedFaq
      faqs={FAQS}
      heading="FAQ"
      refTag="pricing"
      className="!pt-20 sm:!pt-24 lg:!pt-0"
    />
  );
}
