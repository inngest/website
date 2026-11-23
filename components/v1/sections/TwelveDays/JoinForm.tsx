"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { analytics } from "@/utils/segment";
import { readFirstTouch } from "src/shared/firstTouch";
import { getPageRef } from "@/utils/v1/refHandoff";
import {
  prizeFor,
  RAFFLE,
  REF,
  SIGNUP,
} from "@/components/v1/sections/TwelveDays/data";
import { buttonClass } from "@/components/v1/sections/TwelveDays/poster";
import {
  EmailTypoHint,
  useEmailTypoCheck,
} from "@/components/v1/sections/TwelveDays/EmailTypoHint";
import {
  markSubscribed,
  saveDetails,
  saveEntry,
  useRaffleState,
  useSubscribed,
} from "@/components/v1/sections/TwelveDays/useRaffle";

/**
 * The sign-up's Segment event is "12 Days Signup Form Submitted", sent by
 * the server: the signup route (email only, `form_type:
 * "12_days_of_workflows"`) or the raffle route (`"12_days_raffle"`). It
 * has its own name, like the content download and contact sales forms,
 * because the Customer.io - Website destination maps it by this exact
 * name: one mapping records the event and another creates the person
 * from `properties.email` (setting `twelve_days_subscribed_at`). Rename
 * only together with those Segment mappings and both routes.
 */
export const FORM_TYPE = "12_days_of_workflows";

/**
 * Google Tag Manager event, kept separate so GTM can tell it apart. The
 * "CE - 12 Days Subscribed" trigger in GTM matches this exact name.
 */
export const SUBSCRIBED_EVENT = "12 Days Subscribed";

/** Sent by the raffle route (which repeats it) and pushed to GTM here. */
export const RAFFLE_EVENT = "12 Days Raffle Entered";

const RAFFLE_URL = "/api/12-days/raffle";

/** Email-only sign-ups, sent to Segment from the server. */
const SIGNUP_URL = "/api/12-days/signup";

type Tone = "dark" | "yellow";

const INPUT =
  "h-[42px] w-full min-w-0 rounded-md border-2 border-[#020202] bg-white px-4 text-[16px] text-[#020202] placeholder:text-[#020202]/50 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2";

/**
 * The page's one sign-up form, used in the calendar and in the raffle
 * pop-up so there's a single thing to fill in.
 *
 * - No raffle open (before December 7, after the 18th): email only. A
 *   `12 Days Signup Form Submitted` track call from the browser, as
 *   before; Customer.io sends the daily door emails.
 * - A day's raffle open: name and email. The raffle route records the
 *   entry and sends the same sign-up event server-side, so one submit
 *   does both.
 * - Signed up but not in today's raffle: a one-click entry with the
 *   saved details.
 * - Done for today: the "You're on the list" callout.
 */
