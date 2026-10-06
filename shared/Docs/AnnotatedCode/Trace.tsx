"use client";

import { Children, isValidElement, type ReactNode } from "react";
import clsx from "clsx";

/**
 * Data-only components. They render nothing; <AnnotatedCode> reads their
 * props to draw a run's trace as a timeline linked to the code.
 *
 *   <Trace label="…">
 *     <TraceRow name="pr">
 *       <TraceBar id="pr" span="15-87" kind="pipeline" note="pipeline">pr</TraceBar>
 *     </TraceRow>
 *     <TraceMarker at="46" rows="lint-base" node="base">copy of base</TraceMarker>
 *   </Trace>
 *
 * `span` is the bar's start and end on a 0-100 time axis. `note` is the
 * <Annotation> id that hovering the bar opens.
 */
export type TraceKind = "event" | "pipeline" | "job" | "wait" | "result";

export function Trace(_props: { label: string; children?: ReactNode }) {
  return null;
}

export type TraceRowProps = {
  name: string;
  /** Small text under the row name, such as "runs once". */
  caption?: string;
  children?: ReactNode;
};

export function TraceRow(_props: TraceRowProps) {
  return null;
}

export type TraceBarProps = {
  id: string;
  span: string;
  kind: TraceKind;
  note?: string;
  children: ReactNode;
};

export function TraceBar(_props: TraceBarProps) {
  return null;
}

export type TraceMarkerProps = {
  /** Position on the 0-100 time axis. */
  at: string;
  /** "first-last" row names the line spans. */
  rows: string;
  /** Bar id that lights the marker when highlighted. */
  node?: string;
  children?: ReactNode;
};

export function TraceMarker(_props: TraceMarkerProps) {
  return null;
}

export type TraceSpec = {
  label: string;
  rows: { name: string; caption?: string }[];
  bars: {
    id: string;
    row: number;
    start: number;
    end: number;
    kind: TraceKind;
    note?: string;
    text: string;
  }[];
  markers: {
    at: number;
    from: number;
    to: number;
    node?: string;
    text: string;
  }[];
};

function textOf(children: ReactNode) {
  return Children.toArray(children).join("");
}

export function isTrace(el: ReactNode) {
  return isValidElement(el) && el.type === Trace;
}

export function readTrace(trace: ReactNode): TraceSpec | null {
  if (!isValidElement(trace)) {
    return null;
  }

  const props = trace.props as { label?: string; children?: ReactNode };
  const spec: TraceSpec = {
    label: String(props.label ?? ""),
    rows: [],
    bars: [],
    markers: [],
  };
  const markers: { at: string; rows: string; node?: string; text: string }[] =
    [];

  Children.forEach(props.children, (child) => {
    if (!isValidElement(child)) {
      return;
    }

    if (child.type === TraceRow) {
      const p = child.props as TraceRowProps;
      const row = spec.rows.length;

      spec.rows.push({ name: p.name, caption: p.caption });

      Children.forEach(p.children, (bar) => {
        if (!isValidElement(bar) || bar.type !== TraceBar) {
          return;
        }

        const b = bar.props as TraceBarProps;
        const [start, end] = String(b.span).split("-").map(Number);

        spec.bars.push({
          id: b.id,
          row,
          start,
          end,
          kind: b.kind,
          note: b.note,
          text: textOf(b.children),
        });
      });
    } else if (child.type === TraceMarker) {
      const p = child.props as TraceMarkerProps;

      markers.push({
        at: p.at,
        rows: p.rows,
        node: p.node,
        text: textOf(p.children),
      });
    }
  });

  const rowIndex = (name: string) => {
    return spec.rows.findIndex((row) => {
      return row.name === name;
    });
  };

  spec.markers = markers.map((m) => {
    const [from, to] = m.rows.split("-");

    return {
      at: Number(m.at),
      from: rowIndex(from),
      to: rowIndex(to ?? from),
      node: m.node,
      text: m.text,
    };
  });

  return spec;
}

// Geometry, in px. The track runs from TRACK_LEFT to TRACK_RIGHT before the
// trace's right edge.
export const TRACK_LEFT = 96;
const TRACK_RIGHT = 20;
const FIRST_ROW = 24;
const ROW_STEP = 46;
export const BAR_H = 30;
const LEGEND_H = 60;

export function traceHeight(spec: TraceSpec) {
  return FIRST_ROW + spec.rows.length * ROW_STEP + LEGEND_H;
}

export function rowTop(row: number) {
  return FIRST_ROW + row * ROW_STEP;
}

export function barBox(bar: TraceSpec["bars"][number], width: number) {
  const track = width - TRACK_LEFT - TRACK_RIGHT;
  const x = TRACK_LEFT + (bar.start / 100) * track;

  return {
    x,
    y: rowTop(bar.row),
    w: ((bar.end - bar.start) / 100) * track,
    h: BAR_H,
  };
}

