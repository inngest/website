"use client";

import clsx from "clsx";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SimConfig, SimEvent, SimResult, SimRun } from "./engine";
import { fmtT, niceStep, runName, sampleSeries, WAIT_LABEL } from "./derive";
import { FILL, STROKE } from "./styles";
import { TenantChip } from "./ui";

const GUTTER = 60;
const RIGHT = 12;
const AXIS_H = 22;
const EVENT_ROW_H = 18;
const LANE_H = 34;

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

export function Timeline({
  result,
  cfg,
  domain,
  t,
  onSeek,
  selectedRun,
  onSelectRun,
  onAddEvent,
  onRemoveManual,
  groupByTenant,
}: {
  result: SimResult;
  cfg: SimConfig;
  domain: number;
  t: number;
  onSeek: (t: number) => void;
  selectedRun: number | null;
  onSelectRun: (id: number | null) => void;
  onAddEvent: (tenant: string, t: number) => void;
  onRemoveManual: (index: number) => void;
  groupByTenant: boolean;
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

  const rows = useMemo(() => {
    const rs = result.runs.slice();
    if (groupByTenant) {
      rs.sort((a, b) => a.tenant.localeCompare(b.tenant) || a.id - b.id);
    }
    return rs;
  }, [result, groupByTenant]);

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
          <EventLanes
            geo={geo}
            result={result}
            onAddEvent={onAddEvent}
            onRemoveManual={onRemoveManual}
            showTip={showTip}
            hideTip={hideTip}
          />
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
            <CapacityLanes
              geo={geo}
              result={result}
              cfg={cfg}
              showTip={showTip}
              hideTip={hideTip}
            />
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

function eventTip(ev: SimEvent, result: SimResult): string {
  const run = ev.runId !== undefined ? result.runs[ev.runId - 1] : undefined;
  switch (ev.outcome) {
    case "rate-limited":
      return "Skipped by the rate limit. No run was created.";
    case "singleton-skipped":
      return "Skipped by singleton: another run was active for this key.";
    case "debounce-superseded":
      return `Restarted the debounce period, then was replaced by a later event${
        run ? ` (run ${run.label})` : ""
      }.`;
    case "batched":
      return `Added to batch ${run?.label ?? ""}.`;
    case "run":
      return run ? `Handled by run ${run.label}.` : "Started a run.";
    default:
      return "Waiting when the simulation ended.";
  }
}

const EventLanes = memo(function EventLanes({
  geo,
  result,
  onAddEvent,
  onRemoveManual,
  showTip,
  hideTip,
}: {
  geo: Geo;
  result: SimResult;
  onAddEvent: (tenant: string, t: number) => void;
  onRemoveManual: (index: number) => void;
  showTip: (
    e: React.PointerEvent | React.MouseEvent,
    title: string,
    body?: string
  ) => void;
  hideTip: () => void;
}) {
  const [ghost, setGhost] = useState<{ tenant: string; x: number } | null>(
    null
  );
  const h = result.tenants.length * EVENT_ROW_H + 6;
  return (
    <svg width={geo.width} height={h} className="block">
      {result.tenants.map((tenant, i) => {
        const y = 3 + i * EVENT_ROW_H;
        const cy = y + EVENT_ROW_H / 2;
        const evs = result.events.filter((e) => e.tenant === tenant);
        return (
          <g key={tenant}>
            <foreignObject
              x={4}
              y={y + 1}
              width={GUTTER - 8}
              height={EVENT_ROW_H - 2}
            >
              <div className="flex h-full items-center gap-1 text-[10px] text-muted">
                <TenantChip id={tenant} />
                <span>events</span>
              </div>
            </foreignObject>
            <rect
              x={GUTTER}
              y={y}
              width={geo.width - GUTTER - RIGHT}
              height={EVENT_ROW_H}
              className="cursor-copy fill-transparent hover:fill-carbon-50 dark:hover:fill-carbon-900"
              onPointerMove={(e) => {
                const box = (
                  e.currentTarget.ownerSVGElement as SVGSVGElement
                ).getBoundingClientRect();
                setGhost({ tenant, x: e.clientX - box.left });
                showTip(
                  e,
                  `Add an event for tenant ${tenant}`,
                  `at ${fmtT(
                    Math.round(geo.tAt(e.clientX - box.left) * 2) / 2
                  )}`
                );
              }}
              onPointerLeave={() => {
                setGhost(null);
                hideTip();
              }}
              onClick={(e) => {
                const box = (
                  e.currentTarget.ownerSVGElement as SVGSVGElement
                ).getBoundingClientRect();
                onAddEvent(
                  tenant,
                  Math.round(geo.tAt(e.clientX - box.left) * 2) / 2
                );
              }}
            />
            <line
              x1={GUTTER}
              x2={geo.width - RIGHT}
              y1={cy}
              y2={cy}
              className="pointer-events-none stroke-carbon-100 dark:stroke-carbon-800"
            />
            {ghost?.tenant === tenant && (
              <circle
                cx={ghost.x}
                cy={cy}
                r={3.5}
                className="pointer-events-none fill-none stroke-breeze-500"
                strokeDasharray="2 2"
              />
            )}
            {evs.map((ev) => {
              const x = geo.x(ev.t);
              const skipped =
                ev.outcome === "rate-limited" ||
                ev.outcome === "singleton-skipped";
              const title = `${ev.label} at ${fmtT(ev.t)}`;
              const body =
                eventTip(ev, result) + (ev.manual ? " Click to remove." : "");
              return (
                <g
                  key={ev.id}
                  className={ev.manual ? "cursor-pointer" : undefined}
                  onPointerEnter={(e) => showTip(e, title, body)}
                  onPointerMove={(e) => showTip(e, title, body)}
                  onPointerLeave={hideTip}
                  onClick={() =>
                    ev.manual &&
                    ev.manualIndex !== undefined &&
                    onRemoveManual(ev.manualIndex)
                  }
                >
                  <rect
                    x={x - 5}
                    y={y}
                    width={10}
                    height={EVENT_ROW_H}
                    className="fill-transparent"
                  />
                  {ev.manual && (
                    <circle
                      cx={x}
                      cy={cy}
                      r={6}
                      className="fill-none stroke-breeze-500/60"
                      strokeWidth={1.25}
                    />
                  )}
                  {skipped ? (
                    <path
                      d={`M${x - 3.2},${cy - 3.2}L${x + 3.2},${cy + 3.2}M${
                        x + 3.2
                      },${cy - 3.2}L${x - 3.2},${cy + 3.2}`}
                      className={STROKE.cancel}
                      strokeWidth={1.75}
                      strokeLinecap="round"
                    />
                  ) : ev.outcome === "debounce-superseded" ? (
                    <circle
                      cx={x}
                      cy={cy}
                      r={3.25}
                      className="fill-white stroke-carbon-500 dark:fill-carbon-1000"
                      strokeWidth={1.25}
                    />
                  ) : (
                    <circle
                      cx={x}
                      cy={cy}
                      r={3.5}
                      className="fill-carbon-800 stroke-white dark:fill-carbon-100 dark:stroke-carbon-1000"
                      strokeWidth={1}
                    />
                  )}
                </g>
              );
            })}
          </g>
        );
      })}
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

const CapacityLanes = memo(function CapacityLanes({
  geo,
  result,
  cfg,
  showTip,
  hideTip,
}: {
  geo: Geo;
  result: SimResult;
  cfg: SimConfig;
  showTip: (
    e: React.PointerEvent | React.MouseEvent,
    title: string,
    body?: string
  ) => void;
  hideTip: () => void;
}) {
  const samples = Math.min(
    600,
    Math.max(100, Math.floor((geo.width - GUTTER) / 2))
  );
  const series = useMemo(
    () => sampleSeries(result, geo.domain, samples),
    [result, geo.domain, samples]
  );
  const fnLimit = cfg.concurrency.constraints
    .filter((c) => c.key !== "tenant")
    .map((c) => c.limit - (c.key === "shared" ? c.externalLoad : 0))
    .reduce((a, b) => Math.min(a, b), Number.POSITIVE_INFINITY);
  const lanes = [
    {
      label: "executing",
      values: series.exec,
      fill: "fill-breeze-500/20 dark:fill-breeze-400/25",
      stroke: "stroke-breeze-500 dark:stroke-breeze-400",
      limit: Number.isFinite(fnLimit) ? fnLimit : undefined,
    },
    {
      label: "waiting",
      values: series.wait,
      fill: "fill-purplehaze-400/20 dark:fill-purplehaze-400/25",
      stroke: "stroke-purplehaze-500 dark:stroke-purplehaze-400",
      limit: undefined as number | undefined,
    },
  ];
  const H = lanes.length * LANE_H + 6;
  return (
    <svg
      width={geo.width}
      height={H}
      className="block"
      onPointerMove={(e) => {
        const box = e.currentTarget.getBoundingClientRect();
        const tt = geo.tAt(e.clientX - box.left);
        const i = Math.round((tt / geo.domain) * samples);
        showTip(
          e,
          `At ${fmtT(tt)}`,
          `${series.exec[i] ?? 0} steps executing · ${
            series.wait[i] ?? 0
          } waiting in the queue`
        );
      }}
      onPointerLeave={hideTip}
    >
      {lanes.map((lane, li) => {
        const top = 4 + li * LANE_H;
        const h = LANE_H - 8;
        const max = Math.max(1, ...lane.values, lane.limit ?? 0);
        const y = (v: number) => top + h - (v / max) * h;
        let d = `M${geo.x(0)},${y(0)}`;
        lane.values.forEach((v, i) => {
          const xx = geo.x(series.times[i]);
          d += `L${xx},${y(lane.values[i - 1] ?? 0)}L${xx},${y(v)}`;
        });
        const line = d;
        const area = `${d}L${geo.x(geo.domain)},${y(0)}Z`;
        const peak = Math.max(...lane.values);
        return (
          <g key={lane.label}>
            <text
              x={4}
              y={top + 10}
              className="fill-carbon-500 text-[10px] dark:fill-carbon-400"
            >
              {lane.label}
            </text>
            <text
              x={4}
              y={top + 21}
              className="fill-carbon-400 text-[9px] tabular-nums dark:fill-carbon-500"
            >
              peak {peak}
            </text>
            <line
              x1={GUTTER}
              x2={geo.width - RIGHT}
              y1={y(0)}
              y2={y(0)}
              className="stroke-carbon-200 dark:stroke-carbon-700"
            />
            <path d={area} className={lane.fill} />
            <path
              d={line}
              className={clsx("fill-none", lane.stroke)}
              strokeWidth={1.5}
              strokeLinejoin="round"
            />
            {lane.limit !== undefined && (
              <g>
                <line
                  x1={GUTTER}
                  x2={geo.width - RIGHT}
                  y1={y(lane.limit)}
                  y2={y(lane.limit)}
                  className="stroke-carbon-500"
                  strokeDasharray="4 3"
                />
                <text
                  x={geo.width - RIGHT - 2}
                  y={y(lane.limit) - 2}
                  textAnchor="end"
                  className="fill-carbon-500 text-[9px]"
                >
                  limit {lane.limit}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
});
