/**
 * Internal-link attribution without `?ref=` in the URL.
 *
 * Internal links have carried `?ref=<placement>` (nav, footer, docs-header…)
 * so analytics can tell which surface a click came from. That gives every page
 * a second, parameterised URL that search engines have to consolidate. This
 * module carries the same `ref` value to the next page without the URL:
 *
 *   1. An internal link carries `data-ref="<placement>"` and a clean href.
 *   2. On click, `installRefClickListener()` stores `{ ref, path }` in a
 *      short-lived first-party cookie. A cookie (not sessionStorage) survives
 *      full page loads between the App Router and Pages Router halves of the
 *      site, and links opened in a new tab.
 *   3. On the destination page, `getPageRef()` returns `?ref=` from the URL
 *      when present (external sites, the app, sign-up links keep using it),
 *      and otherwise the handoff value when the cookie's path matches the
 *      current page. The cookie is cleared once read and the value is cached
 *      for the life of the page, so a form submitted minutes later still
 *      sees it.
 *
 * Everything that used to read `?ref=` from the URL (Segment page views, the
 * contact and YC forms, the demo view event) reads `getPageRef()` instead, so
 * the `ref` property in Amplitude and Attio keeps its name and values.
 *
 * Until links start carrying `data-ref`, `getPageRef()` behaves exactly like
 * reading `?ref=` from the URL.
 */

export const REF_HANDOFF_COOKIE = "inngest_ref_handoff";
export const REF_HANDOFF_MAX_AGE_SECONDS = 30;

/** GTM dataLayer event pushed once per page view that has a ref. */
export const REF_PAGE_VIEW_EVENT = "ref_page_view";

/** Where the ref came from: the URL query string, or a tracked link click. */
export type RefSource = "url" | "click";

export interface PageRef {
  ref: string;
  source: RefSource;
}

interface Handoff {
  ref: string;
  path: string;
}

/** "/pricing/" and "/pricing" are the same page; "" is "/". */
export function normalizePath(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

export function serializeHandoff(handoff: Handoff): string {
  return encodeURIComponent(JSON.stringify(handoff));
}

/** Read the handoff from a `document.cookie` string. Null if absent or malformed. */
export function parseHandoffCookie(cookieString: string): Handoff | null {
  const prefix = `${REF_HANDOFF_COOKIE}=`;
  const part = cookieString
    .split(/;\s*/)
    .find((cookie) => cookie.startsWith(prefix));
  if (!part) return null;
  try {
    const data = JSON.parse(decodeURIComponent(part.slice(prefix.length)));
    if (
      data &&
      typeof data.ref === "string" &&
      data.ref !== "" &&
      typeof data.path === "string"
    ) {
      return { ref: data.ref, path: data.path };
    }
  } catch {
    // malformed cookie — ignore
  }
  return null;
}

/**
 * Pure resolution: the URL `?ref=` wins; otherwise a handoff whose path
 * matches the current page.
 */
export function resolvePageRef(
  search: string,
  pathname: string,
  cookieString: string
): PageRef | null {
  const urlRef = new URLSearchParams(search).get("ref");
  if (urlRef) return { ref: urlRef, source: "url" };

  const handoff = parseHandoffCookie(cookieString);
  if (handoff && handoff.path === normalizePath(pathname)) {
    return { ref: handoff.ref, source: "click" };
  }
  return null;
}

function cookieAttributes(maxAge: number): string {
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "; Secure"
      : "";
  return `; Max-Age=${maxAge}; Path=/; SameSite=Lax${secure}`;
}

function clearHandoffCookie() {
  document.cookie = `${REF_HANDOFF_COOKIE}=${cookieAttributes(0)}`;
}

// The ref found for the current page, keyed by pathname + search so a
// client-side navigation resolves afresh.
let cached: { key: string; value: PageRef } | null = null;

/**
 * The ref for the current page, or null. Safe to call repeatedly: the first
 * call that finds a handoff consumes the cookie and caches the value.
 */
export function getPageRef(): PageRef | null {
  if (typeof window === "undefined") return null;
  try {
    const { pathname, search } = window.location;
    const key = `${pathname}${search}`;
    if (cached && cached.key === key) return cached.value;

    const value = resolvePageRef(search, pathname, document.cookie);
    if (value) {
      cached = { key, value };
      if (value.source === "click") clearHandoffCookie();
    }
    return value;
  } catch {
    return null;
  }
}

/** Store a handoff for a same-origin destination. No-op for other origins. */
export function storeRefHandoff(ref: string, href: string) {
  if (typeof window === "undefined" || !ref) return;
  try {
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return;
    const value = serializeHandoff({ ref, path: normalizePath(url.pathname) });
    document.cookie = `${REF_HANDOFF_COOKIE}=${value}${cookieAttributes(
      REF_HANDOFF_MAX_AGE_SECONDS
    )}`;
  } catch {
    // best effort — never block navigation
  }
}

function handleLinkClick(event: MouseEvent) {
  // Primary click (including cmd/ctrl/shift-click to a new tab or window)
  // and middle-click. Right-click "Open in new tab" fires no event and is
  // not captured.
  if (event.type === "click" && event.button !== 0) return;
  if (event.type === "auxclick" && event.button !== 1) return;

  const target = event.target as Element | null;
  const anchor = target?.closest?.("a[data-ref]") as HTMLAnchorElement | null;
  if (!anchor) return;
  storeRefHandoff(anchor.dataset.ref ?? "", anchor.href);
}

/**
 * Listen for clicks on `a[data-ref]` anywhere on the page. Capture phase, so
 * the cookie is written before Next.js's Link handler starts the navigation.
 * Returns a cleanup function (for useEffect).
 */
export function installRefClickListener(): () => void {
  if (typeof document === "undefined") return () => {};
  document.addEventListener("click", handleLinkClick, true);
  document.addEventListener("auxclick", handleLinkClick, true);
  return () => {
    document.removeEventListener("click", handleLinkClick, true);
    document.removeEventListener("auxclick", handleLinkClick, true);
  };
}

/**
 * One GTM dataLayer event per page view that has a ref, so GA4 can report
 * on `ref` as a custom dimension instead of parsing it out of page_location.
 * Fires for URL refs too, so old and new links can be compared side by side.
 */
export function pushRefPageView(pageRef: PageRef) {
  if (typeof window === "undefined") return;
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: REF_PAGE_VIEW_EVENT,
      ref: pageRef.ref,
      ref_source: pageRef.source,
      page_path: window.location.pathname,
    });
  } catch (err) {
    console.warn("[refHandoff] dataLayer push failed", err);
  }
}
