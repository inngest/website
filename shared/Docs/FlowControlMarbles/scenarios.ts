import type { SimConfig } from "../FlowControlSimulator/engine";
import { baseConfig } from "../FlowControlSimulator/presets";

export interface MarbleScenario {
  id: string;
  /** Configuration snippets shown above the diagram. */
  code: string[];
  /** What the animation shows. Also used as the diagram's accessible label. */
  caption: string;
  /** Gutter label for the flow control row. */
  band: string;
  /** Live indicator under the band label. */
  meter?: "slots" | "throttle" | "rateLimit" | "batch" | "lock";
  /** "slot" labels every output lane; "runs" labels the first one. */
  lanes: "slot" | "runs";
  /** Minimum output lanes per group. */
  minLanes?: number;
  /** Give each tenant its own queue row and output lanes. */
  byTenant?: boolean;
  /** Names for the event rows, by tenant id. */
  tenantNames?: Record<string, string>;
  /** Simulator preset to pair with the "Open in simulator" link. */
  preset: string;
  config: SimConfig;
}

const events = (tenant: string, times: number[]) =>
  times.map((t) => ({ t, tenant }));

function make(patch: (c: SimConfig) => void): SimConfig {
  const c = baseConfig();
  c.rateLimit.key = "none";
  c.batching.key = "none";
  c.debounce.key = "none";
  patch(c);
  return c;
}

const limit = (n: number, key: "none" | "tenant" = "none") => ({
  enabled: true,
  constraints: [{ limit: n, key, scope: "fn" as const, externalLoad: 0 }],
});

