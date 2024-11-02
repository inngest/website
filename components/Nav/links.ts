import {
  IconBackgroundTasks,
  IconDeploying,
  IconDocs,
  IconSDK,
  IconJourney,
  IconGuide,
  IconPatterns,
  IconScheduled,
  IconSendEvents,
  IconSteps,
  IconTools,
  IconCompiling,
  IconPower,
  IconRetry,
} from "src/shared/Icons/duotone";
import PythonIcon from "src/shared/Icons/Python";
import TypeScriptIcon from "src/shared/Icons/TypeScript";

import { type MenuProps } from "./Menu";

export const productLinks: MenuProps = {
  title: "Product",
  primaryLinks: [
    {
      title: "Platform",
      description: "Learn about features, flow control, and more",
      url: "/platform?ref=nav",
      icon: IconSteps,
      iconBg: "bg-matcha-800/30",
    },
  ],
  secondaryTitle: "Use Cases",
  secondaryLinks: [
    {
      title: "AI + AI Agents",
      url: "/ai?ref=nav",
      icon: IconSDK,
    },
    {
      title: "Durable workflows",
      url: "/uses/durable-workflows?ref=nav",
      icon: IconRetry,
    },
    {
      title: "Workflow engines",
      url: "/uses/workflow-engine?ref=nav",
      icon: IconJourney,
    },
    {
      title: "Queuing",
      url: "/compare-to-legacy-queues?ref=nav",
      icon: IconSteps,
    },
    {
      title: "Background jobs",
      url: "/uses/serverless-node-background-jobs?ref=nav",
      icon: IconBackgroundTasks,
    },
    {
      title: "Scheduled & cron jobs",
      url: "/uses/serverless-cron-jobs?ref=nav",
      icon: IconScheduled,
    },
  ],
};

export const resourcesLinks: MenuProps = {
  title: "Docs",
  primaryLinks: [
    {
      title: "Getting started",
      description: "Learn how to use Inngest, SDKs, and more",
      url: "/docs?ref=nav",
      icon: IconDocs,
      iconBg: "bg-breeze-800/30",
    },
    {
      title: "Functions",
      description: "Learn about writing durable functions using steps",
      url: "/docs/features/inngest-functions?ref=nav",
      icon: IconCompiling,
      iconBg: "bg-honey-800/30",
    },
    {
      title: "Flow control",
      description: "Concurrency, throttling, prioritization, and more",
      url: "/docs/guides/flow-control?ref=nav",
      icon: IconGuide,
      iconBg: "bg-purplehaze-800/30",
    },
    {
      title: "Events & triggers",
      description: "How to trigger functions with events, crons, or webhooks",
      url: "/docs/features/events-triggers?ref=nav",
      icon: IconPower,
      iconBg: "bg-ruby-800/30",
    },
    // NOTE - Hiding examples until we have more
    // {
    //   title: "Examples",
    //   description: "Explore examples for common use cases",
    //   url: "/docs/examples?ref=nav",
    //   icon: IconPatterns,
    //   iconBg: "bg-ruby-800/30",
    // },
  ],
  secondaryTitle: "Quick start guides",
  secondaryLinks: [
    {
      title: "TypeScript / JavaScript",
      url: "/docs/quick-start?ref=nav",
      icon: TypeScriptIcon,
      iconClassName: "w-4",
    },
    {
      title: "Python",
      url: "/docs/getting-started/quick-start/python?ref=nav",
      icon: PythonIcon,
      iconClassName: "w-4",
    },
  ],
};
