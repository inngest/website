import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { RiBookOpenLine } from "@remixicon/react";

import Container from "src/shared/layout/Container";
import ContentDownloadForm from "src/components/ContentDownloadForm";
import {
  CONTENT_ASSETS,
  CONTENT_ASSET_SLUGS,
} from "src/shared/contentAssets";
import { generateMetadata as buildMetadata } from "src/utils/social";

type Props = {
  params: Promise<{ asset: string }>;
};

/**
 * Pre-render a static page for every registered asset slug at build time.
 * Unknown slugs fall through to `notFound()` below at request time.
 */
export async function generateStaticParams() {
  return CONTENT_ASSET_SLUGS.map((asset) => ({ asset }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { asset } = await params;
  const data = CONTENT_ASSETS[asset];

  if (!data) {
    return {
      title: "Content not found",
      robots: "noindex",
    };
  }

  return buildMetadata({
    title: `Download — ${data.title}`,
    description: data.description,
  });
}

/**
 * Generic content-download landing page. Reads asset metadata from the
 * `CONTENT_ASSETS` lookup and renders a minimal placeholder layout with the
 * shared `<ContentDownloadForm />`.
 *
 * Adding a new content download is a one-line change to `shared/contentAssets`
 * — no new page file needed. If a specific asset needs a bespoke design, add
 * a static route at `app/content/<slug>/page.tsx` and Next.js will resolve
 * the static route before this dynamic catch-all.
 */
export default async function Page({ params }: Props) {
  const { asset } = await params;
  const data = CONTENT_ASSETS[asset];

  if (!data) {
    notFound();
  }

  return (
    <div className="font-sans text-basis">
      <Container>
        <main className="m-auto max-w-3xl pb-8 pt-4 sm:pt-16">
          <header className="m-auto max-w-3xl pt-12 text-center lg:pt-24">
            {data.eyebrow && (
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-subtle bg-white/5 px-3 py-1 text-sm text-subtle">
                <RiBookOpenLine className="h-4 w-4" />
                {data.eyebrow}
              </p>
            )}
            <h1 className="mb-2 text-2xl font-bold tracking-tight text-white md:mb-6 md:text-4xl lg:leading-loose xl:text-5xl">
              {data.title}
            </h1>
            <p className="text-balance">{data.description}</p>
          </header>

          <div className="mx-auto my-12 max-w-xl">
            <ContentDownloadForm
              asset={data.slug}
              button={data.buttonCopy}
              redirectTo={data.redirectTo}
            />
          </div>
        </main>
      </Container>
    </div>
  );
}
