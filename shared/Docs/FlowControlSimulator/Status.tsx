"use client";

import clsx from "clsx";
import { useMemo, type ReactNode } from "react";
import type { SimConfig, SimResult } from "./engine";
import { snapshotAt } from "./derive";
import { FILL, STROKE, SWATCH } from "./styles";

/**
 * One line of counts at the playhead. It doubles as the timeline legend.
 * Which items appear depends only on the config, so the line never changes
 * height while the simulation plays.
 */
export function StatusStrip({
  result,
  cfg,
  t,
}: {
  result: SimResult;
  cfg: SimConfig;
  t: number;
}) {
  const snap = useMemo(() => snapshotAt(result, cfg, t), [result, cfg, t]);
  const count = (r: string) => snap.queue.filter((q) => q.reason === r).length;
  const fnLimit = cfg.concurrency.constraints
    .filter((c) => c.key !== "tenant")
    .map((c) => c.limit - (c.key === "shared" ? c.externalLoad : 0))
    .reduce((a, b) => Math.min(a, b), Number.POSITIVE_INFINITY);
  const keyed =
    cfg.concurrency.constraints.some((c) => c.key === "tenant") ||
    (cfg.throttle.enabled && cfg.throttle.key === "tenant");

  const items: {
    key: string;
    swatch: ReactNode;
    label: string;
    value: ReactNode;
  }[] = [];
  const sw = (cls: string) => (
    <span className={clsx("inline-block h-2.5 w-4 shrink-0 rounded-sm", cls)} />
  );

  if (cfg.debounce.enabled || cfg.batching.enabled) {
    items.push({
      key: "collect",
      swatch: sw(SWATCH.collect),
      label: cfg.batching.enabled ? "Batching" : "Debouncing",
      value: snap.collecting.length,
    });
  }
  items.push({
    key: "concurrency",
    swatch: sw(SWATCH.concurrency),
    label: "Waiting for a slot",
    value: count("concurrency"),
  });
  if (cfg.throttle.enabled) {
    items.push({
      key: "throttle",
      swatch: (
        <svg width="16" height="10" className="shrink-0 rounded-sm" aria-hidden>
          <defs>
            <pattern
              id="fcsim-hatch-strip"
              width="5"
              height="5"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="5"
                className={STROKE.hatch}
                strokeWidth="1.5"
              />
            </pattern>
          </defs>
          <rect width="16" height="10" className={FILL.throttle} />
          <rect width="16" height="10" fill="url(#fcsim-hatch-strip)" />
        </svg>
      ),
      label: "Throttled",
      value: count("throttle"),
    });
  }
  if (!cfg.keyQueues && keyed) {
    items.push({
      key: "backlog",
      swatch: sw(SWATCH.backlog),
      label: "Behind other keys",
      value: count("backlog"),
    });
  }
  items.push({
    key: "run",
    swatch: sw(SWATCH.run),
    label: "Executing",
    value: (
      <>
        {snap.executing.length}
        {Number.isFinite(fnLimit) && (
          <span className="font-normal text-muted">/{fnLimit}</span>
        )}
      </>
    ),
  });
  if (cfg.steps.some((s) => s.kind === "sleep")) {
    items.push({
      key: "sleep",
      swatch: sw(SWATCH.sleep),
      label: "Sleeping",
      value: snap.sleeping.length,
    });
  }
  items.push({
    key: "done",
    swatch: (
      <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-matcha-500" />
    ),
    label: "Completed",
    value: snap.completed,
  });
  if (cfg.rateLimit.enabled || cfg.singleton.enabled) {
    items.push({
      key: "skip",
      swatch: (
        <span className="w-2.5 shrink-0 text-center font-bold leading-none text-ruby-500">
          ✕
        </span>
      ),
      label: "Skipped",
      value: snap.rateLimited + snap.singletonSkipped,
    });
  }
  if (
    (cfg.singleton.enabled && cfg.singleton.mode === "cancel") ||
    cfg.startTimeout.enabled
  ) {
    items.push({
      key: "cancel",
      swatch: (
        <span className="w-2.5 shrink-0 text-center font-bold leading-none text-ruby-500">
          ✕
        </span>
      ),
      label: "Cancelled",
      value: snap.cancelled,
    });
  }

  return (
    <ul
      className="m-0 flex list-none flex-wrap items-center gap-x-4 gap-y-1 p-0 text-[11px] text-muted"
      aria-label="State at the playhead"
    >
      {items.map((i) => (
        <li key={i.key} className="m-0 flex items-center gap-1.5 p-0">
          {i.swatch}
          <span>{i.label}</span>
          <span className="min-w-[2ch] font-medium tabular-nums text-basis">
            {i.value}
          </span>
        </li>
      ))}
    </ul>
  );
}
