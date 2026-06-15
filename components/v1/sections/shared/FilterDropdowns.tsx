"use client";

import { useEffect, useRef, useState } from "react";

// Filter dropdown primitives shared across /learn and
// /events filter bars. Same vocabulary: label trigger + chevron or
// filter icon, salmon-checkbox single/multi-select panel, salmon dot
// indicator when multi-select has active filters.

export function useOutsideClose(
  ref: React.RefObject<HTMLElement | null>,
  onClose: () => void,
  open: boolean,
) {
  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      const node = ref.current;
      if (!node) return;
      if (e.target instanceof Node && !node.contains(e.target)) onClose();
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", handle);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handle);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [ref, onClose, open]);
}

export function DropdownTrigger({
  label,
  trailing,
  indicator,
  onClick,
  open,
  triggerClassName,
  iconClassName,
  iconVariant = "small",
}: {
  label: string;
  trailing: "chevron" | "filter" | "arrowDropDown" | "arrowWide";
  indicator?: boolean;
  onClick: () => void;
  open: boolean;
  triggerClassName?: string;
  iconClassName?: string;
  iconVariant?: "small" | "large";
}) {
  const Icon =
    trailing === "filter"
      ? FilterIcon
      : trailing === "arrowDropDown"
        ? ArrowDropDown
        : trailing === "arrowWide"
          ? ArrowDownWide
          : Chevron;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-haspopup="listbox"
      aria-expanded={open}
      className={
        triggerClassName ??
        "group/dd font-v1Label inline-flex items-center gap-2 text-[14px] font-semibold uppercase leading-[1] tracking-[normal] text-v1-frost motion-safe:transition-colors hover:text-v1-accent-salmon"
      }
    >
      <span>{label}</span>
      <span
        aria-hidden="true"
        className="relative inline-flex items-center text-v1-frost/55 group-hover/dd:text-v1-frost"
      >
        <Icon className={iconClassName ?? (iconVariant === "large" ? "h-6 w-6" : undefined)} />
        {indicator ? (
          <span className="absolute -right-1 -top-1 inline-block size-[6px] rounded-full bg-v1-accent-salmon" />
        ) : null}
      </span>
    </button>
  );
}