export function markerX(at: number, width: number) {
  return TRACK_LEFT + (at / 100) * (width - TRACK_LEFT - TRACK_RIGHT);
}

const KIND_CLASS: Record<TraceKind, string> = {
  event: "border-solid border-muted bg-canvasSubtle font-sans text-basis",
  pipeline:
    "border-solid border-matcha-600 bg-matcha-500/10 font-mono font-semibold text-basis dark:border-matcha-400",
  job: "border-solid border-breeze-600 bg-breeze-500/10 font-mono text-basis dark:border-breeze-400",
  wait: "border-dashed border-muted font-mono text-subtle",
  result:
    "border-solid border-matcha-600 bg-matcha-500/10 font-sans text-basis dark:border-matcha-400",
};

const HATCH =
  "repeating-linear-gradient(135deg, transparent 0 6px, rgb(var(--color-border-subtle)) 6px 7px)";

const DIM = "opacity-[.32]";

export function TraceTimeline({
  spec,
  width,
  highlighted,
  dimmed,
  onEnterBar,
}: {
  spec: TraceSpec;
  width: number;
  highlighted: Set<string>;
  /** True while a note is open: everything it does not cover fades. */
  dimmed: boolean;
  onEnterBar: (bar: TraceSpec["bars"][number]) => void;
}) {
  return (
    <>
      {spec.rows.map((row, i) => {
        return (
          <div
            key={row.name}
            aria-hidden="true"
            className="absolute left-4 flex flex-col justify-center font-mono text-[12.5px] font-semibold text-basis"
            style={{ top: rowTop(i), height: BAR_H }}
          >
            {row.name}
            {row.caption && (
              <span className="absolute top-full mt-0.5 whitespace-nowrap font-sans text-[11px] font-normal text-subtle">
                {row.caption}
              </span>
            )}
          </div>
        );
      })}

      {spec.markers.map((m) => {
        const lit = !!m.node && highlighted.has(m.node);
        const x = markerX(m.at, width);
        const top = rowTop(m.from) - 6;

        return (
          <div
            key={`${m.at}-${m.from}`}
            aria-hidden="true"
            className={clsx(
              "transition-opacity duration-200 motion-reduce:transition-none",
              dimmed && !lit && DIM
            )}
          >
            <div
              className={clsx(
                "absolute w-0 border-l-2 border-dotted",
                lit ? "border-basis" : "border-muted"
              )}
              style={{
                left: x - 1,
                top,
                height: rowTop(m.to) + BAR_H + 6 - top,
              }}
            />
            <div
              className="absolute whitespace-nowrap font-mono text-[11px] text-subtle"
              style={{ left: x + 8, top: rowTop(m.to) + 7 }}
            >
              {m.text}
            </div>
          </div>
        );
      })}

      {spec.bars.map((bar) => {
        const box = barBox(bar, width);
        const on = highlighted.has(bar.id);

        return (
          <button
            key={bar.id}
            type="button"
            aria-label={`${spec.rows[bar.row].name}: ${bar.text}`}
            onMouseEnter={() => {
              onEnterBar(bar);
            }}
            onFocus={() => {
              onEnterBar(bar);
            }}
            onClick={() => {
              onEnterBar(bar);
            }}
            className={clsx(
              "absolute flex items-center overflow-hidden text-ellipsis whitespace-nowrap rounded-lg border-[1.5px] px-2.5 text-left text-xs transition-[opacity,box-shadow] duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-matcha-500 motion-reduce:transition-none",
              KIND_CLASS[bar.kind],
              dimmed && !on && DIM,
              on && "shadow-[0_10px_22px_-12px_rgba(0,0,0,.45)]"
            )}
            style={{
              left: box.x,
              top: box.y,
              width: box.w,
              height: box.h,
              backgroundImage: bar.kind === "wait" ? HATCH : undefined,
            }}
          >
            <span className="truncate">{bar.text}</span>
          </button>
        );
      })}

      <div
        aria-hidden="true"
        className="absolute bottom-3 left-4 flex flex-wrap gap-3.5 text-[11px] text-subtle"
      >
        <Swatch className={KIND_CLASS.pipeline}>Pipeline</Swatch>
        <Swatch className={KIND_CLASS.job}>Job</Swatch>
        <Swatch className={KIND_CLASS.wait} hatch>
          Waiting
        </Swatch>
        <span>Time →</span>
      </div>
    </>
  );
}

function Swatch({
  className,
  hatch,
  children,
}: {
  className: string;
  hatch?: boolean;
  children: ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={clsx("h-2.5 w-3.5 rounded-[3px] border-[1.5px]", className)}
        style={{ backgroundImage: hatch ? HATCH : undefined }}
      />
      {children}
    </span>
  );
}
