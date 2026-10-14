"use client";

import {
  RiArrowDownLine,
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
  type Lane,
  type Scenario,
} from "./scenarios";

const BAR: Record<BarKind, string> = {
  lookup:
    "bg-breeze-200 text-breeze-900 dark:bg-breeze-500/30 dark:text-breeze-100",
  hit: "bg-matcha-400 text-matcha-900 dark:bg-matcha-500 dark:text-carbon-1000",
  miss: "bg-honey-200 text-honey-900 dark:bg-honey-500/30 dark:text-honey-100",
  wait: "bg-[repeating-linear-gradient(135deg,theme(colors.carbon.100)_0_6px,theme(colors.carbon.200)_6px_12px)] text-carbon-700 dark:bg-[repeating-linear-gradient(135deg,theme(colors.carbon.800)_0_6px,theme(colors.carbon.700)_6px_12px)] dark:text-carbon-200",
  build: "bg-honey-400 text-honey-900 dark:bg-honey-500 dark:text-carbon-1000",
  warm: "bg-purplehaze-300 text-purplehaze-900 dark:bg-purplehaze-500 dark:text-white",
  warn: "bg-honey-300 text-honey-900 outline outline-2 -outline-offset-2 outline-honey-600 dark:bg-honey-500 dark:text-carbon-1000",
  run: "bg-breeze-500 text-white dark:bg-breeze-400 dark:text-carbon-1000",
};

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

  const shown = bar.instant
    ? bar.end - bar.start
    : Math.min(t, bar.end) - bar.start;
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

/** Lanes in the order given, split wherever the group changes. */
function groupLanes(lanes: Lane[]) {
  const groups: { name?: string; link?: string; lanes: Lane[] }[] = [];

  lanes.forEach((lane) => {
    const last = groups[groups.length - 1];

    if (last && last.name !== undefined && last.name === lane.group) {
      last.lanes.push(lane);
    } else {
      groups.push({ name: lane.group, link: lane.link, lanes: [lane] });
    }
  });

  return groups;
}

function LaneRow({
  lane,
  t,
  domain,
}: {
  lane: Lane;
  t: number;
  domain: number;
}) {
  return (
    <div className="grid grid-cols-1 gap-1 sm:grid-cols-[7rem_1fr] sm:items-center sm:gap-2">
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
              domain={domain}
            />
          );
        })}
        {lane.done && t >= lane.done.at && (
          <span
            className="absolute inset-y-0 ml-1.5 flex items-center whitespace-nowrap font-mono text-[11px] font-semibold text-basis"
            style={{ left: `${(lane.done.at / domain) * 100}%` }}
          >
            {lane.done.label}
          </span>
        )}
      </div>
    </div>
  );
}

function Timeline({ scenario, t }: { scenario: Scenario; t: number }) {
  const groups = groupLanes(scenario.lanes);

  return (
    <div className="flex flex-col gap-2">
      {groups.map((group, i) => {
        const rows = group.lanes.map((lane) => {
          return (
            <LaneRow
              key={lane.label}
              lane={lane}
              t={t}
              domain={scenario.domain}
            />
          );
        });

        if (group.name === undefined) {
          return (
            <div key={i} className="flex flex-col gap-2">
              {rows}
            </div>
          );
        }

        return (
          <div key={group.name} className="flex flex-col gap-2">
            {group.link && (
              <div className="flex items-center gap-1.5 pl-1 text-[11px] text-subtle">
                <RiArrowDownLine className="h-3.5 w-3.5 text-breeze-500" />
                {group.link}
              </div>
            )}
            <div className="flex flex-col gap-2 rounded-md p-2 ring-1 ring-inset ring-carbon-200 dark:ring-carbon-700">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                {group.name}
              </div>
              {rows}
            </div>
          </div>
        );
      })}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-[7rem_1fr] sm:px-2">
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
 * An animated trace of how Inngest CI finds and builds the images jobs start
 * from: cache hits and misses, refreshing and builds shared by many pipeline
 * runs. Pipeline runs sit in separate labelled boxes. It plays while on screen
 * and rests on its last frame with reduced motion.
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
        <Timeline scenario={scenario} t={t} />
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
