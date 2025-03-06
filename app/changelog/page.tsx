import { type Metadata } from "next";
import Link from "next/link";
import { MDXComponents, MDXContent } from "mdx/types";

import { SectionProvider } from "shared/Docs/SectionProvider";
import { generateMetadata } from "src/utils/social";
import { loadMarkdownFilesMetadata } from "src/utils/markdown";
import { Code } from "src/shared/Code/CodeHike";
import { formatDate } from "src/utils/date";
import { loadPost } from "./helpers";

export const metadata: Metadata = generateMetadata({
  title: "Changelog",
  description: "Updates and improvements to Inngest",
});
type ChangelogEntry = {
  title: string;
  date: string;
};

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
    <div className="max-w-6xl mx-auto my-16 px-6 lg:px-12">
      <div className="my-20 grid grid-cols-1 md:grid-cols-4 gap-8">
        <header className="md:col-start-2 md:col-span-3">
          <h1 className="text-4xl font-semibold mb-4">Changelog</h1>
          <p className="text-subtle">Updates and improvements to Inngest</p>
        </header>
      </div>

      <SectionProvider sections={[]}>
        <div
          className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-4 md:gap-y-16"
          key={"list"}
        >
          {sortedEntries.map((item, idx) => (
            <>
              <p
                key={`${idx}-${item.slug}--date`}
                className="mt-1.5 text-muted text-sm md:text-right"
              >
                {formatDate(item.metadata.date)}
              </p>
              <div
                key={`${idx}-${item.slug}--content`}
                className="md:col-span-3 mb-16 md:mb-0"
              >
                <h2 className="text-2xl font-semibold mb-4">
                  <Link
                    href={`/changelog/${item.slug}`}
                    className="hover:underline"
                  >
                    {item.metadata.title}
                  </Link>
                </h2>
                <div className="prose">
                  <item.Content components={components} />
                </div>
              </div>
            </>
          ))}
        </div>
      </SectionProvider>
    </div>
  );
}
