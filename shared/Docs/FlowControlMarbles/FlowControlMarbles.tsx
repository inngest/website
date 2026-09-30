"use client";

import {
  RiArrowRightUpLine,
  RiPauseFill,
  RiPlayFill,
  RiRestartLine,
} from "@remixicon/react";
import clsx from "clsx";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { simulate, type SimRun } from "../FlowControlSimulator/engine";
import { simulatorHref } from "../FlowControlSimulator/share";
import {
  EPS,
  buildModel,
  busySlots,
  clamp01,
  collectingAt,
  ease,
  gcraKey,
  gcraUnits,
  queueAt,
  waitReasonAt,
  type Model,
  type Stage,
  type Token,
} from "./model";
import { getMarbleScenario } from "./scenarios";

// ---------------------------------------------------------------------------
// Looks. A hue always means a state, matching the simulator.
// ---------------------------------------------------------------------------

interface Look {
  fill: string;
  text: string;
  stroke?: string;
  dash?: string;
}

const LOOK = {
  event: {
    fill: "fill-carbon-800 dark:fill-carbon-100",
    text: "fill-white dark:fill-carbon-1000",
  },
  concurrency: {
    fill: "fill-purplehaze-300 dark:fill-purplehaze-500",
    text: "fill-purplehaze-900 dark:fill-white",
  },
  throttle: {
    fill: "fill-honey-300 dark:fill-honey-500",
    text: "fill-honey-900 dark:fill-carbon-1000",
  },
  backlog: {
    fill: "fill-carbon-200 dark:fill-carbon-600",
    text: "fill-carbon-800 dark:fill-carbon-100",
  },
  collect: {
    fill: "fill-blush-100 dark:fill-blush-500/30",
    stroke: "stroke-blush-400",
    dash: "2.5 2",
    text: "fill-blush-900 dark:fill-blush-100",
  },
  run: {
    fill: "fill-breeze-500 dark:fill-breeze-400",
    text: "fill-white dark:fill-carbon-1000",
  },
  skipped: {
    fill: "fill-white dark:fill-carbon-1000",
    stroke: "stroke-ruby-500 dark:stroke-ruby-400",
    text: "fill-ruby-600 dark:fill-ruby-400",
  },
  replaced: {
    fill: "fill-white dark:fill-carbon-1000",
    stroke: "stroke-carbon-400 dark:stroke-carbon-500",
    text: "fill-carbon-500 dark:fill-carbon-400",
  },
} satisfies Record<string, Look>;

const LINE = "stroke-carbon-300 dark:stroke-carbon-600";
const GUTTER_TEXT = "fill-carbon-600 dark:fill-carbon-300";
const MUTED_TEXT = "fill-carbon-500 dark:fill-carbon-400";

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

type Layout = ReturnType<typeof layoutFor>;

function layoutFor(model: Model, width: number) {
  const compact = width < 520;
  const R = compact ? 7 : 9;
  const GUT = compact ? 58 : 78;
  const RIGHT = 12;
  const IN_H = compact ? 26 : 30;
  const BAND_H = compact ? 36 : 40;
  const LANE_H = 2 * R + (compact ? 8 : 10);
  const AXIS_H = 18;
  const top = 4;
  const plotLeft = GUT + R + 4;
  const plotRight = width - RIGHT - 8;
  const plotW = Math.max(40, plotRight - plotLeft);
  const domain = model.domain;
  const x = (t: number) => plotLeft + (Math.max(0, t) / domain) * plotW;
  const tAt = (px: number) =>
    Math.max(0, Math.min(domain, ((px - plotLeft) / plotW) * domain));
  const bandTop = top + model.tenants.length * IN_H + 6;
  const bandBottom = bandTop + model.groups.length * BAND_H;
  const lanesTop = bandBottom + 8;
  const axisTop = lanesTop + model.lanes.length * LANE_H + 4;
  return {
    compact,
    width,
    R,
    GUT,
    RIGHT,
    QSP: 2 * R + 3,
    top,
    plotLeft,
    x,
    tAt,
    inY: (i: number) => top + i * IN_H + IN_H / 2,
    IN_H,
    BAND_H,
    bandTop,
    bandBottom,
    bandY: (j: number) => bandTop + j * BAND_H + BAND_H / 2 + 2,
    LANE_H,
    laneY: (k: number) => lanesTop + k * LANE_H + LANE_H / 2,
    axisTop,
    height: axisTop + AXIS_H,
  };
}

// ---------------------------------------------------------------------------
// Token positions
// ---------------------------------------------------------------------------

interface Pt {
  x: number;
  y: number;
}

const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

