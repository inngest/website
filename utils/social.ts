import { type Metadata } from "next";

// Use the image version to bust social network's caches
const openGraphImageVersion = 3;

/*
 * Generates a URL to dynamically generate an open graph image for posts on social media
 * @see: /pages/api/og.tsx
 */
export const getOpenGraphImageURL = ({ title }: { title: string }) =>
  `https://www.inngest.com/api/og?title=${encodeURIComponent(
    title
  )}&v=${openGraphImageVersion}`;

export const getFullURL = (absolutePath: string) =>
  new URL(absolutePath, process.env.NEXT_PUBLIC_HOST).toString();

// ...
export const generateMetadata = ({
  title,
  description,
  image,
}: {
  // Title without the "Inngest - " prefix
  title: string;
  description?: string;
  // A relative path URL to the image
  image?: string;
}): Metadata => {
  const imageUrl = image
    ? image.match(/^\//)
      ? getFullURL(image)
      : image
    : getOpenGraphImageURL({ title });
  const metaTitle = `Inngest - ${title}`;
  const metadata: Metadata = {
    title: metaTitle,
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
  };
  if (description) {
    metadata.description = description;
    metadata.openGraph.description = description;
    metadata.twitter.description = description;
  }
  return metadata;
};
