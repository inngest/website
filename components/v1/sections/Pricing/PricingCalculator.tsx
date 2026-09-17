"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ButtonLink from "@/components/v1/ButtonLink";
import Chip from "@/components/v1/sections/shared/Chip";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import { CURSOR_SPOTLIGHT_SEED, onCursorSpotlightMove } from "@/utils/v1/cursorFx";
import { PLANS, PLAN_NAMES, getPlan, type Plan, type PlanName } from "./plans";

// Compact pricing calculator. Left: billed dimensions with a one-line
// definition under each slider. Right: recommended plan card.

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

const HOBBY_LIMITS = {
  scores: 10_000,
  queueDepth: 100_000,
  realtime: 50,
} as const;

const PRO_LIMITS = {
  scores: 50_000,
  queueDepth: 1_000_000,
  realtime: 1_000,
} as const;

interface Inputs {
  runs: number;
  concurrency: number;
  users: number;
  workers: number;
  scores: number;
  queueDepth: number;
  realtime: number;
}

function executionCount(inputs: Inputs): number {
  return inputs.runs;
}

function planCost(plan: Plan, inputs: Inputs): number {
  const total = executionCount(inputs);
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
  const exceedsHobby =
    executionCount(inputs) > 100_000 ||
    inputs.concurrency > num(HOBBY_PLAN.cost.includedConcurrency) ||
    inputs.users > num(HOBBY_PLAN.cost.includedUsers) ||
    inputs.workers > num(HOBBY_PLAN.cost.includedWorkers ?? 0) ||
    inputs.scores > HOBBY_LIMITS.scores ||
    inputs.queueDepth > HOBBY_LIMITS.queueDepth ||
    inputs.realtime > HOBBY_LIMITS.realtime;
  if (!exceedsHobby) return PLAN_NAMES.hobby;
  const exceedsPro =
    inputs.scores > PRO_LIMITS.scores ||
    inputs.queueDepth > PRO_LIMITS.queueDepth ||
    inputs.realtime > PRO_LIMITS.realtime;
  const proCost = planCost(PRO_PLAN, inputs);
  if (exceedsPro || proCost > 1500) return PLAN_NAMES.enterprise;
  return PLAN_NAMES.pro;
}

type RecDimension = { value: string; label: string };

// Order matches the conversion levers: users / executions / concurrent
// steps first (emphasized in the rec card), then supporting limits.
const RECOMMENDED_DIMENSIONS: Record<PlanName, RecDimension[]> = {
  [PLAN_NAMES.hobby]: [
    { value: "5", label: "seats" },
    { value: "50k", label: "executions" },
    { value: "5", label: "concurrent steps" },
    { value: "10K", label: "scores" },
    { value: "100k", label: "queue depth" },
    { value: "50", label: "realtime connections" },
  ],
  [PLAN_NAMES.pro]: [
    { value: "15", label: "seats" },
    { value: "1M+", label: "executions" },
    { value: "100+", label: "concurrent steps" },
    { value: "50K", label: "scores" },
    { value: "1M+", label: "queue depth" },
    { value: "1000", label: "realtime connections" },
  ],
  [PLAN_NAMES.enterprise]: [
    { value: "50", label: "seats" },
    { value: "Custom", label: "executions" },
    { value: "Custom", label: "concurrent steps" },
    { value: "Custom", label: "scores" },
    { value: "Custom", label: "queue depth" },
    { value: "Custom", label: "realtime connections" },
  ],
};

const PRIMARY_DIMENSION_COUNT = 3;

