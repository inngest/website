import Header from "src/shared/Header";
import Footer from "src/shared/Footer";
import Script from "next/script";
import { useAnonymousID } from "../shared/trackingHooks";

import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <link rel="icon" href={`/${process.env.NEXT_PUBLIC_FAVICON}`} />
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.4.0/styles/github-dark.min.css"
        />
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
      </head>
      <body className="home font-sans bg-slate-1000">
        <Header />

        <main className="max-w-container-desktop m-auto px-6 md:px-10 lg:px-20">
          {children}
        </main>

        <Footer />

        {/* <Script
          id="js-inngest-sdk-script"
          strategy="afterInteractive"
          src="/inngest-sdk.js"
          onLoad={() => {
            window.Inngest.init(process.env.NEXT_PUBLIC_INNGEST_KEY);
            window.Inngest.identify({ anonymous_id: anonymousID });
            // The hook should tell us if the anon id is an existing one, or it's just been set
            const firstTouch = !existing;
            let ref = null;
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
        /> */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GTAG_ID}`}
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${process.env.NEXT_PUBLIC_GTAG_ID}');
      `,
          }}
        />
      </body>
    </html>
  );
}
