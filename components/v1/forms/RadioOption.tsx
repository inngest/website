"use client";

import { cn } from "@/utils/v1/cn";

export interface RadioOptionProps {
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}

/**
 * v1 radio option — a visually-hidden native `<input type="radio">`
 * paired with a custom ring: a 44px control box housing a ~22px ring with
 * a 12px inner dot; unselected ring = steel, selected = salmon ring + dot.
 * Keyboard focus shows a frost outline on the control box.
 *
 * Shared by the Contact hub and the Sales inquiry form.
 */
export function RadioOption({
  name,
  value,
  label,
  checked,
  onChange,
}: RadioOptionProps) {
  return (
    <label className="group/radio inline-flex cursor-pointer items-center gap-2 text-v1-body-lg-loose text-v1-frost">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className="relative flex size-[44px] shrink-0 items-center justify-center rounded-full peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-v1-frost/60"
      >
        <span
          className={cn(
            "inline-flex size-[22px] items-center justify-center rounded-full border-2 bg-v1-jetBlack transition-colors",
            checked ? "border-v1-accent-salmon" : "border-v1-steel",
          )}
        >
          {checked && (
            <span className="block size-[12px] rounded-full bg-v1-accent-salmon" />
          )}
        </span>
      </span>
      <span className="select-none">{label}</span>
    </label>
  );
}
