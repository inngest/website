"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "src/components/utils/classNames";
import { analytics } from "@/utils/segment";
import { readFirstTouch } from "src/shared/firstTouch";
import { FORM_TYPE } from "src/components/ContactForm.constants";

// Re-export FORM_TYPE so existing imports of `FORM_TYPE` from this file keep
// working during the migration. New code should import directly from
// `src/components/ContactForm.constants` to avoid the Server Component
// resolution bug (where importing constants from a "use client" module can
// resolve to undefined at render time).
export { FORM_TYPE } from "src/components/ContactForm.constants";

const CONTACT_KEY = process.env.NEXT_PUBLIC_INNGEST_KEY;

const DEBUG = process.env.NEXT_PUBLIC_HOST.match(/localhost/) ? true : false;

// Use plain string keys (not computed property keys) so the lookup is
// resilient to module-init ordering and HMR. Keys must match FORM_TYPE values.
const GTM_EVENT_NAMES: Record<string, string> = {
  sales_lead: "Sales Lead Form Submitted",
  yc_lead: "YC Lead Form Submitted",
  content_download: "Content Download Form Submitted",
};

// Per-form-type Segment event names. Mirrors GTM_EVENT_NAMES so analytics
// schemas stay consistent across platforms.
//
// Conservative migration: only content_download is mapped today so we don't
// silently change Amplitude/Customer.io behavior for the existing sales_lead
// and yc_lead flows. Unknown/unmapped form types fall back to the legacy
// generic "Form Submitted" name. As part of the FORM_TYPE refactor cleanup,
// add sales_lead and yc_lead here once downstream destinations are ready.
const SEGMENT_EVENT_NAMES: Record<string, string> = {
  content_download: "Content Download Form Submitted",
};

