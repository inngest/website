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

export const getFullURL = (absolutePath: string) =>
  new URL(absolutePath, process.env.NEXT_PUBLIC_HOST).toString();

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
