"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "src/components/utils/classNames";
import { analytics } from "@/utils/segment";

const CONTACT_KEY = process.env.NEXT_PUBLIC_INNGEST_KEY;

const DEBUG = process.env.NEXT_PUBLIC_HOST.match(/localhost/) ? true : false;

// Check Notion tracking plan for event names and schemas:
export const SEGMENT_EVENT_NAMES = {
  SALES_LEAD_FORM_SUBMITTED: "Sales Lead Form Submitted",
  YC_LEAD_FORM_SUBMITTED: "YC Lead Form Submitted",
};

export default function ContactForm({
  eventName,
  eventVersion,
  segmentEventName,
  button = "Send",
  redirectTo,
  className,
}: {
  eventName: string;
  eventVersion: string;
  segmentEventName: string;
  button?: string;
  redirectTo?: string;
  className?: string;
}) {
  const router = useRouter();

  // Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honeyPot, setHoneyPot] = useState("");
  const [survey, setSurvey] = useState("");
  const [ycVerificationBadgeURL, setYCVerificationBadgeURL] = useState<
    string | undefined
  >();
  const [disabled, setDisabled] = useState<boolean>(false);
  const [buttonCopy, setButtonCopy] = useState(button);

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

    if (DEBUG) {
      console.log("Debug mode enabled");
      console.log("URL ref:", ref);
      console.log("Redirect URL:", redirectTo);
    }

    try {
      await window.Inngest.event(
        {
          name: eventName,
          data: { email, name, message, survey, ref, ycVerificationBadgeURL },
          user: { email, name },
          v: eventVersion,
        },
        { key: CONTACT_KEY }
      );
      // Segment
      // NOTE - We don't yet identify as it isn't authenticated so we shouldn't over-write any existing user attributes
      analytics.track(segmentEventName, {
        email,
        name,
        message,
        survey,
        ref,
      });
      // GTM
      window.dataLayer?.push({
        event: segmentEventName,
        ref,
        survey,
      });
      if (redirectTo) {
        setButtonCopy("Redirecting to scheduling...");
        const redirectURL = new URL(redirectTo);
        // If the URL of the page has a ref param, we override the UTM source
        if (ref) {
          redirectURL.searchParams.set("utm_source", ref);
        }
        // Assume it's a Savvycal call URL
        redirectURL.searchParams.set("display_name", name);
        redirectURL.searchParams.set("email", email);

        if (DEBUG) {
          console.log(redirectURL.toString());
        }

        router.push(redirectURL.toString());
      } else {
        setButtonCopy("Your message has been sent!");
      }
    } catch (e) {
      console.warn("Message not sent", e);
      setButtonCopy("Message not sent");
      setDisabled(false);
    }
  };

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
      <label className="flex w-full flex-col gap-2">
        <span>
          How did you hear about us? <span className="text-warning">*</span>
        </span>
        <input
          type="text"
          name="survey"
          required
          onChange={(e) => setSurvey(e.target.value)}
          className="w-full rounded-md border border-muted bg-canvasBase p-3 outline-none"
        />
      </label>
      <label className="flex w-full flex-col gap-2">
        <span>What can we help you with?</span>
        <textarea
          name="message"
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-[6rem] w-full rounded-md border border-muted bg-canvasBase p-3 outline-none"
        />
      </label>

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
