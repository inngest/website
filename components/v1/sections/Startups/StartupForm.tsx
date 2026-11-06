"use client";

import { useState, type FormEvent } from "react";
import Button from "@/components/v1/Button";
import { SelectField, TextField, TextareaField } from "@/components/v1/forms";
import { SIGN_UP_URL } from "@/components/v1/nav-config";
import { analytics } from "@/utils/segment";
import { calculateSpamScore } from "@/utils/v1/contactSubmit";
import { appendRef } from "@/utils/v1/ref";
import { readFirstTouch } from "src/shared/firstTouch";
import { FORM_TYPE } from "src/components/ContactForm.constants";
import {
  FOUNDED_OPTIONS,
  FUNDING_STAGE_OPTIONS,
  HEADCOUNT_OPTIONS,
  TOTAL_RAISED_OPTIONS,
  ineligibilityReasons,
} from "./program";

// Modeled on `YCForm` (same honeypot, spam scoring, analytics/GTM
// pattern), with the YC badge field swapped for the Startup Program
// eligibility questions. Sends its own event so the downstream handler
// (Stripe review + Attio) can route startup leads separately from YC.
const EVENT_NAME = "website/startup-program.submitted";
const EVENT_VERSION = "2026-11-02.1";
const GTM_EVENT_NAME = "Startup Program Form Submitted";
const CONTACT_KEY = process.env.NEXT_PUBLIC_INNGEST_KEY;
const DEBUG = process.env.NEXT_PUBLIC_HOST?.match(/localhost/) ? true : false;

type Status = "idle" | "sending" | "sent" | "rejected";

