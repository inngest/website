"use client";

import { useMemo } from "react";
import type { SimResult } from "./engine";
import { fmtT, tenantStats } from "./derive";
import { TenantChip } from "./ui";

/** Per-tenant results for the whole simulation (independent of the playhead). */
export function Summary({ result }: { result: SimResult }) {
  const stats = useMemo(() => tenantStats(result), [result]);
  const f = (v: number | null) =>
    v === null ? "–" : fmtT(Number(v.toFixed(2)));
  const cols = [
    "events",
    "runs",
    "completed",
    "skipped",
    "cancelled",
    "avg wait to start",
    "max wait",
    "avg event → done",
  ];
  return (
    <div className="flex flex-col gap-1.5">
      <div className="text-[10px] font-semibold uppercase tracking-wide text-muted">
        Summary
      </div>
      <div className="overflow-x-auto">
        <table className="m-0 w-full border-collapse text-xs tabular-nums">
          <thead>
            <tr className="text-left text-[11px] text-muted">
              <th className="py-1 pr-3 font-medium">tenant</th>
              {cols.map((c) => (
                <th
                  key={c}
                  className="whitespace-nowrap py-1 pl-3 text-right font-medium"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stats.map((s) => (
              <tr key={s.tenant} className="text-basis">
                <td className="py-1 pr-3">
                  <TenantChip id={s.tenant} />
                </td>
                <td className="py-1 pl-3 text-right">{s.events}</td>
                <td className="py-1 pl-3 text-right">{s.runs}</td>
                <td className="py-1 pl-3 text-right">{s.completed}</td>
                <td className="py-1 pl-3 text-right">
                  {s.skipped || <span className="text-muted">0</span>}
                </td>
                <td className="py-1 pl-3 text-right">
                  {s.cancelled || <span className="text-muted">0</span>}
                </td>
                <td className="py-1 pl-3 text-right">{f(s.avgWait)}</td>
                <td className="py-1 pl-3 text-right">{f(s.maxWait)}</td>
                <td className="py-1 pl-3 text-right">{f(s.avgLatency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {result.truncated && (
        <p className="m-0 text-[11px] text-ruby-600 dark:text-ruby-400">
          The simulation stopped at 15 minutes with work still queued.
        </p>
      )}
    </div>
  );
}
