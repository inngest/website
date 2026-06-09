import type { MDXRemoteSerializeResult } from "next-mdx-remote";

import Article from "@/components/v1/sections/CustomerStory/Article";
import InfoCard from "@/components/v1/sections/CustomerStory/InfoCard";
import type { CustomerStoryData } from "@/components/v1/sections/CustomerStory/types";

/* ------------------------------------------------------------------ *
 * Top section — article (col-span-2) + info card (col-3).            *
 * ------------------------------------------------------------------ */
export default function TopSection({
  story,
  source,
}: {
  story: CustomerStoryData;
  source: MDXRemoteSerializeResult;
}) {
  return (
    <section
      aria-labelledby="customer-story-heading"
      className="relative mx-auto w-full max-w-[1440px] px-6 pb-16 pt-[120px] text-v1-frost sm:px-8 sm:pt-[140px] lg:pb-[100px] lg:pt-[176px]"
    >
      <div className="grid grid-cols-1 gap-x-4 gap-y-8 lg:grid-cols-3 lg:items-start">
        <Article story={story} source={source} />
        <InfoCard story={story} />
      </div>
    </section>
  );
}
