"use client";

import clsx from "clsx";
import { useId, type ReactNode } from "react";

export function Switch({
  checked,
  onChange,
  disabled,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={clsx(
        "relative inline-flex h-[18px] w-8 shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-breeze-500",
        checked
          ? "bg-matcha-600 dark:bg-matcha-500"
          : "bg-carbon-200 dark:bg-carbon-700",
        disabled && "cursor-not-allowed opacity-40"
      )}
    >
      <span
        className={clsx(
          "inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-[16px]" : "translate-x-[2px]"
        )}
      />
    </button>
  );
}

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={clsx("flex min-w-0 flex-col gap-1", className)}>
      <span className="text-[11px] font-medium text-muted">{label}</span>
      {children}
      {hint && (
        <span className="text-[11px] leading-snug text-muted">{hint}</span>
      )}
    </label>
  );
}

const inputCls =
  "h-7 w-full min-w-0 rounded-md bg-canvasBase px-2 text-xs text-basis tabular-nums ring-1 ring-inset ring-transparent focus:outline-none focus:ring-breeze-500";

export function NumberInput({
  value,
  onChange,
  min,
  max,
  step = 1,
  suffix,
  ariaLabel,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  ariaLabel?: string;
}) {
  return (
    <div className="relative">
      <input
        type="number"
        aria-label={ariaLabel}
        className={clsx(inputCls, suffix && "pr-6")}
        value={Number.isFinite(value) ? value : ""}
        min={min}
        max={max}
        step={step}
        onChange={(e) => {
          const v = parseFloat(e.target.value);
          if (Number.isNaN(v)) return;
          let n = v;
          if (min !== undefined) n = Math.max(min, n);
          if (max !== undefined) n = Math.min(max, n);
          onChange(n);
        }}
      />
      {suffix && (
        <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[11px] text-muted">
          {suffix}
        </span>
      )}
    </div>
  );
}

export function Select<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  ariaLabel?: string;
}) {
  return (
    <select
      aria-label={ariaLabel}
      className={clsx(inputCls, "pr-6")}
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function Segmented<T extends string | number>({
  value,
  onChange,
  options,
  ariaLabel,
  size = "sm",
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: ReactNode }[];
  ariaLabel: string;
  size?: "sm" | "xs";
}) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="inline-flex rounded-md bg-canvasMuted p-0.5"
    >
      {options.map((o) => (
        <button
          key={String(o.value)}
          type="button"
          role="radio"
          aria-checked={o.value === value}
          onClick={() => onChange(o.value)}
          className={clsx(
            "rounded px-2 font-medium tabular-nums transition-colors",
            size === "sm" ? "h-6 text-xs" : "h-5 text-[11px]",
            o.value === value
              ? "bg-canvasBase text-basis shadow-sm"
              : "text-muted hover:text-basis"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Tabs<T extends string>({
  value,
  onChange,
  tabs,
  className,
}: {
  value: T;
  onChange: (v: T) => void;
  tabs: { value: T; label: ReactNode }[];
  className?: string;
}) {
  const id = useId();
  return (
    <div
      role="tablist"
      className={clsx(
        "grid auto-cols-fr grid-flow-col gap-1 rounded-lg bg-canvasBase p-1",
        className
      )}
    >
      {tabs.map((t) => (
        <button
          key={t.value}
          id={`${id}-${t.value}`}
          type="button"
          role="tab"
          aria-selected={t.value === value}
          onClick={() => onChange(t.value)}
          className={clsx(
            "h-9 truncate rounded-md px-1.5 text-xs font-medium transition-colors sm:px-3 sm:text-sm",
            t.value === value
              ? "bg-carbon-900 text-white shadow-sm dark:bg-carbon-100 dark:text-carbon-1000"
              : "text-subtle hover:bg-canvasMuted hover:text-basis"
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function IconButton({
  onClick,
  label,
  children,
  className,
  disabled,
}: {
  onClick: () => void;
  label: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        "inline-flex h-7 w-7 items-center justify-center rounded-md text-muted transition-colors hover:bg-canvasMuted hover:text-basis disabled:opacity-40",
        className
      )}
    >
      {children}
    </button>
  );
}

export function Button({
  onClick,
  children,
  variant = "secondary",
  className,
  title,
}: {
  onClick: () => void;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={clsx(
        "inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-colors",
        variant === "primary" &&
          "bg-btnPrimary text-alwaysWhite hover:bg-btnPrimaryHover",
        variant === "secondary" &&
          "bg-canvasBase text-basis hover:bg-canvasMuted",
        variant === "ghost" &&
          "text-muted hover:bg-canvasMuted hover:text-basis",
        className
      )}
    >
      {children}
    </button>
  );
}

/** Tenant letter chip. Tenants are identified by letter, not color. */
export function TenantChip({
  id,
  className,
}: {
  id: string;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex h-4 min-w-[16px] items-center justify-center rounded bg-carbon-900 px-1 font-mono text-[10px] font-semibold leading-none text-white dark:bg-carbon-100 dark:text-carbon-1000",
        className
      )}
    >
      {id}
    </span>
  );
}
