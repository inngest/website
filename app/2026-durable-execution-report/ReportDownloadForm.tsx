"use client";

import {
  Suspense,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { useSearchParams } from "next/navigation";

import {
  REPORT_GRAPHS,
  REPORT_PATH,
  REPORT_LANDING_PATH,
  type ReportGraphId,
} from "./graphs";

const REPORT_FILENAME = "inngest-2026-durable-execution-benchmark-report.pdf";
const REPORT_ID = "2026-durable-execution-benchmark";

// TODO: replace this placeholder with the shared <ContentDownloadForm> from
// marketing's branch (Segment → Customer.io → Attio). The wrapper's submitted
// state below is the post-submit UI that should remain after the swap, so the
// integration only needs to call setSubmitted(true) on success.

function ReportDownloadFormInner() {
  const searchParams = useSearchParams();
  const utm = collectUtm(searchParams);

  const [submitted, setSubmitted] = useState(false);
  const downloadAnchorRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    if (submitted && downloadAnchorRef.current) {
      downloadAnchorRef.current.click();
    }
  }, [submitted]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    // eslint-disable-next-line no-console
    console.log("[ReportDownloadForm] placeholder submit", {
      reportId: REPORT_ID,
      fields: Object.fromEntries(formData.entries()),
      utm,
    });
    setSubmitted(true);
  };

  return (
    <div className="rounded-2xl bg-canvasBase/95 p-8 shadow-xl ring-1 ring-white/10 backdrop-blur md:p-10">
      <a
        ref={downloadAnchorRef}
        href={REPORT_PATH}
        download={REPORT_FILENAME}
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
      >
        Download report
      </a>

      {submitted ? <SubmittedPanel /> : <FormPanel onSubmit={onSubmit} />}
    </div>
  );
}

function FormPanel({
  onSubmit,
}: {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div>
        <h2 className="font-whyteInktrap text-3xl font-semibold text-basis">
          Read the Report
        </h2>
        <p className="mt-1 text-sm text-subtle">It's free.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field name="firstName" label="First name" required />
        <Field name="lastName" label="Last name" required />
      </div>

      <Field name="email" label="Work email" type="email" required />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field name="jobTitle" label="Job title" />
        <Field name="company" label="Company" />
      </div>

      <label className="flex items-start gap-3 text-sm text-subtle">
        <input
          type="checkbox"
          name="emailOptIn"
          defaultChecked
          className="mt-1 h-4 w-4 rounded border-muted bg-transparent accent-[rgb(var(--color-matcha-400))]"
        />
        <span>Email me occasional Inngest research and product updates.</span>
      </label>

      <p className="text-xs text-muted">
        By submitting this form, you are sharing your information with Inngest
        and agree to our{" "}
        <a className="underline hover:text-basis" href="/privacy?ref=2026-durable-execution-report">
          Privacy Policy
        </a>
        .
      </p>

      <button
        type="submit"
        className="group inline-flex items-center justify-center gap-2 rounded-md bg-cta px-6 py-3 text-sm font-medium text-carbon-1000 transition-all hover:bg-ctaHover"
      >
        Submit
        <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
          →
        </span>
      </button>
    </form>
  );
}

function SubmittedPanel() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-[rgb(var(--color-matcha-400))]">
          Thanks for downloading
        </p>
        <h2 className="mt-2 font-whyteInktrap text-3xl font-semibold text-basis">
          Your report is ready.
        </h2>
        <p className="mt-2 text-sm text-subtle">
          The download should start automatically. If it doesn't, use the button
          below.
        </p>
      </div>

      <a
        href={REPORT_PATH}
        download={REPORT_FILENAME}
        className="group inline-flex items-center justify-center gap-2 rounded-md bg-cta px-6 py-3 text-sm font-medium text-carbon-1000 transition-all hover:bg-ctaHover"
      >
        Download the report (PDF)
        <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
          ↓
        </span>
      </a>

      <div className="border-t border-subtle pt-6">
        <p className="text-sm font-medium text-basis">Share key findings</p>
        <p className="mt-1 text-xs text-subtle">
          Each link previews a specific finding from the report on social.
        </p>
        <ul className="mt-4 flex flex-col gap-2">
          {(Object.keys(REPORT_GRAPHS) as ReportGraphId[]).map((id) => {
            const graph = REPORT_GRAPHS[id];
            const shareUrl = `${REPORT_LANDING_PATH}/share/${id}`;
            return (
              <li
                key={id}
                className="flex flex-col gap-2 rounded-lg border border-subtle bg-surfaceSubtle/40 p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="pr-2 text-sm text-basis">{graph.title}</span>
                <span className="flex shrink-0 gap-2">
                  <ShareLink network="twitter" url={shareUrl} text={graph.shareText} />
                  <ShareLink network="linkedin" url={shareUrl} text={graph.shareText} />
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function Field({
  name,
  label,
  type = "text",
  required = false,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-subtle">
        {label}
        {required && <span className="ml-0.5 text-[rgb(var(--color-matcha-400))]">*</span>}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        autoCapitalize="off"
        autoCorrect="off"
        className="rounded-md border border-muted bg-transparent px-3 py-2 text-sm text-basis placeholder:text-muted focus:border-transparent focus:outline-none focus:ring-1 focus:ring-[rgb(var(--color-border-success))]"
        placeholder=" "
      />
    </label>
  );
}

function ShareLink({
  network,
  url,
  text,
}: {
  network: "twitter" | "linkedin";
  url: string;
  text: string;
}) {
  const absoluteUrl = `${
    process.env.NEXT_PUBLIC_HOST ?? "https://www.inngest.com"
  }${url}`;
  const href =
    network === "twitter"
      ? `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          absoluteUrl
        )}&text=${encodeURIComponent(text)}`
      : `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          absoluteUrl
        )}`;
  const label = network === "twitter" ? "Share on X" : "Share on LinkedIn";
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={label}
      title={label}
      className="inline-flex h-8 items-center justify-center rounded-md border border-subtle px-3 text-xs font-medium text-basis transition-colors hover:bg-surfaceSubtle"
    >
      {network === "twitter" ? "X" : "in"}
    </a>
  );
}

function collectUtm(searchParams: { get: (key: string) => string | null }) {
  const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
  return Object.fromEntries(
    keys.map((k) => [k, searchParams.get(k) ?? undefined])
  );
}

export default function ReportDownloadForm() {
  return (
    <Suspense>
      <ReportDownloadFormInner />
    </Suspense>
  );
}
