"use client";
import { useState, useMemo, useEffect } from "react";
import { RiArrowDownSLine } from "@remixicon/react";

import classNames from "src/utils/classNames";
import { type Plan, PLAN_NAMES, getPlan } from "./plans";

import { Slider } from "components/RedesignedPricing/Slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/RedesignedPricing/Select";
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
}: {
  planName: typeof PLAN_NAMES[keyof typeof PLAN_NAMES];
  runs: number;
  steps: number;
  concurrency: number;
}): EstimatedCosts {
  const plan = getPlan(planName);
  const additionalRuns = Math.max(runs - num(plan.cost.includedRuns), 0);
  const includedSteps = runs * num(plan.cost.includedSteps);
  const additionalSteps = Math.max(steps - includedSteps, 0);
  const additionalConcurrency = Math.max(
    concurrency - num(plan.cost.includedConcurrency),
    0
  );

  const baseCost = num(plan.cost.basePrice);
  const additionalRunsCost =
    Math.ceil(additionalRuns / num(plan.cost.additionalRunsRate)) *
    num(plan.cost.additionalRunsPrice);
  const additionalStepsCost =
    Math.ceil(additionalSteps / num(plan.cost.additionalStepsRate)) *
    num(plan.cost.additionalStepsPrice);
  // If there is additional concurrency, but there is no available rate,
  // the cost is NaN (which means it isn't possible)
  const concurrencyCost =
    additionalConcurrency === 0
      ? 0
      : additionalConcurrency >= 0 && plan.cost.additionalConcurrencyRate
      ? Math.ceil(
          additionalConcurrency / num(plan.cost.additionalConcurrencyRate)
        ) * num(plan.cost.additionalConcurrencyPrice)
      : NaN;

  const totalCost =
    baseCost + additionalRunsCost + additionalStepsCost + concurrencyCost;
  return {
    baseCost,
    totalCost,
    additionalRunsCost,
    additionalStepsCost,
    concurrencyCost,
  };
}

