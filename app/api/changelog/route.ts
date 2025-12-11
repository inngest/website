import { loadMarkdownFilesMetadata } from "utils/markdown";
import {
  getChangelogURL,
  loadPost,
  type ChangelogEntry,
} from "app/changelog/helpers";
import { NextRequest } from "next/server";

export const dynamic = "auto";

export async function GET(req: NextRequest) {
  const pageNumber = parseInt(req.nextUrl.searchParams.get("page") || "1");
  console.log("Changlog?", pageNumber, req.nextUrl.searchParams.get("page"));
  const perPage = 10;
  const offset = (pageNumber - 1) * perPage;

  const changelogPosts = await loadMarkdownFilesMetadata<ChangelogEntry>(
    "content/changelog"
  );
  for (const post of changelogPosts) {
    const { metadata } = await loadPost(post.slug);
    post.metadata = metadata;
  }
  const sortedPosts = changelogPosts.sort((a, b) => {
    return (
      new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime()
    );
  });

  const page = sortedPosts.slice(offset, offset + perPage);
  const totalPages = Math.ceil(sortedPosts.length / perPage);
  const changelogPostsTransformed = page.map((post) => ({
    title: post.metadata.title,
    date: post.metadata.date,
    url: getChangelogURL(post.slug, false),
  }));
  return new Response(
    JSON.stringify({
      posts: changelogPostsTransformed,
      pagination: {
        page: pageNumber,
        perPage,
        totalPages,
        totalItems: sortedPosts.length,
      },
    }),
    {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "s-maxage=360, stale-while-revalidate",
      },
    }
  );
}
