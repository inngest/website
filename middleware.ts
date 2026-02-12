import { NextRequest, NextResponse } from "next/server";

const GEO_COOKIE_NAME = "inngest_geo_region";

// EU/EEA/UK + EFTA + Switzerland
const EU_COUNTRIES = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR",
  "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL",
  "PL", "PT", "RO", "SK", "SI", "ES", "SE", "GB", "IS", "LI",
  "NO", "CH",
]);

export function middleware(request: NextRequest) {
  // Skip if geo cookie is already set
  if (request.cookies.get(GEO_COOKIE_NAME)) {
    return NextResponse.next();
  }

  // Vercel provides geo data via headers at the edge
  const country = request.headers.get("x-vercel-ip-country") ?? undefined;
  const region = request.headers.get("x-vercel-ip-country-region") ?? undefined;

  let geoRegion: string;
  if (!country) {
    // Fall back to strictest if geo is unavailable
    geoRegion = "eu";
  } else if (EU_COUNTRIES.has(country)) {
    geoRegion = "eu";
  } else if (country === "US" && region === "CA") {
    geoRegion = "ca";
  } else {
    geoRegion = "other";
  }

  const response = NextResponse.next();
  response.cookies.set(GEO_COOKIE_NAME, geoRegion, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
  });
  return response;
}

export const config = {
  // Run on all pages, skip static assets and API routes
  matcher: ["/((?!_next/static|_next/image|favicon|api/).*)"],
};
