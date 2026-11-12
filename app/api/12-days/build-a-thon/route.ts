import { NextResponse } from "next/server";
import {
  BAD_DOMAIN,
  domainTakesMail,
  firstTouch,
  sendToSegment,
  str,
} from "@/app/api/12-days/shared";

export const runtime = "nodejs";

/**
 * Build-a-thon entries from /12-days-of-workflows/build-a-thon. Each one
 * is sent to Segment from the server as "12 Days Build-a-thon Submitted",
 * so an ad blocker that stops Segment in the browser can't lose an entry.
 *
 * Segment forwards it to Attio, where a workflow adds the person to the
 * build-a-thon list and posts to Slack, and to Customer.io. Those
 * mappings and the GTM trigger match this exact event name and these
 * property names, so rename nothing here without checking with whoever
 * owns the Segment setup.
 */

/** Must match SUBMITTED_EVENT in BuildathonForm. */
const EVENT = "12 Days Build-a-thon Submitted";

const FIELDS = [
  "name",
  "email",
  "company",
  "linkedin",
  "vercel",
  "github",
  "description",
] as const;

type Entry = Record<typeof FIELDS[number], string>;

const MAX_LENGTH = { description: 500, default: 300 };

const PATTERNS: Partial<Record<keyof Entry, RegExp>> = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  linkedin: /^https:\/\/(www\.)?linkedin\.com\/.+/,
  vercel: /^https:\/\/.+/,
  github: /^https:\/\/(www\.)?github\.com\/[^/]+\/[^/]+/,
};

/** Read and check one entry. Returns the problem as a string if it's bad. */
function parse(body: unknown): Entry | string {
  if (!body || typeof body !== "object") return "Invalid request";
  const raw = body as Record<string, unknown>;
  const entry = {} as Entry;
  for (const key of FIELDS) {
    const value = typeof raw[key] === "string" ? raw[key].trim() : "";
    const max =
      key === "description" ? MAX_LENGTH.description : MAX_LENGTH.default;
    if (!value) return `${key} is required`;
    if (value.length > max) return `${key} is too long`;
    if (value && PATTERNS[key] && !PATTERNS[key].test(value)) {
      return `${key} doesn't look right`;
    }
    entry[key] = value;
  }
  return entry;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Honeypot: a hidden field people never see. Bots that fill in every
  // input get a normal-looking success and nothing is posted.
  const raw = body as Record<string, unknown> | null;
  if (raw && typeof raw.website === "string" && raw.website) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const entry = parse(body);
  if (typeof entry === "string") {
    return NextResponse.json({ error: entry }, { status: 400 });
  }
  if (!(await domainTakesMail(entry.email))) {
    return NextResponse.json({ error: BAD_DOMAIN }, { status: 400 });
  }
  const props = raw as Record<string, unknown>;
  const ref = str(props.ref, 100);

  const properties = {
    name: entry.name,
    email: entry.email,
    company: entry.company,
    linkedin_url: entry.linkedin,
    vercel_url: entry.vercel,
    github_url: entry.github,
    description: entry.description,
    campaign: str(props.campaign, 100),
    form_type: "12_days_build_a_thon",
    form_source: "website",
    ref,
    ...firstTouch(props),
  };

  return sendToSegment(req, EVENT, properties, props);
}
