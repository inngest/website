import { type Metadata } from "next";
import Link from "next/link";
import { MDXComponents, MDXContent } from "mdx/types";

import { SectionProvider } from "shared/Docs/SectionProvider";
import { generateMetadata } from "src/utils/social";
import { loadMarkdownFilesMetadata } from "src/utils/markdown";
import { Code } from "src/shared/Code/CodeHike";
import { formatDate } from "src/utils/date";
import { loadPost, type ChangelogEntry, getChangelogURL } from "./helpers";
import TrackChangelogView from "./TrackChangelogView";

export const metadata: Metadata = generateMetadata({
  title: "Changelog",
  description: "Updates and improvements to Inngest",
});

const components: MDXComponents = {
  Code,
};

export default async function Page() {
  const data = await loadMarkdownFilesMetadata<ChangelogEntry>(
    "content/changelog"
  );

  for (const item of data) {
    const { Post, metadata } = await loadPost(item.slug);
    item.metadata = metadata;
    item.Content = Post;
  }

  const sortedEntries = data.sort((a, b) => {
    return new Date(b.metadata.date) < new Date(a.metadata.date) ? -1 : 1;
  });

  return (
    <div className="mx-auto my-16 max-w-6xl px-6 lg:px-12">
      <div className="my-20 grid grid-cols-1 gap-8 md:grid-cols-4">
        <header className="md:col-span-3 md:col-start-2">
          <h1 className="mb-4 text-4xl font-semibold">Changelog</h1>
          <p className="text-subtle">Updates and improvements to Inngest</p>
        </header>
      </div>

      <SectionProvider sections={[]}>
        <div className="grid grid-cols-1 gap-y-4 md:gap-y-16" key={"list"}>
          {sortedEntries.map((item, idx) => (
            <div
              className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-4"
              key={`${idx}-${item.slug}`}
            >
              <p
                key={`${idx}-${item.slug}--date`}
                className="mt-1.5 text-sm text-muted md:text-right"
              >
                {formatDate(item.metadata.date)}
              </p>
              <div
                key={`${idx}-${item.slug}--content`}
                className="mb-16 md:col-span-3 md:mb-0"
              >
                <h2 className="mb-4 text-2xl font-semibold">
                  <Link
                    href={getChangelogURL(item.slug, true)}
                    className="hover:underline"
                  >
                    {item.metadata.title}
                  </Link>
                </h2>
                <div className="prose">
                  <item.Content components={components} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionProvider>
      <TrackChangelogView date={sortedEntries[0].metadata?.date} />
    </div>
  );
}
