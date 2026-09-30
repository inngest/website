"use client";

import clsx from "clsx";
import {
  memo,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { SimRun } from "../FlowControlSimulator/engine";
import { fmtT } from "../FlowControlSimulator/derive";
import {
  GUTTER_TEXT,
  LANE_LINE,
  LINE,
  LOOK,
  METER_FILL,
  MUTED_TEXT,
  SLEEP,
  type Look,
  type LookKey,
} from "./looks";
import {
  EPS,
  MAX_STACK,
  clamp01,
  collectingAt,
  ease,
  eventTip,
  gcraUnits,
  queueAt,
  runTip,
  slotsAt,
  waitReasonAt,
  type BandRow,
  type Model,
  type Stage,
  type Token,
} from "./model";

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

export type Layout = ReturnType<typeof layoutFor>;

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
const offsets = (start: number, hs: number[]) =>
  hs.map((_, i) => start + sum(hs.slice(0, i)));

export function layoutFor(model: Model, width: number) {
  const compact = width < 520;
  const dense = model.dense;
  const R = dense ? (compact ? 4.5 : 5.5) : compact ? 7 : 9;
  const GUT = compact ? 58 : 78;
  const RIGHT = 12;
  const IN_H = dense ? 22 : compact ? 26 : 30;
  const LANE_H = 2 * R + (dense ? 6 : compact ? 8 : 10);
  const AXIS_H = 18;
  const top = 4;
  const plotLeft = GUT + R + 4;
  const plotRight = width - RIGHT - 8;
  const plotW = Math.max(40, plotRight - plotLeft);
  const domain = model.domain;
  const x = (t: number) => plotLeft + (Math.max(0, t) / domain) * plotW;
  const tAt = (px: number) =>
    Math.max(0, Math.min(domain, ((px - plotLeft) / plotW) * domain));

  const STACK = 2 * R + 1;
  const rowH = model.rowDepth.map((d) => IN_H + (d - 1) * STACK);
  const rowTop = offsets(top, rowH);
  const inY = (i: number) => rowTop[i] + rowH[i] / 2;

  const bandTop = top + sum(rowH) + 6;
  const baseBand = dense ? 32 : compact ? 36 : 40;
  const bandH = model.rows.map((r) =>
    Math.max(baseBand, 22 + 11 * r.meters.length)
  );
  const bandRowTop = offsets(bandTop, bandH);
  const bandBottom = bandTop + sum(bandH);
  const lanesTop = bandBottom + 8;
  const axisTop = lanesTop + model.lanes.length * LANE_H + 4;
  const QSP = 2 * R + 3;

  return {
    compact,
    labels: !dense,
    width,
    R,
    GUT,
    RIGHT,
    QSP,
    /** Most dots a waiting line shows before a "+N" badge. */
    QCAP: Math.max(4, Math.floor((plotW * 0.4) / QSP)),
    top,
    plotLeft,
    x,
    tAt,
    rowTop,
    rowH,
    inY,
    /** An event marble's center. Events at one instant stack vertically. */
    evY: (tenantIndex: number, eventId: number) => {
      const st = model.stack.get(eventId) ?? { i: 0, n: 1 };
      const n = Math.min(st.n, MAX_STACK);
      const i = Math.min(st.i, n - 1);
      return inY(tenantIndex) + (i - (n - 1) / 2) * STACK;
    },
    bandTop,
    bandBottom,
    bandRowTop,
    bandH,
    bandY: (j: number) => bandRowTop[j] + bandH[j] / 2 + 2,
    LANE_H,
    lanesTop,
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
  hidden?: boolean;
}

const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

/**
 * Position in a line of waiting dots. The front sits at the playhead; dots
 * past the cap collapse under a "+N" badge.
 */
function slot(L: Layout, t: number, i: number, n: number) {
  const m = Math.min(n, L.QCAP);
  const j = Math.min(i, m - 1);
  const anchor = L.x(t);
  const left = anchor - Math.max(0, m - 1) * L.QSP;
  const shift = Math.max(0, L.plotLeft - left);
  return { x: anchor - j * L.QSP + shift, hidden: n > L.QCAP && i >= m - 1 };
}

function queuePos(
  model: Model,
  L: Layout,
  group: string,
  runId: number,
  t: number
) {
  const { cur, prev } = queueAt(model, group, t);
  const ci = cur.order.indexOf(runId);
  const pi = prev ? prev.order.indexOf(runId) : -1;
  if (ci < 0) return slot(L, t, Math.max(0, pi), prev ? prev.order.length : 1);
  const target = slot(L, t, ci, cur.order.length);
  if (pi >= 0 && t - cur.t < model.timing.move) {
    const from = slot(L, t, pi, prev!.order.length);
    return {
      x: lerp(from.x, target.x, ease((t - cur.t) / model.timing.move)),
      hidden: target.hidden,
    };
  }
  return target;
}

function stagePos(
  model: Model,
  L: Layout,
  tok: Token,
  s: Stage,
  t: number
): Pt {
  const run =
    s.runId !== undefined ? model.result.runs[s.runId - 1] : undefined;
  const schedY = L.bandY(
    tok.schedRow >= 0 ? tok.schedRow : Math.max(0, tok.queueRow)
  );
  const queueY = L.bandY(
    tok.queueRow >= 0 ? tok.queueRow : Math.max(0, tok.schedRow)
  );
  switch (s.kind) {
    case "input":
      return {
        x: L.x(tok.ev!.t),
        y: L.evY(model.tenants.indexOf(tok.tenant), tok.ev!.id),
      };
    case "lane":
      return {
        x: L.x(s.at ?? s.t) - L.R,
        y: L.laneY(model.laneOf.get(run!.id) ?? 0),
      };
    case "collect": {
      if (run?.collect?.kind === "batch") {
        const arrived = run.eventIds.filter(
          (id) => model.result.events[id].t <= t + EPS
        );
        const p = slot(
          L,
          t,
          Math.max(0, arrived.indexOf(tok.ev!.id)),
          arrived.length
        );
        return { x: p.x, y: schedY, hidden: p.hidden };
      }
      return { x: slot(L, t, 0, 1).x, y: schedY };
    }
    case "queue": {
      const p = queuePos(model, L, model.queueGroup(tok.tenant), s.runId!, t);
      return { x: p.x, y: queueY, hidden: p.hidden };
    }
    case "reject":
      return { x: L.x(s.at ?? s.t), y: s.inQueue ? queueY : schedY };
    case "replaced":
      return { x: slot(L, s.t, 0, 1).x, y: schedY };
    case "start":
      return {
        x: L.x(s.at ?? run!.firstStartAt!) + L.R,
        y: L.laneY(model.laneOf.get(run!.id) ?? 0),
      };
  }
}

interface TokenView {
  key: string;
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
  if (t + EPS < st[0].t || st.length < 2) return null;
  const T = model.timing;
  const last = st[st.length - 1];
  // Finished tokens: skip the position math.
  if (last.kind === "start" && t > last.t + T.move) return null;
  if (
    (last.kind === "reject" || last.kind === "replaced") &&
    t > last.t + T.move + T.fade
  )
    return null;
  let k = 0;
  for (let i = 1; i < st.length; i++) if (st[i].t <= t + EPS) k = i;
  if (k === 0) return null; // Still drawn as the event marble or capsule.
  const cur = st[k];
  const p = clamp01((t - cur.t) / T.move);
  const to = stagePos(model, L, tok, cur, t);
  const from = stagePos(model, L, tok, st[k - 1], cur.t);
  const e = ease(p);
  let x = lerp(from.x, to.x, e);
  let y = lerp(from.y, to.y, e);
  let look: Look = LOOK.event;
  let opacity = to.hidden && p >= 1 ? 0 : 1;
  let scale = 1;
  let cross = false;
  const run =
    cur.runId !== undefined ? model.result.runs[cur.runId - 1] : undefined;
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
      opacity = 1;
      break;
    case "reject": {
      if (p < 1) {
        look = st[k - 1].kind === "collect" ? LOOK.collect : LOOK.event;
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
  if (opacity <= 0) return null;
  return { key: tok.key, x, y, label: tok.label, look, opacity, scale, cross };
}

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

export function Marble({
  x,
  y,
  r,
  label,
  look,
  opacity = 1,
  scale = 1,
  ring = false,
  hideLabel = false,
}: {
  x: number;
  y: number;
  r: number;
  label: string;
  look: Look;
  opacity?: number;
  scale?: number;
  /** Separate overlapping marbles with a background-colored ring. */
  ring?: boolean;
  hideLabel?: boolean;
}) {
  const fs = label.length > 2 ? r * 0.85 : r * 1.05;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
      {ring && (
        <circle r={r + 1.5} className="fill-white dark:fill-carbon-1000" />
      )}
      <circle
        r={look.stroke ? r - 0.75 : r}
        className={clsx(look.fill, look.stroke)}
        strokeWidth={look.stroke ? 1.5 : 0}
        strokeDasharray={look.dash}
      />
      {!hideLabel && label && (
        <text
          textAnchor="middle"
          dy="0.36em"
          className={clsx(look.text, "font-semibold tabular-nums")}
          style={{ fontSize: fs }}
        >
          {label}
        </text>
      )}
    </g>
  );
}

export function Cross({
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
      d={`M${x - s},${y - s}L${x + s},${y + s}M${x + s},${y - s}L${x - s},${
        y + s
      }`}
      className={className}
      strokeWidth={width}
      strokeLinecap="round"
      fill="none"
    />
  );
}

export function Check({
  x,
  y,
  s,
  className,
}: {
  x: number;
  y: number;
  s: number;
  className: string;
}) {
  return (
    <path
      d={`M${x - s},${y + 0.1 * s}L${x - 0.3 * s},${y + 0.75 * s}L${x + s},${
        y - 0.7 * s
      }`}
      className={className}
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  );
}

function Arrow({
  x1,
  x2,
  y,
  className,
}: {
  x1: number;
  x2: number;
  y: number;
  className: string;
}) {
  return (
    <g className={className} fill="none" strokeWidth={1.25}>
      <line x1={x1} x2={x2} y1={y} y2={y} />
      <path
        d={`M${x2 - 5},${y - 3.5}L${x2},${y}L${x2 - 5},${y + 3.5}`}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

/** A small "+N" pill for dots that don't fit. */
function MorePill({
  x,
  y,
  n,
  R,
}: {
  x: number;
  y: number;
  n: number;
  R: number;
}) {
  const text = `+${n}`;
  const w = Math.max(2 * R, text.length * 6 + 6);
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect
        x={-w / 2}
        y={-R}
        width={w}
        height={2 * R}
        rx={R}
        className="fill-carbon-100 stroke-carbon-300 dark:fill-carbon-800 dark:stroke-carbon-600"
        strokeWidth={1}
      />
      <text
        textAnchor="middle"
        dy="0.36em"
        className="fill-carbon-700 font-semibold tabular-nums dark:fill-carbon-200"
        style={{ fontSize: Math.max(8, R * 0.95) }}
      >
        {text}
      </text>
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
  value: number;
  fill: string;
}) {
  const id = useId();
  if (n > 6) {
    // Too many to draw one by one: a small bar with the count.
    const w = 34;
    const f = clamp01(value / n);
    return (
      <g>
        <rect
          x={x}
          y={y - 3}
          width={w}
          height={6}
          rx={3}
          className="fill-none stroke-carbon-400 dark:stroke-carbon-500"
          strokeWidth={1}
        />
        <rect
          x={x}
          y={y - 3}
          width={w * f}
          height={6}
          rx={3}
          className={fill}
        />
        <text
          x={x + w + 4}
          y={y}
          dy="0.35em"
          className={clsx(MUTED_TEXT, "text-[9px] tabular-nums")}
        >
          {`${Math.floor(value + EPS)}/${n}`}
        </text>
      </g>
    );
  }
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
              <rect
                x={cx - r}
                y={y + r - 2 * r * f}
                width={2 * r}
                height={2 * r * f}
              />
            </clipPath>
            <circle
              cx={cx}
              cy={y}
              r={r - 0.5}
              className="fill-none stroke-carbon-400 dark:stroke-carbon-500"
              strokeWidth={1}
            />
            {f > 0 && (
              <circle
                cx={cx}
                cy={y}
                r={r}
                className={fill}
                clipPath={`url(#${id}-${i})`}
              />
            )}
          </g>
        );
      })}
    </g>
  );
}

