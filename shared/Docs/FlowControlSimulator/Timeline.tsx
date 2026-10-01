"use client";

import clsx from "clsx";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SimConfig, SimResult, SimRun } from "./engine";
import { fmtT, niceStep, runName, WAIT_LABEL } from "./derive";
import { FILL, STROKE } from "./styles";
import { TenantChip } from "./ui";

const GUTTER = 60;
const RIGHT = 12;
const AXIS_H = 22;

interface Geo {
  width: number;
  domain: number;
  x: (t: number) => number;
  tAt: (px: number) => number;
}

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) =>
      setWidth(Math.floor(entry.contentRect.width))
    );
    ro.observe(el);
    setWidth(Math.floor(el.getBoundingClientRect().width));
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

type Tip = { x: number; y: number; title: string; body?: string } | null;

/** One row per run over time, for the Runs tab. */
export function RunTimeline({
  result,
  cfg,
  domain,
  t,
  onSeek,
  selectedRun,
  onSelectRun,
}: {
  result: SimResult;
  cfg: SimConfig;
  domain: number;
  t: number;
  onSeek: (t: number) => void;
  selectedRun: number | null;
  onSelectRun: (id: number | null) => void;
}) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [tip, setTip] = useState<Tip>(null);
  const geo: Geo = useMemo(() => {
    const pw = Math.max(40, width - GUTTER - RIGHT);
    return {
      width,
      domain,
      x: (tt: number) => GUTTER + (Math.max(0, tt) / domain) * pw,
      tAt: (px: number) =>
        Math.max(0, Math.min(domain, ((px - GUTTER) / pw) * domain)),
    };
  }, [width, domain]);

  const rows = result.runs;

  const n = rows.length;
  const rowH = n <= 16 ? 20 : n <= 30 ? 14 : n <= 60 ? 9 : n <= 120 ? 6 : 4;
  const bodyH = Math.max(rowH * n, 28);

  const showTip = useCallback(
    (
      e: React.PointerEvent | React.MouseEvent,
      title: string,
      body?: string
    ) => {
      const box = ref.current?.getBoundingClientRect();
      if (!box) return;
      setTip({ x: e.clientX - box.left, y: e.clientY - box.top, title, body });
    },
    [ref]
  );
  const hideTip = useCallback(() => setTip(null), []);

  // Scrubbing on the axis and lanes.
  const dragging = useRef(false);
  const seekFromEvent = (e: React.PointerEvent) => {
    const box = ref.current?.getBoundingClientRect();
    if (!box) return;
    onSeek(geo.tAt(e.clientX - box.left));
  };

  const px = geo.x(Math.min(t, domain));

  return (
    <div ref={ref} className="relative select-none">
      {width > 0 && (
        <>
          <div
            className="cursor-ew-resize touch-none"
            onPointerDown={(e) => {
              dragging.current = true;
              (e.target as Element).setPointerCapture?.(e.pointerId);
              seekFromEvent(e);
            }}
            onPointerMove={(e) => dragging.current && seekFromEvent(e)}
            onPointerUp={() => (dragging.current = false)}
          >
            <Axis geo={geo} />
          </div>
          <div
            className="relative mt-1 overflow-y-auto overflow-x-hidden"
            style={{ maxHeight: 440 }}
          >
            {n === 0 ? (
              <div className="flex h-16 items-center justify-center text-xs text-muted">
                No runs.{" "}
                {result.events.length
                  ? "Every event was skipped."
                  : "Add traffic to start."}
              </div>
            ) : (
              <RunRows
                geo={geo}
                result={result}
                rows={rows}
                rowH={rowH}
                height={bodyH}
                selectedRun={selectedRun}
                onSelectRun={onSelectRun}
                onSeek={onSeek}
                showTip={showTip}
                hideTip={hideTip}
                cfg={cfg}
              />
            )}
          </div>
          {/* Playhead and future dimming. Positioned over everything. */}
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 top-0 bg-canvasBase/60"
            style={{ left: px, right: 0 }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 top-0 w-px bg-carbon-900 dark:bg-carbon-100"
            style={{ left: px }}
          >
            <div className="absolute -left-[3px] top-0 h-[7px] w-[7px] rotate-45 bg-carbon-900 dark:bg-carbon-100" />
          </div>
        </>
      )}
      {tip && (
        <div
          role="tooltip"
          className="pointer-events-none absolute z-20 max-w-[260px] rounded-md bg-canvasBase px-2.5 py-1.5 text-[11px] leading-snug text-basis shadow-lg ring-1 ring-black/5 dark:ring-white/10"
          style={{
            left: Math.min(tip.x + 12, Math.max(0, width - 270)),
            top: tip.y + 14,
          }}
        >
          <div className="font-medium">{tip.title}</div>
          {tip.body && <div className="mt-0.5 text-subtle">{tip.body}</div>}
        </div>
      )}
    </div>
  );
}

