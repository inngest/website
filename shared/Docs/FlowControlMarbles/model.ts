import type {
  GcraSeries,
  SimConfig,
  SimEvent,
  SimResult,
  SimRun,
  WaitReason,
} from "../FlowControlSimulator/engine";
import { fmtT } from "../FlowControlSimulator/derive";

export const EPS = 1e-6;

/** Durations in seconds of real time. Converted to simulated time per diagram. */
const REAL = { pop: 0.22, hold: 0.12, move: 0.45, fade: 0.8 };
/** Events at one instant stack up to this many marbles; the rest show "+N". */
export const MAX_STACK = 4;
/** Above this many events or runs, draw small dots without labels. */
const DENSE_AT = 36;

export type MeterKind = "slots" | "throttle" | "rateLimit" | "batch";

export interface DiagramOptions {
  /** Seconds of simulated time the x axis covers. */
  domain?: number;
  /** Seconds of real time for one pass, used to time the dot movements. */
  realDuration?: number;
  /** Gutter label for the scheduling row. Defaults to the control's name. */
  scheduleLabel?: string;
  queueLabel?: string;
  /** One queue row per tenant. Defaults to the key-queues setting. */
  queueByTenant?: boolean;
  /** Output lanes per tenant. Defaults to on when concurrency is keyed. */
  lanesByTenant?: boolean;
  /** "slot" labels every lane; "runs" labels the first. Defaults by steps. */
  lanes?: "slot" | "runs";
  /** Minimum lanes per group. Defaults to the slot limit in slot mode. */
  minLanes?: number;
  /** Cap on output lanes across all groups; extra runs share one lane. */
  maxLanes?: number;
  tenantNames?: Record<string, string>;
  /** Restrict which meters show. Defaults to every meter that applies. */
  meters?: MeterKind[];
  /** Keep a queue row even when nothing waits. */
  alwaysQueue?: boolean;
}

export interface Meter {
  kind: MeterKind;
  /** The concurrency constraint a slots meter reads. */
  constraint?: number;
  /** The tenant key the meter reads; unset for an unkeyed or shared key. */
  tenant?: string;
  /**
   * Set when a row mixes scopes: a tenant id, "fn" for a function-wide
   * limit, or "shared" for a key shared with other functions.
   */
  label?: string;
}

export interface BandRow {
  kind: "schedule" | "queue";
  /** Tenant id, or "*" for one row shared by every tenant. */
  group: string;
  label: string;
  meters: Meter[];
}

export interface Lane {
  group: string;
  label: string;
  /** Holds every run that didn't fit under the lane cap. */
  overflow?: boolean;
}

export interface Timing {
  pop: number;
  hold: number;
  move: number;
  fade: number;
}

export type StageKind =
  | "input"
  | "lane"
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
  /**
   * For reject and replaced: when the decision happened. For lane and start:
   * the time whose x position the token sits at in the run's lane.
   */
  at?: number;
  /** A reject that happens in the queue row (start timeout). */
  inQueue?: boolean;
}

export interface Token {
  key: string;
  /** The event, for tokens that start on an event row. */
  ev?: SimEvent;
  label: string;
  tenant: string;
  /** Band row indexes, or -1 when the diagram has no such row. */
  schedRow: number;
  queueRow: number;
  stages: Stage[];
}

interface QueueSnapshot {
  t: number;
  order: number[];
}

export interface Model {
  cfg: SimConfig;
  result: SimResult;
  domain: number;
  realDuration: number;
  timing: Timing;
  /** Many events: small dots, no labels. */
  dense: boolean;
  tenants: string[];
  /** Stack position of events that share an instant, by event id. */
  stack: Map<number, { i: number; n: number }>;
  /** Visible stack depth of each event row. */
  rowDepth: number[];
  rows: BandRow[];
  lanes: Lane[];
  laneOf: Map<number, number>;
  /** When a run's first token lands in its lane. */
  landAt: Map<number, number>;
  /** When a cancel was requested for a cancelled run. */
  cancelAt: Map<number, number>;
  /** One per event: its path from the event row into the band and lanes. */
  tokens: Token[];
  /** One per later step that waits for capacity: lane → queue → lane. */
  stepTokens: Token[];
  /** Queue order over time, by queue group. */
  queues: Map<string, QueueSnapshot[]>;
  schedGroup: (tenant: string) => string;
  queueGroup: (tenant: string) => string;
  eventLabel: (ev: SimEvent) => string;
  runLabel: (run: SimRun) => string;
  tenantName: (tenant: string) => string;
}

