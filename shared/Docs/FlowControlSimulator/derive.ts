import {
  gcraAvailable,
  type Segment,
  type SimConfig,
  type SimResult,
  type SimRun,
  type WaitReason,
} from "./engine";

const EPS = 1e-9;

/** Short display name: the event the run handles, e.g. "A3" or "A1+4". */
export function runName(result: SimResult, run: SimRun): string {
  if (run.collect?.kind === "batch") {
    const first = result.events[run.eventIds[0]];
    const extra = run.eventIds.length - 1;
    return extra > 0 ? `${first?.label}+${extra}` : first?.label ?? run.label;
  }
  return result.events[run.triggerEventId]?.label ?? run.label;
}

export type RunState =
  | { kind: "future" }
  | { kind: "collect" }
  | { kind: "wait"; reason: WaitReason; constraint?: number }
  | { kind: "run"; cancelling?: boolean }
  | { kind: "sleep" }
  | { kind: "done"; end: SimRun["end"] };

export function segmentAt(run: SimRun, t: number): Segment | undefined {
  for (const s of run.segments) {
    if (s.from <= t + EPS && t + EPS < s.to) return s;
  }
  return undefined;
}

export function runStateAt(run: SimRun, t: number): RunState {
  const start = run.collect ? run.collect.from : run.createdAt;
  if (start === undefined || t + EPS < start) return { kind: "future" };
  const seg = segmentAt(run, t);
  if (seg) {
    if (seg.kind === "collect") return { kind: "collect" };
    if (seg.kind === "wait")
      return {
        kind: "wait",
        reason: seg.reason || "backlog",
        constraint: seg.constraint,
      };
    if (seg.kind === "run") return { kind: "run", cancelling: seg.cancelling };
    return { kind: "sleep" };
  }
  if (run.endedAt !== undefined && t + EPS >= run.endedAt)
    return { kind: "done", end: run.end };
  if (run.collect && run.createdAt === undefined) return { kind: "collect" };
  return { kind: "done", end: run.end };
}

export interface Snapshot {
  t: number;
  received: number;
  rateLimited: number;
  singletonSkipped: number;
  collecting: {
    run: SimRun;
    kind: "debounce" | "batch";
    events: number;
    startedAt: number;
    firesAt: number;
    timeoutAt?: number;
  }[];
  queue: { run: SimRun; reason: WaitReason; constraint?: number }[];
  executing: { run: SimRun; cancelling?: boolean }[];
  sleeping: SimRun[];
  completed: number;
  cancelled: number;
  skippedRuns: number;
  /** Active singleton holder per key. */
  singleton: { key: string; run?: SimRun }[];
  /** Per constraint, per key: used slots (including external load). */
  slots: { key: string; used: number; limit: number; external: number }[][];
  throttle: { key: string; available: number; capacity: number }[];
  rateLimit: { key: string; available: number; capacity: number }[];
}

