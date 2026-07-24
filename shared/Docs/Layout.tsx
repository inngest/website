import Link from "next/link";
import Head from "next/head";
import { Router, useRouter } from "next/router";
import { MDXProvider } from "@mdx-js/react";
import { motion } from "framer-motion";

import * as mdxComponents from "src/shared/Docs/mdx";
import { Footer } from "./Footer";
import { Home } from "./Home";
import { Header } from "./Header";
import Logo from "../Icons/Logo";
import { Navigation, PageSidebar, ActiveSectionProvider } from "./Navigation";
import { useUnreleasedLabels } from "./Unreleased";
import { Prose } from "./Prose";
import { SectionProvider } from "./SectionProvider";
import { useMobileNavigationStore } from "./MobileNavigation";
import {
  getLanguageFromPath,
  getSdkVersionFromPath,
  TS_STABLE,
  SDK_ALL,
} from "./LanguageStore";
import { getOpenGraphImageURL } from "../../utils/social";
import clsx from "clsx";

import { Breadcrumb } from "./Breadcrumb";

const GITHUB_BRANCH = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF || "main";
const GITHUB_PREFIX = `https://github.com/inngest/website/tree/${GITHUB_BRANCH}/`;

export type JsonLdValue =
  | string
  | number
  | boolean
  | null
  | JsonLdObject
  | JsonLdValue[];
export type JsonLdObject = {
  [key: string]: JsonLdValue | undefined;
};
export type DocsStructuredData = JsonLdObject | JsonLdObject[];

function getStructuredDataList(structuredData?: DocsStructuredData) {
  if (!structuredData) {
    return [];
  }

  return Array.isArray(structuredData) ? structuredData : [structuredData];
}

// Unsure if this should be here or in the _app and conditionally run only on docs
function onRouteChange() {
  useMobileNavigationStore.getState().close();
}

Router.events.on("hashChangeStart", onRouteChange);
Router.events.on("routeChangeComplete", onRouteChange);
Router.events.on("routeChangeError", onRouteChange);

export type Props = {
  children: React.ReactNode;
  sections: [];
  /* The title automatically pulled from the h1 tag in each mdx file */
  title: string;
  /* The optional title used for meta tags (set via export const metaTitle = '...') */
  metaTitle?: string;
  /* The optional description */
  description?: string;
  /* Source file path for the current page */
  sourceFilePath?: string;
  /* Whether to hide the right hand sidebar */
  hidePageSidebar?: boolean;
  /* Optional Schema.org object(s) exported from MDX as structuredData */
  structuredData?: DocsStructuredData;
  /* Set via `export const unreleased = "label"` to gate the whole page until
     ?unreleased includes that label */
  unreleased?: string;
};

