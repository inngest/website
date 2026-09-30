import type {
  GcraSeries,
  Segment,
  SimConfig,
  SimEvent,
  SimResult,
  SimRun,
  WaitReason,
} from "../FlowControlSimulator/engine";
import type { MarbleScenario } from "./scenarios";

export const EPS = 1e-6;

/** Durations in seconds of real time. Converted to simulated time per diagram. */
const REAL = { pop: 0.22, hold: 0.12, move: 0.45, fade: 0.8 };

export interface Timing {
  pop: number;
  hold: number;
  move: number;
  fade: number;
}

export type StageKind =
  | "input"
  | "collect"
  | "queue"
  | "reject"
  | "replaced"
  | "start";

export interface Stage {
  /** When the token begins moving to this stage (simulated seconds). */
  t: number;
  kind: StageKind;
  runId?: number;
  /** For reject and replaced: the simulated time the decision happened. */
  at?: number;
}

export interface Token {
  ev: SimEvent;
  label: string;
  group: string;
  stages: Stage[];
}

export interface Lane {
  group: string;
  label: string;
}

interface QueueSnapshot {
  t: number;
  order: number[];
}

export interface Model {
  scenario: MarbleScenario;
  cfg: SimConfig;
  result: SimResult;
  domain: number;
  /** Seconds of real time for one pass. */
  realDuration: number;
  timing: Timing;
  tenants: string[];
  groups: string[];
  lanes: Lane[];
  laneOf: Map<number, number>;
  /** When a run's first token lands in its lane. */
  landAt: Map<number, number>;
  /** When a cancel was requested for a cancelled run. */
  cancelAt: Map<number, number>;
  tokens: Token[];
  queues: Map<string, QueueSnapshot[]>;
  groupOf: (tenant: string) => string;
  eventLabel: (ev: SimEvent) => string;
  runLabel: (run: SimRun) => string;
  tenantName: (tenant: string) => string;
}

