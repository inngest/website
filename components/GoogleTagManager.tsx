"use client";
import { GoogleTagManager } from "@next/third-parties/google";

// Wrapper required: the library component needs to render inside a
// client boundary. Gates on NEXT_PUBLIC_GTM_ID being set so forks /
// previews without the prod container ID don't attempt to load
// `gtm.js?id=undefined` (returns 400). Real prod is unaffected.
export default function GTM() {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  if (!gtmId) return null;
  return <GoogleTagManager gtmId={gtmId} />;
}
