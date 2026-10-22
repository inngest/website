import { Redis } from "@upstash/redis";
import { TIMEZONE } from "@/components/v1/sections/TwelveDays/data";

/**
 * Check-in storage for the 12 Days of Workflows, in Upstash Redis.
 *
 * Keys, all prefixed `12dow:`:
 * - `user:{id}:days`  set of lesson days the user has completed
 * - `users`           hash of user id → email
 * - `date:{date}`     set of `{id}:{day}` checked in on that Eastern date
 * - `dates`           set of every date that has a check-in
 *
 * Reads the Vercel Marketplace integration's `KV_REST_API_*` variables,
 * falling back to Upstash's own `UPSTASH_REDIS_REST_*` names.
 */

const PREFIX = "12dow:";

let client: Redis | null = null;

function redis(): Redis {
  if (!client) {
    const url =
      process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
    const token =
      process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) {
      throw new Error("12 Days check-in store: Redis env vars are not set");
    }
    client = new Redis({ url, token });
  }
  return client;
}

/** `2026-12-09`: the calendar date in Eastern time, when doors open. */
export function easternDate(at: Date): string {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", { timeZone: TIMEZONE }).format(at);
}

export interface CheckInRecord {
  userId: string;
  email: string;
  day: number;
  date: string;
}

/**
 * Record one completed lesson. Safe to repeat: a lesson already on the
 * user's set is reported back as not new and changes nothing.
 */
export async function recordCheckIn({
  userId,
  email,
  day,
  at,
}: {
  userId: string;
  email: string;
  day: number;
  at: Date;
}): Promise<{ isNew: boolean; total: number }> {
  const r = redis();
  const added = await r.sadd(`${PREFIX}user:${userId}:days`, day);
  if (added === 1) {
    const date = easternDate(at);
    await Promise.all([
      r.hset(`${PREFIX}users`, { [userId]: email }),
      r.sadd(`${PREFIX}date:${date}`, `${userId}:${day}`),
      r.sadd(`${PREFIX}dates`, date),
    ]);
  }
  const total = await r.scard(`${PREFIX}user:${userId}:days`);
  return { isNew: added === 1, total };
}

/** Every check-in recorded on an Eastern date, with each user's total. */
export async function checkInsOn(
  date: string
): Promise<(CheckInRecord & { total: number })[]> {
  const r = redis();
  const members = await r.smembers(`${PREFIX}date:${date}`);
  if (members.length === 0) return [];

  const emails =
    (await r.hgetall<Record<string, string>>(`${PREFIX}users`)) ?? {};
  const rows = members.map((m) => {
    const split = m.lastIndexOf(":");
    const userId = m.slice(0, split);
    return {
      userId,
      email: emails[userId] ?? "",
      day: Number(m.slice(split + 1)),
      date,
    };
  });

  const userIds = Array.from(new Set(rows.map((row) => row.userId)));
  const totals = await Promise.all(
    userIds.map((id) => r.scard(`${PREFIX}user:${id}:days`))
  );
  const totalFor = new Map(userIds.map((id, i) => [id, totals[i]]));

  return rows
    .map((row) => ({ ...row, total: totalFor.get(row.userId) ?? 0 }))
    .sort((a, b) => a.email.localeCompare(b.email) || a.day - b.day);
}

/** Every date with at least one check-in, oldest first. */
export async function checkInDates(): Promise<string[]> {
  const dates = await redis().smembers(`${PREFIX}dates`);
  return dates.sort();
}
