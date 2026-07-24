"use client";
import { useEffect } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";

import { useAnonymousID } from "src/shared/trackingHooks";
import { useFirstTouch } from "src/shared/firstTouch";
import { trackPageView } from "src/utils/tracking";

export function PageViews() {
  const { anonymousID, existing } = useAnonymousID();
  // Capture/persist first-touch attribution (utm_*, ref, landing_url, referrer).
  // The hook is a no-op on subsequent visits because the cookie already exists.
  useFirstTouch();

  return (
    <Script
      id="js-inngest-sdk-script"
      strategy="afterInteractive"
      // @ts-ignore this should inherit base html props
      src="/inngest-sdk.js"
      onLoad={() => {
        // No-op on previews / forks that don't carry the prod
        // tracking key, or if the SDK script hasn't attached yet.
        // Silent — these aren't actionable for any user.
        if (typeof window.Inngest === "undefined") return;
        const inngestKey = process.env.NEXT_PUBLIC_INNGEST_KEY;
        if (!inngestKey) return;
        window.Inngest.init(inngestKey);
        window.Inngest.identify({ anonymous_id: anonymousID });
        // The hook should tell us if the anon id is an existing one, or it's just been set
        const firstTouch = !existing;
        // See tracking for next/link based transitions in tracking.ts
        window.Inngest.page(firstTouch);
        if (
          typeof window !== "undefined" &&
          window._inngestQueue &&
          window._inngestQueue.length
        ) {
          window._inngestQueue.forEach((p) => {
            // Prevent the double tracking of page views b/c routeChangeComplete
            // is unpredictable.
            if (p.name === "website/page.viewed") return;
            window.Inngest.event(p);
          });
        }
      }}
    />
  );
}

