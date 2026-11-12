import { NextResponse } from "next/server";
import { promises as dns } from "node:dns";

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

/** The same Segment source the site's browser events use. */
const SEGMENT_TRACK_URL = "https://api.segment.io/v1/track";

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

const OPTIONAL = new Set<keyof Entry>(["description"]);

/** Read and check one entry. Returns the problem as a string if it's bad. */
function parse(body: unknown): Entry | string {
  if (!body || typeof body !== "object") return "Invalid request";
  const raw = body as Record<string, unknown>;
  const entry = {} as Entry;
  for (const key of FIELDS) {
    const value = typeof raw[key] === "string" ? raw[key].trim() : "";
    const max =
      key === "description" ? MAX_LENGTH.description : MAX_LENGTH.default;
    if (!value && !OPTIONAL.has(key)) return `${key} is required`;
    if (value.length > max) return `${key} is too long`;
    if (value && PATTERNS[key] && !PATTERNS[key].test(value)) {
      return `${key} doesn't look right`;
    }
    entry[key] = value;
  }
  return entry;
}

/** First-touch attribution keys the form may pass through from its cookie. */
const FIRST_TOUCH_KEYS = [
  "first_utm_source",
  "first_utm_medium",
  "first_utm_campaign",
  "first_utm_content",
  "first_utm_term",
  "first_ref",
  "first_landing_url",
  "first_referrer",
  "first_seen_at",
] as const;

function firstTouch(raw: Record<string, unknown>): Record<string, string> {
  const source = raw.firstTouch;
  if (!source || typeof source !== "object") return {};
  const out: Record<string, string> = {};
  for (const key of FIRST_TOUCH_KEYS) {
    const value = (source as Record<string, unknown>)[key];
    if (typeof value === "string" && value) out[key] = value.slice(0, 500);
  }
  return out;
}

function str(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/**
 * False only when DNS says the email's domain can't receive mail (no
 * such domain, or no mail or address records), which is how a typo like
 * `name@company.con` shows up. Slow or failed lookups count as fine, so
 * a DNS hiccup never loses an entry.
 */
async function domainTakesMail(email: string): Promise<boolean> {
  const domain = email.slice(email.lastIndexOf("@") + 1).toLowerCase();
  const lookup = async () => {
    try {
      const mx = await dns.resolveMx(domain);
      if (mx.length > 0) return true;
    } catch (err) {
      const code = (err as NodeJS.ErrnoException).code;
      if (code !== "ENOTFOUND" && code !== "ENODATA") return true;
    }
    // No MX record: mail falls back to the domain's own address.
    try {
      return (await dns.resolve(domain)).length > 0;
    } catch (err) {
      const code = (err as NodeJS.ErrnoException).code;
      return code !== "ENOTFOUND" && code !== "ENODATA";
    }
  };
  return Promise.race([
    lookup(),
    new Promise<boolean>((resolve) => setTimeout(() => resolve(true), 2000)),
  ]);
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
    return NextResponse.json(
      { error: "That email domain doesn't take mail. Check for a typo?" },
      { status: 400 }
    );
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

  const writeKey = process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY;
  if (!writeKey) {
    // Local development has no write key; log the entry instead. Anywhere
    // else, fail so the form says so rather than dropping the entry.
    if (process.env.NODE_ENV === "development") {
      console.log(`${EVENT} (no Segment write key set)`, properties);
      return NextResponse.json({ ok: true }, { status: 201 });
    }
    console.error("NEXT_PUBLIC_SEGMENT_WRITE_KEY is not set");
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  // The browser's Segment anonymous ID ties this entry to the visitor's
  // earlier page views; without one, Segment still needs an ID.
  const anonymousId = str(props.anonymousId, 100) || crypto.randomUUID();
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();

  try {
    const res = await fetch(SEGMENT_TRACK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${writeKey}:`).toString(
          "base64"
        )}`,
      },
      body: JSON.stringify({
        event: EVENT,
        anonymousId,
        properties,
        context: {
          ...(ip ? { ip } : {}),
          userAgent: req.headers.get("user-agent") ?? undefined,
          page: { url: req.headers.get("referer") ?? undefined },
        },
        timestamp: new Date().toISOString(),
      }),
    });
    if (!res.ok) {
      console.error("Segment track failed", res.status, await res.text());
      return NextResponse.json({ error: "Couldn't send" }, { status: 502 });
    }
  } catch (err) {
    console.error("Segment track failed", err);
    return NextResponse.json({ error: "Couldn't send" }, { status: 502 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
