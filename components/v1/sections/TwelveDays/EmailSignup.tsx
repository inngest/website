"use client";

import { useEffect, useState, type FormEvent } from "react";
import { analytics } from "@/utils/segment";
import { readFirstTouch } from "src/shared/firstTouch";
import { PRIZES, REF } from "@/components/v1/sections/TwelveDays/data";

/** Segment event Customer.io builds the 12 Days email list from. */
export const SUBSCRIBED_EVENT = "12 Days Subscribed";

const SUBSCRIBED_KEY = "12-days-of-workflows:subscribed";

// The track call waits for the analytics client to load, which never
// happens if it's blocked; give up after this and offer a retry.
const SEND_TIMEOUT_MS = 8000;

/**
 * "Email me each door": sends a `12 Days Subscribed` track call through
 * Segment, and Customer.io sends the daily emails from there.
 *
 * Track only, no identify, like the site's other unauthenticated forms:
 * an email typed into a form shouldn't overwrite an existing person's
 * attributes. Remembered in this browser so a return visit shows the
 * confirmation instead of the form.
 */
export default function EmailSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">(
    "idle"
  );

  useEffect(() => {
    try {
      if (window.localStorage.getItem(SUBSCRIBED_KEY)) setStatus("sent");
    } catch {
      // Blocked storage: show the form.
    }
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    let ref = "";
    try {
      ref = new URLSearchParams(window.location.search).get("ref") ?? "";
    } catch {
      // noop
    }
    const firstTouch = readFirstTouch();

    try {
      await Promise.race([
        analytics.track(SUBSCRIBED_EVENT, {
          email,
          campaign: REF,
          form_type: "12_days_of_workflows",
          form_source: "website",
          ref,
          ...(firstTouch || {}),
        }),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("Analytics didn't load")),
            SEND_TIMEOUT_MS
          )
        ),
      ]);
      window.dataLayer?.push({ event: SUBSCRIBED_EVENT, ref });
    } catch (err) {
      console.warn("12 Days sign-up not sent", err);
      setStatus("failed");
      return;
    }

    try {
      window.localStorage.setItem(SUBSCRIBED_KEY, "1");
    } catch {
      // Still subscribed; the form just shows again next visit.
    }
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <p
        role="status"
        className="font-v1Label text-[16px] uppercase leading-[1.3]"
      >
        {PRIZES.signup.sent}
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-[620px] flex-col gap-3 sm:flex-row"
    >
      <label htmlFor="twelve-days-email" className="sr-only">
        {PRIZES.signup.label}
      </label>
      <input
        id="twelve-days-email"
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={PRIZES.signup.placeholder}
        className="h-12 min-w-0 flex-1 rounded-full border-[3px] border-[#010101] bg-white px-5 text-[16px] text-[#010101] placeholder:text-[#010101]/50 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#0035F1]"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="h-12 shrink-0 rounded-full border-[3px] border-[#010101] bg-[#010101] px-6 font-v1Label text-[14px] uppercase text-white hover:bg-white hover:text-[#010101] disabled:opacity-60"
      >
        {status === "sending" ? PRIZES.signup.sending : PRIZES.signup.button}
      </button>
      {status === "failed" && (
        <p
          role="alert"
          className="font-v1Label text-[12px] uppercase text-[#C42A1E] sm:self-center"
        >
          {PRIZES.signup.failed}
        </p>
      )}
    </form>
  );
}