export function Layout({
  children,
  sections = [],
  title,
  metaTitle,
  description,
  sourceFilePath,
  hidePageSidebar,
  structuredData: pageStructuredData,
  unreleased,
}: Props) {
  const router = useRouter();
  // An unreleased page is hidden (body, TOC, prev/next) until ?unreleased
  // includes its label.
  const unreleasedLabels = useUnreleasedLabels();
  const gated = !!unreleased && !unreleasedLabels.has(unreleased);
  const noRightSidebar = hidePageSidebar || gated;
  const sdkLanguage = getLanguageFromPath(router.asPath) || SDK_ALL;
  const sdkVersion = getSdkVersionFromPath(router.asPath) || SDK_ALL;

  const siteTitle = `Inngest Docs`;
  const preferredTitle: string = metaTitle || title || siteTitle;
  const pageTitle =
    preferredTitle === siteTitle
      ? preferredTitle
      : `${preferredTitle} - ${siteTitle}`;
  const metaDescription =
    description || `Inngest documentation for ${preferredTitle}`;
  const metaImage = getOpenGraphImageURL({ title: preferredTitle });
  const editPageURL = sourceFilePath
    ? GITHUB_PREFIX + sourceFilePath
    : undefined;

  // Markdown alternate URL for AI/LLM discoverability
  const docsPath = router.asPath
    .replace(/^\/(docs)/, "")
    .split("?")[0]
    .split("#")[0];
  const markdownAlternateUrl = `https://www.inngest.com/docs-markdown${docsPath}`;
  const canonicalUrl = `https://www.inngest.com${
    router.asPath.split("?")[0].split("#")[0]
  }`;

  // JSON-LD structured data for documentation pages. MDX pages can export
  // `structuredData` to append page-specific FAQPage, HowTo, or similar nodes.
  const articleStructuredData: JsonLdObject = {
    "@type": "TechArticle",
    "@id": `${canonicalUrl}#article`,
    headline: preferredTitle,
    description: metaDescription,
    url: canonicalUrl,
    publisher: {
      "@type": "Organization",
      name: "Inngest",
      url: "https://www.inngest.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
  };
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      articleStructuredData,
      ...getStructuredDataList(pageStructuredData),
    ],
  };

  let tsV4Banner = null;

  // Is any of the "Learn" pages (except for the Python quick start)
  const isLearnPage =
    !router.asPath.startsWith("/docs/reference") &&
    !router.asPath.startsWith("/docs/examples") &&
    !router.asPath.includes("python");

  // Is any of the TypeScript v3 "Reference" pages
  const isOutdatedTypeScriptReferencePage =
    sdkLanguage === "typescript" &&
    sdkVersion !== SDK_ALL &&
    sdkVersion !== TS_STABLE;

  if (isOutdatedTypeScriptReferencePage) {
    tsV4Banner = (
      <div className="sticky top-14 z-30 flex items-center gap-2 border-b border-indigo-500/20 bg-indigo-50 px-4 py-2 text-sm text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
        TypeScript SDK {TS_STABLE} is now available!{" "}
        <Link
          href="/docs/reference/typescript/v4/migrations/v3-to-v4"
          className="font-medium underline"
        >
          See what&apos;s new
        </Link>
      </div>
    );
  }

  return (
    <div className="dark:bg-carbon-1000">
      <MDXProvider components={mdxComponents as any}>
        <Head>
          <title>{pageTitle}</title>
          {gated && <meta name="robots" content="noindex, nofollow" />}
          <meta name="description" content={metaDescription}></meta>
          <meta property="og:title" content={pageTitle} />
          <meta property="og:description" content={metaDescription} />
          <meta property="og:image" content={metaImage} />
          <meta property="og:type" content="article" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@inngest" />
          <meta name="twitter:title" content={pageTitle} />
          <meta name="twitter:image" content={metaImage} />

          <meta name="docsearch:sdkLanguage" content={sdkLanguage} />
          <meta name="docsearch:sdkVersion" content={sdkVersion} />

          {/* Markdown alternate for AI/LLM discoverability */}
          <link
            rel="alternate"
            type="text/markdown"
            href={`https://www.inngest.com/docs${docsPath}.md`}
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

          {/* Schema.org structured data for documentation */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(structuredData),
            }}
          />

          <script dangerouslySetInnerHTML={{ __html: modeScript }} />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.editPageURL = "${editPageURL}";
          `,
            }}
          />
        </Head>
        <ActiveSectionProvider>
          <SectionProvider sections={sections}>
            <Header />

            <div className="lg:ml-[248px] xl:ml-[280px]">
              {/* @ts-ignore */}
              <motion.header
                layoutScroll
                className="fixed inset-y-0 left-0 z-40 mt-14 contents overflow-y-auto  border-r border-subtle py-4 pb-8 pl-4 pr-3 lg:block lg:w-[248px] xl:w-[280px]"
              >
                <Navigation className="hidden lg:block" />
              </motion.header>

              {noRightSidebar ? null : (
                // @ts-ignore
                <motion.nav
                  layoutScroll
                  className="fixed inset-y-0 right-0 z-40 mt-14 hidden w-60 overflow-y-auto px-6 pb-12 pt-16 xl:block 2xl:w-96 2xl:px-10"
                >
                  <div className="pt-2">
                    <PageSidebar />
                  </div>
                </motion.nav>
              )}

              {!gated && tsV4Banner}

              <div
                className={clsx(
                  "relative px-4 pt-14 sm:px-6 lg:px-8 xl:pl-8 xl:pr-16",
                  noRightSidebar && "xl:mr-32 2xl:mr-10",
                  !noRightSidebar && "xl:mr-40 2xl:mr-80"
                )}
              >
                <main className="pt-6 lg:pt-8 xl:pr-8">
                  {gated ? (
                    <div className="py-24 text-center">
                      <h1 className="text-2xl font-semibold text-basis">
                        Page not found
                      </h1>
                      <p className="mt-3 text-subtle">
                        This page is not available.
                      </p>
                      <Link
                        href="/docs"
                        className="mt-6 inline-block font-medium text-breeze-600 hover:text-breeze-500 dark:text-breeze-300 dark:hover:text-breeze-400"
                      >
                        Back to documentation
                      </Link>
                    </div>
                  ) : (
                    <Prose as="article">
                      <Breadcrumb />
                      {children}
                      <div
                        className={
                          noRightSidebar ? "py-10" : "pb-12 pt-10 xl:pr-0"
                        }
                      >
                        <Footer editPageURL={editPageURL} />
                      </div>
                    </Prose>
                  )}
                </main>
              </div>
            </div>
          </SectionProvider>
        </ActiveSectionProvider>
      </MDXProvider>
    </div>
  );
}

const modeScript = `

  document.documentElement.classList.add('docs');

  // change to "let = darkModeMediaQuery" if/when this moves to the _document
  window.darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

  updateMode()
  window.darkModeMediaQuery.addEventListener('change', updateModeWithoutTransitions)
  window.addEventListener('storage', updateModeWithoutTransitions)

  function updateMode() {
    let isSystemDarkMode = window.darkModeMediaQuery.matches
    let isDarkMode = window.localStorage.isDarkMode === 'true' || (!('isDarkMode' in window.localStorage) && isSystemDarkMode)

    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    if (isDarkMode === isSystemDarkMode) {
      delete window.localStorage.isDarkMode
    }
  }

  function disableTransitionsTemporarily() {
    document.documentElement.classList.add('[&_*]:!transition-none')
    window.setTimeout(() => {
      document.documentElement.classList.remove('[&_*]:!transition-none')
    }, 0)
  }

  function updateModeWithoutTransitions() {
    disableTransitionsTemporarily()
    updateMode()
  }
`;
