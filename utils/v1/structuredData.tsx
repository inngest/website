/**
 * Schema.org helpers for marketing pages. Keep payloads server-rendered so
 * crawlers and answer engines can read them without executing client JS.
 */

const HOST = "https://www.inngest.com";

export interface QuotationSchemaInput {
  quote: string;
  authorName: string;
  date: string;
  sourceUrl: string;
}

export function buildQuotationSchemas(quotes: QuotationSchemaInput[]) {
  return quotes.map((q) => ({
    "@context": "https://schema.org",
    "@type": "Quotation",
    text: q.quote,
    creator: {
      "@type": "Person",
      name: q.authorName,
    },
    datePublished: q.date,
    url: q.sourceUrl,
    isPartOf: {
      "@type": "WebPage",
      url: HOST,
    },
  }));
}

export function JsonLdScript({
  data,
}: {
  data: Record<string, unknown> | Record<string, unknown>[];
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
