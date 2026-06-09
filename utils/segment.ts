import { AnalyticsBrowser } from "@segment/analytics-next";

const writeKey = process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY;

// In dev (or any environment) without a Segment write key, the
// AnalyticsBrowser.load call fetches the analytics CDN with an
// `undefined` write key and the CDN responds with "Cannot GET —
// Invalid path or write key provided", filling the console with
// noise. Guard the load: if no key, expose a Proxy stub whose every
// method is a no-op returning a resolved promise. Same surface,
// silent.
const stubAnalytics = new Proxy(
  {},
  {
    get: () => () => Promise.resolve(null),
  }
) as unknown as ReturnType<typeof AnalyticsBrowser.load>;

export const analytics = writeKey
  ? AnalyticsBrowser.load(
      {
        writeKey,
        cdnURL: "https://analytics-cdn.inngest.com",
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
    )
  : stubAnalytics;