const Axis = memo(function Axis({ geo }: { geo: Geo }) {
  const step = niceStep(
    geo.domain,
    Math.max(3, Math.floor((geo.width - GUTTER) / 70))
  );
  const ticks: number[] = [];
  for (let v = 0; v <= geo.domain + 1e-9; v += step) ticks.push(v);
  return (
    <svg width={geo.width} height={AXIS_H} className="block">
      <text x={4} y={14} className="fill-carbon-500 text-[10px]">
        time
      </text>
      {ticks.map((v) => (
        <g key={v}>
          <line
            x1={geo.x(v)}
            x2={geo.x(v)}
            y1={AXIS_H - 5}
            y2={AXIS_H}
            className="stroke-carbon-300 dark:stroke-carbon-600"
          />
          <text
            x={geo.x(v)}
            y={12}
            textAnchor={v === 0 ? "start" : "middle"}
            className="fill-carbon-500 text-[10px] tabular-nums dark:fill-carbon-400"
          >
            {fmtT(v)}
          </text>
        </g>
      ))}
    </svg>
  );
});

function segTip(
  run: SimRun,
  seg: SimRun["segments"][number],
  cfg: SimConfig,
  result: SimResult
) {
  const span = `${fmtT(seg.from)} → ${fmtT(seg.to)} (${fmtT(
    seg.to - seg.from
  )})`;
  switch (seg.kind) {
    case "collect":
      return {
        title:
          run.collect?.kind === "batch"
            ? "Collecting events into a batch"
            : "Debounce: waiting for a quiet period",
        body: `${span}. ${run.eventIds.length} event${
          run.eventIds.length > 1 ? "s" : ""
        }${
          run.collect?.kind === "debounce"
            ? `; runs with the last one, ${
                result.events[run.triggerEventId]?.label
              }`
            : ""
        }.`,
      };
    case "wait": {
      let body = span;
      if (seg.reason === "concurrency" && seg.constraint !== undefined) {
        const c = cfg.concurrency.constraints[seg.constraint];
        body += `. Limit ${c.limit}${
          c.key === "tenant"
            ? ` for tenant ${run.tenant}`
            : c.key === "shared"
            ? ` on the shared ${c.scope} key`
            : " for the function"
        }.`;
      } else if (seg.reason === "throttle") {
        body += `. ${cfg.throttle.limit} starts per ${fmtT(
          cfg.throttle.period
        )}${cfg.throttle.burst ? ` + burst ${cfg.throttle.burst}` : ""}${
          cfg.throttle.key === "tenant" ? ` for tenant ${run.tenant}` : ""
        }.`;
      } else if (seg.reason === "backlog") {
        body +=
          ". Capacity was free for this key, but the scheduler was stuck on blocked work at the head of the queue.";
      }
      return { title: WAIT_LABEL[seg.reason || "backlog"], body };
    }
    case "run":
      return {
        title: `Executing step ${(seg.step ?? 0) + 1}`,
        body: `${span}. Holds a concurrency slot.${
          seg.cancelling
            ? " Cancel requested: the run stops when this step finishes."
            : ""
        }`,
      };
    default:
      return {
        title: `Sleeping (step ${(seg.step ?? 0) + 1})`,
        body: `${span}. Holds no concurrency slot.`,
      };
  }
}

