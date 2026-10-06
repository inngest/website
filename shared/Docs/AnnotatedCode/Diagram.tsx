"use client";

import { Children, isValidElement, type ReactNode } from "react";
import clsx from "clsx";

/**
 * Data-only components. They render nothing; <AnnotatedCode> reads their
 * props to draw the linked flowchart.
 *
 *   <Flow label="…">
 *     <FlowNode id="pr" kind="pipeline" at="1,1">pr pipeline</FlowNode>
 *     <FlowEdge from="pr" to="base" />
 *   </Flow>
 */
export type FlowKind = "pipeline" | "job" | "platform" | "external";

export function Flow(_props: { label: string; children?: ReactNode }) {
  return null;
}
export function FlowNode(_props: {
  id: string;
  kind: FlowKind;
  /** "column,row" on the diagram grid. */
  at: string;
  children: ReactNode;
}) {
  return null;
}
export function FlowEdge(_props: {
  from: string;
  to: string;
  dashed?: boolean;
}) {
  return null;
}

export type FlowSpec = {
  label: string;
  nodes: {
    id: string;
    kind: FlowKind;
    col: number;
    row: number;
    text: string;
  }[];
  edges: { from: string; to: string; dashed: boolean }[];
};

export function readFlow(flow: ReactNode): FlowSpec | null {
  if (!isValidElement(flow)) {
    return null;
  }
  const spec: FlowSpec = {
    label: String((flow.props as any).label ?? ""),
    nodes: [],
    edges: [],
  };
  Children.forEach((flow.props as any).children, (child) => {
    if (!isValidElement(child)) {
      return;
    }
    const p = child.props as any;
    if (child.type === FlowNode) {
      const [col, row] = String(p.at).split(",").map(Number);
      spec.nodes.push({
        id: p.id,
        kind: p.kind,
        col,
        row,
        text: Children.toArray(p.children).join(""),
      });
    } else if (child.type === FlowEdge) {
      spec.edges.push({ from: p.from, to: p.to, dashed: !!p.dashed });
    }
  });
  return spec;
}

// Grid: 3 columns on a 300 wide canvas. The top-left corner is left free for
// the legend.
const COL_X = [90, 190, 240];
const COL_X_BY_ROW_WIDE = 190;
const ROW_H = 62;
const TOP = 12;
const NODE_H = 36;

function nodeBox(n: FlowSpec["nodes"][number], twoUp: boolean) {
  const w = twoUp ? 118 : n.kind === "external" ? 130 : 140;
  const cx = twoUp ? (n.col === 0 ? 85 : 225) : COL_X_BY_ROW_WIDE;
  const cy = TOP + n.row * ROW_H + NODE_H / 2;
  return { w, cx, cy, x: cx - w / 2, y: cy - NODE_H / 2 };
}

const KIND_CLASS: Record<FlowKind, string> = {
  pipeline:
    "fill-matcha-500/15 stroke-matcha-600 dark:stroke-matcha-400 stroke-[1.75]",
  job: "fill-breeze-500/15 stroke-breeze-600 dark:stroke-breeze-400 stroke-[1.25]",
  platform:
    "fill-transparent stroke-subtle stroke-1 [stroke-dasharray:4_3] stroke-carbon-500 dark:stroke-carbon-300",
  external:
    "fill-carbon-500/10 stroke-carbon-500 dark:stroke-carbon-300 stroke-1",
};

const LEGEND: { kind: FlowKind; text: string }[] = [
  { kind: "pipeline", text: "Pipeline" },
  { kind: "job", text: "Job" },
  { kind: "platform", text: "Inngest does this" },
];

