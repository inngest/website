import type { Metadata } from "next";
import { generateMetadata as generateOgMetadata } from "src/utils/social";

import { loadMarkdownFilesMetadata } from "src/utils/markdown";
import { type MDXBlogPost } from "src/components/Blog";
import Learn, { type PostCard } from "@/components/v1/pages/Learn";

export function generateMetadata(): Metadata {
  return generateOgMetadata({
    title: "Developer Guides, Videos & Learning Hub",
    description:
      "Explore Inngest's learning resources: white papers, demos, video walkthroughs, and guides for building durable workflows, agents, and background jobs.",
  });
}

function formatMDY(date: string | Date | undefined): string {
  if (!date) return "--/--/----";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "--/--/----";
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

// Canonical /blog index. Statically rendered (reads content/blog at build
// time, no request-time searchParams) into the v1 Learn resource hub,
// which brings its own PageShell chrome (/blog is a v1 route).
export default async function BlogIndex() {
  const posts = await loadMarkdownFilesMetadata<MDXBlogPost>("content/blog");

  const cards: PostCard[] = posts
    .filter((p) => !p.hide && !p.unreleased && p.heading)
    .map((p) => {
      const tags = Array.isArray(p.tags)
        ? p.tags
        : typeof p.tags === "string"
        ? (p.tags as string)
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [];
      const dateISO =
        typeof p.date === "string"
          ? p.date
          : p.date &&
            typeof (p.date as unknown as Date).toISOString === "function"
          ? (p.date as unknown as Date).toISOString()
          : null;
      return {
        slug: p.slug,
        type: "BLOG" as const,
        title: String(p.heading),
        subtitle: p.subtitle ? String(p.subtitle) : "",
        date: dateISO,
        tags,
        image: p.image ? String(p.image) : null,
        href: p.redirect ? String(p.redirect) : undefined,
        prettyDate: formatMDY(dateISO ?? undefined),
      };
    })
    .sort((a, b) => {
      const aT = a.date ? new Date(a.date).getTime() : 0;
      const bT = b.date ? new Date(b.date).getTime() : 0;
      return bT - aT;
    });
  return <Learn posts={cards} />;
}