/** Position in a line of waiting dots. The front sits at the playhead. */
function slot(L: Layout, t: number, i: number, n: number) {
  const anchor = L.x(t);
  const left = anchor - Math.max(0, n - 1) * L.QSP;
  const shift = Math.max(0, L.plotLeft - left);
  return anchor - i * L.QSP + shift;
}

function queueX(model: Model, L: Layout, group: string, runId: number, t: number) {
  const { cur, prev } = queueAt(model, group, t);
  const ci = cur.order.indexOf(runId);
  const pi = prev ? prev.order.indexOf(runId) : -1;
  if (ci < 0) {
    // Just left the queue: hold the last position.
    return slot(L, t, Math.max(0, pi), prev ? prev.order.length : 1);
  }
  const target = slot(L, t, ci, cur.order.length);
  if (pi >= 0 && t - cur.t < model.timing.move) {
    const from = slot(L, t, pi, prev!.order.length);
    return lerp(from, target, ease((t - cur.t) / model.timing.move));
  }
  return target;
}

function stagePos(model: Model, L: Layout, tok: Token, s: Stage, t: number): Pt {
  const g = model.groups.indexOf(tok.group);
  const bandY = L.bandY(Math.max(0, g));
  const run = s.runId !== undefined ? model.result.runs[s.runId - 1] : undefined;
  switch (s.kind) {
    case "input":
      return {
        x: L.x(tok.ev.t),
        y: L.inY(model.tenants.indexOf(tok.ev.tenant)),
      };
    case "collect": {
      if (run?.collect?.kind === "batch") {
        const arrived = run.eventIds.filter(
          (id) => model.result.events[id].t <= t + EPS
        );
        const i = Math.max(0, arrived.indexOf(tok.ev.id));
        return { x: slot(L, t, i, arrived.length), y: bandY };
      }
      return { x: slot(L, t, 0, 1), y: bandY };
    }
    case "queue":
      return { x: queueX(model, L, tok.group, s.runId!, t), y: bandY };
    case "reject":
      return { x: L.x(s.at ?? s.t), y: bandY };
    case "replaced":
      return { x: slot(L, s.t, 0, 1), y: bandY };
    case "start": {
      const lane = model.laneOf.get(run!.id) ?? 0;
      return { x: L.x(run!.firstStartAt!) + L.R, y: L.laneY(lane) };
    }
  }
}

interface TokenView {
  key: number;
  x: number;
  y: number;
  label: string;
  look: Look;
  opacity: number;
  scale: number;
  cross: boolean;
}

function tokenView(
  model: Model,
  L: Layout,
  tok: Token,
  t: number
): TokenView | null {
  const st = tok.stages;
  let k = -1;
  for (let i = 0; i < st.length; i++) if (st[i].t <= t + EPS) k = i;
  if (k <= 0) return null; // Not arrived, or drawn as the event marble.
  const T = model.timing;
  const cur = st[k];
  const p = clamp01((t - cur.t) / T.move);
  const to = stagePos(model, L, tok, cur, t);
  const from = stagePos(model, L, tok, st[k - 1], cur.t);
  const e = ease(p);
  let x = lerp(from.x, to.x, e);
  let y = lerp(from.y, to.y, e);
  let look: Look = LOOK.event;
  let opacity = 1;
  let scale = 1;
  let cross = false;
  const run = cur.runId !== undefined ? model.result.runs[cur.runId - 1] : undefined;
  switch (cur.kind) {
    case "collect":
      look = LOOK.collect;
      break;
    case "queue":
      look = LOOK[waitReasonAt(run!, t)];
      break;
    case "start":
      if (p >= 1) return null;
      look = LOOK.run;
      break;
    case "reject": {
      const prev = st[k - 1].kind;
      if (p < 1) {
        look = prev === "collect" ? LOOK.collect : LOOK.event;
        break;
      }
      const age = clamp01((t - cur.t - T.move) / T.fade);
      if (age >= 1) return null;
      look = LOOK.skipped;
      cross = true;
      opacity = 1 - age * age;
      scale = 1 + 0.35 * ease(age);
      break;
    }
    case "replaced": {
      const age = clamp01((t - cur.t) / T.fade);
      if (age >= 1) return null;
      look = LOOK.replaced;
      opacity = 1 - age;
      scale = 1 - 0.3 * age;
      y -= 10 * ease(age);
      x = to.x;
      break;
    }
  }
  return { key: tok.ev.id, x, y, label: tok.label, look, opacity, scale, cross };
}

// ---------------------------------------------------------------------------
// Drawing primitives
// ---------------------------------------------------------------------------

