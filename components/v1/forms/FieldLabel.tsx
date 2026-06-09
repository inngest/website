import { type ReactNode } from "react";
import { cn } from "@/utils/v1/cn";

export interface FieldLabelProps {
  htmlFor: string;
  children: ReactNode;
  /** Appends a non-semantic `*`. The input's `required` attribute is the
   *  accessible signal; the asterisk is purely visual. */
  required?: boolean;
  className?: string;
}

/**
 * v1 form field label — 18px CircularXX, cap-trimmed so the label box
 * collapses to its cap height and the label→input gap stays tight.
 */
export function FieldLabel({
  htmlFor,
  children,
  required,
  className,
}: FieldLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "text-v1-body-lg text-v1-frost",
        className,
      )}
    >
      {children}
      {required && <span aria-hidden="true">*</span>}
    </label>
  );
}
