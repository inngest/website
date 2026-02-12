import type {
  ConsentCategories,
  ConsentCookieValue,
  ConsentState,
  GeoRegion,
} from "./consentTypes";

const CONSENT_COOKIE_NAME = "inngest_consent";
const GEO_COOKIE_NAME = "inngest_geo_region";
const COOKIE_MAX_AGE_DAYS = 365;

export function readConsentCookie(): ConsentCookieValue | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${CONSENT_COOKIE_NAME}=`));
  if (!match) return null;
  try {
    const value = JSON.parse(decodeURIComponent(match.split("=")[1]));
    if (value && value.v === 1 && value.categories) {
      return value as ConsentCookieValue;
    }
    return null;
  } catch {
    return null;
  }
}

export function writeConsentCookie(
  region: GeoRegion,
  categories: ConsentCategories
): void {
  const value: ConsentCookieValue = {
    v: 1,
    region,
    categories,
    consentedAt: new Date().toISOString(),
  };
  const maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie = `${CONSENT_COOKIE_NAME}=${encodeURIComponent(
    JSON.stringify(value)
  )}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function readGeoRegion(): GeoRegion {
  if (typeof document === "undefined") return "eu";
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${GEO_COOKIE_NAME}=`));
  if (!match) return "eu"; // Default to strictest
  const value = match.split("=")[1];
  if (value === "eu" || value === "ca" || value === "other") {
    return value;
  }
  return "eu";
}

export function getDefaultCategories(region: GeoRegion): ConsentCategories {
  switch (region) {
    case "eu":
      // GDPR opt-in: nothing enabled by default
      return { necessary: true, analytics: false, marketing: false };
    case "ca":
      // CCPA opt-out: tracking loads by default
      return { necessary: true, analytics: true, marketing: true };
    case "other":
      // Implied consent: tracking loads by default
      return { necessary: true, analytics: true, marketing: true };
  }
}

export function getInitialConsentState(): ConsentState {
  const cookie = readConsentCookie();
  if (cookie) {
    return {
      hasConsented: true,
      region: cookie.region,
      categories: cookie.categories,
      consentedAt: cookie.consentedAt,
    };
  }
  const region = readGeoRegion();
  return {
    hasConsented: false,
    region,
    categories: getDefaultCategories(region),
    consentedAt: null,
  };
}
