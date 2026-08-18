import ButtonLink from "@/components/v1/ButtonLink";
import { cn } from "@/utils/v1/cn";

export type BlogSidebarCtaProps = {
  text: string;
  buttonLabel: string;
  href: string;
  className?: string;
};

// Slim conversion CTA that sits directly beneath BlogToc in the blog
// post's sticky right rail (see ArticleSection in page.tsx). It's a
// plain server component — no "use client", no observers/listeners —
// so it rides along inside BlogToc's existing `sticky` wrapper for
// zero extra JS: ButtonLink/Button are already part of the page's
// client bundle via BuildBetterAgentsCta below the article, so this
// adds no new chunk, just a few bytes of server-rendered markup.
//
// Opt-in per post via the `sidebarCta` frontmatter field (see Scope
// in page.tsx) — most posts render nothing here.
export default function BlogSidebarCta({
  text,
  buttonLabel,
  href,
  className,
}: BlogSidebarCtaProps) {
  // Off-site targets (e.g. a Zoom recording) open in a new tab, per
  // the same convention as LightningLabShipYourFirstEval's external
  // register link — internal /docs, /sign-up, /customers, etc. links
  // navigate in-tab as usual.
  const isExternal = /^https?:\/\//i.test(href);

  return (
    <div
      className={cn(
        "mt-6 flex flex-col gap-4 rounded-[8px] border border-v1-strong/[0.35] px-6 py-6",
        className
      )}
      style={{
        backgroundImage:
          "linear-gradient(-53.62deg, rgba(33,33,33,0) 2.25%, #020202 46.83%)",
      }}
    >
      <p className="text-v1-body-sm text-v1-frost/80">{text}</p>
      <ButtonLink
        href={href}
        variant="secondary"
        size="sm"
        // `sm` is the smallest step on the shared Button scale; these
        // overrides shrink it further for this narrow sidebar slot.
        // `cn` runs tailwind-merge, so these cleanly win over the
        // `sm` size classes instead of just concatenating.
        className="h-7 min-w-0 self-start px-4 text-[11px]"
        {...(isExternal
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {buttonLabel}
      </ButtonLink>
    </div>
  );
}
