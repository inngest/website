/**
 * Schema.org helpers for marketing pages. Keep payloads server-rendered so
 * crawlers and answer engines can read them without executing client JS.
 */

const HOST = "https://www.inngest.com";

// Stable IDs for the entities every page refers back to. The homepage
// defines them in full; other pages reference them by @id so search engines
// and answer engines connect each page to the same company and product.
export const ORGANIZATION_ID = `${HOST}/#organization`;
export const WEBSITE_ID = `${HOST}/#website`;
export const SOFTWARE_ID = `${HOST}/#software`;

const DESCRIPTION =
  "Build reliable background jobs, workflows, and AI agents without extra infrastructure. Automatic retries, flow control, and step-level observability.";

type Schema = Record<string, unknown>;

export function organizationSchema(): Schema {
  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: "Inngest",
    url: HOST,
    // Raster lockup on white: Google's logo guidelines want a PNG/JPG that
    // reads on a white background (the site's SVG logo is white-on-dark).
    logo: {
      "@type": "ImageObject",
      url: `${HOST}/logo-structured-data.png`,
      width: 1240,
      height: 250,
    },
    sameAs: [
      "https://twitter.com/inngest",
      "https://github.com/inngest",
      "https://www.linkedin.com/company/inngest",
    ],
  };
}

export function websiteSchema(): Schema {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: "Inngest",
    url: HOST,
    publisher: { "@id": ORGANIZATION_ID },
  };
}

/** The Inngest product. `offers` comes from the pricing plans. */
export function softwareApplicationSchema(offers: Schema[]): Schema {
  return {
    "@type": "SoftwareApplication",
    "@id": SOFTWARE_ID,
    name: "Inngest",
    url: HOST,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    description: DESCRIPTION,
    programmingLanguage: ["TypeScript", "JavaScript", "Python", "Go"],
    publisher: { "@id": ORGANIZATION_ID },
    offers,
  };
}

export type Crumb = { name: string; path: string };

/** Home › …crumbs. The last crumb is the current page. */
export function breadcrumbSchema(crumbs: Crumb[]): Schema {
  const trail = [{ name: "Home", path: "/" }, ...crumbs];
  const page = crumbs[crumbs.length - 1];
  return {
    "@type": "BreadcrumbList",
    "@id": `${HOST}${page.path}#breadcrumb`,
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: `${HOST}${crumb.path === "/" ? "" : crumb.path}`,
    })),
  };
}

export interface PageSchemaInput {
  path: string;
  /** Page title, as in the page's metadata. */
  title: string;
  description?: string;
  /** Short label for the breadcrumb, e.g. "Flow Control". */
  crumb: string;
  /** Parent crumbs between Home and this page. */
  parents?: Crumb[];
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";
  /** What the page is about: the product (default) or the company. */
  about?: "software" | "organization";
}

/** WebPage + BreadcrumbList for a marketing page. */
export function pageSchemas({
  path,
  title,
  description,
  crumb,
  parents = [],
  type = "WebPage",
  about = "software",
}: PageSchemaInput): Schema[] {
  const url = `${HOST}${path}`;
  return [
    {
      "@type": type,
      "@id": `${url}#webpage`,
      url,
      name: title,
      ...(description ? { description } : {}),
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": about === "software" ? SOFTWARE_ID : ORGANIZATION_ID },
      publisher: { "@id": ORGANIZATION_ID },
      breadcrumb: { "@id": `${url}#breadcrumb` },
    },
    breadcrumbSchema([...parents, { name: crumb, path }]),
  ];
}

export interface CustomerStorySchemaInput {
  slug: string;
  /** Story headline. */
  title: string;
  companyName: string;
  companyURL?: string;
  companyDescription?: string;
  /** Absolute or site-relative image URL. */
  image?: string;
}

/** Article about a customer, published by Inngest, + breadcrumbs. */
export function customerStorySchemas({
  slug,
  title,
  companyName,
  companyURL,
  companyDescription,
  image,
}: CustomerStorySchemaInput): Schema[] {
  const path = `/customers/${slug}`;
  const url = `${HOST}${path}`;
  return [
    {
      "@type": "Article",
      "@id": `${url}#article`,
      headline: title,
      url,
      mainEntityOfPage: url,
      ...(image
        ? { image: image.startsWith("http") ? image : `${HOST}${image}` }
        : {}),
      author: { "@id": ORGANIZATION_ID },
      publisher: { "@id": ORGANIZATION_ID },
      isPartOf: { "@id": WEBSITE_ID },
      about: [
        {
          "@type": "Organization",
          name: companyName,
          ...(companyURL ? { url: companyURL } : {}),
          ...(companyDescription ? { description: companyDescription } : {}),
        },
        { "@id": SOFTWARE_ID },
      ],
      breadcrumb: { "@id": `${url}#breadcrumb` },
    },
    breadcrumbSchema([
      { name: "Customers", path: "/customers" },
      { name: companyName, path },
    ]),
  ];
}

/**
 * One JSON-LD document holding several connected nodes. Every graph also
 * carries the Organization and WebSite nodes, so the @id references on the
 * page resolve without the reader having to fetch the homepage (Google's
 * Rich Results Test, for one, only reads the page in front of it).
 */
export function schemaGraph(...nodes: (Schema | Schema[])[]): Schema {
  const graph: Schema[] = [];
  const seen = new Set<unknown>();
  for (const node of [...nodes.flat(), organizationSchema(), websiteSchema()]) {
    const id = node["@id"];
    if (id && seen.has(id)) continue;
    if (id) seen.add(id);
    graph.push(node);
  }
  return { "@context": "https://schema.org", "@graph": graph };
}

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
      // Escape "<" so content can never close the script tag early.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
