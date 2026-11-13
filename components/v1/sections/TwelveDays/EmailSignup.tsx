"use client";

import { useEffect, useState, type FormEvent } from "react";
import { analytics } from "@/utils/segment";
import { readFirstTouch } from "src/shared/firstTouch";
import { REF, SIGNUP } from "@/components/v1/sections/TwelveDays/data";
import { buttonClass } from "@/components/v1/sections/TwelveDays/poster";
import {
  EmailTypoHint,
  useEmailTypoCheck,
} from "@/components/v1/sections/TwelveDays/EmailTypoHint";

/**
 * Segment event for the sign-up. Its own name, like the content download
 * and contact sales forms, because the Customer.io - Website destination
 * maps it by this exact name: one mapping records the event and another
 * creates the person from `properties.email` (setting
 * `twelve_days_subscribed_at`). The generic `Form Submitted` has no person
 * mapping, so sign-ups sent under it land in Customer.io as anonymous
 * events. Rename only together with those Segment mappings.
 */
const SEGMENT_EVENT = "12 Days Signup Form Submitted";
export const FORM_TYPE = "12_days_of_workflows";

/**
 * Google Tag Manager event, kept separate so GTM can tell it apart. The
 * "CE - 12 Days Subscribed" trigger in GTM matches this exact name.
 */
export const SUBSCRIBED_EVENT = "12 Days Subscribed";

const SUBSCRIBED_KEY = "12-days-of-workflows:subscribed";

// The track call waits for the analytics client to load, which never
// happens if it's blocked; give up after this and offer a retry.
const SEND_TIMEOUT_MS = 8000;

/**
 * "Email me each door": sends a `12 Days Signup Form Submitted` track
 * call through Segment with `form_type: "12_days_of_workflows"`.
 * Customer.io creates the person from it, builds the 12 Days segment on
 * `twelve_days_subscribed_at` and sends the daily emails.
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
  const typo = useEmailTypoCheck(email, setEmail);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(SUBSCRIBED_KEY)) setStatus("sent");
    } catch {
      // Blocked storage: show the form.
    }
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!typo.okToSend()) return;
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
        analytics.track(SEGMENT_EVENT, {
          email,
          campaign: REF,
          form_type: FORM_TYPE,
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
        className="font-v1Label text-[16px] leading-[1.3] text-[#ECFE08]"
      >
        {SIGNUP.sent}
      </p>
    );
  }

  return (
    <div className="flex w-full max-w-[620px] flex-col gap-2">
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-3 sm:flex-row"
      >
        <label htmlFor="twelve-days-email" className="sr-only">
          {SIGNUP.label}
        </label>
        <input
          id="twelve-days-email"
          type="email"
          required
          autoComplete="email"
          aria-invalid={typo.problem ? true : undefined}
          aria-describedby={typo.problem ? "twelve-days-email-typo" : undefined}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={SIGNUP.placeholder}
          className="h-[42px] min-w-0 flex-1 rounded-md border-2 border-[#010101] bg-white px-5 text-[16px] text-[#010101] placeholder:text-[#010101]/50 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#ECFE08]"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className={buttonClass("ink")}
        >
          {status === "sending" ? SIGNUP.sending : SIGNUP.button}
        </button>
        {status === "failed" && (
          <p
            role="alert"
            className="font-v1Label text-[12px] text-[#ECFE08] sm:self-center"
          >
            {SIGNUP.failed}
          </p>
        )}
      </form>
      <EmailTypoHint
        id="twelve-days-email-typo"
        problem={typo.problem}
        onApplySuggestion={typo.applySuggestion}
        className="text-[#ECFE08]"
      />
    </div>
  );
}
