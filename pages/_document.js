import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html className="scroll-smooth">
        <Head>
          <link rel="icon" href={`/${process.env.NEXT_PUBLIC_FAVICON}`} />
          <link rel="preconnect" href="https://rsms.me/" />
          <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link
            href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap"
            rel="stylesheet"
          />
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
        </Head>
        <body className="light-theme">
          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `
               (function(){
                // Any page with a base path matching this will enable light mode
                const THEME_SUPPORT = [
                  "/docs",
                  "/blog"
                ];
                 const hasThemeSupport = !!THEME_SUPPORT.find(function(p) {
                  return document.location.pathname.indexOf(p) === 0;
                 });
                 const theme = window.localStorage.getItem("theme");
                 if (hasThemeSupport && theme) {
                  document.body.classList.add(theme + "-theme");
                 }
               })();
              `,
            }}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
