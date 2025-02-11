import { SectionProvider } from "shared/Docs/SectionProvider";
import { formatDate } from "src/utils/date";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const { default: Post, getStaticProps } = await import(
    `content/changelog/${slug}.mdx`
  );
  const metadata = getStaticProps().props;

  return (
    <div className="max-w-6xl mx-auto my-16 px-6 lg:px-12">
      <SectionProvider sections={[]}>
        <div className="my-20 grid grid-cols-1 md:grid-cols-4 gap-8">
          <header className="md:col-start-2 md:col-span-3">
            <p className="text-subtle text-sm mb-4">Changelog</p>
            <h1 className="text-4xl font-semibold mb-4">{metadata.title}</h1>
          </header>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 gap-y-16">
          <p className="mt-1 text-muted text-sm text-right">
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
  return [{ slug: "test" }, { slug: "prometheus-metrics-export" }];
}

export const dynamicParams = false;
