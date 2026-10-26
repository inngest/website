"use client";

import { useCallback, useEffect, useState } from "react";

const PAGE_PATH = "/12-days-of-workflows";
const REF = "12-days-of-workflows";

/** Element id of a lesson's door, for `#day-5` links. */
export const doorId = (day: number) => `day-${day}`;

/**
 * Query param the app's sign-in page reads to send people back.
 * TODO(app team): confirm the name, and allow inngest.com (and preview
 * hosts) as return destinations.
 */
const SIGN_IN_RETURN_PARAM = "redirect_url";

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
 * Back from sign-in (`?checkin=1&door=5#day-5`) it also scrolls to the
 * lesson they left from, then tidies the params so a reload doesn't
 * repeat it. Waits for the clock and stored progress to load (`ready`).
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

    checkIn(done);

    const url = new URL(window.location.href);
    if (!url.searchParams.has(RETURN_PARAM)) return;

    const day = Number(url.searchParams.get(DOOR_PARAM));
    const target = document.getElementById(day ? doorId(day) : "calendar");
    target?.scrollIntoView({ block: "center" });

    url.searchParams.delete(RETURN_PARAM);
    url.searchParams.delete(DOOR_PARAM);
    window.history.replaceState(null, "", url.toString());
  }, [ready, handled, done, checkIn]);
}
