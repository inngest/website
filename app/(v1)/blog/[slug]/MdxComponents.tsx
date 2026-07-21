import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/v1/cn";

type BlogButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  arrow?: "left" | "right";
  href: string;
};

export function BlogButton({
  children,
  className,
  href,
  arrow,
  ...props
}: BlogButtonProps) {
  const classes = cn(
    "not-prose inline-flex h-10 min-w-[144px] items-center justify-center gap-1 rounded-md bg-v1-frost px-5 font-v1Label text-[12px] font-semibold uppercase tracking-[normal] text-v1-jetBlack no-underline transition-colors hover:bg-v1-accent-salmon hover:text-v1-frost",
    className
  );
  const content = (
    <>
      {arrow === "left" ? <span aria-hidden="true">&larr;</span> : null}
      <span>{children}</span>
      {arrow === "right" ? <span aria-hidden="true">&rarr;</span> : null}
    </>
  );

  if (/^(https?:|mailto:|tel:)/.test(href)) {
    return (
      <a className={classes} href={href} {...props}>
        {content}
      </a>
    );
  }

  return (
    <Link className={classes} href={href} {...props}>
      {content}
    </Link>
  );
}

export function BlogCallout({
  variant = "default",
  skipSearchCrawler = false,
  children,
}: {
  variant?: "default" | "info" | "warning" | "tip";
  skipSearchCrawler?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "my-6 rounded-lg p-6 [&>:first-child]:mt-0 [&>:last-child]:mb-0 [&_a]:decoration-current",
        (variant === "default" || variant === "info") &&
          "bg-info/30 text-info dark:bg-info/30 dark:text-info",
        variant === "warning" &&
          "bg-warning text-warning dark:bg-warning/50 dark:text-warning",
        variant === "tip" &&
          "bg-success text-success dark:bg-success/50 dark:text-success",
        skipSearchCrawler && "algolia-skip-crawler"
      )}
    >
      {children}
    </div>
  );
}

export function BlogRow({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 grid grid-cols-1 items-start gap-x-12 gap-y-10 xl:max-w-none xl:grid-cols-2 [&>:first-child]:mt-0 [&>:last-child]:mb-0">
      {children}
    </div>
  );
}

export function BlogCol({
  children,
  sticky = false,
}: {
  children: ReactNode;
  sticky?: boolean;
}) {
  return (
    <div
      className={cn(
        "[&>:first-child]:mt-0 [&>:last-child]:mb-0",
        sticky && "xl:sticky xl:top-24"
      )}
    >
      {children}
    </div>
  );
}

export function BlogAutoplayVideo({
  src,
  loop = true,
  controls = true,
  autoPlay = true,
  poster,
}: {
  src: string;
  loop?: boolean;
  controls?: boolean;
  autoPlay?: boolean;
  poster?: string;
}) {
  return (
    <video
      className="my-6 w-full rounded-[8px] border border-[rgba(124,124,124,0.35)]"
      src={src}
      poster={poster}
      playsInline
      loop={loop}
      controls={controls}
      preload="metadata"
      autoPlay={autoPlay}
      muted
    />
  );
}

function getYouTubeId(id: string): string {
  const pathPart = id.split("/").pop() ?? id;
  if (pathPart.includes("?v=")) return pathPart.split("?v=")[1].split("&")[0];
  return pathPart.split("?")[0].split("&")[0];
}

export function BlogYouTube({
  id,
  title = "YouTube video",
  prependSrc = "https://www.youtube.com/embed/",
  appendSrc = "",
}: {
  id: string;
  title?: string;
  prependSrc?: string;
  appendSrc?: string;
  height?: number;
  width?: number;
}) {
  return (
    <div className="not-prose my-6 aspect-video w-full overflow-hidden rounded-[8px] border border-[rgba(124,124,124,0.35)]">
      <iframe
        className="h-full w-full"
        src={`${prependSrc}${getYouTubeId(id)}${appendSrc}`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}

const PRODUCT_HUNT_URL =
  "https://www.producthunt.com/posts/workflow-kit-by-inngest?embed=true&utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-workflow&#0045;kit&#0045;by&#0045;inngest";

export function BlogProductHunt() {
  return (
    <a
      className="not-prose my-6 inline-block"
      href={PRODUCT_HUNT_URL}
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        src="https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=490802&theme=dark&period=daily"
        alt="Workflow Kit by Inngest - Open source SDK to add Zapier-like workflows to your product | Product Hunt"
        width="250"
        height="54"
      />
    </a>
  );
}
