"use client";

import clsx from "clsx";
import { useMemo, useState } from "react";
import type { LogKind, SimResult } from "./engine";
import { fmtT, runName } from "./derive";
import { TenantChip } from "./ui";

const KIND_DOT: Record<LogKind, string> = {
  event: "bg-carbon-400",
  skip: "bg-ruby-500",
  collect: "bg-blush-400",
  queue: "bg-carbon-500",
  wait: "bg-purplehaze-400",
  start: "bg-breeze-500",
  sleep: "bg-carbon-300 dark:bg-carbon-600",
  complete: "bg-matcha-500",
  cancel: "bg-ruby-500",
  info: "bg-carbon-300",
};

/** Log text refers to runs by id ("#3"). Show the same names as the timeline. */
function nameRuns(result: SimResult, text: string) {
  return text.replace(/#(\d+)/g, (m, id) => {
    const run = result.runs[Number(id) - 1];
    return run ? runName(result, run) : m;
  });
}

export function Log({
  result,
  t,
  selectedRun,
  onSelectRun,
  onSeek,
}: {
  result: SimResult;
  t: number;
  selectedRun: number | null;
  onSelectRun: (id: number | null) => void;
  onSeek: (t: number) => void;
}) {
  const [showEvents, setShowEvents] = useState(false);
  const run = selectedRun !== null ? result.runs[selectedRun - 1] : undefined;

  const entries = useMemo(() => {
    const evIds = new Set(run?.eventIds ?? []);
    const out = [];
    for (let i = result.log.length - 1; i >= 0 && out.length < 200; i--) {
      const e = result.log[i];
      if (e.t > t + 1e-9) continue;
      if (run) {
        if (
          e.runId !== run.id &&
          !(e.eventId !== undefined && evIds.has(e.eventId))
        )
          continue;
      } else if (!showEvents && e.kind === "event") {
        continue;
      }
      out.push(e);
    }
    return out;
  }, [result, t, showEvents, run]);

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="flex min-h-[20px] items-center justify-between gap-2 text-[11px] text-muted">
        {run ? (
          <span className="flex items-center gap-1.5">
            <TenantChip id={run.tenant} />
            <span className="font-mono text-basis">{runName(result, run)}</span>
            <span>
              · {run.end === "unfinished" ? "still running" : run.end}
              {run.endReason ? ` · ${run.endReason}` : ""}
            </span>
            <button
              type="button"
              className="ml-1 underline hover:text-basis"
              onClick={() => onSelectRun(null)}
            >
              show all runs
            </button>
          </span>
        ) : (
          <span>
            Newest first, up to {fmtT(t)}. Click an entry to jump to it.
          </span>
        )}
        {!run && (
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={showEvents}
              onChange={(e) => setShowEvents(e.target.checked)}
              className="h-3 w-3"
            />
            arrivals
          </label>
        )}
      </div>
      <ol className="m-0 flex max-h-[260px] list-none flex-col overflow-y-auto p-0">
        {entries.length === 0 && (
          <li className="m-0 py-2 text-[11px] text-muted">
            Nothing yet. Press play or drag the playhead.
          </li>
        )}
        {entries.map((e, i) => (
          <li key={`${e.t}-${i}`} className="m-0 p-0">
            <button
              type="button"
              onClick={() => {
                onSeek(e.t);
                if (e.runId) onSelectRun(e.runId);
              }}
              className="flex w-full items-start gap-2 rounded px-1 py-1 text-left text-[11px] leading-snug hover:bg-canvasBase"
            >
              <span className="w-11 shrink-0 pt-px text-right font-mono tabular-nums text-muted">
                {fmtT(e.t)}
              </span>
              <span
                className={clsx(
                  "mt-1 inline-block h-2 w-2 shrink-0 rounded-full",
                  KIND_DOT[e.kind]
                )}
              />
              {e.tenant && (
                <TenantChip
                  id={e.tenant}
                  className="mt-px !h-3.5 !min-w-[14px] !text-[9px]"
                />
              )}
              <span className="text-subtle">{nameRuns(result, e.text)}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
