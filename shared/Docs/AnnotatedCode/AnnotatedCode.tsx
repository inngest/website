"use client";

import {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";
import Link from "next/link";
import clsx from "clsx";

import { CodeGroupHeader, CopyButton } from "../Code";
import { useUnreleasedLabels } from "../Unreleased";
import {
  BAR_H,
  barBox,
  readTrace,
  rowTop,
  Trace,
  traceHeight,
  TraceTimeline,
  type TraceSpec,
} from "./Trace";

export { Trace, TraceRow, TraceBar, TraceMarker } from "./Trace";

/**
 * Annotated code: a normal fenced code block whose lines carry notes, and an
 * optional trace timeline linked to them.
 *
 *   <AnnotatedCode>
 *
 *   ```typescript {{ title: "ci/pipelines.ts" }}
 *   …clean code…
 *   ```
 *
 *   <Annotation id="singleton" lines="8" tease="cancels stale runs"
 *     title="Flow control built in" nodes="pr"
 *     href="/docs/…" linkText="Flow control">
 *   Why `singleton` is here.
 *   </Annotation>
 *
 *   <Trace label="…">…</Trace>
 *
 *   </AnnotatedCode>
 *
 * A note opens from its pill at the end of a line, or from a trace bar whose
 * `note` is its id. While it is open its lines and bars stay lit and the rest
 * fades. The pills pulse every few seconds until the reader opens one.
 *
 * The fence is untouched, so the plain block is always the fallback: it is
 * what renders behind an unreleased `label`, and what the markdown export
 * prints, followed by the notes as a list.
 */
export function Annotation(_props: {
  /** Referenced by a trace bar's `note`. */
  id: string;
  /** "8", "6-8" or "15-18,20-23": every line this note lights. */
  lines: string;
  /** Lines that get a pill: defaults to each range's first line; "none" for none. */
  pill?: string;
  /** Short words on the pill. */
  tease?: string;
  /** Card heading; backticks render as code. */
  title: string;
  /** Trace bar ids this note lights (comma separated). */
  nodes?: string;
  href?: string;
  linkText?: string;
  children: ReactNode;
}) {
  return null;
}

type Note = {
  id: string;
  lines: Set<number>;
  first: number;
  last: number;
  pills: number[];
  nodes: string[];
  tease: string;
  title: string;
  href?: string;
  linkText?: string;
  body: ReactNode;
  length: number;
};

type Open = {
  active: string | null;
  from: "code" | "node" | null;
  node: string | null;
  pinned: boolean;
};

const CLOSED: Open = { active: null, from: null, node: null, pinned: false };

const ROW = 22;
const PAD_Y = 14;
const CARD_W = 300;
const SIDE_GAP = 24;
const CLOSE_DELAY = 250;
const DIM = "opacity-[.32]";

function parseRanges(lines: string) {
  return lines
    .split(",")
    .map((part) => {
      const [a, b] = part.trim().split("-").map(Number);

      return [a, b ?? a] as [number, number];
    })
    .filter(([a, b]) => {
      return Number.isFinite(a) && Number.isFinite(b);
    });
}

function list(value?: string) {
  return String(value ?? "")
    .split(",")
    .map((s) => {
      return s.trim();
    })
    .filter(Boolean);
}

function textLength(node: ReactNode): number {
  return Children.toArray(node).reduce<number>((sum, child) => {
    if (typeof child === "string" || typeof child === "number") {
      return sum + String(child).length;
    }

    if (isValidElement(child)) {
      return sum + textLength((child.props as any).children);
    }

    return sum;
  }, 0);
}

function readNote(el: ReactElement): Note {
  const props = el.props as any;
  const ranges = parseRanges(String(props.lines));
  const lines = new Set<number>();

  ranges.forEach(([a, b]) => {
    for (let n = a; n <= b; n += 1) {
      lines.add(n);
    }
  });

  const pills =
    props.pill === "none"
      ? []
      : props.pill
      ? list(props.pill).map(Number)
      : ranges.map(([a]) => {
          return a;
        });

  return {
    id: String(props.id),
    lines,
    first: Math.min(...Array.from(lines)),
    last: Math.max(...Array.from(lines)),
    pills,
    nodes: list(props.nodes),
    tease: props.tease ?? "",
    title: String(props.title ?? ""),
    href: props.href,
    linkText: props.linkText,
    body: props.children,
    length: String(props.title ?? "").length + textLength(props.children),
  };
}

export function AnnotatedCode({
  children,
  label,
}: {
  children: ReactNode;
  /**
   * Optional `?unreleased=<label>` value: when set, the annotated version
   * only shows with that label, and the plain block otherwise.
   */
  label?: string;
}) {
  const labels = useUnreleasedLabels();
  const enabled = !label || labels.has(label);

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

    // The fence ends with a newline, which highlights as an empty last line
    // (sometimes wrapped in empty spans).
    while (
      out.length > 1 &&
      out[out.length - 1].replace(/<[^>]*>/g, "").trim() === ""
    ) {
      out.pop();
    }

    return out;
  }, [html]);

  const notes = useMemo(() => {
    return parts
      .filter((p) => {
        return p.type === Annotation;
      })
      .map(readNote);
  }, [parts]);

  const spec = useMemo(() => {
    return readTrace(
      parts.find((p) => {
        return p.type === Trace;
      })
    );
  }, [parts]);

  // Line number → the note whose pill sits on it, and each pill's place in
  // reading order for the staggered pulse.
  const pillAt = useMemo(() => {
    const map = new Map<number, Note>();

    notes.forEach((note) => {
      note.pills.forEach((n) => {
        map.set(n, note);
      });
    });

    return map;
  }, [notes]);

  const pillOrder = useMemo(() => {
    return Array.from(pillAt.keys()).sort((a, b) => {
      return a - b;
    });
  }, [pillAt]);

  const id = useId();
  const codeCardId = `${id}-code-note`;
  const traceCardId = `${id}-trace-note`;

  const [open, setOpenState] = useState<Open>(CLOSED);
  const [touched, setTouched] = useState(false);
  const [layout, setLayout] = useState({ width: 0, room: 0 });
  const openRef = useRef(open);
  const root = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);

  const setOpen = useCallback((next: Open) => {
    openRef.current = next;
    setOpenState(next);
  }, []);

  const cancelClose = useCallback(() => {
    window.clearTimeout(timer.current);
  }, []);

  // Leaving a pill, line or bar waits a moment so the pointer can reach the
  // card; entering the card or a lit line cancels the close.
  const closeSoon = useCallback(
    (from: "code" | "node") => {
      cancelClose();

      timer.current = window.setTimeout(() => {
        const current = openRef.current;

        if (current.from === from && !current.pinned) {
          setOpen(CLOSED);
        }
      }, CLOSE_DELAY);
    },
    [cancelClose, setOpen]
  );

  useEffect(() => {
    return () => {
      window.clearTimeout(timer.current);
    };
  }, []);

  // Notes sit beside the block when the page has room to its right (up to
  // the docs sidebar), otherwise below the lines they describe.
  useEffect(() => {
    const el = root.current;

    if (!el) {
      return;
    }

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const sidebar = document
        .querySelector("[data-docs-sidebar]")
        ?.getBoundingClientRect();
      const limit =
        sidebar && sidebar.width > 0
          ? sidebar.left
          : document.documentElement.clientWidth;

      setLayout({ width: rect.width, room: limit - rect.right - SIDE_GAP });
    };

    measure();

    const observer = new ResizeObserver(measure);

    observer.observe(el);
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Tap outside closes (touch has no mouseleave).
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) {
        setOpen(CLOSED);
      }
    };

    document.addEventListener("pointerdown", onDown);

    return () => {
      document.removeEventListener("pointerdown", onDown);
    };
  }, [setOpen]);

  const noteById = useCallback(
    (noteId: string | null) => {
      return notes.find((note) => {
        return note.id === noteId;
      });
    },
    [notes]
  );

  const openFromPill = (note: Note) => {
    cancelClose();
    setTouched(true);

    if (!openRef.current.pinned) {
      setOpen({ active: note.id, from: "code", node: null, pinned: false });
    }
  };

  const togglePin = (note: Note) => {
    const current = openRef.current;
    const same = current.pinned && current.active === note.id;

    cancelClose();
    setTouched(true);
    setOpen(
      same
        ? CLOSED
        : { active: note.id, from: "code", node: null, pinned: true }
    );
  };

  const enterBar = (bar: TraceSpec["bars"][number]) => {
    if (!bar.note) {
      return;
    }

    const current = openRef.current;

    cancelClose();
    setTouched(true);

    // A bar the open note already lights keeps that note.
    if (
      current.from === "node" &&
      noteById(current.active)?.nodes.includes(bar.id)
    ) {
      return;
    }

    setOpen({ active: bar.note, from: "node", node: bar.id, pinned: false });
  };

  const active = noteById(open.active);
  const litNodes = new Set(active?.nodes ?? []);
  const side = layout.room >= CARD_W;
  const cardWidth = side ? CARD_W : Math.min(400, layout.width - 72);

  let codeCardStyle: CSSProperties | null = null;

  if (active && open.from === "code") {
    codeCardStyle = side
      ? {
          left: layout.width + SIDE_GAP,
          top: PAD_Y + (active.first - 1) * ROW - 6,
          width: CARD_W,
        }
      : {
          left: 56,
          top: PAD_Y + active.last * ROW + 8,
          width: cardWidth,
        };
  }

  const traceH = spec ? traceHeight(spec) : 0;
  let traceCardStyle: CSSProperties | null = null;
  const bar = spec?.bars.find((b) => {
    return b.id === open.node;
  });

  if (active && open.from === "node" && spec && bar) {
    traceCardStyle = side
      ? {
          left: layout.width + SIDE_GAP,
          top: Math.max(0, rowTop(bar.row) - 6),
          width: CARD_W,
        }
      : clearSpot(spec, bar, layout.width, traceH, cardWidth, active.length);
  }

  return (
    <div
      ref={root}
      className="not-prose relative my-6 [--ac-lift:rgba(15,23,42,.35)] dark:[--ac-lift:rgba(0,0,0,.6)]"
      data-annotated-code
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          setOpen(CLOSED);
        }
      }}
    >
      <figure className="relative m-0 rounded-md border border-subtle bg-codeEditor">
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

        <div className="relative">
          <div className="overflow-x-auto">
            <pre
              className="m-0 min-w-max px-2 text-xs text-basis"
              style={{ paddingTop: PAD_Y, paddingBottom: PAD_Y }}
              aria-label={codeProps.title ? `Code: ${codeProps.title}` : "Code"}
            >
              <code className="block">
                {lines.map((line, i) => {
                  const n = i + 1;
                  const lit = !!active?.lines.has(n);
                  const top = lit && !active?.lines.has(n - 1);
                  const bottom = lit && !active?.lines.has(n + 1);
                  const pill = pillAt.get(n);

                  return (
                    <span
                      key={n}
                      data-line={n}
                      onMouseEnter={lit ? cancelClose : undefined}
                      onMouseLeave={
                        lit
                          ? () => {
                              closeSoon("code");
                            }
                          : undefined
                      }
                      className={clsx(
                        "relative flex items-center whitespace-pre transition-[opacity,background-color,box-shadow] duration-200 motion-reduce:transition-none",
                        active && !lit && DIM,
                        lit && "z-[1] bg-white dark:bg-white/[0.05]"
                      )}
                      style={{
                        height: ROW,
                        borderRadius: `${top ? 8 : 0}px ${top ? 8 : 0}px ${
                          bottom ? 8 : 0
                        }px ${bottom ? 8 : 0}px`,
                        boxShadow: lit
                          ? [
                              top && "0 -6px 12px -10px var(--ac-lift)",
                              bottom && "0 10px 18px -12px var(--ac-lift)",
                            ]
                              .filter(Boolean)
                              .join(",") || undefined
                          : undefined,
                      }}
                    >
                      <span
                        aria-hidden="true"
                        className="w-9 shrink-0 select-none pr-5 text-right text-muted"
                      >
                        {n}
                      </span>
                      <span dangerouslySetInnerHTML={{ __html: line || " " }} />
                      {pill && (
                        <Pill
                          note={pill}
                          on={open.active === pill.id && open.from === "code"}
                          pulse={touched ? null : pillOrder.indexOf(n)}
                          controls={codeCardId}
                          onEnter={() => {
                            openFromPill(pill);
                          }}
                          onBlur={() => {
                            closeSoon("code");
                          }}
                          onClick={() => {
                            togglePin(pill);
                          }}
                        />
                      )}
                    </span>
                  );
                })}
              </code>
            </pre>
          </div>

          {active && codeCardStyle && (
            <NoteCard
              id={codeCardId}
              note={active}
              style={codeCardStyle}
              onEnter={cancelClose}
              onLeave={() => {
                closeSoon("code");
              }}
            />
          )}
        </div>
      </figure>

      {spec && (
        <div
          role="group"
          aria-label={spec.label}
          className="relative mt-5 rounded-md border border-subtle bg-codeEditor"
          style={{ height: traceH }}
          onMouseLeave={() => {
            closeSoon("node");
          }}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              closeSoon("node");
            }
          }}
        >
          {layout.width > 0 && (
            <TraceTimeline
              spec={spec}
              width={layout.width}
              highlighted={litNodes}
              dimmed={!!active}
              onEnterBar={enterBar}
            />
          )}

          {active && traceCardStyle && (
            <NoteCard
              id={traceCardId}
              note={active}
              style={traceCardStyle}
              onEnter={cancelClose}
              onLeave={() => {
                closeSoon("node");
              }}
            />
          )}
        </div>
      )}

      <div className="sr-only">
        <h4>Code notes</h4>
        <ul>
          {notes.map((note) => {
            return (
              <li key={note.id}>
                <Inline text={note.title} />: {note.body}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/**
 * Where a trace note goes when there is no room beside the block: next to
 * the bar without covering anything in the timeline (below, above, right,
 * left), then any clear spot in it, else under it.
 */
function clearSpot(
  spec: TraceSpec,
  bar: TraceSpec["bars"][number],
  width: number,
  height: number,
  cardWidth: number,
  textLength: number
): CSSProperties {
  const h = 64 + Math.ceil(textLength / 42) * 21;
  const gap = 10;
  const anchor = barBox(bar, width);
  const taken = [
    ...spec.bars.map((b) => {
      return barBox(b, width);
    }),
    { x: 0, y: 0, w: 90, h: height },
  ];

  const clampX = (x: number) => {
    return Math.min(Math.max(x, 8), width - cardWidth - 8);
  };

  const clampY = (y: number) => {
    return Math.min(Math.max(y, 8), height - h - 8);
  };

  const fits = (c: { x: number; y: number }) => {
    const inside =
      c.x >= 8 &&
      c.x + cardWidth <= width - 8 &&
      c.y >= 8 &&
      c.y + h <= height - 8;

    return (
      inside &&
      !taken.some((r) => {
        return (
          c.x < r.x + r.w &&
          c.x + cardWidth > r.x &&
          c.y < r.y + r.h &&
          c.y + h > r.y
        );
      })
    );
  };

  const candidates = [
    { x: clampX(anchor.x), y: anchor.y + BAR_H + gap },
    { x: clampX(anchor.x), y: anchor.y - h - gap },
    { x: anchor.x + anchor.w + gap, y: clampY(anchor.y - 8) },
    { x: anchor.x - cardWidth - gap, y: clampY(anchor.y - 8) },
  ];

  for (let y = 8; y + h <= height - 8; y += 12) {
    for (let x = 8; x + cardWidth <= width - 8; x += 24) {
      candidates.push({ x, y });
    }
  }

  const spot = candidates.find(fits) ?? {
    x: clampX(anchor.x),
    y: height + 12,
  };

  return { left: spot.x, top: spot.y, width: cardWidth };
}

function NoteIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2.5 3.5h11v7h-6l-3 2.5v-2.5h-2z" />
    </svg>
  );
}

function Pill({
  note,
  on,
  pulse,
  controls,
  onEnter,
  onBlur,
  onClick,
}: {
  note: Note;
  on: boolean;
  /** Place in the staggered pulse, or null once the reader opened a note. */
  pulse: number | null;
  controls: string;
  onEnter: () => void;
  onBlur: () => void;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={`Note: ${note.title.split("`").join("")}`}
      aria-expanded={on}
      aria-controls={controls}
      onMouseEnter={onEnter}
      onFocus={onEnter}
      onBlur={onBlur}
      onClick={onClick}
      className={clsx(
        "ml-3.5 inline-flex h-5 shrink-0 items-center gap-[5px] rounded-full border pl-1.5 pr-2 font-sans text-[11.5px] font-medium leading-none transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-matcha-500 motion-reduce:transition-none",
        on
          ? "border-matcha-500/50 bg-matcha-500/10 text-matcha-700 dark:text-matcha-300"
          : "border-muted bg-canvasBase text-subtle hover:text-basis",
        pulse !== null && "animate-ac-pulse motion-reduce:animate-none"
      )}
      style={
        pulse !== null
          ? { animationDelay: `${300 + pulse * 140}ms` }
          : undefined
      }
    >
      <NoteIcon />
      {note.tease && <span>{note.tease}</span>}
    </button>
  );
}

function Inline({ text }: { text: string }) {
  return (
    <>
      {text.split("`").map((part, i) => {
        return i % 2 === 1 ? <code key={i}>{part}</code> : part;
      })}
    </>
  );
}

function NoteCard({
  id,
  note,
  style,
  onEnter,
  onLeave,
}: {
  id: string;
  note: Note;
  style: CSSProperties;
  onEnter: () => void;
  onLeave: () => void;
}) {
  return (
    <div
      id={id}
      role="note"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          onLeave();
        }
      }}
      className={clsx(
        "absolute z-20 box-border animate-ac-card rounded-xl border border-subtle bg-surfaceBase px-4 pb-3.5 pt-3 text-left shadow-[0_18px_40px_-14px_rgba(15,23,42,.3)] motion-reduce:animate-none dark:shadow-[0_18px_40px_-14px_rgba(0,0,0,.7)]",
        "[&_code]:rounded [&_code]:bg-canvasSubtle [&_code]:px-[5px] [&_code]:py-px [&_code]:font-mono [&_code]:text-[0.92em]"
      )}
      style={style}
    >
      <div className="text-sm font-semibold text-basis">
        <Inline text={note.title} />
      </div>
      <div className="mt-1 text-[13.5px] leading-[1.55] text-subtle [&_a]:text-matcha-600 dark:[&_a]:text-matcha-400 [&_p]:m-0">
        {note.body}
      </div>
      {note.href && (
        <Link
          href={note.href}
          className="mt-2 inline-block text-[13px] font-medium text-matcha-600 hover:text-matcha-700 dark:text-matcha-400 dark:hover:text-matcha-300"
        >
          {note.linkText ?? "Read more"} →
        </Link>
      )}
    </div>
  );
}
