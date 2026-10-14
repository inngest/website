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

export type Tone = "saved" | "baseline";

export interface Timer {
  /** What the counter reads when the group finishes. */
  seconds: number;
  /** Green when the run saved time, amber when it paid for its own build. */
  tone: Tone;
  /** A pill beside the counter, shown once the group finishes. */
  note: string;
}

export interface Summary {
  tone: Tone;
  /** The bold lead, e.g. "1 build instead of 5". */
  headline: string;
  /** What it adds up to, e.g. "saved ~11m of build time". */
  detail: string;
}

export interface Lane {
  label: string;
  /** Lanes with the same group sit together in one labelled box. */
  group?: string;
  /** On a group's first lane: what links it to the group above. */
  link?: string;
  /** On a group's first lane: a fake elapsed-time counter in its header. */
  timer?: Timer;
  bars: Bar[];
  /** Shown at the end of the lane once the time passes. */
  done?: {
    at: number;
    label: string;
    /** Drawn as a green pill instead of plain text. */
    highlight?: boolean;
  };
}

export interface Scenario {
  caption: string;
  domain: number;
  realDuration: number;
  lanes: Lane[];
  /** Shown under the pipeline runs once the scenario finishes. */
  summary?: Summary;
}

/** What a pipeline run waits for when it has to build install itself. */
const BUILD_SECONDS = 161;

/** What a pipeline run waits for when install is already cached. */
const CACHED_SECONDS = 41;

/** "2:41" for the counters. */
export function formatTime(seconds: number) {
  const whole = Math.floor(seconds);

  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

/** "2m" or "5m 22s" for savings. */
function formatSaved(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;

  if (rest === 0) {
    return `${minutes}m`;
  }

  return minutes === 0 ? `${rest}s` : `${minutes}m ${rest}s`;
}

const cacheSaved = BUILD_SECONDS - CACHED_SECONDS;

const sharedRuns = 5;

const sharedSaved = (sharedRuns - 1) * BUILD_SECONDS;

const scenarios: Record<string, Scenario> = {
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
    summary: {
      tone: "baseline",
      headline: "2 builds, nothing shared",
      detail: `${formatTime(BUILD_SECONDS)} each, ${formatSaved(
        2 * BUILD_SECONDS
      )} of build time`,
    },
    lanes: [
      {
        label: "install",
        group: "Pipeline run 1",
        timer: { seconds: BUILD_SECONDS, tone: "baseline", note: "own build" },
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
        timer: { seconds: BUILD_SECONDS, tone: "baseline", note: "own build" },
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

  "cache-key": {
    caption:
      "The first pipeline run builds install. The second finds it and starts at once.",
    domain: 11,
    realDuration: 10,
    summary: {
      tone: "saved",
      headline: "1 build instead of 2",
      detail: `saved ${formatSaved(cacheSaved)} on pipeline run 2`,
    },
    lanes: [
      {
        label: "install",
        group: "Pipeline run 1",
        timer: { seconds: BUILD_SECONDS, tone: "baseline", note: "built it" },
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
        timer: {
          seconds: CACHED_SECONDS,
          tone: "saved",
          note: `${formatSaved(cacheSaved)} faster`,
        },
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
    summary: {
      tone: "saved",
      headline: "Built at 3am, not on the clock",
      detail: `saved ${formatSaved(cacheSaved)} on the pipeline run`,
    },
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
        timer: {
          seconds: CACHED_SECONDS,
          tone: "saved",
          note: `${formatSaved(cacheSaved)} faster`,
        },
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
    summary: {
      tone: "saved",
      headline: `1 build instead of ${sharedRuns}`,
      detail: `saved ~${Math.round(sharedSaved / 60)}m of build time`,
    },
    lanes: [
      {
        label: "test",
        group: "Pipeline run 1",
        timer: { seconds: 190, tone: "saved", note: "shared build" },
        bars: [
          { start: 0.2, end: 1.1, kind: "miss", label: "miss" },
          { start: 1.1, end: 4.4, kind: "wait", label: "waits for the build" },
          { start: 4.4, end: 6.2, kind: "run", label: "test" },
        ],
      },
      {
        label: "test",
        group: "Pipeline run 2",
        timer: { seconds: 193, tone: "saved", note: "shared build" },
        bars: [
          { start: 0.3, end: 1.2, kind: "miss", label: "miss" },
          { start: 1.2, end: 4.4, kind: "wait", label: "waits for the build" },
          { start: 4.4, end: 6.5, kind: "run", label: "test" },
        ],
      },
      {
        label: "test",
        group: "Pipeline run 3",
        timer: { seconds: 196, tone: "saved", note: "shared build" },
        bars: [
          { start: 0.4, end: 1.3, kind: "miss", label: "miss" },
          { start: 1.3, end: 4.4, kind: "wait", label: "waits for the build" },
          { start: 4.4, end: 6.8, kind: "run", label: "test" },
        ],
      },
      {
        label: "test",
        group: "Pipeline run 4",
        timer: { seconds: 201, tone: "saved", note: "shared build" },
        bars: [
          { start: 0.5, end: 1.4, kind: "miss", label: "miss" },
          { start: 1.4, end: 4.4, kind: "wait", label: "waits for the build" },
          { start: 4.4, end: 7.2, kind: "run", label: "test" },
        ],
      },
      {
        label: "test",
        group: "Pipeline run 5",
        timer: { seconds: 205, tone: "saved", note: "shared build" },
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
        done: {
          at: 4.3,
          label: `did the work for ${sharedRuns} runs`,
          highlight: true,
        },
      },
    ],
  },
};

export function getScenario(id: string): Scenario | undefined {
  return scenarios[id];
}
