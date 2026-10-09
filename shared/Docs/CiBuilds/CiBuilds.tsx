"use client";

import {
  RiArrowRightLine,
  RiPauseFill,
  RiPlayFill,
  RiRestartLine,
} from "@remixicon/react";
import { Highlight, themes } from "prism-react-renderer";
import {
  ControlButton,
  useLoop,
} from "../FlowControlMarbles/FlowControlMarbles";
import {
  getScenario,
  type Bar,
  type BarKind,
  type ChainNode,
  type ChainScenario,
  type NodeState,
  type TimelineScenario,
} from "./scenarios";

/**
 * What a node shows in each state. A hue always means the same thing: blue is
 * work in progress, honey a build, green a usable snapshot, purple a new name.
 */
const STATE: Record<
  NodeState,
  { label: string; dot: string; ring: string; active: boolean }
> = {
  idle: {
    label: "",
    dot: "bg-carbon-300 dark:bg-carbon-600",
    ring: "ring-carbon-200 dark:ring-carbon-700",
    active: false,
  },
  waiting: {
    label: "waiting",
    dot: "bg-carbon-400 dark:bg-carbon-500",
    ring: "ring-carbon-300 dark:ring-carbon-600",
    active: false,
  },
  lookup: {
    label: "looking up",
    dot: "bg-breeze-500",
    ring: "ring-breeze-400 dark:ring-breeze-500",
    active: true,
  },
  hit: {
    label: "found",
    dot: "bg-matcha-500",
    ring: "ring-matcha-500",
    active: false,
  },
  miss: {
    label: "not found",
    dot: "bg-honey-500",
    ring: "ring-honey-400",
    active: false,
  },
  building: {
    label: "building",
    dot: "bg-honey-500",
    ring: "ring-honey-500",
    active: true,
  },
  ready: {
    label: "snapshot ready",
    dot: "bg-matcha-500",
    ring: "ring-matcha-500",
    active: false,
  },
  changed: {
    label: "new name",
    dot: "bg-purplehaze-500",
    ring: "ring-purplehaze-400",
    active: false,
  },
  running: {
    label: "running",
    dot: "bg-breeze-500",
    ring: "ring-breeze-500",
    active: true,
  },
  passed: {
    label: "passed",
    dot: "bg-matcha-500",
    ring: "ring-matcha-500",
    active: false,
  },
};

const BAR: Record<BarKind, string> = {
  lookup:
    "bg-breeze-200 text-breeze-900 dark:bg-breeze-500/30 dark:text-breeze-100",
  hit: "bg-matcha-400 text-matcha-900 dark:bg-matcha-500 dark:text-carbon-1000",
  miss: "bg-honey-200 text-honey-900 dark:bg-honey-500/30 dark:text-honey-100",
  wait: "bg-[repeating-linear-gradient(135deg,theme(colors.carbon.100)_0_6px,theme(colors.carbon.200)_6px_12px)] text-carbon-700 dark:bg-[repeating-linear-gradient(135deg,theme(colors.carbon.800)_0_6px,theme(colors.carbon.700)_6px_12px)] dark:text-carbon-200",
  build: "bg-honey-400 text-honey-900 dark:bg-honey-500 dark:text-carbon-1000",
  warm: "bg-purplehaze-300 text-purplehaze-900 dark:bg-purplehaze-500 dark:text-white",
  run: "bg-breeze-500 text-white dark:bg-breeze-400 dark:text-carbon-1000",
};

/** Token colours from the theme tokens, so code reads in light and dark. */
const tokenClass = (types: string[]): string => {
  if (types.includes("comment")) {
    return "text-subtle italic";
  }

  if (types.includes("string") || types.includes("template-string")) {
    return "text-matcha-700 dark:text-matcha-300";
  }

  if (types.includes("keyword")) {
    return "text-purplehaze-600 dark:text-purplehaze-300";
  }

  if (types.includes("function")) {
    return "text-breeze-600 dark:text-breeze-300";
  }

  if (types.includes("number") || types.includes("boolean")) {
    return "text-honey-700 dark:text-honey-300";
  }

  if (types.includes("punctuation") || types.includes("operator")) {
    return "text-muted";
  }

  return "text-basis";
};

