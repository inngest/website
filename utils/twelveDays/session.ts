import { createHmac, timingSafeEqual } from "node:crypto";
import { websiteSecret } from "@/utils/twelveDays/signature";
import type { CheckInUser } from "@/utils/twelveDays/identity";

/**
 * The website's own 12 Days session: who is checking in, in an
 * httpOnly cookie set once the app's sign-in pass checks out (see
 * pass.ts). Signed with `TWELVE_DAYS_EVENT_SECRET`, which only the
 * website has, so the app's shared secret can't mint sessions directly.
 *
 * Value: `base64url(JSON {sub, email, exp}).base64url(HMAC)`.
 */

export const SESSION_COOKIE = "12dow_session";
/** Long enough to cover the calendar and January catch-up. */
export const SESSION_MAX_AGE = 45 * 24 * 60 * 60;
/** Only the 12 Days API routes need to see it. */
export const SESSION_PATH = "/api/12-days";

// Keeps these signatures from ever matching a check-in signature.
const PURPOSE = "12dow-session.";

function sign(payload: string): Buffer {
  return createHmac("sha256", websiteSecret())
    .update(PURPOSE + payload)
    .digest();
}

export function createSession(user: CheckInUser, nowMs = Date.now()): string {
  const payload = Buffer.from(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      exp: Math.floor(nowMs / 1000) + SESSION_MAX_AGE,
    })
  ).toString("base64url");
  return `${payload}.${sign(payload).toString("base64url")}`;
}

/** The signed-in user, or null for a missing, forged or expired cookie. */
export function readSession(
  value: string | undefined,
  nowMs = Date.now()
): CheckInUser | null {
  if (!value) return null;
  const [payload, sig, extra] = value.split(".");
  if (!payload || !sig || extra !== undefined) return null;

  const given = Buffer.from(sig, "base64url");
  const expected = sign(payload);
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) {
    return null;
  }

  try {
    const { sub, email, exp } = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    );
    if (
      typeof sub !== "string" ||
      typeof email !== "string" ||
      typeof exp !== "number" ||
      exp <= Math.floor(nowMs / 1000)
    ) {
      return null;
    }
    return { id: sub, email };
  } catch {
    return null;
  }
}

/** Reads one cookie off a request's Cookie header. */
export function cookieFrom(req: Request, name: string): string | undefined {
  for (const part of (req.headers.get("cookie") ?? "").split(";")) {
    const eq = part.indexOf("=");
    if (eq > 0 && part.slice(0, eq).trim() === name) {
      return decodeURIComponent(part.slice(eq + 1).trim());
    }
  }
  return undefined;
}
