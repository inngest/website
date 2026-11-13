import SharedFaq, {
  type Faq as FaqItem,
} from "@/components/v1/sections/AI/Faq";
import { PROGRAM_RULES } from "./program";

const FAQS: FaqItem[] = [
  {
    id: "what-you-get",
    question: "What does the Startup Program include?",
    answer:
      "50% off the Pro plan for 12 months, starting the day your account is upgraded. You get every Pro feature and included limit. Paid add-ons such as HIPAA and advanced observability aren't part of the offer.",
    link: { label: "Compare plans", href: "/pricing" },
  },
  {
    id: "eligibility",
    question: "Who's eligible?",
    answer: `Companies founded in the last ${PROGRAM_RULES.maxCompanyAgeYears} years with ${PROGRAM_RULES.minEmployees} to ${PROGRAM_RULES.maxEmployees} employees that are either bootstrapped or have raised between ${PROGRAM_RULES.minRaisedLabel} and ${PROGRAM_RULES.maxRaisedLabel} in total. We check headcount on your LinkedIn company page. The program is for new customers, meaning you haven't paid for an Inngest plan yet. If you're on our Free plan, you can apply.`,
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
      "Usage above Pro's included limits is billed at standard Pro rates. The 50% discount applies to the Pro plan itself for the full 12 months.",
    link: { label: "See Pro pricing", href: "/pricing" },
  },
  {
    id: "account",
    question: "Do I need an Inngest account to apply?",
    answer:
      "Yes. Create a free account first. It takes a couple of minutes, and you can start building on the Free plan while we review your application. Then apply with the email you signed up with.",
  },
  {
    id: "payment-method",
    question: "Do I need a payment method to apply?",
    answer:
      "Not to apply. You'll add one once you're approved. It covers the discounted Pro plan and any usage above Pro's included limits.",
  },
  {
    id: "after-year-one",
    question: "What happens after 12 months?",
    answer:
      "Your account moves to standard Pro billing. We'll email you about 30 days before your discount ends.",
  },
  {
    id: "yc",
    question: "We're a Y Combinator company. Should we apply here?",
    answer:
      "Use the YC deal instead. It has its own offer and is verified with your YC badge.",
    link: { label: "Request the YC deal", href: "/yc" },
  },
  {
    id: "review",
    question: "How are applications reviewed?",
    answer:
      "Our team checks each application against the criteria above. If you're approved, we'll email you next steps for adding a payment method and upgrading to Pro with your discount applied.",
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