function Marble({
  x,
  y,
  r,
  label,
  look,
  opacity = 1,
  scale = 1,
}: {
  x: number;
  y: number;
  r: number;
  label: string;
  look: Look;
  opacity?: number;
  scale?: number;
}) {
  const fs = label.length > 2 ? r * 0.85 : r * 1.05;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
      <circle
        r={look.stroke ? r - 0.75 : r}
        className={clsx(look.fill, look.stroke)}
        strokeWidth={look.stroke ? 1.5 : 0}
        strokeDasharray={look.dash}
      />
      <text
        textAnchor="middle"
        dy="0.36em"
        className={clsx(look.text, "font-semibold tabular-nums")}
        style={{ fontSize: fs }}
      >
        {label}
      </text>
    </g>
  );
}

function Cross({
  x,
  y,
  s,
  className,
  width = 1.75,
}: {
  x: number;
  y: number;
  s: number;
  className: string;
  width?: number;
}) {
  return (
    <path
      d={`M${x - s},${y - s}L${x + s},${y + s}M${x + s},${y - s}L${x - s},${y + s}`}
      className={className}
      strokeWidth={width}
      strokeLinecap="round"
      fill="none"
    />
  );
}

function Check({ x, y, s, className }: { x: number; y: number; s: number; className: string }) {
  return (
    <path
      d={`M${x - s},${y + 0.1 * s}L${x - 0.3 * s},${y + 0.75 * s}L${x + s},${y - 0.7 * s}`}
      className={className}
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  );
}

function Arrow({ x1, x2, y, className }: { x1: number; x2: number; y: number; className: string }) {
  return (
    <g className={className} fill="none" strokeWidth={1.25}>
      <line x1={x1} x2={x2} y1={y} y2={y} />
      <path d={`M${x2 - 5},${y - 3.5}L${x2},${y}L${x2 - 5},${y + 3.5}`} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

function Dots({
  x,
  y,
  n,
  value,
  fill,
}: {
  x: number;
  y: number;
  n: number;
  /** Filled count; the fractional part fills the next dot partly. */
  value: number;
  fill: string;
}) {
  const id = useId();
  const r = 3.25;
  const gap = 9;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const cx = x + r + i * gap;
        const f = clamp01(value - i);
        return (
          <g key={i}>
            <clipPath id={`${id}-${i}`}>
              <rect x={cx - r} y={y + r - 2 * r * f} width={2 * r} height={2 * r * f} />
            </clipPath>
            <circle cx={cx} cy={y} r={r - 0.5} className="fill-none stroke-carbon-400 dark:stroke-carbon-500" strokeWidth={1} />
            {f > 0 && (
              <circle cx={cx} cy={y} r={r} className={fill} clipPath={`url(#${id}-${i})`} />
            )}
          </g>
        );
      })}
    </g>
  );
}

function LockGlyph({ x, y, className }: { x: number; y: number; className: string }) {
  return (
    <g className={className} transform={`translate(${x} ${y})`}>
      <rect x={-3.5} y={-1} width={7} height={5.5} rx={1} />
      <path d="M-2,-1V-3a2,2 0 0 1 4,0V-1" fill="none" strokeWidth={1.25} className="stroke-current" />
    </g>
  );
}

// ---------------------------------------------------------------------------
// Diagram
// ---------------------------------------------------------------------------

