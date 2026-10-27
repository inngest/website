"use client";

import { useCallback, useEffect, useState } from "react";
import { REF } from "@/components/v1/sections/TwelveDays/data";

const PAGE_PATH = "/12-days-of-workflows";

/** Element id of a lesson's door, for `#day-5` links. */
export const doorId = (day: number) => `day-${day}`;

/**
 * Query param the app's sign-in page reads to send people back.
 * TODO(app team): confirm the name (utils/twelveDays/HANDOFF.md).
 */
const SIGN_IN_RETURN_PARAM = "redirect_url";

/** The sign-in pass the app adds to the return trip. */
const PASS_PARAM = "pass";

/** Set on the return trip from sign-in so the page syncs progress. */
const RETURN_PARAM = "checkin";
/** The lesson to land back on. */
const DOOR_PARAM = "door";

function signInHref(origin: string, day?: number): string {
  const back = new URL(PAGE_PATH, origin);
  back.searchParams.set(RETURN_PARAM, "1");
  if (day) back.searchParams.set(DOOR_PARAM, String(day));
  back.hash = day ? doorId(day) : "calendar";

  const signIn = new URL(
    process.env.NEXT_PUBLIC_SIGNIN_URL ?? "https://app.inngest.com/sign-in"
  );
  signIn.searchParams.set(SIGN_IN_RETURN_PARAM, back.toString());
  signIn.searchParams.set("ref", REF);
  return signIn.toString();
}

/**
 * Sign-in link that comes back to lesson `day` (or the calendar). The
 * return URL needs this page's origin, which is only known in the
 * browser, so the first render uses production's and swaps after mount.
 */
export function useSignInHref(day?: number): string {
  const [origin, setOrigin] = useState("https://www.inngest.com");
  useEffect(() => setOrigin(window.location.origin), []);
  return signInHref(origin, day);
}

/**
 * Sends completed lessons to the check-in API. `signedOut` flips on when
 * the API says nobody is signed in, so lessons can offer sign-in; the
 * browser's own progress is kept either way. `failed` lists lessons
 * whose check-in didn't reach the server (an error or no connection),
 * so they can say so and offer a retry instead of looking saved.
 */
export function useCheckIn() {
  const [signedOut, setSignedOut] = useState(false);
  const [failed, setFailed] = useState<number[]>([]);

  const checkIn = useCallback(async (days: number[]) => {
    if (days.length === 0) return;
    const without = (prev: number[]) => prev.filter((d) => !days.includes(d));
    let ok = false;
    try {
      const res = await fetch("/api/12-days/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days }),
      });
      if (res.status === 401) {
        // Not a failure: the lesson offers sign-in instead.
        setSignedOut(true);
        setFailed(without);
        return;
      }
      ok = res.ok;
      if (ok) setSignedOut(false);
    } catch {
      // No connection: falls through as a failure.
    }
    setFailed((prev) =>
      ok ? without(prev) : [...without(prev), ...days].sort((a, b) => a - b)
    );
  }, []);

  return { checkIn, signedOut, failed };
}

/**
 * Once per visit, check in every lesson finished in this browser: it
 * syncs progress made before signing in, and tells the page whether
 * anyone is signed in. Resends are harmless, since each check-in only
 * counts once.
 *
 * Back from sign-in (`?checkin=1&door=5&pass=…#day-5`) it first trades
 * the app's sign-in pass for a session, so the sync counts. It also
 * scrolls to the lesson they left from and tidies the params, so the
 * pass doesn't linger in the address bar or history and a reload
 * doesn't repeat any of it. Waits for the clock and stored progress to
 * load (`ready`).
 */
export function useSyncCheckIns({
  ready,
  done,
  checkIn,
}: {
  ready: boolean;
  done: number[];
  checkIn: (days: number[]) => void;
}) {
  const [handled, setHandled] = useState(false);

  useEffect(() => {
    if (!ready || handled) return;
    setHandled(true);

    const url = new URL(window.location.href);
    const pass = url.searchParams.get(PASS_PARAM);
    const returning = url.searchParams.has(RETURN_PARAM);
    const day = Number(url.searchParams.get(DOOR_PARAM));

    if (pass || returning) {
      url.searchParams.delete(PASS_PARAM);
      url.searchParams.delete(RETURN_PARAM);
      url.searchParams.delete(DOOR_PARAM);
      window.history.replaceState(null, "", url.toString());
    }

    if (returning) {
      const target = document.getElementById(day ? doorId(day) : "calendar");
      target?.scrollIntoView({ block: "center" });
    }

    (pass ? redeemPass(pass) : Promise.resolve()).then(() => checkIn(done));
  }, [ready, handled, done, checkIn]);
}

/**
 * Trades the sign-in pass for the website's session cookie. A pass that
 * doesn't work (expired, already used) leaves them signed out, and the
 * check-ins that follow offer sign-in again.
 */
async function redeemPass(pass: string): Promise<void> {
  try {
    await fetch("/api/12-days/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pass }),
    });
  } catch {
    // No connection: same as a pass that didn't work.
  }
}
