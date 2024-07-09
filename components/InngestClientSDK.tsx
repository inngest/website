"use client";
import { useEffect } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";

import { useAnonymousID } from "src/shared/trackingHooks";
import { trackPageView } from "src/utils/tracking";

export function PageViews() {
  const { anonymousID, existing } = useAnonymousID();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Client side navigation via next/link
  useEffect(() => {
    if (typeof window.Inngest === "undefined") {
      console.warn("Inngest is not initialized");
      return;
    }
    const ref = searchParams.get("ref");

    window.Inngest.event({
      name: "website/page.viewed",
      data: {
        first_touch: false,
        ref,
      },
      v: "2022-12-27.1",
    });
  }, [pathname, searchParams]);

  return (
    <Script
      id="js-inngest-sdk-script"
      strategy="afterInteractive"
      // @ts-ignore this should inherit base html props
      src="/inngest-sdk.js"
      onLoad={() => {
        window.Inngest.init(process.env.NEXT_PUBLIC_INNGEST_KEY);
        window.Inngest.identify({ anonymous_id: anonymousID });
        // The hook should tell us if the anon id is an existing one, or it's just been set
        const firstTouch = !existing;
        let ref: string | null = null;
        try {
          const urlParams = new URLSearchParams(window.location.search);
          ref = urlParams.get("ref");
        } catch (e) {}
        // See tracking for next/link based transitions in tracking.ts
        window.Inngest.event({
          name: "website/page.viewed",
          data: {
            first_touch: firstTouch,
            ref: ref,
          },
          v: "2022-12-27.1",
        });
        if (typeof window !== "undefined" && window._inngestQueue.length) {
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

export function HeaderInit() {
  return (
    <script
      // We use a simple array queue to send any events after the SDK is loaded
      // These are sent onLoad where the script is loaded in _app.js
      type="text/javascript"
      dangerouslySetInnerHTML={{
        __html: `
          window._inngestQueue = [];
          if (typeof window.Inngest === "undefined") {
            window.Inngest = { event: function(p){ window._inngestQueue.push(p); } };
          }
        `,
      }}
    />
  );
}