function Diagram({ model, L, t, hatchId }: { model: Model; L: Layout; t: number; hatchId: string }) {
  const { result, scenario, timing: T } = model;
  const R = L.R;
  const right = L.width - L.RIGHT;
  const views = model.tokens
    .map((tok) => tokenView(model, L, tok, t))
    .filter(Boolean) as TokenView[];
  const step = model.domain <= 8 ? 1 : model.domain <= 16 ? 2 : 5;
  const tickStep = L.x(step) - L.x(0) < 34 ? step * 2 : step;
  const ticks: number[] = [];
  for (let v = 0; v <= model.domain + EPS; v += tickStep) ticks.push(v);

  return (
    <>
      <defs>
        <pattern id={hatchId} width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="4" className="stroke-ruby-500 dark:stroke-ruby-400" strokeWidth="1.6" />
        </pattern>
      </defs>

      {/* Event rows */}
      {model.tenants.map((tenant, i) => (
        <g key={tenant}>
          <text x={0} y={L.inY(i)} dy="0.35em" className={clsx(GUTTER_TEXT, "text-[11px] font-medium")}>
            {model.tenantName(tenant)}
          </text>
          <Arrow x1={L.GUT} x2={right} y={L.inY(i)} className={LINE} />
        </g>
      ))}

      {/* Flow control band */}
      <rect
        x={L.GUT}
        y={L.bandTop}
        width={right - L.GUT}
        height={L.bandBottom - L.bandTop}
        rx={8}
        className="fill-carbon-50 stroke-carbon-200 dark:fill-carbon-900 dark:stroke-carbon-700"
        strokeWidth={1}
      />
      {model.groups.map((g, j) => {
        const y = L.bandY(j);
        const label = scenario.byTenant ? `${g} ${scenario.band.toLowerCase()}` : scenario.band;
        return (
          <g key={g}>
            {j > 0 && (
              <line x1={L.GUT + 8} x2={right - 8} y1={L.bandTop + j * L.BAND_H} y2={L.bandTop + j * L.BAND_H} className="stroke-carbon-200 dark:stroke-carbon-700" strokeDasharray="3 3" />
            )}
            <text x={0} y={y - 6} dy="0.35em" className={clsx(GUTTER_TEXT, "text-[11px] font-medium")}>
              {label}
            </text>
            <Meter model={model} L={L} group={g} y={y + 8} t={t} />
            <BandOverlay model={model} L={L} group={g} y={y} t={t} />
          </g>
        );
      })}

      {/* Output lanes */}
      {model.lanes.map((lane, k) => (
        <g key={k}>
          {lane.label && (
            <text x={0} y={L.laneY(k)} dy="0.35em" className={clsx(GUTTER_TEXT, "text-[11px] font-medium")}>
              {lane.label}
            </text>
          )}
          <Arrow x1={L.GUT} x2={right} y={L.laneY(k)} className="stroke-carbon-200 dark:stroke-carbon-700" />
        </g>
      ))}
      {result.runs.map((run) => (
        <Capsule key={run.id} model={model} L={L} run={run} t={t} hatchId={hatchId} />
      ))}

      {/* Axis */}
      {ticks.map((v) => (
        <g key={v}>
          <line x1={L.x(v)} x2={L.x(v)} y1={L.axisTop} y2={L.axisTop + 4} className={LINE} />
          <text x={L.x(v)} y={L.axisTop + 13} textAnchor="middle" className={clsx(MUTED_TEXT, "text-[10px] tabular-nums")}>
            {`${v}s`}
          </text>
        </g>
      ))}

      {/* Playhead */}
      <line
        x1={L.x(t)}
        x2={L.x(t)}
        y1={L.top}
        y2={L.axisTop}
        className="stroke-carbon-900/25 dark:stroke-carbon-100/30"
        strokeWidth={1}
      />

      {/* Event marbles */}
      {model.tokens.map((tok) => {
        if (t + EPS < tok.ev.t) return null;
        const pop = ease(clamp01((t - tok.ev.t) / T.pop));
        const rej = tok.stages.find((s) => s.kind === "reject");
        const rep = tok.stages.find((s) => s.kind === "replaced");
        const skipped = rej && t + EPS >= rej.t + T.move;
        const replaced = rep && t + EPS >= rep.t;
        const x = L.x(tok.ev.t);
        const y = L.inY(model.tenants.indexOf(tok.ev.tenant));
        const look = skipped ? LOOK.skipped : replaced ? LOOK.replaced : LOOK.event;
        return (
          <g key={tok.ev.id}>
            <Marble x={x} y={y} r={R} label={tok.label} look={look} scale={0.5 + 0.5 * pop} />
            {skipped && (
              <g>
                <circle cx={x + R * 0.8} cy={y - R * 0.8} r={4.5} className="fill-ruby-500 dark:fill-ruby-400" />
                <Cross x={x + R * 0.8} y={y - R * 0.8} s={1.8} className="stroke-white dark:stroke-carbon-1000" width={1.4} />
              </g>
            )}
          </g>
        );
      })}

      {/* Moving tokens */}
      {views.map((v) => (
        <g key={v.key}>
          <Marble x={v.x} y={v.y} r={R} label={v.label} look={v.look} opacity={v.opacity} scale={v.scale} />
          {v.cross && (
            <g opacity={v.opacity}>
              <Cross x={v.x} y={v.y} s={R * 0.95 * v.scale} className="stroke-ruby-500 dark:stroke-ruby-400" width={2} />
            </g>
          )}
        </g>
      ))}
    </>
  );
}

function Meter({ model, L, group, y, t }: { model: Model; L: Layout; group: string; y: number; t: number }) {
  const { scenario, cfg, result } = model;
  const tenant = group === "*" ? model.tenants[0] : group;
  switch (scenario.meter) {
    case "slots": {
      const n = cfg.concurrency.constraints[0].limit;
      return <Dots x={0} y={y} n={n} value={busySlots(model, group, t)} fill="fill-breeze-500 dark:fill-breeze-400" />;
    }
    case "throttle":
      if (!result.throttle) return null;
      return (
        <Dots x={0} y={y} n={result.throttle.capacity} value={gcraUnits(result.throttle, gcraKey(cfg.throttle.key, tenant), t)} fill="fill-carbon-700 dark:fill-carbon-200" />
      );
    case "rateLimit":
      if (!result.rateLimit) return null;
      return (
        <Dots x={0} y={y} n={result.rateLimit.capacity} value={gcraUnits(result.rateLimit, gcraKey(cfg.rateLimit.key, tenant), t)} fill="fill-carbon-700 dark:fill-carbon-200" />
      );
    case "batch": {
      const c = collectingAt(model, group, t);
      return <Dots x={0} y={y} n={cfg.batching.maxSize} value={c?.kind === "batch" ? c.count : 0} fill="fill-blush-400" />;
    }
    default:
      return null;
  }
}

