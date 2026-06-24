"use client";
import { useEffect, useState } from "react";

const PARAM = "beta";

// False during SSR/SSG and on the first client render, so wrapped content is
// never present in the static HTML the Algolia crawler reads. It flips true
// only after mount, on the client, when ?beta is in the URL (or was seen
// earlier this session) — invisible to the crawler, which never has the param.
export function useBetaVisible(): boolean {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const has = new URLSearchParams(window.location.search).has(PARAM);
    if (has) sessionStorage.setItem(PARAM, "1");
    setVisible(has || sessionStorage.getItem(PARAM) === "1");
  }, []);
  return visible;
}

export function Beta({ children }: { children: React.ReactNode }) {
  return useBetaVisible() ? <>{children}</> : null;
}

// Recursively drop nav entries marked `beta` unless beta content is visible.
// Nav is a data structure, not JSX, so it can't be wrapped in <Beta> directly;
// a `beta: true` field gated by the same check is the equivalent.
export function filterBetaNav<T>(items: T[], betaVisible: boolean): T[] {
  return items
    .filter((item) => betaVisible || !(item as { beta?: boolean }).beta)
    .map((item) => {
      const links = (item as { links?: unknown[] }).links;
      return Array.isArray(links)
        ? ({ ...item, links: filterBetaNav(links as T[], betaVisible) } as T)
        : item;
    });
}
