import type { Metadata } from "next";
import fs from "fs";
import matter from "gray-matter";

import { loadMarkdownFilesMetadata } from "src/utils/markdown";
import { type BlogPost } from "src/components/Blog";
import Hero from "src/components/LandingPage/Hero";
import NewsletterSignup from "src/components/NewsletterSignup";

export const metadata: Metadata = {
  // Prevent Google from indexing gated content
  robots: "noindex",
};

export async function generateStaticParams() {
  const posts = await loadMarkdownFilesMetadata<BlogPost>("blog/_posts");
  // const filteredPosts = posts.filter((p) => p?.featured !== false);

  console.log("ok!", posts[0].slug);

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;

  let filePath = `./pages/blog/_posts/${slug}.md`;
  if (!fs.existsSync(filePath) && fs.existsSync(filePath + "x")) {
    filePath += "x";
  }

  const source = fs.readFileSync(filePath);
  const { data } = matter(source);
  const contentUrl = `/blog/${slug}`;

  return (
    <div className="text-basis">
      <Hero headline={data.heading} subheadline={data.subtitle}>
        <a
          href={"#get-access"}
          className={
            "inline-flex items-center gap-1 rounded-md font-medium px-6 py-2 transition-all whitespace-nowrap bg-cta hover:bg-ctaHover text-carbon-1000"
          }
        >
          Access the guide
        </a>
      </Hero>
      <div className="max-w-[76ch] m-auto pb-24">
        <div
          id="get-access"
          className="max-w-xl mx-auto mt-4 scroll-mt-28 flex flex-col gap-6"
        >
          {data.teaser?.map((p, idx) => (
            <p className="text-lg md:text-xl">{p}</p>
          ))}
          <NewsletterSignup
            showHeader={false}
            buttonText="Get access"
            tags={[`gate-${slug}`]}
            redirect={contentUrl}
          />
        </div>
      </div>
    </div>
  );
}
