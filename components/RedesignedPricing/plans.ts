export type Plan = {
  name: string;
  cost: {
    startsAt?: boolean;
    between?: boolean;
    // Use numbers for calculators
    basePrice: number | string;
    endPrice?: number;
    includedRuns: number | string;
    additionalRunsPrice: number | string | null;
    additionalRunsRate?: number;
    includedSteps: number | string;
    additionalStepsPrice: number | string | null;
    additionalStepsRate?: number;
    includedConcurrency: number | string;
    additionalConcurrencyPrice: number | string | null;
    additionalConcurrencyRate?: number;
    includedUsers: number | string;
    additionalUsersPrice: number | string | null;
    additionalUsersRate?: number;
    period?: string;
    includedWorkers?: number | string;
    additionalWorkersPrice?: number | string | null;
    additionalWorkersRate?: number;
  };
  description: React.ReactNode | string;
  hideFromCards?: boolean;
  recommended?: boolean;
  primaryCTA?: boolean;
  cta: {
    href: string;
    text: string;
  };
  highlights: {
    runs: string;
    concurrency: string;
    realtime: string;
    users: string;
  };
  planIncludes: string;
  features: string[];
};

export type Feature = {
  name: string;
  description?: string;
  section:
    | "platform"
    | "recovery"
    | "observability"
    | "data"
    | "connectivity"
    | "organization";
  all?: boolean | string; // All plans offer this
  plans?: {
    [key: string]: string | boolean | { value: string; description?: string };
  };
  infoUrl?: string;
};

export const PLAN_NAMES = {
  basicFree: "Hobby",
  pro: "Pro",
  enterprise: "Enterprise",
  payAsYouGo: "Hobby (Pay as you go)",
};

