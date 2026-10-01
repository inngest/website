/**
 * Flow control simulator engine.
 *
 * A deterministic, tick-based model of how Inngest applies flow control to
 * events, runs, and steps. It follows the documented ordering:
 *
 *   1. Before scheduling: rate limit (skip) or batching (collect)
 *   2. When scheduling:   debounce, then singleton
 *   3. When executing:    throttle (run starts) and concurrency (steps)
 *
 * The model mirrors the open-source implementation where it matters for
 * intuition (GCRA for rate limits and throttles, queue scores based on the
 * run's start time minus its priority factor, slots held only while a step
 * executes). It is intentionally simplified elsewhere; see MODEL_NOTES.
 */

export const TICK_MS = 50;
export const MAX_SIM_MS = 15 * 60 * 1000;
export const MAX_EVENTS = 500;
/** Items the scheduler scans per pass when key queues are disabled. */
export const PEEK_SIZE = 8;

export const MODEL_NOTES = [
  "Time advances in 50 ms ticks. Durations are rounded to the nearest tick.",
  "Rate limiting uses GCRA with a burst of floor(limit / 10): that many + 1 events pass at once, then one every period / limit.",
  "Throttling uses GCRA: limit + burst runs can start at once, then one every period / limit. It applies only to a run's first step.",
  "Queue order uses the run's scheduled time minus its priority factor, so later steps of older runs sort ahead of newer runs.",
  `Without key queues, the scheduler scans ${PEEK_SIZE} items from the head of the function's queue per pass. Blocked items at the head can delay other keys.`,
  "A function-level concurrency limit (no key) stops the scan when full, because the queue is FIFO.",
  "Debounce fires exactly at the end of the quiet period; the real service adds about a second of scheduling delay.",
  "Retries, failures, step overhead, and network latency are not modeled.",
];

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

export type KeyMode = "none" | "tenant";
export type ConcurrencyKey = "none" | "tenant" | "shared";
export type Scope = "fn" | "env" | "account";

export interface StepDef {
  kind: "run" | "sleep";
  /** Seconds. */
  duration: number;
}

export interface Tenant {
  id: string;
  /** Priority factor in seconds, used when priority is enabled. */
  priority: number;
}

export type TrafficSource =
  | {
      id: string;
      tenant: string;
      kind: "burst";
      at: number;
      count: number;
      /** Seconds over which the burst is spread evenly. 0 = same instant. */
      spread: number;
    }
  | {
      id: string;
      tenant: string;
      kind: "steady";
      from: number;
      to: number;
      every: number;
    }
  | {
      id: string;
      tenant: string;
      kind: "random";
      from: number;
      to: number;
      /** Events per second. */
      rate: number;
      seed: number;
    };

export interface ManualEvent {
  t: number;
  tenant: string;
}

export interface ConcurrencyConstraint {
  limit: number;
  key: ConcurrencyKey;
  scope: Scope;
  /** Slots of a shared key held by other functions (shared key only). */
  externalLoad: number;
}

export interface SimConfig {
  steps: StepDef[];
  tenants: Tenant[];
  traffic: TrafficSource[];
  manual: ManualEvent[];
  rateLimit: { enabled: boolean; limit: number; period: number; key: KeyMode };
  batching: {
    enabled: boolean;
    maxSize: number;
    timeout: number;
    key: KeyMode;
  };
  debounce: {
    enabled: boolean;
    period: number;
    useTimeout: boolean;
    timeout: number;
    key: KeyMode;
  };
  singleton: {
    enabled: boolean;
    mode: "skip" | "cancel";
    key: "tenant" | "global";
  };
  priority: { enabled: boolean };
  throttle: {
    enabled: boolean;
    limit: number;
    period: number;
    burst: number;
    key: KeyMode;
  };
  concurrency: { enabled: boolean; constraints: ConcurrencyConstraint[] };
  startTimeout: { enabled: boolean; seconds: number };
  keyQueues: boolean;
}

export type ControlId =
  | "rateLimit"
  | "batching"
  | "debounce"
  | "singleton"
  | "priority"
  | "throttle"
  | "concurrency"
  | "startTimeout";

export const CONTROL_LABELS: Record<ControlId, string> = {
  rateLimit: "Rate limiting",
  batching: "Batching",
  debounce: "Debounce",
  singleton: "Singleton",
  priority: "Priority",
  throttle: "Throttling",
  concurrency: "Step concurrency",
  startTimeout: "Start timeout",
};

/** Controls that cannot be combined with batching on the same function. */
export const BATCH_INCOMPATIBLE: ControlId[] = [
  "rateLimit",
  "debounce",
  "singleton",
  "priority",
];

/** Returns the reason a control can't be enabled with the current config. */
export function conflictFor(cfg: SimConfig, id: ControlId): string | null {
  if (id === "batching") {
    const on = BATCH_INCOMPATIBLE.filter((c) => cfg[c].enabled);
    if (on.length) {
      return `Batching can't be combined with ${listJoin(
        on.map((c) => CONTROL_LABELS[c].toLowerCase())
      )}.`;
    }
  }
  if (BATCH_INCOMPATIBLE.includes(id) && cfg.batching.enabled) {
    return `${CONTROL_LABELS[id]} can't be combined with batching.`;
  }
  return null;
}