export default function JoinForm({
  day,
  tone,
  id,
  onLeave,
  onClose,
}: {
  /** The day whose raffle is open, or null. */
  day: number | null;
  /** The background it sits on. */
  tone: Tone;
  /** Prefix for input ids (two copies can be on the page). */
  id: string;
  /** In the pop-up: the account link closes it before jumping. */
  onLeave?: () => void;
  /** In the pop-up: a Close button on the confirmation. */
  onClose?: () => void;
}) {
  const saved = useRaffleState();
  const subscribed = useSubscribed();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "failed">("idle");
  const [rejected, setRejected] = useState<string | null>(null);
  const typo = useEmailTypoCheck(email, setEmail);

  // Prefill from the last sign-up in this browser.
  useEffect(() => {
    setName((n) => n || saved.name);
    setEmail((e) => e || saved.email);
  }, [saved.name, saved.email]);

  const raffle = day !== null;
  const entered = raffle && saved.days.includes(day);
  const done = subscribed && (!raffle || entered);
  const quick =
    raffle && subscribed && !entered && !editing && saved.name && saved.email;
  const light = tone === "yellow";
  const focus = light
    ? "focus-visible:outline-[#020202]"
    : "focus-visible:outline-[#F7DA10]";
  const note = light ? "text-[#020202]" : "text-[#F7DA10]";

  async function send(n: string, em: string) {
    setRejected(null);
    setStatus("sending");

    // The URL's ?ref= or, for a tagged internal link, its click handoff.
    const ref = getPageRef()?.ref ?? "";

    try {
      if (raffle) await enterRaffle(day, n, em, honeypot, ref, setRejected);
      else await subscribe(em, honeypot, ref, setRejected);
    } catch (err) {
      console.warn("12 Days sign-up not sent", err);
      setStatus("failed");
      return;
    }

    window.dataLayer?.push({ event: SUBSCRIBED_EVENT, ref });
    if (raffle) {
      window.dataLayer?.push({ event: RAFFLE_EVENT, day, ref });
      saveEntry(day, n, em);
    } else {
      saveDetails(n, em);
    }
    markSubscribed();
    setEditing(false);
    setStatus("idle");
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!typo.okToSend()) {
      document.getElementById(`${id}-email`)?.focus();
      return;
    }
    void send(name.trim(), email.trim());
  }

  if (done) {
    return (
      <div className="flex w-full max-w-[620px] flex-col gap-4">
        <div
          role="status"
          className={
            "flex w-full items-center gap-3 rounded-xl border-[3px] border-[#020202] px-4 py-3 text-[#020202] shadow-[6px_6px_0_#020202] " +
            (light ? "bg-white" : "bg-[#F7DA10]")
          }
        >
          <span
            aria-hidden="true"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#020202] text-[16px] font-black text-[#F7DA10]"
          >
            ✓
          </span>
          {/* One line where it fits: the bold heading, then the note. */}
          <p className="leading-[1.3]">
            <span className="font-sans text-[20px] font-black tracking-[-0.01em]">
              {SIGNUP.sent}
            </span>{" "}
            <span className="ml-1.5 font-v1Label text-[14px]">
              {entered ? SIGNUP.enteredBody(day) : SIGNUP.sentBody}
            </span>
          </p>
        </div>
        <a
          href={SIGNUP.next.href}
          onClick={onLeave}
          className={`inline-flex items-center gap-2 self-start font-v1Label text-[14px] underline underline-offset-4 hover:no-underline ${note}`}
        >
          {SIGNUP.next.label}{" "}
          {/* The arrow nudges right a few times when the confirmation
              appears, then rests. Transform only; still with reduced
              motion. */}
          <span
            aria-hidden="true"
            className="inline-block motion-safe:animate-nudge-right"
          >
            →
          </span>
        </a>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className={buttonClass("ink") + " self-start"}
          >
            {RAFFLE.dialog.close}
          </button>
        )}
      </div>
    );
  }

  const failed = status === "failed" && (
    <p role="alert" className={`font-v1Label text-[12px] ${note}`}>
      {rejected ?? SIGNUP.failed}
    </p>
  );

  const finePrint = raffle && (
    <div
      className={`flex flex-col gap-1 font-v1Label text-[12px] ${
        light ? "text-[#020202]/70" : "text-white/80"
      }`}
    >
      <p>
        {RAFFLE.rules.lead}{" "}
        <Link
          href={RAFFLE.rules.href}
          className="underline underline-offset-4 hover:no-underline"
        >
          {RAFFLE.rules.label}
        </Link>
      </p>
      {onLeave && (
        <p>
          {SIGNUP.account.lead}{" "}
          <a
            href={SIGNUP.account.href}
            onClick={onLeave}
            className="underline underline-offset-4 hover:no-underline"
          >
            {SIGNUP.account.label}
          </a>
        </p>
      )}
    </div>
  );

  // On the calendar, name today's prize (the pop-up has its own card).
  const prize = raffle && !light ? prizeFor(day) : undefined;
  const prizeLine = prize && (
    <p className="font-v1Label text-[14px] text-[#F7DA10]">
      {RAFFLE.todaysPrize}: {prize.prize}
    </p>
  );

  if (quick) {
    return (
      <div className="flex w-full max-w-[620px] flex-col gap-3">
        {prizeLine}
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <button
            type="button"
            disabled={status === "sending"}
            onClick={() => void send(saved.name, saved.email)}
            className={
              buttonClass(light ? "ink" : "yellow") + " w-full sm:w-auto"
            }
          >
            {status === "sending" ? SIGNUP.sending : SIGNUP.quick(saved.name)}
          </button>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className={`font-v1Label text-[13px] underline underline-offset-4 hover:no-underline ${note}`}
          >
            {SIGNUP.notYou}
          </button>
          {failed}
        </div>
        {finePrint}
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-[620px] flex-col gap-3">
      {prizeLine}
      <form
        onSubmit={handleSubmit}
        className={
          "flex w-full flex-col gap-3 " +
          (raffle && light ? "" : "sm:flex-row sm:flex-wrap")
        }
      >
        <div
          aria-hidden="true"
          className="absolute -left-[9999px] h-px w-px overflow-hidden"
        >
          <label htmlFor={`${id}-website`}>Website</label>
          <input
            id={`${id}-website`}
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>
        {raffle && (
          <>
            <label htmlFor={`${id}-name`} className="sr-only">
              {SIGNUP.name}
            </label>
            <input
              id={`${id}-name`}
              required
              maxLength={300}
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={SIGNUP.namePlaceholder}
              className={`${INPUT} ${focus} sm:flex-1`}
            />
          </>
        )}
        <label htmlFor={`${id}-email`} className="sr-only">
          {SIGNUP.label}
        </label>
        <input
          id={`${id}-email`}
          type="email"
          required
          maxLength={300}
          autoComplete="email"
          aria-invalid={typo.problem ? true : undefined}
          aria-describedby={typo.problem ? `${id}-email-typo` : undefined}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={SIGNUP.placeholder}
          className={`${INPUT} ${focus} sm:flex-1`}
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className={
            // On the dark calendar: a white outline before the raffle opens
            // (ink on ink disappeared; yellow competed with the doors), and
            // yellow while a raffle is open, as before. Ink on the yellow
            // pop-up.
            buttonClass(light ? "ink" : raffle ? "yellow" : "ghost") +
            (raffle && light ? " w-full sm:w-auto sm:self-start" : "")
          }
        >
          {status === "sending"
            ? SIGNUP.sending
            : raffle
            ? SIGNUP.raffleButton
            : SIGNUP.button}
        </button>
        {failed}
      </form>
      <EmailTypoHint
        id={`${id}-email-typo`}
        problem={typo.problem}
        onApplySuggestion={typo.applySuggestion}
        className={note}
      />
      {finePrint}
    </div>
  );
}

