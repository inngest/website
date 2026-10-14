/**
 * Scenarios for the Inngest CI build diagrams. Each one is a small script of
 * timed states, in seconds, that the diagram plays and loops.
 */

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
  /** Drawn in full from its start, rather than growing. */
  instant?: boolean;
}

export interface Lane {
  label: string;
  /** Lanes with the same group sit together in one labelled box. */
  group?: string;
  /** On a group's first lane: what links it to the group above. */
  link?: string;
  bars: Bar[];
  /** Shown at the end of the lane once the time passes. */
  done?: { at: number; label: string };
}

export interface Scenario {
  caption: string;
  domain: number;
  realDuration: number;
  lanes: Lane[];
}

const scenarios: Record<string, Scenario> = {
  "cross-app": {
    caption:
      "web's test needs node-base from platform. platform builds it in its own pipeline run, and web's test starts from it.",
    domain: 7,
    realDuration: 7,
    lanes: [
      {
        label: "node-base",
        group: "platform app · its own build run",
        bars: [
          { start: 0.8, end: 1.6, kind: "miss", label: "miss" },
          { start: 1.6, end: 4.2, kind: "build", label: "build" },
        ],
        done: { at: 4.2, label: "cached" },
      },
      {
        label: "test",
        group: "web app · pipeline run",
        link: "web asks platform for node-base",
        bars: [
          {
            start: 0.4,
            end: 4.2,
            kind: "wait",
            label: "waits for platform's build",
          },
          { start: 4.2, end: 5.8, kind: "run", label: "test" },
        ],
        done: { at: 5.8, label: "passed" },
      },
    ],
  },

  "parent-once": {
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
    caption:
      "Without a cache, each pipeline run builds install again, then throws it away.",
    domain: 11,
    realDuration: 10,
    lanes: [
      {
        label: "install",
        group: "Pipeline run 1",
        bars: [{ start: 0.2, end: 3.4, kind: "build", label: "build" }],
      },
      {
        label: "test",
        group: "Pipeline run 1",
        bars: [
          { start: 0.2, end: 3.4, kind: "wait", label: "waits" },
          { start: 3.4, end: 5, kind: "run", label: "test" },
        ],
        done: { at: 5, label: "passed" },
      },
      {
        label: "install",
        group: "Pipeline run 2",
        bars: [{ start: 5.6, end: 8.8, kind: "build", label: "build again" }],
      },
      {
        label: "test",
        group: "Pipeline run 2",
        bars: [
          { start: 5.6, end: 8.8, kind: "wait", label: "waits" },
          { start: 8.8, end: 10.4, kind: "run", label: "test" },
        ],
        done: { at: 10.4, label: "passed" },
      },
    ],
  },

  "warn-uncached": {
    caption:
      "A job that others start from, with no cache, is rebuilt in every pipeline run.",
    domain: 5,
    realDuration: 5,
    lanes: [
      {
        label: "Pipeline warnings",
        bars: [
          {
            start: 0,
            end: 5,
            instant: true,
            kind: "warn",
            label:
              "rebuilt every pipeline run: `install` (add `cache` to keep it across pipeline runs)",
          },
        ],
      },
    ],
  },

  "warn-jit": {
    caption:
      "A cached job with no refresh is built by the pipeline run that needs it, which waits.",
    domain: 5,
    realDuration: 5,
    lanes: [
      {
        label: "Pipeline warnings",
        bars: [
          {
            start: 0,
            end: 5,
            instant: true,
            kind: "warn",
            label:
              "built just in time: `install` (add `cache.refresh` to build it ahead of time)",
          },
        ],
      },
    ],
  },

  "cache-key": {
    caption:
      "The first pipeline run builds install. The second finds it and starts at once.",
    domain: 11,
    realDuration: 10,
    lanes: [
      {
        label: "install",
        group: "Pipeline run 1",
        bars: [
          { start: 0.2, end: 1.1, kind: "miss", label: "miss" },
          { start: 1.1, end: 4.2, kind: "build", label: "build" },
        ],
      },
      {
        label: "test",
        group: "Pipeline run 1",
        bars: [
          { start: 1.1, end: 4.2, kind: "wait", label: "waits" },
          { start: 4.2, end: 5.7, kind: "run", label: "test" },
        ],
        done: { at: 5.7, label: "passed" },
      },
      {
        label: "install",
        group: "Pipeline run 2",
        bars: [{ start: 6.3, end: 7.2, kind: "hit", label: "found" }],
      },
      {
        label: "test",
        group: "Pipeline run 2",
        bars: [{ start: 7.2, end: 8.7, kind: "run", label: "test" }],
        done: { at: 8.7, label: "passed" },
      },
    ],
  },

  refresh: {
    caption:
      "The 3am cron builds install ahead of time. The next pipeline run finds it and starts at once.",
    domain: 9,
    realDuration: 9,
    lanes: [
      {
        label: "install",
        group: "Background build",
        bars: [{ start: 0.2, end: 3.6, kind: "build", label: "built at 3am" }],
        done: { at: 3.6, label: "cached" },
      },
      {
        label: "install",
        group: "Pipeline run",
        bars: [{ start: 4.6, end: 5.5, kind: "hit", label: "found" }],
      },
      {
        label: "test",
        group: "Pipeline run",
        bars: [{ start: 5.5, end: 7.5, kind: "run", label: "test" }],
        done: { at: 7.5, label: "passed" },
      },
    ],
  },

  many: {
    caption:
      "Five pipeline runs ask for the same build. It happens once, and all five resume together.",
    domain: 8,
    realDuration: 8,
    lanes: [
      {
        label: "test",
        group: "Pipeline run 1",
        bars: [
          { start: 0.2, end: 1.1, kind: "miss", label: "miss" },
          { start: 1.1, end: 4.4, kind: "wait", label: "waits for the build" },
          { start: 4.4, end: 6.2, kind: "run", label: "test" },
        ],
      },
      {
        label: "test",
        group: "Pipeline run 2",
        bars: [
          { start: 0.3, end: 1.2, kind: "miss", label: "miss" },
          { start: 1.2, end: 4.4, kind: "wait", label: "waits for the build" },
          { start: 4.4, end: 6.5, kind: "run", label: "test" },
        ],
      },
      {
        label: "test",
        group: "Pipeline run 3",
        bars: [
          { start: 0.4, end: 1.3, kind: "miss", label: "miss" },
          { start: 1.3, end: 4.4, kind: "wait", label: "waits for the build" },
          { start: 4.4, end: 6.8, kind: "run", label: "test" },
        ],
      },
      {
        label: "test",
        group: "Pipeline run 4",
        bars: [
          { start: 0.5, end: 1.4, kind: "miss", label: "miss" },
          { start: 1.4, end: 4.4, kind: "wait", label: "waits for the build" },
          { start: 4.4, end: 7.2, kind: "run", label: "test" },
        ],
      },
      {
        label: "test",
        group: "Pipeline run 5",
        bars: [
          { start: 0.6, end: 1.5, kind: "miss", label: "miss" },
          { start: 1.5, end: 4.4, kind: "wait", label: "waits for the build" },
          { start: 4.4, end: 7.6, kind: "run", label: "test" },
        ],
      },
      {
        label: "install",
        group: "The one shared build",
        bars: [
          { start: 0.7, end: 4.3, kind: "build", label: "install, built once" },
        ],
        done: { at: 4.3, label: "shared with all five" },
      },
    ],
  },
};

export function getScenario(id: string): Scenario | undefined {
  return scenarios[id];
}
