import type { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";

import { generateMetadata as generateOgMetadata } from "src/utils/social";
import { SectionProvider } from "shared/Docs/SectionProvider";
import { formatDate } from "src/utils/date";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function loadPost(slug: string) {
  const { default: Post, getStaticProps } = await import(
    `content/changelog/${slug}.mdx`
  );
  const metadata = getStaticProps().props;
  if (!metadata.date) {
    const filenameDate = slug.match(/\d\d\d\d-\d\d-\d\d/)?.[0];
    if (filenameDate) {
      metadata.date = filenameDate;
    }
  }
  return {
    Post,
    metadata,
  };
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = (await params).slug;
  const { metadata } = await loadPost(slug);
  return generateOgMetadata({
    title: metadata.title,
    description: metadata.description,
  });
}

export default async function Page({ params }: Props) {
  const slug = (await params).slug;
  const { Post, metadata } = await loadPost(slug);
  return (
    <div className="max-w-6xl mx-auto mt-16 mb-32 px-6 lg:px-12">
      <SectionProvider sections={[]}>
        <div className="mt-20 md:my-20 grid grid-cols-1 md:grid-cols-4 gap-8">
          <header className="md:col-start-2 md:col-span-3">
            <p className="text-subtle text-sm mb-4">
              <Link href="/changelog" className="hover:underline">
                Changelog
              </Link>
            </p>
            <h1 className="text-4xl font-semibold mb-4">{metadata.title}</h1>
          </header>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-y-16">
          <p className="mt-1 text-muted text-sm md:text-right">
            {formatDate(metadata.date)}
          </p>
          <div className="md:col-span-3">
            <div className="prose">
              <Post />
            </div>
          </div>
        </div>
      </SectionProvider>
    </div>
  );
}

export function generateStaticParams() {
  const fs = require("node:fs");
  const path = require("node:path");
  const baseDir = path.join(process.cwd(), "content/changelog");
  const mdxFilenames = fs.readdirSync(baseDir);
  const slugs = mdxFilenames
    .filter((filename) => filename.match(/\.mdx$/))
    .map((filename) => filename.replace(/.mdx?/, ""));
  const params = slugs.map((slug) => ({ slug }));
  return params;
}

export const dynamicParams = false;
