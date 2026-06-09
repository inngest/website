import { Suspense } from "react";
import type { Metadata } from "next";
import { headers } from "next/headers";

import Script from "next/script";
import { PageViews } from "@/components/InngestClientSDK";
import GoogleTagManger from "@/components/GoogleTagManager";
import { getFullURL } from "src/utils/social";

import "./globals.css";
import AnnouncementBanner from "src/components/AnnouncementBanner";
import Header from "src/components/RedesignedLanding/Header/Header";
import Footer from "src/components/RedesignedLanding/Footer";
import Analytics from "@/components/Analytics";
import { isV1Enabled, isV1Route } from "@/utils/v1/routes";

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
    images: [getFullURL("/assets/homepage/open-graph-june-2025.png?v=2")],
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = (await headers()).get("x-pathname") ?? "";
  const useV1Chrome = isV1Enabled() && isV1Route(pathname);
  // The pathname is empty for static /_not-found / /404 prerenders; skip the
  // legacy chrome there so its env-driven Link hrefs don't break the build.
  const hideChrome = pathname === "";

  return (
    <html className="scroll-smooth" suppressHydrationWarning>
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
        <link rel="stylesheet" href="https://fonts-cdn.inngest.com/fonts.css" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.4.0/styles/github-dark.min.css"
        />
        <Script
          id="js-inngest-queue-init"
          async
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `window._inngestQueue=[];if(typeof window.Inngest==="undefined"){window.Inngest={event:function(p){window._inngestQueue.push(p);}}}`,
          }}
        />
      </head>
      <body className="dark font-sans">
        {!useV1Chrome && !hideChrome && <AnnouncementBanner />}
        {!useV1Chrome && !hideChrome && <Header />}

        <main className="text-basis">{children}</main>

        {!useV1Chrome && !hideChrome && <Footer />}

        <Suspense>
          <PageViews />
          <GoogleTagManger />
          <Analytics />
        </Suspense>
      </body>
    </html>
  );
}
