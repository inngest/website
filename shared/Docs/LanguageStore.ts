import create from "zustand";
import { persist } from "zustand/middleware";

export type SDKLanguage = "typescript" | "python" | "go";
export type TSVersion = "v3" | "v4";

export const SDK_LANGUAGES: { id: SDKLanguage; title: string; shortTitle: string }[] = [
  { id: "typescript", title: "TypeScript", shortTitle: "TS" },
  { id: "python", title: "Python", shortTitle: "Py" },
  { id: "go", title: "Go", shortTitle: "Go" },
];

export const TS_VERSIONS: { id: TSVersion; title: string }[] = [
  { id: "v3", title: "Version 3" },
  { id: "v4", title: "Version 4 (beta)" },
];

// Map SDK titles in navigation to language IDs
export const SDK_TITLE_TO_LANGUAGE: Record<string, SDKLanguage> = {
  "TypeScript SDK v3": "typescript",
  "TypeScript SDK v4": "typescript",
  "Python SDK": "python",
  "Go SDK": "go",
};

// Map language IDs to their reference home pages
export const SDK_HOME_PAGES: Record<SDKLanguage, string> = {
  typescript: "/docs/reference/typescript",
  python: "/docs/reference/python",
  go: "/docs/reference/go/migrations/v0.8-to-v0.11", // Go has limited docs, this is first available page
};

interface LanguageState {
  language: SDKLanguage;
  setLanguage: (lang: SDKLanguage) => void;
  tsVersion: TSVersion;
  setTsVersion: (version: TSVersion) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: "typescript",
      setLanguage: (language) => set({ language }),
      tsVersion: "v3",
      setTsVersion: (tsVersion) => set({ tsVersion }),
    }),
    {
      name: "inngest-docs-language",
    }
  )
);

/**
 * Check if a given URL path belongs to a specific SDK
 */
export function getLanguageFromPath(path: string): SDKLanguage | null {
  if (path.startsWith("/docs/reference/python")) return "python";
  if (path.startsWith("/docs/reference/go")) return "go";
  if (path.startsWith("/docs/reference/typescript")) return "typescript";
  // Some TypeScript reference pages aren't under /typescript
  if (path.startsWith("/docs/reference/")) return "typescript";
  return null;
}

/**
 * Check if a path is in the Reference section
 */
export function isReferencePath(path: string): boolean {
  return path.startsWith("/docs/reference");
}

/**
 * Detect TypeScript SDK version from a URL path
 */
export function getTsVersionFromPath(path: string): TSVersion | null {
  if (path.includes("/typescript/v3/")) { return "v3"; }
  if (path.includes("/typescript/v4/")) { return "v4"; }
  return null;
}

