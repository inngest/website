import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";

import {
  REF_HANDOFF_COOKIE,
  REF_HANDOFF_MAX_AGE_SECONDS,
  REF_HANDOFF_MAX_ENTRIES,
  claimHandoff,
  getPageRef,
  normalizePath,
  parseHandoffCookie,
  pruneHandoffs,
  resetPageRef,
  serializeHandoffs,
  storeRefHandoff,
  trackRefPageView,
  type Handoff,
} from "./refHandoff";

const ORIGIN = "https://www.inngest.com";

/** A `document.cookie` string holding the given handoffs among other cookies. */
function cookieFor(handoffs: Handoff[]): string {
  return `other=1; ${REF_HANDOFF_COOKIE}=${serializeHandoffs(
    handoffs
  )}; theme=dark`;
}

/** Minimal browser globals: a cookie jar and a navigable location. */
class FakeBrowser {
  private jar = new Map<string, string>();
  location = new URL(`${ORIGIN}/`);

  get cookie(): string {
    return Array.from(this.jar.entries())
      .map(([k, v]) => `${k}=${v}`)
      .join("; ");
  }

  set cookie(value: string) {
    const [pair, ...attributes] = value.split(";");
    const eq = pair.indexOf("=");
    const name = pair.slice(0, eq).trim();
    const expired = attributes.some((a) => /^\s*max-age=0\s*$/i.test(a));
    if (expired) this.jar.delete(name);
    else this.jar.set(name, pair.slice(eq + 1));
  }

  visit(pathAndQuery: string) {
    this.location = new URL(pathAndQuery, ORIGIN);
  }

  /** A tracked link click: queue the handoff, then navigate. */
  click(ref: string, href: string) {
    storeRefHandoff(ref, href);
    this.visit(href);
  }
}

let browser: FakeBrowser;

function install() {
  browser = new FakeBrowser();
  const g = globalThis as any;
  g.window = {
    get location() {
      return browser.location;
    },
  };
  g.document = browser;
  resetPageRef();
}

describe("pure helpers", () => {
  it("normalizePath trims trailing slashes and keeps root", () => {
    assert.equal(normalizePath("/pricing/"), "/pricing");
    assert.equal(normalizePath("/pricing"), "/pricing");
    assert.equal(normalizePath("/"), "/");
    assert.equal(normalizePath(""), "/");
  });

  it("parseHandoffCookie reads entries among other cookies", () => {
    const h: Handoff = { ref: "footer", path: "/pricing", time: 1 };
    assert.deepEqual(parseHandoffCookie(cookieFor([h])), [h]);
  });

  it("parseHandoffCookie ignores missing, malformed and invalid entries", () => {
    assert.deepEqual(parseHandoffCookie(""), []);
    assert.deepEqual(parseHandoffCookie("other=1"), []);
    assert.deepEqual(parseHandoffCookie(`${REF_HANDOFF_COOKIE}=not-json`), []);
    assert.deepEqual(
      parseHandoffCookie(
        cookieFor([{ ref: "", path: "/x", time: 1 } as Handoff])
      ),
      []
    );
  });

  it("pruneHandoffs drops expired entries and caps the list", () => {
    const now = 100_000;
    const old: Handoff = {
      ref: "old",
      path: "/a",
      time: now - REF_HANDOFF_MAX_AGE_SECONDS * 1000 - 1,
    };
    const many: Handoff[] = Array.from(
      { length: REF_HANDOFF_MAX_ENTRIES + 3 },
      (_, i) => ({ ref: `r${i}`, path: "/b", time: now })
    );
    const pruned = pruneHandoffs([old, ...many], now);
    assert.equal(pruned.length, REF_HANDOFF_MAX_ENTRIES);
    assert.equal(pruned[0].ref, "r3"); // oldest beyond the cap dropped first
  });

  it("claimHandoff takes the oldest entry for the path and leaves the rest", () => {
    const now = 1_000;
    const entries: Handoff[] = [
      { ref: "nav", path: "/docs", time: now },
      { ref: "footer", path: "/pricing", time: now },
      { ref: "hero", path: "/pricing", time: now },
    ];
    const { ref, remaining } = claimHandoff(entries, "/pricing/", now);
    assert.equal(ref, "footer");
    assert.deepEqual(
      remaining.map((h) => h.ref),
      ["nav", "hero"]
    );
    assert.equal(claimHandoff(entries, "/blog", now).ref, null);
  });
});

