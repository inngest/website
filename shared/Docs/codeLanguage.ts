import { type SDKLanguage } from "./LanguageStore";

// Map a code-tab title / guide key (lowercased) to a global SDK language.
export const GUIDE_KEY_TO_SDK: Record<string, SDKLanguage> = {
  typescript: "typescript",
  "typescript-middleware": "typescript",
  ts: "typescript",
  python: "python",
  py: "python",
  go: "go",
};

// Map a global SDK language to the tab titles / guide keys that represent it.
export const SDK_TO_GUIDE_KEY: Record<SDKLanguage, string[]> = {
  typescript: ["typescript", "ts", "typescript-middleware"],
  python: ["python", "py"],
  go: ["go"],
};

export type SelectedIndexInput = {
  /** Tab titles in order, e.g. ["TypeScript", "Go", "Python"]. */
  titles: string[];
  /** The globally-selected SDK language (shared across the page). */
  globalLanguage?: SDKLanguage | null;
  /** Language persisted in localStorage (already lowercased). */
  currentLanguage?: string | null;
  /** Per-group preferences, oldest first, most-recently-clicked last. */
  preferredLanguages: string[];
};

/**
 * Decide which tab of a CodeGroup is active, in priority order:
 *   1. the global SDK language (so all code blocks on a page stay in sync)
 *   2. the localStorage `currentLanguage`
 *   3. the per-group preferred language (the last tab clicked in this group)
 * Falls back to the first tab (index 0) when nothing matches.
 */
export function computeSelectedIndex({
  titles,
  globalLanguage,
  currentLanguage,
  preferredLanguages,
}: SelectedIndexInput): number {
  const lowerTitles = titles.map((title) => title?.toLowerCase());

  // 1. Global language.
  const matchingKeys =
    (globalLanguage && SDK_TO_GUIDE_KEY[globalLanguage]) || [];
  const globalMatchIndex = lowerTitles.findIndex((title) =>
    matchingKeys.includes(title)
  );
  if (globalMatchIndex !== -1) {
    return globalMatchIndex;
  }

  // 2. localStorage currentLanguage.
  if (currentLanguage) {
    const localStorageIndex = lowerTitles.findIndex(
      (title) => title === currentLanguage
    );
    if (localStorageIndex !== -1) {
      return localStorageIndex;
    }
  }

  // 3. Per-group preferred language (most recently added wins).
  const activeLanguage = [...titles].sort(
    (a, z) => preferredLanguages.indexOf(z) - preferredLanguages.indexOf(a)
  )[0];
  const preferredIndex = titles.indexOf(activeLanguage);
  return preferredIndex !== -1 ? preferredIndex : 0;
}

/**
 * Given the title of a clicked tab, describe how selection state should
 * change: always record it as this group's preference, and — when the title
 * maps to a global SDK language — return that language so the caller can
 * update the global store (the top-priority signal for `computeSelectedIndex`).
 */
export function resolveLanguageSelection(title: string): {
  preferred: string;
  sdkLanguage?: SDKLanguage;
} {
  return {
    preferred: title,
    sdkLanguage: title ? GUIDE_KEY_TO_SDK[title.toLowerCase()] : undefined,
  };
}
