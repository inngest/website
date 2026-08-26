import type { MouseEvent } from "react";

import { analytics } from "@/utils/segment";

// How long we're willing to wait for the Customer.io Data Pipelines
// (Segment-protocol) client to resolve an anonymous ID before giving up
// and navigating with the original, unmodified URL. `analytics.user()`
// only resolves once the client has finished loading -- if it's blocked
// (ad blocker, offline, slow network) that promise can hang indefinitely,
// so this bounds how long the "Start Free" click can be held up.
const ANONYMOUS_ID_TIMEOUT_MS = 300;

/**
 * Appends the current Customer.io Data Pipelines anonymous ID to `url` as
 * `ajs_aid`, read at call time (not page load), so visitor identity
 * survives the www -> app subdomain hop and isn't lost from marketing
 * attribution on signup.
 *
 * Any failure to resolve the id -- client not loaded yet, blocked, timeout,
 * or malformed `url` -- falls back to returning `url` unchanged. This never
 * throws.
 */
export async function withAnonymousId(url: string): Promise<string> {
  if (!url || url === "#") return url;

  let anonymousId: string | null | undefined;
  try {
    const user = await Promise.race([
      analytics.user(),
      new Promise<null>((resolve) => {
        setTimeout(() => resolve(null), ANONYMOUS_ID_TIMEOUT_MS);
      }),
    ]);
    anonymousId = user?.anonymousId?.();
  } catch {
    return url;
  }

  if (!anonymousId) return url;

  try {
    const destination = new URL(url, window.location.origin);
    destination.searchParams.set("ajs_aid", anonymousId);
    return destination.toString();
  } catch {
    // Malformed/unparseable URL -- bail out to the original rather than
    // risk sending the visitor somewhere broken.
    return url;
  }
}

/**
 * Click handler for the "Start Free" nav CTA (desktop header + mobile
 * menu). Stops the default navigation, resolves the anonymous id, and
 * navigates to `href` with `ajs_aid` appended when available -- or to the
 * original `href` if anything above goes wrong. Scoped to this one CTA;
 * every other link to app.inngest.com is untouched.
 */
export function handleStartFreeClick(href: string) {
  return (event: MouseEvent<HTMLAnchorElement>) => {
    if (!href || href === "#") return;
    event.preventDefault();
    void withAnonymousId(href).then((destination) => {
      window.location.href = destination;
    });
  };
}
