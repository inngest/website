import { useRef } from "react";
import { useCookie } from "react-use";

/**
 * The shape of the first-touch cookie payload. Captured once, on the visitor's
 * first landing on the site. Subsequent visits (within the cookie TTL) don't
 * overwrite this — that's the whole point of "first touch".
 */
export interface FirstTouch {
  first_utm_source?: string;
  first_utm_medium?: string;
  first_utm_campaign?: string;
  first_utm_content?: string;
  first_utm_term?: string;
  first_ref?: string;
  first_landing_url?: string;
  first_referrer?: string;
  first_seen_at?: string;
}

const COOKIE_NAME = "inngest_first_touch";

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

/**
 * Build the first-touch payload from the current URL & document referrer.
 * Only safe to call client-side.
 */
function captureFirstTouch(): FirstTouch {
  const payload: FirstTouch = {
    first_seen_at: new Date().toISOString(),
  };

  try {
    const params = new URLSearchParams(window.location.search);
    UTM_KEYS.forEach((k) => {
      const v = params.get(k);
      if (v) {
        // Map utm_source -> first_utm_source, etc.
        (payload as any)[`first_${k}`] = v;
      }
    });
    const refValue = params.get("ref");
    if (refValue) {
      payload.first_ref = refValue;
    }
    payload.first_landing_url = window.location.href;
  } catch (e) {
    // noop — best-effort capture
  }

  try {
    if (document.referrer) {
      payload.first_referrer = document.referrer;
    }
  } catch (e) {
    // noop
  }

  return payload;
}

/**
 * Read the first-touch cookie synchronously without using a hook. Useful for
 * form submit handlers that need the value at a specific moment.
 *
 * Returns `null` if the cookie isn't set or can't be parsed.
 */
export function readFirstTouch(): FirstTouch | null {
  if (typeof document === "undefined") return null;
  try {
    const prefix = `${COOKIE_NAME}=`;
    const match = document.cookie
      .split("; ")
      .find((row) => row.startsWith(prefix));
    if (!match) return null;
    // Use substring (not split('=')[1]) — the cookie value can contain
    // additional '=' characters (e.g. inside first_landing_url query params),
    // which split() would chop mid-string.
    const raw = decodeURIComponent(match.substring(prefix.length));
    return JSON.parse(raw) as FirstTouch;
  } catch (e) {
    return null;
  }
}

/**
 * Write the first-touch cookie if one doesn't already exist. Mirrors the
 * `useAnonymousID` pattern — 6-month TTL, sameSite=lax, scoped to the
 * site hostname.
 *
 * Returns the parsed cookie value (existing or newly written) and an
 * `existing` flag so callers can tell whether this was the first touch.
 */
export const useFirstTouch = (): {
  firstTouch: FirstTouch | null;
  existing: boolean;
} => {
  // Prevent race conditions across re-renders.
  const cached = useRef<any>(false);
  const [firstTouchCookie, setFirstTouchCookie] = useCookie(COOKIE_NAME);

  if (!cached.current) {
    if (!firstTouchCookie) {
      // First landing — capture & persist.
      if (typeof window === "undefined") {
        // SSR: don't write anything, return null and let the client hydrate.
        return { firstTouch: null, existing: false };
      }

      const payload = captureFirstTouch();
      const sixMonthsFromNow = new Date(
        Date.now() + 6 * 30 * 24 * 60 * 60 * 1000
      );
      try {
        setFirstTouchCookie(JSON.stringify(payload), {
          domain: process.env.NEXT_PUBLIC_HOSTNAME,
          path: "/",
          expires: sixMonthsFromNow,
          sameSite: "lax",
        });
      } catch (e) {
        // noop — best effort
      }

      cached.current = {
        firstTouch: payload,
        existing: false,
      };
    } else {
      let parsed: FirstTouch | null = null;
      try {
        parsed = JSON.parse(firstTouchCookie) as FirstTouch;
      } catch (e) {
        parsed = null;
      }
      cached.current = {
        firstTouch: parsed,
        existing: true,
      };
    }
  }

  return cached.current;
};