const RunRows = memo(function RunRows({
  geo,
  result,
  rows,
  rowH,
  height,
  selectedRun,
  onSelectRun,
  onSeek,
  showTip,
  hideTip,
  cfg,
}: {
  geo: Geo;
  result: SimResult;
  rows: SimRun[];
  rowH: number;
  height: number;
  selectedRun: number | null;
  onSelectRun: (id: number | null) => void;
  onSeek: (t: number) => void;
  showTip: (
    e: React.PointerEvent | React.MouseEvent,
    title: string,
    body?: string
  ) => void;
  hideTip: () => void;
  cfg: SimConfig;
}) {
  const barH = Math.max(3, rowH - (rowH >= 14 ? 8 : rowH >= 9 ? 4 : 2));
  const labels = rowH >= 14;
  const r = Math.min(2, barH / 2);
  return (
    <svg width={geo.width} height={height} className="block">
      <defs>
        <pattern
          id="fcsim-hatch"
          width="5"
          height="5"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="5"
            className={STROKE.hatch}
            strokeWidth="1.5"
          />
        </pattern>
      </defs>
      {rows.map((run, i) => {
        const y = i * rowH;
        const by = y + (rowH - barH) / 2;
        const sel = run.id === selectedRun;
        const name = runName(result, run);
        return (
          <g
            key={run.id}
            className="cursor-pointer"
            onClick={(e) => {
              const box = (
                e.currentTarget.ownerSVGElement as SVGSVGElement
              ).getBoundingClientRect();
              onSelectRun(sel ? null : run.id);
              onSeek(geo.tAt(e.clientX - box.left));
            }}
          >
            <rect
              x={0}
              y={y}
              width={geo.width}
              height={rowH}
              className={clsx(
                sel
                  ? "fill-breeze-100 dark:fill-breeze-900/40"
                  : "fill-transparent hover:fill-carbon-50 dark:hover:fill-carbon-900"
              )}
            />
            {!labels && rowH >= 6 && (
              <text
                x={8}
                y={y + rowH / 2}
                dominantBaseline="central"
                className="fill-carbon-500 font-mono dark:fill-carbon-400"
                style={{ fontSize: Math.min(9, rowH) }}
              >
                {run.tenant}
              </text>
            )}
            {labels && (
              <foreignObject x={4} y={y} width={GUTTER - 8} height={rowH}>
                <div className="flex h-full items-center gap-1 overflow-hidden whitespace-nowrap text-[10px] text-subtle">
                  <TenantChip
                    id={run.tenant}
                    className="!h-3.5 !min-w-[14px] !text-[9px]"
                  />
                  <span className="truncate font-mono">{name}</span>
                </div>
              </foreignObject>
            )}
            {run.segments.map((s, j) => {
              const x1 = geo.x(s.from);
              const w = Math.max(1.5, geo.x(s.to) - x1);
              const tipData = segTip(run, s, cfg, result);
              const handlers = {
                onPointerEnter: (e: React.PointerEvent) =>
                  showTip(e, `${name} · ${tipData.title}`, tipData.body),
                onPointerMove: (e: React.PointerEvent) =>
                  showTip(e, `${name} · ${tipData.title}`, tipData.body),
                onPointerLeave: hideTip,
              };
              if (s.kind === "collect") {
                return (
                  <g key={j} {...handlers}>
                    <rect
                      x={x1}
                      y={by}
                      width={w}
                      height={barH}
                      rx={r}
                      className={clsx(FILL.collect, STROKE.collect)}
                      strokeDasharray="3 2"
                      strokeWidth={1}
                    />
                    {run.eventIds.map((id) => {
                      const et = result.events[id].t;
                      if (et < s.from - 1e-9 || et > s.to + 1e-9) return null;
                      return (
                        <line
                          key={id}
                          x1={geo.x(et)}
                          x2={geo.x(et)}
                          y1={by + 1}
                          y2={by + barH - 1}
                          className={STROKE.collect}
                          strokeWidth={1.5}
                        />
                      );
                    })}
                  </g>
                );
              }
              if (s.kind === "sleep") {
                return (
                  <rect
                    key={j}
                    {...handlers}
                    x={x1 + 0.5}
                    y={by + 0.5}
                    width={Math.max(1, w - 1)}
                    height={barH - 1}
                    rx={r}
                    className={clsx("fill-transparent", STROKE.sleep)}
                    strokeDasharray="3 2"
                    strokeWidth={1}
                  />
                );
              }
              if (s.kind === "wait") {
                const reason = s.reason || "backlog";
                return (
                  <g key={j} {...handlers}>
                    <rect
                      x={x1}
                      y={by}
                      width={w}
                      height={barH}
                      rx={r}
                      className={FILL[reason]}
                    />
                    {reason === "throttle" && (
                      <rect
                        x={x1}
                        y={by}
                        width={w}
                        height={barH}
                        rx={r}
                        fill="url(#fcsim-hatch)"
                      />
                    )}
                  </g>
                );
              }
              return (
                <rect
                  key={j}
                  {...handlers}
                  x={x1}
                  y={by}
                  width={w}
                  height={barH}
                  rx={r}
                  className={clsx(FILL.run, s.cancelling && STROKE.cancel)}
                  strokeWidth={s.cancelling ? 1.5 : 0}
                />
              );
            })}
            <EndMarker
              run={run}
              geo={geo}
              cy={y + rowH / 2}
              size={Math.min(8, barH + 2)}
              showTip={showTip}
              hideTip={hideTip}
              name={name}
            />
          </g>
        );
      })}
    </svg>
  );
});

