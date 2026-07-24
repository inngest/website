import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { listCustomerSlugs, customerMetadata, renderV1Story } from "../_story";

// Canonical /customers/[slug]. Reads content/customers/{slug}.mdx and
// renders the v1 CustomerStory.
export function generateStaticParams(): { slug: string }[] {
  return listCustomerSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return customerMetadata(slug);
}

export default async function CustomerStoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // renderV1Story returns null when content/customers/{slug}.mdx is missing.
  return (await renderV1Story(slug)) ?? notFound();
}
