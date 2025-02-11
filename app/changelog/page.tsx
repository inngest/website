import { type Metadata } from "next";
import { MDXComponents, MDXContent } from "mdx/types";

import { SectionProvider } from "shared/Docs/SectionProvider";
import { generateMetadata } from "src/utils/social";
import { loadMarkdownFilesMetadata } from "src/utils/markdown";
import { Code } from "src/shared/Code/CodeHike";
import { formatDate } from "src/utils/date";

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
    const {
      default: Content,
      getStaticProps,
    }: { default: MDXContent; getStaticProps } = await import(
      `content/changelog/${item.slug}.mdx`
    );

    item.metadata = getStaticProps().props;
    item.Content = Content;
  }

  const sortedEntries = data.sort((a, b) => {
    return new Date(b.date) > new Date(a.date) ? -1 : 1;
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
          className="grid grid-cols-1 md:grid-cols-4 gap-8 gap-y-16"
          key={"list"}
        >
          {sortedEntries.map((item, idx) => (
            <>
              <p
                key={`${idx}-${item.slug}--date`}
                className="mt-1.5 text-muted text-sm text-right"
              >
                {formatDate(item.metadata.date)}
              </p>
              <div
                key={`${idx}-${item.slug}--content`}
                className="md:col-span-3"
              >
                <h2 className="text-2xl font-semibold mb-4">
                  {item.metadata.title}
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
