import * as fs from "node:fs";
import * as path from "node:path";
import { getChangelogURL } from "app/changelog/helpers";

export const dynamic = "force-static";

function parseChangelogExports(source: string) {
  const titleMatch = source.match(
    /export\s+const\s+title\s*=\s*["'`](.*?)["'`]/
  );
  const dateMatch = source.match(
    /export\s+const\s+date\s*=\s*["'`](.*?)["'`]/
  );
  return {
    title: titleMatch?.[1] ?? "",
    date: dateMatch?.[1] ?? "",
  };
}

export async function GET() {
  const baseDir = path.join(process.cwd(), "content/changelog");
  const filenames = fs
    .readdirSync(baseDir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  const changelogPosts = filenames.map((filename) => {
    const source = fs.readFileSync(path.join(baseDir, filename), "utf-8");
    const { title, date } = parseChangelogExports(source);
    const slug = filename.replace(/\.mdx?$/, "");
    return { title, date, slug };
  });

  const sortedPosts = changelogPosts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const posts = sortedPosts.map((post) => ({
    title: post.title,
    date: post.date,
    url: getChangelogURL(post.slug, false),
  }));

  return new Response(JSON.stringify({ posts }), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "s-maxage=360, stale-while-revalidate",
    },
  });
}
