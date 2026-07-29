import { Suspense } from "react";
import type { Metadata } from "next";

import Script from "next/script";
import { PageViews } from "@/components/InngestClientSDK";
import GoogleTagManger from "@/components/GoogleTagManager";
import { getFullURL } from "src/utils/social";

import "./globals.css";
import Analytics from "@/components/Analytics";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.inngest.com"),
  alternates: {
    canonical: "./",
  },
  title: {
    default: "Develop AI products at the speed of thought | Inngest",
    template: "%s | Inngest",
  },
  openGraph: {
    // We cannot dynamically set the image URL with the page title, so we use this default
    images: [getFullURL("/assets/homepage/open-graph-2026.png")],
  },
  icons: {
    icon: [
      {
        url: process.env.NEXT_PUBLIC_FAVICON
          ? `/${process.env.NEXT_PUBLIC_FAVICON}`
          : "/favicon-june-2025-light.svg",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: process.env.NEXT_PUBLIC_FAVICON
          ? `/${process.env.NEXT_PUBLIC_FAVICON}`
          : "/favicon-june-2025-dark.svg",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
};

// Root layout is intentionally chrome-free: it only sets up <html>/<body>,
// fonts, and analytics. Page chrome is supplied per route group —
// redesigned (v1) pages self-shell via PageShell; legacy pages get their
// Header/Footer from app/(v0)/layout.tsx. Keeping this layout free of
// request-time APIs (e.g. headers()) lets static pages prerender.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <head>
        <link
          rel="preconnect"
          href="https://fonts-cdn.inngest.com/"
          crossOrigin="anonymous"
        />
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
          rel="preload"
          as="font"
          type="font/woff2"
          href="/assets/v1/fonts/ABCWhyte-Regular.woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="/assets/v1/fonts/ABCWhyteMono-Regular.woff2"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href="https://fonts-cdn.inngest.com/fonts.css" />
        <Script
          id="js-inngest-queue-init"
          async
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `window._inngestQueue=[];if(typeof window.Inngest==="undefined"){window.Inngest={event:function(p){window._inngestQueue.push(p);}}}`,
          }}
        />
      </head>
      <body className="dark font-sans text-basis">
        {children}

        <Suspense>
          <PageViews />
          <GoogleTagManger />
          <Analytics />
        </Suspense>
      </body>
    </html>
  );
}
