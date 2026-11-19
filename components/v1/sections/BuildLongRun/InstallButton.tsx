"use client";

import { useEffect, useState } from "react";
import Button from "@/components/v1/Button";
import { cn } from "@/utils/v1/cn";

/**
 * "NPM Install" CTA — copies the install command to the clipboard.
 *
 * A copy button rather than a link because there is no /npm route in this
 * app, and the label promises the command itself, not a package listing.
 * The command is shown in the confirmation so nothing is hidden from the
 * person clicking it.
 *
 * Degrades honestly: where the async clipboard API is unavailable (older
 * browsers, non-secure origins) the command is selected in a prompt-free
 * fallback via a hidden textarea + execCommand, and if that also fails the
 * button reports it rather than silently doing nothing.
 */
export default function InstallButton({
  label,
  command,
  className,
}: {
  label: string;
  command: string;
  className?: string;
}) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  // Reset the confirmation so the button doesn't sit on "Copied" forever.
  useEffect(() => {
    if (state === "idle") return;
    const t = setTimeout(() => setState("idle"), 2200);
    return () => clearTimeout(t);
  }, [state]);

  async function copy() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(command);
        setState("copied");
        return;
      }
      const ta = document.createElement("textarea");
      ta.value = command;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      setState(ok ? "copied" : "failed");
    } catch {
      setState("failed");
    }
  }

  return (
    <div className={cn("relative", className)}>
      <Button
        onClick={copy}
        variant="secondary"
        className="!w-full !border-v1-accent-green/50 !font-v1Mono !text-v1-accent-green hover:!border-v1-accent-green hover:!bg-v1-accent-green/10 sm:!w-auto"
      >
        <span className="inline-flex items-center gap-2">
          {/* Copy glyph — two offset rounded rects, per the design. */}
          <svg
            aria-hidden="true"
            width="13"
            height="13"
            viewBox="0 0 16 16"
            fill="none"
            className="shrink-0"
          >
            <rect
              x="5.5"
              y="5.5"
              width="8"
              height="8"
              rx="1.5"
              stroke="currentColor"
            />
            <path
              d="M10.5 2.5H3a.5.5 0 0 0-.5.5v7.5"
              stroke="currentColor"
              strokeLinecap="round"
            />
          </svg>
          {label}
        </span>
      </Button>
      {/* Announced to screen readers as well as shown, so the outcome of
          the click isn't visual-only.

          Absolutely positioned: in the flow, its 8px top margin counted
          toward the wrapper's height even while empty, making this
          control 50px against the 42px CTA beside it — which
          `items-center` then split, sitting this button 4px high. Out of
          flow, the wrapper is exactly the button's height. */}
      <span
        role="status"
        aria-live="polite"
        className="text-v1-label-sm absolute left-0 top-full mt-2 whitespace-nowrap text-v1-frost/70"
      >
        {state === "copied"
          ? `Copied: ${command}`
          : state === "failed"
          ? `Copy failed — run: ${command}`
          : ""}
      </span>
    </div>
  );
}