function listJoin(items: string[]) {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} or ${items[items.length - 1]}`;
}

export function validate(cfg: SimConfig): string[] {
  const errors: string[] = [];
  if (cfg.batching.enabled) {
    for (const c of BATCH_INCOMPATIBLE) {
      if (cfg[c].enabled) {
        errors.push(`${CONTROL_LABELS[c]} can't be combined with batching.`);
      }
    }
  }
  if (!cfg.steps.length) errors.push("Add at least one step.");
  if (!cfg.steps.some((s) => s.kind === "run")) {
    errors.push("Add at least one step.run().");
  }
  {
    const cs = cfg.concurrency.constraints;
    if (cs.length < 1 || cs.length > 2) {
      errors.push("A function can have one or two concurrency constraints.");
    }
    cs.forEach((c, i) => {
      if (c.scope !== "fn" && c.key === "none") {
        errors.push(
          `Concurrency ${i + 1}: env and account scopes require a key.`
        );
      }
      if (c.key === "shared" && c.externalLoad >= c.limit) {
        errors.push(
          `Concurrency ${
            i + 1
          }: other functions use every slot, so nothing can run.`
        );
      }
    });
  }
  return errors;
}

/** Non-fatal notes about how the chosen controls interact. */
export function interactionNotes(cfg: SimConfig): string[] {
  const notes: string[] = [];
  if (cfg.priority.enabled && cfg.tenants.every((t) => t.priority === 0)) {
    notes.push(
      "Every tenant has a priority factor of 0, so queue order is unchanged."
    );
  }
  if (
    cfg.batching.enabled &&
    cfg.concurrency.constraints.some((c) => c.key === "tenant") &&
    cfg.batching.key === "none"
  ) {
    notes.push(
      "Concurrency keys for a batch come from the first event. Unkeyed batches can mix tenants, so a batch uses the first event's tenant slot."
    );
  }
  if (cfg.debounce.enabled && cfg.rateLimit.enabled) {
    notes.push(
      "Rate limiting runs before debounce, so skipped events never reset the debounce period."
    );
  }
  if (
    cfg.throttle.enabled &&
    cfg.steps.filter((s) => s.kind === "run").length > 1
  ) {
    notes.push(
      "Throttling limits run starts only. Later steps are not throttled."
    );
  }
  return notes;
}

// ---------------------------------------------------------------------------
// Result types
// ---------------------------------------------------------------------------

export type WaitReason = "backlog" | "throttle" | "concurrency";

export interface Segment {
  kind: "collect" | "wait" | "run" | "sleep";
  /** Seconds. */
  from: number;
  to: number;
  step?: number;
  reason?: WaitReason;
  /** Concurrency constraint index when reason is "concurrency". */
  constraint?: number;
  /** A singleton cancel was requested while this step executed. */
  cancelling?: boolean;
}

export type EventOutcome =
  | "run"
  | "rate-limited"
  | "debounce-superseded"
  | "batched"
  | "singleton-skipped"
  | "pending";

export interface SimEvent {
  id: number;
  label: string;
  t: number;
  tenant: string;
  seq: number;
  manual: boolean;
  manualIndex?: number;
  outcome: EventOutcome;
  runId?: number;
}

export type RunEnd = "completed" | "cancelled" | "skipped" | "unfinished";

export interface SimRun {
  id: number;
  label: string;
  /** Tenant used for keys. For a batch, the first event's tenant. */
  tenant: string;
  eventIds: number[];
  /** The event the handler receives (debounce: the last one). */
  triggerEventId: number;
  collect?: {
    kind: "debounce" | "batch";
    from: number;
    to: number;
    reason: "period" | "timeout" | "full";
    /** Times the debounce period restarted. */
    resets: number[];
  };
  /** When the run entered the queue. Undefined if it never did. */
  createdAt?: number;
  firstStartAt?: number;
  endedAt?: number;
  end: RunEnd;
  endReason?: string;
  priority: number;
  segments: Segment[];
  concurrencyKeys: string[];
}

export interface GcraSeries {
  /** Milliseconds per admitted unit. */
  emissionMs: number;
  /** Delay variation tolerance: how far TAT may run ahead of now. */
  dvtMs: number;
  capacity: number;
  /** TAT changes by key, in ms. */
  history: Record<string, { t: number; tat: number }[]>;
}

export type LogKind =
  | "event"
  | "skip"
  | "collect"
  | "queue"
  | "wait"
  | "start"
  | "sleep"
  | "complete"
  | "cancel"
  | "info";

export interface LogEntry {
  t: number;
  kind: LogKind;
  text: string;
  runId?: number;
  eventId?: number;
  tenant?: string;
}

