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
  /** The snapshot name from here on. */
  name?: string;
  /** A short line under the state, from here on. */
  note?: string;
}

export interface ChainNode {
  id: string;
  /** "cached" jobs have a snapshot name, plain jobs only run. */
  kind: "cached" | "job";
  /** The app the job is defined in, shown when jobs span apps. */
  app?: string;
  events: NodeEvent[];
}

export interface ChainScenario {
  type: "chain";
  code: string[];
  caption: string;
  /** Length of the script, in seconds. */
  domain: number;
  /** How long one loop takes on screen, in seconds. */
  realDuration: number;
  /** Parents first: each node starts from the one before it. */
  nodes: ChainNode[];
  /** What the arrows between nodes say. */
  edge?: string;
}

export type BarKind =
  | "lookup"
  | "hit"
  | "miss"
  | "wait"
  | "build"
  | "warm"
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
  code: string[];
  caption: string;
  domain: number;
  realDuration: number;
  lanes: Lane[];
}

export type Scenario = ChainScenario | TimelineScenario;

const INSTALL = "ci/main/install/7c41e2";
const BUILD = "ci/main/build/a90f3d";

const scenarios: Record<string, Scenario> = {
  cold: {
    type: "chain",
    code: [
      'install: cache: { key: files("pnpm-lock.yaml") }',
      "build: from: install, cache: { key }",
      "test: from: build",
    ],
    caption:
      "The first run. test looks build up, and build looks install up. Neither has a snapshot under its name yet, so each is built once, in order, and test starts from build's snapshot.",
    domain: 9,
    realDuration: 9,
    nodes: [
      {
        id: "install",
        kind: "cached",
        events: [
          { at: 0, state: "idle" },
          { at: 0.4, state: "lookup", name: INSTALL },
          { at: 1.2, state: "miss" },
          { at: 1.5, state: "building" },
          { at: 3.5, state: "ready" },
        ],
      },
      {
        id: "build",
        kind: "cached",
        events: [
          { at: 0, state: "idle" },
          { at: 0.4, state: "lookup", name: BUILD },
          { at: 1.2, state: "miss", note: "waits for install" },
          { at: 3.6, state: "building" },
          { at: 5.6, state: "ready" },
        ],
      },
      {
        id: "test",
        kind: "job",
        events: [
          { at: 0, state: "waiting" },
          { at: 5.8, state: "running" },
          { at: 7.5, state: "passed" },
        ],
      },
    ],
  },

  warm: {
    type: "chain",
    code: [
      'install: cache: { key: files("pnpm-lock.yaml") }',
      "build: from: install, cache: { key }",
      "test: from: build",
    ],
    caption:
      "Every run after that. Each name is looked up and found, so nothing is built: test starts straight from build's snapshot, with dependencies installed and output built.",
    domain: 4.5,
    realDuration: 5,
    nodes: [
      {
        id: "install",
        kind: "cached",
        events: [
          { at: 0, state: "idle", name: INSTALL },
          { at: 0.4, state: "lookup" },
          { at: 1.1, state: "hit" },
        ],
      },
      {
        id: "build",
        kind: "cached",
        events: [
          { at: 0, state: "idle", name: BUILD },
          { at: 0.4, state: "lookup" },
          { at: 1.1, state: "hit" },
        ],
      },
      {
        id: "test",
        kind: "job",
        events: [
          { at: 0, state: "waiting" },
          { at: 1.4, state: "running" },
          { at: 3.1, state: "passed" },
        ],
      },
    ],
  },

  invalidate: {
    type: "chain",
    code: [
      "pnpm-lock.yaml changed",
      "install's key → new name",
      "build starts from install → new name",
    ],
    caption:
      "A change at the top of a chain. install's key changes, so its name does. build's name includes the snapshot it starts from, so it changes too, even though build's own key didn't. Both miss and rebuild; nothing stale is ever started from.",
    domain: 9.5,
    realDuration: 10,
    nodes: [
      {
        id: "install",
        kind: "cached",
        events: [
          { at: 0, state: "ready", name: INSTALL },
          {
            at: 1,
            state: "changed",
            name: "ci/main/install/e03b9a",
            note: "pnpm-lock.yaml changed",
          },
          { at: 2.6, state: "lookup", note: undefined },
          { at: 3.2, state: "miss" },
          { at: 3.4, state: "building" },
          { at: 5, state: "ready" },
        ],
      },
      {
        id: "build",
        kind: "cached",
        events: [
          { at: 0, state: "ready", name: BUILD },
          {
            at: 1.8,
            state: "changed",
            name: "ci/main/build/5d27c1",
            note: "starts from a new install",
          },
          { at: 2.6, state: "lookup", note: undefined },
          { at: 3.2, state: "miss", note: "waits for install" },
          { at: 5.1, state: "building", note: undefined },
          { at: 6.7, state: "ready" },
        ],
      },
      {
        id: "test",
        kind: "job",
        events: [
          { at: 0, state: "idle" },
          { at: 2.6, state: "waiting" },
          { at: 6.9, state: "running" },
          { at: 8.2, state: "passed" },
        ],
      },
    ],
  },

  "cross-app": {
    type: "chain",
    code: ['test: from: image.job("platform/node-base")'],
    caption:
      "Starting from another app's job. web asks platform for node-base. platform looks it up under its own name, builds it once from its deployed commit if it's missing, and web's test starts from the snapshot.",
    domain: 6.5,
    realDuration: 7,
    edge: "image.job",
    nodes: [
      {
        id: "node-base",
        kind: "cached",
        app: "platform",
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
        events: [
          { at: 0, state: "waiting" },
          { at: 4, state: "running" },
          { at: 5.6, state: "passed" },
        ],
      },
    ],
  },

  "just-in-time": {
    type: "timeline",
    code: ['cache: { key, warm: [{ cron: "0 3 * * *" }] }'],
    caption:
      "Without warm, the first pull request after a change pays for the build while its jobs wait. With warm, a cron builds it ahead of time, so the pull request finds it and starts right away.",
    domain: 9,
    realDuration: 9,
    lanes: [
      {
        label: "Pull request, not warmed",
        bars: [
          { start: 0.3, end: 0.8, kind: "miss", label: "miss" },
          {
            start: 0.8,
            end: 5.6,
            kind: "build",
            label: "build install while test waits",
          },
          { start: 5.6, end: 7.6, kind: "run", label: "test" },
        ],
        done: { at: 7.6, label: "done" },
      },
      {
        label: "warm: 3am cron",
        bars: [{ start: 0, end: 0.3, kind: "warm", label: "" }],
        done: { at: 0.3, label: "built overnight" },
      },
      {
        label: "Pull request, warmed",
        bars: [
          { start: 0.3, end: 0.8, kind: "hit", label: "hit" },
          { start: 0.8, end: 2.8, kind: "run", label: "test" },
        ],
        done: { at: 2.8, label: "done" },
      },
    ],
  },

  herd: {
    type: "timeline",
    code: ["three pull requests push at once"],
    caption:
      "Runs that all miss at once. Each asks for the build, but builds of one name take turns and look the name up again when they start, so the first builds it and the others find its snapshot.",
    domain: 7.5,
    realDuration: 8,
    lanes: [
      {
        label: "Run 1",
        bars: [
          { start: 0.2, end: 0.6, kind: "miss", label: "miss" },
          { start: 0.6, end: 4.4, kind: "wait", label: "waits for the build" },
          { start: 4.4, end: 6.2, kind: "run", label: "test" },
        ],
      },
      {
        label: "Run 2",
        bars: [
          { start: 0.3, end: 0.7, kind: "miss", label: "miss" },
          { start: 0.7, end: 4.6, kind: "wait", label: "waits its turn" },
          { start: 4.6, end: 6.4, kind: "run", label: "test" },
        ],
      },
      {
        label: "Run 3",
        bars: [
          { start: 0.4, end: 0.8, kind: "miss", label: "miss" },
          { start: 0.8, end: 4.8, kind: "wait", label: "waits its turn" },
          { start: 4.8, end: 6.6, kind: "run", label: "test" },
        ],
      },
      {
        label: "Build of install",
        bars: [
          { start: 0.7, end: 4.3, kind: "build", label: "built once" },
          { start: 4.4, end: 5.4, kind: "hit", label: "found ×2" },
        ],
      },
    ],
  },
};

export function getScenario(id: string): Scenario | undefined {
  return scenarios[id];
}
