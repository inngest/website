import type { ReactNode } from "react";

export interface Topic {
  title: string;
  body: ReactNode;
  action?: {
    label: string;
    href: string;
  };
}

export const GENERAL_TOPICS: Topic[] = [
  {
    title: "Technical Support",
    body: "Hit a bug or need help with your integration? Open a support ticket and our team will get back.",
    action: {
      label: "Create a support ticket",
      href: "/support?ref=contact",
    },
  },
  {
    title: "Community & Questions",
    body: "Questions about how Inngest works? Our Discord community — including the team — is the fastest way to get answers.",
    action: {
      label: "Join us on Discord",
      href: "https://www.inngest.com/discord",
    },
  },
  {
    title: "Press & Media",
    body: "Working on a story or need a quote? Reach out and we'll connect you with the right person.",
    action: {
      label: "press@inngest.com",
      href: "mailto:press@inngest.com",
    },
  },
  {
    title: "Partnerships & integrations",
    body: "Interested in building with or alongside Inngest? We'd love to hear from you.",
    action: {
      label: "partnerships@inngest.com",
      href: "mailto:partnerships@inngest.com",
    },
  },
  {
    title: "Temporal has far more GitHub stars — doesn't that mean it's better?",
    body: "Temporal has been around longer and targets a different audience — large engineering teams with dedicated platform engineers who can manage distributed worker infrastructure. Inngest is newer and optimized for teams who want durable execution without that operational overhead. Stars reflect history and audience, not fit for your use case.",
  },
  {
    title: "Security",
    body: "Found a security issue? Please disclose it responsibly — we take these reports seriously and respond quickly.",
    action: {
      label: "security@inngest.com",
      href: "mailto:security@inngest.com",
    },
  },
  {
    title: "Looking for a demo or Enterprise pricing?",
    body: "Talk to our Sales Engineering team.",
    action: {
      label: "Talk to sales",
      href: "/sales-inquiry-form?ref=contact",
    },
  },
];

export const SALES_TOPICS: Topic[] = [
  {
    title: "Talk to sales",
    body: "Pricing, procurement, security reviews, and Enterprise plans — connect with our Sales Engineering team.",
    action: {
      label: "Open the sales form",
      href: "/sales-inquiry-form?ref=contact",
    },
  },
  {
    title: "Looking for a demo or Enterprise pricing?",
    body: "Walk through Inngest with a product expert and get pricing tailored to your workload.",
    action: {
      label: "Talk to sales",
      href: "/sales-inquiry-form?ref=contact-demo",
    },
  },
  {
    title: "Product Questions",
    body: "Question about how Inngest fits your stack? The sales team can route product questions to the right engineer.",
    action: {
      label: "sales@inngest.com",
      href: "mailto:sales@inngest.com",
    },
  },
];