export function buildModel(
  cfg: SimConfig,
  result: SimResult,
  opts: DiagramOptions = {}
): Model {
  const tenants = result.tenants;
  const multi = tenants.length > 1;
  const lastEvent = result.events.length
    ? result.events[result.events.length - 1].t
    : 0;
  const domain =
    opts.domain ?? Math.ceil(Math.max(result.endTime, lastEvent + 1) + 0.6);
  const realDuration =
    opts.realDuration ?? Math.min(13, Math.max(6, domain * 0.9));
  const speed = domain / realDuration;
  const T: Timing = {
    pop: REAL.pop * speed,
    hold: REAL.hold * speed,
    move: REAL.move * speed,
    fade: REAL.fade * speed,
  };
  const dense =
    result.events.length > DENSE_AT || result.runs.length > DENSE_AT;

  const eventLabel = (ev: SimEvent) => (multi ? ev.label : String(ev.seq));
  const runLabel = (run: SimRun) => {
    if (run.collect?.kind === "batch") {
      const evs = run.eventIds.map((id) => eventLabel(result.events[id]));
      return evs.length <= 3 ? evs.join(" ") : `${evs[0]}+${evs.length - 1}`;
    }
    const trig = result.events[run.triggerEventId];
    return trig ? eventLabel(trig) : run.label;
  };
  const tenantName = (tenant: string) =>
    opts.tenantNames?.[tenant] ?? (multi ? `${tenant} events` : "Events");

  // Band rows ---------------------------------------------------------------
  const sched: [string, boolean][] = [];
  if (cfg.rateLimit.enabled)
    sched.push(["Rate limit", cfg.rateLimit.key === "tenant"]);
  if (cfg.batching.enabled)
    sched.push(["Batch", cfg.batching.key === "tenant"]);
  if (cfg.debounce.enabled)
    sched.push(["Debounce", cfg.debounce.key === "tenant"]);
  if (cfg.singleton.enabled)
    sched.push(["Singleton", cfg.singleton.key === "tenant"]);
  const schedByTenant = multi && sched.some(([, keyed]) => keyed);
  const queueByTenant = multi && (opts.queueByTenant ?? cfg.keyQueues);
  const lanesByTenant =
    multi &&
    (opts.lanesByTenant ??
      cfg.concurrency.constraints.some((c) => c.key === "tenant"));
  const schedGroup = (tenant: string) => (schedByTenant ? tenant : "*");
  const queueGroup = (tenant: string) => (queueByTenant ? tenant : "*");
  const laneGroup = (tenant: string) => (lanesByTenant ? tenant : "*");

  const waited = result.runs.some(
    (r) =>
      r.segments.some((s) => s.kind === "wait") ||
      (r.createdAt !== undefined && r.firstStartAt === undefined)
  );
  const rows: BandRow[] = [];
  const named = (g: string, label: string) =>
    g === "*" ? label : `${g} ${label.toLowerCase()}`;
  if (sched.length) {
    const label =
      opts.scheduleLabel ?? (sched.length === 1 ? sched[0][0] : "Scheduling");
    for (const g of schedByTenant ? tenants : ["*"])
      rows.push({
        kind: "schedule",
        group: g,
        label: named(g, label),
        meters: [],
      });
  }
  if (opts.alwaysQueue || waited || !rows.length) {
    const label = opts.queueLabel ?? "Queue";
    for (const g of queueByTenant ? tenants : ["*"])
      rows.push({
        kind: "queue",
        group: g,
        label: named(g, label),
        meters: [],
      });
  }
  const want = (m: MeterKind) => !opts.meters || opts.meters.includes(m);
  // Every limit gets a meter on each row it gates. A per-tenant limit on a
  // shared row gets one meter per tenant; a function-wide or shared limit on
  // per-tenant rows gets a meter on each. When a row mixes scopes, every
  // meter in it is labeled.
  for (const row of rows) {
    const perTenant = row.group !== "*";
    const keyed = (
      kind: MeterKind,
      tenantKeyed: boolean,
      extra: Partial<Meter> = {}
    ) => {
      if (!tenantKeyed) {
        row.meters.push({
          kind,
          ...extra,
          label: perTenant ? extra.label ?? "fn" : undefined,
        });
      } else if (perTenant) {
        row.meters.push({ kind, ...extra, tenant: row.group });
      } else {
        for (const tn of tenants)
          row.meters.push({
            kind,
            ...extra,
            tenant: tn,
            label: multi ? tn : undefined,
          });
      }
    };
    if (row.kind === "queue") {
      if (want("slots"))
        cfg.concurrency.constraints.forEach((c, i) =>
          keyed("slots", c.key === "tenant", {
            constraint: i,
            label: c.key === "shared" ? "shared" : undefined,
          })
        );
      if (cfg.throttle.enabled && want("throttle"))
        keyed("throttle", cfg.throttle.key === "tenant");
    } else {
      if (cfg.rateLimit.enabled && want("rateLimit"))
        keyed("rateLimit", cfg.rateLimit.key === "tenant");
      if (cfg.batching.enabled && want("batch"))
        keyed("batch", cfg.batching.key === "tenant");
    }
    if (row.meters.some((m) => m.label)) {
      for (const m of row.meters) m.label ??= m.tenant ?? "fn";
    }
  }
  // Keys that don't match the row's scope are only labeled, never dropped:
  // for lanes, a tenant-keyed limit groups lanes by tenant.
  const fits = (tenantKeyed: boolean, g: string) => tenantKeyed === (g !== "*");
  const rowIndex = (kind: BandRow["kind"], group: string) =>
    rows.findIndex((r) => r.kind === kind && r.group === group);

  // Event stacks --------------------------------------------------------------
  const stack = new Map<number, { i: number; n: number }>();
  const rowDepth = tenants.map((tenant) => {
    const byTime = new Map<number, number[]>();
    for (const ev of result.events) {
      if (ev.tenant !== tenant) continue;
      const k = Math.round(ev.t * 1000);
      const ids = byTime.get(k);
      if (ids) ids.push(ev.id);
      else byTime.set(k, [ev.id]);
    }
    let depth = 1;
    byTime.forEach((ids) => {
      ids.forEach((id, i) => stack.set(id, { i, n: ids.length }));
      depth = Math.max(depth, ids.length);
    });
    return Math.min(depth, MAX_STACK);
  });

  // Output lanes: pack runs by their active interval, per group ----------------
  const slotMode =
    (opts.lanes ??
      (cfg.steps.length === 1 && cfg.steps[0].kind === "run"
        ? "slot"
        : "runs")) === "slot";
  const laneGroups = lanesByTenant ? tenants : ["*"];
  const cap = Math.max(
    2,
    Math.floor((opts.maxLanes ?? Number.POSITIVE_INFINITY) / laneGroups.length)
  );
  const laneConstraint = cfg.concurrency.constraints.find((c) =>
    fits(c.key === "tenant", lanesByTenant ? "x" : "*")
  );
  const slotBound = result.runs.some((r) =>
    r.segments.some((x) => x.kind === "wait" && x.reason === "concurrency")
  );
  const laneOf = new Map<number, number>();
  const lanes: Lane[] = [];
  for (const g of laneGroups) {
    const started = result.runs
      .filter((r) => r.firstStartAt !== undefined && laneGroup(r.tenant) === g)
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
    // Show every slot only when slots are the bottleneck; otherwise the
    // empty lanes are noise.
    const wanted =
      opts.minLanes ??
      (slotMode && laneConstraint && slotBound ? laneConstraint.limit : 1);
    const overflow = ends.length > cap;
    const count = overflow
      ? cap
      : Math.min(Math.max(wanted, ends.length, 1), cap);
    const extra = Array.from(local.values()).filter((j) => j >= cap - 1);
    const base = lanes.length;
    const prefix = g === "*" ? "" : `${g} `;
    for (let j = 0; j < count; j++) {
      const isOverflow = overflow && j === count - 1;
      lanes.push({
        group: g,
        overflow: isOverflow,
        label: isOverflow
          ? `+${extra.length} runs`
          : slotMode
          ? `${prefix}${prefix ? "slot" : "Slot"} ${j + 1}`
          : j === 0
          ? `${prefix}${prefix ? "runs" : "Runs"}`
          : "",
      });
    }
    local.forEach((j, id) => laneOf.set(id, base + Math.min(j, count - 1)));
  }

  // When a cancel was requested. Singleton cancels move the lock right away,
  // even if the old run's executing step finishes later.
  const cancelAt = new Map<number, number>();
  for (const r of result.runs) {
    if (r.end !== "cancelled" || r.endedAt === undefined) continue;
    const hold = result.singletonHolds.find((h) => h.runId === r.id);
    cancelAt.set(r.id, hold ? Math.min(hold.to, r.endedAt) : r.endedAt);
  }

  // Tokens: each event's journey from its row into the band and lanes --------
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
            inQueue: true,
          });
        return;
      }
      let ts = tVis;
      if (r.firstStartAt > (r.createdAt ?? r.firstStartAt) + EPS) {
        stages.push({ t: tVis, kind: "queue", runId: r.id });
        ts = Math.max(r.firstStartAt, tVis + T.move);
      }
      stages.push({ t: ts, kind: "start", runId: r.id, at: r.firstStartAt });
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
        const next =
          result.events[run.eventIds[run.eventIds.indexOf(ev.id) + 1]];
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
    return {
      key: `e${ev.id}`,
      ev,
      label: eventLabel(ev),
      tenant: ev.tenant,
      schedRow: rowIndex("schedule", schedGroup(ev.tenant)),
      queueRow: rowIndex("queue", queueGroup(ev.tenant)),
      stages,
    };
  });

  // Later steps that wait for capacity go back to the queue, then return.
  const stepTokens: Token[] = [];
  for (const r of result.runs) {
    if (r.firstStartAt === undefined) continue;
    r.segments.forEach((seg, i) => {
      if (seg.kind !== "wait" || seg.from < r.firstStartAt! - EPS) return;
      if (seg.to - seg.from < EPS) return;
      const stages: Stage[] = [
        { t: seg.from, kind: "lane", runId: r.id, at: seg.from },
        { t: seg.from, kind: "queue", runId: r.id },
      ];
      if (r.segments[i + 1]?.kind === "run") {
        stages.push({
          t: Math.max(seg.to, seg.from + T.move),
          kind: "start",
          runId: r.id,
          at: seg.to,
        });
      }
      stepTokens.push({
        key: `s${r.id}-${i}`,
        label: runLabel(r),
        tenant: r.tenant,
        schedRow: rowIndex("schedule", schedGroup(r.tenant)),
        queueRow: rowIndex("queue", queueGroup(r.tenant)),
        stages,
      });
    });
  }

  // Queue order over time, per queue group: every run with a step waiting for
  // capacity, ordered like the scheduler (start time minus priority).
  const queues = new Map<string, QueueSnapshot[]>();
  for (const g of queueByTenant ? tenants : ["*"]) {
    const spans: { runId: number; from: number; to: number; score: number }[] =
      [];
    for (const r of result.runs) {
      if (queueGroup(r.tenant) !== g || r.createdAt === undefined) continue;
      const score = r.createdAt - r.priority;
      if (r.firstStartAt === undefined) {
        spans.push({
          runId: r.id,
          from: r.createdAt,
          to: r.endedAt ?? Number.POSITIVE_INFINITY,
          score,
        });
        continue;
      }
      if (r.firstStartAt > r.createdAt + EPS)
        spans.push({
          runId: r.id,
          from: r.createdAt,
          to: r.firstStartAt,
          score,
        });
      for (const seg of r.segments) {
        if (seg.kind === "wait" && seg.from >= r.firstStartAt - EPS)
          spans.push({ runId: r.id, from: seg.from, to: seg.to, score });
      }
    }
    const times = Array.from(new Set(spans.flatMap((x) => [x.from, x.to])))
      .filter((t) => Number.isFinite(t))
      .sort((a, b) => a - b);
    const snaps: QueueSnapshot[] = [{ t: -1, order: [] }];
    // Sweep: spans sorted by start; keep the active set.
    const byFrom = spans.slice().sort((a, b) => a.from - b.from);
    let k = 0;
    let active: typeof spans = [];
    for (const t of times) {
      while (k < byFrom.length && byFrom[k].from <= t + EPS)
        active.push(byFrom[k++]);
      active = active.filter((x) => t + EPS < x.to);
      snaps.push({
        t,
        order: active
          .slice()
          .sort((a, b) => a.score - b.score || a.runId - b.runId)
          .map((x) => x.runId),
      });
    }
    queues.set(g, snaps);
  }

  return {
    cfg,
    result,
    domain,
    realDuration,
    timing: T,
    dense,
    tenants,
    stack,
    rowDepth,
    rows,
    lanes,
    laneOf,
    landAt,
    cancelAt,
    tokens,
    stepTokens,
    queues,
    schedGroup,
    queueGroup,
    eventLabel,
    runLabel,
    tenantName,
  };
}

