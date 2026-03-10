"use client";
import { useState, useMemo } from "react";
import { RiArrowDownSLine } from "@remixicon/react";

import classNames from "src/utils/classNames";
import { type Plan, PLAN_NAMES, getPlan } from "./plans";

import { Slider } from "components/RedesignedPricing/Slider";
import { Input } from "components/RedesignedPricing/Input";
import { Button } from "components/RedesignedLanding/Button";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

const FREE_PLAN = getPlan(PLAN_NAMES.basicFree);
const PRO_PLAN = getPlan(PLAN_NAMES.pro);

type EstimatedCosts = {
  baseCost: number;
  totalCost: number;
  executionsCost: number;
  concurrencyCost: number;
  additionalUsersCost: number;
  additionalWorkersCost: number;
};

type CalculatorResults = {
  cost: EstimatedCosts;
  totalExecutions: number;
  includedExecutions: number;
  plan: string;
};

// Tiered execution pricing rates (per execution)
const EXECUTION_TIERS = {
  pro: [
    { min: 1_000_000, max: 5_000_000, rate: 0.00005 },
    { min: 5_000_000, max: 15_000_000, rate: 0.000025 },
    { min: 15_000_000, max: 50_000_000, rate: 0.00002 },
    { min: 50_000_000, max: 100_000_000, rate: 0.000015 },
  ],
  enterprise: [
    { min: 10_000_000, max: 15_000_000, rate: 0.0000575 }, // 15% markup over pay-as-you-go
    { min: 15_000_000, max: 50_000_000, rate: 0.0000287 },
    { min: 50_000_000, max: 100_000_000, rate: 0.000023 },
    { min: 100_000_000, max: Infinity, rate: 0.000017 },
  ],
};

function calculateExecutionsCost(
  totalExecutions: number,
  includedExecutions: number,
  planType: "pro" | "enterprise"
): number {
  const excessExecutions = Math.max(totalExecutions - includedExecutions, 0);
  if (excessExecutions === 0) return 0;

  const tiers = EXECUTION_TIERS[planType];
  let cost = 0;
  let remaining = excessExecutions;
  let processed = includedExecutions;

  for (const tier of tiers) {
    if (remaining <= 0) break;

    const tierStart = Math.max(tier.min, processed);
    const tierEnd = Math.min(tier.max, processed + remaining);
    const tierExecutions = Math.max(tierEnd - tierStart, 0);

    if (tierExecutions > 0) {
      cost += tierExecutions * tier.rate;
      remaining -= tierExecutions;
      processed += tierExecutions;
    }
  }

  return cost;
}

function calculatePlanCost({
  planName,
  runs,
  steps,
  concurrency,
  users,
  workers,
}: {
  planName: typeof PLAN_NAMES[keyof typeof PLAN_NAMES];
  runs: number;
  steps: number;
  concurrency: number;
  users: number;
  workers: number;
}): EstimatedCosts {
  const plan = getPlan(planName);
  const totalExecutions = runs * steps + runs;

  let baseCost = 0;
  let executionsCost = 0;
  let includedExecutions = 0;

  // Calculate base costs and execution costs based on plan
  if (planName === PLAN_NAMES.basicFree) {
    baseCost = 0;
    includedExecutions = 100_000;
    // Free plan excess goes to pro pricing
    executionsCost = calculateExecutionsCost(
      totalExecutions,
      includedExecutions,
      "pro"
    );
  } else if (planName === PLAN_NAMES.pro) {
    baseCost = 75;
    includedExecutions = 1_000_000;
    executionsCost = calculateExecutionsCost(
      totalExecutions,
      includedExecutions,
      "pro"
    );
  } else if (planName === PLAN_NAMES.enterprise) {
    // Enterprise pricing is more complex, using simplified model for calculator
    baseCost = totalExecutions <= 10_000_000 ? 1000 : 2500;
    includedExecutions = 10_000_000;
    executionsCost = calculateExecutionsCost(
      totalExecutions,
      includedExecutions,
      "enterprise"
    );
  }

  // Calculate additional costs for other resources
  const additionalConcurrency = Math.max(
    concurrency - num(plan.cost.includedConcurrency),
    0
  );

  const additionalUsers =
    plan.cost.includedUsers !== undefined
      ? Math.max(users - num(plan.cost.includedUsers), 0)
      : 0;

  const additionalWorkers =
    plan.cost.includedWorkers !== undefined
      ? Math.max(workers - num(plan.cost.includedWorkers), 0)
      : 0;

  const concurrencyCost =
    additionalConcurrency === 0
      ? 0
      : additionalConcurrency >= 0 && plan.cost.additionalConcurrencyRate
      ? Math.ceil(
          additionalConcurrency / num(plan.cost.additionalConcurrencyRate)
        ) * num(plan.cost.additionalConcurrencyPrice)
      : 0;

  const additionalUsersCost =
    additionalUsers === 0 || !plan.cost.additionalUsersRate
      ? 0
      : Math.ceil(additionalUsers / num(plan.cost.additionalUsersRate)) *
        num(plan.cost.additionalUsersPrice ?? 0);

  const additionalWorkersCost =
    additionalWorkers === 0 || !plan.cost.additionalWorkersRate
      ? 0
      : Math.ceil(additionalWorkers / num(plan.cost.additionalWorkersRate)) *
        num(plan.cost.additionalWorkersPrice ?? 0);

  const totalCost =
    baseCost +
    executionsCost +
    concurrencyCost +
    additionalUsersCost +
    additionalWorkersCost;

  return {
    baseCost,
    totalCost,
    executionsCost,
    concurrencyCost,
    additionalUsersCost,
    additionalWorkersCost,
  };
}

