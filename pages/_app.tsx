import React, { useEffect } from "react";
import Head from "next/head";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import Script from "next/script";
import GoogleTagManager from "@/components/GoogleTagManager";

import { trackPageView } from "../utils/tracking";
import { getOpenGraphImageURL } from "../utils/social";
import { useAnonymousID } from "../shared/trackingHooks";
import "../styles/globals.css";
import * as fullstory from "@fullstory/browser";

import {
  Layout as DocsLayout,
  type Props as DocsLayoutProps,
} from "../shared/Docs/Layout";
import {
  Layout as CaseStudyLayout,
  type Props as CaseStudyLayoutProps,
} from "../shared/CaseStudy/Layout";

import type { PageProps } from "@/shared/types";
import AnnouncementBanner from "src/components/AnnouncementBanner";

function DefaultLayout({ children }) {
  return (
    <>
      <AnnouncementBanner />
      {children}
    </>
  );
}

type DefaultProps = PageProps & DocsLayoutProps & CaseStudyLayoutProps;

function MyApp({ Component, pageProps }: AppProps<DefaultProps>) {
  const router = useRouter();
  const { anonymousID, existing } = useAnonymousID();

  // Temp Layout swapping before we move to "app" dir
  const isDocs = !!router.asPath.match(/^\/docs/);
  const isCaseStudy = !!router.asPath.match(/^\/customers\//);
  const Layout = isDocs
    ? DocsLayout
    : isCaseStudy
    ? CaseStudyLayout
    : DefaultLayout;

  useEffect(() => {
    fullstory.init({ orgId: "o-1CVB8R-na1" });

    const htmlEl = document.getElementsByTagName("html")[0];
    if (pageProps.htmlClassName) {
      htmlEl.className = pageProps.htmlClassName;
    }
    if (pageProps.designVersion) {
      htmlEl.classList.add(`v${pageProps.designVersion}`);
    } else {
      htmlEl.classList.add(`v2`);
    }
    if (isDocs) {
      htmlEl.classList.add(`docs`);
    } else {
      htmlEl.classList.remove(`docs`);
    }
  });
  useEffect(() => {
    const handleRouteChange = (url) => {
      // Track page views when using Next's Link component as it doesn't do a full refresh
      trackPageView(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  const title =
    pageProps?.meta?.title ||
    "Reliable serverless background functions on any platform";
  const metaTitle = `Inngest - ${title}`;
  const disableMetadata = Boolean(
    isDocs || isCaseStudy || pageProps?.meta?.disabled === true
  );
  // Warn during local dev
  if (
    !disableMetadata &&
    !pageProps?.meta?.title &&
    process.env.NODE_ENV !== "production"
  ) {
    const INNGEST_SDK_URLS = [
      "/api/inngest",
      "/x/inngest",
      "/.redwood/functions/inngest",
      "/.netlify/functions/inngest",
    ];
    // Ignore the dev server polling for functions
    if (!INNGEST_SDK_URLS.includes(router.asPath)) {
      console.warn(
        `WARNING: meta tags are not set for this page, please set via getStaticProps (${router.asPath})`
      );
    }
  }

  const canonicalUrl = `https://www.inngest.com${
    router.asPath === "/" ? "" : router.asPath
  }`.split("?")[0];
  const ogImage = pageProps?.meta?.image
    ? pageProps.meta.image.match(/^\//) // Prefix URLs starting with "/" with the host
      ? `${process.env.NEXT_PUBLIC_HOST}${pageProps.meta.image}`
      : pageProps.meta.image
    : getOpenGraphImageURL({ title: title });

  return (
    <>
      <Head>
        {/* Set this for all pages */}
        <meta property="og:url" content={canonicalUrl} />

        {/* Sections of the site like the blog and docs set these using different data */}
        {!disableMetadata && (
          <>
            <title>{metaTitle}</title>
            {pageProps?.meta?.description && (
              <meta name="description" content={pageProps.meta.description} />
            )}
            {pageProps?.meta?.description && (
              <meta
                property="og:description"
                content={pageProps.meta.description}
              />
            )}
            <meta property="og:image" content={ogImage} />
            <meta property="og:title" content={metaTitle} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@inngest" />
            <meta name="twitter:title" content={metaTitle} />
            {pageProps?.meta?.description && (
              <meta
                name="twitter:description"
                content={pageProps?.meta?.description}
              />
            )}
            <meta name="twitter:image" content={ogImage} />
          </>
        )}
        <link rel="canonical" href={canonicalUrl} />
      </Head>

      <Layout {...pageProps}>
        <Component {...pageProps} />
      </Layout>

      <Script
        id="js-inngest-sdk-script"
        strategy="afterInteractive"
        // @ts-ignore this should inherit base html props
        src="/inngest-sdk.js"
        onLoad={() => {
          window.Inngest.init(process.env.NEXT_PUBLIC_INNGEST_KEY);
          window.Inngest.identify({ anonymous_id: anonymousID });
          // The hook should tell us if the anon id is an existing one, or it's just been set
          const firstTouch = !existing;
          // See tracking for next/link based transitions in tracking.ts
          window.Inngest.event({
            name: "website/page.viewed",
            data: {
              first_touch: firstTouch,
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
      />
      <GoogleTagManager />
    </>
  );
}

export default MyApp;
