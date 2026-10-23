/**
 * Who is checking in to the 12 Days of Workflows calendar.
 *
 * STUB, for the app team: the website can't see an Inngest account
 * session yet. Sign-in happens on the app (see `signInHref` in
 * components/v1/sections/TwelveDays/useCheckIn.ts), which sends the
 * visitor back to their lesson. For this to return a real user, the app
 * needs to hand identity back to inngest.com, e.g. one of:
 *
 * - a session cookie scoped to `.inngest.com` that this route can verify
 *   (with the auth provider's server SDK or a JWKS check), or
 * - a short-lived signed token appended to the return URL, which the
 *   page posts here and this function verifies.
 *
 * Until then every request is anonymous, so the check-in route answers
 * 401 and the page keeps progress in the browser and asks for sign-in.
 */

export interface CheckInUser {
  /** Stable Inngest account user id. */
  id: string;
  email: string;
}

export async function getCheckInUser(
  // Unused until the handoff exists; the cookie or token will be on it.
  _req: Request
): Promise<CheckInUser | null> {
  // Off production, `TWELVE_DAYS_DEV_USER=you@inngest.com` stands in for
  // a signed-in user so the whole flow can be tested end to end.
  const devUser = process.env.TWELVE_DAYS_DEV_USER;
  if (devUser && process.env.VERCEL_ENV !== "production") {
    return { id: devUser, email: devUser };
  }

  return null;
}
