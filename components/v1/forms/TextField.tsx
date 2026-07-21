"use client";

import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "@/utils/v1/cn";
import { FieldLabel } from "./FieldLabel";
import { INPUT_CLASSES } from "./fieldStyles";

export interface TextFieldProps
  extends Omit<ComponentPropsWithoutRef<"input">, "onChange" | "value"> {
  /** Used for the `<label htmlFor>`, the input `id`, and (unless `name`
   *  is given) the input `name`. */
  id: string;
  /** Usually a string; accepts ReactNode for labels that need an inline
   *  link or other markup (e.g. a "get your badge" link). */
  label: ReactNode;
  value: string;
  /** Controlled change handler — receives the value, not the event. */
  onChange: (value: string) => void;
}

/**
 * Labelled single-line text input in the v1 form style. Controlled:
 * pass `value` + `onChange`. Any other native `<input>` attribute
 * (`type`, `placeholder`, `autoComplete`, `inputMode`, `pattern`,
 * `aria-*`, …) is forwarded through.
 */
export function TextField({
  id,
  label,
  value,
  onChange,
  required,
  name,
  className,
  ...rest
}: TextFieldProps) {
  return (
    <div className="flex flex-col gap-4">
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      <input
        {...rest}
        id={id}
        name={name ?? id}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(INPUT_CLASSES, className)}
      />
    </div>
  );
}
