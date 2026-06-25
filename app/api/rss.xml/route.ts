import RSS from "rss";

import { loadMarkdownFilesMetadata } from "utils/markdown";
import { type MDXBlogPost } from "src/components/Blog";
import { loadPost } from "app/_changelog/helpers";

export const dynamic = "force-static";

// Fallback to the canonical host when NEXT_PUBLIC_HOST isn't set on
// the build environment. The `rss` package internally calls
// url.parse(site_url) and destructures { auth } from the result —
// passing undefined throws "Cannot destructure property 'auth' of
// 'a'" and breaks the entire build.
const HOST = process.env.NEXT_PUBLIC_HOST ?? "https://www.inngest.com";
const FAVICON = process.env.NEXT_PUBLIC_FAVICON ?? "favicon-june-2025-light.svg";

export async function GET() {
  const blogPosts = await loadMarkdownFilesMetadata<MDXBlogPost>(
    "content/blog"
  );
  const changelogPosts = await loadMarkdownFilesMetadata<MDXBlogPost>(
    "content/changelog"
  );

  const blogPostsTransformed = blogPosts
    .filter((post) => !post.hide && !post.unreleased)
    .map((post) => ({
      title: post.heading,
      description: post.subtitle,
      author: post.author,
      date: post.date,
      // Blog posts can just be redirects to customer stories
      // they start with a leading slash
      url: post.redirect
        ? `${HOST}${post.redirect}`
        : `${HOST}/blog/${post.slug}`,
      categories: post.tags || [],
    }));

  const changelogPostsTransformed = [];
  for (const post of changelogPosts) {
    const { metadata } = await loadPost(post.slug);
    changelogPostsTransformed.push({
      title: metadata.title,
      date: metadata.date,
      url: `${HOST}/changelog/${post.slug}`,
      categories: ["changelog"],
    });
  }

  const feed = new RSS({
    title: "Inngest Product & Engineering Blog",
    description:
      "Updates from the Inngest team about our product, engineering, and community",
    feed_url: `${HOST}/rss.xml`,
    site_url: HOST,
    image_url: `${HOST}/${FAVICON}`,
    language: "en-us",
  });

  const posts = [...blogPostsTransformed, ...changelogPostsTransformed];

  posts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .forEach((post) => {
      feed.item({
        title: post.title,
        description: post.description,
        author: post.author,
        date: post.date,
        url: post.url,
        categories: post.categories,
      });
    });

  const xml = feed.xml();

  return new Response(xml, {
    headers: {
      "Content-Type": "text/xml",
      "Cache-Control": "s-maxage=360, stale-while-revalidate",
    },
  });
}