export default function StartupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [accountEmail, setAccountEmail] = useState("");
  const [foundedYear, setFoundedYear] = useState("");
  const [headcount, setHeadcount] = useState("");
  const [fundingStage, setFundingStage] = useState("");
  const [totalRaised, setTotalRaised] = useState("");
  const [investor, setInvestor] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [crunchbaseUrl, setCrunchbaseUrl] = useState("");
  const [survey, setSurvey] = useState("");
  const [message, setMessage] = useState("");
  const [honeyPot, setHoneyPot] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const isBootstrapped = fundingStage === "bootstrapped";
  const raised = isBootstrapped ? "" : totalRaised;
  const reasons = ineligibilityReasons({
    foundedYear,
    headcount,
    fundingStage,
    totalRaised: raised,
  });
  const isIneligible = reasons.length > 0;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending" || status === "sent" || isIneligible) return;
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

    const application = {
      company,
      website,
      accountEmail,
      foundedYear,
      headcount,
      fundingStage,
      totalRaised: raised,
      investor,
      linkedinUrl,
      crunchbaseUrl,
    };

    try {
      await window.Inngest.event(
        {
          name: EVENT_NAME,
          data: {
            email,
            name,
            message,
            survey,
            ref,
            ...application,
            ...(firstTouch || {}),
          },
          user: { email, name },
          v: EVENT_VERSION,
        },
        { key: CONTACT_KEY }
      );

      // Segment (no identify — unauthenticated submission). Company fields
      // are included so an Attio destination mapping can key off
      // `form_type: "startup_lead"`.
      analytics.track("Form Submitted", {
        email,
        form_type: FORM_TYPE.STARTUP_LEAD_FORM,
        name,
        how_did_you_hear_about_us: survey,
        what_can_we_help_you_with: message,
        form_source: "website",
        ref,
        submitted_company_name: company,
        company_website: website,
        inngest_account_email: accountEmail,
        founded_year: foundedYear,
        headcount,
        funding_stage: fundingStage,
        total_raised: raised,
        investor_or_accelerator: investor,
        linkedin_url: linkedinUrl,
        crunchbase_url: crunchbaseUrl,
        ...(firstTouch || {}),
      });

      // GTM
      window.dataLayer?.push({
        event: GTM_EVENT_NAME,
        ref,
        survey,
        ...(firstTouch || {}),
      });

      setStatus("sent");
    } catch (err) {
      console.warn("Application not sent", err);
      setStatus("rejected");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col gap-4 rounded-[4px] border border-v1-steel/35 bg-v1-surfaceBase p-6">
        <h2 className="text-v1-heading-sm text-v1-frost">
          Thanks, we got your application
        </h2>
        <p className="text-v1-body-sm-loose text-v1-frost/70">
          Our team will review it against the program criteria and email you at{" "}
          {email} once there&apos;s a decision.
        </p>
      </div>
    );
  }

  // Same denser sizing as the YC form card.
  const fieldClassName = "h-[38px] text-[14px]";
  const labelClassName = "text-v1-body-sm-loose";
  const hintLinkClassName =
    "ml-1 font-v1Body text-[12px] normal-case text-v1-frost/70 underline hover:text-v1-frost";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-5">
        <TextField
          id="startup-name"
          label="Your name"
          required
          value={name}
          onChange={setName}
          autoComplete="name"
          className={fieldClassName}
          labelClassName={labelClassName}
        />

        <TextField
          id="startup-email"
          type="email"
          label="Company email"
          required
          value={email}
          onChange={setEmail}
          autoComplete="email"
          className={fieldClassName}
          labelClassName={labelClassName}
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <TextField
            id="startup-company"
            label="Company name"
            required
            value={company}
            onChange={setCompany}
            autoComplete="organization"
            className={fieldClassName}
            labelClassName={labelClassName}
          />

          <TextField
            id="startup-website"
            type="url"
            label="Company website"
            required
            placeholder="https://"
            value={website}
            onChange={setWebsite}
            autoComplete="url"
            className={fieldClassName}
            labelClassName={labelClassName}
          />
        </div>

        <TextField
          id="startup-account-email"
          type="email"
          label={
            <>
              Inngest account email{" "}
              <a
                className={hintLinkClassName}
                target="_blank"
                rel="noopener noreferrer"
                href={appendRef(SIGN_UP_URL, "startups-form")}
              >
                No account yet? Sign up free
              </a>
            </>
          }
          required
          value={accountEmail}
          onChange={setAccountEmail}
          className={fieldClassName}
          labelClassName={labelClassName}
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <SelectField
            id="startup-founded"
            label="Year founded"
            required
            value={foundedYear}
            onChange={setFoundedYear}
            options={FOUNDED_OPTIONS}
            className={fieldClassName}
            labelClassName={labelClassName}
          />

          <SelectField
            id="startup-headcount"
            label="Employees"
            required
            value={headcount}
            onChange={setHeadcount}
            options={HEADCOUNT_OPTIONS}
            className={fieldClassName}
            labelClassName={labelClassName}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <SelectField
            id="startup-funding-stage"
            label="Funding"
            required
            value={fundingStage}
            onChange={setFundingStage}
            options={FUNDING_STAGE_OPTIONS}
            className={fieldClassName}
            labelClassName={labelClassName}
          />

          {!isBootstrapped && (
            <SelectField
              id="startup-total-raised"
              label="Total raised"
              required
              value={totalRaised}
              onChange={setTotalRaised}
              options={TOTAL_RAISED_OPTIONS}
              className={fieldClassName}
              labelClassName={labelClassName}
            />
          )}
        </div>

        {!isBootstrapped && (
          <TextField
            id="startup-investor"
            label="Lead investor or accelerator (optional)"
            value={investor}
            onChange={setInvestor}
            className={fieldClassName}
            labelClassName={labelClassName}
          />
        )}

        <TextField
          id="startup-linkedin"
          type="url"
          label="LinkedIn company page"
          required
          placeholder="https://www.linkedin.com/company/..."
          value={linkedinUrl}
          onChange={setLinkedinUrl}
          className={fieldClassName}
          labelClassName={labelClassName}
        />

        <TextField
          id="startup-crunchbase"
          type="url"
          label="Crunchbase page (optional)"
          placeholder="https://"
          value={crunchbaseUrl}
          onChange={setCrunchbaseUrl}
          className={fieldClassName}
          labelClassName={labelClassName}
        />

        <TextField
          id="startup-survey"
          label="How did you hear about us?"
          required
          value={survey}
          onChange={setSurvey}
          className={fieldClassName}
          labelClassName={labelClassName}
        />

        <TextareaField
          id="startup-message"
          label="What are you building with Inngest?"
          value={message}
          onChange={setMessage}
          rows={3}
          className="text-[14px]"
          labelClassName={labelClassName}
        />
      </div>

      {isIneligible && (
        <div
          role="status"
          className="flex flex-col gap-2 rounded-[4px] border border-v1-steel/35 p-4"
        >
          <p className="text-v1-body-sm-loose text-v1-frost">
            Based on your answers, your company is outside the Startup Program
            criteria.
          </p>
          <ul className="text-v1-body-sm-loose list-disc pl-5 text-v1-frost/70">
            {reasons.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          <p className="text-v1-body-sm-loose text-v1-frost">
            <a
              href="/contact?ref=startups-form"
              className="underline hover:text-v1-frost/80"
            >
              Talk to our team
            </a>{" "}
            about a plan that fits.
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
          size="sm"
          className="!w-full sm:!w-auto"
          disabled={status === "sending" || isIneligible}
        >
          {status === "sending" ? "Sending…" : "Apply now"}
        </Button>
        {status === "rejected" && (
          <p role="alert" className="text-v1-body-sm-loose text-v1-frost/70">
            Application not sent. Please check your details and try again.
          </p>
        )}
      </div>
    </form>
  );
}
