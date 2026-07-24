"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/utils/v1/cn";
import {
  onCursorSpotlightMove,
  CURSOR_SPOTLIGHT_SEED,
} from "@/utils/v1/cursorFx";
import DisclosureRow, { type DisclosureRowProps } from "./DisclosureRow";

export interface AccordionDotProps {
  /** Drives the dot color — `activeClassName` when open. */
  open: boolean;
  /**
   * Alignment-box className. The dot is centered within this box, so
   * set its height to the title's first-line height — e.g. an em-based
   * `[height:1.3em]` at the title's `font-size` — to pin the dot to the
   * first line for both single- and multi-line titles, at any size.
   */
  className?: string;
  /** Collapsed color (+ any hover treatment). */
  inactiveClassName?: string;
  /** Expanded color. */
  activeClassName?: string;
}

/**
 * The shared accordion open/closed indicator: an 8px square that turns
 * salmon when its row is open and a neutral tone when collapsed,
 * centered in a caller-sized alignment box. Rendered in an
 * {@link AccordionItem}'s `trigger` slot. Alignment is em-based via
 * `className` rather than fixed margins, so it tracks the title's first
 * line across breakpoints without per-breakpoint tuning.
 */
export function AccordionDot({
  open,
  className,
  inactiveClassName = "bg-v1-steel",
  activeClassName = "bg-v1-accent-salmon",
}: AccordionDotProps) {
  return (
    <span
      aria-hidden="true"
      className={cn("flex shrink-0 items-center justify-center", className)}
    >
      <span
        className={cn(
          "size-2 motion-safe:transition-colors motion-safe:duration-200",
          open ? activeClassName : inactiveClassName,
        )}
      />
    </span>
  );
}

interface AccordionContextValue {
  openId: string | null;
  toggle: (id: string) => void;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordionContext(): AccordionContextValue {
  const ctx = useContext(AccordionContext);
  if (!ctx) {
    throw new Error("<AccordionItem> must be rendered inside <Accordion>");
  }
  return ctx;
}

export interface AccordionProps {
  /** Item open on first render (uncontrolled). Defaults to none open. */
  defaultOpenId?: string | null;
  /**
   * When this value changes, collapse any open item — e.g. when a
   * filter above the list swaps the item set, so a left-open row can't
   * reveal content that no longer matches. The initial mount is
   * skipped, so it never clobbers `defaultOpenId`.
   */
  resetKey?: unknown;
  /**
   * Layout-neutral: renders no DOM of its own, only the open-state
   * context. Supply the list element (`<ul>`, `motion.li` wrappers,
   * etc.) yourself so each page keeps its own layout.
   */
  children: ReactNode;
}

/**
 * Single-open accordion controller. Owns the open-state + toggle and
 * shares them via context so {@link AccordionItem}s don't have to
 * thread `isOpen`/`onToggle` by hand. Pairs with `AccordionItem`
 * (which wraps the {@link DisclosureRow} mechanics).
 *
 * Consumers: Contact (`resetKey={interest}`), AI/Faq + the FAQ pages
 * that reuse it (`defaultOpenId={faqs[0].id}`).
 */
export function Accordion({
  defaultOpenId = null,
  resetKey,
  children,
}: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId);

  // Single-open: opening a row closes any other; clicking the open row
  // collapses it.
  const toggle = useCallback(
    (id: string) => setOpenId((prev) => (prev === id ? null : id)),
    [],
  );

  // Collapse everything when `resetKey` changes — but not on the first
  // render, where it would otherwise wipe out `defaultOpenId`.
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    setOpenId(null);
  }, [resetKey]);

  const value = useMemo(() => ({ openId, toggle }), [openId, toggle]);
  return (
    <AccordionContext.Provider value={value}>
      {children}
    </AccordionContext.Provider>
  );
}

/** A slot that may read the item's open state, or be static content. */
type RenderSlot = ReactNode | ((open: boolean) => ReactNode);

