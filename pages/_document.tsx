import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html className="dark scroll-smooth">
        <Head>
          <link
            rel="icon"
            href={
              process.env.NEXT_PUBLIC_FAVICON
                ? `/${process.env.NEXT_PUBLIC_FAVICON}`
                : "/favicon-june-2025-light.svg"
            }
            media="(prefers-color-scheme: light)"
          />
          <link
            rel="icon"
            href={
              process.env.NEXT_PUBLIC_FAVICON
                ? `/${process.env.NEXT_PUBLIC_FAVICON}`
                : "/favicon-june-2025-dark.svg"
            }
            media="(prefers-color-scheme: dark)"
          />
          <link
            rel="preconnect"
            href="https://fonts-cdn.inngest.com/"
            crossOrigin="anonymous"
          />
          {/* Preload the primary CircularXX weights used above the fold:
              Bold (700) for headings/LCP and Regular (400) for body. */}
          <link
            rel="preload"
            as="font"
            type="font/woff2"
            href="https://fonts-cdn.inngest.com/Circular/CircularXXWeb-Bold.woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            as="font"
            type="font/woff2"
            href="https://fonts-cdn.inngest.com/Circular/CircularXXWeb-Regular.woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="stylesheet"
            href="https://fonts-cdn.inngest.com/fonts.css"
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
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