/** Plans and holds drawn inside the band: debounce and batch timers, singleton locks. */
function BandOverlay({ model, L, group, y, t }: { model: Model; L: Layout; group: string; y: number; t: number }) {
  const { result, cfg } = model;
  const R = L.R;
  const out: ReactNode[] = [];

  if (cfg.singleton.enabled) {
    for (const h of result.singletonHolds) {
      if (h.from > t + EPS) continue;
      if (group !== "*" && h.key !== group) continue;
      const run = result.runs[h.runId - 1];
      const x0 = L.x(h.from);
      const x1 = Math.max(x0 + 2 * R, L.x(Math.min(h.to, t)));
      const w = x1 - x0;
      out.push(
        <g key={`h${h.runId}`}>
          <rect x={x0 + 0.5} y={y - R - 3} width={w - 1} height={2 * R + 6} rx={R + 3} className="fill-breeze-100/70 stroke-breeze-300 dark:fill-breeze-500/15 dark:stroke-breeze-600" strokeWidth={1} />
          {w > 44 && (
            <>
              <LockGlyph x={x0 + 10} y={y - 1.5} className="fill-breeze-600 text-breeze-600 dark:fill-breeze-300 dark:text-breeze-300" />
              <text x={x0 + 18} y={y} dy="0.35em" className="fill-breeze-700 text-[10px] font-medium dark:fill-breeze-200">
                {`run ${model.runLabel(run)}`}
              </text>
            </>
          )}
        </g>
      );
    }
  }

  const c = collectingAt(model, group, t);
  if (c) {
    const xs = L.x(t) + R + 3;
    const xf = L.x(c.fireAt);
    const capped = c.fireAt >= c.cap - EPS;
    if (xf > xs) {
      out.push(
        <line key="plan" x1={xs} x2={xf} y1={y} y2={y} className="stroke-blush-400" strokeWidth={1.25} strokeDasharray="3 3" />
      );
    }
    out.push(
      <g key="fire">
        <line x1={xf} x2={xf} y1={y - 7} y2={y + 7} className="stroke-blush-500 dark:stroke-blush-400" strokeWidth={1.5} strokeLinecap="round" />
        <text x={xf} y={y - 12} textAnchor="middle" className="fill-blush-700 text-[9.5px] font-medium dark:fill-blush-200">
          {c.kind === "batch" || capped ? "timeout" : "quiet"}
        </text>
      </g>
    );
    if (c.kind === "debounce" && Number.isFinite(c.cap) && !capped) {
      const xc = L.x(c.cap);
      out.push(
        <g key="cap" opacity={0.7}>
          <line x1={xc} x2={xc} y1={y - 5} y2={y + 5} className="stroke-carbon-400 dark:stroke-carbon-500" strokeWidth={1.25} strokeDasharray="2 2" />
          <text x={xc} y={y - 12} textAnchor="middle" className={clsx(MUTED_TEXT, "text-[9.5px]")}>
            timeout
          </text>
        </g>
      );
    }
  }
  return <>{out}</>;
}

