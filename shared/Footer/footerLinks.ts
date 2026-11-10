import { IS_HIRING } from "@/shared/flags";

const footerLinks = [
  {
    name: "Product",
    links: [
      {
        label: "Platform",
        url: "/platform/durable-execution?ref=footer",
      },
      {
        label: "Documentation",
        url: "/docs?ref=footer",
      },
      {
        label: "Patterns: Async + Event-Driven",
        url: "/docs/patterns?ref=footer",
      },
      {
        label: "AgentKit: AI Agents with Inngest",
        url: "https://agentkit.inngest.com/overview",
      },
    ],
  },
  {
    name: "Learn more",
    links: [
      {
        label: "AI + AI Agents",
        url: "/ai?ref=footer",
      },
      {
        label: "Compare to traditional queues",
        url: "/platform/flow-control?ref=footer",
      },
      {
        label: "Durable workflows",
        url: "/platform/durable-execution?ref=footer",
      },
      {
        label: "Workflow engines",
        url: "/uses/webhooks?ref=footer",
      },
      {
        label: "Serverless queues for TypeScript",
        url: "/platform/flow-control?ref=footer",
      },
      {
        label: "Scheduled & cron jobs",
        url: "/uses/scheduled-jobs?ref=footer",
      },
      {
        label: "Node.js background jobs",
        url: "/uses/serverless-node-background-jobs?ref=footer",
      },
      {
        label: "Compare to Temporal",
        url: "/compare-to-temporal?ref=footer",
      },
    ],
  },
  {
    name: "Company",
    links: [
      {
        label: "Blog",
        url: "/blog?ref=footer",
      },
      {
        label: "Changelog",
        url: "/changelog?ref=footer",
      },
      {
        label: "About",
        url: "/about?ref=footer",
      },
      {
        label: "Careers",
        url: "/about?ref=footer",
        callout: IS_HIRING ? "We're hiring!" : undefined,
      },
      {
        label: "Contact Us",
        url: "/contact?ref=footer",
      },
      {
        label: "Support",
        url: process.env.NEXT_PUBLIC_SUPPORT_URL || "/contact?ref=footer-support",
      },
      {
        label: "Newsletter",
        url: "/newsletter?ref=footer",
      },
    ],
  },
];

export default footerLinks;