describe("getPageRef in the browser", () => {
  beforeEach(install);

  it("URL ?ref= wins and is reported as a URL ref", () => {
    browser.visit("/pricing?ref=unzip.dev");
    assert.deepEqual(getPageRef(), { ref: "unzip.dev", source: "url" });
  });

  it("a tracked click hands its ref to the destination, once", () => {
    browser.click("footer", "/pricing");
    assert.deepEqual(getPageRef(), { ref: "footer", source: "click" });
    // Same page view (e.g. a form submitted later): same answer.
    assert.deepEqual(getPageRef(), { ref: "footer", source: "click" });
    // The handoff was consumed.
    assert.equal(parseHandoffCookie(browser.cookie).length, 0);
  });

  it("returning to a page through another link reports the new ref", () => {
    browser.click("nav", "/contact");
    assert.equal(getPageRef()?.ref, "nav");
    browser.visit("/pricing"); // untagged link
    assert.equal(getPageRef(), null);
    browser.click("footer", "/contact");
    assert.equal(getPageRef()?.ref, "footer");
  });

  it("returning to a page through an untagged link reports no ref", () => {
    browser.click("nav", "/contact");
    assert.equal(getPageRef()?.ref, "nav");
    browser.visit("/pricing");
    getPageRef();
    browser.visit("/contact");
    assert.equal(getPageRef(), null);
  });

  it("links opened in several tabs don't overwrite each other", () => {
    // Two cmd-clicks from the same page before either tab loads.
    browser.visit("/");
    storeRefHandoff("footer", "/pricing");
    storeRefHandoff("nav", "/docs");

    // The /docs tab loads first and claims only its own handoff.
    browser.visit("/docs");
    resetPageRef();
    assert.equal(getPageRef()?.ref, "nav");

    // The /pricing tab still finds its handoff.
    browser.visit("/pricing");
    resetPageRef();
    assert.equal(getPageRef()?.ref, "footer");
  });

  it("ignores handoffs for other origins and paths", () => {
    browser.visit("/");
    storeRefHandoff("footer", "https://example.com/pricing");
    assert.equal(parseHandoffCookie(browser.cookie).length, 0);
    storeRefHandoff("nav", "/docs");
    browser.visit("/pricing");
    assert.equal(getPageRef(), null);
  });
});

describe("ref_page_view", () => {
  beforeEach(install);

  /** ref_page_view events pushed so far, as [ref, ref_source, page_path]. */
  function pushed(): string[][] {
    const dataLayer = ((globalThis as any).window.dataLayer ?? []) as {
      event: string;
      ref: string;
      ref_source: string;
      page_path: string;
    }[];
    return dataLayer
      .filter((e) => e.event === "ref_page_view")
      .map((e) => [e.ref, e.ref_source, e.page_path]);
  }

  /** One run of the page-view effect in components/Analytics.tsx. */
  function effectRun() {
    trackRefPageView(getPageRef());
  }

  it("pushes once when the effect runs twice for the same page", () => {
    // Pages Router: the effect re-runs once search params are ready.
    browser.visit("/docs?ref=nav");
    effectRun();
    effectRun();
    assert.deepEqual(pushed(), [["nav", "url", "/docs"]]);
  });

  it("pushes again after navigating away and back", () => {
    browser.visit("/docs?ref=nav");
    effectRun();
    browser.visit("/pricing");
    effectRun();
    browser.visit("/docs?ref=nav");
    effectRun();
    assert.deepEqual(pushed(), [
      ["nav", "url", "/docs"],
      ["nav", "url", "/docs"],
    ]);
  });

  it("pushes nothing for a page without a ref", () => {
    browser.visit("/pricing");
    effectRun();
    effectRun();
    assert.deepEqual(pushed(), []);
  });

  it("pushes a click handoff once", () => {
    browser.visit("/");
    effectRun();
    browser.click("footer", "/pricing");
    effectRun();
    effectRun();
    assert.deepEqual(pushed(), [["footer", "click", "/pricing"]]);
  });
});
