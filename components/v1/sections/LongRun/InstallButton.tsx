"use client";

import { useEffect, useState } from "react";
import Button from "@/components/v1/Button";

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
    <div className={className}>
      <Button onClick={copy} variant="secondary" className="!w-full sm:!w-auto">
        {label}
      </Button>
      {/* Announced to screen readers as well as shown, so the outcome of
          the click isn't visual-only. */}
      <span
        role="status"
        aria-live="polite"
        className="text-v1-label-sm mt-2 block text-v1-frost/70"
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
