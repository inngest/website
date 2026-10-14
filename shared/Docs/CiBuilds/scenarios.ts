/**
 * Scenarios for the Inngest CI build diagrams. Each one is a small script of
 * timed states, in seconds, that the diagram plays and loops.
 */

export type NodeState =
  | "idle"
  | "waiting"
  | "lookup"
  | "hit"
  | "miss"
  | "building"
  | "ready"
  | "changed"
  | "running"
  | "passed";

export interface NodeEvent {
  at: number;
  state: NodeState;
  /** The image name from here on. */
  name?: string;
  /** A short line under the name, from here on. */
  note?: string;
}

export interface ChainNode {
  id: string;
  /** "cached" jobs have an image name, plain jobs only run. */
  kind: "cached" | "job";
  /** The job's definition, shown above its box. */
  code: string;
  /** The app the job is defined in, shown when jobs span apps. */
  app?: string;
  events: NodeEvent[];
}

export interface ChainScenario {
  type: "chain";
  caption: string;
  /** Length of the script, in seconds. */
  domain: number;
  /** How long one loop takes on screen, in seconds. */
  realDuration: number;
  /** Parents first: each node starts from the one before it. */
  nodes: ChainNode[];
}

export type BarKind =
  | "lookup"
  | "hit"
  | "miss"
  | "wait"
  | "build"
  | "warm"
  | "warn"
  | "run";

export interface Bar {
  start: number;
  end: number;
  kind: BarKind;
  label: string;
}

export interface Lane {
  label: string;
  bars: Bar[];
  /** Shown at the end of the lane once the time passes. */
  done?: { at: number; label: string };
}

export interface TimelineScenario {
  type: "timeline";
  /** The code the timeline is about, shown above it. */
  code?: string;
  caption: string;
  domain: number;
  realDuration: number;
  lanes: Lane[];
}

export type Scenario = ChainScenario | TimelineScenario;

