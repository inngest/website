import React from "react";
import { RiRocket2Fill } from "@remixicon/react";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

/**
  Hide the page banner on specific pages by including this at the top of page.tsx:

  <style global>{`
    .page-banner {
      display: none;
    }
  `}</style>
 */

const Banner: React.FC<Props> = ({ href, children, className }) => (
  <a
    href={href}
    // use the .page-banner class to hide it on select pages via CSS
    className={`page-banner group flex w-full items-center justify-center gap-2.5 border-b border-[rgb(var(--color-primary-subtle))]
                px-6 pb-6 pt-3 text-base
                text-basis transition-all md:py-2 ${className}`}
    style={{
      backgroundImage: `
        linear-gradient(270deg, rgba(2, 117, 177, 0.80) 0%, rgba(21, 158, 136, 0.80) 0.02%, rgba(102, 189, 139, 0.80) 17.5%, rgba(45, 159, 101, 0.80) 100%)`,
    }}
  >
    <span className="rotate-45">
      <RiRocket2Fill className="h-4 w-4 group-hover:animate-[wiggle_200ms_ease-in-out_infinite]" />
    </span>
    <span className="underline decoration-[rgba(var(--color-carbon-0)/0.5)] underline-offset-2 transition-colors group-hover:decoration-[rgba(var(--color-carbon-0)/1)]">
      {children}
    </span>
  </a>
);

export default function AnnouncementBanner() {
  // // Return null if we want to disable the banner
  // return null;

  return (
    <Banner href="/blog/introducing-durable-endpoints?ref=announcement-banner">
      Unbreakable APIs are here: <strong>Discover Durable Endpoints</strong>
    </Banner>
  );
}
