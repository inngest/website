"use client";

import { useEffect, useState } from "react";
import { NEW_TO_INNGEST } from "@/components/v1/sections/TwelveDays/data";
import { copyText } from "@/components/v1/sections/TwelveDays/copyText";
import { buttonClass } from "@/components/v1/sections/TwelveDays/poster";
import { handleStartFreeClick } from "@/utils/v1/startFreeCta";
import { trackInstallCopy } from "@/utils/v1/trackInstallCopy";

/**
 * The one "get started" spot on the page, under the calendar's email
 * sign-up: copy a prompt for a coding agent to set Inngest up locally,
 * or sign up for Inngest Cloud. Replaces the "Try it free" link that
 * used to sit behind every door.
 */
export default function NewToInngest() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 4000);
    return () => window.clearTimeout(id);
  }, [copied]);

  async function copy() {
    const ok = await copyText(NEW_TO_INNGEST.prompt);
    setCopied(ok);
    trackInstallCopy({
      placement: "twelve_days_calendar",
      command: "get-started-prompt",
      status: ok ? "success" : "failed",
    });
  }

  return (
    <div
      id="new-to-inngest"
      className="flex scroll-mt-24 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
    >
      <p className="font-v1Label text-[15px]">{NEW_TO_INNGEST.lead}</p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={copy}
          className={buttonClass("ghost") + " w-full sm:w-auto"}
        >
          {copied ? "Copied ✓" : NEW_TO_INNGEST.copy}
        </button>
        <a
          href={NEW_TO_INNGEST.signUp.href}
          onClick={handleStartFreeClick(NEW_TO_INNGEST.signUp.href)}
          className={buttonClass("ghost") + " w-full sm:w-auto"}
        >
          {NEW_TO_INNGEST.signUp.label}
        </a>
      </div>
      <p
        role="status"
        className="min-h-0 font-v1Label text-[13px] text-[#ECFE08] sm:basis-full"
      >
        {copied ? NEW_TO_INNGEST.copied : ""}
      </p>
    </div>
  );
}