function LockGlyph({
  x,
  y,
  className,
}: {
  x: number;
  y: number;
  className: string;
}) {
  return (
    <g className={className} transform={`translate(${x} ${y})`}>
      <rect x={-3.5} y={-1} width={7} height={5.5} rx={1} />
      <path
        d="M-2,-1V-3a2,2 0 0 1 4,0V-1"
        fill="none"
        strokeWidth={1.25}
        className="stroke-current"
      />
    </g>
  );
}

// ---------------------------------------------------------------------------
// Layers
// ---------------------------------------------------------------------------

/** Rows, lines, labels and the axis: redrawn only on resize. */
const StaticLayer = memo(function StaticLayer({
  model,
  L,
  interactive,
}: {
  model: Model;
  L: Layout;
  interactive: boolean;
}) {
  const right = L.width - L.RIGHT;
  const step =
    model.domain <= 8
      ? 1
      : model.domain <= 16
      ? 2
      : model.domain <= 40
      ? 5
      : model.domain <= 80
      ? 10
      : 30;
  const tickStep = L.x(step) - L.x(0) < 34 ? step * 2 : step;
  const ticks: number[] = [];
  for (let v = 0; v <= model.domain + EPS; v += tickStep) ticks.push(v);
  return (
    <>
      {model.tenants.map((tenant, i) => (
        <g key={tenant}>
          {interactive && (
            <rect
              data-row={i}
              x={L.GUT}
              y={L.rowTop[i]}
              width={right - L.GUT}
              height={L.rowH[i]}
              className="cursor-copy fill-transparent hover:fill-carbon-50 dark:hover:fill-carbon-900"
            />
          )}
          <text
            x={0}
            y={L.inY(i)}
            dy="0.35em"
            className={clsx(
              GUTTER_TEXT,
              "pointer-events-none text-[11px] font-medium"
            )}
          >
            {model.tenantName(tenant)}
          </text>
          <g className="pointer-events-none">
            <Arrow x1={L.GUT} x2={right} y={L.inY(i)} className={LINE} />
          </g>
        </g>
      ))}

      <rect
        data-scrub
        x={L.GUT}
        y={L.bandTop}
        width={right - L.GUT}
        height={L.bandBottom - L.bandTop}
        rx={8}
        className="fill-carbon-50 stroke-carbon-200 dark:fill-carbon-900 dark:stroke-carbon-700"
        strokeWidth={1}
      />
      {model.rows.map((row, j) => (
        <g key={`${row.kind}-${row.group}`} className="pointer-events-none">
          {j > 0 && (
            <line
              x1={L.GUT + 8}
              x2={right - 8}
              y1={L.bandRowTop[j]}
              y2={L.bandRowTop[j]}
              className="stroke-carbon-200 dark:stroke-carbon-700"
              strokeDasharray={
                model.rows[j - 1].kind === row.kind ? "3 3" : undefined
              }
            />
          )}
          <text
            x={0}
            y={L.bandRowTop[j] + 13}
            dy="0.35em"
            className={clsx(GUTTER_TEXT, "text-[11px] font-medium")}
          >
            {row.label}
          </text>
        </g>
      ))}

      <rect
        data-scrub
        x={L.GUT}
        y={L.lanesTop - 4}
        width={right - L.GUT}
        height={L.axisTop - L.lanesTop + 22}
        className="fill-transparent"
      />
      {model.lanes.map((lane, k) => (
        <g key={k} className="pointer-events-none">
          {lane.label && (
            <text
              x={0}
              y={L.laneY(k)}
              dy="0.35em"
              className={clsx(
                lane.overflow ? MUTED_TEXT : GUTTER_TEXT,
                "text-[11px] font-medium"
              )}
            >
              {lane.label}
            </text>
          )}
          <Arrow x1={L.GUT} x2={right} y={L.laneY(k)} className={LANE_LINE} />
        </g>
      ))}

      {ticks.map((v) => (
        <g key={v} className="pointer-events-none">
          <line
            x1={L.x(v)}
            x2={L.x(v)}
            y1={L.axisTop}
            y2={L.axisTop + 4}
            className={LINE}
          />
          <text
            x={L.x(v)}
            y={L.axisTop + 13}
            textAnchor="middle"
            className={clsx(MUTED_TEXT, "text-[10px] tabular-nums")}
          >
            {fmtT(v)}
          </text>
        </g>
      ))}
    </>
  );
});

