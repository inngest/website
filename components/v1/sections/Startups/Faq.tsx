import SharedFaq, {
  type Faq as FaqItem,
} from "@/components/v1/sections/AI/Faq";
import { PROGRAM_RULES } from "./program";

const FAQS: FaqItem[] = [
  {
    id: "what-you-get",
    question: "What does the Startup Program include?",
    answer:
      "The Pro plan, free for 12 months from the day your account is upgraded. You get every Pro feature and included limit. Paid add-ons such as HIPAA and advanced observability aren't part of the offer.",
    link: { label: "Compare plans", href: "/pricing" },
  },
  {
    id: "eligibility",
    question: "Who's eligible?",
    answer: `Companies founded in the last ${PROGRAM_RULES.maxCompanyAgeYears} years with fewer than ${PROGRAM_RULES.maxEmployees} employees that are either bootstrapped or have raised through ${PROGRAM_RULES.maxStageLabel} with less than ${PROGRAM_RULES.maxRaisedLabel} in total. Your Inngest account can be on the Free plan, but not on a paid plan.`,
  },
  {
    id: "bootstrapped",
    question: "We're bootstrapped. Can we apply?",
    answer:
      "Yes. Bootstrapped and self-funded startups get the same offer as venture-backed ones.",
  },
  {
    id: "overages",
    question: "What happens if we go over Pro's included limits?",
    answer:
      "Usage above Pro's included limits is billed at standard Pro rates. The Pro plan itself stays free for the full 12 months.",
    link: { label: "See Pro pricing", href: "/pricing" },
  },
  {
    id: "payment-method",
    question: "Why do I need a payment method on file?",
    answer:
      "So usage above Pro's included limits can be billed. You won't be charged for the Pro plan during your free year.",
  },
  {
    id: "after-year-one",
    question: "What happens after 12 months?",
    answer:
      "Your account moves to standard Pro billing. We'll email you about 30 days before your free year ends.",
  },
  {
    id: "yc",
    question: "We're a Y Combinator company. Should we apply here?",
    answer:
      "Use the YC deal instead. It's the same offer, verified with your YC badge.",
    link: { label: "Request the YC deal", href: "/yc" },
  },
  {
    id: "review",
    question: "How are applications reviewed?",
    answer:
      "Our team checks each application against the criteria above. If you're approved, we upgrade your Inngest account to Pro and let you know by email.",
  },
  {
    id: "apply-again",
    question: "Can we apply more than once?",
    answer: "No. Each company can receive the Startup Program offer once.",
  },
  {
    id: "questions",
    question: "I have other questions. Who do I contact?",
    answer:
      "Email us at support@inngest.com or open a support ticket from the dashboard.",
  },
];

export default function Faq() {
  return (
    <SharedFaq
      faqs={FAQS}
      heading="FAQ"
      refTag="startups-faq"
      className="!pt-20 sm:!pt-24 lg:!pt-16"
    />
  );
}
