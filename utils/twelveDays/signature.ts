import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Check-in events are signed by the check-in route and verified by the
 * function that records them. The website's Inngest event key also ships
 * to browsers (contact forms, the Inngest script in _app), so anyone
 * could send a `website/12-days.lesson.completed` event themselves; the
 * signature proves it came from the route, after its sign-in and unlock
 * checks.
 *
 * Uses `TWELVE_DAYS_EVENT_SECRET`, which only the server has (the
 * session cookie is signed with it too; see session.ts).
 */

export interface SignedFields {
  checkInId: string;
  userId: string;
  email: string;
  day: number;
}

export function websiteSecret(): string {
  const value = process.env.TWELVE_DAYS_EVENT_SECRET;
  if (!value) throw new Error("TWELVE_DAYS_EVENT_SECRET is not set");
  return value;
}

function digest(fields: SignedFields): Buffer {
  // JSON keeps field boundaries unambiguous.
  const payload = JSON.stringify([
    fields.checkInId,
    fields.userId,
    fields.email,
    fields.day,
  ]);
  return createHmac("sha256", websiteSecret()).update(payload).digest();
}

export function signCheckIn(fields: SignedFields): string {
  return digest(fields).toString("hex");
}

export function isValidCheckIn(
  fields: SignedFields,
  signature: unknown
): boolean {
  if (typeof signature !== "string" || !/^[0-9a-f]{64}$/.test(signature)) {
    return false;
  }
  return timingSafeEqual(digest(fields), Buffer.from(signature, "hex"));
}
