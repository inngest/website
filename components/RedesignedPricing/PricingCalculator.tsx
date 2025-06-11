"use client";
import { useState, useMemo } from "react";
import { RiArrowDownSLine } from "@remixicon/react";

import classNames from "src/utils/classNames";
import { type Plan, PLAN_NAMES, getPlan } from "./plans";

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
  const includedSteps = runs * 5;
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

export default function PricingCalculator({ plans }: { plans: Plan[] }) {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [runsInput, setRunsInput] = useState<string>("150,000");
  const [concurrencyInput, setConcurrencyInput] = useState<string>("25");
  const [avgStepsInput, setAvgStepsInput] = useState<string>("5");

  const results: CalculatorResults = useMemo(
    function () {
      const runs = num(runsInput);
      const steps = num(avgStepsInput) * runs;
      const concurrency = num(concurrencyInput);

      if (
        runs <= num(FREE_PLAN.cost.includedRuns) &&
        steps <=
          num(FREE_PLAN.cost.includedRuns) *
            num(FREE_PLAN.cost.includedSteps) &&
        concurrency <= num(FREE_PLAN.cost.includedConcurrency)
      ) {
        return {
          cost: {
            baseCost: 0,
            totalCost: 0,
            additionalRunsCost: 0,
            additionalStepsCost: 0,
            concurrencyCost: 0,
          },
          includedSteps: num(FREE_PLAN.cost.includedSteps),
          estimatedSteps: steps,
          plan: FREE_PLAN.name,
        };
      }
      const estimates = calculatePlanCosts({
        runs,
        steps,
        concurrency,
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
        includedSteps: runs * 5,
        estimatedSteps: steps,
        plan: recommendedPlan,
      };
    },
    [runsInput, avgStepsInput, concurrencyInput]
  );

  return (
    <div
      id="calculator"
      className="z-10 mx-auto h-full max-w-[1222px]  border border-muted px-4 py-12 text-basis"
    >
      <div
        className="flex cursor-pointer items-center justify-center gap-4 px-6 py-4"
        onClick={() => setOpen(!isOpen)}
      >
        <h2 className="text-lg">Pricing calculator</h2>
        <RiArrowDownSLine
          className={`h-4 w-4 transition-all ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      <div
        className={classNames(
          "w-full px-6 py-8 text-left",
          "border-t border-muted",
          isOpen ? "block" : "hidden"
        )}
      >
        <div className="grid max-w-6xl grid-cols-2 gap-8 md:grid-cols-3">
          <div className="col-span-2 grid grid-cols-2 grid-rows-5 gap-y-2">
            <div>
              <label htmlFor="runs">Function runs</label>
            </div>
            <div>
              <Input
                type="text"
                value={runsInput}
                onChange={(e) => setRunsInput(e.target.value)}
                name="runs"
              />
            </div>
            <div>Included steps (runs x 5)</div>
            <div>
              <Calculated>{results.includedSteps.toLocaleString()}</Calculated>
            </div>
            <div>
              <label htmlFor="steps">Average steps per function</label>
            </div>
            <div>
              <Input
                type="text"
                value={avgStepsInput}
                onChange={(e) => setAvgStepsInput(e.target.value)}
                name="steps"
              />
            </div>
            <div>Estimated step usage</div>
            <div>
              <Calculated>{results.estimatedSteps.toLocaleString()}</Calculated>
            </div>
            <div>
              <label htmlFor="concurrency">Maximum concurrent steps</label>
            </div>
            <div>
              <Input
                type="text"
                value={concurrencyInput}
                onChange={(e) => setConcurrencyInput(e.target.value)}
                name="concurrency"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-lg">
              Recommended plan: <strong>{results.plan}</strong>
            </p>
            <p>
              Estimated cost:{" "}
              <strong>
                {results.cost.totalCost === Infinity
                  ? "Custom"
                  : `$${results.cost.totalCost}/mo.`}
              </strong>
            </p>
            {results.cost.totalCost !== Infinity && (
              <Calculations cost={results.cost} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Input(props) {
  return (
    <input
      className="border border-muted bg-canvasSubtle px-2 py-1 focus:outline-none"
      {...props}
    />
  );
}
function Calculated({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row items-center gap-2 px-2 py-1">
      {children}
      <span className="mt-px text-xs text-muted">CALCULATED</span>
    </div>
  );
}

function Calculations({ cost }: { cost: EstimatedCosts }) {
  return (
    <div className="mt-4 grid grid-cols-2 text-muted">
      <CalculationsRow label="Base" value={cost.baseCost} />
      {cost.additionalRunsCost > 0 && (
        <CalculationsRow
          label="Additional Runs"
          value={cost.additionalRunsCost}
        />
      )}
      {cost.additionalStepsCost > 0 && (
        <CalculationsRow
          label="Additional Steps"
          value={cost.additionalStepsCost}
        />
      )}
      {cost.concurrencyCost > 0 && (
        <CalculationsRow
          label="Additional Concurrency"
          value={cost.concurrencyCost}
        />
      )}
      <CalculationsRow label="Total" value={cost.totalCost} isTotal={true} />
    </div>
  );
}
function CalculationsRow({ label, value, isTotal = false }) {
  return (
    <>
      <div className={isTotal ? "border-t border-muted" : ""}>{label}</div>
      <div className={`text-right ${isTotal ? "border-t border-muted" : ""}`}>
        ${value}
      </div>
    </>
  );
}

function num(v: string | number): number {
  if (typeof v === "string") {
    const parsed = parseInt(v.replace(/,/g, ""), 10);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return v;
}

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

export function PricingCalculatorPage() {
  const [runs, setRuns] = useState(50000);
  const [steps, setSteps] = useState(20);
  const [users, setUsers] = useState<string | undefined>();
  const [concurrency, setConcurrency] = useState<string | undefined>();
  const [workers, setWorkers] = useState<string | undefined>();

  const runsMin = 0,
    runsMax = 100000;
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

  return (
    <div className="z-10 flex max-w-[#1222px] items-center justify-center  p-4 text-neutral-100 sm:p-8 lg:p-12">
      <div className="w-full max-w-[1222px] shadow-2xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr] lg:gap-0">
          {/* Left Column: Controls */}
          <div className="space-y-8 bg-stone-900 p-8">
            <h1 className="font-whyte text-2xl font-[350] leading-[1.2] tracking-[-1.2px] text-[#FAFAF9]">
              Which plan is right for me?
            </h1>

            {/* Number of Runs Slider */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
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
              </div>
              <div className="relative pt-8">
                {" "}
                {/* Increased padding-top to make space for the tooltip */}
                <div
                  className="pointer-events-none absolute z-10 -translate-x-1/2 transform  bg-white px-3 py-1.5 text-sm font-semibold text-neutral-900 shadow-lg"
                  style={{
                    left: calculateThumbPosition(runs, runsMin, runsMax),
                    top: "0px",
                  }}
                >
                  {runs.toLocaleString()}
                  <div className="absolute left-1/2 top-full mt-[-1px] h-0 w-0 -translate-x-1/2 border-x-[6px] border-t-[6px] border-x-transparent border-t-white" />
                </div>
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
              <div className="flex items-center justify-between">
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
              </div>
              <div className="relative pt-8">
                <div
                  className="pointer-events-none absolute z-10 -translate-x-1/2 transform  bg-white px-3 py-1.5 text-sm font-semibold text-neutral-900 shadow-lg"
                  style={{
                    left: calculateThumbPosition(steps, stepsMin, stepsMax),
                    top: "0px",
                  }}
                >
                  {steps.toLocaleString()}
                  <div className="absolute left-1/2 top-full mt-[-1px] h-0 w-0 -translate-x-1/2 border-x-[6px] border-t-[6px] border-x-transparent border-t-white" />
                </div>
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
                      id={selectProps.label.toLowerCase().replace(/\s+/g, "-")}
                      className="h-10 w-full border-[#4A4A4A] bg-[#383838] text-sm text-neutral-100 focus:ring-1 focus:ring-[#C2A46A] focus:ring-offset-0"
                      aria-label={selectProps.label}
                    >
                      <SelectValue
                        placeholder={selectProps.placeholder || "Select one"}
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

          {/* Right Column: Plan Details */}
          <div className="flex flex-col items-start justify-center  bg-stone-800 p-6 sm:p-8">
            <h2 className="font-whyteInktrap text-[40px] font-medium leading-[1] tracking-[-2px] text-[#EEECE6]">
              Basic
            </h2>
            <p className="mb-6 mt-3 font-circular text-sm font-normal leading-5 text-[#EEECE6]">
              Everything you need to start building and scaling reliable systems
              for free
            </p>
            <div className="my-4">
              <span className="text-6xl font-extrabold text-neutral-100">
                $0
              </span>
              <span className="text-xl text-neutral-400"> /month</span>
            </div>
            <Button className="mt-auto h-11 w-full bg-[#C2A46A] py-3 text-base font-semibold text-[#212121] hover:bg-[#b3955d]">
              Get started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
