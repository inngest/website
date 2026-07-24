import Link from "next/link";
import RegisterCue from "@/components/v1/sections/Events/RegisterCue";
import SpotlightFrame from "@/components/v1/sections/Events/SpotlightFrame";
import Chip from "@/components/v1/sections/shared/Chip";
import type { PostCard } from "@/components/v1/sections/Learn/types";

export default function ResourceCard({ post }: { post: PostCard }) {
  const ctaLabel =
    post.type === "VIDEO"
      ? "Watch video"
      : post.type === "DEMO"
      ? "View demo"
      : post.type === "REPORT"
      ? "Read report"
      : "Read article";
  return (
    // TODO(blog-migration): all cards are currently BLOG posts routed to
    // /blog/[slug]. Add per-type routing once REPORT/VIDEO/DEMO content
    // sources exist.
    <Link
      href={post.href ?? `/blog/${post.slug}`}
      className="block h-full rounded-lg"
    >
      {/* Black gradient frame + cursor spotlight / lift / tilt hover —
          identical chrome to the Events grid card. */}
      <SpotlightFrame
        tilt
        variant="black"
        className="h-full"
        innerClassName="flex h-full flex-col"
      >
        {/* Content area — flex-1 + min-h keeps cards in a row aligned
            with the image flush at the bottom. */}
        <div className="flex min-h-[240px] flex-1 flex-col gap-6 px-5 pb-6 pt-5">
          <div className="flex items-center justify-between">
            <Chip variant="gradient" size="sm">
              {post.type}
            </Chip>
            {/* Date — Body/Small, smoke #cfcfcf at 80%. */}
            <span className="text-v1-body-sm text-[#cfcfcf]/80">
              {post.prettyDate}
            </span>
          </div>
          {/* Title — Heading/Sm (Whyte 26/31.2, -0.26px). Reserve two
              lines so descriptions align across cards. */}
          <h3 className="text-v1-heading-sm text-white">{post.title}</h3>
          {/* Description + CTA. The CTA is the shared RegisterCue
              (Label/Md, reacts to the card's group/card hover with a
              salmon + arrow nudge). */}
          <p className="text-v1-body-sm line-clamp-2 text-white/80">
            {post.subtitle ?? ""}
          </p>
          <div className="mt-auto">
            <RegisterCue label={ctaLabel} />
          </div>
        </div>
        <Tile post={post} />
      </SpotlightFrame>
    </Link>
  );
}

/** Image at the bottom of each card. Full-bleed, object-cover at the
 *  ~445.33:200 aspect. Image-less posts get the carbon-300 placeholder
 *  block shown for REPORT cards. */
function Tile({ post }: { post: PostCard }) {
  if (!post.image) {
    return (
      <div
        aria-hidden="true"
        className="aspect-[2/1] w-full shrink-0 bg-v1-carbon-300"
      />
    );
  }
  return (
    <div className="aspect-[2/1] w-full shrink-0 overflow-hidden">
      <img
        src={post.image}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover"
      />
    </div>
  );
}
