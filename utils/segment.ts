import { AnalyticsBrowser } from "@segment/analytics-next";

export const analytics = AnalyticsBrowser.load(
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
