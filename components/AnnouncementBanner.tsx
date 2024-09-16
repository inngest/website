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

const AnnouncementBanner: React.FC<Props> = ({ href, children, className }) => (
  <a
    href={href}
    // use the .page-banner class to hide it on select pages via CSS
    className={`page-banner group flex items-center justify-center gap-2.5 w-full py-2 px-6
                border-b border-[rgb(var(--color-primary-subtle))]
                text-base text-basis transition-all ${className}`}
    style={{
      backgroundImage: `
        linear-gradient(270deg, rgba(2, 117, 177, 0.80) 0%, rgba(21, 158, 136, 0.80) 0.02%, rgba(102, 189, 139, 0.80) 17.5%, rgba(45, 159, 101, 0.80) 100%)`,
    }}
  >
    <span className="rotate-45">
      <RiRocket2Fill className="h-4 w-4 group-hover:animate-[wiggle_200ms_ease-in-out_infinite]" />
    </span>
    <span className="underline underline-offset-2 decoration-[rgba(var(--color-carbon-0)/0.5)] group-hover:decoration-[rgba(var(--color-carbon-0)/1)] transition-colors">
      {children}
    </span>
  </a>
);

export default AnnouncementBanner;