export const MARBLE_SCENARIOS: MarbleScenario[] = [
  {
    id: "concurrency",
    code: ["concurrency: 2"],
    caption:
      "Six events arrive 0.4s apart, and each run has one 2s step. Two steps execute at once. The other runs wait in the queue and start, oldest first, as slots open.",
    band: "Queue",
    meter: "slots",
    lanes: "slot",
    minLanes: 2,
    preset: "basic",
    config: make((c) => {
      c.steps = [{ kind: "run", duration: 2 }];
      c.manual = events("A", [0, 0.4, 0.8, 1.2, 1.6, 2]);
      c.concurrency = limit(2);
    }),
  },
  {
    id: "concurrency-sleep",
    code: ["concurrency: 2"],
    caption:
      "Each run executes a step, sleeps for 2s, then executes another step. A sleeping run releases its slot, so queued runs start while others sleep. When a run wakes and both slots are busy, its next step waits in the queue. Five runs are in progress, but no more than two steps execute at once.",
    band: "Queue",
    meter: "slots",
    lanes: "runs",
    preset: "concurrency",
    config: make((c) => {
      c.steps = [
        { kind: "run", duration: 1.5 },
        { kind: "sleep", duration: 2 },
        { kind: "run", duration: 1.5 },
      ];
      c.manual = events("A", [0, 0.5, 1, 1.5, 2]);
      c.concurrency = limit(2);
    }),
  },
  {
    id: "throttling",
    code: ['throttle: { limit: 2, period: "6s", burst: 1 }'],
    caption:
      "Six events arrive 0.5s apart. Three runs (limit + burst) start at once, then one run starts every 3s (period ÷ limit). The rest wait in the queue; none are dropped.",
    band: "Queue",
    meter: "throttle",
    lanes: "runs",
    preset: "throttling",
    config: make((c) => {
      c.steps = [{ kind: "run", duration: 1 }];
      c.manual = events("A", [0, 0.5, 1, 1.5, 2, 2.5]);
      c.throttle = { enabled: true, limit: 2, period: 6, burst: 1, key: "none" };
    }),
  },
  {
    id: "rate-limiting",
    code: ['rateLimit: { limit: 1, period: "4s" }'],
    caption:
      "One run can start every 4s. Events that arrive before capacity recovers are skipped: they don't start a run, and they aren't queued for later.",
    band: "Rate limit",
    meter: "rateLimit",
    lanes: "runs",
    preset: "rate-limiting",
    config: make((c) => {
      c.steps = [{ kind: "run", duration: 1 }];
      c.manual = events("A", [0, 0.8, 1.6, 2.4, 4.2, 5, 6, 8.5, 9.3]);
      c.rateLimit = { enabled: true, limit: 1, period: 4, key: "none" };
    }),
  },
  {
    id: "batching",
    code: ['batchEvents: { maxSize: 3, timeout: "4s" }'],
    caption:
      "The first batch starts as soon as it holds three events. The second batch holds only two, so it starts when the 4s timeout expires. Each batch is one run that receives every event in it.",
    band: "Batch",
    meter: "batch",
    lanes: "runs",
    preset: "batching",
    config: make((c) => {
      c.steps = [{ kind: "run", duration: 1.5 }];
      c.manual = events("A", [0, 0.6, 1.2, 2.4, 3.4]);
      c.batching = { enabled: true, maxSize: 3, timeout: 4, key: "none" };
    }),
  },
  {
    id: "singleton-skip",
    code: ['singleton: { key: "event.data.user_id", mode: "skip" }'],
    caption:
      "All events are for one user. Run 1 holds the singleton lock for its whole duration, including the sleep, so events 2 and 3 are skipped. Event 4 arrives after run 1 completes and starts a new run.",
    band: "Singleton",
    meter: "lock",
    lanes: "runs",
    preset: "singleton",
    config: make((c) => {
      c.steps = [
        { kind: "run", duration: 1 },
        { kind: "sleep", duration: 2 },
        { kind: "run", duration: 1 },
      ];
      c.manual = events("A", [0, 1.5, 2.6, 5, 6]);
      c.singleton = { enabled: true, mode: "skip", key: "tenant" };
    }),
  },
  {
    id: "singleton-cancel",
    code: ['singleton: { key: "event.data.user_id", mode: "cancel" }'],
    caption:
      "Each new event cancels the active run and starts a new one. Run 1 is sleeping, so it's cancelled right away. Run 2 is executing a step, so the step finishes before the cancellation takes effect.",
    band: "Singleton",
    meter: "lock",
    lanes: "runs",
    preset: "singleton",
    config: make((c) => {
      c.steps = [
        { kind: "run", duration: 1 },
        { kind: "sleep", duration: 2 },
        { kind: "run", duration: 1 },
      ];
      c.manual = events("A", [0, 2, 2.5]);
      c.singleton = { enabled: true, mode: "cancel", key: "tenant" };
    }),
  },
  {
    id: "debounce",
    code: ['debounce: { period: "2s", timeout: "5s" }'],
    caption:
      "Each event restarts the 2s quiet period and replaces the pending event. The first burst settles, so a run starts with event 3. The steady stream never settles, so the 5s timeout starts a run with the latest event, 10.",
    band: "Debounce",
    lanes: "runs",
    preset: "debounce",
    config: make((c) => {
      c.steps = [{ kind: "run", duration: 1 }];
      c.manual = events("A", [0, 0.6, 1.2, 5, 5.8, 6.6, 7.4, 8.2, 9, 9.8, 10.6]);
      c.debounce = {
        enabled: true,
        period: 2,
        useTimeout: true,
        timeout: 5,
        key: "none",
      };
    }),
  },
  {
    id: "priority",
    code: [
      "concurrency: 1",
      "priority: { run: \"event.data.tier == 'enterprise' ? 120 : 0\" }",
    ],
    caption:
      "One step executes at a time. Enterprise runs have a priority factor of 120, so each one moves ahead of standard runs that were queued before it.",
    band: "Queue",
    meter: "slots",
    lanes: "runs",
    tenantNames: { A: "Standard", E: "Enterprise" },
    preset: "priority",
    config: make((c) => {
      c.tenants = [
        { id: "A", priority: 0 },
        { id: "E", priority: 120 },
      ];
      c.steps = [{ kind: "run", duration: 1.5 }];
      c.manual = [
        ...events("A", [0, 0.5, 1, 1.5, 2]),
        ...events("E", [2.4, 4.2]),
      ];
      c.priority = { enabled: true };
      c.concurrency = limit(1);
    }),
  },
  {
    id: "multi-tenancy",
    code: ['concurrency: { limit: 2, key: "event.data.tenant_id" }'],
    caption:
      "Each tenant has its own limit of two executing steps. Tenant A's burst fills A's slots and builds a queue. Tenant B's runs start right away because A's backlog doesn't use B's slots.",
    band: "Queue",
    meter: "slots",
    lanes: "slot",
    minLanes: 2,
    byTenant: true,
    tenantNames: { A: "Tenant A", B: "Tenant B" },
    preset: "multi-tenancy",
    config: make((c) => {
      c.tenants = [
        { id: "A", priority: 0 },
        { id: "B", priority: 0 },
      ];
      c.steps = [{ kind: "run", duration: 2 }];
      c.manual = [
        ...events("A", [0, 0.4, 0.8, 1.2, 1.6, 2]),
        ...events("B", [1, 3.6]),
      ];
      c.concurrency = limit(2, "tenant");
      c.keyQueues = true;
    }),
  },
];

export function getMarbleScenario(id: string) {
  return MARBLE_SCENARIOS.find((s) => s.id === id);
}
