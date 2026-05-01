/**
 * Single source of truth for all gated content downloads served via
 * `/content/[asset]`. Add a new asset here + drop a new PDF in `/public` to
 * stand up a new content download landing page with zero engineering work.
 *
 * Keys are URL slugs (used in `properties.asset` on the Segment event,
 * `data.asset` on the Inngest event, and the route segment itself).
 *
 * If a specific asset needs a bespoke landing page design, create a static
 * route at `app/content/<slug>/page.tsx` — Next.js will resolve the static
 * route before falling back to the dynamic `[asset]` catch-all. Both routes
 * should still render `<ContentDownloadForm asset="..." />` so event firing
 * and field shape stay consistent across all content downloads.
 */

export interface ContentAsset {
  /** URL slug. Must match the object key. Used in `properties.asset`. */
  slug: string;
  /** Human-readable title shown in the page header and email subject. */
  title: string;
  /** Short eyebrow shown above the title (e.g. "Free benchmark report · PDF"). */
  eyebrow?: string;
  /** Hero description paragraph. */
  description: string;
  /** Submit button copy on the form. Defaults to "Download" if omitted. */
  buttonCopy?: string;
  /**
   * Where to redirect after a successful submit. The email-with-PDF is
   * delivered separately by the downstream `content-download-handler`
   * Inngest function — this redirect is the post-submit UX (e.g. send the
   * visitor to an interactive web version of the report).
   */
  redirectTo?: string;
}

export const CONTENT_ASSETS: Record<string, ContentAsset> = {
  "ai-in-production-report-2026": {
    slug: "ai-in-production-report-2026",
    title: "AI in Production: 2026 Benchmark Report",
    eyebrow: "Free benchmark report · PDF",
    description:
      "We surveyed 130 backend, full-stack, and AI engineers about what it takes to run reliable AI workflows in production. We wanted to know what's causing failures, and which infrastructure choices—across orchestration, observability, evals, and agent frameworks—actually reduce the burden of reliability. Explore the patterns that predict scaling confidence.",
    buttonCopy: "Read the report",
    redirectTo: "https://www.inngest.com/assets/reports/2026-benchmark/2026-durable-execution-benchmark-report.pdf",
  },
};

/** All registered asset slugs. Used by `generateStaticParams`. */
export const CONTENT_ASSET_SLUGS = Object.keys(CONTENT_ASSETS);
