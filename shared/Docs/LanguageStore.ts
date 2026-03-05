import create from "zustand";
import { persist } from "zustand/middleware";

export type SDKLanguage = "typescript" | "python" | "go";

const tsVersions = ["v3", "v4"] as const;
export type TSVersion = (typeof tsVersions)[number];
function isTSVersion(version: string): version is TSVersion {
  return tsVersions.includes(version as TSVersion);
}

// Source of truth is TS_STABLE_VERSION in next.config.mjs, exposed here
// via NEXT_PUBLIC_TS_STABLE so both build rewrites and client code agree.
const tsStableEnvVar = process.env.NEXT_PUBLIC_TS_STABLE ?? "v3";
if (!isTSVersion(tsStableEnvVar)) {
  throw new Error(`Invalid NEXT_PUBLIC_TS_STABLE env var: ${tsStableEnvVar}`);
}
export const TS_STABLE = tsStableEnvVar;

export const SDK_LANGUAGES: { id: SDKLanguage; title: string; shortTitle: string }[] = [
  { id: "typescript", title: "TypeScript", shortTitle: "TS" },
  { id: "python", title: "Python", shortTitle: "Py" },
  { id: "go", title: "Go", shortTitle: "Go" },
];

export const TS_VERSIONS: { id: TSVersion; title: string }[] = [
  { id: "v4", title: "Version 4 (Beta)" },
  { id: "v3", title: "Version 3" },
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
      tsVersion: TS_STABLE,
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
 * Strip the stable TS version prefix from a `router.pathname` so it matches the
 * versionless hrefs used in the nav. Rewrites cause `router.pathname` to
 * contain the versioned path (e.g. /typescript/v3/intro) while nav links use
 * versionless paths (e.g. /typescript/intro).
 */
export function normalizeTsReferencePath(path: string): string {
  return path.replace(`/typescript/${TS_STABLE}/`, "/typescript/");
}

/**
 * Detect TypeScript SDK version from a URL path
 */
export function getTsVersionFromPath(path: string): TSVersion | null {
  if (path.includes("/typescript/v4/") || path.endsWith("/typescript/v4")) { return "v4"; }
  if (path.includes("/typescript/v3/") || path.endsWith("/typescript/v3")) { return "v3"; }

  // Versionless TypeScript reference paths map to stable
  if (path === "/docs/reference/typescript" || path.startsWith("/docs/reference/typescript/")) { return TS_STABLE; }
  return null;
}
