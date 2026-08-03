import { renderBlogIndex } from "../blog-index";

const HOST = process.env.NEXT_PUBLIC_HOST ?? "https://www.inngest.com";

export const dynamic = "force-static";

export async function GET() {
  return new Response(renderBlogIndex(HOST), {
    headers: {
      "Content-Type": "text/plain;charset=UTF-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
