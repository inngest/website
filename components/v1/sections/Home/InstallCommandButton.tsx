"use client";

import { useEffect, useState } from "react";
import Button from "@/components/v1/Button";
import { cn } from "@/utils/v1/cn";

export const INSTALL_COMMAND = "npm install inngest";

function CopyIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="5.25"
        y="5.25"
        width="8"
        height="8"
        rx="1.25"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M10.75 5.1V3.75A1.25 1.25 0 0 0 9.5 2.5H3.75A1.25 1.25 0 0 0 2.5 3.75V9.5a1.25 1.25 0 0 0 1.25 1.25H5.1"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}

function CopiedIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
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
 * `npm install inngest` as a copy-to-clipboard button. Goes nowhere —
 * clicking copies the command and the label flips to "Copied" for two
 * seconds. Used in the hero and again under the dev server tour.
 */
export default function InstallCommandButton({
  className,
}: {
  className?: string;
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
        copied ? "Copied npm install inngest" : "Copy npm install inngest"
      }
      className={cn(
        "!min-w-[15.75rem] !font-v1Mono !normal-case !tracking-normal",
        className
      )}
    >
      {/* Both labels stack in one grid cell so the button keeps its
          width when the text flips to "Copied". */}
      <span className="grid">
        <span
          className={cn(
            "col-start-1 row-start-1 inline-flex items-center gap-2",
            copied && "invisible"
          )}
        >
          <CopyIcon />
          {INSTALL_COMMAND}
        </span>
        <span
          className={cn(
            "col-start-1 row-start-1 inline-flex items-center justify-center gap-2",
            !copied && "invisible"
          )}
        >
          <CopiedIcon />
          Copied
        </span>
      </span>
    </Button>
  );
}
