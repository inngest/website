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
  basicFree: "Free",
  basic: "Basic",
  pro: "Pro",
  enterprise: "Enterprise",
};

export const PLANS: Plan[] = [
  {
    name: PLAN_NAMES.basicFree,
    cost: {
      basePrice: 0,
      includedRuns: 50_000,
      additionalRunsPrice: "-",
      additionalRunsRate: null,
      includedSteps: 5,
      additionalStepsPrice: "-",
      additionalStepsRate: null,
      includedConcurrency: 5,
      additionalConcurrencyPrice: "-",
      additionalConcurrencyRate: null,
      includedUsers: 5,
      additionalUsersPrice: "-",
      additionalUsersRate: null,
      period: "mo",
    },
    primaryCTA: true,
    description:
      "Get started with modern durable execution for free, with the future to grow",
    cta: {
      href: `${process.env.NEXT_PUBLIC_SIGNUP_URL}?ref=pricing-card-free`,
      text: "Start for free",
    },
    highlights: {
      runs: "50K runs free",
      concurrency: "5 concurrent steps",
    },
    planIncludes: "Free plan includes:",
    features: [
      "Unlimited branch and staging envs",
      "Logs, traces, and observability",
      "Basic alerting",
      "Community support",
    ],
  },
  {
    name: PLAN_NAMES.basic,
    cost: {
      between: false,
      startsAt: true,
      basePrice: 50,
      endPrice: 300,
      includedRuns: 100_000,
      additionalRunsPrice: 5,
      additionalRunsRate: 50_000,
      includedSteps: 5,
      additionalStepsPrice: 4,
      additionalStepsRate: 50_000,
      includedConcurrency: 25,
      additionalConcurrencyPrice: "-",
      additionalConcurrencyRate: null,
      includedUsers: 5,
      additionalUsersPrice: 10,
      additionalUsersRate: 1,
      period: "mo",
    },
    primaryCTA: true,
    description: "Build and deploy small scale reliable systems effortlessly",
    cta: {
      href: `${process.env.NEXT_PUBLIC_SIGNUP_URL}?ref=pricing-card-basic`,
      text: "Start for free",
    },
    highlights: {
      runs: "100K runs included",
      concurrency: "25 concurrent steps",
    },
    planIncludes: "Everything in Free plus:",
    features: [
      "7 day trace and history retention",
      "Unlimited functions and apps",
      "No event rate limit",
      "Basic email and ticketing support",
    ],
  },
  {
    name: PLAN_NAMES.pro,
    cost: {
      startsAt: true,
      basePrice: 350,
      includedRuns: 5_000_000,
      additionalRunsPrice: 5,
      additionalRunsRate: 200_000,
      includedSteps: 5,
      additionalStepsPrice: 4,
      additionalStepsRate: 200_000,
      includedConcurrency: 200,
      additionalConcurrencyPrice: 10,
      additionalConcurrencyRate: 10,
      includedUsers: 20,
      additionalUsersPrice: 10,
      additionalUsersRate: 1,
      period: "mo",
    },
    description:
      "Production-ready systems with extended features for scaling companies",
    primaryCTA: true,
    recommended: true,
    cta: {
      href: `${process.env.NEXT_PUBLIC_SIGNUP_URL}?ref=pricing-card-pro`,
      text: "Get started",
    },
    highlights: {
      runs: "5M runs included",
      concurrency: "200+ concurrent steps",
    },
    planIncludes: "Includes everything in Basic plus:",
    features: [
      "14 day trace retention",
      "Granular metrics",
      "Increased scale and throughput",
      "Higher usage limits",
      "SOC2",
      "HIPAA as a paid addon",
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
      includedConcurrency: "Custom",
      additionalConcurrencyPrice: "Custom",
      additionalConcurrencyRate: null,
      includedUsers: "Custom",
      additionalUsersPrice: "Custom",
      additionalUsersRate: null,
    },
    description:
      "For critical products with additional scale, security, observability, latency, and support",
    cta: {
      href: "/contact?ref=pricing-card-enterprise",
      text: "Request demo",
    },
    highlights: {
      runs: "From 0-100B runs/mo",
      concurrency: "From 1k-100K+ concurrent steps",
    },
    planIncludes: "Includes everything in pro plus:",
    features: [
      "SAML, RBAC, and audit trails",
      "Exportable observability",
      "Dedicated infrastructure",
      "90 day trace retention",
      "99.99% uptime SLAs",
      "Support SLAs",
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
  { key: "platform", name: "Platform" },
  {
    key: "recovery",
    name: "Recovery and management",
    description: "Included with every plan",
  },
  { key: "observability", name: "Observability" },
  { key: "data", name: "Time-based data management" },
  { key: "connectivity", name: "Connectivity" },
  { key: "organization", name: "Organization" },
];

export const FEATURES: Feature[] = [
  {
    name: "Base price",
    plans: {
      [PLAN_NAMES.basicFree]: `$${
        getPlan(PLAN_NAMES.basicFree).cost.basePrice
      } /${getPlan(PLAN_NAMES.basic).cost.period}`,
      [PLAN_NAMES.basic]: `$${getPlan(PLAN_NAMES.basic).cost.basePrice} /${
        getPlan(PLAN_NAMES.basic).cost.period
      }`,
      [PLAN_NAMES.pro]: `$${getPlan(PLAN_NAMES.pro).cost.basePrice} /${
        getPlan(PLAN_NAMES.pro).cost.period
      }`,
      [PLAN_NAMES.enterprise]: `${
        getPlan(PLAN_NAMES.enterprise).cost.basePrice
      }`,
    },
    section: "platform",
  },
  {
    name: "Runs",
    description: "A single durable function execution",
    plans: {
      [PLAN_NAMES.basicFree]: `${getPlan(
        PLAN_NAMES.basicFree
      ).cost.includedRuns.toLocaleString(undefined, {
        notation: "compact",
        compactDisplay: "short",
      })} /${getPlan(PLAN_NAMES.basicFree).cost.period} included`,
      [PLAN_NAMES.basic]: {
        value: `${getPlan(PLAN_NAMES.basic).cost.includedRuns.toLocaleString(
          undefined,
          {
            notation: "compact",
            compactDisplay: "short",
          }
        )} /${getPlan(PLAN_NAMES.basic).cost.period} included`,
        description: `then $${
          getPlan(PLAN_NAMES.basic).cost.additionalRunsPrice
        } per ${getPlan(
          PLAN_NAMES.basic
        ).cost.additionalRunsRate.toLocaleString(undefined, {
          notation: "compact",
          compactDisplay: "short",
        })}`,
      },
      [PLAN_NAMES.pro]: {
        value: `${getPlan(PLAN_NAMES.pro).cost.includedRuns.toLocaleString(
          undefined,
          {
            notation: "compact",
            compactDisplay: "short",
          }
        )} /${getPlan(PLAN_NAMES.pro).cost.period} included`,
        description: `then $${
          getPlan(PLAN_NAMES.pro).cost.additionalRunsPrice
        } per ${getPlan(PLAN_NAMES.pro).cost.additionalRunsRate.toLocaleString(
          undefined,
          {
            notation: "compact",
            compactDisplay: "short",
          }
        )}`,
      },
      [PLAN_NAMES.enterprise]: `${
        getPlan(PLAN_NAMES.enterprise).cost.includedRuns
      }`,
    },
    infoUrl: "/docs/features/inngest-functions?ref=pricing",
    section: "platform",
  },
  {
    name: "Steps",
    description: "An individual step in durable functions",
    plans: {
      [PLAN_NAMES.basicFree]: {
        value: "250K",
        description: `Avg of 5 steps per run included for free`,
      },
      [PLAN_NAMES.basic]: {
        value: "500K",
        description: `then $${
          getPlan(PLAN_NAMES.basic).cost.additionalStepsPrice
        } per ${getPlan(
          PLAN_NAMES.basic
        ).cost.additionalStepsRate.toLocaleString(undefined, {
          notation: "compact",
          compactDisplay: "short",
        })}`,
      },
      [PLAN_NAMES.pro]: {
        value: "25M",
        description: `then $${
          getPlan(PLAN_NAMES.pro).cost.additionalStepsPrice
        } per ${getPlan(PLAN_NAMES.pro).cost.additionalStepsRate.toLocaleString(
          undefined,
          {
            notation: "compact",
            compactDisplay: "short",
          }
        )}`,
      },
      [PLAN_NAMES.enterprise]: `${
        getPlan(PLAN_NAMES.enterprise).cost.additionalStepsPrice
      }`,
    },
    infoUrl: "/docs/features/inngest-functions/steps-workflows?ref=pricing",
    section: "platform",
  },
  {
    name: "Concurrency",
    description: "Maximum concurrently executing steps",
    plans: {
      [PLAN_NAMES.basicFree]: `${
        getPlan(PLAN_NAMES.basicFree).cost.includedConcurrency
      }`,
      [PLAN_NAMES.basic]: `${
        getPlan(PLAN_NAMES.basic).cost.includedConcurrency
      }`,
      [PLAN_NAMES.pro]: `${getPlan(PLAN_NAMES.pro).cost.includedConcurrency}`,
      [PLAN_NAMES.enterprise]: `${
        getPlan(PLAN_NAMES.enterprise).cost.includedConcurrency
      }`,
    },
    infoUrl: "/docs/guides/concurrency?ref=pricing",
    section: "platform",
  },
  {
    name: "Additional concurrency (per 10)",
    description: "Customizable throughput for any scale",
    plans: {
      [PLAN_NAMES.basicFree]: `${
        getPlan(PLAN_NAMES.basicFree).cost.additionalConcurrencyPrice
      }`,
      [PLAN_NAMES.basic]:
        getPlan(PLAN_NAMES.basic).cost.additionalConcurrencyPrice === "-"
          ? "-"
          : `$${
              getPlan(PLAN_NAMES.basic).cost.additionalConcurrencyPrice
            } per ${getPlan(
              PLAN_NAMES.basic
            ).cost.additionalConcurrencyRate.toLocaleString(undefined, {
              notation: "compact",
              compactDisplay: "short",
            })}`,
      [PLAN_NAMES.pro]: `$${
        getPlan(PLAN_NAMES.pro).cost.additionalConcurrencyPrice
      } per ${getPlan(
        PLAN_NAMES.pro
      ).cost.additionalConcurrencyRate.toLocaleString(undefined, {
        notation: "compact",
        compactDisplay: "short",
      })}`,
      [PLAN_NAMES.enterprise]: `${
        getPlan(PLAN_NAMES.enterprise).cost.additionalConcurrencyPrice
      }`,
    },
    section: "platform",
  },
  {
    name: "Event size",
    description: "The maximum size for a single event",
    plans: {
      [PLAN_NAMES.basicFree]: "256KiB",
      [PLAN_NAMES.basic]: "512KiB",
      [PLAN_NAMES.pro]: "3MiB",
      [PLAN_NAMES.enterprise]: "Custom",
    },
    infoUrl: "/docs/usage-limits/inngest#payload-size?ref=pricing",
    section: "platform",
  },
  {
    name: "Backpressure (per account)",
    description: "Prevent spikes and runaway executions",
    plans: {
      [PLAN_NAMES.basicFree]: "200K",
      [PLAN_NAMES.basic]: "Starts at 2M",
      [PLAN_NAMES.pro]: "Starts at 10M",
      [PLAN_NAMES.enterprise]: "Custom",
    },
    section: "platform",
  },
  {
    name: "Function pausing",
    description: "Easily prevent issues during incidents",
    section: "recovery",
    infoUrl: "/docs/guides/pause-functions?ref=pricing",
    all: true,
  },
  {
    name: "Function replay",
    description: "Replay paused or failed runs, in bulk, effortlessly",
    section: "recovery",
    infoUrl: "/docs/platform/replay?ref=pricing",
    all: true,
  },
  {
    name: "Event replay",
    description: "Redrive events through one or more functions",
    section: "recovery",
    all: true,
  },
  {
    name: "Bulk cancellation",
    description: "Easily manage issues across in progress runs",
    section: "recovery",
    infoUrl: "/docs/platform/manage/bulk-cancellation?ref=pricing",
    all: true,
  },
  {
    name: "Metrics granularity",
    description: "Real-time function metrics",
    plans: {
      [PLAN_NAMES.basicFree]: "15 minutes",
      [PLAN_NAMES.basic]: "15 minutes",
      [PLAN_NAMES.pro]: "5 minutes",
      [PLAN_NAMES.enterprise]: "20 seconds",
    },
    infoUrl: "/docs/platform/monitor/observability-metrics?ref=pricing",
    section: "observability",
  },
  {
    name: "Trace and log history",
    description: "Tracing for every function run",
    plans: {
      [PLAN_NAMES.basicFree]: "24 hours",
      [PLAN_NAMES.basic]: "7 days",
      [PLAN_NAMES.pro]: "14 days",
      [PLAN_NAMES.enterprise]: "90 days",
    },
    infoUrl: "/docs/platform/monitor/inspecting-function-runs?ref=pricing",
    section: "observability",
  },
  {
    name: "Exportable metrics",
    description: "Prometheus exports and integrations",
    plans: {
      [PLAN_NAMES.basicFree]: false,
      [PLAN_NAMES.basic]: "15 minute delay",
      [PLAN_NAMES.pro]: "5m delay",
      [PLAN_NAMES.enterprise]: "No delay",
    },
    infoUrl:
      "/docs/platform/monitor/prometheus-metrics-export-integration?ref=pricing",
    section: "observability",
  },
  {
    name: "Trace and log exports",
    description: "Push traces and logs to other systems",
    plans: {
      [PLAN_NAMES.basicFree]: false,
      [PLAN_NAMES.basic]: false,
      [PLAN_NAMES.pro]: "$2 per 1m steps",
      [PLAN_NAMES.enterprise]: "Contact us",
    },
    section: "observability",
  },
  {
    name: "Batch size",
    description: "Process high-throughput events in batches",
    plans: {
      [PLAN_NAMES.basicFree]: "5",
      [PLAN_NAMES.basic]: "5",
      [PLAN_NAMES.pro]: "100",
      [PLAN_NAMES.enterprise]: "Custom",
    },
    infoUrl: "/docs/guides/batching#configuration-reference?ref=pricing",
    section: "data",
  },
  {
    name: "Batch timeout",
    description: "Configure micro batching timeouts",
    plans: {
      [PLAN_NAMES.basicFree]: "30 seconds",
      [PLAN_NAMES.basic]: "30 seconds",
      [PLAN_NAMES.pro]: "120 seconds",
      [PLAN_NAMES.enterprise]: "20 minutes",
    },
    infoUrl: "/docs/guides/batching#configuration-reference?ref=pricing",
    section: "data",
  },
  {
    name: "Lookback period",
    description: "Easily search and match on past events within functions",
    plans: {
      [PLAN_NAMES.basicFree]: "1 hour",
      [PLAN_NAMES.basic]: "1 hour",
      [PLAN_NAMES.pro]: "3 days",
      [PLAN_NAMES.enterprise]: "Custom",
    },
    section: "data",
  },
  {
    name: "Maximum run length",
    description: "The lifetime of a function, including sleeps",
    plans: {
      [PLAN_NAMES.basicFree]: "30 days",
      [PLAN_NAMES.basic]: "90 days",
      [PLAN_NAMES.pro]: "366 days",
      [PLAN_NAMES.enterprise]: "Custom",
    },
    section: "data",
  },
  {
    name: "Dedicated execution capacity",
    description:
      "Dedicated Inngest infrastructure for low latency, high throughput execution",
    plans: {
      [PLAN_NAMES.basicFree]: false,
      [PLAN_NAMES.basic]: false,
      [PLAN_NAMES.pro]: false,
      [PLAN_NAMES.enterprise]: "$500 per 250 concurrent steps",
    },
    section: "connectivity",
  },
  {
    name: "Users",
    description: "Develop with your entire team",
    plans: {
      [PLAN_NAMES.basicFree]: `${
        getPlan(PLAN_NAMES.basicFree).cost.includedUsers
      }`,
      [PLAN_NAMES.basic]: {
        value: `${getPlan(PLAN_NAMES.basic).cost.includedUsers}`,
        description: `then $${
          getPlan(PLAN_NAMES.basic).cost.additionalUsersPrice
        }/user`,
      },
      [PLAN_NAMES.pro]: {
        value: `${getPlan(PLAN_NAMES.pro).cost.includedUsers}`,
        description: `then $${
          getPlan(PLAN_NAMES.pro).cost.additionalUsersPrice
        }/user`,
      },
      [PLAN_NAMES.enterprise]: "Custom",
    },
    section: "organization",
  },
  {
    name: "SSO/SAML",
    description: "Configure SAML for simple and secure user management",
    plans: {
      [PLAN_NAMES.basicFree]: false,
      [PLAN_NAMES.basic]: false,
      [PLAN_NAMES.pro]: false,
      [PLAN_NAMES.enterprise]: true,
    },
    section: "organization",
  },
  {
    name: "SLA",
    description: "Event and execution SLAs",
    plans: {
      [PLAN_NAMES.basicFree]: false,
      [PLAN_NAMES.basic]: false,
      [PLAN_NAMES.pro]: false,
      [PLAN_NAMES.enterprise]: "99.99%",
    },
    section: "organization",
  },
  {
    name: "Support",
    description: "Dedicated support direct from our engineers",
    plans: {
      [PLAN_NAMES.basicFree]: {
        value: "Community",
        description: "No SLA",
      },
      [PLAN_NAMES.basic]: { value: "Email, community", description: "No SLA" },
      [PLAN_NAMES.pro]: { value: "Email, tickets", description: "48h SLA" },
      [PLAN_NAMES.enterprise]: {
        value: "Email, tickets, slack",
        description: "1h SLA",
      },
    },
    section: "organization",
  },
  {
    name: "HIPAA",
    description: "Sign BAAs for healthcare services",
    plans: {
      [PLAN_NAMES.basicFree]: false,
      [PLAN_NAMES.basic]: false,
      [PLAN_NAMES.pro]: "$500 / mo",
      [PLAN_NAMES.enterprise]: true,
    },
    section: "organization",
  },
  {
    name: "RBAC",
    description: "Assign roles to manage and protect your data",
    plans: {
      [PLAN_NAMES.basicFree]: false,
      [PLAN_NAMES.basic]: false,
      [PLAN_NAMES.pro]: false,
      [PLAN_NAMES.enterprise]: true,
    },
    section: "organization",
  },
  {
    name: "Audit trails",
    description: "Comprehensive tracking for simple security",
    plans: {
      [PLAN_NAMES.basicFree]: false,
      [PLAN_NAMES.basic]: false,
      [PLAN_NAMES.pro]: false,
      [PLAN_NAMES.enterprise]: true,
    },
    section: "organization",
  },
  {
    name: "PII prevention and masking",
    description: "Protect sensitive data directly in events",
    plans: {
      [PLAN_NAMES.basicFree]: false,
      [PLAN_NAMES.basic]: false,
      [PLAN_NAMES.pro]: false,
      [PLAN_NAMES.enterprise]: "$750 / mo",
    },
    section: "organization",
  },
];
