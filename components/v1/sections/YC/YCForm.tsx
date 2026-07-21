"use client";

import { useState, type FormEvent } from "react";
import Button from "@/components/v1/Button";
import { TextField, TextareaField } from "@/components/v1/forms";
import { analytics } from "@/utils/segment";
import { readFirstTouch } from "src/shared/firstTouch";
import { FORM_TYPE } from "src/components/ContactForm.constants";

// Same submission contract as the legacy `ContactForm` (event name/version,
// FORM_TYPE, spam scoring, honeypot, analytics/GTM) — this is a visual-only
// port to the v1 field components. Kept as its own component (rather than
// reusing `ContactForm`) so this page's styling doesn't ripple into the
// other legacy pages still using that shared component
// (`/landing/ai`, `/landing/durable-workflows`).
const EVENT_NAME = "website/yc-deal.submitted";
const EVENT_VERSION = "2025-11-06.1";
const CONTACT_KEY = process.env.NEXT_PUBLIC_INNGEST_KEY;
const DEBUG = process.env.NEXT_PUBLIC_HOST?.match(/localhost/) ? true : false;

function isGibberish(str: string): boolean {
  if (!str || str.length < 8) return false;
  const letters = str.replace(/[^a-zA-Z]/g, "").toLowerCase();
  if (letters.length < 6) return false;
  const vowels = letters.replace(/[^aeiou]/g, "").length;
  const vowelRatio = vowels / letters.length;
  if (vowelRatio < 0.2) return true;
  const words = str.trim().split(/\s+/);
  if (words.length === 1 && letters.length > 10 && vowelRatio < 0.3) {
    return true;
  }
  return false;
}

function isPersonalEmail(emailAddress: string): boolean {
  const personalDomains = [
    "gmail.com",
    "hotmail.com",
    "outlook.com",
    "yahoo.com",
    "aol.com",
    "icloud.com",
    "live.com",
    "msn.com",
    "mail.com",
    "proton.me",
    "protonmail.com",
  ];
  const domain = emailAddress.split("@")[1]?.toLowerCase();
  return personalDomains.includes(domain ?? "");
}

function calculateSpamScore(
  name: string,
  message: string,
  survey: string,
  email: string,
): number {
  let score = 0;
  if (isGibberish(name)) score += 2;
  if (isGibberish(message)) score += 2;
  if (isGibberish(survey)) score += 2;
  if (isPersonalEmail(email)) score += 1;
  return score;
}

type Status = "idle" | "sending" | "sent" | "rejected";

export default function YCForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [ycVerificationBadgeURL, setYCVerificationBadgeURL] = useState("");
  const [survey, setSurvey] = useState("");
  const [message, setMessage] = useState("");
  const [honeyPot, setHoneyPot] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const doesMentionSoc2 =
    message.match(/soc ?2/i) ||
    message.match(/security/i) ||
    message.match(/compliance/i);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending" || status === "sent") return;
    setStatus("sending");

    if (honeyPot.length > 0) {
      setStatus("rejected");
      return;
    }

    const spamScore = calculateSpamScore(name, message, survey, email);
    if (DEBUG) console.log("Spam score:", spamScore);
    if (spamScore >= 3) {
      setStatus("rejected");
      return;
    }

    let ref = "";
    try {
      ref = new URLSearchParams(window.location.search).get("ref") ?? "";
    } catch {
      // noop
    }
    const firstTouch = readFirstTouch();

    try {
      await window.Inngest?.event(
        {
          name: EVENT_NAME,
          data: {
            email,
            name,
            message,
            survey,
            ref,
            ycVerificationBadgeURL,
            ...(firstTouch || {}),
          },
          user: { email, name },
          v: EVENT_VERSION,
        },
        { key: CONTACT_KEY },
      );

      // Segment (no identify — unauthenticated submission).
      analytics.track("Form Submitted", {
        email,
        form_type: FORM_TYPE.YC_LEAD_FORM,
        name,
        how_did_you_hear_about_us: survey,
        what_can_we_help_you_with: message,
        form_source: "website",
        ref,
        ...(firstTouch || {}),
      });

      // GTM
      window.dataLayer?.push({
        event: "YC Lead Form Submitted",
        ref,
        survey,
        ...(firstTouch || {}),
      });

      setStatus("sent");
    } catch (err) {
      console.warn("Message not sent", err);
      setStatus("rejected");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col gap-4 rounded-[4px] border border-v1-steel/35 bg-v1-surfaceBase p-6">
        <h2 className="text-v1-heading-sm text-v1-frost">Thanks — we got it</h2>
        <p className="text-v1-body-sm-loose text-v1-frost/70">
          We&apos;ll be in touch shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-[28px]">
        <TextField
          id="yc-name"
          label="Your name"
          required
          value={name}
          onChange={setName}
          autoComplete="name"
        />

        <TextField
          id="yc-email"
          type="email"
          label="Company email"
          required
          value={email}
          onChange={setEmail}
          autoComplete="email"
        />

        <TextField
          id="yc-verification"
          label={
            <>
              YC Verification Badge URL{" "}
              <a
                className="ml-1 font-v1Body text-[13px] normal-case text-v1-frost/70 underline hover:text-v1-frost"
                target="_blank"
                rel="noopener noreferrer"
                href="https://bookface.ycombinator.com/verify"
              >
                Get your YC verification badge
              </a>
            </>
          }
          required
          value={ycVerificationBadgeURL}
          onChange={setYCVerificationBadgeURL}
        />

        <TextField
          id="yc-survey"
          label="How did you hear about us?"
          required
          value={survey}
          onChange={setSurvey}
        />

        <TextareaField
          id="yc-message"
          label="What can we help you with?"
          value={message}
          onChange={setMessage}
        />
      </div>

      {doesMentionSoc2 && (
        <div className="rounded-[4px] border border-v1-steel/35 p-4">
          <p className="text-v1-body-sm-loose text-v1-frost">
            Need a SOC2 report?{" "}
            <a
              href="https://trust.inngest.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-v1-frost/80"
            >
              Request one here
            </a>
            .
          </p>
        </div>
      )}

      {/* Honeypot — bots fill hidden fields; a non-empty value is rejected
          client-side as spam. Kept out of the tab order and a11y tree. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={honeyPot}
        onChange={(e) => setHoneyPot(e.target.value)}
        className="hidden"
      />

      <div className="flex flex-col gap-3">
        <Button
          type="submit"
          variant="accent"
          className="!w-full sm:!w-auto"
          disabled={status === "sending"}
        >
          {status === "sending" ? "Sending…" : "Request the YC Deal"}
        </Button>
        {status === "rejected" && (
          <p role="alert" className="text-v1-body-sm-loose text-v1-frost/70">
            Message not sent. Please check your details and try again.
          </p>
        )}
      </div>
    </form>
  );
}
