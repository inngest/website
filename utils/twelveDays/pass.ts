import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * The sign-in pass: how app.inngest.com tells the website who just
 * signed in for the 12 Days of Workflows.
 *
 * After sign-in the app sends the visitor back to their lesson with
 * `?pass=<JWT>`, a short-lived HS256 token signed with
 * `TWELVE_DAYS_HANDOFF_SECRET` (shared by the app and the website). The
 * page trades it for the website's own session cookie at
 * /api/12-days/session. See HANDOFF.md for the app team's side.
 */

export const PASS_ISSUER = "app.inngest.com";
export const PASS_AUDIENCE = "12-days-of-workflows";
/** Longest a pass may live, in seconds. */
export const PASS_MAX_AGE = 10 * 60;
/** Clock drift allowed between the app and the website, in seconds. */
const SKEW = 60;

export interface Pass {
  /** `jti`: single-use, so a leaked URL can't be replayed. */
  id: string;
  /** `sub`: the Inngest account user id. */
  userId: string;
  email: string;
  /** True when the account was created in this sign-in. */
  newAccount: boolean;
  /** `exp`, in seconds since the epoch. */
  expiresAt: number;
}

function secret(): string {
  const value = process.env.TWELVE_DAYS_HANDOFF_SECRET;
  if (!value) throw new Error("TWELVE_DAYS_HANDOFF_SECRET is not set");
  return value;
}

function decode(part: string): Record<string, unknown> | null {
  try {
    const value = JSON.parse(Buffer.from(part, "base64url").toString("utf8"));
    return value && typeof value === "object" ? value : null;
  } catch {
    return null;
  }
}

const isText = (v: unknown, max = 320): v is string =>
  typeof v === "string" && v.length > 0 && v.length <= max;

/**
 * Checks a pass and returns who it's for, or null if it's malformed,
 * badly signed, meant for something else, or expired. Throws only when
 * the secret isn't configured. Doesn't check single use; the session
 * route does that against the store.
 */
export function verifyPass(token: unknown, nowMs = Date.now()): Pass | null {
  if (typeof token !== "string" || token.length > 4096) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [head, body, sig] = parts;

  // Only HS256: never trust the token to pick its own algorithm.
  const header = decode(head);
  if (header?.alg !== "HS256") return null;

  const expected = createHmac("sha256", secret())
    .update(`${head}.${body}`)
    .digest();
  const given = Buffer.from(sig, "base64url");
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) {
    return null;
  }

  const claims = decode(body);
  if (!claims) return null;
  const { iss, aud, sub, email, jti, iat, exp } = claims;
  const now = Math.floor(nowMs / 1000);
  const audiences = Array.isArray(aud) ? aud : [aud];
  if (
    iss !== PASS_ISSUER ||
    !audiences.includes(PASS_AUDIENCE) ||
    !isText(sub, 128) ||
    !isText(email) ||
    !email.includes("@") ||
    !isText(jti, 128) ||
    typeof iat !== "number" ||
    typeof exp !== "number" ||
    iat > now + SKEW ||
    exp <= now - SKEW ||
    exp - iat > PASS_MAX_AGE
  ) {
    return null;
  }

  return {
    id: jti,
    userId: sub,
    email,
    newAccount: claims.new_account === true,
    expiresAt: exp,
  };
}
