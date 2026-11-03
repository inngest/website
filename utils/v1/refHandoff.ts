/**
 * Internal-link attribution without `?ref=` in the URL.
 *
 * Internal links have carried `?ref=<placement>` (nav, footer, docs-header…)
 * so analytics can tell which surface a click came from. That gives every page
 * a second, parameterised URL that search engines have to consolidate. This
 * module carries the same `ref` value to the next page without the URL:
 *
 *   1. An internal link carries `data-ref="<placement>"` and a clean href.
 *   2. On click, `installRefClickListener()` adds `{ ref, path, time }` to a
 *      short-lived first-party cookie. A cookie (not sessionStorage) survives
 *      full page loads between the App Router and Pages Router halves of the
 *      site, and links opened in a new tab. It holds a short list of pending
 *      handoffs, so several links opened in new tabs at once don't overwrite
 *      each other.
 *   3. On the destination page, `getPageRef()` returns `?ref=` from the URL
 *      when present (external sites, the app, sign-up links keep using it),
 *      and otherwise claims the oldest pending handoff for the current path.
 *      The claimed entry is removed, and the result is remembered for the
 *      rest of that page view, so a form submitted minutes later still sees
 *      it. A fresh handoff always wins over that memory, so returning to a
 *      page through a different link reports the new placement.
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
/** Most pending handoffs kept at once; older ones are dropped first. */
export const REF_HANDOFF_MAX_ENTRIES = 10;

/** GTM dataLayer event pushed once per page view that has a ref. */
export const REF_PAGE_VIEW_EVENT = "ref_page_view";

/** Where the ref came from: the URL query string, or a tracked link click. */
export type RefSource = "url" | "click";

export interface PageRef {
  ref: string;
  source: RefSource;
}

/** One pending handoff: a tracked click waiting for its destination. */
export interface Handoff {
  ref: string;
  /** Normalised destination path. */
  path: string;
  /** Click time, ms since epoch. */
  time: number;
}

const MAX_AGE_MS = REF_HANDOFF_MAX_AGE_SECONDS * 1000;

/** "/pricing/" and "/pricing" are the same page; "" is "/". */
export function normalizePath(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

export function serializeHandoffs(handoffs: Handoff[]): string {
  return encodeURIComponent(JSON.stringify(handoffs));
}

/**
 * Read the pending handoffs from a `document.cookie` string, oldest first.
 * Malformed entries (or a malformed cookie) are ignored.
 */
export function parseHandoffCookie(cookieString: string): Handoff[] {
  const prefix = `${REF_HANDOFF_COOKIE}=`;
  const part = cookieString
    .split(/;\s*/)
    .find((cookie) => cookie.startsWith(prefix));
  if (!part) return [];
  try {
    const data = JSON.parse(decodeURIComponent(part.slice(prefix.length)));
    if (!Array.isArray(data)) return [];
    return data.filter(
      (h): h is Handoff =>
        h &&
        typeof h.ref === "string" &&
        h.ref !== "" &&
        typeof h.path === "string" &&
        typeof h.time === "number"
    );
  } catch {
    return [];
  }
}

/** Drop expired entries and keep only the newest REF_HANDOFF_MAX_ENTRIES. */
export function pruneHandoffs(handoffs: Handoff[], now: number): Handoff[] {
  return handoffs
    .filter((h) => now - h.time >= 0 && now - h.time <= MAX_AGE_MS)
    .slice(-REF_HANDOFF_MAX_ENTRIES);
}

/**
 * Claim the oldest live handoff for `pathname`. Returns the claimed ref (or
 * null) and the handoffs that remain pending for other tabs.
 */
export function claimHandoff(
  handoffs: Handoff[],
  pathname: string,
  now: number
): { ref: string | null; remaining: Handoff[] } {
  const live = pruneHandoffs(handoffs, now);
  const path = normalizePath(pathname);
  const index = live.findIndex((h) => h.path === path);
  if (index === -1) return { ref: null, remaining: live };
  return {
    ref: live[index].ref,
    remaining: [...live.slice(0, index), ...live.slice(index + 1)],
  };
}

function cookieAttributes(maxAge: number): string {
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "; Secure"
      : "";
  return `; Max-Age=${maxAge}; Path=/; SameSite=Lax${secure}`;
}

function writeHandoffs(handoffs: Handoff[]) {
  document.cookie = handoffs.length
    ? `${REF_HANDOFF_COOKIE}=${serializeHandoffs(handoffs)}${cookieAttributes(
        REF_HANDOFF_MAX_AGE_SECONDS
      )}`
    : `${REF_HANDOFF_COOKIE}=${cookieAttributes(0)}`;
}

// The ref for the current page view, keyed by pathname + search. Stored even
// when there is no ref, so a later page view of another URL replaces it.
let current: { key: string; value: PageRef | null } | null = null;

/** Forget the current page view's ref. Exposed for tests. */
export function resetPageRef() {
  current = null;
}

/**
 * The ref for the current page, or null. Safe to call repeatedly during a
 * page view: the first call claims any pending handoff, later calls return
 * the same answer (unless a new handoff for this page has arrived since).
 */
export function getPageRef(): PageRef | null {
  if (typeof window === "undefined") return null;
  try {
    const { pathname, search } = window.location;
    const key = `${pathname}${search}`;

    const urlRef = new URLSearchParams(search).get("ref");
    if (urlRef) {
      current = { key, value: { ref: urlRef, source: "url" } };
      return current.value;
    }

    const pending = parseHandoffCookie(document.cookie);
    if (pending.length > 0) {
      const { ref, remaining } = claimHandoff(pending, pathname, Date.now());
      if (ref !== null || remaining.length !== pending.length) {
        writeHandoffs(remaining);
      }
      if (ref !== null) {
        current = { key, value: { ref, source: "click" } };
        return current.value;
      }
    }

    if (current && current.key === key) return current.value;
    current = { key, value: null };
    return null;
  } catch {
    return null;
  }
}

/** Queue a handoff for a same-origin destination. No-op for other origins. */
export function storeRefHandoff(ref: string, href: string) {
  if (typeof window === "undefined" || !ref) return;
  try {
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return;
    const now = Date.now();
    writeHandoffs(
      pruneHandoffs(
        [
          ...parseHandoffCookie(document.cookie),
          { ref, path: normalizePath(url.pathname), time: now },
        ],
        now
      )
    );
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
    // Typed locally (rather than via the global Window augmentation in
    // index.d.ts) so ts-node can run this module's tests on its own.
    const w = window as Window & { dataLayer?: unknown[] };
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({
      event: REF_PAGE_VIEW_EVENT,
      ref: pageRef.ref,
      ref_source: pageRef.source,
      page_path: window.location.pathname,
    });
  } catch (err) {
    console.warn("[refHandoff] dataLayer push failed", err);
  }
}
