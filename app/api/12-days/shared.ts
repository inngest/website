import { NextResponse } from "next/server";
import { promises as dns } from "node:dns";

/**
 * Shared by the 12 Days form routes (build-a-thon entries, livestream
 * registrations): reading the form's attribution, checking the email's
 * domain, and sending the event to Segment from the server, so an ad
 * blocker that stops Segment in the browser can't lose a submission.
 */

/** The same Segment source the site's browser events use. */
const SEGMENT_TRACK_URL = "https://api.segment.io/v1/track";

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

export function firstTouch(
  raw: Record<string, unknown>
): Record<string, string> {
  const source = raw.firstTouch;
  if (!source || typeof source !== "object") return {};
  const out: Record<string, string> = {};
  for (const key of FIRST_TOUCH_KEYS) {
    const value = (source as Record<string, unknown>)[key];
    if (typeof value === "string" && value) out[key] = value.slice(0, 500);
  }
  return out;
}

export function str(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/**
 * False only when DNS says the email's domain can't receive mail (no
 * such domain, or no mail or address records), which is how a typo like
 * `name@company.con` shows up. Slow or failed lookups count as fine, so
 * a DNS hiccup never loses an entry.
 */
export async function domainTakesMail(email: string): Promise<boolean> {
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

/**
 * Sends `event` to Segment and answers the form: 201 when it's sent,
 * 502 when Segment refuses, 500 when there's no write key outside local
 * development (so the form says so rather than dropping it).
 */
export async function sendToSegment(
  req: Request,
  event: string,
  properties: Record<string, unknown>,
  raw: Record<string, unknown>
): Promise<NextResponse> {
  const writeKey = process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY;
  if (!writeKey) {
    if (process.env.NODE_ENV === "development") {
      console.log(`${event} (no Segment write key set)`, properties);
      return NextResponse.json({ ok: true }, { status: 201 });
    }
    console.error("NEXT_PUBLIC_SEGMENT_WRITE_KEY is not set");
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  // The browser's Segment anonymous ID ties this to the visitor's
  // earlier page views; without one, Segment still needs an ID.
  const anonymousId = str(raw.anonymousId, 100) || crypto.randomUUID();
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
        event,
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

/** The answer when the email's domain can't receive mail. */
export const BAD_DOMAIN =
  "That email domain doesn't take mail. Check for a typo?";
