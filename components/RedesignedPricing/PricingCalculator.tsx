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
  additionalRunsCost: number;
  additionalStepsCost: number;
  concurrencyCost: number;
  additionalUsersCost: number;
  additionalWorkersCost: number;
};
type CalculatorResults = {
  cost: EstimatedCosts;
  includedSteps: number;
  estimatedSteps: number;
  plan: string;
};

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
  const additionalRuns = Math.max(runs - num(plan.cost.includedRuns), 0);
  const includedSteps = runs * num(plan.cost.includedSteps);
  const additionalSteps = Math.max(steps - includedSteps, 0);
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

  const baseCost = num(plan.cost.basePrice);
  const additionalRunsCost =
    Math.ceil(additionalRuns / num(plan.cost.additionalRunsRate)) *
    num(plan.cost.additionalRunsPrice);
  const additionalStepsCost =
    Math.ceil(additionalSteps / num(plan.cost.additionalStepsRate)) *
    num(plan.cost.additionalStepsPrice);

  const concurrencyCost =
    additionalConcurrency === 0
      ? 0
      : additionalConcurrency >= 0 && plan.cost.additionalConcurrencyRate
      ? Math.ceil(
          additionalConcurrency / num(plan.cost.additionalConcurrencyRate)
        ) * num(plan.cost.additionalConcurrencyPrice)
      : NaN;

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
    additionalRunsCost +
    additionalStepsCost +
    concurrencyCost +
    additionalUsersCost +
    additionalWorkersCost;
  return {
    baseCost,
    totalCost,
    additionalRunsCost,
    additionalStepsCost,
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
        {price !== "$Infinity" && (
          <span className="text-xl text-neutral-400"> /month</span>
        )}
      </div>
      <Button className="mt-auto h-11 w-full bg-[#C2A46A] py-3 text-base font-semibold text-[#212121] hover:bg-[#b3955d]">
        {plan.cta.text}
      </Button>
    </div>
  );
}

export function PricingCalculatorPage() {
  const [runs, setRuns] = useState(50000);
  const [steps, setSteps] = useState(20);
  const [users, setUsers] = useState<number>(3);
  const [concurrency, setConcurrency] = useState<number>(25);
  const [workers, setWorkers] = useState<number>(3);

  const [isOpen, setOpen] = useState<boolean>(false);

  const runsMin = 0,
    runsMax = 1_000_000;
  const stepsMin = 0,
    stepsMax = 100;

  const results: CalculatorResults = useMemo(() => {
    const runsCount = runs;

    const estimatedSteps = runsCount * steps;

    const concurrencyNumber = concurrency;
    const usersNumber = users;
    const workersNumber = workers;

    // If the usage fits entirely within the free plan limits (runs, steps, concurrency, users, workers), recommend the Free plan
    if (
      runsCount <= num(FREE_PLAN.cost.includedRuns) &&
      estimatedSteps <= runsCount * num(FREE_PLAN.cost.includedSteps) &&
      concurrencyNumber <= num(FREE_PLAN.cost.includedConcurrency) &&
      usersNumber <= num(FREE_PLAN.cost.includedUsers) &&
      workersNumber <= num(FREE_PLAN.cost.includedWorkers ?? 0)
    ) {
      return {
        cost: {
          baseCost: 0,
          totalCost: 0,
          additionalRunsCost: 0,
          additionalStepsCost: 0,
          concurrencyCost: 0,
          additionalUsersCost: 0,
          additionalWorkersCost: 0,
        },
        includedSteps: runsCount * num(FREE_PLAN.cost.includedSteps),
        estimatedSteps,
        plan: PLAN_NAMES.basicFree,
      };
    }

    const estimates = calculatePlanCosts({
      runs: runsCount,
      steps: estimatedSteps,
      concurrency: concurrencyNumber,
      users: usersNumber,
      workers: workersNumber,
    });

    const recommendedPlan =
      estimates[PLAN_NAMES.pro].cost.totalCost < 2_000
        ? PLAN_NAMES.pro
        : PLAN_NAMES.enterprise;

    return {
      cost: estimates[recommendedPlan]?.cost ?? {
        baseCost: Infinity,
        totalCost: Infinity,
        additionalRunsCost: Infinity,
        additionalStepsCost: Infinity,
        concurrencyCost: Infinity,
        additionalUsersCost: Infinity,
        additionalWorkersCost: Infinity,
      },
      includedSteps: runsCount * num(PRO_PLAN.cost.includedSteps),
      estimatedSteps,
      plan: recommendedPlan,
    };
  }, [runs, steps, concurrency, users, workers]);

  const plan = getPlan(results.plan);
  const priceDisplay =
    results.cost.totalCost === Infinity
      ? typeof plan.cost.basePrice === "number"
        ? `$${plan.cost.basePrice}`
        : plan.cost.basePrice
      : `$${results.cost.totalCost.toLocaleString()}`;

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
