import { analytics } from "@/utils/segment";
import { readFirstTouch } from "src/shared/firstTouch";

export const CONTACT_EVENT_NAME = "contact.form.sent";
export const CONTACT_EVENT_VERSION = "2023-12-12.1";

export const FORM_TYPE = {
  SALES_LEAD_FORM: "sales_lead",
  YC_LEAD_FORM: "yc_lead",
  CONTENT_DOWNLOAD: "content_download",
} as const;
export type FormType = (typeof FORM_TYPE)[keyof typeof FORM_TYPE];

const GTM_EVENT_NAMES: Partial<Record<FormType, string>> = {
  [FORM_TYPE.SALES_LEAD_FORM]: "Sales Lead Form Submitted",
  [FORM_TYPE.YC_LEAD_FORM]: "YC Lead Form Submitted",
};

export const SAVVYCAL_DEMO_URL =
  "https://savvycal.com/inngest/demo?utm_medium=website&utm_source=contact-page";

const CONTACT_KEY = process.env.NEXT_PUBLIC_INNGEST_KEY;

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

export function calculateSpamScore(
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

function readRef(): string {
  if (typeof window === "undefined") return "";
  try {
    return new URLSearchParams(window.location.search).get("ref") ?? "";
  } catch {
    return "";
  }
}

export interface ContactSubmission {
  name: string;
  email: string;
  message: string;
  survey?: string;
  company?: string;
  interest?: string;
  formType?: FormType;
  honeypot?: string;
}

export type ContactSubmitResult =
  | { ok: true }
  | { ok: false; reason: "spam" };

export async function submitContactForm(
  sub: ContactSubmission
): Promise<ContactSubmitResult> {
  const {
    name,
    email,
    message,
    survey = "",
    company = "",
    interest = "",
    formType = FORM_TYPE.SALES_LEAD_FORM,
    honeypot = "",
  } = sub;

  if (honeypot.trim().length > 0) return { ok: false, reason: "spam" };
  if (calculateSpamScore(name, message, survey, email) >= 3) {
    return { ok: false, reason: "spam" };
  }

  const ref = readRef();

  try {
    if (typeof window !== "undefined" && window.Inngest?.event) {
      await window.Inngest.event(
        {
          name: CONTACT_EVENT_NAME,
          data: { email, name, message, survey, company, interest, ref },
          user: { email, name },
          v: CONTACT_EVENT_VERSION,
        },
        { key: CONTACT_KEY }
      );
    } else if (!CONTACT_KEY) {
      console.warn(
        "[contactSubmit] NEXT_PUBLIC_INNGEST_KEY not set — event not sent."
      );
    }
  } catch (err) {
    console.warn("[contactSubmit] Inngest event failed", err);
  }

  const firstTouch = readFirstTouch();

  try {
    const isSalesLead = formType === FORM_TYPE.SALES_LEAD_FORM;
    const segmentEventName = isSalesLead
      ? "Contact Sales Form Submitted"
      : "Form Submitted";
    analytics.track(segmentEventName, {
      email,
      name,
      form_type: formType,
      how_did_you_hear_about_us: survey,
      what_can_we_help_you_with: message,
      form_source: "website",
      ref,
      // Sales-lead-specific fields for Attio / CIO destination mappings.
      ...(isSalesLead
        ? {
            lead_source: "contact_form",
            submitted_company_name: company,
          }
        : {}),
      ...(firstTouch || {}),
    });
    const gtmName = GTM_EVENT_NAMES[formType];
    if (gtmName && typeof window !== "undefined") {
      window.dataLayer?.push({ event: gtmName, ref, survey, ...(firstTouch || {}) });
    }
  } catch (err) {
    console.warn("[contactSubmit] analytics failed", err);
  }

  return { ok: true };
}

export function openSchedulingRedirect(name: string, email: string): void {
  if (typeof window === "undefined") return;
  try {
    const url = new URL(SAVVYCAL_DEMO_URL);
    const ref = readRef();
    if (ref) url.searchParams.set("utm_source", ref);
    url.searchParams.set("display_name", name);
    url.searchParams.set("email", email);
    window.open(url.toString(), "_blank");
  } catch (err) {
    console.warn("[contactSubmit] scheduling redirect failed", err);
  }
}
