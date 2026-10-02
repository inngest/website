"use client";

import { RiPauseFill, RiPlayFill, RiRestartLine } from "@remixicon/react";
import clsx from "clsx";
import { useMemo } from "react";
import {
  limitAt,
  simulate,
  type SimConfig,
} from "../FlowControlSimulator/engine";
import { baseConfig } from "../FlowControlSimulator/presets";
import { MarbleDiagram } from "./Diagram";
import { ControlButton, useLoop } from "./FlowControlMarbles";
import { MarbleLegend } from "./Legend";
import { buildModel } from "./model";

/** Scaled down from the docs example: a plan limit of 2 instead of 100. */
const PLAN_LIMIT = 2;
const PEAK = PLAN_LIMIT * 3;
/** Minutes on the axis. The burst is on from 25% to 75% of the way in. */
const DOMAIN = 20;
const BURST_ON = DOMAIN * 0.25;
const BURST_OFF = DOMAIN * 0.75;
const STEP_MINUTES = 2;
/** A step arrives this often: twice as fast as the plan limit can run them. */
const EVERY_MINUTES = 0.5;

/**
 * Bursty concurrency is the step concurrency rule with the account limit
 * raised to 3x while the burst is on. The engine runs in seconds; the
 * diagram labels them as minutes.
 */
function config(): SimConfig {
  const c = baseConfig();
  c.tenants = [{ id: "I", priority: 0 }];
  c.steps = [{ kind: "run", duration: STEP_MINUTES }];
  c.manual = Array.from(
    { length: Math.round(DOMAIN / EVERY_MINUTES) },
    (_, i) => ({ t: i * EVERY_MINUTES, tenant: "I" })
  );
  c.concurrency = {
    enabled: true,
    constraints: [
      {
        limit: PLAN_LIMIT,
        key: "none",
        scope: "fn",
        externalLoad: 0,
        limitChanges: [
          { at: BURST_ON, limit: PEAK },
          { at: BURST_OFF, limit: PLAN_LIMIT },
        ],
      },
    ],
  };
  // Stop at the end of the axis, with the backlog still building.
  c.until = DOMAIN;
  return c;
}

const fmtMin = (m: number) => `${Number(m.toFixed(1))}m`;

const CAPTION = `Scaled down: the plan limit here is ${PLAN_LIMIT} concurrency slots, so a burst can reach ${PEAK}. A step arrives every ${
  EVERY_MINUTES * 60
} seconds, twice as fast as ${PLAN_LIMIT} slots can run them, so a backlog builds. When the burst turns on at ${fmtMin(
  BURST_ON
)}, the backlog starts at once and new steps run without waiting. When it turns off at ${fmtMin(
  BURST_OFF
)}, the limit drops back to ${PLAN_LIMIT}: running steps finish, and the backlog builds again.`;

/**
 * The bursty concurrency page's simulator: steady work above the plan limit,
 * with the ceiling raised to 3x for the middle half of the timeline.
 */
export function BurstyConcurrencySimulator() {
  const sim = useMemo(() => {
    const cfg = config();
    const result = simulate(cfg);
    const model = buildModel(cfg, result, {
      domain: DOMAIN,
      realDuration: 16,
      unit: "m",
      lanes: "slot",
      minLanes: PEAK,
      laneLabels: Array.from({ length: PEAK }, (_, i) =>
        i < PLAN_LIMIT ? `Slot ${i + 1}` : `Burst ${i - PLAN_LIMIT + 1}`
      ),
      burst: { from: PLAN_LIMIT, on: BURST_ON, off: BURST_OFF },
      meters: ["slots"],
      alwaysQueue: true,
      tenantNames: { I: "Steps" },
    });
    return { model, constraint: cfg.concurrency.constraints[0] };
  }, []);

  const { model, constraint } = sim;
  const { rootRef, t, playing, setPlaying, seek, toggle, replay } = useLoop(
    model.domain,
    model.realDuration
  );
  const on = limitAt(constraint, t) > PLAN_LIMIT;

  return (
    <figure
      ref={rootRef}
      className="not-prose my-8 flex flex-col gap-3 rounded-xl bg-canvasSubtle p-3 leading-normal text-basis sm:p-4"
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span
          className={clsx(
            "inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium ring-1 ring-inset transition-colors",
            on
              ? "bg-breeze-100 text-breeze-900 ring-breeze-300 dark:bg-breeze-500/15 dark:text-breeze-100 dark:ring-breeze-500/40"
              : "bg-canvasBase text-muted ring-carbon-200 dark:ring-carbon-700"
          )}
        >
          <span
            aria-hidden
            className={clsx(
              "h-1.5 w-1.5 rounded-full",
              on ? "bg-breeze-500" : "bg-carbon-400 dark:bg-carbon-500"
            )}
          />
          {on
            ? `Burst on: up to ${PEAK} slots`
            : `Burst off: ${PLAN_LIMIT} slots`}
        </span>
        <div className="ml-auto flex items-center gap-0.5">
          <span
            className="mr-1 w-10 text-right font-mono text-[11px] tabular-nums text-muted"
            aria-hidden
          >
            {`${t.toFixed(1)}m`}
          </span>
          <ControlButton label={playing ? "Pause" : "Play"} onClick={toggle}>
            {playing ? (
              <RiPauseFill className="h-3.5 w-3.5" />
            ) : (
              <RiPlayFill className="h-3.5 w-3.5" />
            )}
          </ControlButton>
          <ControlButton label="Replay" onClick={replay}>
            <RiRestartLine className="h-3.5 w-3.5" />
          </ControlButton>
        </div>
      </div>

      <div className="rounded-lg bg-canvasBase px-2 py-2 sm:px-3">
        <MarbleDiagram
          model={model}
          t={t}
          label={CAPTION}
          onSeek={seek}
          onScrubStart={() => setPlaying(false)}
        />
      </div>

      <figcaption className="flex flex-col gap-2">
        <MarbleLegend model={model} />
        <p className="m-0 text-xs leading-relaxed text-subtle">{CAPTION}</p>
      </figcaption>
    </figure>
  );
}
