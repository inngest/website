import { Fragment } from "react";

import { cn } from "@/utils/v1/cn";

/**
 * Scheduled & cron jobs illustration — a timeline of a daily cron's
 * recent runs: three completed (green), one currently running (blue,
 * with a spinning dashed circle), and one still scheduled (dim white,
 * with a clock icon). Each row pairs a day label with a small 5-cell
 * step strip and a status badge; vertical dashed connectors run
 * between rows.
 *
 * Animation: the running row's status badge spins via Tailwind's
 * built-in `animate-spin`. The `motion-safe:` prefix automatically
 * disables it under `prefers-reduced-motion: reduce`.
 *
 * Geometry mirrors the design frame; the layout is a normal flex
 * column of rows + connectors rather than absolute coordinates.
 */

export const NATURAL_W = 334;
// 5 rows (h-[22px]) + 4 connectors (51px) = 314.
export const NATURAL_H = 5 * 22 + 4 * 51;
const W = NATURAL_W;

// Connector is positioned horizontally to land at the strip's
// vertical center: (day-label width) + (gap) + (strip width / 2).
const CONNECTOR_X = 138;
const CONNECTOR_HEIGHT = 51;

type RunState = "done" | "running" | "scheduled";

const RUNS: ReadonlyArray<{ day: string; state: RunState; status: string }> = [
  { day: "Mon 9am", state: "done", status: "OK" },
  { day: "Tue 9am", state: "done", status: "OK" },
  { day: "Wed 9am", state: "done", status: "OK" },
  { day: "Thur 9am", state: "running", status: "Running..." },
  { day: "Fri 9am", state: "scheduled", status: "Scheduled" },
];

const LABEL_CLASS = "font-v1Mono text-[10px] uppercase leading-[1.5] sm:text-[14px]";

// All visible stroke / fill / text for a row follow a single accent.
// `scheduled` rows additionally get `opacity-40` on the row container
// to dim everything together (the faded "pending" look).
const STATE_STROKE: Record<RunState, string> = {
  done: "rgb(var(--color-v1-accent-green))",
  running: "rgb(var(--color-v1-accent-blue))",
  scheduled: "rgb(var(--color-v1-frost))",
};

const STATE_TEXT_CLASS: Record<RunState, string> = {
  done: "text-v1-accent-green",
  running: "text-v1-accent-blue",
  scheduled: "text-v1-frost",
};

export default function ScheduledCronWidget() {
  return (
    <div
      className="flex shrink-0 flex-col"
      style={{ width: W }}
      aria-hidden="true"
    >
      {RUNS.map((run, i) => (
        <Fragment key={run.day}>
          {i > 0 && <Connector state={run.state} />}
          <CronRow run={run} />
        </Fragment>
      ))}
    </div>
  );
}

function CronRow({ run }: { run: (typeof RUNS)[number] }) {
  return (
    <div
      className={cn(
        "flex h-[22px] items-center",
        run.state === "scheduled" && "opacity-40"
      )}
    >
      <span
        className={cn(
          "w-[80px] pr-2 text-right",
          LABEL_CLASS,
          STATE_TEXT_CLASS[run.state]
        )}
      >
        {run.day}
      </span>
      <StepStrip state={run.state} />
      <StatusBadge state={run.state} label={run.status} />
    </div>
  );
}

function Connector({ state }: { state: RunState }) {
  const dim = state === "scheduled";
  return (
    <div className="relative" style={{ height: CONNECTOR_HEIGHT }}>
      <svg
        className="absolute top-0"
        style={{ left: CONNECTOR_X }}
        width="1"
        height={CONNECTOR_HEIGHT}
        opacity={dim ? 0.4 : 1}
      >
        <line
          x1="0.5"
          y1="0"
          x2="0.5"
          y2={CONNECTOR_HEIGHT}
          stroke={STATE_STROKE[state]}
          strokeDasharray="2.8 2.8"
        />
      </svg>
    </div>
  );
}

// Strip-cell geometry (matches the Multi-step LLM strip): 4 dividers
// and 5 dots inside a 100.8 × 18.4 outline. Dot coordinates start at
// the outline's local origin.
const STRIP_W = 100.8;
const STRIP_H = 18.4;
const DIVIDER_X = [20.15, 40.3, 60.46, 80.61];
const DOT_X = [8.94, 29.22, 49.51, 69.79, 88.23];
const DOT_SIZE = 3.7;

function StepStrip({ state }: { state: RunState }) {
  const color = STATE_STROKE[state];
  return (
    <svg
      className="ml-2 shrink-0"
      width={STRIP_W}
      height={STRIP_H}
      viewBox={`0 0 ${STRIP_W} ${STRIP_H}`}
    >
      <rect
        x="0.5"
        y="0.5"
        width={STRIP_W - 1}
        height={STRIP_H - 1}
        stroke={color}
        fill="none"
      />
      {DIVIDER_X.map((x) => (
        <line key={x} x1={x} y1="0" x2={x} y2={STRIP_H} stroke={color} />
      ))}
      {DOT_X.map((x) => (
        <rect
          key={x}
          x={x}
          y={(STRIP_H - DOT_SIZE) / 2}
          width={DOT_SIZE}
          height={DOT_SIZE}
          fill={color}
        />
      ))}
    </svg>
  );
}

const STATUS_ICON_BY_STATE: Record<RunState, () => React.ReactElement> = {
  done: OkIcon,
  running: SpinnerIcon,
  scheduled: ScheduledIcon,
};

function StatusBadge({ state, label }: { state: RunState; label: string }) {
  const Icon = STATUS_ICON_BY_STATE[state];
  return (
    <>
      <Icon />
      <span className={cn("ml-[7px]", LABEL_CLASS, STATE_TEXT_CLASS[state])}>
        {label}
      </span>
    </>
  );
}

const ICON_CLASS = "ml-4 shrink-0";

function OkIcon() {
  return (
    <svg
      className={cn(ICON_CLASS, "text-v1-accent-green")}
      width="22"
      height="22"
      viewBox="0 0 23 23"
      fill="none"
    >
      <circle cx="11.5" cy="11.5" r="11" stroke="currentColor" />
      <path
        d="M16.33 8.6L10.03 14.91L6.33 11.21"
        stroke="currentColor"
      />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      className={cn(ICON_CLASS, "text-v1-accent-blue motion-safe:animate-spin")}
      width="22"
      height="22"
      viewBox="0 0 23 23"
      fill="none"
    >
      <circle
        cx="11.5"
        cy="11.5"
        r="11"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
    </svg>
  );
}

function ScheduledIcon() {
  return (
    <svg
      className={cn(ICON_CLASS, "text-v1-frost")}
      width="22"
      height="22"
      viewBox="0 0 23 23"
      fill="none"
    >
      <circle cx="11.5" cy="11.5" r="11" stroke="currentColor" />
      <path d="M11 7V14H16" stroke="currentColor" />
    </svg>
  );
}
