import type { ReactNode } from "react";

// v1 Pricing plans + comparison-table feature rows. Copy/values
// follow the redesign. The calculator math matches the legacy
// /pricing tier model — see PricingCalculator.tsx.

export const PLAN_NAMES = {
  hobby: "Hobby",
  pro: "Pro",
  enterprise: "Enterprise",
} as const;

export type PlanName = typeof PLAN_NAMES[keyof typeof PLAN_NAMES];

export interface Plan {
  name: PlanName;
  description: string;
  cost: {
    startsAt?: boolean;
    basePrice: number | string;
    period?: string;
    includedRuns: number | string;
    additionalRunsPrice: number | string | null;
    additionalRunsRate?: number | null;
    includedSteps: number | string;
    additionalStepsPrice: number | string | null;
    additionalStepsRate?: number | null;
    includedConcurrency: number | string;
    additionalConcurrencyPrice: number | string | null;
    additionalConcurrencyRate?: number | null;
    includedUsers: number | string;
    additionalUsersPrice: number | string | null;
    additionalUsersRate?: number | null;
    includedWorkers?: number | string;
    additionalWorkersPrice?: number | string | null;
    additionalWorkersRate?: number | null;
  };
  /** Caption beneath the price (e.g. "No credit card required"). */
  priceCaption: string;
  cta: { href: string; text: string };
  /** Feature bullets below the CTA. `value`, when set, renders bold
   *  before the label — e.g. **50k** executions. */
  features: { value?: string; text: string }[];
  /** Tags / badges (e.g. "POPULAR"). */
  badge?: string;
}

const SIGNUP =
  process.env.NEXT_PUBLIC_SIGNUP_URL ?? "https://app.inngest.com/sign-up";

export const PLANS: Plan[] = [
  {
    name: PLAN_NAMES.hobby,
    description:
      "For individual developers and small projects getting started with durable execution.",
    cost: {
      basePrice: 0,
      period: "mo",
      includedRuns: 50_000,
      additionalRunsPrice: null,
      additionalRunsRate: null,
      includedSteps: 5,
      additionalStepsPrice: null,
      additionalStepsRate: null,
      includedConcurrency: 5,
      additionalConcurrencyPrice: null,
      additionalConcurrencyRate: null,
      includedUsers: 3,
      additionalUsersPrice: null,
      additionalUsersRate: null,
      includedWorkers: 3,
      additionalWorkersPrice: null,
      additionalWorkersRate: null,
    },
    priceCaption: "No credit card required",
    cta: {
      href: `${SIGNUP}?ref=pricing-card-hobby`,
      text: "Get started for Free",
    },
    features: [
      { value: "50k", text: "executions" },
      { value: "5", text: "concurrent executions" },
      { value: "500 MB", text: "span data ingested" },
      { value: "10K", text: "scores" },
      { value: "500k", text: "events ingested" },
      { value: "100k", text: "queue depth" },
      { value: "50", text: "realtime connections" },
      { text: "Basic tracing, metrics, and alerts" },
    ],
  },
  {
    name: PLAN_NAMES.pro,
    description:
      "For growing teams building production-ready workflows with increased scale and reliability.",
    cost: {
      startsAt: true,
      basePrice: 99,
      period: "mo",
      includedRuns: 1_000_000,
      additionalRunsPrice: 50,
      additionalRunsRate: 1_000_000,
      includedSteps: 5,
      additionalStepsPrice: 4,
      additionalStepsRate: 200_000,
      includedConcurrency: 100,
      additionalConcurrencyPrice: 25,
      additionalConcurrencyRate: 25,
      includedUsers: 15,
      additionalUsersPrice: 10,
      additionalUsersRate: 1,
      includedWorkers: 20,
      additionalWorkersPrice: 10,
      additionalWorkersRate: 1,
    },
    priceCaption: "",
    cta: {
      href: `${SIGNUP}?ref=pricing-card-pro`,
      text: "Get started for Free",
    },
    features: [
      { value: "1M+", text: "executions" },
      { value: "100+", text: "concurrent executions" },
      { value: "5 GB", text: "span data ingested" },
      { value: "50K", text: "scores" },
      { value: "5M+", text: "events ingested" },
      { value: "1M+", text: "queue depth" },
      { value: "1000", text: "realtime connections" },
      { text: "Granular tracing, metrics, alerts + 7 day trace retention" },
      { text: "Increased throughput" },
    ],
    badge: "POPULAR",
  },
  {
    name: PLAN_NAMES.enterprise,
    description:
      "For organizations running critical workflows at scale with advanced security, support, and customization.",
    cost: {
      basePrice: "Scalable Pricing",
      includedRuns: "Custom",
      additionalRunsPrice: "Custom",
      additionalRunsRate: null,
      includedSteps: "Custom",
      additionalStepsPrice: "Custom",
      additionalStepsRate: null,
      includedConcurrency: 500,
      additionalConcurrencyPrice: "Custom",
      additionalConcurrencyRate: null,
      includedUsers: 50,
      additionalUsersPrice: "Custom",
      additionalUsersRate: null,
      includedWorkers: "Unlimited",
      additionalWorkersPrice: "Custom",
      additionalWorkersRate: null,
    },
    priceCaption: "Contact us to learn more & request a demo",
    cta: {
      href: "/contact?ref=pricing-card-enterprise",
      text: "Contact Us",
    },
    features: [
      { value: "Custom", text: "executions" },
      { value: "Custom", text: "concurrent executions" },
      { value: "Custom", text: "span data ingested" },
      { value: "Custom", text: "scores" },
      { value: "Custom", text: "events ingested" },
      { value: "Custom", text: "queue depth" },
      { value: "Custom", text: "realtime connections" },
      { text: "Advanced tracing, metrics, alerts + 90 day trace retention" },
      { text: "Dedicated Slack channel" },
      { text: "SAML, RBAC, audit trails" },
    ],
  },
];

