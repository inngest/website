"use client";

import {
  RiArrowRightLine,
  RiPauseFill,
  RiPlayFill,
  RiRestartLine,
} from "@remixicon/react";
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

/** What a node shows in each state. A hue always means the same thing. */
const STATE: Record<NodeState, { label: string; ring: string; pill: string }> =
  {
    idle: {
      label: "",
      ring: "ring-carbon-200 dark:ring-carbon-700",
      pill: "",
    },
    waiting: {
      label: "waiting",
      ring: "ring-carbon-300 dark:ring-carbon-600",
      pill: "bg-carbon-100 text-carbon-700 dark:bg-carbon-800 dark:text-carbon-200",
    },
    lookup: {
      label: "looking up",
      ring: "ring-breeze-400 dark:ring-breeze-500",
      pill: "bg-breeze-100 text-breeze-800 dark:bg-breeze-500/20 dark:text-breeze-200",
    },
    hit: {
      label: "hit · reused",
      ring: "ring-matcha-500",
      pill: "bg-matcha-100 text-matcha-800 dark:bg-matcha-500/20 dark:text-matcha-200",
    },
    miss: {
      label: "miss",
      ring: "ring-honey-400",
      pill: "bg-honey-100 text-honey-900 dark:bg-honey-500/20 dark:text-honey-200",
    },
    building: {
      label: "building",
      ring: "ring-honey-500",
      pill: "bg-honey-100 text-honey-900 dark:bg-honey-500/20 dark:text-honey-200",
    },
    ready: {
      label: "snapshot ready",
      ring: "ring-matcha-500",
      pill: "bg-matcha-100 text-matcha-800 dark:bg-matcha-500/20 dark:text-matcha-200",
    },
    changed: {
      label: "new name",
      ring: "ring-purplehaze-400",
      pill: "bg-purplehaze-100 text-purplehaze-800 dark:bg-purplehaze-500/20 dark:text-purplehaze-200",
    },
    running: {
      label: "running",
      ring: "ring-breeze-500",
      pill: "bg-breeze-100 text-breeze-800 dark:bg-breeze-500/20 dark:text-breeze-200",
    },
    passed: {
      label: "passed",
      ring: "ring-matcha-500",
      pill: "bg-matcha-100 text-matcha-800 dark:bg-matcha-500/20 dark:text-matcha-200",
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

/** Where a node is at time `t`: the latest of its events, with names and notes carried forward. */
function nodeAt(node: ChainNode, t: number) {
  let state: NodeState = "idle";
  let name: string | undefined;
  let note: string | undefined;
  let changedAt = -1;

  for (const event of node.events) {
    if (event.at > t) {
      break;
    }

    state = event.state;

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
    name,
    note,
    nameJustChanged: changedAt >= 0 && t - changedAt < 1.4,
  };
}

const FLOWING: NodeState[] = ["lookup", "building", "waiting", "miss"];

function Chain({ scenario, t }: { scenario: ChainScenario; t: number }) {
  const nodes = scenario.nodes.map((node) => {
    return { node, at: nodeAt(node, t) };
  });

  return (
    <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
      {nodes.map(({ node, at }, i) => {
        const look = STATE[at.state];
        const next = nodes[i + 1];
        const flowing =
          next !== undefined &&
          (FLOWING.includes(at.state) || FLOWING.includes(next.at.state));

        return (
          <div key={node.id} className="contents">
            <div
              className={`min-w-0 flex-1 rounded-lg bg-canvasBase px-3 py-2.5 ring-2 ring-inset transition-shadow duration-300 motion-reduce:transition-none ${look.ring}`}
            >
              <div className="flex items-center gap-2">
                {node.app && (
                  <span className="rounded bg-canvasMuted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted">
                    {node.app}
                  </span>
                )}
                <span className="font-mono text-[13px] font-semibold text-basis">
                  {node.id}
                </span>
                {look.label && (
                  <span
                    className={`ml-auto whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      look.pill
                    } ${
                      at.state === "building" || at.state === "lookup"
                        ? "animate-pulse motion-reduce:animate-none"
                        : ""
                    }`}
                  >
                    {look.label}
                  </span>
                )}
              </div>
              <div
                className={`mt-1 truncate font-mono text-[11px] transition-colors duration-500 motion-reduce:transition-none ${
                  at.nameJustChanged
                    ? "text-purplehaze-600 dark:text-purplehaze-300"
                    : "text-muted"
                }`}
              >
                {node.kind === "cached"
                  ? at.name ?? " "
                  : "no cache: runs every time"}
              </div>
              <div className="mt-0.5 h-4 truncate text-[11px] text-subtle">
                {at.note ?? ""}
              </div>
            </div>
            {next && (
              <div className="flex shrink-0 flex-col items-center justify-center text-[10px] text-muted sm:w-16">
                <RiArrowRightLine
                  className={`h-4 w-4 rotate-90 transition-colors sm:rotate-0 ${
                    flowing
                      ? "animate-pulse text-breeze-500 motion-reduce:animate-none"
                      : "text-carbon-300 dark:text-carbon-600"
                  }`}
                />
                {scenario.edge && (
                  <span className="font-mono">{scenario.edge}</span>
                )}
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
                  style={{ left: `${(lane.done.at / scenario.domain) * 100}%` }}
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
  );
}

/**
 * An animated diagram of how Inngest CI finds and builds the snapshots jobs
 * start from: chains of cached jobs, invalidation, warming and builds shared
 * by many runs. It plays while on screen and rests on its last frame with
 * reduced motion.
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
      className="not-prose my-8 flex flex-col gap-3 rounded-xl bg-canvasSubtle p-3 leading-normal text-basis sm:p-4"
    >
      <div className="flex flex-wrap items-center gap-2">
        {scenario.code.map((c) => {
          return (
            <code
              key={c}
              className="min-w-0 max-w-full truncate rounded-md bg-canvasBase px-2 py-1 font-mono text-[11px] text-basis ring-1 ring-inset ring-carbon-200 dark:ring-carbon-700 sm:text-xs"
            >
              {c}
            </code>
          );
        })}
        <div className="ml-auto flex items-center gap-0.5">
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
        </div>
      </div>

      <div
        className="rounded-lg bg-canvasBase p-2 sm:p-3"
        role="img"
        aria-label={scenario.caption}
      >
        {scenario.type === "chain" ? (
          <Chain scenario={scenario} t={t} />
        ) : (
          <Timeline scenario={scenario} t={t} />
        )}
      </div>

      <figcaption className="m-0 text-xs leading-relaxed text-subtle">
        {scenario.caption}
      </figcaption>
    </figure>
  );
}
