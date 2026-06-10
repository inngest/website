"use client";

/**
 * Customer-stories filter + sort dropdowns and the page-local
 * primitives they share. Two public components are exported:
 *   - `<CategoryDropdown>`  multiselect tag filter (square checkboxes)
 *   - `<SortByDropdown>`    single-select sort order (round radios)
 *
 * Both are built on a shared `<FilterDropdown>` chrome (trigger button
 * + popover panel + Escape / outside-click dismiss) and a shared
 * `<DropdownOption>` row.
 *
 * Panel chrome:
 *   - 246 px wide, 1 px rgba(124,124,124,0.35) border, 4 px radius
 *   - Background-Gradient-Black layered over solid #020202
 *   - Soft-light noise overlay (shared v1 grain asset)
 *   - pl-3 pr-6 + 44 px hit-target rows = 12 px left visual inset
 */

import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/v1/cn";

export const CATEGORY_OPTIONS = [
  "ALL",
  "AI",
  "ECOMMERCE",
  "SAAS",
  "SECURITY",
] as const;
export type Category = (typeof CATEGORY_OPTIONS)[number];

export const SORT_OPTIONS = ["LATEST", "ALPHABETICAL"] as const;
export type SortOption = (typeof SORT_OPTIONS)[number];

export function CategoryDropdown({
  selected,
  onChange,
}: {
  selected: Set<Category>;
  onChange: (next: Set<Category>) => void;
}) {
  function toggle(opt: Category) {
    if (opt === "ALL") {
      onChange(new Set<Category>(["ALL"]));
      return;
    }
    const next = new Set(selected);
    next.delete("ALL");
    if (next.has(opt)) next.delete(opt);
    else next.add(opt);
    if (next.size === 0) next.add("ALL");
    onChange(next);
  }

  return (
    <FilterDropdown label="Categories">
      {() =>
        CATEGORY_OPTIONS.map((opt) => (
          <DropdownOption
            key={opt}
            label={opt}
            shape="square"
            active={selected.has(opt)}
            onSelect={() => toggle(opt)}
          />
        ))
      }
    </FilterDropdown>
  );
}

export function SortByDropdown({
  selected,
  onChange,
}: {
  selected: SortOption;
  onChange: (next: SortOption) => void;
}) {
  return (
    <FilterDropdown label="Sort By" align="right">
      {(close) =>
        SORT_OPTIONS.map((opt) => (
          <DropdownOption
            key={opt}
            label={opt}
            shape="round"
            active={selected === opt}
            onSelect={() => {
              onChange(opt);
              close();
            }}
          />
        ))
      }
    </FilterDropdown>
  );
}

// ---- Shared primitives ---------------------------------------------------

/**
 * Closes `open` state on Escape or mousedown outside `ref`. Listeners
 * attach only while open so closed dropdowns add no global cost.
 */
function useOutsideDismiss(
  ref: React.RefObject<HTMLElement | null>,
  open: boolean,
  setOpen: (next: boolean) => void
) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      const node = ref.current;
      if (!node) return;
      if (e.target instanceof Node && !node.contains(e.target)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open, ref, setOpen]);
}

/**
 * Trigger button + popover panel chrome shared by both dropdowns.
 * `children` receives `close()` so single-select options can dismiss
 * after picking; multi-select keeps the panel open.
 */
function FilterDropdown({
  label,
  align = "left",
  children,
}: {
  label: string;
  align?: "left" | "right";
  children: (close: () => void) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOutsideDismiss(ref, open, setOpen);
  const close = () => setOpen(false);
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        className="group/dd inline-flex items-center gap-2 text-[18px] text-v1-frost motion-safe:transition-colors hover:text-v1-accent-salmon"
      >
        <span>{label}</span>
        {/* Chevron rotates 180° when the panel is open. Mirrors what
            sighted users expect from disclosure buttons; complements
            the `aria-expanded` state already exposed to AT. */}
        <span
          aria-hidden
          className={cn(
            "inline-flex items-center text-v1-frost/55 group-hover/dd:text-v1-accent-salmon motion-safe:transition-transform motion-safe:duration-200",
            open && "rotate-180"
          )}
        >
          <svg viewBox="0 0 12 12" className="h-3 w-3">
            <path
              d="M2 4.5 L6 8.5 L10 4.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      {open && (
        // Plain `role="group"` rather than `listbox` — the rows are
        // toggle buttons (each with its own `aria-pressed`), so the
        // ARIA listbox/option pattern doesn't fit and would mis-cue
        // screen readers about arrow-key navigation that isn't wired
        // up. The group label provides the equivalent context.
        <div
          role="group"
          aria-label={label}
          style={{
            backgroundColor: "#020202",
            backgroundImage:
              "linear-gradient(297deg, rgba(33,33,33,1) -2.25%, #020202 46.83%)",
          }}
          className={cn(
            "absolute top-[calc(100%+12px)] z-30 w-[246px] overflow-hidden rounded-[4px] border border-v1-strong/[0.35] py-6 pl-3 pr-6 shadow-[0_20px_60px_rgba(0,0,0,0.5)]",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          <span
            aria-hidden
            style={{
              backgroundImage:
                "url(/assets/v1/textures/.compressed/noise-dark.webp)",
              mixBlendMode: "soft-light",
            }}
            className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-60"
          />
          <div className="relative flex flex-col">
            {children(close)}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * One row in a `<FilterDropdown>`: a native toggle `<button>` with a
 * 44 × 44 hit frame holding either a checkbox (square) or radio
 * (round) indicator, followed by the option label. `aria-pressed`
 * reflects active state for both shapes — the surrounding
 * `role="group"` provides the listbox-equivalent grouping context.
 */
function DropdownOption({
  label,
  shape,
  active,
  onSelect,
}: {
  label: string;
  shape: "square" | "round";
  active: boolean;
  onSelect: () => void;
}) {
  const outerShape = shape === "round" ? "rounded-full" : "rounded-[4px]";
  const innerShape = shape === "round" ? "rounded-full" : "rounded-[2px]";
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onSelect}
      className="inline-flex w-full cursor-pointer items-center text-left font-v1Mono text-[12px] uppercase leading-[1.25] text-v1-frost"
    >
      <span
        aria-hidden
        className="inline-flex size-[44px] shrink-0 items-center justify-center"
      >
        <span
          className={cn(
            "relative inline-flex size-[24px] items-center justify-center border border-v1-contrast transition-colors",
            outerShape
          )}
        >
          {active && (
            <span
              className={cn(
                "block size-[12px] bg-v1-accent-salmon",
                innerShape
              )}
            />
          )}
        </span>
      </span>
      <span className="select-none">{label}</span>
    </button>
  );
}
