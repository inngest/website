import { type Metadata, type ResolvingMetadata } from "next";
import Link from "next/link";

import { generateMetadata as generateOgMetadata } from "src/utils/social";
import { formatDate } from "src/utils/date";
import { loadPost } from "@/app/_changelog/helpers";
import TrackChangelogView from "@/app/_changelog/TrackChangelogView";
import PageShell from "@/components/v1/PageShell";
import LogoMarquee from "@/components/v1/sections/Home/LogoMarquee";
import { Unreleased } from "shared/Docs/Unreleased";
import {
  BODY,
  CLOUD,
  mdxComponents,
} from "@/components/v1/sections/Changelog/mdxConfig";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = (await params).slug;
  const { metadata } = await loadPost(slug);
  const meta = generateOgMetadata({
    title: metadata.title,
    description: metadata.description,
  });
  // Keep unreleased entries out of search engines. The page still 200s and is
  // gated client-side, so noindex is the lightweight equivalent of a 404.
  if (metadata.unreleased) {
    meta.robots = { index: false, follow: false };
  }
  return meta;
}

export default async function Page({ params }: Props) {
  const slug = (await params).slug;
  const { Post, metadata } = await loadPost(slug);

  const article = (
    <article className="mx-auto w-full max-w-[820px] px-6 pb-20 pt-24 text-v1-frost sm:px-9 sm:pt-[120px] lg:px-[70px] lg:pb-32 lg:pt-[172px]">
      {/* Breadcrumb back to the changelog index. */}
      <p className="mb-5 text-v1-label-md uppercase text-v1-frost/70">
        <Link
          href="/changelog"
          className="motion-safe:transition-colors hover:text-v1-accent-salmon-light"
        >
          Changelog
        </Link>
      </p>

      <h1 className="font-v1Heading tracking-[-0.01em] text-white [font-size:clamp(1.875rem,3.8vw,3rem)] [line-height:1.1]">
        {metadata.title}
      </h1>

      <p className={`mt-5 font-v1Mono text-[12px] leading-6 ${CLOUD}`}>
        {formatDate(metadata.date)}
      </p>

      <div className={`mt-10 ${BODY}`}>
        <Post components={mdxComponents} />
      </div>
    </article>
  );

  return (
    <PageShell>
      <div className="overflow-x-clip">
        {metadata.unreleased ? (
          <Unreleased
            label={metadata.unreleased}
            fallback={
              <div className="mx-auto w-full max-w-[820px] px-6 pb-20 pt-24 text-center text-v1-frost sm:px-9 sm:pt-[120px] lg:px-[70px] lg:pb-32 lg:pt-[172px]">
                <h1 className="font-v1Heading text-white [font-size:clamp(1.875rem,3.8vw,3rem)] [line-height:1.1]">
                  Entry not found
                </h1>
                <p className="mt-5">
                  <Link
                    href="/changelog"
                    className="text-v1-frost/70 underline motion-safe:transition-colors hover:text-v1-accent-salmon-light"
                  >
                    Back to the changelog
                  </Link>
                </p>
              </div>
            }
          >
            {article}
          </Unreleased>
        ) : (
          article
        )}
      </div>

      {/* Closing stippled "Inngest" lockup above the footer, shared with
          the changelog index + Home pages. */}
      <LogoMarquee />

      <TrackChangelogView date={metadata.date} />
    </PageShell>
  );
}

export function generateStaticParams() {
  const fs = require("node:fs");
  const path = require("node:path");
  const baseDir = path.join(process.cwd(), "content/changelog");
  const mdxFilenames = fs.readdirSync(baseDir);
  const slugs = mdxFilenames
    .filter((filename: string) => filename.match(/\.mdx$/))
    .map((filename: string) => filename.replace(/.mdx?/, ""));
  return slugs.map((slug: string) => ({ slug }));
}

export const dynamicParams = false;