function Capsule({ model, L, run, t, hatchId }: { model: Model; L: Layout; run: SimRun; t: number; hatchId: string }) {
  if (run.firstStartAt === undefined) return null;
  const land = model.landAt.get(run.id) ?? run.firstStartAt;
  if (t + EPS < land) return null;
  const R = L.R;
  const T = model.timing;
  const lane = model.laneOf.get(run.id) ?? 0;
  const y = L.laneY(lane);
  const x0 = L.x(run.firstStartAt);
  const tEnd = run.endedAt ?? model.domain;
  const grow = ease(clamp01((t - land) / T.move));
  const full = L.x(Math.min(t, tEnd));
  const edge = x0 + 2 * R + Math.max(0, full - x0 - 2 * R) * grow;
  const ended = run.endedAt !== undefined && t + EPS >= run.endedAt && grow >= 1;
  const cancelled = ended && run.end === "cancelled";
  const completed = ended && run.end === "completed";
  const cancelAt = model.cancelAt.get(run.id);
  const segs = run.segments.filter(
    (s) => s.kind !== "collect" && s.from >= run.firstStartAt! - EPS
  );

  return (
    <g>
      <g opacity={cancelled ? 0.55 : 1}>
        {segs.map((s, i) => {
          const a = L.x(s.from);
          let b = Math.min(L.x(s.to), edge);
          if (i === 0) b = Math.max(b, Math.min(edge, a + 2 * R));
          if (b - a < 0.5) return null;
          const w = b - a;
          const rx = Math.min(R, w / 2);
          const inset = 0.75;
          if (s.kind === "sleep") {
            return (
              <rect key={i} x={a + inset} y={y - R + inset} width={Math.max(0, w - 2 * inset)} height={2 * R - 2 * inset} rx={Math.max(0, rx - inset)} className="fill-white stroke-carbon-400 dark:fill-carbon-1000 dark:stroke-carbon-500" strokeWidth={1.25} strokeDasharray="3 2.5" />
            );
          }
          const look = s.kind === "wait" ? LOOK[s.reason || "backlog"] : LOOK.run;
          const hatchFrom = s.kind === "run" && s.cancelling && cancelAt !== undefined ? L.x(cancelAt) : null;
          return (
            <g key={i}>
              <rect x={a + inset} y={y - R} width={Math.max(0, w - 2 * inset)} height={2 * R} rx={rx} className={look.fill} />
              {hatchFrom !== null && edge > hatchFrom && t + EPS >= cancelAt! && (
                <>
                  <clipPath id={`${hatchId}-c${run.id}-${i}`}>
                    <rect x={a + inset} y={y - R} width={Math.max(0, w - 2 * inset)} height={2 * R} rx={rx} />
                  </clipPath>
                  <rect x={hatchFrom} y={y - R} width={Math.max(0, b - hatchFrom)} height={2 * R} fill={`url(#${hatchId})`} clipPath={`url(#${hatchId}-c${run.id}-${i})`} opacity={0.85} />
                </>
              )}
            </g>
          );
        })}
        <text x={x0 + R} y={y} dy="0.36em" textAnchor="middle" className={clsx(LOOK.run.text, "font-semibold tabular-nums")} style={{ fontSize: model.runLabel(run).length > 2 ? R * 0.85 : R * 1.05 }}>
          {run.collect?.kind === "batch" ? "" : model.runLabel(run)}
        </text>
        {run.collect?.kind === "batch" && (
          <text x={x0 + 6} y={y} dy="0.36em" className={clsx(LOOK.run.text, "font-semibold tabular-nums")} style={{ fontSize: R * 0.95 }}>
            {model.runLabel(run)}
          </text>
        )}
      </g>
      {completed && <Check x={L.x(tEnd) - R + 0.5} y={y} s={R * 0.42} className="stroke-white dark:stroke-carbon-1000" />}
      {cancelled && (
        <g>
          <circle cx={L.x(tEnd) - R} cy={y} r={R} className="fill-ruby-500 dark:fill-ruby-400" />
          <Cross x={L.x(tEnd) - R} y={y} s={R * 0.38} className="stroke-white dark:stroke-carbon-1000" width={1.75} />
        </g>
      )}
    </g>
  );
}

// ---------------------------------------------------------------------------
// Legend
// ---------------------------------------------------------------------------

