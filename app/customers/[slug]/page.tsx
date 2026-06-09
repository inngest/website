import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isV1Enabled } from "@/utils/v1/routes";
import {
  listCustomerSlugs,
  readStudy,
  serializeStudy,
  customerMetadata,
  renderV1Story,
} from "../_story";
import CaseStudyLegacy from "./CaseStudyLegacy";

// Canonical /customers/[slug]. Reads content/customers/{slug}.mdx and
// renders the v1 CustomerStory when the flag is on, or the ported legacy
// CaseStudyLayout when off.
//
// day-ai and baerskin-tactical have their own bespoke static routes
// (which flag-gate to the v1 story themselves), so they're excluded from
// this dynamic route's params and never reach it.
const BESPOKE = new Set(["day-ai", "baerskin-tactical"]);

export function generateStaticParams(): { slug: string }[] {
  return listCustomerSlugs()
    .filter((slug) => !BESPOKE.has(slug))
    .map((slug) => ({ slug }));
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
  const post = readStudy(slug);
  if (!post) notFound();

  // Flag off: legacy case-study layout inside the layout's legacy chrome.
  if (!isV1Enabled()) {
    const source = await serializeStudy(post.content);
    const { data } = post;
    return (
      <CaseStudyLegacy
        title={data.title}
        companyName={data.companyName}
        logo={data.logo}
        logoScale={data.logoScale}
        quote={data.quote}
        companyDescription={data.companyDescription}
        companyURL={data.companyURL}
        companyEmployees={data.companyEmployees}
        companyIndustry={data.companyIndustry}
        companyUseCase={data.companyUseCase}
        source={source}
      />
    );
  }

  return (await renderV1Story(slug)) ?? notFound();
}
