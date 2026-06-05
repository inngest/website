import type { ReactNode } from "react";

type Props = {
  toc: ReactNode;
  children: ReactNode;
};

/**
 * Two-column report layout: dedicated left rail for the TOC, content on the right.
 * The aside column is reserved for the full scroll height so nothing overlaps the nav.
 */
export function ReportLayoutShell({ toc, children }: Props) {
  return (
    <div className="xl:grid xl:grid-cols-[13rem_minmax(0,1fr)] xl:gap-x-10 2xl:gap-x-12">
      <aside
        aria-label="Report navigation"
        className="relative hidden xl:block border-r border-white/[0.06] pr-8"
      >
        {/* Aside stretches to full row height; inner wrapper sticks while scrolling. */}
        <div className="sticky top-28 z-20 max-h-[calc(100vh-7rem)] overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {toc}
        </div>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
