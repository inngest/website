import { NextResponse } from "next/server";
import { DAYS, unlockAt } from "@/components/v1/sections/TwelveDays/data";
import {
  inngest,
  LESSON_COMPLETED,
  type LessonCompletedData,
} from "@/utils/twelveDays/functions";
import { getCheckInUser } from "@/utils/twelveDays/identity";
import { signCheckIn } from "@/utils/twelveDays/signature";

export const runtime = "nodejs";

/**
 * POST { days: number[] } — check in completed 12 Days lessons for the
 * signed-in user. Answers 401 when nobody is signed in, so the page can
 * offer sign-in and send the visitor back to their lesson.
 *
 * Each day becomes one `website/12-days.lesson.completed` event; the
 * event id makes resends (like the sync after returning from sign-in)
 * collapse into one check-in.
 */
export async function POST(req: Request) {
  let body: { days?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Identity first, so the page learns it needs sign-in whatever the days.
  const user = await getCheckInUser(req);
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const now = Date.now();
  const days = Array.isArray(body.days)
    ? Array.from(new Set(body.days)).filter(
        (d): d is number =>
          Number.isInteger(d) &&
          d >= 1 &&
          d <= DAYS.length &&
          // A door that hasn't opened can't be completed yet.
          unlockAt(d as number).getTime() <= now
      )
    : [];
  if (days.length === 0) {
    return NextResponse.json(
      { error: "days must list opened lessons" },
      { status: 400 }
    );
  }

  let events: { id: string; name: string; data: LessonCompletedData }[];
  try {
    events = days.map((day) => {
      const fields = {
        checkInId: `${user.id}:${day}`,
        userId: user.id,
        email: user.email,
        day,
      };
      const data = { ...fields, signature: signCheckIn(fields) };
      return { id: `12dow-${data.checkInId}`, name: LESSON_COMPLETED, data };
    });
  } catch (error) {
    // No signing secret configured: refuse rather than send unsigned.
    console.error("12 Days check-in can't be signed", error);
    return NextResponse.json(
      { error: "Check-ins are not configured" },
      { status: 503 }
    );
  }

  // Skipped in development unless a local Dev Server is running.
  if (process.env.NODE_ENV === "development" && !process.env.INNGEST_DEV) {
    console.log("Skipping 12 Days check-in in development", events);
    return NextResponse.json({ checkedIn: days }, { status: 201 });
  }

  try {
    await inngest.send(events);
    return NextResponse.json({ checkedIn: days }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
