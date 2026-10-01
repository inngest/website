import { type Metadata } from "next";

// Use the image version to bust social network's caches
const openGraphImageVersion = 5;

/*
 * Generates a URL to dynamically generate an open graph image for posts on social media
 * @see: /pages/api/og.tsx
 */
export const getOpenGraphImageURL = ({ title }: { title: string }) =>
  `https://www.inngest.com/api/og?title=${encodeURIComponent(
    title
  )}&v=${openGraphImageVersion}`;

/*
 * The "Build for the lonng run" campaign card — black, with the mouth and
 * tongue along the bottom, instead of the standard salmon one.
 *
 * Returned as a relative path on purpose: `generateMetadata` runs it
 * through `getFullURL`, so on a preview deploy the scraper hits the
 * preview host rather than production, which has neither the route's
 * `theme` parameter nor the artwork until this ships.
 */
export const getLongRunOpenGraphImagePath = ({
  title,
  eyebrow,
  city,
}: {
  title: string;
  eyebrow: string;
  /** Picks the runner: New York gets the pizza, San Francisco the cup. */
  city: "nyc" | "sf";
}) =>
  `/api/og?title=${encodeURIComponent(title)}&eyebrow=${encodeURIComponent(
    eyebrow
  )}&theme=long-run&city=${city}&v=${openGraphImageVersion}`;

export const getFullURL = (absolutePath: string) => {
  // On Vercel preview deploys, use the preview host so OG/Twitter scrapers
  // can fetch newly-deployed assets that aren't on production yet. Falls back
  // to NEXT_PUBLIC_HOST in production, then to the canonical host when that
  // isn't set on the build env (preview/CI often lack it) so `new URL()`
  // doesn't throw "Invalid URL" during page-data collection.
  const previewHost =
    process.env.VERCEL_ENV === "preview"
      ? process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL
      : null;
  const host = previewHost
    ? `https://${previewHost}`
    : process.env.NEXT_PUBLIC_HOST ?? "https://www.inngest.com";
  return new URL(absolutePath, host).toString();
};

// ...
export const generateMetadata = ({
  title,
  description,
  image,
  ...rest
}: {
  // Title without the "Inngest - " prefix
  title: string;
  description?: string;
  // A relative path URL to the image
  image?: string;
  robots?: string;
}): Metadata => {
  const imageUrl = image
    ? image.match(/^\//)
      ? getFullURL(image)
      : image
    : getOpenGraphImageURL({ title });
  const metaTitle = `Inngest - ${title}`;
  const metadata: Metadata = {
    title,
    openGraph: {
      title: metaTitle,
      images: [imageUrl],
    },
    twitter: {
      card: "summary_large_image",
      site: "@inngest",
      title: metaTitle,
      images: [imageUrl],
    },
    ...rest,
  };
  if (description) {
    metadata.description = description;
    metadata.openGraph.description = description;
    metadata.twitter.description = description;
  }
  return metadata;
};
