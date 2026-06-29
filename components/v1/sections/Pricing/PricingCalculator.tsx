"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ButtonLink from "@/components/v1/ButtonLink";
import Chip from "@/components/v1/sections/shared/Chip";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import { cn } from "@/utils/v1/cn";
import { CURSOR_SPOTLIGHT_SEED, onCursorSpotlightMove } from "@/utils/v1/cursorFx";
import { PLANS, PLAN_NAMES, getPlan, type Plan, type PlanName } from "./plans";

// Pricing calculator. Left panel is the calculator (carbon-400
// gradient + sliders + 3 number fields with bottom-border inputs).
// Right panel is the recommended plan card (gradient → carbon-500,
// large $price, salmon CTA).

const HOBBY_PLAN = getPlan(PLAN_NAMES.hobby);
const PRO_PLAN = getPlan(PLAN_NAMES.pro);

const EXECUTION_TIERS: Record<
  "pro" | "enterprise",
  { min: number; max: number; rate: number }[]
> = {
  pro: [
    { min: 1_000_000, max: 5_000_000, rate: 0.00005 },
    { min: 5_000_000, max: 15_000_000, rate: 0.000025 },
    { min: 15_000_000, max: 50_000_000, rate: 0.00002 },
    { min: 50_000_000, max: 100_000_000, rate: 0.000015 },
  ],
  enterprise: [
    { min: 10_000_000, max: 15_000_000, rate: 0.0000575 },
    { min: 15_000_000, max: 50_000_000, rate: 0.0000287 },
    { min: 50_000_000, max: 100_000_000, rate: 0.000023 },
    { min: 100_000_000, max: Infinity, rate: 0.000017 },
  ],
};

