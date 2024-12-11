import Image from "next/image";
import { RiCalendarLine } from "@remixicon/react";
import Tags from "src/shared/Blog/Tags";
import { type MDXBlogPost } from "./index";

export default function BlogPostList({ posts }: { posts: MDXBlogPost[] }) {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-4 xl:gap-x-8 lg:grid-cols-3  gap-y-20">
      {posts.map((post) => (
        <li key={post.slug}>
          <a
            href={post.redirect ?? `/blog/${post.slug}`}
            className="group flex flex-col rounded-lg ease-out transition-all "
          >
            {post.image && (
              <div className="flex rounded-lg shadow group-hover:scale-105 transition-all">
                {/* We use 720 as the responsive view goes full width at 720px viewport width */}
                <Image
                  className="rounded-lg"
                  src={post.image}
                  alt={`Featured image for ${post.heading} blog post`}
                  width={720}
                  height={720 / 2}
                />
              </div>
            )}
            <div className="pt-4 xl:pt-6 xl:py-4">
              <h2 className="text-base text-basis xl:text-lg text-white mb-1 group-hover:text-link transition-all">
                {post.heading}
              </h2>
              <p className="text-muted text-sm font-medium mb-4 mt-2 flex items-center gap-1">
                <RiCalendarLine className="h-3 w-3" />
                {post.humanDate} <Tags tags={post.tags || []} />
              </p>
              <p className="text-subtle text-sm">{post.subtitle}</p>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}
