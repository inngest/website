"use client";

import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "@/utils/v1/cn";
import { FieldLabel } from "./FieldLabel";
import { INPUT_CLASSES } from "./fieldStyles";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFieldProps
  extends Omit<ComponentPropsWithoutRef<"select">, "onChange" | "value"> {
  /** Used for the `<label htmlFor>`, the select `id`, and (unless `name`
   *  is given) the select `name`. */
  id: string;
  label: ReactNode;
  value: string;
  options: SelectOption[];
  /** Controlled change handler — receives the value, not the event. */
  onChange: (value: string) => void;
  /** Text for the empty first option. The option is disabled once a
   *  value is picked, so `required` selects can't be reset to blank. */
  placeholder?: string;
  labelClassName?: string;
}

/**
 * Labelled native `<select>` in the v1 form style. Same chrome as
 * `TextField` (shared `INPUT_CLASSES`) plus a custom chevron, since the
 * native arrow is hidden with `appearance-none`.
 */
export function SelectField({
  id,
  label,
  value,
  options,
  onChange,
  placeholder = "Select…",
  required,
  name,
  className,
  labelClassName,
  ...rest
}: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-4">
      <FieldLabel htmlFor={id} required={required} className={labelClassName}>
        {label}
      </FieldLabel>
      <div className="relative">
        <select
          {...rest}
          id={id}
          name={name ?? id}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            INPUT_CLASSES,
            "appearance-none pr-10",
            value === "" && "text-v1-frost/50",
            className
          )}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="text-v1-frost">
              {opt.label}
            </option>
          ))}
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 12 8"
          className="pointer-events-none absolute right-4 top-1/2 h-[8px] w-[12px] -translate-y-1/2 text-v1-frost/70"
        >
          <path
            d="M1 1.5 6 6.5l5-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </div>
    </div>
  );
}