export interface SimResult {
  errors: string[];
  events: SimEvent[];
  runs: SimRun[];
  log: LogEntry[];
  /** Seconds. When all work finished (or the simulation cap). */
  endTime: number;
  truncated: boolean;
  throttle?: GcraSeries;
  rateLimit?: GcraSeries;
  /** Which run held the singleton lock for each key, over time (seconds). */
  singletonHolds: { key: string; runId: number; from: number; to: number }[];
  tenants: string[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const toMs = (s: number) =>
  Math.max(TICK_MS, Math.round((s * 1000) / TICK_MS) * TICK_MS);
const qMs = (s: number) =>
  Math.max(0, Math.round((s * 1000) / TICK_MS) * TICK_MS);
const sec = (ms: number) => ms / 1000;

export function fmtSeconds(s: number): string {
  if (s >= 3600 && s % 3600 === 0) return `${s / 3600}h`;
  if (s >= 60 && s % 60 === 0) return `${s / 60}m`;
  if (s >= 60) return `${Math.floor(s / 60)}m${Math.round(s % 60)}s`;
  return `${Number(s.toFixed(2))}s`;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Deterministic event list for a config, sorted by time. */
export function generateEvents(cfg: SimConfig): SimEvent[] {
  const raw: {
    t: number;
    tenant: string;
    order: number;
    manualIndex?: number;
  }[] = [];
  let order = 0;
  const tenantIds = new Set(cfg.tenants.map((t) => t.id));
  for (const src of cfg.traffic) {
    if (!tenantIds.has(src.tenant)) continue;
    if (src.kind === "burst") {
      const n = Math.max(0, Math.floor(src.count));
      for (let i = 0; i < n; i++) {
        const t = n > 1 ? src.at + (src.spread * i) / (n - 1) : src.at;
        raw.push({ t: qMs(t), tenant: src.tenant, order: order++ });
      }
    } else if (src.kind === "steady") {
      const every = Math.max(0.05, src.every);
      for (let t = src.from; t <= src.to + 1e-9; t += every) {
        raw.push({ t: qMs(t), tenant: src.tenant, order: order++ });
        if (raw.length > MAX_EVENTS * 2) break;
      }
    } else {
      const rand = mulberry32(src.seed || 1);
      const rate = Math.max(0.001, src.rate);
      let t = src.from;
      for (;;) {
        t += -Math.log(1 - rand()) / rate;
        if (t > src.to) break;
        raw.push({ t: qMs(t), tenant: src.tenant, order: order++ });
        if (raw.length > MAX_EVENTS * 2) break;
      }
    }
  }
  cfg.manual.forEach((m, i) => {
    if (!tenantIds.has(m.tenant)) return;
    raw.push({ t: qMs(m.t), tenant: m.tenant, order: order++, manualIndex: i });
  });
  raw.sort((a, b) => a.t - b.t || a.order - b.order);
  const seq: Record<string, number> = {};
  return raw.slice(0, MAX_EVENTS).map((r, id) => {
    seq[r.tenant] = (seq[r.tenant] || 0) + 1;
    return {
      id,
      label: `${r.tenant}${seq[r.tenant]}`,
      t: r.t / 1000,
      tenant: r.tenant,
      seq: seq[r.tenant],
      manual: r.manualIndex !== undefined,
      manualIndex: r.manualIndex,
      outcome: "pending" as EventOutcome,
    };
  });
}

class Gcra {
  tat = new Map<string, number>();
  history: Record<string, { t: number; tat: number }[]> = {};
  emission: number;
  dvt: number;
  constructor(emission: number, dvt: number) {
    this.emission = emission;
    this.dvt = dvt;
  }
  private cur(key: string, now: number) {
    return Math.max(this.tat.get(key) ?? now, now);
  }
  allowed(key: string, now: number) {
    return this.cur(key, now) + this.emission - this.dvt <= now + 1e-6;
  }
  consume(key: string, now: number) {
    const next = this.cur(key, now) + this.emission;
    this.tat.set(key, next);
    (this.history[key] ||= []).push({ t: now, tat: next });
  }
  /** When the next unit would be admitted. */
  nextAt(key: string, now: number) {
    return Math.max(now, this.cur(key, now) + this.emission - this.dvt);
  }
}

/** Units available at time t for a recorded GCRA series. */
export function gcraAvailable(series: GcraSeries, key: string, tSec: number) {
  const now = tSec * 1000;
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
    Math.min(
      series.capacity,
      Math.floor((series.dvtMs - ahead) / series.emissionMs + 1e-6)
    )
  );
}

// ---------------------------------------------------------------------------
// Simulation
// ---------------------------------------------------------------------------

interface QItem {
  runId: number;
  step: number;
  score: number;
  isStart: boolean;
  /** Last recorded wait reason, to log transitions only. */
  lastReason?: string;
}

interface Executing {
  runId: number;
  step: number;
  endAt: number;
  keys: string[];
}

interface Sleeping {
  runId: number;
  wakeAt: number;
  next: number;
}

export function simulate(cfg: SimConfig): SimResult {
  const errors = validate(cfg);
  const tenants = cfg.tenants.map((t) => t.id);
  if (errors.length) {
    return {
      errors,
      events: [],
      runs: [],
      log: [],
      endTime: 30,
      truncated: false,
      singletonHolds: [],
      tenants,
    };
  }

  const events = generateEvents(cfg);
  const runs: SimRun[] = [];
  const log: LogEntry[] = [];
  const steps = cfg.steps.map((s) => ({ kind: s.kind, ms: toMs(s.duration) }));
  const tenantPriority = new Map(cfg.tenants.map((t) => [t.id, t.priority]));

  const L = (
    t: number,
    kind: LogKind,
    text: string,
    extra: Partial<LogEntry> = {}
  ) => log.push({ t: sec(t), kind, text, ...extra });

  // Flow control state -------------------------------------------------------
  const rl = cfg.rateLimit.enabled
    ? (() => {
        const e = toMs(cfg.rateLimit.period) / Math.max(1, cfg.rateLimit.limit);
        const burst = Math.floor(cfg.rateLimit.limit / 10);
        return new Gcra(e, e * (burst + 1));
      })()
    : null;
  const th = cfg.throttle.enabled
    ? (() => {
        const lim = Math.max(1, cfg.throttle.limit);
        const e = toMs(cfg.throttle.period) / lim;
        return new Gcra(e, e * (lim + Math.max(0, cfg.throttle.burst)));
      })()
    : null;
  // Step concurrency always applies: every function has at least one limit.
  const constraints = cfg.concurrency.constraints;
  const active = constraints.map(() => new Map<string, number>());

  const debounces = new Map<
    string,
    {
      row: SimRun;
      firstAt: number;
      fireAt: number;
      latest: SimEvent;
      capped: boolean;
    }
  >();
  const batches = new Map<
    string,
    { row: SimRun; openedAt: number; deadline: number }
  >();
  const singletonLock = new Map<string, number>();
  const singletonHolds: SimResult["singletonHolds"] = [];
  const releaseHold = (key: string, t: number) => {
    for (let i = singletonHolds.length - 1; i >= 0; i--) {
      const h = singletonHolds[i];
      if (h.key === key && h.to === Number.POSITIVE_INFINITY) {
        h.to = sec(t);
        return;
      }
    }
  };

  let queue: QItem[] = [];
  let executing: Executing[] = [];
  let sleeping: Sleeping[] = [];

  const keyOf = (mode: KeyMode, tenant: string) =>
    mode === "tenant" ? tenant : "*";
  const cKey = (i: number, tenant: string) => {
    const c = constraints[i];
    return c.key === "tenant" ? tenant : c.key === "shared" ? "shared" : "fn";
  };
  const cUsed = (i: number, key: string) =>
    (active[i].get(key) || 0) +
    (constraints[i].key === "shared" ? constraints[i].externalLoad : 0);
  const describeKey = (i: number, key: string) =>
    constraints[i].key === "tenant"
      ? `key ${key}`
      : constraints[i].key === "shared"
      ? `shared ${constraints[i].scope} key`
      : "the function";

  const newRow = (tenant: string, eventIds: number[]): SimRun => {
    const row: SimRun = {
      id: runs.length + 1,
      label: `#${runs.length + 1}`,
      tenant,
      eventIds,
      triggerEventId: eventIds[eventIds.length - 1],
      end: "unfinished",
      priority: 0,
      segments: [],
      concurrencyKeys: [],
    };
    runs.push(row);
    return row;
  };

  const openSeg = (row: SimRun, seg: Omit<Segment, "to"> & { to?: number }) => {
    row.segments.push({
      ...seg,
      to: seg.to ?? Number.POSITIVE_INFINITY,
    } as Segment);
  };
  const closeSeg = (row: SimRun, t: number) => {
    const s = row.segments[row.segments.length - 1];
    if (s && s.to === Number.POSITIVE_INFINITY) {
      s.to = sec(t);
      if (s.to <= s.from) row.segments.pop();
    }
  };

  const endRun = (row: SimRun, t: number, end: RunEnd, reason?: string) => {
    closeSeg(row, t);
    row.end = end;
    row.endReason = reason;
    row.endedAt = sec(t);
    const sk = singletonKeyOf(row.tenant);
    if (sk !== null && singletonLock.get(sk) === row.id) {
      singletonLock.delete(sk);
      releaseHold(sk, t);
    }
  };

  const singletonKeyOf = (tenant: string) =>
    cfg.singleton.enabled
      ? cfg.singleton.key === "tenant"
        ? tenant
        : "*"
      : null;

  const isActive = (runId: number) => {
    const r = runs[runId - 1];
    return r && r.createdAt !== undefined && r.end === "unfinished";
  };

  const enqueue = (row: SimRun, step: number, t: number) => {
    const item: QItem = {
      runId: row.id,
      step,
      score: Math.round((row.createdAt as number) * 1000) - row.priority * 1000,
      isStart: row.firstStartAt === undefined,
    };
    // Binary insert by (score, runId).
    let lo = 0;
    let hi = queue.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      const q = queue[mid];
      if (
        q.score < item.score ||
        (q.score === item.score && q.runId < item.runId)
      )
        lo = mid + 1;
      else hi = mid;
    }
    queue.splice(lo, 0, item);
    openSeg(row, { kind: "wait", from: sec(t), reason: "backlog", step });
  };

  /** Put a new run into the queue (after all scheduling controls passed). */
  const schedule = (row: SimRun, t: number) => {
    row.createdAt = sec(t);
    row.priority = cfg.priority.enabled
      ? Math.max(
          -600,
          Math.min(600, Math.round(tenantPriority.get(row.tenant) || 0))
        )
      : 0;
    row.concurrencyKeys = constraints.map((_, i) => cKey(i, row.tenant));
    const trig = events[row.triggerEventId];
    L(
      t,
      "queue",
      `Run ${row.label} queued${
        row.priority
          ? ` with priority ${row.priority > 0 ? "+" : ""}${row.priority}s`
          : ""
      }.`,
      { runId: row.id, tenant: row.tenant }
    );
    enqueue(row, 0, t);
  };

  const cancelRun = (row: SimRun, t: number, reason: string) => {
    const qi = queue.findIndex((q) => q.runId === row.id);
    if (qi >= 0) {
      queue.splice(qi, 1);
      endRun(row, t, "cancelled", reason);
      return "now";
    }
    const si = sleeping.findIndex((s) => s.runId === row.id);
    if (si >= 0) {
      sleeping.splice(si, 1);
      endRun(row, t, "cancelled", reason);
      return "now";
    }
    const ex = executing.find((e) => e.runId === row.id);
    if (ex) {
      (row as SimRun & { cancelReason?: string }).cancelReason = reason;
      const seg = row.segments[row.segments.length - 1];
      if (seg) seg.cancelling = true;
      return "after-step";
    }
    return "none";
  };

  /** Singleton check for a run that is about to be scheduled. */
  const admitSingleton = (row: SimRun, t: number): boolean => {
    const sk = singletonKeyOf(row.tenant);
    if (sk === null) return true;
    const holder = singletonLock.get(sk);
    const trig = events[row.triggerEventId];
    if (holder !== undefined && isActive(holder)) {
      const h = runs[holder - 1];
      if (cfg.singleton.mode === "skip") {
        L(
          t,
          "skip",
          `${trig.label} skipped: run ${h.label} is still active for ${
            sk === "*" ? "the function" : `key ${sk}`
          } (singleton skip).`,
          { eventId: trig.id, tenant: row.tenant }
        );
        return false;
      }
      if (Math.round((h.createdAt as number) * 1000) === t) {
        // Cancel mode releases the old lock, cancels, then re-acquires. Two
        // events in the same instant race and one of them is skipped.
        L(
          t,
          "skip",
          `${trig.label} skipped: arrived while run ${h.label} was taking the singleton lock (rapid burst in cancel mode).`,
          { eventId: trig.id, tenant: row.tenant }
        );
        return false;
      }
      const when = cancelRun(
        h,
        t,
        `Cancelled by singleton: replaced by ${trig.label}`
      );
      L(
        t,
        "cancel",
        when === "after-step"
          ? `${trig.label} cancels run ${h.label} (singleton cancel). Its executing step finishes first.`
          : `${trig.label} cancels run ${h.label} (singleton cancel).`,
        { runId: h.id, tenant: h.tenant }
      );
    }
    releaseHold(sk, t);
    singletonLock.set(sk, row.id);
    singletonHolds.push({
      key: sk,
      runId: row.id,
      from: sec(t),
      to: Number.POSITIVE_INFINITY,
    });
    return true;
  };

  // Advance a run to step index `idx` at time t.
  const advance = (row: SimRun, idx: number, t: number) => {
    if (idx >= steps.length) {
      endRun(row, t, "completed");
      L(t, "complete", `Run ${row.label} completed.`, {
        runId: row.id,
        tenant: row.tenant,
      });
      return;
    }
    const s = steps[idx];
    if (s.kind === "sleep") {
      openSeg(row, {
        kind: "sleep",
        from: sec(t),
        to: sec(t + s.ms),
        step: idx,
      });
      sleeping.push({ runId: row.id, wakeAt: t + s.ms, next: idx + 1 });
      L(
        t,
        "sleep",
        `Run ${row.label} sleeps for ${fmtSeconds(
          sec(s.ms)
        )}. It holds no concurrency slot while it waits.`,
        { runId: row.id, tenant: row.tenant }
      );
      return;
    }
    enqueue(row, idx, t);
  };

  const startItem = (item: QItem, t: number, aheadOf: number) => {
    const row = runs[item.runId - 1];
    closeSeg(row, t);
    const s = steps[item.step];
    // A start item whose first step is a sleep executes briefly to discover it.
    const dur = s.kind === "run" ? s.ms : TICK_MS;
    const keys = constraints.map((_, i) => cKey(i, row.tenant));
    keys.forEach((k, i) => active[i].set(k, (active[i].get(k) || 0) + 1));
    executing.push({ runId: row.id, step: item.step, endAt: t + dur, keys });
    openSeg(row, {
      kind: "run",
      from: sec(t),
      to: sec(t + dur),
      step: item.step,
    });
    const first = row.firstStartAt === undefined;
    if (first) row.firstStartAt = sec(t);
    const slotText = constraints.length
      ? ` Slots: ${keys
          .map(
            (k, i) =>
              `${cUsed(i, k)}/${constraints[i].limit} for ${describeKey(i, k)}`
          )
          .join(", ")}.`
      : "";
    const waited =
      first && row.createdAt !== undefined ? sec(t) - row.createdAt : 0;
    L(
      t,
      "start",
      `Run ${row.label} ${first ? "started" : "resumed"} step ${item.step + 1}${
        first && waited > 0.001
          ? ` after waiting ${fmtSeconds(Number(waited.toFixed(2)))}`
          : ""
      }.${slotText}${
        aheadOf > 0
          ? ` Priority moved it ahead of ${aheadOf} older queued run${
              aheadOf > 1 ? "s" : ""
            }.`
          : ""
      }`,
      { runId: row.id, tenant: row.tenant }
    );
  };

  /** Check an item against its own constraints without consuming capacity. */
  const gate = (
    item: QItem,
    now: number
  ): { reason: WaitReason; constraint?: number } | null => {
    const row = runs[item.runId - 1];
    if (
      item.isStart &&
      th &&
      !th.allowed(keyOf(cfg.throttle.key, row.tenant), now)
    ) {
      return { reason: "throttle" };
    }
    for (let i = 0; i < constraints.length; i++) {
      if (cUsed(i, cKey(i, row.tenant)) >= constraints[i].limit) {
        return { reason: "concurrency", constraint: i };
      }
    }
    return null;
  };

  const setReason = (
    item: QItem,
    r: { reason: WaitReason; constraint?: number },
    t: number
  ) => {
    const row = runs[item.runId - 1];
    const seg = row.segments[row.segments.length - 1];
    const sig = `${r.reason}:${r.constraint ?? ""}`;
    if (!seg || seg.kind !== "wait") return;
    if (
      seg.from === sec(t) &&
      seg.reason === "backlog" &&
      item.lastReason === undefined
    ) {
      seg.reason = r.reason;
      seg.constraint = r.constraint;
    } else if (seg.reason !== r.reason || seg.constraint !== r.constraint) {
      seg.to = sec(t);
      row.segments.push({
        kind: "wait",
        from: sec(t),
        to: Number.POSITIVE_INFINITY,
        reason: r.reason,
        constraint: r.constraint,
        step: item.step,
      });
    }
    if (item.lastReason !== sig) {
      item.lastReason = sig;
      const stepText = item.isStart ? "" : ` step ${item.step + 1}`;
      if (r.reason === "throttle") {
        const k = keyOf(cfg.throttle.key, row.tenant);
        L(
          t,
          "wait",
          `Run ${row.label} waits for the throttle${
            k === "*" ? "" : ` for key ${k}`
          } (${cfg.throttle.limit} per ${fmtSeconds(cfg.throttle.period)}${
            cfg.throttle.burst ? ` + burst ${cfg.throttle.burst}` : ""
          }). Next start at ${fmtSeconds(
            Number(sec(th!.nextAt(k, t)).toFixed(2))
          )}.`,
          { runId: row.id, tenant: row.tenant }
        );
      } else if (r.reason === "concurrency") {
        const i = r.constraint as number;
        L(
          t,
          "wait",
          `Run ${row.label}${stepText} waits for a slot: ${cUsed(
            i,
            cKey(i, row.tenant)
          )}/${constraints[i].limit} steps executing for ${describeKey(
            i,
            cKey(i, row.tenant)
          )}.`,
          { runId: row.id, tenant: row.tenant }
        );
      } else {
        L(
          t,
          "wait",
          `Run ${row.label}${stepText} has capacity but sits behind blocked work from other keys at the head of the queue.`,
          { runId: row.id, tenant: row.tenant }
        );
      }
    }
  };

  const runScheduler = (t: number) => {
    if (!queue.length) return;
    const reasons = new Map<
      QItem,
      { reason: WaitReason; constraint?: number }
    >();
    const started = new Set<QItem>();
    let scanned = 0;
    let stop: { reason: WaitReason; constraint?: number } | null = null;
    for (const item of queue) {
      if (stop) {
        reasons.set(item, stop);
        continue;
      }
      if (!cfg.keyQueues && scanned >= PEEK_SIZE) continue; // resolved below
      scanned++;
      const g = gate(item, t);
      if (g) {
        reasons.set(item, g);
        if (
          g.reason === "concurrency" &&
          constraints[g.constraint as number].key === "none"
        ) {
          stop = g; // function-level limit: FIFO partition stops here
        }
        continue;
      }
      const row = runs[item.runId - 1];
      if (item.isStart && th)
        th.consume(keyOf(cfg.throttle.key, row.tenant), t);
      // Count older runs still waiting to start that this one jumps.
      let aheadOf = 0;
      if (item.isStart && row.priority !== 0) {
        for (const q of queue) {
          if (q === item || started.has(q) || !q.isStart) continue;
          const other = runs[q.runId - 1];
          if (
            (other.createdAt as number) < (row.createdAt as number) &&
            q.score > item.score
          )
            aheadOf++;
        }
      }
      startItem(item, t, aheadOf);
      started.add(item);
    }
    if (started.size) queue = queue.filter((q) => !started.has(q));
    for (const item of queue) {
      let r = reasons.get(item);
      if (!r) r = gate(item, t) || { reason: "backlog" };
      setReason(item, r, t);
    }
  };

  // Main loop -----------------------------------------------------------------
  let ei = 0;
  let t = 0;
  let truncated = false;
  for (; ; t += TICK_MS) {
    if (t > MAX_SIM_MS) {
      truncated = true;
      t = MAX_SIM_MS;
      break;
    }

    // 1. Finish executing steps.
    if (executing.length) {
      const done = executing.filter((e) => e.endAt <= t);
      if (done.length) {
        executing = executing.filter((e) => e.endAt > t);
        for (const e of done) {
          e.keys.forEach((k, i) =>
            active[i].set(k, (active[i].get(k) || 1) - 1)
          );
          const row = runs[e.runId - 1];
          const cancelReason = (row as SimRun & { cancelReason?: string })
            .cancelReason;
          if (cancelReason) {
            endRun(row, t, "cancelled", cancelReason);
            L(
              t,
              "cancel",
              `Run ${row.label} cancelled after its step finished.`,
              { runId: row.id, tenant: row.tenant }
            );
            continue;
          }
          const s = steps[e.step];
          advance(row, s.kind === "run" ? e.step + 1 : e.step, t);
        }
      }
    }

    // 2. Wake sleeping runs.
    if (sleeping.length) {
      const woke = sleeping.filter((s) => s.wakeAt <= t);
      if (woke.length) {
        sleeping = sleeping.filter((s) => s.wakeAt > t);
        for (const s of woke) advance(runs[s.runId - 1], s.next, t);
      }
    }

    // 3. Arrivals.
    while (ei < events.length && Math.round(events[ei].t * 1000) <= t) {
      const ev = events[ei++];
      L(t, "event", `${ev.label} received.`, {
        eventId: ev.id,
        tenant: ev.tenant,
      });

      if (cfg.batching.enabled) {
        const k = keyOf(cfg.batching.key, ev.tenant);
        let b = batches.get(k);
        if (!b) {
          const row = newRow(ev.tenant, []);
          b = { row, openedAt: t, deadline: t + toMs(cfg.batching.timeout) };
          row.collect = {
            kind: "batch",
            from: sec(t),
            to: sec(t),
            reason: "timeout",
            resets: [],
          };
          openSeg(row, { kind: "collect", from: sec(t) });
          batches.set(k, b);
          L(
            t,
            "collect",
            `${ev.label} opens a batch${
              k === "*" ? "" : ` for key ${k}`
            }. It starts at ${
              cfg.batching.maxSize
            } events or after ${fmtSeconds(cfg.batching.timeout)}.`,
            { runId: row.id, tenant: ev.tenant, eventId: ev.id }
          );
        }
        b.row.eventIds.push(ev.id);
        b.row.triggerEventId = b.row.eventIds[0];
        ev.outcome = "batched";
        ev.runId = b.row.id;
        if (b.row.eventIds.length >= cfg.batching.maxSize) {
          finalizeBatch(k, t, "full");
        }
        continue;
      }

      if (rl) {
        const k = keyOf(cfg.rateLimit.key, ev.tenant);
        if (!rl.allowed(k, t)) {
          ev.outcome = "rate-limited";
          L(
            t,
            "skip",
            `${ev.label} skipped by the rate limit${
              k === "*" ? "" : ` for key ${k}`
            } (${cfg.rateLimit.limit} per ${fmtSeconds(
              cfg.rateLimit.period
            )}). Next admission at ${fmtSeconds(
              Number(sec(rl.nextAt(k, t)).toFixed(2))
            )}.`,
            { eventId: ev.id, tenant: ev.tenant }
          );
          continue;
        }
        rl.consume(k, t);
      }

      if (cfg.debounce.enabled) {
        const k = keyOf(cfg.debounce.key, ev.tenant);
        const period = toMs(cfg.debounce.period);
        const d = debounces.get(k);
        if (!d) {
          const row = newRow(ev.tenant, [ev.id]);
          let fireAt = t + period;
          let capped = false;
          if (
            cfg.debounce.useTimeout &&
            t + toMs(cfg.debounce.timeout) < fireAt
          ) {
            fireAt = t + toMs(cfg.debounce.timeout);
            capped = true;
          }
          row.collect = {
            kind: "debounce",
            from: sec(t),
            to: sec(fireAt),
            reason: capped ? "timeout" : "period",
            resets: [],
          };
          openSeg(row, { kind: "collect", from: sec(t) });
          debounces.set(k, { row, firstAt: t, fireAt, latest: ev, capped });
          ev.outcome = "pending";
          ev.runId = row.id;
          L(
            t,
            "collect",
            `${ev.label} starts a debounce${
              k === "*" ? "" : ` for key ${k}`
            }. It fires at ${fmtSeconds(
              sec(fireAt)
            )} if no other event arrives.`,
            { runId: row.id, tenant: ev.tenant, eventId: ev.id }
          );
        } else {
          d.latest.outcome = "debounce-superseded";
          d.latest = ev;
          d.row.eventIds.push(ev.id);
          d.row.triggerEventId = ev.id;
          ev.runId = d.row.id;
          let fireAt = t + period;
          let capped = false;
          if (
            cfg.debounce.useTimeout &&
            d.firstAt + toMs(cfg.debounce.timeout) < fireAt
          ) {
            fireAt = d.firstAt + toMs(cfg.debounce.timeout);
            capped = true;
          }
          d.fireAt = fireAt;
          d.capped = capped;
          d.row.collect!.resets.push(sec(t));
          L(
            t,
            "collect",
            capped
              ? `${ev.label} replaces the pending event${
                  k === "*" ? "" : ` for key ${k}`
                }. The timeout caps the wait at ${fmtSeconds(sec(fireAt))}.`
              : `${ev.label} restarts the debounce${
                  k === "*" ? "" : ` for key ${k}`
                }. It now fires at ${fmtSeconds(sec(fireAt))}.`,
            { runId: d.row.id, tenant: ev.tenant, eventId: ev.id }
          );
        }
        continue;
      }

      // Not debounced: singleton, then schedule.
      const row = newRow(ev.tenant, [ev.id]);
      if (!admitSingleton(row, t)) {
        runs.pop(); // skipped before becoming a run
        ev.outcome = "singleton-skipped";
        continue;
      }
      ev.outcome = "run";
      ev.runId = row.id;
      schedule(row, t);
    }

    // 4. Debounce and batch timers.
    if (debounces.size) {
      for (const [k, d] of Array.from(debounces.entries())) {
        if (d.fireAt > t) continue;
        debounces.delete(k);
        const row = d.row;
        closeSeg(row, t);
        row.collect!.to = sec(t);
        row.collect!.reason = d.capped ? "timeout" : "period";
        row.triggerEventId = d.latest.id;
        L(
          t,
          "collect",
          `Debounce${k === "*" ? "" : ` for key ${k}`} fires (${
            d.capped ? "timeout reached" : "quiet period passed"
          }) with the last event, ${d.latest.label}.`,
          { runId: row.id, tenant: row.tenant }
        );
        if (!admitSingleton(row, t)) {
          d.latest.outcome = "singleton-skipped";
          row.end = "skipped";
          row.endReason = "Skipped by singleton: another run is active";
          row.endedAt = sec(t);
          continue;
        }
        d.latest.outcome = "run";
        schedule(row, t);
      }
    }
    if (batches.size) {
      for (const [k, b] of Array.from(batches.entries())) {
        if (b.deadline <= t) finalizeBatch(k, t, "timeout");
      }
    }

    // 5. Start timeouts.
    if (cfg.startTimeout.enabled && queue.length) {
      const limit = toMs(cfg.startTimeout.seconds);
      for (const q of queue.slice()) {
        if (!q.isStart) continue;
        const row = runs[q.runId - 1];
        if (t - Math.round((row.createdAt as number) * 1000) >= limit) {
          queue.splice(queue.indexOf(q), 1);
          endRun(
            row,
            t,
            "cancelled",
            `Cancelled: didn't start within ${fmtSeconds(
              cfg.startTimeout.seconds
            )}`
          );
          L(
            t,
            "cancel",
            `Run ${
              row.label
            } cancelled: it didn't start within the ${fmtSeconds(
              cfg.startTimeout.seconds
            )} start timeout.`,
            { runId: row.id, tenant: row.tenant }
          );
        }
      }
    }

    // 6. Schedule queued work.
    runScheduler(t);

    // 7. Done?
    if (
      ei >= events.length &&
      !queue.length &&
      !executing.length &&
      !sleeping.length &&
      !debounces.size &&
      !batches.size
    ) {
      break;
    }
  }

  function finalizeBatch(k: string, now: number, reason: "full" | "timeout") {
    const b = batches.get(k);
    if (!b) return;
    batches.delete(k);
    const row = b.row;
    closeSeg(row, now);
    row.collect!.to = sec(now);
    row.collect!.reason = reason;
    row.tenant = events[row.eventIds[0]].tenant;
    row.triggerEventId = row.eventIds[0];
    L(
      now,
      "collect",
      `Batch${k === "*" ? "" : ` for key ${k}`} starts with ${
        row.eventIds.length
      } event${row.eventIds.length > 1 ? "s" : ""} (${
        reason === "full" ? "reached maxSize" : "timeout reached"
      }).`,
      { runId: row.id, tenant: row.tenant }
    );
    schedule(row, now);
  }

  // Close anything still open.
  for (const h of singletonHolds)
    if (h.to === Number.POSITIVE_INFINITY) h.to = sec(t);
  for (const r of runs) {
    for (const s of r.segments)
      if (s.to === Number.POSITIVE_INFINITY) s.to = sec(t);
    if (r.end === "unfinished" && r.createdAt === undefined && r.collect) {
      r.collect.to = sec(t);
    }
  }

  const series = (g: Gcra | null, capacity: number): GcraSeries | undefined =>
    g
      ? { emissionMs: g.emission, dvtMs: g.dvt, capacity, history: g.history }
      : undefined;

  return {
    errors: [],
    events,
    runs,
    log,
    endTime: Math.max(sec(t), 1),
    truncated,
    throttle: series(th, th ? Math.round(th.dvt / th.emission) : 0),
    rateLimit: series(rl, rl ? Math.round(rl.dvt / rl.emission) : 0),
    singletonHolds,
    tenants,
  };
}
