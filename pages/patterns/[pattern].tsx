import React from "react";
import { GetStaticProps, GetStaticPaths } from "next";
import { MDXRemote } from "next-mdx-remote";

import Container from "src/shared/layout/Container";
import Header from "../../shared/Header";
import Footer from "../../shared/Footer";
import { loadMarkdownFile, Heading } from "utils/markdown";
import * as MDXComponents from "../../shared/Patterns/mdx";
import { SECTIONS } from "./index";
import { Button } from "src/shared/Button";
import { SectionProvider } from "src/shared/Docs/SectionProvider";

const getPatternProps = (slug: string) => {
  return SECTIONS.map((s) => s.articles)
    .flat()
    .find((a) => a.slug === slug);
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const slug = Array.isArray(ctx?.params?.pattern)
    ? ctx?.params?.pattern[0]
    : ctx?.params?.pattern;
  const pageInfo = getPatternProps(slug || "");
  const pageData = await loadMarkdownFile("pages/patterns/_patterns", slug);
  return {
    props: {
      ...pageInfo,
      ...pageData,
      designVersion: "2",
      meta: {
        title: "Patterns: Async + Event-Driven",
        description:
          "A collection of software architecture patterns for asynchronous flows",
        image: "/assets/patterns/og-image-patterns.jpg",
      },
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = SECTIONS.map((s) => s.articles.map((a) => a.slug)).flat();
  // TEMP - filter only paths that have valid slugs
  const paths = slugs
    .filter((s) => s !== "#TODO")
    .map((slug) => ({ params: { pattern: slug } }));
  return { paths, fallback: false };
};

type Props = {
  title: string;
  subtitle: string;
  tags: string[];
  headings: Heading[];
  compiledSource: string;
};

export default function Patterns({
  title,
  subtitle,
  tags,
  headings,
  compiledSource,
}: Props) {
  return (
    <div className="relative">
      <Header />

      <Container className="pt-12 pb-20">
        <div className="text-left max-w-[65ch] m-auto lg:max-w-none">
          <header>
            <Button href="/patterns" variant="secondary" size="sm" arrow="left">
              Back to Patterns
            </Button>

            <h1 className="text-basis font-semibold text-3xl mt-8 sm:text-5xl tracking-tighter">
              {title}
            </h1>
          </header>
          <p className="text-subtle text-base md:text-lg mt-2 mb-6 max-w-[640px]">
            {subtitle}
          </p>
          <div className="flex gap-2">
            {tags.map((t) => (
              <span
                key={t}
                className="py-1 px-2 rounded bg-surfaceMuted text-basis group-hover/card:text-slate-500 transition-all font-medium text-xs"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </Container>
      <div>
        <Container className="lg:grid lg:grid-cols-3 sm:pt-8">
          <aside className="max-w-[65ch] lg:max-w-[320px] xl:max-w-[400px] bg-surfaceSubtle sm:rounded p-6 pr-8 xl:pr-12 xl:p-8 lg:sticky top-32 -mx-6 sm:mx-auto mb-12 lg:col-start-4 self-start ">
            <h3 className="text-sm text-subtle font-medium">Jump to</h3>
            <ol className="mt-2 flex flex-col gap-2">
              {headings.map((h) => (
                <li key={h.slug} className=" ">
                  <a
                    href={`#${h.slug}`}
                    className="text-basis text-sm font-medium tracking-tight hover:underline transition-all leading-tight "
                  >
                    {h.title}
                  </a>
                </li>
              ))}
            </ol>
          </aside>

          {/* <article className="col-span-3 row-start-1 col-start-1 xl:col-start-2 xl:col-span-3 max-w-[65ch] prose m-auto mb-20 prose-img:rounded-lg prose-code:bg-slate-800 prose-code:tracking-tight text-slate-300 prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline hover:prose-a:text-white prose-a:font-medium prose-a:transition-all prose-invert"> */}
          <article className="lg:col-span-3 lg:pr-12 xl:pr-20 lg:col-start-1 lg:row-start-1 max-w-[65ch] lg:max-w-none m-auto lg:m-0 prose mb-20 prose-img:rounded-lg prose-code:bg-canvasMuted text-basis prose-a:text-link prose-a:no-underline hover:prose-a:underline prose-a:font-medium prose-a:transition-all prose-invert">
            <SectionProvider sections={[]}>
              {/* @ts-ignore */}
              <MDXRemote
                compiledSource={compiledSource}
                components={MDXComponents}
              />
            </SectionProvider>
          </article>
          {/* <div className="col-start-2 col-span-3 max-w-[65ch]">
          <Button
            href="/patterns"
            variant="secondary"
            size="sm"
            arrow="left"
            className="col-start-2 place-self-start"
          >
            Back to Patterns
          </Button>
        </div> */}
        </Container>
      </div>

      <Footer />
    </div>
  );
}
