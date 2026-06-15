import type { MDXRemoteSerializeResult } from "next-mdx-remote";

import PageShell from "@/components/v1/PageShell";
import LogoMarquee from "@/components/v1/sections/Home/LogoMarquee";
import TopSection from "@/components/v1/sections/CustomerStory/TopSection";
import RelatedStories from "@/components/v1/sections/CustomerStory/RelatedStories";
import type {
  CustomerStoryData,
  RelatedStory,
} from "@/components/v1/sections/CustomerStory/types";

// Content-driven customer story. app/customers/_story.tsx reads
// content/customers/{slug}.mdx, maps the frontmatter to `story`,
// serialises the body, and passes 3 siblings as `related`. The body
// renders only real content — any imagery or code blocks come from the
// case study's own MDX (no fabricated placeholders).

// Re-exported so the content layer can keep a single import site.
export type { CustomerStoryData, RelatedStory };

export default function CustomerStory({
  story,
  source,
  related,
}: {
  story: CustomerStoryData;
  source: MDXRemoteSerializeResult;
  related: RelatedStory[];
}) {
  return (
    <PageShell>
      <div className="overflow-x-clip">
        <TopSection story={story} source={source} />
        <RelatedStories related={related} />
        {/* Closing stippled Inngest lockup — the same LogoMarquee the
            home page uses to sign off above the footer. */}
        <div className="pb-16 pt-10 lg:pb-[100px]">
          <LogoMarquee />
        </div>
      </div>
    </PageShell>
  );
}