export const PLANS: Plan[] = [
  {
    name: PLAN_NAMES.basicFree,
    cost: {
      basePrice: 0,
      includedRuns: 100_000,
      additionalRunsPrice: 10, // $50 per 1m (10 per 200k)
      additionalRunsRate: 200_000,
      includedSteps: 5,
      additionalStepsPrice: 10,
      additionalStepsRate: 200_000,
      includedConcurrency: 25,
      additionalConcurrencyPrice: 25,
      additionalConcurrencyRate: 25,
      includedUsers: 3,
      additionalUsersPrice: 10,
      additionalUsersRate: 1,
      period: "mo",
      includedWorkers: 3,
      additionalWorkersPrice: 10,
      additionalWorkersRate: 1,
    },
    primaryCTA: false,
    description:
      "Get started with modern durable execution for free, no credit card required",
    cta: {
      href: `${process.env.NEXT_PUBLIC_SIGNUP_URL}?ref=pricing-card-free`,
      text: "Get started for free",
    },
    highlights: {
      runs: "100,000 executions",
      concurrency: "25 concurrent steps",
      realtime: "50 realtime connections",
      users: "3 users",
    },
    planIncludes: "INCLUDED IN HOBBY PLAN",
    features: [
      "Unlimited branch and staging envs",
      "Logs, traces, and observability",
      "Basic alerting",
      "Community support",
    ],
  },
  {
    name: PLAN_NAMES.payAsYouGo,
    cost: {
      basePrice: "Usage",
      includedRuns: 0,
      additionalRunsPrice: 0.5, // $0.5 per 1k runs
      additionalRunsRate: 1000,
      includedSteps: 5,
      additionalStepsPrice: 0.5,
      additionalStepsRate: 1000,
      includedConcurrency: 10,
      additionalConcurrencyPrice: 10,
      additionalConcurrencyRate: 10,
      includedUsers: 1,
      additionalUsersPrice: 10,
      additionalUsersRate: 1,
      period: "mo",
      includedWorkers: 3,
      additionalWorkersPrice: 10,
      additionalWorkersRate: 1,
      //   between: true,
      //   endPrice: 75,
    },
    description: "Pay only for what you use with no upfront commitment",
    cta: {
      href: `${process.env.NEXT_PUBLIC_SIGNUP_URL}?ref=pricing-card-payg`,
      text: "Get started",
    },
    highlights: {
      runs: "Pay per execution (100k included)",
      concurrency: "25 concurrent steps",
      realtime: "50 realtime connections",
      users: "3 users",
    },
    planIncludes: "INCLUDED IN HOBBY PLAN",
    features: [
      "Unlimited branch and staging envs",
      "Logs, traces, and observability",
      "Basic alerting",
      "Community support",
    ],
    hideFromCards: true,
  },
  {
    name: PLAN_NAMES.pro,
    cost: {
      startsAt: true,
      basePrice: 75,
      includedRuns: 1_000_000,
      additionalRunsPrice: 10, // $50 per 1 m (10 per 200 k)
      additionalRunsRate: 200_000,
      includedSteps: 5,
      additionalStepsPrice: 10,
      additionalStepsRate: 200_000,
      includedConcurrency: 100,
      additionalConcurrencyPrice: 25,
      additionalConcurrencyRate: 25,
      includedUsers: 15,
      additionalUsersPrice: 10,
      additionalUsersRate: 1,
      period: "mo",
      includedWorkers: 20,
      additionalWorkersPrice: 10,
      additionalWorkersRate: 1,
    },
    description:
      "Production-ready systems with extended features for scaling companies",
    primaryCTA: true,
    recommended: true,
    cta: {
      href: `${process.env.NEXT_PUBLIC_SIGNUP_URL}?ref=pricing-card-pro`,
      text: "Get started for free",
    },
    highlights: {
      runs: "1,000,000+ executions",
      concurrency: "100 concurrent steps",
      realtime: "1000+ realtime connections",
      users: "15 users",
    },
    planIncludes: "INCLUDED IN PRO PLAN",
    features: [
      "Granular metrics",
      "Increased scale and throughput",
      "Height usage limits",
      "14 day trace retention",
    ],
  },
  {
    name: PLAN_NAMES.enterprise,
    cost: {
      basePrice: "Contact us",
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
      period: "mo",
      includedWorkers: "Custom",
      additionalWorkersPrice: "Custom",
      additionalWorkersRate: null,
    },
    description:
      "Get started with modern durable execution for free, with the future to grow",
    cta: {
      href: "/contact?ref=pricing-card-enterprise",
      text: "Request a demo",
    },
    highlights: {
      runs: "Custom executions",
      concurrency: "500-50k concurrent steps",
      realtime: "1000+ realtime connections",
      users: "Custom users",
    },
    planIncludes: "INCLUDED IN ENTERPRISE PLAN",
    features: [
      "SAML, RBAC, and audit trails",
      "Exportable observability",
      "90 day trace retention",
      "Dedicated slack channel",
    ],
  },
];

export function getPlan(
  planName: typeof PLAN_NAMES[keyof typeof PLAN_NAMES]
): Plan {
  return PLANS.find((p) => p.name === planName);
}

export const sections: { key: string; name: string; description?: string }[] = [
  { key: "platform", name: "Plan comparison" },
  { key: "connectivity", name: "Realtime" },
  { key: "observability", name: "Observability" },
];

