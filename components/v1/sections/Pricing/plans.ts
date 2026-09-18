import type { ReactNode } from "react";

// v1 Pricing plans + comparison-table feature rows. Copy/values
// follow the redesign. The calculator math matches the legacy
// /pricing tier model — see PricingCalculator.tsx.

export const PLAN_NAMES = {
  hobby: "Free",
  pro: "Pro",
  business: "Business",
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
  /** Feature bullets below the CTA, grouped by `category` on the card.
   *  `value`, when set, renders bold before the label — e.g. **50k**
   *  executions. `note`, when set, renders below in a smaller, lighter
   *  weight. */
  features: {
    category:
      | "Platform"
      | "Events"
      | "Observability"
      | "Security"
      | "Support";
    value?: string;
    text: string;
    note?: string;
  }[];
  /** Tags / badges (e.g. "POPULAR"). */
  badge?: string;
}

const SIGNUP =
  process.env.NEXT_PUBLIC_SIGNUP_URL ?? "https://app.inngest.com/sign-up";

export const PLANS: Plan[] = [
  {
    name: PLAN_NAMES.hobby,
    description:
      "Generous monthly limits to prove it before production. No credit card required.",
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
      includedUsers: 5,
      additionalUsersPrice: null,
      additionalUsersRate: null,
      includedWorkers: 3,
      additionalWorkersPrice: null,
      additionalWorkersRate: null,
    },
    priceCaption: "No credit card required",
    cta: {
      href: `${SIGNUP}?ref=pricing-card-hobby`,
      text: "Start Free",
    },
    features: [
      { category: "Platform", value: "5", text: "seats" },
      { category: "Platform", value: "50k", text: "executions" },
      { category: "Platform", value: "5", text: "concurrent steps" },
      { category: "Platform", value: "3", text: "workers" },
      { category: "Platform", value: "Unlimited", text: "serverless workers" },
      { category: "Events", value: "500k", text: "events ingested" },
      { category: "Events", value: "100k", text: "queue depth" },
      { category: "Events", value: "50", text: "realtime connections" },
      { category: "Events", value: "256 KiB", text: "event size" },
      { category: "Observability", value: "500 MB", text: "span data ingested" },
      { category: "Observability", value: "10K", text: "scores" },
      { category: "Observability", value: "24 hour", text: "trace history" },
      { category: "Observability", value: "30 minute", text: "metrics granularity" },
    ],
  },
  {
    name: PLAN_NAMES.pro,
    description:
      "Production-ready features for teams that still need lots of flexibility.",
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
      text: "Start Free",
    },
    features: [
      { category: "Platform", value: "15", text: "seats" },
      { category: "Platform", value: "1M", text: "executions + add-on" },
      { category: "Platform", value: "100+", text: "concurrent steps" },
      { category: "Platform", value: "20", text: "workers + add-on" },
      { category: "Platform", value: "Unlimited", text: "serverless workers" },
      { category: "Events", value: "5M+", text: "events ingested" },
      { category: "Events", value: "1M+", text: "queue depth" },
      { category: "Events", value: "1000", text: "realtime connections" },
      { category: "Events", value: "3 MiB", text: "event size" },
      { category: "Observability", value: "5GB", text: "span data + overages" },
      { category: "Observability", value: "50K", text: "scores" },
      { category: "Observability", value: "7 day", text: "trace history" },
      { category: "Observability", value: "15 minute", text: "metrics granularity" },
      { category: "Observability", text: "Datadog / advanced observability add-on" },
      { category: "Security", text: "HIPAA add-on" },
    ],
    badge: "POPULAR",
  },
  {
    name: PLAN_NAMES.business,
    description: "For growing teams that want to optimize cost at scale.",
    cost: {
      startsAt: true,
      basePrice: 499,
      period: "mo",
      includedRuns: 10_000_000,
      additionalRunsPrice: 50,
      additionalRunsRate: 1_000_000,
      includedSteps: 5,
      additionalStepsPrice: 4,
      additionalStepsRate: 200_000,
      includedConcurrency: 500,
      additionalConcurrencyPrice: 25,
      additionalConcurrencyRate: 25,
      includedUsers: 30,
      additionalUsersPrice: 10,
      additionalUsersRate: 1,
      includedWorkers: 100,
      additionalWorkersPrice: 10,
      additionalWorkersRate: 1,
    },
    priceCaption: "",
    cta: {
      href: `${SIGNUP}?ref=pricing-card-business`,
      text: "Start Free",
    },
    features: [
      { category: "Platform", value: "30", text: "seats" },
      { category: "Platform", value: "10M", text: "executions + add-on" },
      { category: "Platform", value: "500", text: "concurrent steps" },
      { category: "Platform", value: "100", text: "workers + add-on" },
      { category: "Platform", value: "Unlimited", text: "serverless workers" },
      { category: "Events", value: "50M+", text: "events ingested" },
      { category: "Events", value: "10M+", text: "queue depth" },
      { category: "Events", value: "5000", text: "realtime connections" },
      { category: "Events", value: "3 MiB", text: "event size" },
      { category: "Observability", value: "25GB", text: "span data + overages" },
      { category: "Observability", value: "250K", text: "scores" },
      { category: "Observability", value: "14 day", text: "trace history" },
      { category: "Observability", value: "1 minute", text: "metrics granularity" },
      { category: "Observability", text: "Datadog / advanced observability add-on" },
      { category: "Security", text: "HIPAA add-on" },
    ],
  },
  {
    name: PLAN_NAMES.enterprise,
    description:
      "For established teams that need additional security, support, and observability.",
    cost: {
      basePrice: "Custom",
      includedRuns: "Custom",
      additionalRunsPrice: "Custom",
      additionalRunsRate: null,
      includedSteps: "Custom",
      additionalStepsPrice: "Custom",
      additionalStepsRate: null,
      includedConcurrency: 500,
      additionalConcurrencyPrice: "Custom",
      additionalConcurrencyRate: null,
      includedUsers: "Custom",
      additionalUsersPrice: "Custom",
      additionalUsersRate: null,
      includedWorkers: "Unlimited",
      additionalWorkersPrice: "Custom",
      additionalWorkersRate: null,
    },
    priceCaption: "Contact us to learn more",
    cta: {
      href: "/contact?ref=pricing-card-enterprise",
      text: "Contact Us",
    },
    features: [
      { category: "Platform", value: "Custom", text: "seats" },
      { category: "Platform", value: "Custom", text: "executions" },
      { category: "Platform", value: "Custom", text: "concurrent steps" },
      { category: "Platform", value: "Custom", text: "workers" },
      { category: "Platform", value: "Unlimited", text: "serverless workers" },
      { category: "Events", value: "Custom", text: "events ingested" },
      { category: "Events", value: "Custom", text: "queue depth" },
      { category: "Events", value: "1000", text: "realtime connections" },
      { category: "Events", value: "Custom", text: "event size" },
      { category: "Observability", value: "Custom", text: "span data ingested" },
      { category: "Observability", value: "Custom", text: "scores" },
      { category: "Observability", value: "90 day", text: "trace history" },
      { category: "Observability", value: "1 minute", text: "metrics granularity" },
      { category: "Observability", text: "Trace and log exports" },
      { category: "Observability", text: "Datadog and advanced observability" },
      { category: "Security", text: "SAML, RBAC, audit trails" },
      { category: "Security", text: "HIPAA included" },
      { category: "Support", text: "Dedicated Slack channel" },
      { category: "Support", text: "Dedicated account management" },
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
      [PLAN_NAMES.business]: "$499 /mo",
      [PLAN_NAMES.enterprise]: "Contact us",
    },
  },
  {
    name: "Executions",
    description: "A single durable function run or step execution",
    section: "comparison",
    plans: {
      [PLAN_NAMES.hobby]: "50k /mo included",
      [PLAN_NAMES.pro]: "1M executions + add-on",
      [PLAN_NAMES.business]: "10M executions + add-on",
      [PLAN_NAMES.enterprise]: "Custom",
    },
  },
  {
    name: "Concurrent steps",
    description: "Process steps in parallel while smoothing load",
    section: "comparison",
    plans: {
      [PLAN_NAMES.hobby]: "5 included",
      [PLAN_NAMES.pro]: {
        value: "100 included",
        description: "then $25 per 25",
      },
      [PLAN_NAMES.business]: "500 included",
      [PLAN_NAMES.enterprise]: "500 included",
    },
  },
  {
    name: "Seats",
    description: "Develop with your entire team",
    section: "comparison",
    plans: {
      [PLAN_NAMES.hobby]: "5",
      [PLAN_NAMES.pro]: { value: "15", description: "then $10/seat" },
      [PLAN_NAMES.business]: { value: "30", description: "then $10/seat" },
      [PLAN_NAMES.enterprise]: "Custom",
    },
  },
  {
    name: "Workers",
    description: "Low latency always-connected workers",
    section: "comparison",
    plans: {
      [PLAN_NAMES.hobby]: "3",
      [PLAN_NAMES.pro]: "20 workers + add-on",
      [PLAN_NAMES.business]: "100 workers + add-on",
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
      [PLAN_NAMES.business]: "Unlimited",
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
      [PLAN_NAMES.business]: false,
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
      [PLAN_NAMES.business]: "Add-on",
      [PLAN_NAMES.enterprise]: true,
    },
  },
  {
    name: "Events",
    description: "Received/processed",
    section: "events",
    plans: {
      [PLAN_NAMES.hobby]: "500k/mo included",
      [PLAN_NAMES.pro]: {
        value: "5m/mo included",
        description: "then $0.5 per 1m",
      },
      [PLAN_NAMES.business]: "50m/mo included",
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
      [PLAN_NAMES.business]: "10m included",
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
      [PLAN_NAMES.business]: "3 MiB",
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
      [PLAN_NAMES.business]: "500",
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
      [PLAN_NAMES.business]: "5 minutes",
      [PLAN_NAMES.enterprise]: "Custom",
    },
  },
  {
    name: "Connections",
    section: "realtime",
    plans: {
      [PLAN_NAMES.hobby]: "50",
      [PLAN_NAMES.pro]: "1000",
      [PLAN_NAMES.business]: "5000",
      [PLAN_NAMES.enterprise]: "Custom",
    },
  },
  {
    name: "Messages",
    section: "realtime",
    plans: {
      [PLAN_NAMES.hobby]: "250k per day",
      [PLAN_NAMES.pro]: "1m per day",
      [PLAN_NAMES.business]: "5m per day",
      [PLAN_NAMES.enterprise]: "Custom",
    },
  },
  {
    name: "Metrics granularity",
    description: "Real-time function metrics",
    section: "observability",
    plans: {
      [PLAN_NAMES.hobby]: "30 minutes",
      [PLAN_NAMES.pro]: "15 minutes",
      [PLAN_NAMES.business]: "1 minute",
      [PLAN_NAMES.enterprise]: "1 minute",
    },
  },
  {
    name: "Trace and log history",
    description: "Tracing for every function run",
    section: "observability",
    plans: {
      [PLAN_NAMES.hobby]: "24 hours",
      [PLAN_NAMES.pro]: "7 days",
      [PLAN_NAMES.business]: "14 days",
      [PLAN_NAMES.enterprise]: "90 days",
    },
  },
  {
    name: "Span data ingested",
    description: "Trace span data ingested for observability",
    section: "observability",
    plans: {
      [PLAN_NAMES.hobby]: "500 MB included",
      [PLAN_NAMES.pro]: "5GB span data + overages",
      [PLAN_NAMES.business]: "25GB span data + overages",
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
      [PLAN_NAMES.business]: "250K included",
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
      [PLAN_NAMES.business]: false,
      [PLAN_NAMES.enterprise]: true,
    },
  },
  {
    name: "Advanced observability",
    description: "Integration with Datadog, etc",
    section: "observability",
    plans: {
      [PLAN_NAMES.hobby]: false,
      [PLAN_NAMES.pro]: "$300",
      [PLAN_NAMES.business]: "$300",
      [PLAN_NAMES.enterprise]: true,
    },
  },
];