const EventMarble = memo(function EventMarble({
  id,
  x,
  y,
  R,
  label,
  look,
  scale,
  hideLabel,
  skipped,
  more,
  manual,
  future,
}: {
  id: number;
  x: number;
  y: number;
  R: number;
  label: string;
  look: LookKey;
  scale: number;
  hideLabel: boolean;
  skipped: boolean;
  /** For the last visible marble of a tall stack: how many it stands for. */
  more: number;
  manual: boolean;
  /** Not arrived yet: a faint outline, so added events show up at once. */
  future: boolean;
}) {
  const b = Math.max(3, R * 0.5);
  if (future) {
    return (
      <g data-ev={id} className={manual ? "cursor-pointer" : undefined}>
        <circle
          cx={x}
          cy={y}
          r={R - 0.75}
          className="fill-white stroke-carbon-300 dark:fill-carbon-1000 dark:stroke-carbon-600"
          strokeWidth={1.25}
          strokeDasharray="2 2"
        />
        {more > 0 && (
          <text
            x={x}
            y={y}
            dy="0.36em"
            textAnchor="middle"
            className={clsx(MUTED_TEXT, "text-[8px] font-semibold")}
          >
            +
          </text>
        )}
      </g>
    );
  }
  return (
    <g data-ev={id} className={manual ? "cursor-pointer" : undefined}>
      {more > 0 ? (
        <MorePill x={x} y={y} n={more} R={R} />
      ) : (
        <Marble
          x={x}
          y={y}
          r={R}
          label={label}
          look={LOOK[look]}
          scale={scale}
          ring
          hideLabel={hideLabel}
        />
      )}
      {manual && more === 0 && (
        <circle
          cx={x}
          cy={y}
          r={R + 3}
          className="fill-none stroke-breeze-500/70"
          strokeWidth={1.25}
          strokeDasharray="2 2"
        />
      )}
      {skipped && more === 0 && (
        <g className="pointer-events-none">
          <circle
            cx={x + R * 0.8}
            cy={y - R * 0.8}
            r={b}
            className="fill-ruby-500 dark:fill-ruby-400"
          />
          <Cross
            x={x + R * 0.8}
            y={y - R * 0.8}
            s={b * 0.4}
            className="stroke-white dark:stroke-carbon-1000"
            width={1.4}
          />
        </g>
      )}
    </g>
  );
});

