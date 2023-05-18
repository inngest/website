import RSS from "rss";

import { loadMarkdownFilesMetadata } from "../utils/markdown";
import { type BlogPost } from "./blog";

function RSSFeed() {
  // getServerSideProps loads all of the data and forms the response
}

export async function getServerSideProps({ res }) {
  const posts = await loadMarkdownFilesMetadata<BlogPost>("blog/_posts");

  const feed = new RSS({
    title: "Inngest Product & Engineering Blog",
    description:
      "Updates from the Inngest team about our product, engineering, and community",
    feed_url: `${process.env.NEXT_PUBLIC_HOST}/rss.xml`,
    site_url: process.env.NEXT_PUBLIC_HOST,
    image_url: `${process.env.NEXT_PUBLIC_HOST}/${process.env.NEXT_PUBLIC_FAVICON}`,
    language: "en-us",
  });

  posts
    .filter((post) => !post.hide)
    .forEach((post) => {
      feed.item({
        title: post.heading,
        description: post.subtitle,
        author: post.author,
        date: post.date,
        url: `${process.env.NEXT_PUBLIC_HOST}/blog/${post.slug}`,
        categories: post.tags || [],
      });
    });

  const xml = feed.xml();

  res.setHeader("Content-Type", "text/xml");
  // we send the XML to the browser
  res.write(xml);
  res.end();

  return {
    props: {},
  };
}

export default RSSFeed;
