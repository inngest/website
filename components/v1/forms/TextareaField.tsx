"use client";

import { type ComponentPropsWithoutRef } from "react";
import { cn } from "@/utils/v1/cn";
import { FieldLabel } from "./FieldLabel";
import { TEXTAREA_CLASSES } from "./fieldStyles";

export interface TextareaFieldProps
  extends Omit<ComponentPropsWithoutRef<"textarea">, "onChange" | "value"> {
  /** Used for the `<label htmlFor>`, the textarea `id`, and (unless
   *  `name` is given) the textarea `name`. */
  id: string;
  label: string;
  value: string;
  /** Controlled change handler — receives the value, not the event. */
  onChange: (value: string) => void;
  /** Optional override for the label's classes (e.g. a smaller
   *  font-size on a denser form). Merged onto the default label style. */
  labelClassName?: string;
}

/**
 * Labelled multi-line text input in the v1 form style. Controlled:
 * pass `value` + `onChange`. Any other native `<textarea>` attribute
 * (`rows`, `maxLength`, `aria-*`, …) is forwarded through.
 */
export function TextareaField({
  id,
  label,
  value,
  onChange,
  required,
  name,
  rows = 4,
  className,
  labelClassName,
  ...rest
}: TextareaFieldProps) {
  return (
    <div className="flex flex-col gap-4">
      <FieldLabel htmlFor={id} required={required} className={labelClassName}>
        {label}
      </FieldLabel>
      <textarea
        {...rest}
        id={id}
        name={name ?? id}
        required={required}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(TEXTAREA_CLASSES, className)}
      />
    </div>
  );
}