const Capsule = memo(function Capsule({
  model,
  L,
  run,
  t,
  hatchId,
  selected,
  interactive,
}: {
  model: Model;
  L: Layout;
  run: SimRun;
  interactive: boolean;
  /** The playhead, clamped once the capsule stops changing; -1 hides it. */
  t: number;
  hatchId: string;
  selected: boolean;
}) {
  if (t < 0 || run.firstStartAt === undefined) return null;
  const R = L.R;
  const T = model.timing;
  const land = model.landAt.get(run.id) ?? run.firstStartAt;
  const lane = model.laneOf.get(run.id) ?? 0;
  const overflow = model.lanes[lane]?.overflow;
  const y = L.laneY(lane);
  const x0 = L.x(run.firstStartAt);
  const tEnd = run.endedAt ?? model.domain;
  const grow = ease(clamp01((t - land) / T.move));
  const full = L.x(Math.min(t, tEnd));
  const edge = x0 + 2 * R + Math.max(0, full - x0 - 2 * R) * grow;
  const ended =
    run.endedAt !== undefined && t + EPS >= run.endedAt && grow >= 1;
  const cancelled = ended && run.end === "cancelled";
  const completed = ended && run.end === "completed";
  const cancelAt = model.cancelAt.get(run.id);
  const segs = run.segments.filter(
    (s) => s.kind !== "collect" && s.from >= run.firstStartAt! - EPS
  );
  const fullLabel = L.labels ? model.runLabel(run) : "";
  const fits =
    L.x(tEnd) - x0 >= fullLabel.length * R * 0.62 + 12 ||
    run.eventIds.length < 2;
  const batch = run.collect?.kind === "batch" && fits;
  const label =
    run.collect?.kind === "batch" && !fits && L.labels
      ? model.eventLabel(model.result.events[run.eventIds[0]])
      : fullLabel;

  return (
    <g
      data-run={run.id}
      className={interactive ? "cursor-pointer" : undefined}
      opacity={overflow ? 0.6 : 1}
    >
      {selected && (
        <rect
          x={x0 - 2.5}
          y={y - R - 2.5}
          width={edge - x0 + 5}
          height={2 * R + 5}
          rx={R + 2.5}
          className="fill-none stroke-carbon-900 dark:stroke-white"
          strokeWidth={1.5}
        />
      )}
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
              <rect
                key={i}
                x={a + inset}
                y={y - R + inset}
                width={Math.max(0, w - 2 * inset)}
                height={2 * R - 2 * inset}
                rx={Math.max(0, rx - inset)}
                className={SLEEP}
                strokeWidth={1.25}
                strokeDasharray="3 2.5"
              />
            );
          }
          const look =
            s.kind === "wait" ? LOOK[s.reason || "backlog"] : LOOK.run;
          const hatchFrom =
            s.kind === "run" && s.cancelling && cancelAt !== undefined
              ? L.x(cancelAt)
              : null;
          return (
            <g key={i}>
              <rect
                x={a + inset}
                y={y - R}
                width={Math.max(0, w - 2 * inset)}
                height={2 * R}
                rx={rx}
                className={look.fill}
              />
              {hatchFrom !== null &&
                edge > hatchFrom &&
                t + EPS >= cancelAt! && (
                  <>
                    <clipPath id={`${hatchId}-c${run.id}-${i}`}>
                      <rect
                        x={a + inset}
                        y={y - R}
                        width={Math.max(0, w - 2 * inset)}
                        height={2 * R}
                        rx={rx}
                      />
                    </clipPath>
                    <rect
                      x={hatchFrom}
                      y={y - R}
                      width={Math.max(0, b - hatchFrom)}
                      height={2 * R}
                      fill={`url(#${hatchId})`}
                      clipPath={`url(#${hatchId}-c${run.id}-${i})`}
                      opacity={0.85}
                    />
                  </>
                )}
            </g>
          );
        })}
        {label && (
          <text
            x={batch ? x0 + 6 : x0 + R}
            y={y}
            dy="0.36em"
            textAnchor={batch ? "start" : "middle"}
            className={clsx(
              LOOK.run.text,
              "pointer-events-none font-semibold tabular-nums"
            )}
            style={{
              fontSize: !batch && label.length > 2 ? R * 0.85 : R * 1.0,
            }}
          >
            {label}
          </text>
        )}
      </g>
      {completed && (
        <Check
          x={L.x(tEnd) - R + 0.5}
          y={y}
          s={R * 0.42}
          className="pointer-events-none stroke-white dark:stroke-carbon-1000"
        />
      )}
      {cancelled && (
        <g className="pointer-events-none">
          <circle
            cx={L.x(tEnd) - R}
            cy={y}
            r={R}
            className="fill-ruby-500 dark:fill-ruby-400"
          />
          <Cross
            x={L.x(tEnd) - R}
            y={y}
            s={R * 0.38}
            className="stroke-white dark:stroke-carbon-1000"
            width={1.75}
          />
        </g>
      )}
    </g>
  );
});