/** A short, highlighted snippet: the code a part of the diagram is about. */
function Snippet({ code }: { code: string }) {
  return (
    <Highlight code={code} language="tsx" theme={themes.github}>
      {({ tokens }) => {
        return (
          <pre className="m-0 overflow-x-auto rounded-md bg-canvasSubtle px-2 py-2 font-mono text-[11px] leading-[1.55]">
            {tokens.map((line, i) => {
              return (
                <div key={i}>
                  {line.map((token, j) => {
                    return (
                      <span key={j} className={tokenClass(token.types)}>
                        {token.content}
                      </span>
                    );
                  })}
                  {line.length === 0 ? "\n" : null}
                </div>
              );
            })}
          </pre>
        );
      }}
    </Highlight>
  );
}

/** Where a node is at time `t`: the latest of its events, with names and notes carried forward. */
function nodeAt(node: ChainNode, t: number) {
  let state: NodeState = "idle";
  let since = 0;
  let name: string | undefined;
  let note: string | undefined;
  let changedAt = -1;

  for (const event of node.events) {
    if (event.at > t) {
      break;
    }

    state = event.state;
    since = event.at;

    if (event.name !== undefined) {
      if (name !== undefined && event.name !== name) {
        changedAt = event.at;
      }

      name = event.name;
    }

    if ("note" in event) {
      note = event.note;
    }
  }

  return {
    state,
    since,
    name,
    note,
    nameJustChanged: changedAt >= 0 && t - changedAt < 1.4,
  };
}