export default function ContactForm({
  eventName,
  eventVersion,
  formType,
  button = "Send",
  redirectTo,
  asset,
  successMessage,
  messageLabel,
  surveyLabel,
  className,
}: {
  eventName: string;
  eventVersion: string;
  formType: string;
  button?: string;
  redirectTo?: string;
  /**
   * Slug or identifier for the asset being downloaded (only relevant for
   * CONTENT_DOWNLOAD forms). Lifted into the event payload so the downstream
   * Inngest function knows which asset to deliver.
   */
  asset?: string;
  /**
   * Inline success message rendered when there's no redirect (e.g. content
   * download flow). Falls back to a generic copy if not provided.
   */
  successMessage?: string;
  /** Override the "What can we help you with?" textarea label. */
  messageLabel?: string;
  /** Override the "How did you hear about us?" input label. */
  surveyLabel?: string;
  className?: string;
}) {
  const router = useRouter();

  // Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honeyPot, setHoneyPot] = useState("");
  const [survey, setSurvey] = useState("");
  // Content-download–only fields. Stay empty (and excluded from the payload)
  // for any other form type.
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [ycVerificationBadgeURL, setYCVerificationBadgeURL] = useState<
    string | undefined
  >();
  const [disabled, setDisabled] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [buttonCopy, setButtonCopy] = useState(button);

  const isContentDownload = formType === FORM_TYPE.CONTENT_DOWNLOAD;

  const doesMentionSoc2 =
    message.match(/soc 2/i) ||
    message.match(/soc2/i) ||
    message.match(/security/i) ||
    message.match(/compliance/i);

  const onSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);
    setButtonCopy("Sending...");

    // honey pot for bots - if the website field is not empty, we don't send the message
    const field = e.target.website;
    if (honeyPot?.length > 0 || field?.value?.length > 0) {
      setButtonCopy("Message not sent");
      setDisabled(false);
      return;
    }

    const spamScore = calculateSpamScore(name, message, survey, email);

    if (DEBUG) {
      console.log("Spam score:", spamScore);
    }

    // Reject if score is too high
    if (spamScore >= 3) {
      setButtonCopy("Message not sent");
      setDisabled(false);
      return;
    }

    let ref = "";
    try {
      const u = new URLSearchParams(window.location.search);
      if (u.get("ref")) {
        ref = u.get("ref") || "";
      }
    } catch (err) {
      // noop
      if (DEBUG) {
        console.error(err);
      }
    }

    // Pull first-touch attribution from the cookie (set on the visitor's
    // first landing). Used to recover UTMs on submissions that came in via
    // static CTAs which strip query params.
    const firstTouch = readFirstTouch();

    if (DEBUG) {
      console.log("Debug mode enabled");
      console.log("URL ref:", ref);
      console.log("Redirect URL:", redirectTo);
      console.log("First touch:", firstTouch);
      console.log("Asset:", asset);
    }

    try {
      await window.Inngest.event(
        {
          name: eventName,
          data: {
            email,
            name,
            message,
            survey,
            ref,
            ycVerificationBadgeURL,
            // Content download asset slug (only set for CONTENT_DOWNLOAD forms).
            ...(asset ? { asset } : {}),
            // Content download extra fields — only present on this form type.
            ...(isContentDownload ? { company, job_title: jobTitle } : {}),
            // First-touch attribution (lifted to top-level for easy querying).
            // Null when the cookie wasn't set or couldn't be read.
            ...(firstTouch || {}),
          },
          user: { email, name },
          v: eventVersion,
        },
        { key: CONTACT_KEY }
      );
      // Segment
      // NOTE - We don't yet identify as it isn't authenticated so we shouldn't over-write any existing user attributes
      const segmentEventName = SEGMENT_EVENT_NAMES[formType] || 'Form Submitted';
      analytics.track(segmentEventName, {
        email,
        form_type: formType,
        name,
        how_did_you_hear_about_us: survey,
        what_can_we_help_you_with: message,
        form_source: 'website',
        ref,
        ...(asset ? { asset } : {}),
        ...(isContentDownload ? { company, job_title: jobTitle } : {}),
        ...(firstTouch || {}),
      });
      // This will happen async, so we don't want them to leave the website
      // GTM
      window.dataLayer?.push({
        event: GTM_EVENT_NAMES[formType],
        ref,
        survey,
        ...(asset ? { asset } : {}),
        ...(isContentDownload ? { company, job_title: jobTitle } : {}),
        ...(firstTouch || {}),
      });
      if (redirectTo) {
        const redirectURL = new URL(redirectTo);
        // If the URL of the page has a ref param, we override the UTM source
        if (ref) {
          redirectURL.searchParams.set("utm_source", ref);
        }

        if (isContentDownload) {
          // Content download: redirect in the SAME tab to the interactive
          // report page. The email-with-PDF is delivered separately by the
          // downstream `content-download-handler` Inngest function — we don't
          // need to await anything here, the event has already been fired.
          // We don't append SavvyCal-style display_name/email params.
          setButtonCopy("Redirecting to the report...");
          if (DEBUG) {
            console.log(redirectURL.toString());
          }
          // Brief delay so Segment + GTM beacon requests can flush before
          // the navigation cancels them. The Inngest event was already
          // awaited above so it's guaranteed delivered.
          setTimeout(() => {
            window.location.href = redirectURL.toString();
          }, 300);
        } else {
          // Existing sales/YC flow — open SavvyCal in a new tab, prefill
          // display_name + email so the calendar is ready to book.
          setButtonCopy("Redirecting to scheduling...");
          redirectURL.searchParams.set("display_name", name);
          redirectURL.searchParams.set("email", email);

          if (DEBUG) {
            console.log(redirectURL.toString());
          }

          // Open a new tab. We need tracking to flush/complete so we open a new tab
          window.open(redirectURL.toString(), "_blank");
          setButtonCopy("Your message has been sent!");
        }
      } else {
        // No redirect → show inline success state (e.g. content download flow).
        setSubmitted(true);
        setButtonCopy("Your message has been sent!");
      }
    } catch (e) {
      console.warn("Message not sent", e);
      setButtonCopy("Message not sent");
      setDisabled(false);
    }
  };

  if (submitted) {
    return (
      <div
        className={cn(
          "flex flex-col items-start gap-4 rounded-lg border border-subtle bg-surfaceSubtle p-4 sm:p-6",
          className
        )}
      >
        <h2 className="text-xl font-semibold text-white">
          {isContentDownload ? "You're all set" : "Thanks — we got it"}
        </h2>
        <p className="text-basis">
          {successMessage ||
            (isContentDownload
              ? "Your report is ready! You'll also receive an email with a download link shortly."
              : "Thanks for reaching out. We'll be in touch shortly.")}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "flex flex-col items-start gap-4 rounded-lg border border-subtle bg-surfaceSubtle p-4 sm:p-6",
        className
      )}
    >
      <label className="flex w-full flex-col gap-2">
        <span>
          Your name <span className="text-warning">*</span>
        </span>
        <input
          type="text"
          name="name"
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-md border border-muted bg-canvasBase p-3 outline-none"
        />
      </label>
      <label className="flex w-full flex-col gap-2">
        <span>
          Company email <span className="text-warning">*</span>
        </span>
        <input
          type="email"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-md border border-muted bg-canvasBase p-3 outline-none"
        />
      </label>
      {/* honey pot */}
      <label htmlFor="website" style={{ display: "none" }}>
        <input
          type="text"
          id="website"
          name="website"
          onChange={(e) => setHoneyPot(e.target.value)}
        />
      </label>
      {eventName === "website/yc-deal.submitted" && (
        <label className="flex w-full flex-col gap-2">
          <span>
            YC Verification Badge URL <span className="text-warning">*</span>{" "}
            <a
              className="ml-1 text-xs text-blue-300 underline"
              target="_blank"
              href="https://bookface.ycombinator.com/verify"
            >
              Get your YC verification badge
            </a>
          </span>
          <input
            type="text"
            name="yc_verification_badge_url"
            required
            onChange={(e) => setYCVerificationBadgeURL(e.target.value)}
            className="w-full rounded-md border border-muted bg-canvasBase p-3 outline-none"
          />
        </label>
      )}
      {!isContentDownload && (
        <label className="flex w-full flex-col gap-2">
          <span>
            {surveyLabel || "How did you hear about us?"}{" "}
            <span className="text-warning">*</span>
          </span>
          <input
            type="text"
            name="survey"
            required
            onChange={(e) => setSurvey(e.target.value)}
            className="w-full rounded-md border border-muted bg-canvasBase p-3 outline-none"
          />
        </label>
      )}
      {!isContentDownload && (
        <label className="flex w-full flex-col gap-2">
          <span>{messageLabel || "What can we help you with?"}</span>
          <textarea
            name="message"
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[6rem] w-full rounded-md border border-muted bg-canvasBase p-3 outline-none"
          />
        </label>
      )}

      {doesMentionSoc2 && (
        <div className="w-full rounded-lg border border-subtle p-2 px-4 py-2">
          <p>
            Need a SOC2 report?{" "}
            <a
              href="https://trust.inngest.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-link hover:underline"
            >
              Request one here
            </a>
            .
          </p>
        </div>
      )}

      {/* <label className="w-full flex flex-col gap-2">
        What's the size of your engineering team?
        <select
          name="teamSize"
          defaultValue=""
          required
          onChange={(e) => setTeamSize(e.target.value)}
          className="px-3 py-3 bg-canvasBase border border-muted outline-none rounded-md"
        >
          <option value="" disabled>
            Select an option
          </option>
          <option value="2-9">2-9</option>
          <option value="10-30">10-30</option>
          <option value="30-99">30-99</option>
          <option value="100+">100+</option>
        </select>
      </label> */}
      <div className="mt-4 flex w-full flex-row justify-items-end">
        <button
          type="submit"
          disabled={disabled}
          className={`group button inline-flex items-center justify-center gap-0.5 rounded-lg bg-cta px-10 py-2.5 text-base font-medium font-medium tracking-tight text-carbon-1000 transition-all hover:bg-ctaHover ${
            disabled ? "opacity-50" : ""
          }`}
        >
          {buttonCopy}
        </button>
      </div>
    </form>
  );
}

// Spam detection - calculate spam score based on multiple signals
function isGibberish(str: string): boolean {
  if (!str || str.length < 8) return false;
  const letters = str.replace(/[^a-zA-Z]/g, "").toLowerCase();
  if (letters.length < 6) return false;
  const vowels = letters.replace(/[^aeiou]/g, "").length;
  const vowelRatio = vowels / letters.length;
  // Real text typically has 30-45% vowels; gibberish often has <20%
  if (vowelRatio < 0.2) return true;
  // Single long words with low-ish vowels are likely spam
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
  return personalDomains.includes(domain);
}

/**
 * Spam detection - calculate spam score based on multiple signals, returns a number between 0 and 7
 * 0 = not spam
 * 3 = likely spam
 * 7 = definitely spam
 */
function calculateSpamScore(
  name: string,
  message: string,
  survey: string,
  email: string
): number {
  let score = 0;
  if (isGibberish(name)) score += 2;
  if (isGibberish(message)) score += 2;
  if (isGibberish(survey)) score += 2;
  if (isPersonalEmail(email)) score += 1;
  return score;
}