function Meter({
  model,
  row,
  x,
  y,
  t,
  kind,
}: {
  model: Model;
  row: BandRow;
  x: number;
  y: number;
  t: number;
  kind: BandRow["meters"][number];
}) {
  const { cfg, result } = model;
  const key = row.group === "*" ? "*" : row.group;
  switch (kind) {
    case "slots": {
      const { used, limit } = slotsAt(model, row, t);
      return (
        <Dots x={x} y={y} n={limit} value={used} fill={METER_FILL.slots} />
      );
    }
    case "throttle":
      return result.throttle ? (
        <Dots
          x={x}
          y={y}
          n={result.throttle.capacity}
          value={gcraUnits(result.throttle, key, t)}
          fill={METER_FILL.throttle}
        />
      ) : null;
    case "rateLimit":
      return result.rateLimit ? (
        <Dots
          x={x}
          y={y}
          n={result.rateLimit.capacity}
          value={gcraUnits(result.rateLimit, key, t)}
          fill={METER_FILL.rateLimit}
        />
      ) : null;
    case "batch": {
      const c = collectingAt(model, row.group, t).find(
        (x) => x.kind === "batch"
      );
      return (
        <Dots
          x={x}
          y={y}
          n={cfg.batching.maxSize}
          value={c ? c.count : 0}
          fill={METER_FILL.batch}
        />
      );
    }
  }
}

