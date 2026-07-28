import { renderBlogIndex } from "../blog-index";

const HOST = process.env.NEXT_PUBLIC_HOST ?? "https://www.inngest.com";

export const dynamic = "force-static";

/**
 * Index of the blog markdown mirror.
 *
 * /blog-markdown/<slug> has always served individual posts, but the index
 * itself 404'd — there was only a [slug] route. Agents (and people) walking
 * up from a post URL landed on nothing. Serves the same listing as /blog.txt,
 * as text/markdown to match the rest of the mirror.
 */
export async function GET() {
  return new Response(renderBlogIndex(HOST), {
    headers: {
      "Content-Type": "text/markdown;charset=UTF-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
