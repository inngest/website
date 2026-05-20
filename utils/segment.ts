import { AnalyticsBrowser } from "@segment/analytics-next";

export const analytics = AnalyticsBrowser.load(
  {
    writeKey: process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY!,
    ...(process.env.NODE_ENV === "production"
      ? { cdnURL: "https://analytics-cdn.inngest.com" }
      : {}),
  },
  {
    integrations: {
      "Segment.io": {
        apiHost:
          process.env.NODE_ENV === "production"
            ? "analytics.inngest.com/v1"
            : null,
        protocol: "https",
      },
    },
  }
);
