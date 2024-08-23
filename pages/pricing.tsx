import Header from "src/shared/Header";
import Container from "src/shared/layout/Container";
import ComparisonTable from "src/shared/Pricing/ComparisonTable";
import PlanCard from "src/shared/Pricing/PlanCard";
import CaseStudies from "src/shared/Pricing/CaseStudies";
import Footer from "../shared/Footer";
import { Button } from "src/shared/Button";

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
  description?: string;
  section:
    | "platform"
    | "observability"
    | "data"
    | "connectivity"
    | "organization";
  all?: boolean | string; // All plans offer this
  plans?: {
    [key: string]: string | boolean;
  };
  infoUrl?: string;
};

export const sections = [
  { key: "platform", name: "Platform" },
  { key: "observability", name: "Observability" },
  { key: "data", name: "Time-based data management" },
  { key: "connectivity", name: "Connectivity" },
  { key: "organization", name: "Organization" },
];

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

const FEATURES: Feature[] = [
  {
    name: "Base price",
    plans: {
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
      [PLAN_NAMES.basic]: `${getPlan(
        PLAN_NAMES.basic
      ).cost.includedRuns.toLocaleString(undefined, {
        notation: "compact",
        compactDisplay: "short",
      })} /${getPlan(PLAN_NAMES.basic).cost.period} included`,
      [PLAN_NAMES.pro]: `${getPlan(
        PLAN_NAMES.pro
      ).cost.includedRuns.toLocaleString(undefined, {
        notation: "compact",
        compactDisplay: "short",
      })} /${getPlan(PLAN_NAMES.pro).cost.period} included`,
      [PLAN_NAMES.enterprise]: `${
        getPlan(PLAN_NAMES.enterprise).cost.includedRuns
      }`,
    },
    section: "platform",
  },
  {
    name: "Additional steps",
    description: "After the first 5 steps in every run",
    plans: {
      [PLAN_NAMES.basic]: `$${
        getPlan(PLAN_NAMES.basic).cost.additionalStepsPrice
      } per ${getPlan(PLAN_NAMES.basic).cost.additionalStepsRate.toLocaleString(
        undefined,
        {
          notation: "compact",
          compactDisplay: "short",
        }
      )}`,
      [PLAN_NAMES.pro]: `$${
        getPlan(PLAN_NAMES.pro).cost.additionalStepsPrice
      } per ${getPlan(PLAN_NAMES.pro).cost.additionalStepsRate.toLocaleString(
        undefined,
        {
          notation: "compact",
          compactDisplay: "short",
        }
      )}`,
      [PLAN_NAMES.enterprise]: `${
        getPlan(PLAN_NAMES.enterprise).cost.additionalStepsPrice
      }`,
    },
    infoUrl: "/docs/learn/inngest-steps?ref=pricing",
    section: "platform",
  },
  {
    name: "Concurrency",
    description: "Process steps in parallel whilesmoothing load",
    plans: {
      [PLAN_NAMES.basic]: `${
        getPlan(PLAN_NAMES.basic).cost.includedConcurrency
      }`,
      [PLAN_NAMES.pro]: `${getPlan(PLAN_NAMES.pro).cost.includedConcurrency}`,
      [PLAN_NAMES.enterprise]: `${
        getPlan(PLAN_NAMES.enterprise).cost.includedConcurrency
      }`,
    },
    section: "platform",
  },
  {
    name: "Additional concurrency (per 10)",
    description: "Customizable throughput for any scale",
    plans: {
      [PLAN_NAMES.basic]: `$${
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
      [PLAN_NAMES.basic]: "256KB",
      [PLAN_NAMES.pro]: "3MB",
      [PLAN_NAMES.enterprise]: "Custom",
    },
    section: "platform",
  },
  {
    name: "Backpressure(per account)",
    description: "Prevent spikes and runaway executions",
    plans: {
      [PLAN_NAMES.basic]: "1M",
      [PLAN_NAMES.pro]: "Starts at 10M",
      [PLAN_NAMES.enterprise]: "Custom",
    },
    section: "platform",
  },
  {
    name: "Metrics granularity",
    description: "Real-time function metrics",
    plans: {
      [PLAN_NAMES.basic]: "15 minutes",
      [PLAN_NAMES.pro]: "5 minutes",
      [PLAN_NAMES.enterprise]: "20 seconds",
    },
    section: "observability",
  },
  {
    name: "Trace and log history",
    description: "Tracing for every function run",
    plans: {
      [PLAN_NAMES.basic]: "7 days",
      [PLAN_NAMES.pro]: "14 days",
      [PLAN_NAMES.enterprise]: "90 days",
    },
    section: "observability",
  },
  {
    name: "Exportable and scrapable metrics",
    description: "Pushable and prom scrapable metrics",
    plans: {
      [PLAN_NAMES.basic]: false,
      [PLAN_NAMES.pro]: "$200/mo",
      [PLAN_NAMES.enterprise]: true,
    },
    section: "observability",
  },
  {
    name: "Trace and log exports",
    description: "Push traces and logs to other systems",
    plans: {
      [PLAN_NAMES.basic]: false,
      [PLAN_NAMES.pro]: "$2 per 1m steps",
      [PLAN_NAMES.enterprise]: "Contact us",
    },
    section: "observability",
  },
];

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
          <CaseStudies />

          <ComparisonTable
            plans={PLANS}
            features={FEATURES}
            sections={sections}
          />
        </Container>
      </div>

      <div className="text-center my-24">
        <p className="text-3xl font-bold mb-12">
          Need help deciding which plan to choose?
        </p>
        <Button href="/contact?ref=pricing-help" variant="dark">
          Let's talk
        </Button>
      </div>

      <Footer disableCta />
    </div>
  );
}