export const FEATURES: Feature[] = [
  {
    name: "Base price",
    plans: {
      [PLAN_NAMES.basicFree]: "$0",
      [PLAN_NAMES.pro]: "$75 /mo",
      [PLAN_NAMES.enterprise]: "Contact us",
    },
    section: "platform",
  },
  {
    name: "Executions",
    description: "A single durable function run or step execution",
    plans: {
      [PLAN_NAMES.basicFree]: {
        value: "100k /mo included",
        description: "then $50 per 1m",
      },
      [PLAN_NAMES.pro]: {
        value: "1m /mo included",
        description: "then $50 per 1m",
      },
      [PLAN_NAMES.enterprise]: "Custom",
    },
    infoUrl: "/docs/features/inngest-functions?ref=pricing",
    section: "platform",
  },
  {
    name: "Events",
    description: "A single 32kb event ingested/processed",
    plans: {
      [PLAN_NAMES.basicFree]: {
        value: "1m /day included",
        description: "then $0.5 per 1m",
      },
      [PLAN_NAMES.pro]: {
        value: "5m /day included",
        description: "then $0.5 per 1m",
      },
      [PLAN_NAMES.enterprise]: "Custom",
    },
    infoUrl: "/docs/features/events?ref=pricing",
    section: "platform",
  },
  {
    name: "Concurrency",
    description: "Process steps in parallel while smoothing load",
    plans: {
      [PLAN_NAMES.basicFree]: {
        value: "25 included",
        description: "then $25 per 25",
      },
      [PLAN_NAMES.pro]: {
        value: "100 included",
        description: "then $25 per 25",
      },
      [PLAN_NAMES.enterprise]: "500 included",
    },
    infoUrl: "/docs/guides/concurrency?ref=pricing",
    section: "platform",
  },
  {
    name: "Users",
    description: "Develop with your entire team",
    plans: {
      [PLAN_NAMES.basicFree]: {
        value: "3",
        description: "then $10/user",
      },
      [PLAN_NAMES.pro]: {
        value: "15",
        description: "then $10/user",
      },
      [PLAN_NAMES.enterprise]: "50",
    },
    section: "platform",
  },
  {
    name: "Workers",
    description: "Low latency always-connected workers",
    plans: {
      [PLAN_NAMES.basicFree]: "3",
      [PLAN_NAMES.pro]: {
        value: "20",
        description: "then $10/worker",
      },
      [PLAN_NAMES.enterprise]: "Custom",
    },
    infoUrl: "/docs/features/workers?ref=pricing",
    section: "platform",
  },
  {
    name: "Serverless workers",
    description: "Serverless endpoints for your apps",
    all: "Unlimited",
    infoUrl: "/docs/features/serverless-workers?ref=pricing",
    section: "platform",
  },
  {
    name: "Dedicated slack channel",
    description: "Direct P0 support from our team",
    plans: {
      [PLAN_NAMES.basicFree]: false,
      [PLAN_NAMES.pro]: "$200",
      [PLAN_NAMES.enterprise]: true,
    },
    section: "platform",
  },
  {
    name: "Connections",
    plans: {
      [PLAN_NAMES.basicFree]: "50",
      [PLAN_NAMES.pro]: "1000",
      [PLAN_NAMES.enterprise]: "1000",
    },
    infoUrl: "/docs/features/realtime?ref=pricing",
    section: "connectivity",
  },
  {
    name: "Messages",
    plans: {
      [PLAN_NAMES.basicFree]: "250k per day",
      [PLAN_NAMES.pro]: "1m per day",
      [PLAN_NAMES.enterprise]: "1m per day",
    },
    infoUrl: "/docs/features/realtime-messages?ref=pricing",
    section: "connectivity",
  },
  {
    name: "Metrics granularity",
    description: "Real-time function metrics",
    plans: {
      [PLAN_NAMES.basicFree]: "30 minutes",
      [PLAN_NAMES.pro]: "15 minutes",
      [PLAN_NAMES.enterprise]: "366 days",
    },
    infoUrl: "/docs/platform/monitor/observability-metrics?ref=pricing",
    section: "observability",
  },
  {
    name: "Trace and log history",
    description: "Tracing for every function run",
    plans: {
      [PLAN_NAMES.basicFree]: "24 hours",
      [PLAN_NAMES.pro]: "7 days",
      [PLAN_NAMES.enterprise]: "30 days",
    },
    infoUrl: "/docs/platform/monitor/inspecting-function-runs?ref=pricing",
    section: "observability",
  },
  {
    name: "Trace and log exports",
    description: "Push traces and logs to other systems",
    plans: {
      [PLAN_NAMES.basicFree]: false,
      [PLAN_NAMES.pro]: false,
      [PLAN_NAMES.enterprise]: "Contact us",
    },
    infoUrl: "/docs/platform/monitor/trace-log-exports?ref=pricing",
    section: "observability",
  },
  {
    name: "Advanced observability",
    description: "Integration with Datadog, etc",
    plans: {
      [PLAN_NAMES.basicFree]: false,
      [PLAN_NAMES.pro]: "$300",
      [PLAN_NAMES.enterprise]: true,
    },
    infoUrl: "/docs/platform/monitor/advanced-observability?ref=pricing",
    section: "observability",
  },
];
