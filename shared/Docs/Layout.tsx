import Link from "next/link";
import Head from "next/head";
import { Router } from "next/router";
import { MDXProvider } from "@mdx-js/react";
import { motion } from "framer-motion";

import * as mdxComponents from "src/shared/Docs/mdx";
import { Footer } from "./Footer";
import { Home } from "./Home";
import { Header } from "./Header";
import Logo from "../Icons/Logo";
import { Navigation, PageSidebar } from "./Navigation";
import { Prose } from "./Prose";
import { SectionProvider } from "./SectionProvider";
import { useMobileNavigationStore } from "./MobileNavigation";
import { getOpenGraphImageURL } from "../../utils/social";
import clsx from "clsx";
import { MDXComponents } from "mdx/types";
import { Breadcrumb } from "./Breadcrumb";

const GITHUB_BRANCH = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF || "main";
const GITHUB_PREFIX = `https://github.com/inngest/website/tree/${GITHUB_BRANCH}/`;

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
};

export function Layout({
  children,
  sections = [],
  title,
  metaTitle,
  description,
  sourceFilePath,
  hidePageSidebar,
}: Props) {
  const siteTitle = `Inngest Documentation`;
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

  return (
    <div className="dark:bg-slate-1000">
      <MDXProvider components={mdxComponents as any}>
        <Head>
          <title>{pageTitle}</title>
          <meta name="description" content={metaDescription}></meta>
          <meta property="og:title" content={pageTitle} />
          <meta property="og:description" content={metaDescription} />
          <meta property="og:image" content={metaImage} />
          <meta property="og:type" content="article" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@inngest" />
          <meta name="twitter:title" content={pageTitle} />
          <meta name="twitter:image" content={metaImage} />

          <script dangerouslySetInnerHTML={{ __html: modeScript }} />
        </Head>
        <SectionProvider sections={sections}>
          <Header />

          <div className="lg:ml-72 xl:ml-80">
            <motion.header
              layoutScroll
              className="fixed inset-y-0 mt-14 left-0 z-40 contents w-72 overflow-y-auto border-r border-slate-900/10 px-6 pt-4 pb-8 dark:border-white/10 lg:block xl:w-80"
            >
              <Navigation className="hidden lg:block" />
            </motion.header>

            {hidePageSidebar ? null : (
              <motion.nav
                layoutScroll
                className="fixed overflow-y-auto inset-y-0 mt-14 pt-16 pb-12 right-0 z-40 hidden w-60 border-l border-slate-900/10 px-6 2xl:px-10 dark:border-white/10 xl:block 2xl:w-96"
              >
                <div className="pt-2">
                  <PageSidebar />
                </div>
              </motion.nav>
            )}

            <div
              className={clsx(
                "relative px-4 pt-14 sm:px-6 lg:px-8 xl:pl-8 xl:pr-16",
                hidePageSidebar && "xl:mr-32 2xl:mr-10",
                !hidePageSidebar && "xl:mr-40 2xl:mr-80"
              )}
            >
              <main className="pt-6 lg:pt-8 xl:pr-8">
                <Breadcrumb />
                <Prose as="article">
                  {children}
                  <div
                    className={
                      hidePageSidebar ? "py-10" : "pt-10 pb-12 xl:pr-0"
                    }
                  >
                    <Footer editPageURL={editPageURL} />
                  </div>
                </Prose>
              </main>
            </div>
          </div>
        </SectionProvider>
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