function calculatePlanCosts({
  runs,
  steps,
  concurrency,
}: {
  runs: number;
  steps: number;
  concurrency: number;
}) {
  return {
    [PLAN_NAMES.pro]: {
      cost: calculatePlanCost({
        planName: PLAN_NAMES.pro,
        runs,
        steps,
        concurrency,
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

export function PricingCalculatorPage() {
  const [runs, setRuns] = useState(50000);
  const [steps, setSteps] = useState(20);
  const [users, setUsers] = useState<string | undefined>();
  const [concurrency, setConcurrency] = useState<string | undefined>();
  const [workers, setWorkers] = useState<string | undefined>();

  // Controls dropdown visibility
  const [isOpen, setOpen] = useState<boolean>(false);

  const runsMin = 0,
    runsMax = 1_000_000;
  const stepsMin = 0,
    stepsMax = 100;

  const calculateThumbPosition = (value: number, min: number, max: number) => {
    if (max === min) return "0%"; // Avoid division by zero
    const percentage = ((value - min) / (max - min)) * 100;
    return `${Math.max(0, Math.min(100, percentage))}%`; // Clamp between 0% and 100%
  };

  const selectOptions = [
    {
      label: "Number of users",
      value: users,
      setter: setUsers,
      options: ["1-10 users", "11-50 users", "51-200 users", "200+ users"],
      placeholder: "Select users",
    },
    {
      label: "Run concurrency",
      value: concurrency,
      setter: setConcurrency,
      options: [
        "1 concurrent run",
        "2-5 concurrent runs",
        "6-10 concurrent runs",
        "10+ concurrent runs",
      ],
      placeholder: "Select concurrency",
    },
    {
      label: "Number of workers",
      value: workers,
      setter: setWorkers,
      options: ["1 worker", "2-4 workers", "5-8 workers", "8+ workers"],
      placeholder: "Select workers",
    },
  ];

  // Calculate results using plan data
  const results: CalculatorResults = useMemo(() => {
    // Total runs selected with the slider
    const runsCount = runs;

    // The slider represents average steps per run, so calculate total estimated steps
    const estimatedSteps = runsCount * steps;

    // Parse a numeric concurrency value out of the select value (eg. "2-5-concurrent-runs" -> 2)
    const concurrencyNumber = concurrency
      ? parseInt(concurrency.match(/\d+/)?.[0] || "0", 10)
      : 0;

    // If the usage fits entirely within the free plan limits, recommend the Free plan
    if (
      runsCount <= num(FREE_PLAN.cost.includedRuns) &&
      estimatedSteps <= runsCount * num(FREE_PLAN.cost.includedSteps) &&
      concurrencyNumber <= num(FREE_PLAN.cost.includedConcurrency)
    ) {
      return {
        cost: {
          baseCost: 0,
          totalCost: 0,
          additionalRunsCost: 0,
          additionalStepsCost: 0,
          concurrencyCost: 0,
        },
        includedSteps: runsCount * num(FREE_PLAN.cost.includedSteps),
        estimatedSteps,
        plan: PLAN_NAMES.basicFree,
      };
    }

    // Otherwise, estimate the Pro plan cost (Enterprise is custom pricing)
    const estimates = calculatePlanCosts({
      runs: runsCount,
      steps: estimatedSteps,
      concurrency: concurrencyNumber,
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
      },
      includedSteps: runsCount * num(PRO_PLAN.cost.includedSteps),
      estimatedSteps,
      plan: recommendedPlan,
    };
  }, [runs, steps, concurrency]);

  // Update CSS custom properties so we can position slider tooltips using Tailwind arbitrary values
  useEffect(() => {
    // Runs slider thumb position
    document.documentElement.style.setProperty(
      "--runs-thumb-position",
      calculateThumbPosition(runs, runsMin, runsMax)
    );

    // Steps slider thumb position
    document.documentElement.style.setProperty(
      "--steps-thumb-position",
      calculateThumbPosition(steps, stepsMin, stepsMax)
    );
  }, [runs, steps]);

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
      {/* Dropdown Content */}
      <div className={classNames(isOpen ? "block" : "hidden")}>
        <div className="z-10 flex max-w-[#1222px] items-center justify-center  p-4 text-neutral-100 sm:p-8 lg:p-12">
          <div className="w-full max-w-[1222px] shadow-2xl">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr] lg:gap-0">
              {/* Left Column: Controls */}
              <div className="space-y-8 bg-stone-900 p-8">
                <h1 className="font-whyte text-2xl font-medium leading-[1.2] tracking-[-1.2px] text-[#FAFAF9]">
                  Which plan is right for me?
                </h1>

                {/* Number of Runs Slider */}
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

                {/* Average Number of Steps Slider */}
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

                {/* Selects Grid */}
                <div className="grid grid-cols-1 gap-x-4 gap-y-6 pt-4 sm:grid-cols-3">
                  {selectOptions.map((selectProps) => (
                    <div key={selectProps.label} className="space-y-1.5">
                      <label
                        htmlFor={selectProps.label
                          .toLowerCase()
                          .replace(/\s+/g, "-")}
                        className="flex items-center text-xs font-medium text-neutral-400"
                      >
                        {selectProps.label}
                        <InformationCircleIcon
                          className="ml-1 h-4 w-4 cursor-pointer text-neutral-500"
                          aria-label={`More information about ${selectProps.label}`}
                        />
                      </label>
                      <Select
                        value={selectProps.value}
                        onValueChange={selectProps.setter}
                      >
                        <SelectTrigger
                          id={selectProps.label
                            .toLowerCase()
                            .replace(/\s+/g, "-")}
                          className="h-10 w-full border-[#4A4A4A] bg-[#383838] text-sm text-neutral-100 focus:ring-1 focus:ring-[#C2A46A] focus:ring-offset-0"
                          aria-label={selectProps.label}
                        >
                          <SelectValue
                            placeholder={
                              selectProps.placeholder || "Select one"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent className="border-[#4A4A4A] bg-[#383838] text-neutral-100">
                          {selectProps.options.map((option) => (
                            <SelectItem
                              key={option}
                              value={option.toLowerCase().replace(/\s+/g, "-")}
                              className="text-sm focus:bg-[#4A4A4A] focus:text-neutral-100"
                            >
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Dynamic Plan Details */}
              {(() => {
                const plan = getPlan(results.plan);
                const priceDisplay =
                  results.cost.totalCost === Infinity
                    ? typeof plan.cost.basePrice === "number"
                      ? `$${plan.cost.basePrice}`
                      : plan.cost.basePrice
                    : `$${results.cost.totalCost.toLocaleString()}`;

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
                        {priceDisplay}
                      </span>
                      {results.cost.totalCost !== Infinity && (
                        <span className="text-xl text-neutral-400">
                          {" "}
                          /month
                        </span>
                      )}
                    </div>
                    <Button className="mt-auto h-11 w-full bg-[#C2A46A] py-3 text-base font-semibold text-[#212121] hover:bg-[#b3955d]">
                      {plan.cta.text}
                    </Button>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