const scenarios: Record<string, Scenario> = {
  "cross-app": {
    type: "chain",
    caption:
      "web asks platform for node-base. platform builds it once, and web's test starts from it.",
    domain: 6.5,
    realDuration: 7,
    nodes: [
      {
        id: "node-base",
        kind: "cached",
        app: "platform",
        code: `ci.job({
  id: "node-base",
  cache: { key: ... },
}, ...)`,
        events: [
          { at: 0, state: "idle" },
          {
            at: 0.6,
            state: "lookup",
            name: "ci/main/node-base/41d0b8",
            note: "asked by web",
          },
          { at: 1.3, state: "miss", note: undefined },
          { at: 1.5, state: "building" },
          { at: 3.7, state: "ready" },
        ],
      },
      {
        id: "test",
        kind: "job",
        app: "web",
        code: `ci.job({
  id: "test",
  from: image.job("platform/node-base"),
}, ...)`,
        events: [
          { at: 0, state: "waiting" },
          { at: 4, state: "running" },
          { at: 5.6, state: "passed" },
        ],
      },
    ],
  },

  "parent-once": {
    type: "timeline",
    caption:
      "install runs once and is snapshotted. lint, test, and e2e each start from that snapshot.",
    domain: 10,
    realDuration: 9,
    lanes: [
      {
        label: "install",
        bars: [
          { start: 0.2, end: 3.4, kind: "build", label: "runs once" },
          { start: 3.4, end: 4.3, kind: "warm", label: "snapshot" },
        ],
      },
      {
        label: "lint",
        bars: [
          { start: 0.2, end: 4.3, kind: "wait", label: "waits for install" },
          { start: 4.3, end: 5.1, kind: "warm", label: "copy" },
          { start: 5.1, end: 6.5, kind: "run", label: "lint" },
        ],
        done: { at: 6.5, label: "passed" },
      },
      {
        label: "test",
        bars: [
          { start: 0.2, end: 4.3, kind: "wait", label: "waits for install" },
          { start: 4.3, end: 5.1, kind: "warm", label: "copy" },
          { start: 5.1, end: 7.7, kind: "run", label: "test" },
        ],
        done: { at: 7.7, label: "passed" },
      },
      {
        label: "e2e",
        bars: [
          { start: 0.2, end: 4.3, kind: "wait", label: "waits for install" },
          { start: 4.3, end: 5.1, kind: "warm", label: "copy" },
          { start: 5.1, end: 8.9, kind: "run", label: "e2e" },
        ],
        done: { at: 8.9, label: "passed" },
      },
    ],
  },

  "two-runs": {
    type: "timeline",
    caption:
      "Without a cache, each pipeline run builds install again, then throws it away.",
    domain: 11,
    realDuration: 10,
    lanes: [
      {
        label: "Run 1 · install",
        bars: [{ start: 0.2, end: 3.4, kind: "build", label: "build" }],
      },
      {
        label: "Run 1 · test",
        bars: [
          { start: 0.2, end: 3.4, kind: "wait", label: "waits" },
          { start: 3.4, end: 5, kind: "run", label: "test" },
        ],
        done: { at: 5, label: "passed" },
      },
      {
        label: "Run 2 · install",
        bars: [{ start: 5.6, end: 8.8, kind: "build", label: "build again" }],
      },
      {
        label: "Run 2 · test",
        bars: [
          { start: 5.6, end: 8.8, kind: "wait", label: "waits" },
          { start: 8.8, end: 10.4, kind: "run", label: "test" },
        ],
        done: { at: 10.4, label: "passed" },
      },
    ],
  },

  "cache-key": {
    type: "timeline",
    code: `ci.job({
  id: "install",
  cache: { key: files("package-lock.json") },
}, ...)`,
    caption:
      "The first run with a new lockfile builds install and warns. The second run finds it.",
    domain: 11,
    realDuration: 10,
    lanes: [
      {
        label: "Run 1 · install",
        bars: [
          { start: 0.2, end: 1.1, kind: "miss", label: "miss" },
          { start: 1.1, end: 4.2, kind: "warn", label: "built just in time" },
        ],
      },
      {
        label: "Run 1 · test",
        bars: [
          { start: 1.1, end: 4.2, kind: "wait", label: "waits" },
          { start: 4.2, end: 5.7, kind: "run", label: "test" },
        ],
        done: { at: 5.7, label: "passed" },
      },
      {
        label: "Run 2 · install",
        bars: [{ start: 6.3, end: 7.2, kind: "hit", label: "found" }],
      },
      {
        label: "Run 2 · test",
        bars: [{ start: 7.2, end: 8.7, kind: "run", label: "test" }],
        done: { at: 8.7, label: "passed" },
      },
    ],
  },

  refresh: {
    type: "timeline",
    code: `ci.job({
  id: "install",
  cache: {
    key: files("package-lock.json"),
    refresh: [{ cron: "0 3 * * *" }],
  },
}, ...)`,
    caption:
      "The 3am cron builds install ahead of time. The pull request finds it and starts at once.",
    domain: 9,
    realDuration: 9,
    lanes: [
      {
        label: "Background · install",
        bars: [{ start: 0.2, end: 3.6, kind: "build", label: "built at 3am" }],
        done: { at: 3.6, label: "cached" },
      },
      {
        label: "Pull request · install",
        bars: [{ start: 4.6, end: 5.5, kind: "hit", label: "found" }],
      },
      {
        label: "Pull request · test",
        bars: [{ start: 5.5, end: 7.5, kind: "run", label: "test" }],
        done: { at: 7.5, label: "passed" },
      },
    ],
  },

  many: {
    type: "timeline",
    code: `ci.job({ id: "test", from: install }, ...)
// four pull requests push at once`,
    caption:
      "Four runs ask for the same build. It happens once, and all four resume together.",
    domain: 8,
    realDuration: 8,
    lanes: [
      {
        label: "Run 1",
        bars: [
          { start: 0.2, end: 1.1, kind: "miss", label: "miss" },
          { start: 1.1, end: 4.4, kind: "wait", label: "waits for the build" },
          { start: 4.4, end: 6.2, kind: "run", label: "test" },
        ],
      },
      {
        label: "Run 2",
        bars: [
          { start: 0.3, end: 1.2, kind: "miss", label: "miss" },
          { start: 1.2, end: 4.4, kind: "wait", label: "waits for the build" },
          { start: 4.4, end: 6.5, kind: "run", label: "test" },
        ],
      },
      {
        label: "Run 3",
        bars: [
          { start: 0.4, end: 1.3, kind: "miss", label: "miss" },
          { start: 1.3, end: 4.4, kind: "wait", label: "waits for the build" },
          { start: 4.4, end: 6.8, kind: "run", label: "test" },
        ],
      },
      {
        label: "Run 4",
        bars: [
          { start: 0.5, end: 1.4, kind: "miss", label: "miss" },
          { start: 1.4, end: 4.4, kind: "wait", label: "waits for the build" },
          { start: 4.4, end: 7.2, kind: "run", label: "test" },
        ],
      },
      {
        label: "The one build",
        bars: [
          { start: 0.7, end: 4.3, kind: "build", label: "install, built once" },
        ],
        done: { at: 4.3, label: "shared with all four" },
      },
    ],
  },
};

export function getScenario(id: string): Scenario | undefined {
  return scenarios[id];
}
