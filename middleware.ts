import { NextRequest, NextResponse } from "next/server";

/**
 * Markdown serving middleware for AI agents / AEO.
 *
 * Two complementary strategies, checked in order:
 *
 * 1. .md extension routes — no header sniffing required
 *    Any client that can construct a URL gets raw markdown by appending .md:
 *
 *      GET /blog/my-post.md
 *      → internal rewrite → /blog-markdown/my-post   (returns text/markdown)
 *
 *      GET /docs/getting-started/nextjs-quick-start.md
 *      → internal rewrite → /docs-markdown/getting-started/nextjs-quick-start
 *
 * 2. Accept: text/markdown content negotiation
 *    Agents that send a proper Accept header get markdown from the canonical URL:
 *
 *      GET /blog/my-post          Accept: text/markdown
 *      → internal rewrite → /blog-markdown/my-post   (returns text/markdown)
 *
 *      GET /docs/getting-started  Accept: text/markdown
 *      → internal rewrite → /docs-markdown/getting-started
 *
 * For normal browser requests the middleware is a no-op, but it adds a
 * `Vary: Accept` header so CDN/edge caches keep the two representations
 * separate.
 */

function acceptsMarkdown(req: NextRequest): boolean {
  const accept = req.headers.get("accept") ?? "";
  return accept.includes("text/markdown");
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Strategy 1: .md extension routes ──────────────────────────────────────

  if (pathname.endsWith(".md")) {
    // /blog/[slug].md  →  /blog-markdown/[slug]
    if (/^\/blog\/[^/]+\.md$/.test(pathname)) {
      const slug = pathname.slice("/blog/".length, -".md".length);
      const url = req.nextUrl.clone();
      url.pathname = `/blog-markdown/${slug}`;
      return NextResponse.rewrite(url);
    }

    // /docs/[...path].md  →  /docs-markdown/[...path]
    if (pathname.startsWith("/docs/")) {
      const docPath = pathname.slice("/docs/".length, -".md".length);
      const url = req.nextUrl.clone();
      url.pathname = `/docs-markdown/${docPath}`;
      return NextResponse.rewrite(url);
    }
  }

  // ── Strategy 2: Accept: text/markdown content negotiation ─────────────────

  if (acceptsMarkdown(req)) {
    // /blog/[slug]  →  /blog-markdown/[slug]
    if (/^\/blog\/[^/]+$/.test(pathname)) {
      const slug = pathname.replace(/^\/blog\//, "");
      const url = req.nextUrl.clone();
      url.pathname = `/blog-markdown/${slug}`;
      return NextResponse.rewrite(url);
    }

    // /docs/[...path]  →  /docs-markdown/[...path]
    if (pathname.startsWith("/docs/") || pathname === "/docs") {
      const docPath = pathname.replace(/^\/docs\/?/, "");
      const url = req.nextUrl.clone();
      url.pathname = `/docs-markdown/${docPath}`;
      return NextResponse.rewrite(url);
    }
  }

  // Pass through — add Vary and Link headers so agents see the markdown
  // alternate without needing to parse the HTML body at all.
  const res = NextResponse.next();
  res.headers.set("Vary", "Accept");

  const { origin } = req.nextUrl;

  if (/^\/blog\/[^/]+$/.test(pathname)) {
    const slug = pathname.replace(/^\/blog\//, "");
    res.headers.set(
      "Link",
      `<${origin}/blog/${slug}.md>; rel="alternate"; type="text/markdown"`
    );
  } else if (pathname.startsWith("/docs/") || pathname === "/docs") {
    const docPath = pathname.replace(/^\/docs\/?/, "");
    const mdPath = docPath ? `/docs/${docPath}.md` : `/docs.md`;
    res.headers.set(
      "Link",
      `<${origin}${mdPath}>; rel="alternate"; type="text/markdown"`
    );
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match /blog/:slug (individual post pages only, not /blog index)
     * and /docs + /docs/:path* (all docs routes).
     * Excludes _next/, static files, and API routes automatically
     * because none of those paths start with /blog/ or /docs.
     */
    "/blog/:slug*",
    "/docs",
    "/docs/:path*",
  ],
};