/** A status dot: pulses while the node is busy. */
function StatusDot({ state }: { state: NodeState }) {
  const look = STATE[state];

  return (
    <span className="relative flex h-2.5 w-2.5 shrink-0">
      {look.active && (
        <span
          className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 motion-reduce:hidden ${look.dot}`}
        />
      )}
      <span
        className={`relative inline-flex h-2.5 w-2.5 rounded-full ${look.dot}`}
      />
    </span>
  );
}

const FLOWING: NodeState[] = ["lookup", "building", "waiting", "miss"];

/** The flash a node gives when its state changes, in that state's colour. */
const FLASH_KEYFRAMES =
  "@keyframes ci-builds-flash { from { opacity: 0.35; } to { opacity: 0; } }";

function Chain({ scenario, t }: { scenario: ChainScenario; t: number }) {
  const nodes = scenario.nodes.map((node) => {
    return { node, at: nodeAt(node, t) };
  });

  return (
    <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-end">
      <style>{FLASH_KEYFRAMES}</style>
      {nodes.map(({ node, at }, i) => {
        const look = STATE[at.state];
        const next = nodes[i + 1];
        const flowing =
          next !== undefined &&
          (FLOWING.includes(at.state) || FLOWING.includes(next.at.state));

        return (
          <div key={node.id} className="contents">
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <Snippet code={node.code} />
              <div
                className={`relative h-[84px] rounded-lg bg-canvasBase px-3 py-2.5 ring-2 ring-inset transition-shadow duration-300 motion-reduce:transition-none ${look.ring}`}
              >
                {at.since > 0 && (
                  <span
                    key={`${at.state}-${at.since}`}
                    aria-hidden
                    className={`pointer-events-none absolute inset-0 rounded-lg opacity-0 motion-reduce:hidden ${look.dot}`}
                    style={{ animation: "ci-builds-flash 0.9s ease-out" }}
                  />
                )}
                <div className="relative flex items-center gap-2">
                  {node.app && (
                    <span className="rounded bg-canvasMuted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted">
                      {node.app}
                    </span>
                  )}
                  <span className="truncate font-mono text-[13px] font-semibold text-basis">
                    {node.id}
                  </span>
                  <span className="ml-auto flex items-center gap-1.5 whitespace-nowrap text-[11px] text-muted">
                    {look.label}
                    <StatusDot state={at.state} />
                  </span>
                </div>
                <div
                  className={`relative mt-1 truncate font-mono text-[11px] transition-colors duration-500 motion-reduce:transition-none ${
                    at.nameJustChanged
                      ? "text-purplehaze-600 dark:text-purplehaze-300"
                      : "text-muted"
                  }`}
                >
                  {node.kind === "cached"
                    ? at.name ?? " "
                    : "no cache: runs every time"}
                </div>
                <div className="relative mt-0.5 h-4 truncate text-[11px] text-subtle">
                  {at.note ?? ""}
                </div>
              </div>
            </div>
            {next && (
              <div className="flex shrink-0 items-center justify-center sm:h-[84px] sm:w-5">
                <RiArrowRightLine
                  className={`h-4 w-4 rotate-90 transition-colors sm:rotate-0 ${
                    flowing
                      ? "animate-pulse text-breeze-500 motion-reduce:animate-none"
                      : "text-carbon-300 dark:text-carbon-600"
                  }`}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function TimelineBar({
  bar,
  t,
  domain,
}: {
  bar: Bar;
  t: number;
  domain: number;
}) {
  if (t < bar.start) {
    return null;
  }

  const shown = Math.min(t, bar.end) - bar.start;
  const left = (bar.start / domain) * 100;
  const width = (Math.max(shown, 0.02) / domain) * 100;

  return (
    <div
      className={`absolute inset-y-0 flex items-center overflow-hidden whitespace-nowrap rounded px-1.5 text-[11px] font-medium ${
        BAR[bar.kind]
      }`}
      style={{ left: `${left}%`, width: `${width}%` }}
      title={bar.label}
    >
      {bar.label}
    </div>
  );
}

function Timeline({ scenario, t }: { scenario: TimelineScenario; t: number }) {
  return (
    <div className="flex flex-col gap-3">
      <Snippet code={scenario.code} />
      <div className="flex flex-col gap-2">
        {scenario.lanes.map((lane) => {
          return (
            <div
              key={lane.label}
              className="grid grid-cols-1 gap-1 sm:grid-cols-[10rem_1fr] sm:items-center sm:gap-2"
            >
              <div className="truncate text-[11px] font-medium text-subtle sm:text-xs">
                {lane.label}
              </div>
              <div className="relative h-6 rounded bg-canvasSubtle">
                {lane.bars.map((bar) => {
                  return (
                    <TimelineBar
                      key={`${bar.start}-${bar.label}`}
                      bar={bar}
                      t={t}
                      domain={scenario.domain}
                    />
                  );
                })}
                {lane.done && t >= lane.done.at && (
                  <span
                    className="absolute inset-y-0 ml-1.5 flex items-center whitespace-nowrap font-mono text-[11px] font-semibold text-basis"
                    style={{
                      left: `${(lane.done.at / scenario.domain) * 100}%`,
                    }}
                  >
                    {lane.done.label}
                  </span>
                )}
              </div>
            </div>
          );
        })}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-[10rem_1fr]">
          <span className="hidden sm:block" />
          <div className="relative h-px bg-carbon-200 dark:bg-carbon-700">
            <span
              className="absolute -top-1 h-2 w-0.5 rounded bg-carbon-500 dark:bg-carbon-400"
              style={{ left: `${Math.min(t / scenario.domain, 1) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * An animated diagram of how Inngest CI finds and builds the snapshots jobs
 * start from: chains of cached jobs, invalidation, warming and builds shared
 * by many runs. Each part sits under the code it's about. It plays while on
 * screen and rests on its last frame with reduced motion.
 */
export function CiBuilds({ scenario: id }: { scenario: string }) {
  const scenario = getScenario(id);

  const { rootRef, t, playing, toggle, replay } = useLoop(
    scenario?.domain ?? 1,
    scenario?.realDuration ?? 1
  );

  if (!scenario) {
    return process.env.NODE_ENV === "development" ? (
      <p className="text-error">Unknown CI scenario: {id}</p>
    ) : null;
  }

  return (
    <figure
      ref={rootRef}
      className="not-prose my-8 flex flex-col gap-2 rounded-xl bg-canvasSubtle p-3 leading-normal text-basis sm:p-4"
    >
      <div
        className="rounded-lg bg-canvasBase p-2"
        role="img"
        aria-label={scenario.caption}
      >
        {scenario.type === "chain" ? (
          <Chain scenario={scenario} t={t} />
        ) : (
          <Timeline scenario={scenario} t={t} />
        )}
      </div>

      <figcaption className="m-0 flex items-start gap-2 text-xs leading-relaxed text-subtle">
        <span className="flex-1">{scenario.caption}</span>
        <span className="-my-1 flex shrink-0 items-center gap-0.5">
          <ControlButton label={playing ? "Pause" : "Play"} onClick={toggle}>
            {playing ? (
              <RiPauseFill className="h-3.5 w-3.5" />
            ) : (
              <RiPlayFill className="h-3.5 w-3.5" />
            )}
          </ControlButton>
          <ControlButton label="Replay" onClick={replay}>
            <RiRestartLine className="h-3.5 w-3.5" />
          </ControlButton>
        </span>
      </figcaption>
    </figure>
  );
}