/**
 * The browser's Segment ID, so the server's events join this visitor's
 * page views. Blocked or slow analytics just means no ID.
 */
async function browserAnonymousId(): Promise<string | null> {
  try {
    const user = await Promise.race([
      analytics.user(),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 1500)),
    ]);
    return user?.anonymousId() ?? null;
  } catch {
    return null;
  }
}

/**
 * Email only, through the signup route, which sends the same sign-up
 * event the browser used to, from the server so an ad blocker can't
 * drop it.
 */
async function subscribe(
  email: string,
  honeypot: string,
  ref: string,
  onRejected: (message: string | null) => void
) {
  const res = await fetch(SIGNUP_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      website: honeypot,
      ref,
      campaign: REF,
      firstTouch: readFirstTouch(),
      anonymousId: await browserAnonymousId(),
    }),
  });
  if (res.status === 400) {
    const data = (await res.json().catch(() => null)) as {
      error?: string;
    } | null;
    onRejected(data?.error ?? null);
  }
  if (!res.ok) throw new Error(`Sign-up failed: ${res.status}`);
}

/**
 * Raffle entry through the server route, which also sends the sign-up
 * event (and writes the sheet row).
 */
async function enterRaffle(
  day: number,
  name: string,
  email: string,
  honeypot: string,
  ref: string,
  onRejected: (message: string | null) => void
) {
  const anonymousId = await browserAnonymousId();

  const res = await fetch(RAFFLE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      day,
      name,
      email,
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
    onRejected(data?.error ?? null);
  }
  if (!res.ok) throw new Error(`Raffle entry failed: ${res.status}`);
}
