"use client";

import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
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

const MAX_ENTRIES = 1000;

export function Log({
  result,
  t,
  playing,
  selectedRun,
  onSelectRun,
  onSeek,
}: {
  result: SimResult;
  t: number;
  playing: boolean;
  selectedRun: number | null;
  onSelectRun: (id: number | null) => void;
  onSeek: (t: number) => void;
}) {
  const [showEvents, setShowEvents] = useState(false);
  const run = selectedRun !== null ? result.runs[selectedRun - 1] : undefined;
  const listRef = useRef<HTMLOListElement>(null);

  // The whole log in chronological order, from 0s to the end.
  const { entries, total } = useMemo(() => {
    const evIds = new Set(run?.eventIds ?? []);
    const out: SimResult["log"] = [];
    let n = 0;
    for (const e of result.log) {
      if (run) {
        if (
          e.runId !== run.id &&
          !(e.eventId !== undefined && evIds.has(e.eventId))
        )
          continue;
      } else if (!showEvents && e.kind === "event") {
        continue;
      }
      n++;
      if (out.length < MAX_ENTRIES) out.push(e);
    }
    return { entries: out, total: n };
  }, [result, showEvents, run]);

  // Entries after the playhead are dimmed.
  let reached = 0;
  while (reached < entries.length && entries[reached].t <= t + 1e-9) reached++;

  // While playing, keep the latest reached entry in view.
  useEffect(() => {
    if (!playing || !listRef.current) return;
    const list = listRef.current;
    const el = list.querySelector<HTMLElement>(
      `[data-i="${Math.max(0, reached - 1)}"]`
    );
    if (!el) return;
    const top = el.offsetTop; // The list is the offset parent.
    if (
      top < list.scrollTop ||
      top + el.offsetHeight > list.scrollTop + list.clientHeight
    ) {
      list.scrollTop = Math.max(
        0,
        top - list.clientHeight + el.offsetHeight + 8
      );
    }
  }, [reached, playing]);

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
            In order from 0s. Entries after the playhead ({fmtT(t)}) are dimmed.
            Click one to jump to it.
          </span>
        )}
        {!run && (
          <label className="flex shrink-0 items-center gap-1">
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
      <ol
        ref={listRef}
        className="relative m-0 flex max-h-[320px] list-none flex-col overflow-y-auto p-0"
      >
        {entries.length === 0 && (
          <li className="m-0 py-2 text-[11px] text-muted">Nothing happened.</li>
        )}
        {entries.map((e, i) => (
          <li key={i} data-i={i} className="m-0 p-0">
            <button
              type="button"
              onClick={() => {
                onSeek(e.t);
                if (e.runId) onSelectRun(e.runId);
              }}
              className={clsx(
                "flex w-full items-start gap-2 rounded px-1 py-1 text-left text-[11px] leading-snug transition-opacity hover:bg-canvasBase",
                i >= reached && "opacity-40 hover:opacity-100"
              )}
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
        {total > entries.length && (
          <li className="m-0 py-2 text-[11px] text-muted">
            Showing the first {entries.length} of {total} entries.
          </li>
        )}
      </ol>
    </div>
  );
}
