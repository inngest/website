import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getFullURL } from "src/utils/social";

import { REPORT_LANDING_PATH, getReportGraph } from "../../graphs";
import ShareRedirect from "./ShareRedirect";

type Props = {
  params: Promise<{ graphId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { graphId } = await params;
  const graph = getReportGraph(graphId);
  if (!graph) {
    return { robots: "noindex" };
  }
  const imageUrl = getFullURL(graph.image);
  const pageUrl = getFullURL(`${REPORT_LANDING_PATH}/share/${graphId}`);
  return {
    title: graph.title,
    description: graph.description,
    alternates: { canonical: pageUrl },
    openGraph: {
      title: graph.title,
      description: graph.description,
      url: pageUrl,
      images: [{ url: imageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@inngest",
      title: graph.title,
      description: graph.description,
      images: [imageUrl],
    },
    robots: "noindex",
  };
}

export default async function Page({ params }: Props) {
  const { graphId } = await params;
  const graph = getReportGraph(graphId);
  if (!graph) {
    notFound();
  }
  return <ShareRedirect />;
}
