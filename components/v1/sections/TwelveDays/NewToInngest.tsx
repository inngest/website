"use client";

import { useEffect, useState } from "react";
import {
  COURSE_REPO,
  NEW_TO_INNGEST,
} from "@/components/v1/sections/TwelveDays/data";
import { copyText } from "@/components/v1/sections/TwelveDays/copyText";
import { handleStartFreeClick } from "@/utils/v1/startFreeCta";
import { trackInstallCopy } from "@/utils/v1/trackInstallCopy";

const LINK =
  "font-v1Label text-white underline underline-offset-4 hover:text-[#F7DA10] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F7DA10]";

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
    <div id="new-to-inngest" className="flex scroll-mt-24 flex-col gap-1">
      {/* Text links, not buttons: the sign-up button above stays the
          one button in this area. */}
      <p className="font-v1Label text-[14px] leading-[1.6] text-white/80">
        {NEW_TO_INNGEST.lead}{" "}
        <button type="button" onClick={copy} className={LINK}>
          {copied ? "Copied ✓" : NEW_TO_INNGEST.copy}
        </button>
        {" · "}
        <a
          href={NEW_TO_INNGEST.signUp.href}
          onClick={handleStartFreeClick(NEW_TO_INNGEST.signUp.href)}
          className={LINK}
        >
          {NEW_TO_INNGEST.signUp.label}
        </a>
        {" · "}
        <a
          href={COURSE_REPO.href}
          target="_blank"
          rel="noopener noreferrer"
          className={LINK}
        >
          {COURSE_REPO.label} <span aria-hidden="true">↗</span>
        </a>
      </p>
      <p
        role="status"
        className="min-h-0 font-v1Label text-[13px] text-[#F7DA10]"
      >
        {copied ? NEW_TO_INNGEST.copied : ""}
      </p>
    </div>
  );
}
