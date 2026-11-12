"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { analytics } from "@/utils/segment";
import { readFirstTouch } from "src/shared/firstTouch";
import { BUILDATHON, REF } from "@/components/v1/sections/TwelveDays/data";
import { buttonClass } from "@/components/v1/sections/TwelveDays/poster";
import {
  EmailTypoHint,
  useEmailTypoCheck,
} from "@/components/v1/sections/TwelveDays/EmailTypoHint";

/** Sends the entry to Segment from the server (see the route for where it goes). */
const SUBMIT_URL = "/api/12-days/build-a-thon";

/**
 * Segment event for entries, sent by the server route (which repeats
 * this name) and pushed to GTM here. Segment maps this exact name to Attio
 * and Customer.io (event + person, setting
 * `twelve_days_buildathon_submitted_at`), and the "CE - 12 Days
 * Build-a-thon Submitted" trigger in GTM matches it. Rename only together
 * with those.
 */
export const SUBMITTED_EVENT = "12 Days Build-a-thon Submitted";

const SUBMITTED_KEY = "12-days-of-workflows:build-a-thon-submitted";

const FIELDS = BUILDATHON.fields;

const INPUT =
  "h-[42px] w-full min-w-0 rounded-md border-2 border-[#010101] bg-white px-4 text-[16px] text-[#010101] placeholder:text-[#010101]/40 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#0035F1]";

const EMPTY = {
  name: "",
  email: "",
  company: "",
  linkedin: "",
  vercel: "",
  github: "",
  description: "",
};

type Entry = typeof EMPTY;

