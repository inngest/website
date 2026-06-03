import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware for AI agent content negotiation and SEO canonicalization.
 *
 * Responsibilities:
 *
 * 1. Canonical tag forwarding (all pages)
 *    Sets an `x-pathname` request header so the root layout's CanonicalTag
 *    server component can emit `<link rel="canonical" href="...">` without
 *    query params. Also emits a `Link: <canonical>; rel="canonical"` HTTP
 *    response header as a belt-and-suspenders signal to crawlers.
 *
 * 2. Markdown serving for AI agents / AEO (blog + docs only)
 *
 *    Strategy A — .md extension routes (no header sniffing required):
 *      GET /blog/my-post.md
 *      → internal rewrite → /blog-markdown/my-post   (returns text/markdown)
 *
 *      GET /docs/getting-started/nextjs-quick-start.md
 *      → internal rewrite → /docs-markdown/getting-started/nextjs-quick-start
 *
 *    Strategy B — Accept: text/markdown content negotiation:
 *      GET /blog/my-post          Accept: text/markdown
 *      → internal rewrite → /blog-markdown/my-post   (returns text/markdown)
 *
 *      GET /docs/getting-started  Accept: text/markdown
 *      → internal rewrite → /docs-markdown/getting-started
 *
 *    For normal browser requests the middleware adds a `Vary: Accept` header
 *    so CDN/edge caches keep the two representations separate.
 */

const SITE_ORIGIN = "https://www.inngest.com";

function acceptsMarkdown(req: NextRequest): boolean {
  const accept = req.headers.get("accept") ?? "";
  return accept.includes("text/markdown");
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Forward pathname as a request header so the root layout CanonicalTag
  // component can read it via next/headers without needing searchParams.
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", pathname);

  // ── Strategy A: .md extension routes ──────────────────────────────────────

  if (pathname.endsWith(".md")) {
    // /blog/[slug].md  →  /blog-markdown/[slug]
    if (/^\/blog\/[^/]+\.md$/.test(pathname)) {
      const slug = pathname.slice("/blog/".length, -".md".length);
      const url = req.nextUrl.clone();
      url.pathname = `/blog-markdown/${slug}`;
      return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
    }

    // /docs/[...path].md  →  /docs-markdown/[...path]
    if (pathname.startsWith("/docs/")) {
      const docPath = pathname.slice("/docs/".length, -".md".length);
      const url = req.nextUrl.clone();
      url.pathname = `/docs-markdown/${docPath}`;
      return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
    }
  }

  // ── Strategy B: Accept: text/markdown content negotiation ─────────────────

  if (acceptsMarkdown(req)) {
    // /blog/[slug]  →  /blog-markdown/[slug]
    if (/^\/blog\/[^/]+$/.test(pathname)) {
      const slug = pathname.replace(/^\/blog\//, "");
      const url = req.nextUrl.clone();
      url.pathname = `/blog-markdown/${slug}`;
      return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
    }

    // /docs/[...path]  →  /docs-markdown/[...path]
    if (pathname.startsWith("/docs/") || pathname === "/docs") {
      const docPath = pathname.replace(/^\/docs\/?/, "");
      const url = req.nextUrl.clone();
      url.pathname = `/docs-markdown/${docPath}`;
      return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
    }
  }

  // ── Pass-through: add Vary, canonical Link, and markdown alternate headers ─

  const res = NextResponse.next({ request: { headers: requestHeaders } });
  res.headers.set("Vary", "Accept");

  // Canonical: always the clean pathname with no query params.
  res.headers.set(
    "Link",
    `<${SITE_ORIGIN}${pathname}>; rel="canonical"`
  );

  // Markdown alternate link for blog/docs so agents can discover raw content.
  if (/^\/blog\/[^/]+$/.test(pathname)) {
    const slug = pathname.replace(/^\/blog\//, "");
    res.headers.append(
      "Link",
      `<${SITE_ORIGIN}/blog/${slug}.md>; rel="alternate"; type="text/markdown"`
    );
  } else if (pathname.startsWith("/docs/") || pathname === "/docs") {
    const docPath = pathname.replace(/^\/docs\/?/, "");
    const mdPath = docPath ? `/docs/${docPath}.md` : `/docs.md`;
    res.headers.append(
      "Link",
      `<${SITE_ORIGIN}${mdPath}>; rel="alternate"; type="text/markdown"`
    );
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all routes except:
     * - _next/static  (static assets)
     * - _next/image   (image optimisation)
     * - favicon.*     (favicon files)
     * - public files with common static extensions
     * - api routes    (handled separately)
     */
    "/((?!_next/static|_next/image|favicon|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|otf|eot|css|js|map)$).*)",
  ],
};
