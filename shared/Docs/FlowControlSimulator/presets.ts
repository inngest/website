import type { SimConfig, TrafficSource } from "./engine";

export interface Preset {
  id: string;
  title: string;
  /** One sentence shown under the preset picker. */
  summary: string;
  /** A suggestion for what to change next. */
  tryThis?: string;
  /** Docs page this preset illustrates. */
  href: string;
  config: SimConfig;
}

export const TENANT_IDS = ["A", "B", "C", "D"];

export function baseConfig(): SimConfig {
  return {
    steps: [{ kind: "run", duration: 2 }],
    tenants: [{ id: "A", priority: 0 }],
    traffic: [],
    manual: [],
    rateLimit: { enabled: false, limit: 1, period: 10, key: "tenant" },
    batching: { enabled: false, maxSize: 5, timeout: 10, key: "tenant" },
    debounce: {
      enabled: false,
      period: 5,
      useTimeout: false,
      timeout: 15,
      key: "tenant",
    },
    singleton: { enabled: false, mode: "skip", key: "tenant" },
    priority: { enabled: false },
    throttle: { enabled: false, limit: 2, period: 10, burst: 0, key: "none" },
    // Step concurrency is always on: every function has some limit.
    concurrency: {
      enabled: true,
      constraints: [{ limit: 5, key: "none", scope: "fn", externalLoad: 0 }],
    },
    startTimeout: { enabled: false, seconds: 30 },
    keyQueues: false,
  };
}

let srcId = 0;
const burst = (
  tenant: string,
  at: number,
  count: number,
  spread = 0
): TrafficSource => ({
  id: `s${++srcId}`,
  tenant,
  kind: "burst",
  at,
  count,
  spread,
});
const steady = (
  tenant: string,
  from: number,
  to: number,
  every: number
): TrafficSource => ({
  id: `s${++srcId}`,
  tenant,
  kind: "steady",
  from,
  to,
  every,
});
const random = (
  tenant: string,
  from: number,
  to: number,
  rate: number,
  seed: number
): TrafficSource => ({
  id: `s${++srcId}`,
  tenant,
  kind: "random",
  from,
  to,
  rate,
  seed,
});

function make(patch: (c: SimConfig) => void): SimConfig {
  const c = baseConfig();
  patch(c);
  return c;
}