function Field({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-v1Label text-[13px] text-[#010101]">
        {label}
      </label>
      {children}
      {hint && (
        <p id={`${id}-hint`} className="text-[14px] text-[#010101]/70">
          {hint}
        </p>
      )}
    </div>
  );
}

/**
 * The build-a-thon entry form. The entry goes to /api/12-days/build-a-thon,
 * which sends `12 Days Build-a-thon Submitted` to Segment (Segment → Attio
 * posts it to Slack). Track only, no identify, so a
 * typed-in email never overwrites an existing person's attributes.
 * Remembered in this browser so a return visit shows the confirmation
 * instead of an empty form.
 */
export default function BuildathonForm() {
  const [entry, setEntry] = useState<Entry>(EMPTY);
  // Hidden from people; bots that fill every field set it.
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">(
    "idle"
  );

  useEffect(() => {
    try {
      if (window.localStorage.getItem(SUBMITTED_KEY)) setStatus("sent");
    } catch {
      // Blocked storage: show the form.
    }
  }, []);

  const set = (key: keyof Entry) => (value: string) =>
    setEntry((e) => ({ ...e, [key]: value }));
  const typo = useEmailTypoCheck(entry.email, set("email"));
  // The server's reason when it turns an entry down (a 400), if any.
  const [rejected, setRejected] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setRejected(null);
    if (!typo.okToSend()) {
      document.getElementById("buildathon-email")?.focus();
      return;
    }
    setStatus("sending");

    let ref = "";
    try {
      ref = new URLSearchParams(window.location.search).get("ref") ?? "";
    } catch {
      // noop
    }
    const firstTouch = readFirstTouch();

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

    // The server sends the Segment event, so it isn't tracked here too.
    try {
      const res = await fetch(SUBMIT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...entry,
          website: honeypot,
          ref,
          campaign: REF,
          firstTouch,
          anonymousId,
        }),
      });
      if (res.status === 400) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        setRejected(data?.error ?? null);
      }
      if (!res.ok) throw new Error(`Submit failed: ${res.status}`);
    } catch (err) {
      console.warn("12 Days build-a-thon entry not sent", err);
      setStatus("failed");
      return;
    }

    window.dataLayer?.push({ event: SUBMITTED_EVENT, ref });

    try {
      window.localStorage.setItem(SUBMITTED_KEY, "1");
    } catch {
      // Still submitted; the form just shows again next visit.
    }
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <p
        role="status"
        className="rounded-xl border-[3px] border-[#010101] bg-[#0BDD48] p-6 font-v1Label text-[16px] leading-[1.4] text-[#010101] shadow-[8px_8px_0_#010101]"
      >
        {BUILDATHON.sent}
      </p>
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
        <label htmlFor="buildathon-website">Website</label>
        <input
          id="buildathon-website"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field id="buildathon-name" label={FIELDS.name}>
          <input
            id="buildathon-name"
            required
            autoComplete="name"
            value={entry.name}
            onChange={(e) => set("name")(e.target.value)}
            className={INPUT}
          />
        </Field>
        <Field id="buildathon-email" label={FIELDS.email}>
          <input
            id="buildathon-email"
            type="email"
            required
            autoComplete="email"
            aria-invalid={typo.problem ? true : undefined}
            aria-describedby={
              typo.problem ? "buildathon-email-typo" : undefined
            }
            value={entry.email}
            onChange={(e) => set("email")(e.target.value)}
            placeholder="you@company.com"
            className={INPUT}
          />
          <EmailTypoHint
            id="buildathon-email-typo"
            problem={typo.problem}
            onApplySuggestion={typo.applySuggestion}
            className="text-[#010101]"
          />
        </Field>
        <Field id="buildathon-company" label={FIELDS.company}>
          <input
            id="buildathon-company"
            required
            autoComplete="organization"
            value={entry.company}
            onChange={(e) => set("company")(e.target.value)}
            className={INPUT}
          />
        </Field>
        <Field
          id="buildathon-linkedin"
          label={FIELDS.linkedin}
          hint={FIELDS.linkedinHint}
        >
          <input
            id="buildathon-linkedin"
            type="url"
            required
            pattern="https:\/\/(www\.)?linkedin\.com\/.+"
            title="A linkedin.com link, like https://www.linkedin.com/in/your-name"
            aria-describedby="buildathon-linkedin-hint"
            value={entry.linkedin}
            onChange={(e) => set("linkedin")(e.target.value)}
            placeholder="https://www.linkedin.com/in/your-name"
            className={INPUT}
          />
        </Field>
      </div>

      <Field id="buildathon-vercel" label={FIELDS.vercel}>
        <input
          id="buildathon-vercel"
          type="url"
          required
          pattern="https:\/\/.+"
          value={entry.vercel}
          onChange={(e) => set("vercel")(e.target.value)}
          placeholder="https://your-weird-workflow.vercel.app"
          className={INPUT}
        />
      </Field>
      <Field id="buildathon-github" label={FIELDS.github}>
        <input
          id="buildathon-github"
          type="url"
          required
          pattern="https:\/\/(www\.)?github\.com\/[^\/]+\/[^\/]+.*"
          title="A GitHub repo link, like https://github.com/you/your-repo"
          value={entry.github}
          onChange={(e) => set("github")(e.target.value)}
          placeholder="https://github.com/you/your-weird-workflow"
          className={INPUT}
        />
      </Field>
      <Field
        id="buildathon-description"
        label={FIELDS.description}
        hint={FIELDS.descriptionHint}
      >
        <textarea
          id="buildathon-description"
          required
          rows={4}
          maxLength={500}
          aria-describedby="buildathon-description-hint"
          value={entry.description}
          onChange={(e) => set("description")(e.target.value)}
          className={INPUT + " h-auto py-3"}
        />
      </Field>

      <label className="flex items-start gap-3 text-[16px] text-[#010101]">
        <input
          type="checkbox"
          required
          className="mt-1 h-5 w-5 shrink-0 accent-[#010101]"
        />
        {FIELDS.confirm}
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={status === "sending"}
          className={buttonClass("ink") + " w-full sm:w-auto"}
        >
          {status === "sending" ? BUILDATHON.sending : BUILDATHON.button}
        </button>
        {status === "failed" && (
          <p role="alert" className="font-v1Label text-[12px] text-[#F55C50]">
            {rejected ?? BUILDATHON.failed}
          </p>
        )}
      </div>
    </form>
  );
}
