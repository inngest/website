"use client";

import { useEffect, useState } from "react";
import Button from "@/components/v1/Button";
import { cn } from "@/utils/v1/cn";

export const INSTALL_COMMAND = "npm install inngest";

function CopyIcon() {
  return (
    <svg
      className="h-3 w-[11px] shrink-0"
      viewBox="0 0 10.8 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2.4 2.4V0.6C2.4 0.44087 2.46321 0.288258 2.57574 0.175736C2.68826 0.0632141 2.84087 0 3 0H10.2C10.3591 0 10.5117 0.0632141 10.6243 0.175736C10.7368 0.288258 10.8 0.44087 10.8 0.6V9C10.8 9.15913 10.7368 9.31174 10.6243 9.42426C10.5117 9.53679 10.3591 9.6 10.2 9.6H8.4V11.4C8.4 11.7312 8.13 12 7.7958 12H0.6042C0.525076 12.0005 0.446638 11.9853 0.373393 11.9554C0.300148 11.9254 0.23354 11.8813 0.177395 11.8256C0.12125 11.7698 0.0766758 11.7035 0.0462326 11.6305C0.0157894 11.5575 7.76246e-05 11.4791 0 11.4L0.00180001 3C0.00180001 2.6688 0.2718 2.4 0.606 2.4H2.4ZM1.2018 3.6L1.2 10.8H7.2V3.6H1.2018ZM3.6 2.4H8.4V8.4H9.6V1.2H3.6V2.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CopiedIcon() {
  return (
    <svg
      className="h-3 w-[11px] shrink-0"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3.2 8.3 6.3 11.4 12.8 4.6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * "npm install inngest" copy chip. Rendered through the shared `Button`
 * (secondary / outline variant) so it sits on the same height, type and
 * hover vocabulary as every other CTA on the site — the outline floods
 * salmon on hover like all secondary buttons do. Click copies the
 * install command and swaps the label to "Copied" for two seconds.
 */
export default function InstallCommandButton({
  className,
  label = INSTALL_COMMAND,
}: {
  className?: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(id);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(INSTALL_COMMAND);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Button
      type="button"
      variant="secondary"
      onClick={copy}
      aria-label={
        copied ? `Copied ${INSTALL_COMMAND}` : `Copy ${INSTALL_COMMAND}`
      }
      // The install command is code — keep it in the mono face and
      // don't uppercase it (the shared Button uppercases labels).
      className={cn("font-v1Mono normal-case", className)}
    >
      <span className="grid">
        <span
          className={cn(
            "col-start-1 row-start-1 inline-flex items-center gap-2.5",
            copied && "invisible"
          )}
        >
          <span className="inline-flex size-4 items-center justify-center">
            <CopyIcon />
          </span>
          {label}
        </span>
        <span
          className={cn(
            "col-start-1 row-start-1 inline-flex items-center justify-center gap-2.5",
            !copied && "invisible"
          )}
        >
          <span className="inline-flex size-4 items-center justify-center">
            <CopiedIcon />
          </span>
          Copied
        </span>
      </span>
    </Button>
  );
}
