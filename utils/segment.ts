import { AnalyticsBrowser } from "@segment/analytics-next";
import { segmentConsentWrapper } from "./segmentConsentWrapper";

const analyticsInstance = new AnalyticsBrowser();

// Apply the consent wrapper which controls when analytics.load() actually fires
export const analytics = segmentConsentWrapper(analyticsInstance);

/**
 * Called by ConsentContext once consent is determined.
 * The consent wrapper's shouldLoadSegment controls when load() actually executes.
 */
export function loadAnalytics() {
  analyticsInstance.load(
    {
      writeKey: process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY!,
      cdnURL: "https://analytics-cdn.inngest.com",
    },
    {
      integrations: {
        "Segment.io": {
          apiHost: "analytics.inngest.com/v1",
          protocol: "https",
        },
      },
    }
  );
}