function calculatePlanCosts({
  runs,
  steps,
  concurrency,
  users,
  workers,
}: {
  runs: number;
  steps: number;
  concurrency: number;
  users: number;
  workers: number;
}) {
  return {
    [PLAN_NAMES.basicFree]: {
      cost: calculatePlanCost({
        planName: PLAN_NAMES.basicFree,
        runs,
        steps,
        concurrency,
        users,
        workers,
      }),
    },
    [PLAN_NAMES.pro]: {
      cost: calculatePlanCost({
        planName: PLAN_NAMES.pro,
        runs,
        steps,
        concurrency,
        users,
        workers,
      }),
    },
    [PLAN_NAMES.enterprise]: {
      cost: calculatePlanCost({
        planName: PLAN_NAMES.enterprise,
        runs,
        steps,
        concurrency,
        users,
        workers,
      }),
    },
  };
}

function num(v: string | number): number {
  if (typeof v === "string") {
    const parsed = parseInt(v.replace(/,/g, ""), 10);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return v;
}

function PlanSummary({ plan, price }: { plan: Plan; price: string }) {
  return (
    <div className="flex flex-col items-start justify-center  bg-stone-800 p-6 sm:p-8">
      <h2 className="font-whyteInktrap text-[40px] font-medium leading-[1] tracking-[-2px] text-[#EEECE6]">
        {plan.name}
      </h2>
      {plan.description && (
        <p className="mb-6 mt-3 font-circular text-sm font-normal leading-5 text-[#EEECE6]">
          {plan.description as any}
        </p>
      )}
      <div className="my-4">
        <span className="text-6xl font-extrabold text-neutral-100">
          {price}
        </span>
        {price !== "$Infinity" && price !== "Contact us" && (
          <span className="text-xl text-neutral-400"> /month</span>
        )}
      </div>
      <Button
        className="mt-auto h-11 w-full bg-[#C2A46A] py-3 text-base font-semibold text-[#212121] hover:bg-[#b3955d]"
        asChild
      >
        <a
          href={
            price !== "Contact us"
              ? `${process.env.NEXT_PUBLIC_SIGNIN_URL}?ref=pricing-calculator`
              : "/contact?ref=pricing-calculator"
          }
        >
          {plan.cta.text}
        </a>
      </Button>
    </div>
  );
}

export function PricingCalculatorPage() {
  const [runs, setRuns] = useState(30000);
  const [steps, setSteps] = useState(2);
  const [users, setUsers] = useState<number>(3);
  const [concurrency, setConcurrency] = useState<number>(25);
  const [workers, setWorkers] = useState<number>(3);

  const [isOpen, setOpen] = useState<boolean>(false);

  const runsMin = 0,
    runsMax = 1_000_000;
  const stepsMin = 1,
    stepsMax = 100;

  const results: CalculatorResults = useMemo(() => {
    const runsCount = runs;
    const totalExecutions = runsCount * steps + runsCount;

    const concurrencyNumber = concurrency;
    const usersNumber = users;
    const workersNumber = workers;

    // Calculate costs for all plans
    const estimates = calculatePlanCosts({
      runs: runsCount,
      steps,
      concurrency: concurrencyNumber,
      users: usersNumber,
      workers: workersNumber,
    });

    // Determine the best plan based on total executions and cost
    let recommendedPlan = PLAN_NAMES.basicFree;
    let bestCost = estimates[PLAN_NAMES.basicFree].cost;

    // If usage exceeds free plan limits, recommend Pro
    if (
      totalExecutions > 100_000 ||
      concurrencyNumber > num(FREE_PLAN.cost.includedConcurrency) ||
      usersNumber > num(FREE_PLAN.cost.includedUsers) ||
      workersNumber > num(FREE_PLAN.cost.includedWorkers ?? 0)
    ) {
      // Recommend Pro plan
      recommendedPlan = PLAN_NAMES.pro;
      bestCost = estimates[PLAN_NAMES.pro].cost;

      // If cost is very high, recommend enterprise
      if (bestCost.totalCost > 1500) {
        recommendedPlan = PLAN_NAMES.enterprise;
        bestCost = estimates[PLAN_NAMES.enterprise].cost;
      }
    }

    const includedExecutions =
      recommendedPlan === PLAN_NAMES.basicFree
        ? 100_000
        : recommendedPlan === PLAN_NAMES.pro
        ? 1_000_000
        : 10_000_000; // Enterprise

    return {
      cost: bestCost,
      totalExecutions,
      includedExecutions,
      plan: recommendedPlan,
    };
  }, [runs, steps, concurrency, users, workers]);

  const plan = getPlan(results.plan);
  const priceDisplay =
    results.plan === PLAN_NAMES.enterprise
      ? "Contact us"
      : results.cost.totalCost === Infinity
      ? typeof plan.cost.basePrice === "number"
        ? `$${plan.cost.basePrice}`
        : plan.cost.basePrice
      : `$${Math.round(results.cost.totalCost).toLocaleString()}`;

  return (
    <div
      id="calculator"
      className="z-60 relative mx-auto h-full max-w-[1222px] text-basis"
    >
      <div className="flex justify-center">
        <Button
          variant="outline"
          className="mx-auto max-w-6xl"
          onClick={() => setOpen(!isOpen)}
        >
          Pricing calculator{" "}
          <RiArrowDownSLine
            className={`h-4 w-4 transition-all ${isOpen ? "rotate-180" : ""}`}
          />
        </Button>
      </div>
      <div className={classNames(isOpen ? "block" : "hidden")}>
        <div className="z-10 flex max-w-[#1222px] items-center justify-center  p-4 text-neutral-100 sm:p-8 lg:p-12">
          <div className="w-full max-w-[1222px] shadow-2xl">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr] lg:gap-0">
              <div className="space-y-8 bg-stone-900 p-8">
                <h1 className="font-whyte text-2xl font-medium leading-[1.2] tracking-[-1.2px] text-[#FAFAF9]">
                  Which plan is right for me?
                </h1>

                <div className="space-y-1">
                  <div className="flex items-center justify-between pb-2">
                    <label
                      htmlFor="runs-slider"
                      className="flex items-center text-sm font-medium text-neutral-300"
                    >
                      Number of runs
                      <InformationCircleIcon
                        className="ml-1.5 h-4 w-4 cursor-pointer text-neutral-400"
                        aria-label="More information about number of runs"
                      />
                    </label>
                    <span className="font-bold text-stone-50">
                      {runs.toLocaleString()}
                    </span>
                  </div>
                  <div className="relative">
                    <Slider
                      id="runs-slider"
                      value={[runs]}
                      onValueChange={(newVal) => setRuns(newVal[0])}
                      min={runsMin}
                      max={runsMax}
                      step={1000}
                      aria-label="Number of runs slider"
                      className="[&>span:first-child>span:first-child]:bg-[#C2A46A] [&>span:first-child]:h-1.5 [&>span:first-child]:bg-neutral-500 [&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:border-2 [&_[role=slider]]:border-[#C2A46A] [&_[role=slider]]:bg-white [&_[role=slider]]:shadow-none [&_[role=slider]]:focus-visible:ring-1 [&_[role=slider]]:focus-visible:ring-[#C2A46A] [&_[role=slider]]:focus-visible:ring-offset-2 [&_[role=slider]]:focus-visible:ring-offset-[#2B2B2B]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between pb-2">
                    <label
                      htmlFor="steps-slider"
                      className="flex items-center text-sm font-medium text-neutral-300"
                    >
                      Average number of steps per run
                      <InformationCircleIcon
                        className="ml-1.5 h-4 w-4 cursor-pointer text-neutral-400"
                        aria-label="More information about average number of steps per run"
                      />
                    </label>
                    <span className="font-bold text-stone-50">
                      {steps.toLocaleString()}
                    </span>
                  </div>
                  <div className="relative">
                    <Slider
                      id="steps-slider"
                      value={[steps]}
                      onValueChange={(newVal) => setSteps(newVal[0])}
                      min={stepsMin}
                      max={stepsMax}
                      step={1}
                      aria-label="Average number of steps per run slider"
                      className="[&>span:first-child>span:first-child]:bg-[#C2A46A] [&>span:first-child]:h-1.5 [&>span:first-child]:bg-neutral-500 [&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:border-2 [&_[role=slider]]:border-[#C2A46A] [&_[role=slider]]:bg-white [&_[role=slider]]:shadow-none [&_[role=slider]]:focus-visible:ring-1 [&_[role=slider]]:focus-visible:ring-[#C2A46A] [&_[role=slider]]:focus-visible:ring-offset-2 [&_[role=slider]]:focus-visible:ring-offset-[#2B2B2B]"
                    />
                  </div>
                </div>

                <div className="rounded-lg bg-stone-800 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-neutral-300">
                      Total executions per month
                    </span>
                    <span className="text-lg font-bold text-[#C2A46A]">
                      {results.totalExecutions.toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-neutral-400">
                    ({runs.toLocaleString()} runs × {steps.toLocaleString()}{" "}
                    steps per run) + {runs.toLocaleString()} runs ={" "}
                    {results.totalExecutions.toLocaleString()} executions
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-x-4 gap-y-6 pt-4 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="users-input"
                      className="flex items-center text-xs font-medium text-neutral-400"
                    >
                      Number of users
                      <InformationCircleIcon
                        className="ml-1 h-4 w-4 cursor-pointer text-neutral-500"
                        aria-label="More information about number of users"
                      />
                    </label>
                    <Input
                      id="users-input"
                      type="number"
                      min={0}
                      value={users}
                      onChange={(e) =>
                        setUsers(parseInt(e.target.value || "0", 10))
                      }
                      className="h-10 w-full border-[#4A4A4A] bg-[#383838] text-sm text-neutral-100 focus:ring-1 focus:ring-[#C2A46A] focus:ring-offset-0"
                      aria-label="Number of users"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="concurrency-input"
                      className="flex items-center text-xs font-medium text-neutral-400"
                    >
                      Step concurrency
                      <InformationCircleIcon
                        className="ml-1 h-4 w-4 cursor-pointer text-neutral-500"
                        aria-label="More information about step concurrency"
                      />
                    </label>
                    <Input
                      id="concurrency-input"
                      type="number"
                      min={0}
                      value={concurrency}
                      onChange={(e) =>
                        setConcurrency(parseInt(e.target.value || "0", 10))
                      }
                      className="h-10 w-full border-[#4A4A4A] bg-[#383838] text-sm text-neutral-100 focus:ring-1 focus:ring-[#C2A46A] focus:ring-offset-0"
                      aria-label="Step concurrency"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="workers-input"
                      className="flex items-center text-xs font-medium text-neutral-400"
                    >
                      Number of workers
                      <InformationCircleIcon
                        className="ml-1 h-4 w-4 cursor-pointer text-neutral-500"
                        aria-label="More information about number of workers"
                      />
                    </label>
                    <Input
                      id="workers-input"
                      type="number"
                      min={0}
                      value={workers}
                      onChange={(e) =>
                        setWorkers(parseInt(e.target.value || "0", 10))
                      }
                      className="h-10 w-full border-[#4A4A4A] bg-[#383838] text-sm text-neutral-100 focus:ring-1 focus:ring-[#C2A46A] focus:ring-offset-0"
                      aria-label="Number of workers"
                    />
                  </div>
                </div>
              </div>

              <PlanSummary plan={plan} price={priceDisplay} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