export default function PricingCalculator() {
  const [users, setUsers] = useState(5);
  const [concurrency, setConcurrency] = useState(3);
  const [runs, setRuns] = useState(30_000);
  const [workers, setWorkers] = useState(3);
  const [scores, setScores] = useState(5_000);
  const [queueDepth, setQueueDepth] = useState(50_000);
  const [realtime, setRealtime] = useState(20);

  const inputs: Inputs = {
    runs,
    users,
    concurrency,
    workers,
    scores,
    queueDepth,
    realtime,
  };

  const recName = useMemo(
    () => recommend(inputs),
    [runs, users, concurrency, workers, scores, queueDepth, realtime],
  );
  const plan = getPlan(recName);
  const cost = useMemo(
    () => planCost(plan, inputs),
    [
      recName,
      runs,
      users,
      concurrency,
      workers,
      scores,
      queueDepth,
      realtime,
    ],
  );
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

      <div
        className="grid grid-cols-1 gap-y-8 overflow-hidden rounded-md border border-v1-contrast px-5 py-6 sm:px-8 lg:grid-cols-[1.05fr_minmax(0,0.95fr)] lg:gap-x-10 lg:py-7"
        style={{
          backgroundImage:
            "linear-gradient(-38.4355deg, rgba(2, 2, 2, 0) 1.4608%, rgb(33, 33, 33) 50.427%)",
        }}
      >
        <div className="flex flex-col gap-5">
          <h3 className="text-v1-label-sm uppercase tracking-[0.04em] text-v1-frost">
            Pricing calculator
          </h3>

          <div className="flex flex-col gap-5">
            <SliderRow
              id="calc-runs"
              label="Number of runs"
              hint="Function invocations per month. Each run counts as an execution."
              value={runs}
              min={0}
              max={1_000_000}
              step={1_000}
              onChange={setRuns}
              displayValue={runs.toLocaleString()}
            />
            <SliderRow
              id="calc-scores"
              label="Scores"
              hint="Evaluation scores ingested per month."
              value={scores}
              min={0}
              max={250_000}
              step={1_000}
              onChange={setScores}
              displayValue={scores.toLocaleString()}
            />
            <SliderRow
              id="calc-queue"
              label="Queue depth"
              hint="Maximum events queued awaiting execution."
              value={queueDepth}
              min={0}
              max={5_000_000}
              step={10_000}
              onChange={setQueueDepth}
              displayValue={queueDepth.toLocaleString()}
            />
            <SliderRow
              id="calc-realtime"
              label="Realtime connections"
              hint="Concurrent realtime connections."
              value={realtime}
              min={0}
              max={2_000}
              step={10}
              onChange={setRealtime}
              displayValue={realtime.toLocaleString()}
            />
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-3">
            <NumberStepper
              id="calc-users"
              label="Seats"
              value={users}
              min={0}
              onChange={setUsers}
            />
            <NumberStepper
              id="calc-concurrency"
              label="Concurrent steps"
              value={concurrency}
              min={0}
              onChange={setConcurrency}
            />
            <NumberStepper
              id="calc-workers"
              label="Workers"
              value={workers}
              min={0}
              onChange={setWorkers}
            />
          </div>
        </div>

        <div
          className="group/plancard relative isolate flex h-full min-w-0 cursor-pointer flex-col items-start gap-6 rounded-md border border-v1-contrast px-5 py-6 motion-safe:transition-colors hover:border-v1-frost/40 lg:px-6 lg:py-6"
          onPointerMove={onCursorSpotlightMove}
          style={{
            ...CURSOR_SPOTLIGHT_SEED,
            backgroundImage:
              "linear-gradient(-53.5859deg, rgba(33, 33, 33, 0) 2.2521%, rgb(2, 2, 2) 46.831%)",
          }}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-md opacity-0 motion-safe:transition-opacity motion-safe:duration-[500ms] motion-safe:ease-out group-hover/plancard:opacity-100 group-focus-within/plancard:opacity-100"
            style={{
              background:
                "radial-gradient(420px circle at var(--mx) var(--my), rgba(255, 210, 195, 0.18), transparent 65%)",
            }}
          />

          <div className="flex flex-wrap items-center gap-3">
            <h3 className="font-v1Display text-[32px] uppercase leading-[1.15] tracking-[-0.01em] text-v1-frost sm:text-[40px]">
              {plan.name.toUpperCase()}
            </h3>
            <Chip size="sm" variant="solid">
              Recommended
            </Chip>
          </div>

          <p className="max-w-[420px] text-v1-body-xs text-v1-frost/80">
            {plan.description}
          </p>

          <div className="flex flex-col items-start gap-2">
            <p className="flex items-baseline gap-1 text-v1-frost">
              <span className="font-v1Display text-[36px] leading-[1.15] tracking-[-0.01em] sm:text-[44px]">
                {priceText}
              </span>
              {showPeriod && (
                <span className="font-v1Body text-[14px] leading-[1.15] tracking-[-0.01em] text-v1-frost/70">
                  /mo
                </span>
              )}
            </p>
            {plan.priceCaption && (
              <p className="text-v1-body-xs text-v1-frost/50">
                {plan.priceCaption}
              </p>
            )}
          </div>

          <div className="flex w-full min-w-0 flex-col gap-4">
            <ul className="m-0 grid list-none grid-cols-[minmax(0,1fr)_auto] gap-x-6 gap-y-2 p-0">
              {RECOMMENDED_DIMENSIONS[recName]
                .slice(0, PRIMARY_DIMENSION_COUNT)
                .map((dim) => (
                  <li key={dim.label} className="contents">
                    <span className="text-[16px] leading-6 text-v1-frost">
                      {dim.label}
                    </span>
                    <span className="text-right text-[16px] leading-6 font-medium tabular-nums text-v1-accent-salmon">
                      {dim.value}
                    </span>
                  </li>
                ))}
            </ul>
            <span aria-hidden="true" className="h-px w-10 bg-v1-frost/30" />
            <ul className="m-0 grid list-none grid-cols-[minmax(0,1fr)_auto] gap-x-6 gap-y-1.5 p-0">
              {RECOMMENDED_DIMENSIONS[recName]
                .slice(PRIMARY_DIMENSION_COUNT)
                .map((dim) => (
                  <li key={dim.label} className="contents">
                    <span className="text-[13px] leading-5 text-v1-frost/50">
                      {dim.label}
                    </span>
                    <span className="text-right text-[13px] leading-5 tabular-nums text-v1-frost/50">
                      {dim.value}
                    </span>
                  </li>
                ))}
            </ul>
          </div>

          <ButtonLink
            href={plan.cta.href}
            variant="accent"
            size="sm"
            wide
            className="mt-auto cursor-pointer before:absolute before:inset-0 before:rounded-md before:content-['']"
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
  hint,
  value,
  min,
  max,
  step,
  onChange,
  displayValue,
}: {
  id: string;
  label: string;
  hint: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
  displayValue: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-3 text-v1-body-xs text-v1-frost">
        <label htmlFor={id}>{label}</label>
        <span className="shrink-0 font-medium tracking-[-0.01em]">
          {displayValue}
        </span>
      </div>
      <p id={`${id}-hint`} className="text-v1-caption text-v1-frost/50">
        {hint}
      </p>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="v1-pricing-slider mt-1 w-full appearance-none bg-transparent"
        style={
          {
            ["--pct" as string]: `${pct}%`,
          } as React.CSSProperties
        }
        aria-label={label}
        aria-describedby={`${id}-hint`}
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
    [min],
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
            <svg
              viewBox="0 0 8 5"
              className="h-[5px] w-[8px] fill-current"
              aria-hidden="true"
            >
              <path d="M0 5 L4 0 L8 5 Z" />
            </svg>
          </button>
          <button
            type="button"
            aria-label={`Decrease ${label}`}
            {...holdHandlers(-1)}
            className="flex h-[10px] touch-manipulation items-center justify-center text-v1-frost hover:text-v1-accent-salmon"
          >
            <svg
              viewBox="0 0 8 5"
              className="h-[5px] w-[8px] fill-current"
              aria-hidden="true"
            >
              <path d="M0 0 L4 5 L8 0 Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
