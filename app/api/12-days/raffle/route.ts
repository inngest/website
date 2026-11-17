import { after, NextResponse } from "next/server";
import {
  BAD_DOMAIN,
  domainTakesMail,
  firstTouch,
  str,
  trackSegment,
} from "@/app/api/12-days/shared";
import { appendRow } from "@/app/api/12-days/sheets";
import { raffleDayAt } from "@/components/v1/sections/TwelveDays/data";

export const runtime = "nodejs";

/**
 * Daily raffle entries from the pop-up behind each door.
 *
 * 1. Segment, "12 Days Raffle Entered": the record of the entry. Must
 *    succeed, or the form says it didn't go through.
 * 2. Segment, "12 Days Signup Form Submitted" (form_type
 *    "12_days_raffle"): the same event the email sign-up sends, so the
 *    entrant gets the daily door emails through the existing
 *    Customer.io mapping.
 * 3. Google Sheets: a row on the raffle sheet, written after the
 *    response so a slow or failing Google never blocks an entry. A
 *    missed row can be rebuilt from the Segment events.
 *
 * Sheet setup (Vercel, Sensitive): TWELVE_DAYS_RAFFLE_SHEET_ID, plus the
 * service account in sheets.ts. Optional TWELVE_DAYS_RAFFLE_SHEET_RANGE
 * (default "Entries!A:I"). Columns: submitted_at, day, name, email,
 * ref, utm_source, utm_medium, utm_campaign, anonymous_id.
 *
 * Do not rename either event without Patrick: Segment, Customer.io,
 * Attio and GTM mappings key on the names.
 */

/** Must match RAFFLE_EVENT in RaffleDialog. */
const RAFFLE_EVENT = "12 Days Raffle Entered";
/** The email sign-up's event (EmailSignup.tsx). */
const SIGNUP_EVENT = "12 Days Signup Form Submitted";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** How long after a door's raffle closes an entry still counts. */
const GRACE_MS = 10 * 60 * 1000;

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
  const day = typeof raw.day === "number" ? raw.day : NaN;
  if (!name) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }
  if (!EMAIL.test(email)) {
    return NextResponse.json(
      { error: "email doesn't look right" },
      { status: 400 }
    );
  }
  if (!Number.isInteger(day) || day < 1 || day > 12) {
    return NextResponse.json({ error: "Invalid day" }, { status: 400 });
  }
  // Each day's raffle is only open while its door is today's door,
  // with a few minutes' grace so a form opened just before midnight
  // still counts. Previews skip this so the team can test any day with
  // `?now=`.
  const now = Date.now();
  if (
    process.env.VERCEL_ENV === "production" &&
    raffleDayAt(new Date(now)) !== day &&
    raffleDayAt(new Date(now - GRACE_MS)) !== day
  ) {
    return NextResponse.json(
      { error: `The Day ${day} raffle isn't open.` },
      { status: 400 }
    );
  }
  if (!(await domainTakesMail(email))) {
    return NextResponse.json({ error: BAD_DOMAIN }, { status: 400 });
  }

  // One anonymous ID for both events, so they belong to one visitor
  // even when the browser couldn't send its own.
  const anonymousId = str(raw.anonymousId, 100) || crypto.randomUUID();
  const ids = { ...raw, anonymousId };
  const ref = str(raw.ref, 100);
  const touch = firstTouch(raw);
  const shared = {
    name,
    email,
    campaign: str(raw.campaign, 100),
    form_source: "website",
    ref,
    ...touch,
  };

  const [entered, subscribed] = await Promise.all([
    trackSegment(
      req,
      RAFFLE_EVENT,
      { ...shared, day, form_type: "12_days_raffle" },
      ids
    ),
    trackSegment(
      req,
      SIGNUP_EVENT,
      { ...shared, form_type: "12_days_raffle" },
      ids
    ),
  ]);
  if (!entered) {
    return NextResponse.json({ error: "Couldn't send" }, { status: 502 });
  }
  if (!subscribed) {
    console.error("Raffle entrant not subscribed to the daily emails", email);
  }

  const sheetId = process.env.TWELVE_DAYS_RAFFLE_SHEET_ID ?? "";
  const range = process.env.TWELVE_DAYS_RAFFLE_SHEET_RANGE || "Entries!A:I";
  after(() =>
    appendRow(sheetId, range, [
      new Date().toISOString(),
      String(day),
      name,
      email,
      ref,
      touch.first_utm_source ?? "",
      touch.first_utm_medium ?? "",
      touch.first_utm_campaign ?? "",
      anonymousId,
    ])
  );

  return NextResponse.json({ ok: true }, { status: 201 });
}
