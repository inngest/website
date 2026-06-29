import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const HOST = process.env.NEXT_PUBLIC_HOST ?? "https://www.inngest.com";

export const dynamic = "force-static";

type PostMeta = {
  slug: string;
  title: string;
  description?: string;
  date: string;
  authors: string[];
  category?: string;
};

function loadBlogIndex(): PostMeta[] {
  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  const posts: PostMeta[] = [];

  for (const file of files) {
    const filePath = path.join(BLOG_DIR, file);
    const source = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(source);

    // Skip redirects and hidden posts
    if (data.redirect || data.hide || data.unreleased) continue;

    const slug = file.replace(/\.(mdx|md)$/, "");

    const rawDate = data.date;
    const dateStr = rawDate instanceof Date
      ? rawDate.toISOString().split("T")[0]
      : rawDate
      ? String(rawDate)
      : "";

    const authors = Array.isArray(data.author)
      ? data.author
      : data.author
      ? [data.author]
      : [];

    posts.push({
      slug,
      title: data.heading ?? slug,
      description: data.subtitle,
      date: dateStr,
      authors,
      category: data.category,
    });
  }

  // Newest first
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

export async function GET() {
  const posts = loadBlogIndex();

  const lines: string[] = [
    "# Inngest Blog",
    "",
    "> Engineering articles, product updates, and company news from the Inngest team.",
    "",
    `- [Full documentation](${HOST}/llms.txt)`,
    `- [Individual posts](${HOST}/blog-markdown/<slug>)`,
    "",
    "## Posts",
    "",
  ];

  for (const post of posts) {
    const authorStr = post.authors.length > 0 ? ` — ${post.authors.join(", ")}` : "";
    const categoryStr = post.category ? ` [${post.category}]` : "";

    lines.push(`### [${post.title}](${HOST}/blog-markdown/${post.slug})`);
    lines.push("");
    lines.push(`${post.date}${authorStr}${categoryStr}`);
    if (post.description) {
      lines.push("");
      lines.push(post.description);
    }
    lines.push("");
  }

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain;charset=UTF-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
