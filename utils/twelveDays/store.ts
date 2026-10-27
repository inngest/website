import { Redis } from "@upstash/redis";
import { TIMEZONE } from "@/components/v1/sections/TwelveDays/data";

/**
 * Check-in storage for the 12 Days of Workflows, in Upstash Redis.
 *
 * Keys, all prefixed `{12dow}:` (the hash tag keeps them in one slot so
 * the check-in script can touch them together):
 * - `user:{id}:days`        set of lesson days the user has completed
 * - `user:{id}:milestones`  set of milestones already claimed
 * - `checkin:{id}:{day}`    the first result of recording that check-in
 * - `users`                 hash of user id → email
 * - `date:{date}`           set of `{id}:{day}` checked in on that date
 * - `dates`                 set of every date that has a check-in
 * - `pass:{id}`             a sign-in pass already traded for a session
 *
 * Reads the Vercel Marketplace integration's `KV_REST_API_*` variables,
 * falling back to Upstash's own `UPSTASH_REDIS_REST_*` names.
 */

const PREFIX = "{12dow}:";

/** Lesson counts that unlock a reward (see PRIZES on the page). */
export const MILESTONES = [9, 12];

/**
 * Records one check-in atomically: the lesson, the email, the date
 * indexes, and any milestone reached for the first time, then saves
 * that result under the check-in's key. Run again for the same check-in
 * (a retry, a resend) it returns the saved result instead, so a retry
 * can neither skip the date records nor lose a milestone.
 *
 * KEYS: result, days, milestones, users, date, dates
 * ARGV: userId, email, day, dateMember, date, ...milestones
 * Returns "added|total|claimed,milestones".
 */
const RECORD_CHECK_IN = `
local saved = redis.call('GET', KEYS[1])
if saved then return saved end
local added = redis.call('SADD', KEYS[2], ARGV[3])
if added == 1 then
  redis.call('HSET', KEYS[4], ARGV[1], ARGV[2])
  redis.call('SADD', KEYS[5], ARGV[4])
  redis.call('SADD', KEYS[6], ARGV[5])
end
local total = redis.call('SCARD', KEYS[2])
local claimed = {}
for i = 6, #ARGV do
  if total >= tonumber(ARGV[i]) and redis.call('SADD', KEYS[3], ARGV[i]) == 1 then
    table.insert(claimed, ARGV[i])
  end
end
local result = added .. '|' .. total .. '|' .. table.concat(claimed, ',')
redis.call('SET', KEYS[1], result)
return result
`;

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
 * Record one completed lesson. Safe to repeat: see RECORD_CHECK_IN.
 * `milestones` lists the ones this check-in claimed for the first time.
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
}): Promise<{ isNew: boolean; total: number; milestones: number[] }> {
  const date = easternDate(at);
  const raw = await redis().eval<string[], string | number>(
    RECORD_CHECK_IN,
    [
      `${PREFIX}checkin:${userId}:${day}`,
      `${PREFIX}user:${userId}:days`,
      `${PREFIX}user:${userId}:milestones`,
      `${PREFIX}users`,
      `${PREFIX}date:${date}`,
      `${PREFIX}dates`,
    ],
    [
      userId,
      email,
      String(day),
      `${userId}:${day}`,
      date,
      ...MILESTONES.map(String),
    ]
  );

  const [added, total, claimed] = String(raw).split("|");
  return {
    isNew: added === "1",
    total: Number(total),
    milestones: claimed ? claimed.split(",").map(Number) : [],
  };
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

/**
 * Marks a sign-in pass as used. False when it already was, so a pass
 * leaked from a URL can't sign anyone else in. Kept only until the pass
 * would have expired anyway.
 */
export async function claimPass(
  passId: string,
  ttlSeconds: number
): Promise<boolean> {
  const set = await redis().set(`${PREFIX}pass:${passId}`, 1, {
    nx: true,
    ex: Math.max(1, Math.ceil(ttlSeconds)),
  });
  return set === "OK";
}
