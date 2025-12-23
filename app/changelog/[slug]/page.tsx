import type { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";

import { generateMetadata as generateOgMetadata } from "src/utils/social";
import { SectionProvider } from "shared/Docs/SectionProvider";
import { formatDate } from "src/utils/date";
import { loadPost } from "../helpers";
import TrackChangelogView from "../TrackChangelogView";

type Props = {
  params: Promise<{ slug: string }>;
};

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
    <div className="mx-auto mb-32 mt-16 max-w-6xl px-6 lg:px-12">
      <SectionProvider sections={[]}>
        <div className="mt-20 grid grid-cols-1 gap-8 md:my-20 md:grid-cols-4">
          <header className="md:col-span-3 md:col-start-2">
            <p className="mb-4 text-sm text-subtle">
              <Link href="/changelog" className="hover:underline">
                Changelog
              </Link>
            </p>
            <h1 className="mb-4 text-4xl font-semibold">{metadata.title}</h1>
          </header>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-y-16">
          <p className="mt-1 text-sm text-muted md:text-right">
            {formatDate(metadata.date)}
          </p>
          <div className="md:col-span-3">
            <div className="prose">
              <Post />
            </div>
          </div>
        </div>
      </SectionProvider>
      <TrackChangelogView date={metadata.date} />
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
