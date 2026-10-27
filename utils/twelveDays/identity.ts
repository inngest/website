import {
  cookieFrom,
  readSession,
  SESSION_COOKIE,
} from "@/utils/twelveDays/session";

/**
 * Who is checking in to the 12 Days of Workflows calendar.
 *
 * Sign-in happens on the app (see `signInHref` in
 * components/v1/sections/TwelveDays/useCheckIn.ts). The app sends the
 * visitor back to their lesson with a short-lived sign-in pass, which
 * /api/12-days/session trades for the website's own session cookie
 * (pass.ts, session.ts; the app team's side is in HANDOFF.md). This
 * reads that cookie.
 *
 * Without it every request is anonymous, so the check-in route answers
 * 401 and the page keeps progress in the browser and asks for sign-in.
 */

export interface CheckInUser {
  /** Stable Inngest account user id. */
  id: string;
  email: string;
}

export async function getCheckInUser(
  req: Request
): Promise<CheckInUser | null> {
  // Off production, `TWELVE_DAYS_DEV_USER=you@inngest.com` stands in for
  // a signed-in user so the whole flow can be tested end to end.
  const devUser = process.env.TWELVE_DAYS_DEV_USER;
  if (devUser && process.env.VERCEL_ENV !== "production") {
    return { id: devUser, email: devUser };
  }

  try {
    return readSession(cookieFrom(req, SESSION_COOKIE));
  } catch (error) {
    // No secret to check it with: treat as signed out, but say why.
    console.error("12 Days session can't be read", error);
    return null;
  }
}