function num(v: string | number | null | undefined): number {
  if (v == null) return 0;
  if (typeof v === "string") {
    const parsed = parseInt(v.replace(/,/g, ""), 10);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return v;
}

function executionsCost(
  total: number,
  included: number,
  planType: "pro" | "enterprise"
): number {
  const excess = Math.max(total - included, 0);
  if (excess === 0) return 0;
  const tiers = EXECUTION_TIERS[planType];
  let cost = 0;
  let remaining = excess;
  let processed = included;
  for (const tier of tiers) {
    if (remaining <= 0) break;
    const tierStart = Math.max(tier.min, processed);
    const tierEnd = Math.min(tier.max, processed + remaining);
    const ex = Math.max(tierEnd - tierStart, 0);
    if (ex > 0) {
      cost += ex * tier.rate;
      remaining -= ex;
      processed += ex;
    }
  }
  return cost;
}

interface Inputs {
  runs: number;
  steps: number;
  concurrency: number;
  users: number;
  workers: number;
}

function planCost(plan: Plan, inputs: Inputs): number {
  const total = inputs.runs * inputs.steps + inputs.runs;
  let base = 0;
  let included = 0;
  let exec = 0;
  if (plan.name === PLAN_NAMES.hobby) {
    included = num(HOBBY_PLAN.cost.includedRuns);
    exec = executionsCost(total, included, "pro");
  } else if (plan.name === PLAN_NAMES.pro) {
    base = num(plan.cost.basePrice);
    included = num(plan.cost.includedRuns);
    exec = executionsCost(total, included, "pro");
  } else {
    base = total <= 10_000_000 ? 1000 : 2500;
    included = 10_000_000;
    exec = executionsCost(total, included, "enterprise");
  }
  const addConc = Math.max(
    inputs.concurrency - num(plan.cost.includedConcurrency),
    0
  );
  const concCost =
    plan.cost.additionalConcurrencyRate && addConc > 0
      ? Math.ceil(addConc / num(plan.cost.additionalConcurrencyRate)) *
      num(plan.cost.additionalConcurrencyPrice)
      : 0;
  const addUsers = Math.max(inputs.users - num(plan.cost.includedUsers), 0);
  const usersCost =
    plan.cost.additionalUsersRate && addUsers > 0
      ? Math.ceil(addUsers / num(plan.cost.additionalUsersRate)) *
      num(plan.cost.additionalUsersPrice)
      : 0;
  const addW = Math.max(
    inputs.workers - num(plan.cost.includedWorkers ?? 0),
    0
  );
  const wCost =
    plan.cost.additionalWorkersRate && addW > 0
      ? Math.ceil(addW / num(plan.cost.additionalWorkersRate)) *
      num(plan.cost.additionalWorkersPrice)
      : 0;
  return base + exec + concCost + usersCost + wCost;
}

function recommend(inputs: Inputs): PlanName {
  const total = inputs.runs * inputs.steps + inputs.runs;
  const exceeds =
    total > 100_000 ||
    inputs.concurrency > num(HOBBY_PLAN.cost.includedConcurrency) ||
    inputs.users > num(HOBBY_PLAN.cost.includedUsers) ||
    inputs.workers > num(HOBBY_PLAN.cost.includedWorkers ?? 0);
  if (!exceeds) return PLAN_NAMES.hobby;
  const proCost = planCost(PRO_PLAN, inputs);
  if (proCost > 1500) return PLAN_NAMES.enterprise;
  return PLAN_NAMES.pro;
}

const RECOMMENDED_BULLETS: Record<PlanName, string[]> = {
  [PLAN_NAMES.hobby]: ["5 concurrent steps", "50 realtime connections"],
  [PLAN_NAMES.pro]: ["100 concurrent steps", "Granular metrics"],
  [PLAN_NAMES.enterprise]: ["500+ concurrent steps", "Dedicated infra"],
};

export default function PricingCalculator() {
  const [runs, setRuns] = useState(30_000);
  const [steps, setSteps] = useState(2);
  const [users, setUsers] = useState(3);
  const [concurrency, setConcurrency] = useState(3);
  const [workers, setWorkers] = useState(3);

  const total = runs * steps + runs;
  const inputs: Inputs = { runs, steps, users, concurrency, workers };

  const recName = useMemo(() => recommend(inputs), [
    runs,
    steps,
    users,
    concurrency,
    workers,
  ]);
  const plan = getPlan(recName);
  const cost = useMemo(() => planCost(plan, inputs), [
    recName,
    runs,
    steps,
    users,
    concurrency,
    workers,
  ]);
  const priceText =
    recName === PLAN_NAMES.enterprise
      ? "Custom"
      : `$${Math.round(cost).toLocaleString()}`;
  const showPeriod = recName !== PLAN_NAMES.enterprise;

  return (
    <Section
      aria-labelledby="pricing-calc-heading"
      className="relative"
      containerClassName="flex flex-col gap-v1-stack"
    >
      <SectionHeader
        id="pricing-calc-heading"
        title="Which plan is right for me?"
        body="Use the pricing calculator to see which plan is the best option for you."
      />

      {/* Calculator surface */}
      <div
        className="grid grid-cols-1 gap-y-10 overflow-hidden rounded-[10px] border border-v1-strong/[0.35] px-6 py-[44px] sm:px-[44px] lg:grid-cols-[1fr_1fr] lg:gap-x-[61px] lg:gap-y-0"
        style={{
          backgroundImage:
            "linear-gradient(-38.4355deg, rgba(2, 2, 2, 0) 1.4608%, rgb(33, 33, 33) 50.427%)",
        }}
      >
        {/* Left — controls */}
        <div className="flex flex-col gap-[21px]">
          <h3 className="font-v1Heading text-[22px] tracking-[-0.01em] text-v1-frost lg:text-[26px] v1-cap-trim">
            PRICING CALCULATOR
          </h3>

          <div
            className="flex items-center justify-between gap-4 rounded-l-md pt-6 pb-10"
            style={{
              backgroundImage:
                "linear-gradient(-90deg, rgba(33, 33, 33, 0) 18.762%, rgb(33, 33, 33) 103.37%)",
            }}
          >
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <p className="font-v1Label text-[14px] uppercase leading-[16px] tracking-[0.04em] text-v1-frost sm:text-[16px] v1-cap-trim">
                Total executions per month
              </p>
              <p className="text-[12px] leading-[16px] text-v1-frost">
                ({runs.toLocaleString()} runs × {steps} steps per run) +{" "}
                {runs.toLocaleString()} runs = {total.toLocaleString()} executions
              </p>
            </div>
            <p className="shrink-0 font-v1Body text-[18px] leading-[24px] tracking-[-0.01em] text-v1-frost">
              {total.toLocaleString()}
            </p>
          </div>

          <div className="flex flex-col gap-10">
            <SliderRow
              id="calc-runs"
              label="Number of runs"
              value={runs}
              min={0}
              max={1_000_000}
              step={1_000}
              onChange={setRuns}
              displayValue={runs.toLocaleString()}
            />
            <SliderRow
              id="calc-steps"
              label="Average number of steps per run"
              value={steps}
              min={1}
              max={100}
              step={1}
              onChange={setSteps}
              displayValue={steps.toLocaleString()}
            />
          </div>

          <div className="mt-1 grid grid-cols-1 gap-x-[44px] gap-y-6 py-[10px] sm:grid-cols-3">
            <NumberStepper
              id="calc-users"
              label="Number of users"
              value={users}
              min={0}
              onChange={setUsers}
            />
            <NumberStepper
              id="calc-concurrency"
              label="Step concurrency"
              value={concurrency}
              min={0}
              onChange={setConcurrency}
            />
            <NumberStepper
              id="calc-workers"
              label="Number of workers"
              value={workers}
              min={0}
              onChange={setWorkers}
            />
          </div>
        </div>

        {/* Right — recommended plan. The whole card is a click
            target via the CTA's stretched-link pseudo-element, plus a
            cursor-tracked spotlight overlay (mouse only). */}
        <div
          className="group/plancard relative isolate flex cursor-pointer flex-col items-start justify-center gap-5 overflow-hidden rounded-[10px] border border-v1-strong/[0.35] px-6 py-8 motion-safe:transition-colors hover:border-v1-strong/[0.55] lg:px-[24.65px] lg:py-[32.86px]"
          onPointerMove={onCursorSpotlightMove}
          style={{
            ...CURSOR_SPOTLIGHT_SEED,
            backgroundImage:
              "linear-gradient(-53.5859deg, rgba(33, 33, 33, 0) 2.2521%, rgb(2, 2, 2) 46.831%)",
          }}
        >
          {/* Cursor-tracked spotlight — fades in on hover, anchored
              to --mx/--my from the shared cursorFx vars. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 opacity-0 motion-safe:transition-opacity motion-safe:duration-[500ms] motion-safe:ease-out group-hover/plancard:opacity-100 group-focus-within/plancard:opacity-100"
            style={{
              background:
                "radial-gradient(420px circle at var(--mx) var(--my), rgba(255, 210, 195, 0.18), transparent 65%)",
            }}
          />

          <div className="flex flex-wrap items-center gap-[18px] py-1">
            <h3 className="font-v1Display text-[40px] uppercase leading-[1.1] tracking-[-0.01em] text-v1-frost sm:text-[56px] lg:text-[64px] lg:leading-[1.25] v1-cap-trim">
              {plan.name.toUpperCase()}
            </h3>
            <Chip size="sm" variant="solid">
              Recommended Plan
            </Chip>
          </div>

          <p className="max-w-[480px] text-v1-body-sm text-v1-frost">
            {plan.description}
          </p>

          <div className="flex flex-col items-start">
            <div className="flex items-end gap-1 py-1 text-v1-frost">
              <span className="font-v1Display text-[48px] leading-[1.1] tracking-[-0.01em] sm:text-[64px] sm:leading-[1.25] v1-cap-trim">
                {priceText}
              </span>
              {showPeriod && (
                <span className="font-v1Body text-[18px] leading-[24px] tracking-[-0.01em]">
                  /mo
                </span>
              )}
            </div>
            <p className="text-v1-body-xs text-v1-frost/50">
              {plan.priceCaption}
            </p>
          </div>

          <ul className="flex list-disc flex-col pb-3 ps-[21px] text-v1-body-xs text-v1-frost">
            {RECOMMENDED_BULLETS[recName].map((line) => (
              <li key={line} className="py-1">
                {line}
              </li>
            ))}
          </ul>

          {/* Stretched-link: the anchor's ::before overlays the
              whole card so any click in the card navigates to the
              CTA destination. */}
          <ButtonLink
            href={plan.cta.href}
            variant="accent"
            wide
            className="cursor-pointer before:absolute before:inset-0 before:rounded-[10px] before:content-['']"
          >
            {plan.cta.text}
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}

function SliderRow({
  id,
  label,
  value,
  min,
  max,
  step,
  onChange,
  displayValue,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
  displayValue: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-[10px] text-v1-body-xs text-v1-frost v1-trim">
        <span className="flex-1">{label}</span>
        <span className="flex-1 text-right font-medium tracking-[-0.01em]">
          {displayValue}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="v1-pricing-slider w-full appearance-none bg-transparent"
        style={
          {
            ["--pct" as string]: `${pct}%`,
          } as React.CSSProperties
        }
        aria-label={label}
      />
    </div>
  );
}

function NumberStepper({
  id,
  label,
  value,
  min,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  onChange: (n: number) => void;
}) {
  // Internal draft string so a cleared field doesn't snap back to 0
  // mid-edit; commit to the numeric `value` on blur (or whenever the
  // draft parses cleanly). Kept in sync when `value` changes from
  // outside (e.g. press-and-hold steppers).
  const [draft, setDraft] = useState<string>(String(value));
  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const valueRef = useRef(value);
  valueRef.current = value;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // Press-and-hold: 400ms delay → 150ms tick → accelerates to 50ms.
  // Step itself grows from 1 → 5 → 25 as the hold continues so very
  // long holds reach big numbers quickly without overshooting on a
  // short tap.
  const holdRef = useRef<{ timer: number | null; cancelled: boolean }>({
    timer: null,
    cancelled: false,
  });
  const clearHold = useCallback(() => {
    if (holdRef.current.timer !== null) {
      window.clearTimeout(holdRef.current.timer);
      holdRef.current.timer = null;
    }
    holdRef.current.cancelled = true;
  }, []);
  const startHold = useCallback(
    (direction: 1 | -1) => {
      holdRef.current.cancelled = false;
      const apply = (step: number) => {
        const next =
          direction === 1
            ? valueRef.current + step
            : Math.max(min, valueRef.current - step);
        if (next !== valueRef.current) onChangeRef.current(next);
      };
      apply(1);
      let ticks = 0;
      const tick = () => {
        if (holdRef.current.cancelled) return;
        ticks += 1;
        const step = ticks < 8 ? 1 : ticks < 20 ? 5 : 25;
        const delay = ticks < 8 ? 150 : ticks < 20 ? 80 : 50;
        apply(step);
        holdRef.current.timer = window.setTimeout(tick, delay);
      };
      holdRef.current.timer = window.setTimeout(tick, 400);
    },
    [min]
  );
  useEffect(() => clearHold, [clearHold]);

  const holdHandlers = (direction: 1 | -1) => ({
    onPointerDown: (e: React.PointerEvent<HTMLButtonElement>) => {
      if (e.button !== 0) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      startHold(direction);
    },
    onPointerUp: clearHold,
    onPointerCancel: clearHold,
    onPointerLeave: clearHold,
  });

  const commitDraft = () => {
    const parsed = parseInt(draft.replace(/[^0-9-]/g, ""), 10);
    const next = Number.isNaN(parsed) ? min : Math.max(min, parsed);
    if (next !== value) onChange(next);
    setDraft(String(next));
  };

  return (
    <div className="flex flex-col gap-[13px]">
      <label htmlFor={id} className="text-v1-body-xs text-v1-frost">
        {label}
      </label>
      <div className="flex items-center justify-between gap-2 border-b border-v1-strong py-1 pl-[10px] pr-1 focus-within:border-v1-accent-salmon motion-safe:transition-colors">
        <input
          id={id}
          type="text"
          inputMode="numeric"
          value={draft}
          onChange={(e) => {
            const next = e.target.value.replace(/[^0-9]/g, "");
            setDraft(next);
            if (next !== "") {
              const parsed = parseInt(next, 10);
              if (!Number.isNaN(parsed) && parsed >= min) onChange(parsed);
            }
          }}
          onBlur={commitDraft}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitDraft();
            if (e.key === "ArrowUp") {
              e.preventDefault();
              onChange(value + (e.shiftKey ? 10 : 1));
            }
            if (e.key === "ArrowDown") {
              e.preventDefault();
              onChange(Math.max(min, value - (e.shiftKey ? 10 : 1)));
            }
          }}
          aria-label={label}
          className="w-full min-w-0 bg-transparent font-v1Body text-[18px] leading-[24px] tracking-[-0.01em] text-v1-frost outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0"
        />
        <div className="flex flex-col items-center">
          <button
            type="button"
            aria-label={`Increase ${label}`}
            {...holdHandlers(1)}
            className="flex h-[10px] touch-manipulation items-center justify-center text-v1-frost hover:text-v1-accent-salmon"
          >
            <svg viewBox="0 0 8 5" className="h-[5px] w-[8px] fill-current" aria-hidden="true">
              <path d="M0 5 L4 0 L8 5 Z" />
            </svg>
          </button>
          <button
            type="button"
            aria-label={`Decrease ${label}`}
            {...holdHandlers(-1)}
            className="flex h-[10px] touch-manipulation items-center justify-center text-v1-frost hover:text-v1-accent-salmon"
          >
            <svg viewBox="0 0 8 5" className="h-[5px] w-[8px] fill-current" aria-hidden="true">
              <path d="M0 0 L4 5 L8 0 Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
