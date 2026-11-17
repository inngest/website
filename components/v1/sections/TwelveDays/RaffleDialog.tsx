"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { analytics } from "@/utils/segment";
import { readFirstTouch } from "src/shared/firstTouch";
import {
  prizeFor,
  RAFFLE,
  REF,
} from "@/components/v1/sections/TwelveDays/data";
import PrizeSticker from "@/components/v1/sections/TwelveDays/PrizeSticker";
import {
  EmailTypoHint,
  useEmailTypoCheck,
} from "@/components/v1/sections/TwelveDays/EmailTypoHint";
import { SUBSCRIBED_EVENT } from "@/components/v1/sections/TwelveDays/EmailSignup";
import { buttonClass } from "@/components/v1/sections/TwelveDays/poster";
import {
  saveEntry,
  useRaffleOpenRequests,
  useRaffleState,
} from "@/components/v1/sections/TwelveDays/useRaffle";

const SUBMIT_URL = "/api/12-days/raffle";

/** Sent by the server route (which repeats it) and pushed to GTM here. */
export const RAFFLE_EVENT = "12 Days Raffle Entered";

/** The email sign-up's flag, so its form shows "on the list" next visit. */
const SUBSCRIBED_KEY = "12-days-of-workflows:subscribed";

const INPUT =
  "h-[42px] w-full min-w-0 rounded-md border-2 border-[#010101] bg-white px-4 text-[16px] text-[#010101] placeholder:text-[#010101]/40 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#0035F1]";

/**
 * The daily raffle pop-up. Mounted once on the page; opened by
 * `openRaffle(day)` from today's door or the raffle section. A native
 * modal <dialog>, so focus stays inside and Escape closes it.
 */
export default function RaffleDialog() {
  const ref = useRef<HTMLDialogElement>(null);
  const saved = useRaffleState();
  const [day, setDay] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">(
    "idle"
  );
  const [rejected, setRejected] = useState<string | null>(null);
  const typo = useEmailTypoCheck(email, setEmail);
  const copy = RAFFLE.dialog;

  useRaffleOpenRequests((d) => {
    setDay(d);
    setRejected(null);
    setStatus(saved.days.includes(d) ? "sent" : "idle");
    // Day two onward: the details from last time, ready to send.
    setName((n) => n || saved.name);
    setEmail((e) => e || saved.email);
    if (!ref.current?.open) ref.current?.showModal();
  });

  // Clicking the backdrop (the dialog element itself) closes it.
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const onClick = (e: MouseEvent) => {
      if (e.target === dialog) dialog.close();
    };
    dialog.addEventListener("click", onClick);
    return () => dialog.removeEventListener("click", onClick);
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (day === null) return;
    setRejected(null);
    if (!typo.okToSend()) {
      document.getElementById("raffle-email")?.focus();
      return;
    }
    setStatus("sending");

    let refTag = "";
    try {
      refTag = new URLSearchParams(window.location.search).get("ref") ?? "";
    } catch {
      // noop
    }

    // The browser's Segment ID, so the server's events join this
    // visitor's page views. Blocked or slow analytics just means no ID.
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
          day,
          name: name.trim(),
          email: email.trim(),
          website: honeypot,
          ref: refTag,
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
      if (!res.ok) throw new Error(`Raffle entry failed: ${res.status}`);
    } catch (err) {
      console.warn("12 Days raffle entry not sent", err);
      setStatus("failed");
      return;
    }

    window.dataLayer?.push({ event: RAFFLE_EVENT, day, ref: refTag });
    // Entering also subscribes them, so GTM's sign-up trigger fires too.
    window.dataLayer?.push({ event: SUBSCRIBED_EVENT, ref: refTag });
    saveEntry(day, name.trim(), email.trim());
    try {
      window.localStorage.setItem(SUBSCRIBED_KEY, "1");
    } catch {
      // noop
    }
    setStatus("sent");
  }

  return (
    <dialog
      ref={ref}
      aria-labelledby="raffle-title"
      className="m-auto w-[calc(100%-32px)] max-w-[480px] overflow-visible rounded-xl border-[3px] border-[#010101] bg-[#ECFE08] p-0 text-[#010101] shadow-[8px_8px_0_#010101] backdrop:bg-[#010101]/60"
    >
      <div className="relative flex flex-col gap-5 p-6 sm:p-8">
        <button
          type="button"
          onClick={() => ref.current?.close()}
          aria-label={copy.close}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-md border-2 border-[#010101] bg-white text-[18px] leading-none hover:bg-[#010101] hover:text-white focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#0035F1]"
        >
          <span aria-hidden="true">×</span>
        </button>

        <div className="flex flex-col gap-2 pr-10">
          <p className="font-v1Label text-[13px]">{RAFFLE.eyebrow}</p>
          <h2
            id="raffle-title"
            className="font-sans text-[32px] font-black leading-[1] tracking-[-0.02em]"
          >
            {day !== null ? copy.title(day) : RAFFLE.eyebrow}
          </h2>
        </div>

        {status === "sent" && day !== null ? (
          <div role="status" className="flex flex-col gap-4">
            <p className="text-[18px] leading-[26px]">{copy.sent(day)}</p>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              className={buttonClass("ink") + " self-start"}
            >
              {copy.close}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {day !== null && prizeFor(day) && (
              <div className="flex items-center gap-4 rounded-lg border-2 border-[#010101] bg-[#010101] p-3 text-white">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center">
                  <PrizeSticker prize={prizeFor(day)!} size={48} glow />
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="font-v1Label text-[12px] text-[#ECFE08]">
                    {RAFFLE.todaysPrize}
                  </span>
                  <span className="font-sans text-[18px] font-black leading-[1.15]">
                    {prizeFor(day)!.prize}
                  </span>
                </span>
              </div>
            )}
            <p className="text-[16px] leading-[24px]">{copy.body}</p>
            <div
              aria-hidden="true"
              className="absolute -left-[9999px] h-px w-px overflow-hidden"
            >
              <label htmlFor="raffle-website">Website</label>
              <input
                id="raffle-website"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="raffle-name" className="font-v1Label text-[13px]">
                {copy.name}
              </label>
              <input
                id="raffle-name"
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
                htmlFor="raffle-email"
                className="font-v1Label text-[13px]"
              >
                {copy.email}
              </label>
              <input
                id="raffle-email"
                type="email"
                required
                maxLength={300}
                autoComplete="email"
                aria-invalid={typo.problem ? true : undefined}
                aria-describedby={
                  typo.problem ? "raffle-email-typo" : undefined
                }
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className={INPUT}
              />
              <EmailTypoHint
                id="raffle-email-typo"
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
                <p role="alert" className="font-v1Label text-[12px]">
                  {rejected ?? copy.failed}
                </p>
              )}
            </div>
            <p className="font-v1Label text-[12px] text-[#010101]/70">
              {RAFFLE.rules.lead}{" "}
              <Link
                href={RAFFLE.rules.href}
                className="underline underline-offset-4 hover:no-underline"
              >
                {RAFFLE.rules.label}
              </Link>
            </p>
          </form>
        )}
      </div>
    </dialog>
  );
}
