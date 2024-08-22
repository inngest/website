import Header from "src/shared/Header";
import Container from "src/shared/layout/Container";
import ComparisonTable from "src/shared/Pricing/ComparisionTable";
import PlanCard from "src/shared/Pricing/PlanCard";
import Footer from "../shared/Footer";

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
    period?: string;
  };
  description: React.ReactFragment | string;
  hideFromCards?: boolean;
  recommended?: boolean;
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

type Feature = {
  name: string;
  all?: boolean | string; // All plans offer this
  plans?: {
    [key: string]: string | boolean;
  };
  heading?: boolean;
  infoUrl?: string;
};

const PLAN_NAMES = {
  basic: "Basic",
  pro: "Pro",
  enterprise: "Enterprise",
};

const PLANS: Plan[] = [
  {
    name: PLAN_NAMES.basic,
    cost: {
      between: true,
      basePrice: 0,
      endPrice: 300,
      includedRuns: 50_000,
      additionalRunsPrice: 5,
      additionalRunsRate: 50_000,
      includedSteps: 5,
      additionalStepsPrice: 4,
      additionalStepsRate: 50_000,
      includedConcurrency: 5,
      additionalConcurrencyPrice: 10,
      additionalConcurrencyRate: 10,
      period: "mo",
    },
    description:
      "Everything you need to start building and scaling reliable systems for free",
    cta: {
      href: `${process.env.NEXT_PUBLIC_SIGNUP_URL}?ref=pricing-team`,
      text: "Get started for free",
    },
    highlights: {
      runs: "Starts at 50K runs/mo",
      concurrency: "Starts at 5 concurrent runs",
    },
    planIncludes: "Basic plan includes:",
    features: [
      "Unlimited functions and apps",
      "Unlimited branch & staging envs",
      "Logs, traces, and observability",
      "Basic support & alerting",
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
      period: "mo",
    },
    description:
      "Production-ready systems with extended features for mid-sized products",
    recommended: true,
    cta: {
      href: `${process.env.NEXT_PUBLIC_SIGNUP_URL}?ref=pricing-startup`,
      text: "Get started for free",
    },
    highlights: {
      runs: "Starts at 5M runs/mo",
      concurrency: "Starts at 200 concurrent runs",
    },
    planIncludes: "Includes everything in basic plus:",
    features: [
      "Granular metrics",
      "Increased scale and throughput",
      "Higher usage limits",
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
      includedConcurrency: "Custom",
      additionalConcurrencyPrice: "Custom",
      additionalConcurrencyRate: null,
    },
    description:
      "For critical products with additional scale, security, observability, latency, and support",
    cta: {
      href: "/contact?ref=pricing-enterprise",
      text: "Request demo",
    },
    highlights: {
      runs: "From 0-100B runs/mo",
      concurrency: "From 200-100K concurrent runs",
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

function getPlan(planName: string): Plan {
  return PLANS.find((p) => p.name === planName);
}

// function getPlanFeatureQuantity(planName: string, feature: string): string {
//   return (
//     getPlan(planName)?.features.find((f) => f.text === feature)?.quantity || ""
//   );
// }

// function getPlanStepsMonth(plan: Plan): string {
//   if (typeof plan.cost.basePrice === "string") {
//     return plan.cost.basePrice;
//   }
//   const base = plan.cost.included.toLocaleString(undefined, {
//     notation: "compact",
//     compactDisplay: "short",
//   });
//   if (!plan.cost.additionalPrice) {
//     return `${base}`;
//   }
//   return `${base} + $${
//     plan.cost.additionalPrice
//   } per additional ${plan.cost.additionalRate.toLocaleString(undefined, {
//     notation: "compact",
//     compactDisplay: "short",
//   })}`;
// }

// const FEATURES: Feature[] = [
//   {
//     name: "Steps/month",
//     plans: {
//       [PLAN_NAMES.free]: getPlanStepsMonth(getPlan(PLAN_NAMES.free)),
//       [PLAN_NAMES.team]: getPlanStepsMonth(getPlan(PLAN_NAMES.team)),
//       [PLAN_NAMES.startup]: getPlanStepsMonth(getPlan(PLAN_NAMES.startup)),
//       [PLAN_NAMES.enterprise]: getPlanStepsMonth(
//         getPlan(PLAN_NAMES.enterprise)
//       ),
//     },
//   },
//   {
//     name: "Events",
//     all: "Unlimited",
//   },
//   {
//     name: "Seats",
//     all: "Unlimited",
//   },
//   {
//     name: "Concurrent functions",
//     plans: {
//       [PLAN_NAMES.free]: getPlanFeatureQuantity(
//         PLAN_NAMES.free,
//         "Concurrent functions"
//       ),
//       [PLAN_NAMES.team]: getPlanFeatureQuantity(
//         PLAN_NAMES.team,
//         "Concurrent functions"
//       ),
//       [PLAN_NAMES.startup]: getPlanFeatureQuantity(
//         PLAN_NAMES.startup,
//         "Concurrent functions"
//       ),
//       [PLAN_NAMES.enterprise]: getPlanFeatureQuantity(
//         PLAN_NAMES.enterprise,
//         "Concurrent functions"
//       ),
//     },
//   },
//   {
//     name: "History (log retention)",
//     plans: {
//       [PLAN_NAMES.free]: getPlanFeatureQuantity(PLAN_NAMES.free, "History"),
//       [PLAN_NAMES.team]: getPlanFeatureQuantity(PLAN_NAMES.team, "History"),
//       [PLAN_NAMES.startup]: getPlanFeatureQuantity(
//         PLAN_NAMES.startup,
//         "History"
//       ),
//       [PLAN_NAMES.enterprise]: getPlanFeatureQuantity(
//         PLAN_NAMES.enterprise,
//         "History"
//       ),
//     },
//   },
//   {
//     name: "Features",
//     heading: true,
//   },
//   {
//     name: "Automatic retries",
//     all: true,
//     infoUrl: "/docs/reference/typescript/functions/errors?ref=pricing",
//   },
//   {
//     name: "Step functions",
//     all: true,
//     infoUrl: "/docs/learn/inngest-steps?ref=pricing",
//   },
//   {
//     name: "Scheduled functions",
//     all: true,
//     infoUrl: "/docs/guides/scheduled-functions?ref=pricing",
//   },
//   {
//     name: "Concurrency controls",
//     all: true,
//     infoUrl: "/docs/functions/concurrency?ref=pricing",
//   },
//   {
//     name: "Custom failure handlers",
//     all: true,
//     infoUrl: "/docs/reference/functions/handling-failures?ref=pricing",
//   },
//   {
//     name: "Parallel steps",
//     all: true,
//     infoUrl: "/docs/guides/step-parallelism?ref=pricing",
//   },
//   {
//     name: "Fan-out",
//     all: true,
//     infoUrl: "/docs/guides/fan-out-jobs?ref=pricing",
//   },
//   {
//     name: "Local dev server",
//     all: true,
//     infoUrl: "/docs/local-development?ref=pricing",
//   },
//   {
//     name: "Branch environments",
//     all: true,
//     infoUrl: "/docs/platform/environments?ref=pricing#branch-environments",
//   },
//   {
//     name: "Vercel integration",
//     all: true,
//     infoUrl: "/docs/deploy/vercel?ref=pricing",
//   },
//   {
//     name: "Data warehouse exports",
//     plans: {
//       [PLAN_NAMES.team]: false,
//       [PLAN_NAMES.startup]: false,
//       [PLAN_NAMES.enterprise]: "+ Add on",
//     },
//   },
//   {
//     name: "Integrations",
//     heading: true,
//   },
//   {
//     name: "Datadog",
//     plans: {
//       [PLAN_NAMES.team]: false,
//       [PLAN_NAMES.startup]: false,
//       [PLAN_NAMES.enterprise]: true,
//     },
//   },
//   {
//     name: "Salesforce",
//     plans: {
//       [PLAN_NAMES.team]: false,
//       [PLAN_NAMES.startup]: false,
//       [PLAN_NAMES.enterprise]: "+ Add on",
//     },
//   },
//   {
//     name: "Support",
//     heading: true,
//   },
//   {
//     name: "Discord support",
//     plans: {
//       [PLAN_NAMES.free]: true,
//       [PLAN_NAMES.team]: true,
//       [PLAN_NAMES.startup]: true,
//       [PLAN_NAMES.enterprise]: true,
//     },
//   },
//   {
//     name: "Email support",
//     plans: {
//       [PLAN_NAMES.team]: false,
//       [PLAN_NAMES.startup]: true,
//       [PLAN_NAMES.enterprise]: true,
//     },
//   },
//   {
//     name: "Dedicated Slack channel support",
//     plans: {
//       [PLAN_NAMES.team]: false,
//       [PLAN_NAMES.startup]: false,
//       [PLAN_NAMES.enterprise]: true,
//     },
//   },
//   {
//     name: "SLAs",
//     plans: {
//       [PLAN_NAMES.team]: false,
//       [PLAN_NAMES.startup]: false,
//       [PLAN_NAMES.enterprise]: true,
//     },
//   },
//   {
//     name: "Dedicated customer success",
//     plans: {
//       [PLAN_NAMES.team]: false,
//       [PLAN_NAMES.startup]: false,
//       [PLAN_NAMES.enterprise]: true,
//     },
//   },
//   {
//     name: "Solutions engineering",
//     plans: {
//       [PLAN_NAMES.team]: false,
//       [PLAN_NAMES.startup]: false,
//       [PLAN_NAMES.enterprise]: "+ Add on",
//     },
//   },
//   {
//     name: "Security & Privacy",
//     heading: true,
//   },
//   {
//     name: "HIPAA BAA",
//     plans: {
//       [PLAN_NAMES.team]: false,
//       [PLAN_NAMES.startup]: false,
//       [PLAN_NAMES.enterprise]: "Available",
//     },
//   },
//   {
//     name: "SOC2 report",
//     plans: {
//       [PLAN_NAMES.team]: false,
//       [PLAN_NAMES.startup]: false,
//       [PLAN_NAMES.enterprise]: true,
//     },
//   },
// ];

export async function getStaticProps() {
  return {
    props: {
      designVersion: "2",
      meta: {
        title: "Pricing",
        description: "Simple pricing. Powerful functionality.",
      },
    },
  };
}

export default function Pricing() {
  return (
    <div className="font-sans">
      <Header />
      <div
        style={{
          backgroundImage: "url(/assets/pricing/table-bg.png)",
          backgroundPosition: "center -30px",
          backgroundRepeat: "no-repeat",
          backgroundSize: "1800px 1200px",
        }}
      >
        <Container className="text-center">
          <h1 className="text-3xl lg:text-6xl text-basis mt-20 mb-16 font-black tracking-tight">
            Simple pricing that scales with you
          </h1>
          <p className="text-base lg:text-xl text-basis mb-24">
            From early-stage startups to scaling enterprises, Inngest has you
            covered. Get started for free today.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-y-8 lg:gap-4 text-center mb-8">
            {PLANS.filter((p) => p.hideFromCards !== true).map((p) => (
              <PlanCard key={p.name} content={p} />
            ))}
          </div>

          {/* <ComparisonTable plans={PLANS} features={FEATURES} /> */}
        </Container>
      </div>

      <Footer />
    </div>
  );
}
