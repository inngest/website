import type { Metadata } from "next";
import { generateMetadata as generateOgMetadata } from "src/utils/social";
import Image from "next/image";
import { RiCalendarLine, RiArrowRightLine } from "@remixicon/react";

import { isV1Enabled } from "@/utils/v1/routes";
import Container from "src/shared/layout/Container";
import Tags from "src/shared/Blog/Tags";
import { loadMarkdownFilesMetadata } from "src/utils/markdown";
import BlogHeader from "src/components/Blog/BlogHeader";
import BlogPostList from "src/components/Blog/BlogPostList";
import { type MDXBlogPost } from "src/components/Blog";
import Learn, { type PostCard } from "@/components/v1/pages/Learn";

const DESCRIPTION =
  "Updates from the Inngest team about our product, engineering, and community.";

// Flag-aware, mirroring /about and /contact: the v1 resource hub and the
// legacy blog index have different titles.
export function generateMetadata(): Metadata {
  if (isV1Enabled()) {
    return generateOgMetadata({
      title: "Developer Guides, Videos & Learning Hub",
      description:
        "Explore Inngest's learning resources: white papers, demos, video walkthroughs, and guides for building durable workflows, agents, and background jobs.",
    });
  }
  return {
    title: "Product & Engineering Blog",
    description: DESCRIPTION,
  };
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
// time, no request-time searchParams). Flag on -> the v1 Learn resource
// hub (its own PageShell chrome; /blog is a v1 route). Flag off -> the
// ported legacy listing inside the layout's legacy chrome.
export default async function BlogIndex() {
  const posts = await loadMarkdownFilesMetadata<MDXBlogPost>("content/blog");

  if (isV1Enabled()) {
    const cards: PostCard[] = posts
      .filter((p) => !p.hide && !p.redirect && p.heading)
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
            : p.date && typeof (p.date as unknown as Date).toISOString === "function"
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

  // Flag off: the legacy blog index (content only — layout provides the
  // legacy chrome).
  const visiblePosts = posts
    // featured=false posts are kept off the main feed (still directly linkable).
    .filter((p) => p?.featured !== false)
    .filter((post) => !post.hide)
    .filter((post) => post.date)
    .sort((a, z) => String(z.date ?? "").localeCompare(String(a.date ?? "")));

  const focus = visiblePosts.find((c) => c.focus) ?? visiblePosts[0];
  const rest = visiblePosts.filter((c) => !focus || c.slug !== focus.slug);

  return (
    <div className="bg-stone-950 font-sans">
      <Container className="pt-8">
        <BlogHeader description={DESCRIPTION} />

        <div className="pt-16">
          {focus && (
            <a
              className="group relative mb-32 flex flex-col-reverse rounded-lg border border-stone-600 bg-stone-700 shadow-lg transition-all lg:flex-row xl:max-w-[1160px]"
              href={focus.redirect ?? `/blog/${focus.slug}`}
            >
              <div
                className={`${
                  focus.image ? "lg:w-2/5" : "w-full"
                } relative z-10 flex flex-col items-start justify-between p-8`}
              >
                <div className="text-alwaysBlack">
                  <span className="mb-3 inline-flex rounded bg-stone-800 px-3 py-1.5 text-xs font-semibold text-stone-50">
                    Latest Post
                  </span>
                  <h2 className="mb-1 text-xl font-medium text-stone-50 md:text-2xl lg:text-xl xl:text-2xl">
                    {focus.heading}
                  </h2>
                  <p className="mb-4 flex items-center gap-1 text-sm font-medium text-stone-50">
                    <RiCalendarLine className="h-3 w-3" />
                    {focus.humanDate} <Tags tags={focus.tags || []} />
                  </p>
                  <p className="text-stone-50">{focus.subtitle}</p>
                </div>
                <span className="mt-4 flex flex-row items-center gap-1 rounded-lg bg-inngestLux px-4 py-1.5 text-sm font-medium text-stone-950 group-hover:bg-inngestLuxDark">
                  Read article
                  <RiArrowRightLine className="h-4 w-4" />
                </span>
              </div>
              {focus.image && (
                <div className="relative flex p-2 lg:w-3/5">
                  <Image
                    className="z-10 m-auto w-full rounded-lg group-hover:rounded-lg"
                    src={focus.image}
                    alt={`Featured image for ${focus.heading} blog post`}
                    width={900}
                    height={900 / 2}
                    quality={95}
                  />
                </div>
              )}
            </a>
          )}

          <BlogPostList posts={rest} />
        </div>
      </Container>
    </div>
  );
}