export function buildModel(
  scenario: MarbleScenario,
  result: SimResult
): Model {
  const cfg = scenario.config;
  const tenants = result.tenants;
  const single = tenants.length === 1;
  const lastEvent = result.events.length
    ? result.events[result.events.length - 1].t
    : 0;
  const domain = Math.ceil(Math.max(result.endTime, lastEvent + 1) + 0.6);
  const realDuration = Math.min(13, Math.max(6, domain * 0.9));
  const speed = domain / realDuration;
  const timing: Timing = {
    pop: REAL.pop * speed,
    hold: REAL.hold * speed,
    move: REAL.move * speed,
    fade: REAL.fade * speed,
  };

  const groupOf = (tenant: string) => (scenario.byTenant ? tenant : "*");
  const groups = scenario.byTenant ? tenants : ["*"];
  const eventLabel = (ev: SimEvent) => (single ? String(ev.seq) : ev.label);
  const runLabel = (run: SimRun) => {
    const evs = run.eventIds.map((id) => result.events[id]);
    if (run.collect?.kind === "batch") return evs.map(eventLabel).join("·");
    const trig = result.events[run.triggerEventId];
    return trig ? eventLabel(trig) : run.label;
  };
  const tenantName = (tenant: string) =>
    scenario.tenantNames?.[tenant] ?? (single ? "Events" : `${tenant} events`);

  // Output lanes: pack runs by their active interval, per group.
  const laneOf = new Map<number, number>();
  const lanes: Lane[] = [];
  for (const g of groups) {
    const started = result.runs
      .filter((r) => r.firstStartAt !== undefined && groupOf(r.tenant) === g)
      .sort((a, b) => a.firstStartAt! - b.firstStartAt! || a.id - b.id);
    const ends: number[] = [];
    const local = new Map<number, number>();
    for (const r of started) {
      let j = ends.findIndex((e) => e <= r.firstStartAt! + EPS);
      if (j < 0) {
        j = ends.length;
        ends.push(0);
      }
      ends[j] = r.endedAt ?? domain;
      local.set(r.id, j);
    }
    const count = Math.max(scenario.minLanes ?? 1, ends.length, 1);
    const base = lanes.length;
    for (let j = 0; j < count; j++) {
      const prefix = scenario.byTenant ? `${g} ` : "";
      lanes.push({
        group: g,
        label:
          scenario.lanes === "slot"
            ? `${prefix}${prefix ? "slot" : "Slot"} ${j + 1}`
            : j === 0
            ? `${prefix}${prefix ? "runs" : "Runs"}`
            : "",
      });
    }
    local.forEach((j, id) => laneOf.set(id, base + j));
  }

  // When a cancel was requested. Singleton cancels move the lock right away,
  // even if the old run's executing step finishes later.
  const cancelAt = new Map<number, number>();
  for (const r of result.runs) {
    if (r.end !== "cancelled" || r.endedAt === undefined) continue;
    const hold = result.singletonHolds.find((h) => h.runId === r.id);
    cancelAt.set(r.id, hold ? Math.min(hold.to, r.endedAt) : r.endedAt);
  }

  // Tokens: each event's journey from the event row into the band and lanes.
  const T = timing;
  const landAt = new Map<number, number>();
  const tokens: Token[] = result.events.map((ev) => {
    const stages: Stage[] = [{ t: ev.t, kind: "input" }];
    const t1 = ev.t + T.hold;
    const run = ev.runId !== undefined ? result.runs[ev.runId - 1] : undefined;

    const handoff = (r: SimRun, tVis: number) => {
      if (r.firstStartAt === undefined) {
        if (r.createdAt !== undefined)
          stages.push({ t: tVis, kind: "queue", runId: r.id });
        if (r.endedAt !== undefined && r.end !== "unfinished")
          stages.push({
            t: Math.max(r.endedAt, tVis + T.move),
            kind: "reject",
            at: r.endedAt,
          });
        return;
      }
      let ts = tVis;
      if (r.firstStartAt > (r.createdAt ?? r.firstStartAt) + EPS) {
        stages.push({ t: tVis, kind: "queue", runId: r.id });
        ts = Math.max(r.firstStartAt, tVis + T.move);
      }
      stages.push({ t: ts, kind: "start", runId: r.id });
      landAt.set(r.id, Math.max(landAt.get(r.id) ?? 0, ts + T.move));
    };

    switch (ev.outcome) {
      case "rate-limited":
      case "singleton-skipped":
        if (run?.collect?.kind === "debounce") {
          stages.push({ t: t1, kind: "collect", runId: run.id });
          stages.push({
            t: Math.max(run.collect.to, t1 + T.move),
            kind: "reject",
            at: run.collect.to,
          });
        } else {
          stages.push({ t: t1, kind: "reject", at: ev.t });
        }
        break;
      case "debounce-superseded": {
        if (!run) break;
        stages.push({ t: t1, kind: "collect", runId: run.id });
        const next = result.events[run.eventIds[run.eventIds.indexOf(ev.id) + 1]];
        if (next)
          stages.push({
            t: Math.max(next.t + T.hold, t1 + T.move),
            kind: "replaced",
            at: next.t,
          });
        break;
      }
      default:
        if (!run) break;
        if (run.collect) {
          stages.push({ t: t1, kind: "collect", runId: run.id });
          if (run.createdAt !== undefined)
            handoff(run, Math.max(run.createdAt, t1 + T.move));
        } else {
          handoff(run, t1);
        }
    }
    return { ev, label: eventLabel(ev), group: groupOf(ev.tenant), stages };
  });

  // Queue order over time, per group. Only runs waiting to start are queued;
  // later steps of a run show as part of its lane.
  const queues = new Map<string, QueueSnapshot[]>();
  for (const g of groups) {
    const waiting = result.runs.filter(
      (r) =>
        groupOf(r.tenant) === g &&
        r.createdAt !== undefined &&
        (r.firstStartAt === undefined || r.firstStartAt > r.createdAt + EPS)
    );
    const leave = (r: SimRun) =>
      r.firstStartAt ?? r.endedAt ?? Number.POSITIVE_INFINITY;
    const times = Array.from(
      new Set(waiting.flatMap((r) => [r.createdAt!, leave(r)]))
    )
      .filter((t) => Number.isFinite(t))
      .sort((a, b) => a - b);
    const snaps: QueueSnapshot[] = [{ t: -1, order: [] }];
    for (const t of times) {
      const order = waiting
        .filter((r) => r.createdAt! <= t + EPS && t + EPS < leave(r))
        .sort(
          (a, b) =>
            a.createdAt! - a.priority - (b.createdAt! - b.priority) ||
            a.id - b.id
        )
        .map((r) => r.id);
      snaps.push({ t, order });
    }
    queues.set(g, snaps);
  }

  return {
    scenario,
    cfg,
    result,
    domain,
    realDuration,
    timing,
    tenants,
    groups,
    lanes,
    laneOf,
    landAt,
    cancelAt,
    tokens,
    queues,
    groupOf,
    eventLabel,
    runLabel,
    tenantName,
  };
}