export function FlowDiagram({
  spec,
  highlighted,
  onHover,
  onFocusNode,
}: {
  spec: FlowSpec;
  highlighted: Set<string>;
  onHover: (id: string | null) => void;
  onFocusNode: (id: string | null) => void;
}) {
  // Rows with two nodes use the narrow two-up layout; every other row is one
  // centered node.
  const rowCounts = new Map<number, number>();
  spec.nodes.forEach((n) =>
    rowCounts.set(n.row, (rowCounts.get(n.row) ?? 0) + 1)
  );
  const boxes = new Map(
    spec.nodes.map((n) => [n.id, nodeBox(n, (rowCounts.get(n.row) ?? 1) > 1)])
  );
  const rows = Math.max(...spec.nodes.map((n) => n.row)) + 1;
  const height = TOP + rows * ROW_H - (ROW_H - NODE_H) + 8;
  const anyHighlighted = highlighted.size > 0;

  return (
    <div className="relative">
      <ul
        aria-hidden="true"
        className="absolute left-0 top-0 m-0 list-none space-y-1 p-0 text-[11px] leading-4 text-subtle"
      >
        {LEGEND.map((item) => {
          return (
            <li key={item.kind} className="m-0 flex items-center gap-1.5 p-0">
              <svg width="18" height="12" viewBox="0 0 18 12">
                <rect
                  x="1"
                  y="1"
                  width="16"
                  height="10"
                  rx="3"
                  className={KIND_CLASS[item.kind]}
                />
              </svg>
              {item.text}
            </li>
          );
        })}
      </ul>
      <svg
        viewBox={`0 0 300 ${height}`}
        className="block h-auto w-full"
        role="group"
        aria-label={spec.label}
      >
        <defs>
          <marker
            id="ac-arrow"
            viewBox="0 0 8 8"
            refX="7"
            refY="4"
            markerWidth="7"
            markerHeight="7"
            orient="auto"
          >
            <path
              d="M0 0 L8 4 L0 8 z"
              className="fill-carbon-500 dark:fill-carbon-300"
            />
          </marker>
        </defs>
        {spec.edges.map((edge) => {
          const a = boxes.get(edge.from);
          const b = boxes.get(edge.to);
          if (!a || !b) {
            return null;
          }
          const y1 = a.y + NODE_H;
          const y2 = b.y - 2;
          const mid = (y1 + y2) / 2;
          return (
            <path
              key={`${edge.from}-${edge.to}`}
              d={`M${a.cx} ${y1} C${a.cx} ${mid} ${b.cx} ${mid} ${b.cx} ${y2}`}
              fill="none"
              markerEnd="url(#ac-arrow)"
              strokeDasharray={edge.dashed ? "4 3" : undefined}
              className={clsx(
                "stroke-carbon-500 stroke-1 transition-opacity duration-150 motion-reduce:transition-none dark:stroke-carbon-300",
                anyHighlighted && "opacity-50"
              )}
            />
          );
        })}
        {spec.nodes.map((n) => {
          const box = boxes.get(n.id)!;
          const on = highlighted.has(n.id);
          return (
            <g
              key={n.id}
              tabIndex={0}
              role="img"
              aria-label={n.text}
              data-flow-node={n.id}
              onMouseEnter={() => onHover(n.id)}
              onMouseLeave={() => onHover(null)}
              onFocus={() => onFocusNode(n.id)}
              onBlur={() => onFocusNode(null)}
              className={clsx(
                "cursor-default outline-none transition-opacity duration-150 motion-reduce:transition-none",
                anyHighlighted && !on && "opacity-50"
              )}
            >
              <rect
                x={box.x - 4}
                y={box.y - 4}
                width={box.w + 8}
                height={NODE_H + 8}
                rx="10"
                fill="none"
                strokeDasharray="4 3"
                className={clsx(
                  "stroke-[rgb(var(--color-foreground-base))] stroke-[1.5] transition-opacity duration-150 motion-reduce:transition-none",
                  on ? "opacity-100" : "opacity-0"
                )}
              />
              <rect
                x={box.x}
                y={box.y}
                width={box.w}
                height={NODE_H}
                rx="7"
                className={KIND_CLASS[n.kind]}
              />
              <text
                x={box.cx}
                y={box.cy}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-[rgb(var(--color-foreground-base))] font-mono text-[10.5px]"
              >
                {n.text}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
