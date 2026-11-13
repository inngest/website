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
 * Livestream registrations from /12-days-of-workflows/livestream, sent to
 * Segment from the server as "12 Days Livestream Registered".
 *
 * NEEDS SEGMENT SETUP: map this event in Segment (a Customer.io person
 * from `properties.email`, like the other two 12 Days events) so the
 * reminder emails can go out. Rename it only together with that mapping
 * and the GTM trigger.
 */

/** Must match REGISTERED_EVENT in LivestreamForm. */
const EVENT = "12 Days Livestream Registered";

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

  const name = str(raw.name, 300);
  const email = str(raw.email, 300);
  if (!name) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }
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
      name,
      email,
      campaign: str(raw.campaign, 100),
      form_type: "12_days_livestream",
      form_source: "website",
      ref: str(raw.ref, 100),
      ...firstTouch(raw),
    },
    raw
  );
}
