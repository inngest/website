"use client";

import { useState, type FormEvent } from "react";
// interest is fixed to "sales" — radio buttons removed per design update
import Button from "@/components/v1/Button";
import {
  TextField,
  TextareaField,
  type Interest,
} from "@/components/v1/forms";
import {
  submitContactForm,
  openSchedulingRedirect,
} from "@/utils/v1/contactSubmit";

type SubmitStatus = "idle" | "sending" | "sent" | "rejected";

export default function SalesForm() {
  // Defaults the "Sales & Product Questions" option to selected.
  const [interest, setInterest] = useState<Interest>("sales");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [referral, setReferral] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending" || status === "sent") return;
    setStatus("sending");
    const result = await submitContactForm({
      name: `${firstName} ${lastName}`.trim(),
      email,
      message,
      survey: referral,
      company,
      interest,
      honeypot: website,
    });
    if (!result.ok) {
      setStatus("rejected");
      return;
    }
    if (interest === "sales") {
      openSchedulingRedirect(`${firstName} ${lastName}`.trim(), email);
    }
    setStatus("sent");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 lg:justify-center lg:pl-[70px] lg:pr-[140px] lg:pt-[44px]"
    >
      {/* px-24 is the column inset — desktop only, so the fields
          stay flush with the section padding on mobile. */}
      <div className="flex flex-col gap-[44px] lg:px-6">
        <div className="grid grid-cols-1 gap-[20px] sm:grid-cols-2">
          <TextField
            id="firstName"
            label="First Name"
            required
            placeholder="Enter your first name"
            value={firstName}
            onChange={setFirstName}
            autoComplete="given-name"
          />
          <TextField
            id="lastName"
            label="Last Name"
            required
            placeholder="Enter your last name"
            value={lastName}
            onChange={setLastName}
            autoComplete="family-name"
          />
        </div>

        <TextField
          id="email"
          type="email"
          label="Work Email Address"
          required
          placeholder="Enter your email address"
          value={email}
          onChange={setEmail}
          autoComplete="email"
        />

        <TextField
          id="company"
          label="Company"
          placeholder="Enter company name"
          value={company}
          onChange={setCompany}
          autoComplete="organization"
        />

        <TextField
          id="referral"
          label="How did you hear about us?"
          placeholder="Social media, Google, referral, etc"
          value={referral}
          onChange={setReferral}
        />

        <TextareaField
          id="message"
          label="Message"
          required
          placeholder="How can we help?"
          value={message}
          onChange={setMessage}
        />
      </div>

      {/* Honeypot — bots fill hidden fields; a non-empty value is rejected
          server-side as spam. Kept out of the tab order and a11y tree. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="hidden"
      />

      <div className="flex flex-col gap-3 sm:items-end">
        <Button
          type="submit"
          variant="accent"
          className="!w-full sm:!w-auto"
          disabled={status === "sending" || status === "sent"}
        >
          {status === "sending"
            ? "Sending…"
            : status === "sent"
              ? "Sent ✓"
              : "Send →"}
        </Button>
        {status === "sent" && (
          <p
            role="status"
            className="text-v1-body-sm-loose text-v1-frost"
          >
            Thanks — your message is on its way. We typically respond
            within 24 hours.
          </p>
        )}
        {status === "rejected" && (
          <p
            role="alert"
            className="text-v1-body-sm-loose text-v1-frost/70"
          >
            We couldn&apos;t send that. Please check your details and try
            again.
          </p>
        )}
      </div>
    </form>
  );
}
