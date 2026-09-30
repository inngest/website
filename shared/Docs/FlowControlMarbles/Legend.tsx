"use client";

import clsx from "clsx";
import { useMemo, type ReactNode } from "react";
import { snapshotAt } from "../FlowControlSimulator/derive";
import { Check, Cross } from "./Diagram";
import { LOOK, METER_FILL, SLEEP, type Look } from "./looks";
import { EPS, type MeterKind, type Model } from "./model";

const dot = (look: Look) => (
  <svg width={14} height={14} viewBox="-7 -7 14 14" aria-hidden>
    <circle
      r={look.stroke ? 5.75 : 6}
      className={clsx(look.fill, look.stroke)}
      strokeWidth={look.stroke ? 1.5 : 0}
      strokeDasharray={look.dash}
    />
  </svg>
);

const SWATCH = {
  event: dot(LOOK.event),
  replaced: dot(LOOK.replaced),
  collect: dot(LOOK.collect),
  concurrency: dot(LOOK.concurrency),
  throttle: dot(LOOK.throttle),
  backlog: dot(LOOK.backlog),
  skipped: (
    <svg width={14} height={14} viewBox="-7 -7 14 14" aria-hidden>
      <circle
        r={5.75}
        className={clsx(LOOK.skipped.fill, LOOK.skipped.stroke)}
        strokeWidth={1.5}
      />
      <Cross
        x={0}
        y={0}
        s={2.6}
        className="stroke-ruby-500 dark:stroke-ruby-400"
        width={1.5}
      />
    </svg>
  ),
  run: (
    <svg width={20} height={14} viewBox="0 0 20 14" aria-hidden>
      <rect
        x={1}
        y={1}
        width={18}
        height={12}
        rx={6}
        className={LOOK.run.fill}
      />
    </svg>
  ),
  sleep: (
    <svg width={20} height={14} viewBox="0 0 20 14" aria-hidden>
      <rect
        x={1.5}
        y={1.5}
        width={17}
        height={11}
        rx={5.5}
        className={SLEEP}
        strokeWidth={1.25}
        strokeDasharray="3 2.5"
      />
    </svg>
  ),
  done: (
    <svg width={14} height={14} viewBox="-7 -7 14 14" aria-hidden>
      <circle r={6} className={LOOK.run.fill} />
      <Check
        x={0}
        y={0}
        s={2.8}
        className="stroke-white dark:stroke-carbon-1000"
      />
    </svg>
  ),
  cancelled: (
    <svg width={14} height={14} viewBox="-7 -7 14 14" aria-hidden>
      <circle r={6} className="fill-ruby-500 dark:fill-ruby-400" />
      <Cross
        x={0}
        y={0}
        s={2.4}
        className="stroke-white dark:stroke-carbon-1000"
        width={1.5}
      />
    </svg>
  ),
};

const meterSwatch = (m: MeterKind) => (
  <svg width={10} height={14} viewBox="-5 -7 10 14" aria-hidden>
    <circle r={3.25} className={METER_FILL[m]} />
  </svg>
);

const METER_LABEL: Record<MeterKind, string> = {
  slots: "Slot in use",
  throttle: "Throttle capacity",
  rateLimit: "Rate limit capacity",
  batch: "Events in the batch",
};

interface Item {
  key: string;
  label: string;
  swatch: ReactNode;
  count?: ReactNode;
}

/** Legend from what the result contains. For fixed docs scenarios. */
function resultItems(model: Model): Item[] {
  const { result } = model;
  const firstWaits = result.runs.flatMap((r) =>
    r.segments.filter(
      (s) =>
        s.kind === "wait" &&
        (r.firstStartAt === undefined || s.to <= r.firstStartAt + EPS)
    )
  );
  const items: Item[] = [
    { key: "event", label: "Event", swatch: SWATCH.event },
  ];
  if (result.events.some((e) => e.outcome === "debounce-superseded"))
    items.push({
      key: "replaced",
      label: "Replaced by a later event",
      swatch: SWATCH.replaced,
    });
  if (
    result.events.some(
      (e) => e.outcome === "rate-limited" || e.outcome === "singleton-skipped"
    )
  )
    items.push({ key: "skipped", label: "Skipped", swatch: SWATCH.skipped });
  if (result.runs.some((r) => r.collect?.kind === "debounce"))
    items.push({
      key: "collect-d",
      label: "Waiting for a quiet period",
      swatch: SWATCH.collect,
    });
  if (result.runs.some((r) => r.collect?.kind === "batch"))
    items.push({
      key: "collect-b",
      label: "Collecting into a batch",
      swatch: SWATCH.collect,
    });
  if (firstWaits.some((s) => s.reason === "concurrency"))
    items.push({
      key: "q-c",
      label: "Queued for a slot",
      swatch: SWATCH.concurrency,
    });
  if (firstWaits.some((s) => s.reason === "throttle"))
    items.push({
      key: "q-t",
      label: "Queued for throttle capacity",
      swatch: SWATCH.throttle,
    });
  if (firstWaits.some((s) => s.reason === "backlog"))
    items.push({
      key: "q-b",
      label: "Queued behind other keys",
      swatch: SWATCH.backlog,
    });
  if (result.runs.some((r) => r.firstStartAt !== undefined))
    items.push({ key: "run", label: "Step executing", swatch: SWATCH.run });
  if (result.runs.some((r) => r.segments.some((s) => s.kind === "sleep")))
    items.push({
      key: "sleep",
      label: "Sleeping (no slot)",
      swatch: SWATCH.sleep,
    });
  if (result.runs.some((r) => r.end === "completed"))
    items.push({ key: "done", label: "Completed", swatch: SWATCH.done });
  if (result.runs.some((r) => r.end === "cancelled"))
    items.push({
      key: "cancelled",
      label: "Cancelled",
      swatch: SWATCH.cancelled,
    });
  return items;
}

