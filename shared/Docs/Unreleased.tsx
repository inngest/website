"use client";
import { useEffect, useState } from "react";

const PARAM = "unreleased";

// Parse a comma-separated label list ("score,eval") into trimmed, non-empty labels.
function parseLabels(value: string | null | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

// Empty during SSR/SSG and on the first client render, so unreleased content is
// never present in the static HTML the Algolia crawler reads. Labels appear only
// after mount, on the client, from ?unreleased=a,b (or labels seen earlier this
// session) — invisible to the crawler, which never has the param.
export function useUnreleasedLabels(): Set<string> {
  const [labels, setLabels] = useState<Set<string>>(() => new Set());
  useEffect(() => {
    const fromUrl = parseLabels(
      new URLSearchParams(window.location.search).get(PARAM)
    );
    const fromStore = parseLabels(sessionStorage.getItem(PARAM));
    const merged = new Set([...fromStore, ...fromUrl]);
    if (fromUrl.length)
      sessionStorage.setItem(PARAM, Array.from(merged).join(","));
    // No labels anywhere (the common case) → leave state untouched so public
    // pages do zero extra re-renders.
    if (merged.size) setLabels(merged);
  }, []);
  return labels;
}

export function Unreleased({
  label,
  children,
  fallback = null,
}: {
  label: string;
  children: React.ReactNode;
  // Rendered instead of `children` when the label isn't visible. Defaults to
  // nothing (inline use); pass a "not found" placeholder when gating a whole page.
  fallback?: React.ReactNode;
}) {
  return useUnreleasedLabels().has(label) ? <>{children}</> : <>{fallback}</>;
}

// Recursively drop nav entries whose `unreleased` label isn't visible. Nav is a
// data structure, not JSX, so an `unreleased: "label"` field is the equivalent of
// wrapping it in <Unreleased>.
export function filterUnreleasedNav<T>(items: T[], labels: Set<string>): T[] {
  return items
    .filter((item) => {
      const label = (item as { unreleased?: string }).unreleased;
      return !label || labels.has(label);
    })
    .map((item) => {
      const links = (item as { links?: unknown[] }).links;
      return Array.isArray(links)
        ? ({ ...item, links: filterUnreleasedNav(links as T[], labels) } as T)
        : item;
    });
}