export function SingleSelectDropdown<T extends string>({
  label,
  trailing,
  value,
  onChange,
  options,
  align = "left",
  triggerClassName,
  iconClassName,
  iconVariant,
}: {
  label: string;
  trailing: "chevron" | "filter" | "arrowDropDown" | "arrowWide";
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  align?: "left" | "right";
  triggerClassName?: string;
  iconClassName?: string;
  iconVariant?: "small" | "large";
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClose(ref, () => setOpen(false), open);

  return (
    <div ref={ref} className="relative">
      <DropdownTrigger
        label={label}
        trailing={trailing}
        open={open}
        onClick={() => setOpen((o) => !o)}
        triggerClassName={triggerClassName}
        iconClassName={iconClassName}
        iconVariant={iconVariant}
      />
      {open ? (
        <DropdownPanel align={align}>
          <ul className="flex list-none flex-col gap-1 pl-0">
            {options.map((o) => {
              const selected = o.value === value;
              return (
                <li key={o.value} className="list-none">
                  <button
                    type="button"
                    onClick={() => {
                      onChange(o.value);
                      setOpen(false);
                    }}
                    className="group/opt font-v1Label flex w-full items-center gap-3 rounded px-3 py-2 text-left text-[13px] font-semibold uppercase leading-[1] tracking-[normal] text-v1-frost/85 motion-safe:transition-colors hover:bg-v1-frost/[0.04] hover:text-v1-frost"
                  >
                    <CheckboxSquare selected={selected} />
                    <span>{o.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </DropdownPanel>
      ) : null}
    </div>
  );
}

export function MultiSelectDropdown({
  label,
  trailing,
  values,
  onChange,
  options,
  align = "left",
  allValue,
  triggerClassName,
  iconClassName,
  iconVariant,
  panelVariant = "compact",
}: {
  label: string;
  trailing: "chevron" | "filter" | "arrowDropDown" | "arrowWide";
  values: string[];
  onChange: (v: string[]) => void;
  options: { value: string; label: string }[];
  align?: "left" | "right";
  /**
   * When set, this option acts as the "All" toggle: clicking it clears every
   * specific selection, and it reads as selected whenever nothing specific is
   * chosen. Selecting any specific option implicitly clears "All".
   */
  allValue?: string;
  triggerClassName?: string;
  iconClassName?: string;
  iconVariant?: "small" | "large";
  /** "events" uses the wider 246px panel with 44px rows. */
  panelVariant?: "compact" | "events";
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClose(ref, () => setOpen(false), open);

  const isSelected = (val: string) =>
    allValue != null && val === allValue
      ? values.length === 0
      : values.includes(val);

  const toggle = (val: string) => {
    if (allValue != null && val === allValue) {
      onChange([]);
      return;
    }
    if (values.includes(val)) onChange(values.filter((v) => v !== val));
    else onChange([...values, val]);
  };

  return (
    <div ref={ref} className="relative">
      <DropdownTrigger
        label={label}
        trailing={trailing}
        indicator={panelVariant === "events" ? false : values.length > 0}
        open={open}
        onClick={() => setOpen((o) => !o)}
        triggerClassName={triggerClassName}
        iconClassName={iconClassName}
        iconVariant={iconVariant}
      />
      {open ? (
        <DropdownPanel align={align} variant={panelVariant}>
          <ul className="flex w-full list-none flex-col pl-0">
            {options.map((o) => {
              const selected = isSelected(o.value);
              return (
                <li key={o.value} className="list-none">
                  <button
                    type="button"
                    onClick={() => toggle(o.value)}
                    className={
                      panelVariant === "events"
                        ? "group/opt font-v1Label flex w-full items-center text-left text-[12px] font-normal uppercase leading-[1.25] tracking-[normal] text-white motion-safe:transition-colors hover:text-v1-accent-salmon"
                        : "group/opt font-v1Label flex w-full items-center gap-3 rounded px-3 py-2 text-left text-[13px] font-semibold uppercase leading-[1] tracking-[normal] text-v1-frost/85 motion-safe:transition-colors hover:bg-v1-frost/[0.04] hover:text-v1-frost"
                    }
                  >
                    <CheckboxSquare
                      selected={selected}
                      variant={panelVariant === "events" ? "large" : "small"}
                    />
                    <span>{o.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </DropdownPanel>
      ) : null}
    </div>
  );
}

export function DropdownPanel({
  children,
  align = "left",
  variant = "compact",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
  variant?: "compact" | "events";
}) {
  if (variant === "events") {
    return (
      <div
        style={{
          borderColor: "rgba(124, 124, 124, 0.35)",
          backgroundImage:
            "linear-gradient(-67.97deg, rgba(33, 33, 33, 0) 2.25%, #020202 46.83%)",
          backgroundColor: "#020202",
        }}
        className={`absolute top-[calc(100%+8px)] z-30 w-[246px] overflow-hidden rounded-[4px] border pb-6 pl-3 pr-6 pt-6 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.7)] ${
          align === "right" ? "right-0" : "left-0"
        }`}
      >
        {children}
      </div>
    );
  }
  return (
    <div
      style={{
        // Border: 1px #7C7C7C / 0.35 — matches the first stop of the
        // 4-stop opacity gradient stroke. The full 4-stop alpha sweep
        // on a 1px stroke is visually negligible; a flat 35% reads as
        // the same color.
        borderColor: "rgb(var(--color-v1-carbon-300) / 0.35)",
        // Background: linear gradient #212121 → #020202 along the 225°
        // axis so the lit corner sits at the top-right and the dark
        // corner at the bottom-left.
        backgroundImage:
          "linear-gradient(225deg, #212121 0%, #020202 100%)",
      }}
      className={`absolute top-[calc(100%+10px)] z-30 min-w-[240px] overflow-hidden rounded-md border p-3 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.7)] ${
        align === "right" ? "right-0" : "left-0"
      }`}
    >
      {children}
    </div>
  );
}

export function CheckboxSquare({
  selected,
  variant = "small",
}: {
  selected: boolean;
  variant?: "small" | "large";
}) {
  if (variant === "large") {
    // 44px slot with a 24px square (1px solid #cdcdcd, 4px radius) and a
    // 12px salmon centre when selected.
    return (
      <span
        aria-hidden="true"
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center"
      >
        <span
          style={{ borderColor: "#cdcdcd" }}
          className="relative inline-flex h-6 w-6 items-center justify-center rounded-[4px] border"
        >
          {selected ? (
            <span className="block h-3 w-3 rounded-[2px] bg-v1-accent-salmon" />
          ) : null}
        </span>
      </span>
    );
  }
  return (
    <span
      aria-hidden="true"
      className="inline-flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-[2px] border border-v1-frost/45 p-[2.5px]"
    >
      {selected ? (
        <span className="block h-full w-full rounded-[1px] bg-v1-accent-salmon" />
      ) : null}
    </span>
  );
}

export function Chevron({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" className={className ?? "h-3 w-3"} aria-hidden="true">
      <path
        d="M2 4.5 L6 8.5 L10 4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FilterIcon({ className }: { className?: string }) {
  // "filter-3-line" — three horizontal lines decreasing in width,
  // glyph box ≈ 16 × 11 centred in the 24px frame (not filling it).
  // viewBox is 24 so it renders 1:1 at h-6/w-6.
  return (
    <svg viewBox="0 0 24 24" className={className ?? "h-3.5 w-3.5"} aria-hidden="true">
      <path
        d="M4.5 7.5 H19.5 M7 12 H17 M9.5 16.5 H14.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ArrowDropDown({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className ?? "h-3 w-3"} aria-hidden="true" fill="currentColor">
      <path d="M7 10l5 5 5-5z" />
    </svg>
  );
}

export function ArrowDownWide({ className }: { className?: string }) {
  // "arrow-down-wide-line" renders as a wide, shallow chevron-down —
  // not the Remix sort glyph the name suggests. Glyph box ≈ 13.4 × 4.9
  // centred in the 24px frame.
  return (
    <svg viewBox="0 0 24 24" className={className ?? "h-3.5 w-3.5"} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5.3 9.8 L12 14.7 L18.7 9.8" />
    </svg>
  );
}
