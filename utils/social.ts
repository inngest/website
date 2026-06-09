import { type Metadata } from "next";

// Use the image version to bust social network's caches
const openGraphImageVersion = 4;

/*
 * Generates a URL to dynamically generate an open graph image for posts on social media
 * @see: /pages/api/og.tsx
 */
export const getOpenGraphImageURL = ({ title }: { title: string }) =>
  `https://www.inngest.com/api/og?title=${encodeURIComponent(
    title
  )}&v=${openGraphImageVersion}`;

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