/** Live state inside the band: meters, locks, timers and "+N" badges. */
function BandLayer({ model, L, t }: { model: Model; L: Layout; t: number }) {
  const { result, cfg } = model;
  const R = L.R;
  const out: ReactNode[] = [];
  model.rows.forEach((row, j) => {
    const y = L.bandY(j);
    row.meters.forEach((m, mi) => {
      out.push(
        <Meter
          key={`m${j}-${m}`}
          model={model}
          row={row}
          kind={m}
          x={0}
          y={L.bandRowTop[j] + 26 + 11 * mi}
          t={t}
        />
      );
    });
    if (row.kind === "queue") {
      const { cur } = queueAt(model, row.group, t);
      if (cur.order.length > L.QCAP) {
        const p = slot(L, t, L.QCAP - 1, cur.order.length);
        out.push(
          <MorePill
            key={`q${j}`}
            x={p.x}
            y={y}
            n={cur.order.length - L.QCAP + 1}
            R={R}
          />
        );
      }
      return;
    }
    if (cfg.singleton.enabled) {
      for (const h of result.singletonHolds) {
        if (h.from > t + EPS) continue;
        const run = result.runs[h.runId - 1];
        if (model.schedGroup(run.tenant) !== row.group) continue;
        const x0 = L.x(h.from);
        const x1 = Math.max(x0 + 2 * R, L.x(Math.min(h.to, t)));
        const w = x1 - x0;
        out.push(
          <g key={`h${h.runId}-${h.from}`}>
            <rect
              x={x0 + 0.5}
              y={y - R - 3}
              width={w - 1}
              height={2 * R + 6}
              rx={R + 3}
              className="fill-breeze-100/70 stroke-breeze-300 dark:fill-breeze-500/15 dark:stroke-breeze-600"
              strokeWidth={1}
            />
            {w > 44 && L.labels && (
              <>
                <LockGlyph
                  x={x0 + 10}
                  y={y - 1.5}
                  className="fill-breeze-600 text-breeze-600 dark:fill-breeze-300 dark:text-breeze-300"
                />
                <text
                  x={x0 + 18}
                  y={y}
                  dy="0.35em"
                  className="fill-breeze-700 text-[10px] font-medium dark:fill-breeze-200"
                >
                  {`run ${model.runLabel(run)}`}
                </text>
              </>
            )}
          </g>
        );
      }
    }
    for (const c of collectingAt(model, row.group, t)) {
      const xs = L.x(t) + R + 3;
      const xf = L.x(c.fireAt);
      const capped = c.fireAt >= c.cap - EPS;
      if (xf > xs)
        out.push(
          <line
            key={`p${j}-${c.run.id}`}
            x1={xs}
            x2={xf}
            y1={y}
            y2={y}
            className="stroke-blush-400"
            strokeWidth={1.25}
            strokeDasharray="3 3"
          />
        );
      out.push(
        <g key={`f${j}-${c.run.id}`}>
          <line
            x1={xf}
            x2={xf}
            y1={y - 7}
            y2={y + 7}
            className="stroke-blush-500 dark:stroke-blush-400"
            strokeWidth={1.5}
            strokeLinecap="round"
          />
          <text
            x={xf}
            y={y - 12}
            textAnchor="middle"
            className="fill-blush-700 text-[9.5px] font-medium dark:fill-blush-200"
          >
            {c.kind === "batch" || capped ? "timeout" : "quiet"}
          </text>
        </g>
      );
      if (c.kind === "debounce" && Number.isFinite(c.cap) && !capped) {
        const xc = L.x(c.cap);
        out.push(
          <g key={`c${j}-${c.run.id}`} opacity={0.7}>
            <line
              x1={xc}
              x2={xc}
              y1={y - 5}
              y2={y + 5}
              className="stroke-carbon-400 dark:stroke-carbon-500"
              strokeWidth={1.25}
              strokeDasharray="2 2"
            />
            <text
              x={xc}
              y={y - 12}
              textAnchor="middle"
              className={clsx(MUTED_TEXT, "text-[9.5px]")}
            >
              timeout
            </text>
          </g>
        );
      }
      if (c.kind === "batch" && c.count > L.QCAP) {
        const p = slot(L, t, L.QCAP - 1, c.count);
        out.push(
          <MorePill
            key={`b${j}-${c.run.id}`}
            x={p.x}
            y={y}
            n={c.count - L.QCAP + 1}
            R={R}
          />
        );
      }
    }
  });
  return <g className="pointer-events-none">{out}</g>;
}

// ---------------------------------------------------------------------------
// Diagram
// ---------------------------------------------------------------------------

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

