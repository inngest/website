import type { Metadata } from "next";

import Header from "src/shared/Header";
import Footer from "src/shared/Footer";
import { HeaderInit, PageViews } from "@/components/InngestClientSDK";
import GoogleTagManger from "@/components/GoogleTagManager";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Inngest - Ship reliable code, no extra infrastructure",
    template: "%s - Inngest",
  },
};

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
        <HeaderInit />
      </head>
      <body className="home font-sans bg-inngestBlack">
        <Header />

        <main className="max-w-container-desktop m-auto px-6 md:px-10 lg:px-20">
          {children}
        </main>

        <Footer disableCta={true} />

        <PageViews />
        <GoogleTagManger />
      </body>
    </html>
  );
}
