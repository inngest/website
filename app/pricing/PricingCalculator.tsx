"use client";
import { useState, useMemo } from "react";
import { RiArrowDownSLine } from "@remixicon/react";

import classNames from "src/utils/classNames";
import { type Plan, PLAN_NAMES, getPlan } from "./plans";

const FREE_PLAN = getPlan(PLAN_NAMES.basicFree);
const BASIC_PLAN = getPlan(PLAN_NAMES.basic);
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
    [PLAN_NAMES.basic]: {
      cost: calculatePlanCost({
        planName: PLAN_NAMES.basic,
        runs,
        steps,
        concurrency,
      }),
    },
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
        estimates[PLAN_NAMES.basic].cost.totalCost <
        estimates[PLAN_NAMES.pro].cost.totalCost
          ? PLAN_NAMES.basic
          : estimates[PLAN_NAMES.pro].cost.totalCost < 2_000
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
      className="h-full bg-canvasBase border border-muted rounded-2xl text-basis"
    >
      <div
        className="py-4 px-6 flex items-center gap-4 justify-center cursor-pointer"
        onClick={() => setOpen(!isOpen)}
      >
        <h2 className="text-lg">Pricing calculator</h2>
        <RiArrowDownSLine
          className={`h-4 w-4 transition-all ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      <div
        className={classNames(
          "w-full py-8 px-6 text-left",
          "border-t border-muted",
          isOpen ? "block" : "hidden"
        )}
      >
        <div className="max-w-6xl grid grid-cols-2 md:grid-cols-3 gap-8">
          <div className="grid grid-cols-2 gap-y-2 grid-rows-5 col-span-2">
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
      className="px-2 py-1 rounded-md border border-muted bg-canvasSubtle focus:outline-none"
      {...props}
    />
  );
}
function Calculated({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-2 py-1 flex flex-row items-center gap-2">
      {children}
      <span className="mt-px text-muted text-xs">CALCULATED</span>
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