export const PRESETS: Preset[] = [
  {
    id: "basic",
    title: "Step concurrency: limit 5",
    summary:
      "Ten events at once and a limit of 5 executing steps. Five runs start right away; the rest wait for a free slot.",
    tryThis: "Turn on throttling or rate limiting and compare.",
    href: "/docs/durable-execution/flow-control/concurrency",
    config: make((c) => {
      c.steps = [{ kind: "run", duration: 3 }];
      c.traffic = [burst("A", 0, 10)];
    }),
  },
  {
    id: "combined",
    title: "Mix and match",
    summary:
      "Rate limit, debounce, singleton, throttle, and concurrency on one function, applied in order.",
    tryThis: "Turn controls off one at a time and watch how the runs change.",
    href: "/docs/durable-execution/flow-control",
    config: make((c) => {
      c.tenants = [
        { id: "A", priority: 0 },
        { id: "B", priority: 0 },
        { id: "C", priority: 0 },
      ];
      c.steps = [
        { kind: "run", duration: 3 },
        { kind: "sleep", duration: 2 },
        { kind: "run", duration: 1 },
      ];
      c.traffic = [
        random("A", 0, 30, 1.2, 11),
        burst("B", 5, 10, 3),
        steady("C", 0, 30, 4),
      ];
      c.rateLimit = { enabled: true, limit: 10, period: 10, key: "tenant" };
      c.debounce = {
        enabled: true,
        period: 2,
        useTimeout: true,
        timeout: 6,
        key: "tenant",
      };
      c.singleton = { enabled: true, mode: "skip", key: "tenant" };
      c.throttle = {
        enabled: true,
        limit: 2,
        period: 10,
        burst: 0,
        key: "none",
      };
      c.concurrency = {
        enabled: true,
        constraints: [{ limit: 2, key: "none", scope: "fn", externalLoad: 0 }],
      };
    }),
  },
  {
    id: "concurrency",
    title: "Sleeping frees slots",
    summary:
      "Two slots, six runs. A run releases its slot while it sleeps, so another run's step can execute.",
    tryThis: "Change the sleep to a step.run and see the backlog grow.",
    href: "/docs/durable-execution/flow-control/concurrency",
    config: make((c) => {
      c.steps = [
        { kind: "run", duration: 2 },
        { kind: "sleep", duration: 4 },
        { kind: "run", duration: 2 },
      ];
      c.traffic = [burst("A", 0, 6)];
      c.concurrency = {
        enabled: true,
        constraints: [{ limit: 2, key: "none", scope: "fn", externalLoad: 0 }],
      };
    }),
  },
  {
    id: "concurrency-keys",
    title: "Shared ceiling + per-tenant limit",
    summary:
      "An account-scoped key caps an external API at 4 slots (1 used by another function); each tenant also gets 2.",
    tryThis:
      "Raise the other functions' load and watch every tenant slow down.",
    href: "/docs/durable-execution/flow-control/concurrency",
    config: make((c) => {
      c.tenants = [
        { id: "A", priority: 0 },
        { id: "B", priority: 0 },
        { id: "C", priority: 0 },
      ];
      c.steps = [{ kind: "run", duration: 3 }];
      c.traffic = [burst("A", 0, 8), burst("B", 1, 3), steady("C", 0, 12, 3)];
      c.concurrency = {
        enabled: true,
        constraints: [
          { limit: 4, key: "shared", scope: "account", externalLoad: 1 },
          { limit: 2, key: "tenant", scope: "fn", externalLoad: 0 },
        ],
      };
      c.keyQueues = true;
    }),
  },
  {
    id: "throttling",
    title: "Throttling with burst",
    summary:
      "2 starts per 10s plus a burst of 1: three runs start at once, then one every 5s. Nothing is dropped.",
    tryThis: "Set burst to 0, or add a 20s start timeout to expire stale runs.",
    href: "/docs/durable-execution/flow-control/throttling",
    config: make((c) => {
      c.steps = [{ kind: "run", duration: 1 }];
      c.traffic = [burst("A", 0, 10)];
      c.throttle = {
        enabled: true,
        limit: 2,
        period: 10,
        burst: 1,
        key: "none",
      };
    }),
  },
  {
    id: "rate-limiting",
    title: "Rate limiting",
    summary:
      "One run per tenant every 10s. Excess events are skipped, not queued.",
    tryThis: "Switch the key to none so both tenants share one limit.",
    href: "/docs/durable-execution/flow-control/rate-limiting",
    config: make((c) => {
      c.tenants = [
        { id: "A", priority: 0 },
        { id: "B", priority: 0 },
      ];
      c.traffic = [steady("A", 0, 40, 2), random("B", 0, 40, 0.3, 7)];
      c.rateLimit = { enabled: true, limit: 1, period: 10, key: "tenant" };
    }),
  },
  {
    id: "batching",
    title: "Batching by tenant",
    summary:
      "Batches of up to 5 events per tenant. A busy tenant fills batches; a quiet one waits for the 10s timeout.",
    tryThis:
      "Remove the batch key and see mixed batches take the first event's slot.",
    href: "/docs/durable-execution/flow-control/batching",
    config: make((c) => {
      c.tenants = [
        { id: "A", priority: 0 },
        { id: "B", priority: 0 },
      ];
      c.traffic = [steady("A", 0, 20, 1), steady("B", 0, 20, 4)];
      c.batching = { enabled: true, maxSize: 5, timeout: 10, key: "tenant" };
      c.concurrency = {
        enabled: true,
        constraints: [
          { limit: 1, key: "tenant", scope: "fn", externalLoad: 0 },
        ],
      };
    }),
  },
  {
    id: "singleton",
    title: "Singleton",
    summary:
      "One active run per tenant. In skip mode, events that arrive during a run are dropped.",
    tryThis:
      "Switch the mode to cancel so the newest event replaces the active run.",
    href: "/docs/durable-execution/flow-control/singleton",
    config: make((c) => {
      c.steps = [
        { kind: "run", duration: 3 },
        { kind: "sleep", duration: 5 },
        { kind: "run", duration: 3 },
      ];
      c.manual = [0, 1.5, 9, 14, 15.5].map((t) => ({ t, tenant: "A" }));
      c.singleton = { enabled: true, mode: "skip", key: "tenant" };
    }),
  },
  {
    id: "debounce",
    title: "Debounce with timeout",
    summary:
      "A 5s quiet period per tenant. A's constant stream would never settle, so the 15s timeout forces a run.",
    tryThis:
      "Turn off the timeout and watch A's run wait until the stream stops.",
    href: "/docs/durable-execution/flow-control/debounce",
    config: make((c) => {
      c.tenants = [
        { id: "A", priority: 0 },
        { id: "B", priority: 0 },
      ];
      c.traffic = [steady("A", 0, 30, 2), burst("B", 4, 3, 2)];
      c.debounce = {
        enabled: true,
        period: 5,
        useTimeout: true,
        timeout: 15,
        key: "tenant",
      };
    }),
  },
  {
    id: "priority",
    title: "Priority",
    summary:
      "One slot, and tenant C (enterprise) has a +120s factor, so its runs move ahead of A's and B's backlog.",
    tryThis: "Set C's factor to -120 to push it behind everyone else.",
    href: "/docs/durable-execution/flow-control/priority",
    config: make((c) => {
      c.tenants = [
        { id: "A", priority: 0 },
        { id: "B", priority: 0 },
        { id: "C", priority: 120 },
      ];
      c.traffic = [burst("A", 0, 6), burst("B", 1, 3), steady("C", 3, 13, 5)];
      c.priority = { enabled: true };
      c.concurrency = {
        enabled: true,
        constraints: [{ limit: 1, key: "none", scope: "fn", externalLoad: 0 }],
      };
    }),
  },
  {
    id: "noisy-neighbor",
    title: "Noisy neighbor",
    summary:
      "Tenant A floods the queue. B has free slots, but its runs sit behind A's blocked backlog.",
    tryThis: "Turn on key queues so B's work is scheduled independently.",
    href: "/docs/durable-execution/flow-control/multi-tenancy",
    config: make((c) => {
      c.tenants = [
        { id: "A", priority: 0 },
        { id: "B", priority: 0 },
      ];
      c.traffic = [burst("A", 0, 30), steady("B", 2, 20, 2)];
      c.concurrency = {
        enabled: true,
        constraints: [
          { limit: 2, key: "tenant", scope: "fn", externalLoad: 0 },
        ],
      };
      c.keyQueues = false;
    }),
  },
  {
    id: "multi-tenancy",
    title: "Per-tenant concurrency + throttle",
    summary:
      "Each tenant gets 3 executing steps and 4 run starts per 10s, so A's burst can't use B's or C's allowance.",
    tryThis:
      "Remove the throttle key to make all tenants share one start rate.",
    href: "/docs/durable-execution/flow-control/multi-tenancy",
    config: make((c) => {
      c.tenants = [
        { id: "A", priority: 0 },
        { id: "B", priority: 0 },
        { id: "C", priority: 0 },
      ];
      c.steps = [
        { kind: "run", duration: 2 },
        { kind: "run", duration: 2 },
      ];
      c.traffic = [
        burst("A", 0, 20),
        steady("B", 0, 20, 2),
        random("C", 0, 20, 0.4, 3),
      ];
      c.concurrency = {
        enabled: true,
        constraints: [
          { limit: 3, key: "tenant", scope: "fn", externalLoad: 0 },
        ],
      };
      c.throttle = {
        enabled: true,
        limit: 4,
        period: 10,
        burst: 0,
        key: "tenant",
      };
      c.keyQueues = true;
    }),
  },
];

export function getPreset(id: string | undefined): Preset {
  return PRESETS.find((p) => p.id === id) || PRESETS[0];
}

export function cloneConfig(c: SimConfig): SimConfig {
  return JSON.parse(JSON.stringify(c));
}
