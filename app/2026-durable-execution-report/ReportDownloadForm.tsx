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

// TODO: replace placeholder form with the shared <ContentDownloadForm> from
// marketing's branch (Segment → Customer.io → Attio). Wire its onSuccess
// callback to call setSubmitted(true) so the post-submit panel below renders.

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
    <>
      <a
        ref={downloadAnchorRef}
        href={REPORT_PATH}
        download={REPORT_FILENAME}
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
      >
        download
      </a>
      {submitted ? <SubmittedPanel /> : <FormPanel onSubmit={onSubmit} />}
    </>
  );
}

function FormPanel({
  onSubmit,
}: {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <div>
        <h2 className="font-whyteInktrap text-4xl font-semibold text-white">
          Read the Report
        </h2>
        <p className="mt-1 text-base text-white/60">It's free.</p>
      </div>

      <div className="flex flex-col gap-4">
        <Field name="name" label="Name" required />
        <Field name="email" label="Email Address" type="email" required />
        <Field name="company" label="Company" />
      </div>

      <div className="flex flex-col gap-3">
        <label className="flex cursor-pointer items-center gap-3 text-sm text-white/80">
          <input
            type="checkbox"
            name="emailOptIn"
            defaultChecked
            className="h-4 w-4 rounded border-white/20 bg-white/10 accent-[#a8ef3c]"
          />
          Email Opt-In
        </label>
        <p className="text-xs text-white/50">
          By submitting this form, you are sharing your information with Inngest
          and agree to our{" "}
          <a
            className="underline hover:text-white/80"
            href="/privacy?ref=2026-durable-execution-report"
          >
            Privacy Policy
          </a>
          .
        </p>
      </div>

      <button
        type="submit"
        className="group inline-flex items-center gap-2 self-start rounded-md bg-[#a8ef3c] px-6 py-3 text-sm font-semibold text-[#0c1f10] transition-all hover:bg-[#baf54d]"
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
        <p className="text-xs uppercase tracking-[0.2em] text-[#a8ef3c]">
          Thanks for downloading
        </p>
        <h2 className="mt-2 font-whyteInktrap text-4xl font-semibold text-white">
          Your report is ready.
        </h2>
        <p className="mt-2 text-sm text-white/60">
          The download should start automatically. Use the button below if it
          doesn't.
        </p>
      </div>

      <a
        href={REPORT_PATH}
        download={REPORT_FILENAME}
        className="group inline-flex items-center gap-2 self-start rounded-md bg-[#a8ef3c] px-6 py-3 text-sm font-semibold text-[#0c1f10] transition-all hover:bg-[#baf54d]"
      >
        Download the report (PDF)
        <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
          ↓
        </span>
      </a>

      <div className="border-t border-white/10 pt-6">
        <p className="text-sm font-medium text-white">Share key findings</p>
        <p className="mt-1 text-xs text-white/50">
          Each link shows a specific finding as the social preview.
        </p>
        <ul className="mt-4 flex flex-col gap-2">
          {(Object.keys(REPORT_GRAPHS) as ReportGraphId[]).map((id) => {
            const graph = REPORT_GRAPHS[id];
            const shareUrl = `${REPORT_LANDING_PATH}/share/${id}`;
            return (
              <li
                key={id}
                className="flex flex-col gap-2 rounded-lg border border-white/10 bg-white/5 p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="pr-2 text-xs text-white/80">{graph.title}</span>
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
      <span className="text-sm font-medium text-white/80">{label}</span>
      <input
        type={type}
        name={name}
        required={required}
        autoCapitalize="off"
        autoCorrect="off"
        className="rounded-md border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-transparent focus:outline-none focus:ring-1 focus:ring-[#a8ef3c]"
        placeholder="Placeholder text"
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
      className="inline-flex h-8 items-center justify-center rounded-md border border-white/15 px-3 text-xs font-medium text-white/70 transition-colors hover:border-white/30 hover:text-white"
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
