"use client";

import { useEffect, useRef } from "react";
import { GoogleTagManager } from "@next/third-parties/google";
import { useConsent } from "@/components/consent/useConsent";

// Note - there is an issue with using this library component directly
// without wrapping in a client component, so we have to use this wrapper.
export default function GTM() {
  return (
    <>
      <ConsentModeDefaults />
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
      <ConsentModeUpdater />
    </>
  );
}

/**
 * Sets Google Consent Mode v2 defaults to "denied" before GTM loads.
 * This allows GA4 to send anonymous cookieless pings for modeled conversions.
 */
function ConsentModeDefaults() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            'analytics_storage': 'denied',
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied',
            'wait_for_update': 500
          });
          gtag('set', 'url_passthrough', true);
          gtag('set', 'ads_data_redaction', true);
        `,
      }}
    />
  );
}

/**
 * Pushes consent updates to GTM dataLayer when consent state changes.
 */
function ConsentModeUpdater() {
  const { categories, hasConsented } = useConsent();
  const prevConsented = useRef(false);

  useEffect(() => {
    // Only push updates after user has actively consented
    if (!hasConsented) return;
    // Skip the initial render if consent was already set (handled by ConsentContext)
    if (!prevConsented.current) {
      prevConsented.current = true;
    }

    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        analytics_storage: categories.analytics ? "granted" : "denied",
        ad_storage: categories.marketing ? "granted" : "denied",
        ad_user_data: categories.marketing ? "granted" : "denied",
        ad_personalization: categories.marketing ? "granted" : "denied",
      });
    }
  }, [categories, hasConsented]);

  return null;
}
