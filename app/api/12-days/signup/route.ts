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
 * Email-only sign-ups from the 12 Days join form (before a day's raffle
 * is open; once one is, the form goes through the raffle route, which
 * sends this same event). Sent to Segment from the server as
 * "12 Days Signup Form Submitted", so an ad blocker that stops Segment
 * in the browser can't lose a sign-up.
 *
 * Same properties the browser track call sent before this route. Segment
 * maps the event to Customer.io (a person from `properties.email`, with
 * `twelve_days_subscribed_at`) and Attio, and the 12 Days segments and
 * daily door emails build on it, so rename nothing here without
 * checking with whoever owns the Segment setup.
 */

/** Must match the sign-up event the raffle route sends. */
const EVENT = "12 Days Signup Form Submitted";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const raw = body as Record<string, unknown>;

  // Honeypot: bots that fill in every input get a normal-looking success.
  if (typeof raw.website === "string" && raw.website) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const email = str(raw.email, 300);
  if (!EMAIL.test(email)) {
    return NextResponse.json(
      { error: "email doesn't look right" },
      { status: 400 }
    );
  }
  if (!(await domainTakesMail(email))) {
    return NextResponse.json({ error: BAD_DOMAIN }, { status: 400 });
  }

  return sendToSegment(
    req,
    EVENT,
    {
      email,
      campaign: str(raw.campaign, 100),
      form_type: "12_days_of_workflows",
      form_source: "website",
      ref: str(raw.ref, 100),
      ...firstTouch(raw),
    },
    raw
  );
}
