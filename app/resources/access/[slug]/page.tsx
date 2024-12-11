import type { Metadata } from "next";
import fs from "fs";
import matter from "gray-matter";

import { loadMarkdownFilesMetadata } from "src/utils/markdown";
import type { BlogPost, MDXBlogPost } from "src/components/Blog";
import Hero from "src/components/LandingPage/Hero";
import NewsletterSignup from "src/components/NewsletterSignup";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const data = await loadBlogPost(slug);
  return {
    title: data.heading,
    description: data.subtitle,
    openGraph: {
      images: [`${process.env.NEXT_PUBLIC_HOST}${data.image}`],
    },
    // Prevent Google from indexing gated content
    robots: "noindex",
  };
}

export async function generateStaticParams() {
  const posts = await loadMarkdownFilesMetadata<MDXBlogPost>("blog/_posts");
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

async function loadBlogPost(slug: string) {
  let filePath = `./pages/blog/_posts/${slug}.md`;
  if (!fs.existsSync(filePath) && fs.existsSync(filePath + "x")) {
    filePath += "x";
  }

  const source = fs.readFileSync(filePath);
  const { data, content } = matter(source);
  const path = `/blog/${slug}`;

  return {
    ...data,
    path,
    content,
  } as unknown as BlogPost & { path: string; content: string };
}

export default async function Page({ params }: Props) {
  const slug = (await params).slug;
  const data = await loadBlogPost(slug);
  // Use the teaser or grab the first paragraph
  const teaser = data.teaser ?? [
    ...data.content.split("\n\n").slice(0, 1),
    `Learn more about ${data.heading} in our guide today.`,
  ];

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
          {teaser?.map((p, idx) => (
            <p className="text-lg md:text-lg" key={idx}>
              {p}
            </p>
          ))}
          <NewsletterSignup
            showHeader={false}
            buttonText="Get access"
            tags={[`gate-${slug}`]}
            redirect={data.path}
          />
        </div>
      </div>
    </div>
  );
}