/**
 * Legend from the config, with counts at the playhead. Which items appear
 * depends only on the config, so the line doesn't change height as it plays.
 */
function countItems(model: Model, t: number): Item[] {
  const { cfg, result } = model;
  const snap = snapshotAt(result, cfg, t);
  const waiting = (r: string) =>
    snap.queue.filter((q) => q.reason === r).length;
  const keyed =
    cfg.concurrency.constraints.some((c) => c.key === "tenant") ||
    (cfg.throttle.enabled && cfg.throttle.key === "tenant");
  const items: Item[] = [
    {
      key: "event",
      label: "Event",
      swatch: SWATCH.event,
      count: snap.received,
    },
  ];
  if (cfg.rateLimit.enabled || cfg.singleton.enabled)
    items.push({
      key: "skipped",
      label: "Skipped",
      swatch: SWATCH.skipped,
      count: snap.rateLimited + snap.singletonSkipped,
    });
  if (cfg.debounce.enabled)
    items.push({
      key: "replaced",
      label: "Replaced",
      swatch: SWATCH.replaced,
      count: model.tokens.filter((tok) =>
        tok.stages.some(
          (s) => s.kind === "replaced" && (s.at ?? s.t) <= t + EPS
        )
      ).length,
    });
  if (cfg.debounce.enabled || cfg.batching.enabled)
    items.push({
      key: "collect",
      label: cfg.batching.enabled
        ? "Collecting into a batch"
        : "Waiting for a quiet period",
      swatch: SWATCH.collect,
      count: snap.collecting.length,
    });
  items.push({
    key: "q-c",
    label: "Queued for a slot",
    swatch: SWATCH.concurrency,
    count: waiting("concurrency"),
  });
  if (cfg.throttle.enabled)
    items.push({
      key: "q-t",
      label: "Queued for throttle",
      swatch: SWATCH.throttle,
      count: waiting("throttle"),
    });
  if (!cfg.keyQueues && keyed)
    items.push({
      key: "q-b",
      label: "Behind other keys",
      swatch: SWATCH.backlog,
      count: waiting("backlog"),
    });
  items.push({
    key: "run",
    label: "Executing",
    swatch: SWATCH.run,
    count: snap.executing.length,
  });
  if (cfg.steps.some((s) => s.kind === "sleep"))
    items.push({
      key: "sleep",
      label: "Sleeping",
      swatch: SWATCH.sleep,
      count: snap.sleeping.length,
    });
  items.push({
    key: "done",
    label: "Completed",
    swatch: SWATCH.done,
    count: snap.completed,
  });
  if (
    (cfg.singleton.enabled && cfg.singleton.mode === "cancel") ||
    cfg.startTimeout.enabled
  )
    items.push({
      key: "cancelled",
      label: "Cancelled",
      swatch: SWATCH.cancelled,
      count: snap.cancelled,
    });
  return items;
}

export function MarbleLegend({
  model,
  t = 0,
  counts = false,
}: {
  model: Model;
  t?: number;
  /** Show live counts at the playhead, with items fixed by the config. */
  counts?: boolean;
}) {
  const fixed = useMemo(
    () => (counts ? null : resultItems(model)),
    [model, counts]
  );
  const items = counts ? countItems(model, t) : fixed!;
  const meters = Array.from(new Set(model.rows.flatMap((r) => r.meters)));
  return (
    <ul
      className="m-0 flex list-none flex-wrap gap-x-3 gap-y-1 p-0 text-[11px] text-subtle"
      aria-label={counts ? "State at the playhead" : "Legend"}
    >
      {items.map((item) => (
        <li key={item.key} className="m-0 flex items-center gap-1 p-0">
          {item.swatch}
          {item.label}
          {item.count !== undefined && (
            <span className="min-w-[2ch] font-medium tabular-nums text-basis">
              {item.count}
            </span>
          )}
        </li>
      ))}
      {meters.map((m) => (
        <li key={`m-${m}`} className="m-0 flex items-center gap-1 p-0">
          {meterSwatch(m)}
          {METER_LABEL[m]}
        </li>
      ))}
    </ul>
  );
}