function EndMarker({
  run,
  geo,
  cy,
  size,
  showTip,
  hideTip,
  name,
}: {
  run: SimRun;
  geo: Geo;
  cy: number;
  size: number;
  showTip: (
    e: React.PointerEvent | React.MouseEvent,
    title: string,
    body?: string
  ) => void;
  hideTip: () => void;
  name: string;
}) {
  if (run.endedAt === undefined || run.end === "unfinished") return null;
  const x = geo.x(run.endedAt) + (run.end === "completed" ? size / 2 + 1 : 0);
  const s = size / 2;
  const title =
    run.end === "completed"
      ? `${name} completed at ${fmtT(run.endedAt)}`
      : `${name} ${run.end} at ${fmtT(run.endedAt)}`;
  const handlers = {
    onPointerEnter: (e: React.PointerEvent) => showTip(e, title, run.endReason),
    onPointerLeave: hideTip,
  };
  if (run.end === "completed") {
    return (
      <g {...handlers}>
        <circle cx={x} cy={cy} r={s} className={FILL.done} />
        {size >= 7 && (
          <path
            d={`M${x - s * 0.45},${cy}l${s * 0.3},${s * 0.35}l${s * 0.6},${
              -s * 0.7
            }`}
            className="fill-none stroke-white"
            strokeWidth={1.25}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </g>
    );
  }
  const d = Math.max(2.5, s * 0.8);
  return (
    <g {...handlers}>
      <rect
        x={x - s}
        y={cy - s}
        width={size}
        height={size}
        className="fill-transparent"
      />
      <path
        d={`M${x - d},${cy - d}L${x + d},${cy + d}M${x + d},${cy - d}L${
          x - d
        },${cy + d}`}
        className={STROKE.cancel}
        strokeWidth={1.75}
        strokeLinecap="round"
      />
    </g>
  );
}
