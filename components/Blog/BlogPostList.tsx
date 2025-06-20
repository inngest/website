import Image from "next/image";
import { RiCalendarLine } from "@remixicon/react";
import Tags from "src/shared/Blog/Tags";
import { type MDXBlogPost } from "./index";

export default function BlogPostList({ posts }: { posts: MDXBlogPost[] }) {
  return (
    <ul className="grid grid-cols-1 gap-x-8 gap-y-20 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-4  xl:gap-x-8">
      {posts.map((post) => (
        <li key={post.slug}>
          <a
            href={post.redirect ?? `/blog/${post.slug}`}
            className="group flex flex-col rounded-lg transition-all ease-out "
          >
            {post.image && (
              <div className="flex rounded-lg shadow transition-all group-hover:scale-105">
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
            <div className="pt-4 xl:py-4 xl:pt-6">
              <h2 className="mb-1 text-base text-basis text-white transition-all group-hover:text-[#CBB26A] xl:text-lg">
                {post.heading}
              </h2>
              <p className="mb-4 mt-2 flex items-center gap-1 text-sm font-medium text-muted">
                <RiCalendarLine className="h-3 w-3" />
                {post.humanDate} <Tags tags={post.tags || []} />
              </p>
              <p className="text-sm text-subtle">{post.subtitle}</p>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}