function legendItems(model: Model) {
  const { result } = model;
  const firstWaits = result.runs.flatMap((r) =>
    r.segments.filter((s) => s.kind === "wait" && (r.firstStartAt === undefined || s.to <= r.firstStartAt + EPS))
  );
  const has = (fn: () => boolean) => fn();
  const items: { key: string; label: string; swatch: ReactNode }[] = [];
  const dot = (look: Look) => (
    <svg width={14} height={14} viewBox="-7 -7 14 14" aria-hidden>
      <circle r={look.stroke ? 5.75 : 6} className={clsx(look.fill, look.stroke)} strokeWidth={look.stroke ? 1.5 : 0} strokeDasharray={look.dash} />
    </svg>
  );
  items.push({ key: "event", label: "Event", swatch: dot(LOOK.event) });
  if (result.events.some((e) => e.outcome === "debounce-superseded"))
    items.push({ key: "replaced", label: "Replaced by a later event", swatch: dot(LOOK.replaced) });
  if (result.events.some((e) => e.outcome === "rate-limited" || e.outcome === "singleton-skipped"))
    items.push({
      key: "skipped",
      label: "Skipped",
      swatch: (
        <svg width={14} height={14} viewBox="-7 -7 14 14" aria-hidden>
          <circle r={5.75} className={clsx(LOOK.skipped.fill, LOOK.skipped.stroke)} strokeWidth={1.5} />
          <Cross x={0} y={0} s={2.6} className="stroke-ruby-500 dark:stroke-ruby-400" width={1.5} />
        </svg>
      ),
    });
  if (result.runs.some((r) => r.collect?.kind === "debounce"))
    items.push({ key: "collect-d", label: "Waiting for a quiet period", swatch: dot(LOOK.collect) });
  if (result.runs.some((r) => r.collect?.kind === "batch"))
    items.push({ key: "collect-b", label: "Collecting into a batch", swatch: dot(LOOK.collect) });
  if (firstWaits.some((s) => s.reason === "concurrency"))
    items.push({ key: "q-c", label: "Queued for a slot", swatch: dot(LOOK.concurrency) });
  if (firstWaits.some((s) => s.reason === "throttle"))
    items.push({ key: "q-t", label: "Queued for throttle capacity", swatch: dot(LOOK.throttle) });
  if (firstWaits.some((s) => s.reason === "backlog"))
    items.push({ key: "q-b", label: "Queued behind other keys", swatch: dot(LOOK.backlog) });
  if (result.runs.some((r) => r.firstStartAt !== undefined))
    items.push({
      key: "run",
      label: "Step executing",
      swatch: (
        <svg width={20} height={14} viewBox="0 0 20 14" aria-hidden>
          <rect x={1} y={1} width={18} height={12} rx={6} className={LOOK.run.fill} />
        </svg>
      ),
    });
  if (result.runs.some((r) => r.segments.some((s) => s.kind === "sleep")))
    items.push({
      key: "sleep",
      label: "Sleeping (no slot)",
      swatch: (
        <svg width={20} height={14} viewBox="0 0 20 14" aria-hidden>
          <rect x={1.5} y={1.5} width={17} height={11} rx={5.5} className="fill-white stroke-carbon-400 dark:fill-carbon-1000 dark:stroke-carbon-500" strokeWidth={1.25} strokeDasharray="3 2.5" />
        </svg>
      ),
    });
  if (has(() => result.runs.some((r) => r.end === "completed")))
    items.push({
      key: "done",
      label: "Completed",
      swatch: (
        <svg width={14} height={14} viewBox="-7 -7 14 14" aria-hidden>
          <circle r={6} className={LOOK.run.fill} />
          <Check x={0} y={0} s={2.8} className="stroke-white dark:stroke-carbon-1000" />
        </svg>
      ),
    });
  if (result.runs.some((r) => r.end === "cancelled"))
    items.push({
      key: "cancelled",
      label: "Cancelled",
      swatch: (
        <svg width={14} height={14} viewBox="-7 -7 14 14" aria-hidden>
          <circle r={6} className="fill-ruby-500 dark:fill-ruby-400" />
          <Cross x={0} y={0} s={2.4} className="stroke-white dark:stroke-carbon-1000" width={1.5} />
        </svg>
      ),
    });
  const meter = model.scenario.meter;
  const meterLabel =
    meter === "slots"
      ? "Slot in use"
      : meter === "throttle"
      ? "Throttle capacity"
      : meter === "rateLimit"
      ? "Rate limit capacity"
      : meter === "batch"
      ? "Events in the batch"
      : null;
  if (meterLabel) {
    const fill =
      meter === "slots"
        ? "fill-breeze-500 dark:fill-breeze-400"
        : meter === "batch"
        ? "fill-blush-400"
        : "fill-carbon-700 dark:fill-carbon-200";
    items.push({
      key: "meter",
      label: meterLabel,
      swatch: (
        <svg width={10} height={14} viewBox="-5 -7 10 14" aria-hidden>
          <circle r={3.25} className={fill} />
        </svg>
      ),
    });
  }
  return items;
}

// ---------------------------------------------------------------------------
// Playback
// ---------------------------------------------------------------------------

const END_HOLD_MS = 2200;

function usePlayback(domain: number, realDuration: number) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [t, setT] = useState(0);
  const tRef = useRef(0);
  const [playing, setPlaying] = useState(true);
  const [visible, setVisible] = useState(false);

  const seek = useCallback((v: number) => {
    tRef.current = v;
    setT(v);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (mq?.matches) {
      setPlaying(false);
      seek(domain);
    }
  }, [domain, seek]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      threshold: 0.2,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || !visible) return;
    let raf = 0;
    let last = performance.now();
    let holdUntil = 0;
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      let v = tRef.current;
      if (v >= domain - EPS) {
        if (!holdUntil) holdUntil = now + END_HOLD_MS;
        else if (now >= holdUntil) {
          holdUntil = 0;
          v = 0;
        }
      } else {
        v = Math.min(domain, v + (dt * domain) / realDuration);
      }
      if (v !== tRef.current) seek(v);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, visible, domain, realDuration, seek]);

  const toggle = () => {
    if (!playing && tRef.current >= domain - EPS) seek(0);
    setPlaying((p) => !p);
  };
  const replay = () => {
    seek(0);
    setPlaying(true);
  };
  return { rootRef, t, playing, setPlaying, seek, toggle, replay };
}

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
    ro.observe(el);
    setWidth(Math.floor(el.getBoundingClientRect().width));
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * An animated marble diagram for one flow control scenario. Events enter at
 * the top, wait or get skipped in the flow control row, and execute in the
 * lanes below. The timeline comes from the flow control simulator's engine.
 */
