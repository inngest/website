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

/**
 * Emits <link rel="canonical"> in <head> using the clean pathname forwarded
 * by middleware (no query params). This ensures every page — regardless of
 * which ?ref= or UTM combination a user arrived with — declares the same
 * canonical URL to crawlers.
 */
async function CanonicalTag() {
  const hdrs = await headers();
  const pathname = hdrs.get("x-pathname") ?? "/";
  const canonical = `https://www.inngest.com${pathname}`;
  return <link rel="canonical" href={canonical} />;
}

export const metadata: Metadata = {
  metadataBase: new URL("https://www.inngest.com"),
  title: {
    default: "Inngest - Develop AI products at the speed of thought",
    template: "%s - Inngest",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="scroll-smooth">
      <head>
        <CanonicalTag />
        <link rel="preconnect" href="https://fonts-cdn.inngest.com/" />
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
        <AnnouncementBanner />
        <Header />

        <main className="text-basis">{children}</main>

        <Footer />

        <Suspense>
          <PageViews />
          <GoogleTagManger />
          <Analytics />
        </Suspense>
      </body>
    </html>
  );
}