// ---------------------------------------------------------------------------
// Queries at time t
// ---------------------------------------------------------------------------

export function queueAt(model: Model, group: string, t: number) {
  const snaps = model.queues.get(group) || [];
  let k = 0;
  for (let i = snaps.length - 1; i >= 0; i--) {
    if (snaps[i].t <= t + EPS) {
      k = i;
      break;
    }
  }
  return { cur: snaps[k], prev: k > 0 ? snaps[k - 1] : undefined };
}

export function waitReasonAt(run: SimRun, t: number): WaitReason {
  for (const s of run.segments) {
    if (s.kind === "wait" && s.from <= t + EPS && t + EPS < s.to)
      return s.reason || "backlog";
  }
  const first = run.segments.find((s) => s.kind === "wait");
  return first?.reason || "backlog";
}

export function busySlots(model: Model, group: string, t: number) {
  let n = 0;
  for (const r of model.result.runs) {
    if (model.groupOf(r.tenant) !== group) continue;
    if (
      r.segments.some(
        (s: Segment) => s.kind === "run" && s.from <= t + EPS && t + EPS < s.to
      )
    )
      n++;
  }
  return n;
}

/** Fractional GCRA capacity available at t. */
export function gcraUnits(series: GcraSeries, key: string, t: number) {
  const now = t * 1000;
  const hist = series.history[key] || [];
  let tat = now;
  for (let i = hist.length - 1; i >= 0; i--) {
    if (hist[i].t <= now + 1e-6) {
      tat = hist[i].tat;
      break;
    }
  }
  const ahead = Math.max(0, tat - now);
  return Math.max(
    0,
    Math.min(series.capacity, (series.dvtMs - ahead) / series.emissionMs)
  );
}

export function gcraKey(mode: "none" | "tenant", tenant: string) {
  return mode === "tenant" ? tenant : "*";
}

/** The debounce or batch collecting for a group at t, with its plan. */
export function collectingAt(model: Model, group: string, t: number) {
  const { cfg, result } = model;
  for (const r of result.runs) {
    const c = r.collect;
    if (!c || model.groupOf(r.tenant) !== group) continue;
    if (!(c.from <= t + EPS && t + EPS < c.to)) continue;
    if (c.kind === "debounce") {
      const last = Math.max(c.from, ...c.resets.filter((x) => x <= t + EPS));
      const quiet = last + cfg.debounce.period;
      const cap = cfg.debounce.useTimeout
        ? c.from + cfg.debounce.timeout
        : Number.POSITIVE_INFINITY;
      return {
        run: r,
        kind: "debounce" as const,
        fireAt: Math.min(quiet, cap),
        cap,
        count: 0,
      };
    }
    const count = r.eventIds.filter(
      (id) => result.events[id].t <= t + EPS
    ).length;
    return {
      run: r,
      kind: "batch" as const,
      fireAt: c.from + cfg.batching.timeout,
      cap: c.from + cfg.batching.timeout,
      count,
    };
  }
  return null;
}

export const ease = (p: number) =>
  p <= 0 ? 0 : p >= 1 ? 1 : 1 - Math.pow(1 - p, 3);
export const clamp01 = (p: number) => (p < 0 ? 0 : p > 1 ? 1 : p);
