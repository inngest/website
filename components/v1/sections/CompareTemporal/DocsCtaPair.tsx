import ButtonLink from "@/components/v1/ButtonLink";

/**
 * "Quick start guide / Browse the docs" CTA pair shown beside the
 * CodeComparison and FeatureComparison section titles (via SectionHeader's
 * `titleAside`). Stacks full-width on mobile; sits inline from sm up.
 */
export default function DocsCtaPair() {
  return (
    <div className="flex flex-shrink-0 flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-6">
      <ButtonLink
        href="/docs/quick-start?ref=compare-to-temporal"
        variant="primary"
        className="!w-full sm:!w-auto"
      >
        Quick start guide →
      </ButtonLink>
      <ButtonLink
        href="/docs?ref=compare-to-temporal"
        variant="secondary"
        className="!w-full sm:!w-auto"
      >
        Browse the docs
      </ButtonLink>
    </div>
  );
}