export interface MarbleDiagramProps {
  model: Model;
  t: number;
  /** Accessible description of the whole diagram. */
  label: string;
  onSeek?: (t: number) => void;
  /** Called when a scrub starts, e.g. to pause playback. */
  onScrubStart?: () => void;
  /** Turns on tooltips, adding and removing events, and selecting runs. */
  interactive?: boolean;
  onAddEvent?: (tenant: string, t: number) => void;
  onRemoveManual?: (index: number) => void;
  onSelectRun?: (id: number | null) => void;
  selectedRun?: number | null;
  /** Show events that haven't arrived yet as faint outlines. */
  showFuture?: boolean;
}

/**
 * An animated marble diagram of a simulation. Events enter at the top, wait,
 * collect or get skipped in the flow control band, and execute in the lanes.
 */
export function MarbleDiagram({
  model,
  t,
  label,
  onSeek,
  onScrubStart,
  interactive = false,
  onAddEvent,
  onRemoveManual,
  onSelectRun,
  selectedRun = null,
  showFuture = false,
}: MarbleDiagramProps) {
  const [boxRef, width] = useWidth<HTMLDivElement>();
  const hatchId = `fcm-hatch-${useId().replace(/:/g, "")}`;
  const L = useMemo(
    () => (width > 0 ? layoutFor(model, width) : null),
    [model, width]
  );
  const reserve = useMemo(() => layoutFor(model, 700).height, [model]);
  const [tip, setTip] = useState<Tip>(null);
  const [ghost, setGhost] = useState<{ row: number; x: number } | null>(null);
  const dragging = useRef(false);

  // When a later marble first covers each event's label.
  const coveredAt = useMemo(() => {
    if (!L) return [];
    const evs = model.tokens.map((tok) => tok.ev!);
    return evs.map((ev, i) => {
      const row = model.tenants.indexOf(ev.tenant);
      const x = L.x(ev.t);
      const y = L.evY(row, ev.id);
      for (let k = i + 1; k < evs.length; k++) {
        const o = evs[k];
        if (L.x(o.t) - x >= 2 * L.R - 1) break;
        if (o.tenant !== ev.tenant) continue;
        if (Math.abs(L.evY(row, o.id) - y) < 2 * L.R - 1) return o.t;
      }
      return Number.POSITIVE_INFINITY;
    });
  }, [model, L]);

  const scrubTo = useCallback(
    (clientX: number, svg: SVGSVGElement) => {
      if (!L || !onSeek) return;
      onSeek(L.tAt(clientX - svg.getBoundingClientRect().left));
    },
    [L, onSeek]
  );

  const showTipAt = (e: React.PointerEvent, title: string, body?: string) => {
    const box = boxRef.current?.getBoundingClientRect();
    if (!box) return;
    setTip({ x: e.clientX - box.left, y: e.clientY - box.top, title, body });
  };

  if (!L) return <div ref={boxRef} style={{ minHeight: reserve }} />;

  const { result } = model;
  const T = model.timing;
  const R = L.R;
  const tokens = [...model.tokens, ...model.stepTokens]
    .map((tok) => tokenView(model, L, tok, t))
    .filter(Boolean) as TokenView[];

  const target = (e: React.PointerEvent | React.MouseEvent) =>
    (e.target as Element).closest?.(
      "[data-ev],[data-run],[data-row],[data-scrub]"
    );

  return (
    <div ref={boxRef} className="relative">
      <svg
        width={L.width}
        height={L.height}
        role="img"
        aria-label={label}
        className={clsx(
          "block select-none",
          !interactive && "cursor-ew-resize"
        )}
        style={{ touchAction: "pan-y" }}
        onPointerDown={(e) => {
          const el = target(e);
          if (interactive && !el?.hasAttribute("data-scrub")) return;
          dragging.current = true;
          try {
            e.currentTarget.setPointerCapture(e.pointerId);
          } catch {
            // Synthetic or already-released pointers can't be captured.
          }
          onScrubStart?.();
          scrubTo(e.clientX, e.currentTarget);
        }}
        onPointerMove={(e) => {
          if (dragging.current) {
            scrubTo(e.clientX, e.currentTarget);
            return;
          }
          if (!interactive) return;
          const el = target(e);
          if (!el) {
            setTip(null);
            setGhost(null);
            return;
          }
          if (el.hasAttribute("data-ev")) {
            const ev = result.events[Number(el.getAttribute("data-ev"))];
            const tipText = eventTip(model, ev);
            showTipAt(
              e,
              tipText.title,
              tipText.body + (ev.manual ? " Click to remove." : "")
            );
            setGhost(null);
          } else if (el.hasAttribute("data-run")) {
            const run = result.runs[Number(el.getAttribute("data-run")) - 1];
            const tipText = runTip(model, run);
            showTipAt(
              e,
              tipText.title,
              `${tipText.body} Click to see its log.`
            );
            setGhost(null);
          } else if (el.hasAttribute("data-row")) {
            const row = Number(el.getAttribute("data-row"));
            const px = e.clientX - e.currentTarget.getBoundingClientRect().left;
            setGhost({ row, x: px });
            showTipAt(
              e,
              `Add an event for tenant ${model.tenants[row]}`,
              `at ${fmtT(Math.round(L.tAt(px) * 2) / 2)}`
            );
          } else {
            setTip(null);
            setGhost(null);
          }
        }}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
        onPointerLeave={() => {
          setTip(null);
          setGhost(null);
        }}
        onClick={(e) => {
          if (!interactive) return;
          const el = target(e);
          if (!el) return;
          if (el.hasAttribute("data-ev")) {
            const ev = result.events[Number(el.getAttribute("data-ev"))];
            if (ev.manual && ev.manualIndex !== undefined) {
              onRemoveManual?.(ev.manualIndex);
              setTip(null);
            }
          } else if (el.hasAttribute("data-run")) {
            const id = Number(el.getAttribute("data-run"));
            onSelectRun?.(selectedRun === id ? null : id);
          } else if (el.hasAttribute("data-row")) {
            const row = Number(el.getAttribute("data-row"));
            const px = e.clientX - e.currentTarget.getBoundingClientRect().left;
            onAddEvent?.(model.tenants[row], Math.round(L.tAt(px) * 2) / 2);
          }
        }}
      >
        <defs>
          <pattern
            id={hatchId}
            width="4"
            height="4"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="4"
              className="stroke-ruby-500 dark:stroke-ruby-400"
              strokeWidth="1.6"
            />
          </pattern>
        </defs>

        <StaticLayer model={model} L={L} interactive={interactive} />

        {result.runs.map((run) => {
          if (run.firstStartAt === undefined) return null;
          const land = model.landAt.get(run.id) ?? run.firstStartAt;
          const stable = (run.endedAt ?? model.domain) + T.move;
          return (
            <Capsule
              key={run.id}
              model={model}
              L={L}
              run={run}
              t={t + EPS < land ? -1 : Math.min(t, stable)}
              hatchId={hatchId}
              selected={selectedRun === run.id}
              interactive={interactive}
            />
          );
        })}

        <BandLayer model={model} L={L} t={t} />

        <line
          x1={L.x(t)}
          x2={L.x(t)}
          y1={L.top}
          y2={L.axisTop}
          className="pointer-events-none stroke-carbon-900/25 dark:stroke-carbon-100/30"
          strokeWidth={1}
        />

        {ghost && (
          <circle
            cx={ghost.x}
            cy={L.inY(ghost.row)}
            r={R}
            className="pointer-events-none fill-none stroke-breeze-500"
            strokeWidth={1.25}
            strokeDasharray="2 2"
          />
        )}

        {model.tokens.map((tok, i) => {
          const ev = tok.ev!;
          const future = t + EPS < ev.t;
          if (future && !showFuture) return null;
          const st = model.stack.get(ev.id) ?? { i: 0, n: 1 };
          if (st.n > MAX_STACK && st.i > MAX_STACK - 1) return null;
          const more =
            st.n > MAX_STACK && st.i === MAX_STACK - 1
              ? st.n - MAX_STACK + 1
              : 0;
          const rej = tok.stages.find((s) => s.kind === "reject" && !s.inQueue);
          const rep = tok.stages.find((s) => s.kind === "replaced");
          const skipped = !!rej && t + EPS >= rej.t + T.move;
          const replaced = !!rep && t + EPS >= rep.t;
          const pop = ease(clamp01((t - ev.t) / T.pop));
          return (
            <EventMarble
              key={tok.key}
              id={ev.id}
              x={L.x(ev.t)}
              y={L.evY(model.tenants.indexOf(tok.tenant), ev.id)}
              R={R}
              label={L.labels ? tok.label : ""}
              look={skipped ? "skipped" : replaced ? "replaced" : "event"}
              scale={0.5 + 0.5 * pop}
              hideLabel={t + EPS >= coveredAt[i]}
              skipped={skipped}
              more={more}
              manual={interactive && ev.manual}
              future={future}
            />
          );
        })}

        <g className="pointer-events-none">
          {tokens.map((v) => (
            <g key={v.key}>
              <Marble
                x={v.x}
                y={v.y}
                r={R}
                label={L.labels ? v.label : ""}
                look={v.look}
                opacity={v.opacity}
                scale={v.scale}
              />
              {v.cross && (
                <g opacity={v.opacity}>
                  <Cross
                    x={v.x}
                    y={v.y}
                    s={R * 0.95 * v.scale}
                    className="stroke-ruby-500 dark:stroke-ruby-400"
                    width={2}
                  />
                </g>
              )}
            </g>
          ))}
        </g>
      </svg>
      {tip && (
        <div
          role="tooltip"
          className="pointer-events-none absolute z-20 max-w-[280px] rounded-md bg-canvasBase px-2.5 py-1.5 text-[11px] leading-snug text-basis shadow-lg ring-1 ring-black/5 dark:ring-white/10"
          style={{
            left: Math.min(tip.x + 12, Math.max(0, L.width - 290)),
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
