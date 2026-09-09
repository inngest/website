"use client";

import { useEffect, useState } from "react";

const NODES = [
  { id: 0, due: 0, x: 90, y: 250, label: "0s" },
  { id: 1, due: 1, x: 175, y: 170, label: "1s" },
  { id: 2, due: 2, x: 260, y: 250, label: "2s" },
  { id: 3, due: 4, x: 345, y: 90, label: "4s" },
  { id: 4, due: 7, x: 430, y: 250, label: "7s" },
  { id: 5, due: 12, x: 515, y: 170, label: "12s" },
  { id: 6, due: 20, x: 600, y: 250, label: "20s" },
] as const;

const EDGES: [number, number][] = [
  [3, 1],
  [3, 5],
  [1, 0],
  [1, 2],
  [5, 4],
  [5, 6],
];

const ANCHORS: [number, number][] = NODES.map((n) => [n.due, n.x]);

const MAX = 24;

function xAt(t: number): number {
  if (t <= 0) return 90;
  if (t >= 20) return Math.min(600 + (t - 20) * 4, 632);
  for (let k = 0; k < ANCHORS.length - 1; k++) {
    const [aT, aX] = ANCHORS[k]!;
    const [bT, bX] = ANCHORS[k + 1]!;
    if (t >= aT && t <= bT) return aX + ((t - aT) / (bT - aT)) * (bX - aX);
  }
  return 600;
}

function nodeState(due: number, now: number): "done" | "win" | "idle" {
  if (due < now) return "done";
  if (due <= now + 2) return "win";
  return "idle";
}

export default function QueueTreeViz() {
  const [now, setNow] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    if (now >= MAX) {
      setPlaying(false);
      return;
    }
    const timer = setTimeout(() => setNow(now + 1), 700);
    return () => clearTimeout(timer);
  }, [playing, now]);

  const xn = xAt(now);
  const xw = xAt(now + 2);

  return (
    <div className="not-prose my-8">
      <h2 className="sr-only">
        A red-black tree of queued jobs sorted by due time; a sliding two-second
        window sweeps left to right, grabbing jobs as they come due so none are
        starved.
      </h2>
      <svg
        width="100%"
        viewBox="0 0 680 330"
        role="img"
        className="max-w-[680px]"
      >
        <title>Queue as a red-black tree sorted by due time</title>
        <desc>
          Seven jobs arranged so left-to-right position is chronological order.
          A blue two-second window and a &quot;now&quot; line sweep rightward as
          time advances; jobs inside the window are grabbed this pass, jobs
          behind it have already run, and jobs ahead wait their turn.
        </desc>
        <rect
          x={xn}
          y={60}
          width={Math.max(0, xw - xn)}
          height={228}
          style={{
            fill: "rgb(var(--color-border-info))",
            opacity: 0.6,
            transition: "x .15s, width .15s",
          }}
        />
        <line
          x1={xn}
          y1={58}
          x2={xn}
          y2={292}
          style={{
            stroke: "rgb(var(--color-foreground-info))",
            strokeWidth: 1.5,
            transition: "x1 .15s, x2 .15s",
          }}
        />
        <text
          x={xn}
          y={50}
          textAnchor="middle"
          fontSize={13}
          style={{
            fill: "rgb(var(--color-foreground-info))",
            transition: "x .15s",
          }}
        >
          now
        </text>
        {EDGES.map(([p, c]) => {
          const a = NODES[p]!;
          const b = NODES[c]!;
          return (
            <path
              key={`${p}-${c}`}
              d={`M${a.x} ${a.y} L${b.x} ${b.y}`}
              style={{
                stroke: "rgb(var(--color-border-subtle))",
                strokeWidth: 1,
                fill: "none",
              }}
            />
          );
        })}
        {NODES.map((n) => {
          const state = nodeState(n.due, now);
          const inWindow = state === "win";
          return (
            <g
              key={n.id}
              style={{
                opacity: state === "done" ? 0.3 : 1,
                transition: "opacity .2s",
              }}
            >
              <circle
                cx={n.x}
                cy={n.y}
                r={26}
                style={{
                  fill: inWindow
                    ? "rgb(var(--color-background-warning))"
                    : "rgb(var(--color-background-surface-base))",
                  stroke: inWindow
                    ? "rgb(var(--color-border-warning))"
                    : "rgb(var(--color-border-muted))",
                  strokeWidth: 0.5,
                  transition: "fill .2s, stroke .2s",
                }}
              />
              <text
                x={n.x}
                y={n.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={14}
                fontWeight={500}
                style={{
                  fill: inWindow
                    ? "rgb(var(--color-foreground-warning))"
                    : "rgb(var(--color-foreground-base))",
                  transition: "fill .2s",
                }}
              >
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="mb-2 mt-4 flex items-center gap-3 text-sm text-subtle">
        <button
          type="button"
          onClick={() => {
            if (playing) {
              setPlaying(false);
              return;
            }
            if (now >= MAX) setNow(0);
            setPlaying(true);
          }}
          className="w-[84px] rounded border border-subtle bg-surfaceBase px-3 py-1 text-basis hover:bg-surfaceSubtle"
        >
          {playing ? "Pause" : "Play"}
        </button>
        <span aria-hidden="true">now</span>
        <input
          type="range"
          min={0}
          max={MAX}
          step={1}
          value={now}
          aria-label="Current time in seconds"
          onChange={(e) => {
            setPlaying(false);
            setNow(Number(e.target.value));
          }}
          className="flex-1 accent-[rgb(var(--color-breeze-500))]"
        />
        <span className="min-w-[34px] text-right font-medium text-basis">
          {now}s
        </span>
      </div>
      <div className="mt-1 flex flex-wrap gap-4 text-[13px] text-subtle">
        <span className="inline-flex items-center gap-1.5">
          <span
            className="inline-block h-3.5 w-3.5 rounded border"
            style={{
              background: "rgb(var(--color-border-info))",
              borderColor: "rgb(var(--color-border-muted))",
            }}
          />
          now + 2s window
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="inline-block h-3.5 w-3.5 rounded border"
            style={{
              background: "rgb(var(--color-background-warning))",
              borderColor: "rgb(var(--color-border-warning))",
            }}
          />
          grabbed this pass
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="inline-block h-3.5 w-3.5 rounded border opacity-40"
            style={{
              background: "rgb(var(--color-background-surface-base))",
              borderColor: "rgb(var(--color-border-muted))",
            }}
          />
          already run
        </span>
      </div>
    </div>
  );
}