export function snapshotAt(
  result: SimResult,
  cfg: SimConfig,
  t: number
): Snapshot {
  const snap: Snapshot = {
    t,
    received: 0,
    rateLimited: 0,
    singletonSkipped: 0,
    collecting: [],
    queue: [],
    executing: [],
    sleeping: [],
    completed: 0,
    cancelled: 0,
    skippedRuns: 0,
    singleton: [],
    slots: [],
    throttle: [],
    rateLimit: [],
  };
  for (const e of result.events) {
    if (e.t > t + EPS) break;
    snap.received++;
    if (e.outcome === "rate-limited") snap.rateLimited++;
  }
  // Singleton skips happen at event time, or at debounce fire time.
  for (const e of result.events) {
    if (e.outcome !== "singleton-skipped") continue;
    const row = e.runId !== undefined ? result.runs[e.runId - 1] : undefined;
    const at = row?.collect ? row.collect.to : e.t;
    if (at <= t + EPS) snap.singletonSkipped++;
  }

  const queueOrder: {
    run: SimRun;
    reason: WaitReason;
    constraint?: number;
    score: number;
  }[] = [];
  for (const run of result.runs) {
    const st = runStateAt(run, t);
    switch (st.kind) {
      case "collect": {
        const c = run.collect!;
        const evs = run.eventIds.filter(
          (id) => result.events[id].t <= t + EPS
        ).length;
        let firesAt = c.to;
        if (c.kind === "debounce") {
          // The fire time known at time t: last event seen + period, capped.
          const seen = run.eventIds
            .map((id) => result.events[id].t)
            .filter((et) => et <= t + EPS);
          const last = seen.length ? seen[seen.length - 1] : c.from;
          firesAt = last + cfg.debounce.period;
          if (cfg.debounce.useTimeout)
            firesAt = Math.min(firesAt, c.from + cfg.debounce.timeout);
        } else {
          firesAt = Math.min(c.to, c.from + cfg.batching.timeout);
        }
        snap.collecting.push({
          run,
          kind: c.kind,
          events: evs,
          startedAt: c.from,
          firesAt,
          timeoutAt:
            c.kind === "debounce"
              ? cfg.debounce.useTimeout
                ? c.from + cfg.debounce.timeout
                : undefined
              : c.from + cfg.batching.timeout,
        });
        break;
      }
      case "wait":
        queueOrder.push({
          run,
          reason: st.reason,
          constraint: st.constraint,
          score: (run.createdAt ?? 0) - run.priority,
        });
        break;
      case "run":
        snap.executing.push({ run, cancelling: st.cancelling });
        break;
      case "sleep":
        snap.sleeping.push(run);
        break;
      case "done":
        if (st.end === "completed") snap.completed++;
        else if (st.end === "cancelled") snap.cancelled++;
        else if (st.end === "skipped") snap.skippedRuns++;
        break;
    }
  }
  queueOrder.sort((a, b) => a.score - b.score || a.run.id - b.run.id);
  snap.queue = queueOrder;

  // Singleton holders.
  if (cfg.singleton.enabled) {
    const keys = cfg.singleton.key === "tenant" ? result.tenants : ["*"];
    for (const key of keys) {
      const hold = result.singletonHolds.find(
        (h) => h.key === key && h.from <= t + EPS && t + EPS < h.to
      );
      snap.singleton.push({
        key,
        run: hold ? result.runs[hold.runId - 1] : undefined,
      });
    }
  }

  // Concurrency slots.
  {
    cfg.concurrency.constraints.forEach((c, i) => {
      const keys =
        c.key === "tenant"
          ? result.tenants
          : [c.key === "shared" ? "shared" : "fn"];
      snap.slots.push(
        keys.map((key) => {
          const used = snap.executing.filter(
            (e) => e.run.concurrencyKeys[i] === key
          ).length;
          const external = c.key === "shared" ? c.externalLoad : 0;
          return { key, used: used + external, limit: c.limit, external };
        })
      );
    });
  }

  if (cfg.throttle.enabled && result.throttle) {
    const keys = cfg.throttle.key === "tenant" ? result.tenants : ["*"];
    snap.throttle = keys.map((key) => ({
      key,
      available: gcraAvailable(result.throttle!, key, t),
      capacity: result.throttle!.capacity,
    }));
  }
  if (cfg.rateLimit.enabled && result.rateLimit) {
    const keys = cfg.rateLimit.key === "tenant" ? result.tenants : ["*"];
    snap.rateLimit = keys.map((key) => ({
      key,
      available: gcraAvailable(result.rateLimit!, key, t),
      capacity: result.rateLimit!.capacity,
    }));
  }
  return snap;
}

export interface TenantStats {
  tenant: string;
  events: number;
  runs: number;
  completed: number;
  skipped: number;
  cancelled: number;
  unfinished: number;
  avgWait: number | null;
  maxWait: number | null;
  avgLatency: number | null;
}

export function tenantStats(result: SimResult): TenantStats[] {
  return result.tenants.map((tenant) => {
    const evs = result.events.filter((e) => e.tenant === tenant);
    const runs = result.runs.filter(
      (r) => r.tenant === tenant && r.createdAt !== undefined
    );
    const waits = runs
      .filter((r) => r.firstStartAt !== undefined)
      .map((r) => (r.firstStartAt as number) - (r.createdAt as number));
    const lat = runs
      .filter((r) => r.end === "completed")
      .map((r) => (r.endedAt as number) - result.events[r.eventIds[0]].t);
    const avg = (xs: number[]) =>
      xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null;
    return {
      tenant,
      events: evs.length,
      runs: runs.length,
      completed: runs.filter((r) => r.end === "completed").length,
      skipped: evs.filter(
        (e) => e.outcome === "rate-limited" || e.outcome === "singleton-skipped"
      ).length,
      cancelled: runs.filter((r) => r.end === "cancelled").length,
      unfinished: runs.filter((r) => r.end === "unfinished").length,
      avgWait: avg(waits),
      maxWait: waits.length ? Math.max(...waits) : null,
      avgLatency: avg(lat),
    };
  });
}

export const WAIT_LABEL: Record<WaitReason, string> = {
  concurrency: "Waiting for a concurrency slot",
  throttle: "Waiting for throttle capacity",
  backlog: "Behind other keys' work",
};

export function niceStep(domain: number, target = 8) {
  const raw = domain / target;
  const steps = [0.5, 1, 2, 5, 10, 15, 20, 30, 60, 120, 300, 600];
  return steps.find((s) => s >= raw) || 600;
}

export function niceDomain(result: SimResult) {
  const lastEvent = result.events.length
    ? result.events[result.events.length - 1].t
    : 0;
  const end = Math.max(result.endTime, lastEvent + 1, 10);
  const step = niceStep(end);
  return Math.ceil((end + step * 0.25) / step) * step;
}

export function fmtT(t: number) {
  if (t >= 60) {
    const m = Math.floor(t / 60);
    const s = t - m * 60;
    return `${m}m${s ? `${Number(s.toFixed(1))}s` : ""}`;
  }
  return `${Number(t.toFixed(t < 10 ? 2 : 1))}s`;
}
