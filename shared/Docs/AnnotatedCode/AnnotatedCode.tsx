"use client";

import {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import clsx from "clsx";

import { CodeGroupHeader, CopyButton } from "../Code";
import { useUnreleasedLabels } from "../Unreleased";
import { FlowDiagram, readFlow } from "./Diagram";

export { Flow, FlowNode, FlowEdge } from "./Diagram";

/**
 * Annotated code: a normal fenced code block whose lines carry notes.
 *
 *   <AnnotatedCode>
 *
 *   ```typescript {{ title: "ci/pipelines.ts" }}
 *   …clean code…
 *   ```
 *
 *   <Annotation lines="8" nodes="pr">Why `singleton` is here.</Annotation>
 *
 *   <Flow label="…">…</Flow>
 *
 *   </AnnotatedCode>
 *
 * The fence is untouched, so the plain block is always the fallback: it is
 * what renders until the feature is switched on (see `label`) and what the
 * markdown export prints, followed by the notes as a numbered list.
 */
export function Annotation(_props: {
  /** "8", "6-8" or "15-18,20-23": every range this note covers. */
  lines: string;
  /** Diagram node ids this note is about (comma separated). */
  nodes?: string;
  children: ReactNode;
}) {
  return null;
}

type Range = [number, number];
type Note = {
  id: string;
  n: number;
  ranges: Range[];
  nodes: string[];
  body: ReactNode;
};

function parseRanges(lines: string): Range[] {
  return lines
    .split(",")
    .map((part) => {
      const [a, b] = part.trim().split("-").map(Number);
      return [a, b ?? a] as Range;
    })
    .filter(([a, b]) => {
      return Number.isFinite(a) && Number.isFinite(b);
    });
}

function describeRanges(ranges: Range[]) {
  const parts = ranges.map(([a, b]) => {
    return a === b ? `${a}` : `${a}-${b}`;
  });
  return `${
    ranges.length === 1 && ranges[0][0] === ranges[0][1] ? "Line" : "Lines"
  } ${parts.join(", ")}`;
}

function inRange(line: number, ranges: Range[]) {
  return ranges.some(([a, b]) => {
    return line >= a && line <= b;
  });
}

function size(ranges: Range[]) {
  return ranges.reduce((sum, [a, b]) => {
    return sum + (b - a + 1);
  }, 0);
}

const LINE_H = 20;
const PAD_Y = 16;
const BASE_GUTTER = 36;

export function AnnotatedCode({
  children,
  label = "annotated-code",
}: {
  children: ReactNode;
  /** `?unreleased=<label>` value that turns the annotated version on. */
  label?: string;
}) {
  const enabled = useUnreleasedLabels().has(label);

  const parts = Children.toArray(children).filter(isValidElement);
  const codeEl = parts.find((c) => {
    return typeof (c.props as any)?.code === "string";
  });

  if (!enabled || !codeEl) {
    return <>{codeEl ?? children}</>;
  }

  return <Annotated parts={parts as ReactElement[]} codeEl={codeEl} />;
}

function Annotated({
  parts,
  codeEl,
}: {
  parts: ReactElement[];
  codeEl: ReactElement;
}) {
  const codeProps = codeEl.props as any;
  const codeChild = Children.toArray(codeProps.children).find(isValidElement);
  const html: string = String((codeChild?.props as any)?.children ?? "");
  const lines = useMemo(() => {
    const out = html.split("\n");
    if (out.length > 1 && out[out.length - 1].trim() === "") {
      out.pop();
    }
    return out;
  }, [html]);

  const notes: Note[] = useMemo(() => {
    return parts
      .filter((p) => {
        return (p.type as any) === Annotation || (p.props as any)?.lines;
      })
      .map((p, i) => {
        const props = p.props as any;
        return {
          id: `note-${i + 1}`,
          n: i + 1,
          ranges: parseRanges(String(props.lines)),
          nodes: String(props.nodes ?? "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          body: props.children,
        };
      });
  }, [parts]);

  const flowEl = parts.find((p) => {
    return (
      typeof (p.props as any)?.label === "string" && !(p.props as any).code
    );
  });
  const spec = useMemo(() => {
    return flowEl ? readFlow(flowEl) : null;
  }, [flowEl]);

  const [active, setActive] = useState<string | null>(null);
  const [hoverNode, setHoverNode] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [wide, setWide] = useState(false);
  const [scrollX, setScrollX] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const el = root.current;
    if (!el) {
      return;
    }
    const measure = () => {
      setWide(el.getBoundingClientRect().width >= 960);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      ro.disconnect();
    };
  }, []);

  // Open quickly, close a beat later, so moving between a line and its note
  // never flickers.
  const schedule = useCallback((id: string | null) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(
      () => {
        setActive(id);
      },
      id ? 60 : 140
    );
  }, []);
  const cancel = useCallback(() => {
    window.clearTimeout(timer.current);
  }, []);
  useEffect(() => {
    return () => {
      window.clearTimeout(timer.current);
    };
  }, []);

  // Tap outside closes (touch has no mouseleave).
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) {
        setActive(null);
      }
    };
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("pointerdown", onDown);
    };
  }, []);

  // Innermost note (smallest span) wins for a hovered line.
  const noteForLine = useCallback(
    (line: number) => {
      const hits = notes.filter((n) => {
        return inRange(line, n.ranges);
      });
      hits.sort((a, b) => {
        return size(a.ranges) - size(b.ranges);
      });
      return hits[0]?.id ?? null;
    },
    [notes]
  );

  const activeNote = notes.find((n) => {
    return n.id === active;
  });
  const highlightedNotes = new Set<string>(
    hoverNode
      ? notes
          .filter((n) => {
            return n.nodes.includes(hoverNode);
          })
          .map((n) => {
            return n.id;
          })
      : active
      ? [active]
      : []
  );
  const highlightedNodes = new Set<string>(
    hoverNode ? [hoverNode] : activeNote?.nodes ?? []
  );

  const total = lines.length;
  const slotOf = (note: Note) => {
    return notes.filter((o) => {
      return o.n < note.n && o.ranges[0][0] === note.ranges[0][0];
    }).length;
  };
  const GUTTER =
    BASE_GUTTER +
    18 *
      Math.max(
        0,
        ...notes.map((n) => {
          return slotOf(n);
        })
      );
  const bodyH = total * LINE_H + PAD_Y * 2;

  const code = (
    <div className="relative min-w-0">
      <div
        className="overflow-x-auto"
        onScroll={(e) => {
          setScrollX(e.currentTarget.scrollLeft);
        }}
        onMouseOver={(e) => {
          const el = (e.target as HTMLElement).closest("[data-line]");
          if (!el) {
            return;
          }
          const id = noteForLine(Number(el.getAttribute("data-line")));
          if (id) {
            schedule(id);
          } else {
            schedule(null);
          }
        }}
        onMouseLeave={() => {
          schedule(null);
        }}
      >
        <pre
          className="relative m-0 min-w-max py-4 text-xs leading-[20px] text-basis"
          style={{ paddingLeft: GUTTER, paddingRight: 24 }}
          aria-label={codeProps.title ? `Code: ${codeProps.title}` : "Code"}
        >
          {notes.map((note) => {
            const on = highlightedNotes.has(note.id);
            return note.ranges.map(([a, b], i) => {
              return (
                <span
                  key={`${note.id}-${i}`}
                  aria-hidden="true"
                  data-outline={note.id}
                  className={clsx(
                    "pointer-events-none absolute right-2 rounded-[5px] border border-dashed transition duration-150 motion-reduce:transition-none",
                    on
                      ? "border-[rgb(var(--color-foreground-base))] bg-[rgb(var(--color-foreground-base)/0.06)] opacity-100"
                      : showAll
                      ? "border-carbon-400/60 opacity-60"
                      : "border-transparent opacity-0"
                  )}
                  style={{
                    left: GUTTER - 8,
                    top: PAD_Y + (a - 1) * LINE_H - 2,
                    height: (b - a + 1) * LINE_H + 4,
                  }}
                />
              );
            });
          })}
          <code className="relative block">
            {lines.map((line, i) => {
              return (
                <span
                  key={i}
                  data-line={i + 1}
                  className="block h-[20px] whitespace-pre"
                  dangerouslySetInnerHTML={{ __html: line || " " }}
                />
              );
            })}
          </code>
        </pre>
      </div>

      <div className="pointer-events-none absolute inset-0">
        {notes.map((note) => {
          const [start] = note.ranges[0];
          const end = Math.max(...note.ranges.map(([, b]) => b));
          const open = active === note.id;
          const below = end <= total * 0.55;
          const slot = slotOf(note);
          return (
            <div
              key={note.id}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                  schedule(null);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setActive(null);
                }
              }}
            >
              <button
                type="button"
                aria-expanded={open}
                aria-controls={`${note.id}-body`}
                aria-label={`Note ${note.n} on ${describeRanges(
                  note.ranges
                ).toLowerCase()}`}
                onMouseEnter={() => {
                  schedule(note.id);
                }}
                onFocus={() => {
                  cancel();
                  setActive(note.id);
                }}
                onClick={() => {
                  cancel();
                  setActive(open ? null : note.id);
                }}
                className={clsx(
                  "pointer-events-auto absolute flex h-4 w-4 items-center justify-center rounded-full border text-[10px] font-medium leading-none transition duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-breeze-500 motion-reduce:transition-none",
                  open || highlightedNotes.has(note.id)
                    ? "border-[rgb(var(--color-foreground-base))] bg-[rgb(var(--color-foreground-base))] text-[rgb(var(--color-background-canvas-base))]"
                    : "border-carbon-400 text-subtle hover:border-[rgb(var(--color-foreground-base))] hover:text-basis"
                )}
                style={{
                  left: 8 + slot * 18,
                  transform: `translateX(${-scrollX}px)`,
                  top: PAD_Y + (start - 1) * LINE_H + 2,
                }}
              >
                {note.n}
              </button>
              <div
                id={`${note.id}-body`}
                role="note"
                onMouseEnter={cancel}
                onMouseLeave={() => {
                  schedule(null);
                }}
                className={clsx(
                  "absolute z-20 w-[min(24rem,calc(100%-3rem))] rounded-md border border-muted bg-surfaceBase p-3 text-[13px] leading-5 text-basis shadow-lg transition-[opacity,transform,visibility] duration-150 ease-out motion-reduce:transform-none motion-reduce:transition-none",
                  "[&_a]:text-breeze-600 dark:[&_a]:text-breeze-300 [&_code]:rounded [&_code]:bg-canvasSubtle [&_code]:px-1 [&_code]:text-xs [&_p]:m-0",
                  open
                    ? "pointer-events-auto visible translate-y-0 opacity-100"
                    : clsx(
                        "pointer-events-none invisible opacity-0",
                        below ? "translate-y-1" : "-translate-y-1"
                      )
                )}
                style={
                  below
                    ? { left: GUTTER, top: PAD_Y + end * LINE_H + 8 }
                    : {
                        left: GUTTER,
                        bottom: bodyH - (PAD_Y + (start - 1) * LINE_H) + 8,
                      }
                }
              >
                <span className="mb-1 block font-mono text-[11px] text-subtle">
                  {describeRanges(note.ranges)}
                </span>
                {note.body}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <figure
      ref={root}
      className="not-prose relative my-6 rounded-md border border-subtle bg-codeEditor"
      data-annotated-code
    >
      <div className="relative">
        <CodeGroupHeader
          title={codeProps.title}
          filename={codeProps.title}
          hasTabs={false}
        >
          {null}
        </CodeGroupHeader>
        <CopyButton code={codeProps.code} />
      </div>
      <div
        className={clsx(
          "grid",
          wide && spec ? "grid-cols-[minmax(0,1fr)_320px]" : "grid-cols-1"
        )}
      >
        {code}
        {spec && (
          <div
            className={clsx(
              "border-subtle p-4",
              wide ? "border-l" : "border-t"
            )}
          >
            <div className={clsx(!wide && "mx-auto max-w-[360px]")}>
              <FlowDiagram
                spec={spec}
                highlighted={highlightedNodes}
                onHover={(id) => {
                  setActive(null);
                  setHoverNode(id);
                }}
                onFocusNode={setHoverNode}
              />
            </div>
          </div>
        )}
      </div>
      <figcaption className="flex items-center gap-3 border-t border-subtle px-4 py-2 text-xs text-subtle">
        <span>
          Hover or focus a numbered marker, a highlighted line, or a diagram
          node.
        </span>
        <button
          type="button"
          aria-pressed={showAll}
          onClick={() => {
            setShowAll((v) => !v);
          }}
          className="ml-auto shrink-0 rounded border border-muted px-2 py-0.5 text-basis hover:border-contrast focus:outline-none focus-visible:ring-2 focus-visible:ring-breeze-500"
        >
          Outline all notes
        </button>
      </figcaption>
      <div className="sr-only">
        <h4>Code annotations</h4>
        <ol>
          {notes.map((note) => {
            return (
              <li key={note.id}>
                {describeRanges(note.ranges)}: {note.body}
              </li>
            );
          })}
        </ol>
        {spec && <p>Diagram: {spec.label}</p>}
      </div>
    </figure>
  );
}