export function getPlan(name: PlanName): Plan {
  const plan = PLANS.find((p) => p.name === name);
  if (!plan) throw new Error(`Unknown plan ${name}`);
  return plan;
}

// ─────────────────────────────────────────────────────────────────
//  Comparison table
// ─────────────────────────────────────────────────────────────────

export type FeatureCell =
  | string
  | boolean
  | { value: string; description?: string };

export interface FeatureSection {
  key: string;
  name: string;
}

export interface Feature {
  name: string;
  description?: string;
  section: string;
  infoUrl?: string;
  plans: Partial<Record<PlanName, FeatureCell>>;
}

export const FEATURE_SECTIONS: FeatureSection[] = [
  { key: "events", name: "Events" },
  { key: "realtime", name: "Realtime" },
  { key: "observability", name: "Observability" },
];

export const FEATURES: Feature[] = [
  {
    name: "Base price",
    section: "comparison",
    plans: {
      [PLAN_NAMES.hobby]: "$0",
      [PLAN_NAMES.pro]: "$99 /mo",
      [PLAN_NAMES.enterprise]: "Contact us",
    },
  },
  {
    name: "Executions",
    description: "A single durable function run or step execution",
    section: "comparison",
    infoUrl: "/docs/features/inngest-functions?ref=pricing-comparison-table",
    plans: {
      [PLAN_NAMES.hobby]: "50k /mo included",
      [PLAN_NAMES.pro]: {
        value: "1m /mo included",
        description: "then $50 per 1m",
      },
      [PLAN_NAMES.enterprise]: "Custom",
    },
  },
  {
    name: "Concurrency",
    description: "Process steps in parallel while smoothing load",
    section: "comparison",
    infoUrl: "/docs/guides/concurrency?ref=pricing-comparison-table",
    plans: {
      [PLAN_NAMES.hobby]: "5 included",
      [PLAN_NAMES.pro]: {
        value: "100 included",
        description: "then $25 per 25",
      },
      [PLAN_NAMES.enterprise]: "500 included",
    },
  },
  {
    name: "Users",
    description: "Develop with your entire team",
    section: "comparison",
    plans: {
      [PLAN_NAMES.hobby]: "3",
      [PLAN_NAMES.pro]: { value: "15", description: "then $10/user" },
      [PLAN_NAMES.enterprise]: "50",
    },
  },
  {
    name: "Workers",
    description: "Low latency always-connected workers",
    section: "comparison",
    plans: {
      [PLAN_NAMES.hobby]: "3",
      [PLAN_NAMES.pro]: { value: "20", description: "then $10/worker" },
      [PLAN_NAMES.enterprise]: "Custom",
    },
  },
  {
    name: "Serverless workers",
    description: "Serverless endpoints for your apps",
    section: "comparison",
    plans: {
      [PLAN_NAMES.hobby]: "Unlimited",
      [PLAN_NAMES.pro]: "Unlimited",
      [PLAN_NAMES.enterprise]: "Unlimited",
    },
  },
  {
    name: "Dedicated slack channel",
    description: "Direct P0 support from our team",
    section: "comparison",
    plans: {
      [PLAN_NAMES.hobby]: false,
      [PLAN_NAMES.pro]: false,
      [PLAN_NAMES.enterprise]: true,
    },
  },
  {
    name: "HIPAA",
    description: "BAAs for healthcare compliance",
    section: "comparison",
    plans: {
      [PLAN_NAMES.hobby]: false,
      [PLAN_NAMES.pro]: "Add-on",
      [PLAN_NAMES.enterprise]: true,
    },
  },
  {
    name: "Events",
    description: "Received/processed",
    section: "events",
    infoUrl: "/docs/guides/sending-events-from-functions?ref=pricing-comparison-table",
    plans: {
      [PLAN_NAMES.hobby]: "500k/mo included",
      [PLAN_NAMES.pro]: {
        value: "5m/mo included",
        description: "then $0.5 per 1m",
      },
      [PLAN_NAMES.enterprise]: "Custom",
    },
  },
  {
    name: "Queue depth",
    description: "Maximum events queued awaiting execution",
    section: "events",
    plans: {
      [PLAN_NAMES.hobby]: "100k included",
      [PLAN_NAMES.pro]: "1m included",
      [PLAN_NAMES.enterprise]: "Custom",
    },
  },
  {
    name: "Size",
    description: "Size of a single event",
    section: "events",
    plans: {
      [PLAN_NAMES.hobby]: "256 KiB",
      [PLAN_NAMES.pro]: "3 MiB",
      [PLAN_NAMES.enterprise]: "Custom",
    },
  },
  {
    name: "Batch capacity",
    description: "Number of events in a single batch",
    section: "events",
    plans: {
      [PLAN_NAMES.hobby]: "5",
      [PLAN_NAMES.pro]: "100",
      [PLAN_NAMES.enterprise]: "Custom",
    },
  },
  {
    name: "Batch timeout",
    description: "Time to wait for a batch to be full",
    section: "events",
    plans: {
      [PLAN_NAMES.hobby]: "30 seconds",
      [PLAN_NAMES.pro]: "5 minutes",
      [PLAN_NAMES.enterprise]: "Custom",
    },
  },
  {
    name: "Connections",
    section: "realtime",
    infoUrl: "/docs/features/realtime?ref=pricing-comparison-table",
    plans: {
      [PLAN_NAMES.hobby]: "50",
      [PLAN_NAMES.pro]: "1000",
      [PLAN_NAMES.enterprise]: "1000",
    },
  },
  {
    name: "Messages",
    section: "realtime",
    plans: {
      [PLAN_NAMES.hobby]: "250k per day",
      [PLAN_NAMES.pro]: "1m per day",
      [PLAN_NAMES.enterprise]: "1m per day",
    },
  },
  {
    name: "Metrics granularity",
    description: "Real-time function metrics",
    section: "observability",
    infoUrl: "/docs/platform/monitor/observability-metrics?ref=pricing-comparison-table",
    plans: {
      [PLAN_NAMES.hobby]: "30 minutes",
      [PLAN_NAMES.pro]: "15 minutes",
      [PLAN_NAMES.enterprise]: "1 minute",
    },
  },
  {
    name: "Trace and log history",
    description: "Tracing for every function run",
    section: "observability",
    infoUrl: "/docs/platform/monitor/inspecting-function-runs?ref=pricing-comparison-table",
    plans: {
      [PLAN_NAMES.hobby]: "24 hours",
      [PLAN_NAMES.pro]: "7 days",
      [PLAN_NAMES.enterprise]: "90 days",
    },
  },
  {
    name: "Span data ingested",
    description: "Trace span data ingested for observability",
    section: "observability",
    plans: {
      [PLAN_NAMES.hobby]: "500 MB included",
      [PLAN_NAMES.pro]: {
        value: "5 GB included",
        description: "then $3/GB",
      },
      [PLAN_NAMES.enterprise]: "Custom",
    },
  },
  {
    name: "Scores",
    description: "Evaluation scores ingested for observability",
    section: "observability",
    plans: {
      [PLAN_NAMES.hobby]: "10K included",
      [PLAN_NAMES.pro]: {
        value: "50K included",
        description: "then $1.50 per 1K",
      },
      [PLAN_NAMES.enterprise]: "Custom",
    },
  },
  {
    name: "Trace and log exports",
    description: "Push traces and logs to other systems",
    section: "observability",
    plans: {
      [PLAN_NAMES.hobby]: false,
      [PLAN_NAMES.pro]: false,
      [PLAN_NAMES.enterprise]: "Contact us",
    },
  },
  {
    name: "Advanced observability",
    description: "Integration with Datadog, etc",
    section: "observability",
    plans: {
      [PLAN_NAMES.hobby]: false,
      [PLAN_NAMES.pro]: "$300",
      [PLAN_NAMES.enterprise]: true,
    },
  },
];