export function FlowControlMarbles({ scenario: id }: { scenario: string }) {
  const scenario = getMarbleScenario(id);
  const model = useMemo(
    () => (scenario ? buildModel(scenario, simulate(scenario.config)) : null),
    [scenario]
  );
  const { rootRef, t, playing, setPlaying, seek, toggle, replay } = usePlayback(
    model?.domain ?? 10,
    model?.realDuration ?? 8
  );
  const [boxRef, width] = useWidth<HTMLDivElement>();
  const hatchId = `fcm-hatch-${useId().replace(/:/g, "")}`;
  const dragging = useRef(false);

  if (!scenario || !model) {
    return process.env.NODE_ENV === "development" ? (
      <p className="text-error">Unknown flow control scenario: {id}</p>
    ) : null;
  }

  const L = width > 0 ? layoutFor(model, width) : null;
  const reserve = layoutFor(model, 700).height;
  const legend = legendItems(model);
  const scrub = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!L) return;
    const box = e.currentTarget.getBoundingClientRect();
    seek(L.tAt(e.clientX - box.left));
  };

  return (
    <figure
      ref={rootRef}
      className="not-prose my-8 flex flex-col gap-3 rounded-xl bg-canvasSubtle p-3 leading-normal text-basis sm:p-4"
    >
      <div className="flex flex-wrap items-center gap-2">
        <code className="min-w-0 max-w-full truncate rounded-md bg-canvasBase px-2 py-1 font-mono text-[11px] text-basis ring-1 ring-inset ring-carbon-200 dark:ring-carbon-700 sm:text-xs">
          {scenario.code}
        </code>
        <div className="ml-auto flex items-center gap-0.5">
          <span className="mr-1 w-10 text-right font-mono text-[11px] tabular-nums text-muted" aria-hidden>
            {`${t.toFixed(1)}s`}
          </span>
          <ControlButton label={playing ? "Pause" : "Play"} onClick={toggle}>
            {playing ? <RiPauseFill className="h-3.5 w-3.5" /> : <RiPlayFill className="h-3.5 w-3.5" />}
          </ControlButton>
          <ControlButton label="Replay" onClick={replay}>
            <RiRestartLine className="h-3.5 w-3.5" />
          </ControlButton>
          <a
            href={simulatorHref(scenario.preset, scenario.config)}
            className="ml-1 inline-flex h-7 items-center gap-0.5 rounded-md px-1.5 text-[11px] font-medium text-muted transition-colors hover:bg-canvasMuted hover:text-basis"
            title="Open this scenario in the flow control simulator"
          >
            Simulator
            <RiArrowRightUpLine className="h-3 w-3" />
          </a>
        </div>
      </div>

      <div ref={boxRef} className="rounded-lg bg-canvasBase px-2 py-2 sm:px-3" style={{ minHeight: L ? undefined : reserve + 16 }}>
        {L && (
          <svg
            width={L.width}
            height={L.height}
            role="img"
            aria-label={scenario.caption}
            className="block cursor-ew-resize select-none"
            style={{ touchAction: "pan-y" }}
            onPointerDown={(e) => {
              dragging.current = true;
              try {
                e.currentTarget.setPointerCapture(e.pointerId);
              } catch {
                // Synthetic or already-released pointers can't be captured.
              }
              setPlaying(false);
              scrub(e);
            }}
            onPointerMove={(e) => dragging.current && scrub(e)}
            onPointerUp={() => (dragging.current = false)}
            onPointerCancel={() => (dragging.current = false)}
          >
            <Diagram model={model} L={L} t={t} hatchId={hatchId} />
          </svg>
        )}
      </div>

      <figcaption className="flex flex-col gap-2">
        <ul className="m-0 flex list-none flex-wrap gap-x-3 gap-y-1 p-0 text-[11px] text-subtle">
          {legend.map((item) => (
            <li key={item.key} className="m-0 flex items-center gap-1 p-0">
              {item.swatch}
              {item.label}
            </li>
          ))}
        </ul>
        <p className="m-0 text-xs leading-relaxed text-subtle">{scenario.caption}</p>
      </figcaption>
    </figure>
  );
}

function ControlButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted transition-colors hover:bg-canvasMuted hover:text-basis"
    >
      {children}
    </button>
  );
}
