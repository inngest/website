import type { NextApiRequest, NextApiResponse } from "next";
import RSS from "rss";

import { loadMarkdownFilesMetadata } from "../../utils/markdown";
import { type MDXBlogPost } from "src/components/Blog";
import { loadPost } from "app/changelog/helpers";

export default async (req: NextApiRequest, res: NextApiResponse<string>) => {
  const blogPosts = await loadMarkdownFilesMetadata<MDXBlogPost>(
    "content/blog"
  );
  const changelogPosts = await loadMarkdownFilesMetadata<MDXBlogPost>(
    "content/changelog"
  );

  const blogPostsTransformed = blogPosts
    .filter((post) => !post.hide)
    .map((post) => ({
      title: post.heading,
      description: post.subtitle,
      author: post.author,
      date: post.date,
      // Blog posts can just be redirects to customer stories
      // they start with a leading slash
      url: post.redirect
        ? `${process.env.NEXT_PUBLIC_HOST}${post.redirect}`
        : `${process.env.NEXT_PUBLIC_HOST}/blog/${post.slug}`,
      categories: post.tags || [],
    }));
  const changelogPostsTransformed = [];
  for (const post of changelogPosts) {
    const { metadata } = await loadPost(post.slug);
    changelogPostsTransformed.push({
      title: metadata.title,
      date: metadata.date,
      url: `${process.env.NEXT_PUBLIC_HOST}/changelog/${post.slug}`,
      categories: ["changelog"],
    });
  }

  const feed = new RSS({
    title: "Inngest Product & Engineering Blog",
    description:
      "Updates from the Inngest team about our product, engineering, and community",
    feed_url: `${process.env.NEXT_PUBLIC_HOST}/rss.xml`,
    site_url: process.env.NEXT_PUBLIC_HOST,
    image_url: `${process.env.NEXT_PUBLIC_HOST}/${process.env.NEXT_PUBLIC_FAVICON}`,
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

  res.setHeader("Content-Type", "text/xml");
  res.setHeader("Cache-Control", "s-maxage=360, stale-while-revalidate");
  res.write(xml);
  res.end();
};
