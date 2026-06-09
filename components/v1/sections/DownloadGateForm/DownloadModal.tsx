"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Button from "@/components/v1/Button";
import Modal from "@/components/v1/Modal";
import { TextField } from "@/components/v1/forms";
import { submitContactForm, FORM_TYPE } from "@/utils/v1/contactSubmit";

export default function DownloadModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  // Once the form posts, swap it for a confirmation panel (rather than
  // just closing the modal) so the user gets explicit acknowledgement
  // the request went through.
  const [submitted, setSubmitted] = useState(false);

  // Reset to the form on every open so a prior submission's confirmation
  // doesn't persist into the next open. Switching back to DownloadForm
  // also remounts it, clearing its fields. Resetting on open (not close)
  // avoids flashing the form back in behind the close transition.
  useEffect(() => {
    if (open) setSubmitted(false);
  }, [open]);

  return (
    <Modal open={open} onClose={onClose} label="Download Content">
      <div
        style={{
          borderColor: "rgb(var(--color-v1-carbon-300) / 0.35)",
          backgroundImage:
            "linear-gradient(225deg, #212121 0%, #020202 100%)",
        }}
        className="rounded-md border p-8 text-v1-frost shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] sm:p-10"
      >
        {submitted ? (
          <DownloadConfirmation onClose={onClose} />
        ) : (
          <DownloadForm onCancel={onClose} onSuccess={() => setSubmitted(true)} />
        )}
      </div>
    </Modal>
  );
}

// Post-submit acknowledgement shown in place of the form. role="status"
// announces it to screen readers, and focus moves to the heading so
// keyboard/SR users land in the new content instead of losing focus when
// the form (and its focused submit button) unmounts.
function DownloadConfirmation({ onClose }: { onClose: () => void }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div
      role="status"
      className="flex flex-col items-center gap-6 py-4 text-center sm:py-6"
    >
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="font-v1Heading v1-cap-trim text-[28px] leading-[1.2] tracking-[-0.01em] outline-none sm:text-[32px]"
      >
        Download request received.
      </h2>
      <p className="max-w-[380px] text-v1-body-sm-loose text-v1-frost">
        Your request has been successfully submitted, and a confirmation
        email with download instructions will be sent to you shortly.
      </p>
      <Button
        type="button"
        variant="accent"
        onClick={onClose}
        className="mt-2 !w-full sm:!w-auto"
      >
        Close
      </Button>
    </div>
  );
}

function DownloadForm({
  onCancel,
  onSuccess,
}: {
  onCancel: () => void;
  onSuccess: () => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [referral, setReferral] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "rejected">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    // Files the request through the shared contact pipeline as a
    // CONTENT_DOWNLOAD lead; on success the parent swaps in the
    // confirmation panel, whose copy promises the follow-up email. Job
    // title rides along in `message` (the submission shape has no field
    // for it).
    const result = await submitContactForm({
      name: `${firstName} ${lastName}`.trim(),
      email,
      message: jobTitle ? `Job title: ${jobTitle}` : "",
      survey: referral,
      company,
      formType: FORM_TYPE.CONTENT_DOWNLOAD,
      honeypot: website,
    });
    if (!result.ok) {
      setStatus("rejected");
      return;
    }
    onSuccess();
  }

  return (
    <>
      <h2 className="font-v1Heading v1-cap-trim text-[28px] leading-[1.2] tracking-[-0.01em] sm:text-[32px]">
        Download Content
      </h2>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <TextField
            id="dl-first"
            label="First Name"
            required
            value={firstName}
            onChange={setFirstName}
            placeholder="Enter your first name"
            autoComplete="given-name"
          />
          <TextField
            id="dl-last"
            label="Last Name"
            required
            value={lastName}
            onChange={setLastName}
            placeholder="Enter your last name"
            autoComplete="family-name"
          />
        </div>
        <TextField
          id="dl-email"
          type="email"
          label="Work Email Address"
          required
          value={email}
          onChange={setEmail}
          placeholder="Enter your email address"
          autoComplete="email"
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <TextField
            id="dl-company"
            label="Company (optional)"
            value={company}
            onChange={setCompany}
            placeholder="Enter company name"
            autoComplete="organization"
          />
          <TextField
            id="dl-title"
            label="Job Title"
            required
            value={jobTitle}
            onChange={setJobTitle}
            placeholder="Enter your job title"
            autoComplete="organization-title"
          />
        </div>
        <TextField
          id="dl-ref"
          label="How did you hear about us? (optional)"
          value={referral}
          onChange={setReferral}
          placeholder="Social media, Google, referral, etc"
        />

        {/* Honeypot — bots fill hidden fields; a non-empty value is
            rejected as spam. Kept out of the tab order and a11y tree. */}
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

        <div className="mt-2 flex flex-col-reverse items-stretch gap-4 sm:flex-row sm:items-center sm:justify-end sm:gap-6">
          <button
            type="button"
            onClick={onCancel}
            className="font-v1Label text-[12px] font-semibold uppercase tracking-[0.1em] text-v1-frost/80 motion-safe:transition-colors hover:text-v1-frost"
          >
            Cancel
          </button>
          <Button
            type="submit"
            variant="accent"
            className="!w-full sm:!w-auto"
            disabled={status === "sending"}
          >
            {status === "sending" ? "Sending…" : "Download"}
          </Button>
        </div>
        {status === "rejected" && (
          <p role="alert" className="text-v1-body-sm-loose text-v1-frost/70">
            We couldn&apos;t submit that. Please check your details and try
            again.
          </p>
        )}
      </form>
    </>
  );
}
