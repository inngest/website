import { useEffect, useRef } from "react";
import { useCookie } from "react-use";

// the first fields keep the original visit.  last_utm_campaign records the
// latest campaign URL so forms can send both values.
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
  last_utm_campaign?: string;
}

const COOKIE_NAME = "inngest_first_touch";
const COOKIE_TTL_MS = 6 * 30 * 24 * 60 * 60 * 1000;

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
        if (k === "utm_campaign") {
          payload.last_utm_campaign = v;
        }
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

// the cookie keeps first-touch fields for six months.  later campaign URLs
// update last_utm_campaign so forms can report the latest campaign.
export const useFirstTouch = (
  campaign?: string | null
): {
  firstTouch: FirstTouch | null;
  existing: boolean;
} => {
  // Prevent race conditions across re-renders.
  const cached = useRef<{
    firstTouch: FirstTouch | null;
    existing: boolean;
  } | null>(null);
  const [firstTouchCookie, setFirstTouchCookie] = useCookie(COOKIE_NAME);

  useEffect(() => {
    if (!firstTouchCookie) return;

    let stored: FirstTouch;
    try {
      stored = JSON.parse(firstTouchCookie) as FirstTouch;
    } catch (e) {
      return;
    }
    if (!stored || typeof stored !== "object") return;
    const lastCampaign =
      campaign || stored.last_utm_campaign || stored.first_utm_campaign;
    if (!lastCampaign || stored.last_utm_campaign === lastCampaign) return;

    const firstSeen = Date.parse(stored.first_seen_at || "");
    const expires = new Date(
      (Number.isNaN(firstSeen) ? Date.now() : firstSeen) + COOKIE_TTL_MS
    );
    const updated = { ...stored, last_utm_campaign: lastCampaign };
    try {
      setFirstTouchCookie(JSON.stringify(updated), {
        domain: process.env.NEXT_PUBLIC_HOSTNAME,
        path: "/",
        expires,
        sameSite: "lax",
      });
      if (cached.current) cached.current.firstTouch = updated;
    } catch (e) {
      return;
    }
  }, [campaign, firstTouchCookie, setFirstTouchCookie]);

  if (!cached.current) {
    if (!firstTouchCookie) {
      // First landing — capture & persist.
      if (typeof window === "undefined") {
        // SSR: don't write anything, return null and let the client hydrate.
        return { firstTouch: null, existing: false };
      }

      const payload = captureFirstTouch();
      const sixMonthsFromNow = new Date(Date.now() + COOKIE_TTL_MS);
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
