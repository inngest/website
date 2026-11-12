"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { analytics } from "@/utils/segment";
import { readFirstTouch } from "src/shared/firstTouch";
import { LIVESTREAM, REF } from "@/components/v1/sections/TwelveDays/data";
import { buttonClass } from "@/components/v1/sections/TwelveDays/poster";
import {
  EmailTypoHint,
  useEmailTypoCheck,
} from "@/components/v1/sections/TwelveDays/EmailTypoHint";

/** Sends the registration to Segment from the server. */
const SUBMIT_URL = "/api/12-days/livestream";

/**
 * Segment event for registrations, sent by the server route (which
 * repeats this name) and pushed to GTM here. Needs a Segment mapping to
 * Customer.io before the reminder emails can go out.
 */
export const REGISTERED_EVENT = "12 Days Livestream Registered";

const REGISTERED_KEY = "12-days-of-workflows:livestream-registered";

const INPUT =
  "h-[42px] w-full min-w-0 rounded-md border-2 border-[#010101] bg-white px-4 text-[16px] text-[#010101] placeholder:text-[#010101]/40 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#0035F1]";

/**
 * Name and email for the finale livestream. Track only, no identify, like
 * the other 12 Days forms. Remembered in this browser, so a return visit
 * shows the confirmation instead of the form.
 */
export default function LivestreamForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">(
    "idle"
  );
  const [rejected, setRejected] = useState<string | null>(null);
  const typo = useEmailTypoCheck(email, setEmail);
  const copy = LIVESTREAM.form;

  useEffect(() => {
    try {
      if (window.localStorage.getItem(REGISTERED_KEY)) setStatus("sent");
    } catch {
      // Blocked storage: show the form.
    }
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setRejected(null);
    if (!typo.okToSend()) {
      document.getElementById("livestream-email")?.focus();
      return;
    }
    setStatus("sending");

    let ref = "";
    try {
      ref = new URLSearchParams(window.location.search).get("ref") ?? "";
    } catch {
      // noop
    }

    // The browser's Segment ID, so the server's event joins this visitor's
    // page views. A blocked or slow analytics client just means no ID.
    let anonymousId: string | null = null;
    try {
      const user = await Promise.race([
        analytics.user(),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 1500)),
      ]);
      anonymousId = user?.anonymousId() ?? null;
    } catch {
      // noop
    }

    try {
      const res = await fetch(SUBMIT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          website: honeypot,
          ref,
          campaign: REF,
          firstTouch: readFirstTouch(),
          anonymousId,
        }),
      });
      if (res.status === 400) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        setRejected(data?.error ?? null);
      }
      if (!res.ok) throw new Error(`Register failed: ${res.status}`);
    } catch (err) {
      console.warn("12 Days livestream registration not sent", err);
      setStatus("failed");
      return;
    }

    window.dataLayer?.push({ event: REGISTERED_EVENT, ref });
    try {
      window.localStorage.setItem(REGISTERED_KEY, "1");
    } catch {
      // Still registered; the form just shows again next visit.
    }
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div
        role="status"
        className="flex flex-col gap-3 rounded-xl border-[3px] border-[#010101] bg-[#0BDD48] p-6 text-[#010101] shadow-[8px_8px_0_#010101]"
      >
        <p className="font-v1Label text-[16px] leading-[1.4]">{copy.sent}</p>
        <Link
          href={LIVESTREAM.watch.href}
          className="self-start font-v1Label text-[14px] underline underline-offset-4 hover:no-underline"
        >
          {LIVESTREAM.watch.label} <span aria-hidden="true">→</span>
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex flex-col gap-5 rounded-xl border-[3px] border-[#010101] bg-[#FBF0A8] p-6 shadow-[8px_8px_0_#010101] sm:p-8"
    >
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-px w-px overflow-hidden"
      >
        <label htmlFor="livestream-website">Website</label>
        <input
          id="livestream-website"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="livestream-name"
          className="font-v1Label text-[13px] text-[#010101]"
        >
          {copy.name}
        </label>
        <input
          id="livestream-name"
          required
          maxLength={300}
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={INPUT}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="livestream-email"
          className="font-v1Label text-[13px] text-[#010101]"
        >
          {copy.email}
        </label>
        <input
          id="livestream-email"
          type="email"
          required
          maxLength={300}
          autoComplete="email"
          aria-invalid={typo.problem ? true : undefined}
          aria-describedby={typo.problem ? "livestream-email-typo" : undefined}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className={INPUT}
        />
        <EmailTypoHint
          id="livestream-email-typo"
          problem={typo.problem}
          onApplySuggestion={typo.applySuggestion}
          className="text-[#010101]"
        />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={status === "sending"}
          className={buttonClass("ink") + " w-full sm:w-auto"}
        >
          {status === "sending" ? copy.sending : copy.button}
        </button>
        {status === "failed" && (
          <p role="alert" className="font-v1Label text-[12px] text-[#F55C50]">
            {rejected ?? copy.failed}
          </p>
        )}
      </div>
    </form>
  );
}