// ---------------------------------------------------------------------------
// Queries at time t
// ---------------------------------------------------------------------------

export function queueAt(model: Model, group: string, t: number) {
  const snaps = model.queues.get(group) || [{ t: -1, order: [] }];
  let lo = 0;
  let hi = snaps.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (snaps[mid].t <= t + EPS) lo = mid;
    else hi = mid - 1;
  }
  return { cur: snaps[lo], prev: lo > 0 ? snaps[lo - 1] : undefined };
}

export function waitReasonAt(run: SimRun, t: number): WaitReason {
  for (const s of run.segments) {
    if (s.kind === "wait" && s.from <= t + EPS && t + EPS < s.to)
      return s.reason || "backlog";
  }
  const first = run.segments.find((s) => s.kind === "wait");
  return first?.reason || "backlog";
}

/** Slots in use for a meter's constraint, including other functions' load. */
export function slotsAt(model: Model, meter: Meter, t: number) {
  const c = model.cfg.concurrency.constraints[meter.constraint ?? 0];
  let used = c.key === "shared" ? c.externalLoad : 0;
  for (const r of model.result.runs) {
    if (c.key === "tenant" && r.tenant !== meter.tenant) continue;
    if (
      r.segments.some(
        (s) => s.kind === "run" && s.from <= t + EPS && t + EPS < s.to
      )
    )
      used++;
  }
  return { used, limit: c.limit };
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

/** Debounces and batches collecting in a scheduling group at t, with plans. */
export function collectingAt(model: Model, group: string, t: number) {
  const { cfg, result } = model;
  const out: {
    run: SimRun;
    kind: "debounce" | "batch";
    fireAt: number;
    cap: number;
    count: number;
  }[] = [];
  for (const r of result.runs) {
    const c = r.collect;
    if (!c || model.schedGroup(r.tenant) !== group) continue;
    if (!(c.from <= t + EPS && t + EPS < c.to)) continue;
    if (c.kind === "debounce") {
      let last = c.from;
      for (const x of c.resets) if (x <= t + EPS && x > last) last = x;
      const cap = cfg.debounce.useTimeout
        ? c.from + cfg.debounce.timeout
        : Number.POSITIVE_INFINITY;
      out.push({
        run: r,
        kind: "debounce",
        fireAt: Math.min(last + cfg.debounce.period, cap),
        cap,
        count: 0,
      });
    } else {
      const count = r.eventIds.filter(
        (id) => result.events[id].t <= t + EPS
      ).length;
      const cap = c.from + cfg.batching.timeout;
      out.push({ run: r, kind: "batch", fireAt: cap, cap, count });
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Tooltips
// ---------------------------------------------------------------------------

const WAIT_TEXT: Record<WaitReason, string> = {
  concurrency: "for a concurrency slot",
  throttle: "for throttle capacity",
  backlog: "behind other keys' work",
};

export function eventTip(model: Model, ev: SimEvent) {
  const { result } = model;
  const run = ev.runId !== undefined ? result.runs[ev.runId - 1] : undefined;
  let body: string;
  switch (ev.outcome) {
    case "rate-limited":
      body = "Skipped by the rate limit. No run was created.";
      break;
    case "singleton-skipped":
      body = "Skipped by singleton: another run was active for this key.";
      break;
    case "debounce-superseded":
      body = "Replaced by a later event before the quiet period ended.";
      break;
    case "batched":
      body = run ? `Added to batch ${model.runLabel(run)}.` : "Batched.";
      break;
    case "run":
      body = run ? `Handled by run ${model.runLabel(run)}.` : "Started a run.";
      break;
    default:
      body = "Still waiting when the simulation ended.";
  }
  return { title: `${ev.label} at ${fmtT(ev.t)}`, body };
}

export function runTip(model: Model, run: SimRun) {
  const { result } = model;
  const parts: string[] = [];
  if (run.collect?.kind === "debounce") {
    parts.push(
      `Debounced ${run.eventIds.length} event${
        run.eventIds.length > 1 ? "s" : ""
      }; ran with the last one.`
    );
  } else if (run.collect?.kind === "batch") {
    parts.push(
      `Batch of ${run.eventIds.length}, started by ${
        run.collect.reason === "full" ? "reaching maxSize" : "the timeout"
      }.`
    );
  }
  if (run.createdAt !== undefined && run.firstStartAt !== undefined) {
    const wait = run.firstStartAt - run.createdAt;
    const first = run.segments.find((s) => s.kind === "wait");
    parts.push(
      wait > EPS
        ? `Waited ${fmtT(Number(wait.toFixed(2)))} ${
            WAIT_TEXT[first?.reason || "backlog"]
          }, then started at ${fmtT(run.firstStartAt)}.`
        : `Started at ${fmtT(run.firstStartAt)} without waiting.`
    );
    const later = run.segments
      .filter((s) => s.kind === "wait" && s.from >= run.firstStartAt! - EPS)
      .reduce((sum, s) => sum + (s.to - s.from), 0);
    if (later > EPS)
      parts.push(
        `Later steps waited ${fmtT(Number(later.toFixed(2)))} for capacity.`
      );
  }
  if (run.end === "completed" && run.endedAt !== undefined)
    parts.push(`Completed at ${fmtT(run.endedAt)}.`);
  else if (run.end === "cancelled" && run.endedAt !== undefined)
    parts.push(`${run.endReason ?? "Cancelled"} (${fmtT(run.endedAt)}).`);
  else if (run.end === "unfinished")
    parts.push("Still running when the simulation ended.");
  const trig = result.events[run.triggerEventId];
  return {
    title: `Run ${trig ? trig.label : run.label}`,
    body: parts.join(" "),
  };
}

export const ease = (p: number) =>
  p <= 0 ? 0 : p >= 1 ? 1 : 1 - Math.pow(1 - p, 3);
export const clamp01 = (p: number) => (p < 0 ? 0 : p > 1 ? 1 : p);