const resolveSlot = (slot: RenderSlot, open: boolean): ReactNode =>
  typeof slot === "function" ? slot(open) : slot;

/**
 * Shared row chrome baked into every styled `AccordionItem`: the
 * spotlight group + stacking context, the rounded-clip for the sheen,
 * the color transition, the baseline hover fill, and the vertical rhythm
 * (`py-5`) so every accordion shares the same row height + open-state
 * breathing. Pages override the divergent bits (rounding, *horizontal*
 * padding, active-fill, hover strength) via `className`, which
 * `cn`/tailwind-merge resolves last-wins.
 */
const STYLED_ITEM_BASE =
  "group/disclosure relative isolate overflow-hidden py-5 motion-safe:transition-colors motion-safe:duration-300 motion-safe:ease-v1-out hover:bg-v1-frost/[0.025]";

/**
 * Canonical cursor-tracked sheen — the same frost radial used across the
 * v1 accordions, keyed on the shared `group/disclosure` hover so it
 * never bleeds between rows. Reads the `--mx`/`--my` vars that
 * {@link onCursorSpotlightMove} writes to the row.
 */
const STYLED_SPOTLIGHT = (
  <span
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 -z-0 opacity-0 motion-safe:transition-opacity motion-safe:duration-[420ms] group-hover/disclosure:opacity-100"
    style={{
      background:
        "radial-gradient(420px circle at var(--mx) var(--my), rgba(232, 234, 237, 0.05), transparent 65%)",
    }}
  />
);

export interface AccordionItemProps
  extends Omit<
    DisclosureRowProps,
    "isOpen" | "onToggle" | "trigger" | "children" | "className"
  > {
  /** Identifies this item within its `<Accordion>` (the open key). */
  id: string;
  /** Extra wrapper classes layered over {@link STYLED_ITEM_BASE}; may
   *  depend on `open` (e.g. an active-fill). tailwind-merge wins last,
   *  so e.g. a stronger `hover:bg-*` here overrides the base. */
  className?: string | ((open: boolean) => string);
  /**
   * Cursor-spotlight sheen + group hover fill. On by default (the
   * shared styling). Set `false` for a plain row, or pass a custom
   * `overlay` to replace the sheen.
   */
  spotlight?: boolean;
  /** Trigger content. Receives `open` so the dot/title can restyle. */
  trigger: RenderSlot;
  /** Body content. Receives `open` (e.g. to gate link tab order). */
  children: RenderSlot;
}

/**
 * Context-connected disclosure row: pulls `isOpen`/`onToggle` from the
 * enclosing {@link Accordion} and forwards every visual prop to
 * {@link DisclosureRow}. The `trigger`/`children` slots accept a
 * `(open) => ReactNode` render function so open-dependent styling
 * stays inline.
 */
export function AccordionItem({
  id,
  className,
  spotlight = true,
  overlay,
  onPointerMove,
  style,
  trigger,
  children,
  ...rest
}: AccordionItemProps) {
  const { openId, toggle } = useAccordionContext();
  const open = openId === id;
  const extra = typeof className === "function" ? className(open) : className;
  return (
    <DisclosureRow
      {...rest}
      className={cn(STYLED_ITEM_BASE, extra)}
      // Spotlight is the shared default: render the canonical sheen and
      // wire the cursor tracking, unless the caller opts out or supplies
      // its own overlay. Caller-provided handlers/styles still win.
      overlay={overlay ?? (spotlight ? STYLED_SPOTLIGHT : undefined)}
      onPointerMove={
        onPointerMove ?? (spotlight ? onCursorSpotlightMove : undefined)
      }
      style={spotlight ? { ...CURSOR_SPOTLIGHT_SEED, ...style } : style}
      isOpen={open}
      onToggle={() => toggle(id)}
      trigger={resolveSlot(trigger, open)}
    >
      {resolveSlot(children, open)}
    </DisclosureRow>
  );
}
