import Link from "next/link";
import Image, { type ImageProps } from "next/image";
import { type MDXComponents } from "mdx/types";
import { Unreleased } from "shared/Docs/Unreleased";

// Cloud (#eaeaea) is the body colour for this page; there is no v1
// token for it, so it's used as a literal here and on the entry date.
export const CLOUD = "text-[#eaeaea]";

// v1 renderers for changelog body copy. Links are
// salmon; bold is white; images are full-width rounded. Inline code,
// bullets and paragraph rhythm are styled on the BODY wrapper below.
// `code`/`pre` are intentionally left to the shared Docs (CodeHike)
// components so the few entries with fenced code keep syntax highlighting.
export const mdxComponents: MDXComponents = {
  a: ({ href, children, ...props }) => (
    <Link
      href={href ?? "#"}
      {...props}
      className="text-v1-accent-salmon-light underline-offset-2 motion-safe:transition-colors hover:underline"
    >
      {children}
    </Link>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-white">{children}</strong>
  ),
  img: (props) => (
    <Image
      width={0}
      height={0}
      sizes="(min-width: 1024px) 800px, 100vw"
      className="h-auto w-full rounded-lg"
      {...(props as ImageProps)}
    />
  ),
  // Gate inline content behind ?unreleased=<label> (e.g. scoring references in
  // an otherwise-public entry). Whole-entry gating uses the `unreleased` export.
  Unreleased,
};

// Body wrapper. CircularXX 16/24 cloud, 16px between top-level blocks.
// Bullet lists hang a cloud disc in a 24px gutter with 16px between
// items. Inline code (every `code` not inside a
// fenced `pre`) renders as a bordered mono chip.
export const BODY = [
  "text-v1-body-sm-loose",
  CLOUD,
  "[&>*+*]:mt-4",
  "[&_ul]:list-disc [&_ul]:ps-6 [&_ul>li+li]:mt-4 [&_li]:marker:text-[#eaeaea]",
  "[&_:not(pre)>code]:rounded-[4px] [&_:not(pre)>code]:border [&_:not(pre)>code]:border-v1-frost/25",
  "[&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-px [&_:not(pre)>code]:font-v1Mono",
  "[&_:not(pre)>code]:text-[0.95em] [&_:not(pre)>code]:text-[#eaeaea]",
].join(" ");
