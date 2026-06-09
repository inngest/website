"use client";

import { useCallback, useEffect, useState } from "react";
import { REPORT_TOC_ITEMS } from "./constants";

/** Site header + breathing room for scroll targets and sticky TOC. */
const HEADER_OFFSET = 112;

function getSectionElements() {
  return REPORT_TOC_ITEMS.map(({ id }) => ({
    id,
    el: document.getElementById(id),
  })).filter((s): s is { id: string; el: HTMLElement } => !!s.el);
}

function computeActiveSection(
  elements: { id: string; el: HTMLElement }[]
): string {
  if (elements.length === 0) return REPORT_TOC_ITEMS[0]?.id ?? "";

  const nearBottom =
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - 48;

  if (nearBottom) {
    return elements[elements.length - 1].id;
  }

  const scrollPos = window.scrollY + HEADER_OFFSET + 32;
  let current = elements[0].id;

  for (const { id, el } of elements) {
    if (el.offsetTop <= scrollPos) {
      current = id;
    }
  }

  return current;
}

function useActiveSection() {
  const [activeId, setActiveId] = useState(REPORT_TOC_ITEMS[0]?.id ?? "");

  useEffect(() => {
    let raf = 0;

    const update = () => {
      const elements = getSectionElements();
      if (elements.length === 0) return;
      setActiveId(computeActiveSection(elements));
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    // Run on mount and after MDX hydrates section anchors.
    update();
    const hydrateTimer = window.setTimeout(update, 150);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(hydrateTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, []);

  return activeId;
}

function useScrollToSection() {
  return useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.offsetTop - HEADER_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
  }, []);
}

type Props = {
  className?: string;
};

/** TOC for the dedicated left rail — desktop (xl+). Sticky wrapper lives in ReportLayoutShell. */
export function ReportTableOfContents({ className = "" }: Props) {
  const activeId = useActiveSection();
  const scrollTo = useScrollToSection();

  return (
    <nav aria-label="Table of contents" className={`w-full ${className}`}>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
        Contents
      </p>
      <ol className="mt-4 flex flex-col gap-1">
        {REPORT_TOC_ITEMS.map((item, index) => {
          const isActive = activeId === item.id;
          return (
            <li
              key={item.id}
              className={`border-l-2 transition-colors duration-200 ${
                isActive ? "border-[#a8ef3c]" : "border-transparent"
              }`}
            >
              <button
                type="button"
                onClick={() => scrollTo(item.id)}
                aria-current={isActive ? "true" : undefined}
                className={`flex w-full items-start gap-2.5 py-1.5 pl-3 text-left text-[13px] leading-snug transition-colors duration-200 ${
                  isActive
                    ? "font-medium text-[#a8ef3c]"
                    : "text-subtle hover:text-basis"
                }`}
              >
                <span
                  className={`mt-0.5 shrink-0 font-mono text-[10px] tracking-wider transition-colors duration-200 ${
                    isActive ? "text-[#a8ef3c]" : "text-white/30"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{item.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
      <a
        href="/assets/reports/2026-benchmark/2026-durable-execution-benchmark-report.pdf"
        className="mt-6 inline-flex items-center rounded-full bg-white px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-[#0c1f10] transition hover:bg-white/90"
      >
        Download PDF ↓
      </a>
    </nav>
  );
}

/** Sticky horizontal TOC — tablet and mobile. */
export function ReportMobileContentsBar() {
  const activeId = useActiveSection();
  const scrollTo = useScrollToSection();

  return (
    <nav
      aria-label="Table of contents"
      className="sticky top-16 z-20 -mx-6 mb-8 border-b border-white/10 bg-stone-950/90 px-6 py-3 backdrop-blur-md xl:hidden"
    >
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
        Contents
      </p>
      <ol className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {REPORT_TOC_ITEMS.map((item, index) => {
          const isActive = activeId === item.id;
          return (
            <li key={item.id} className="shrink-0">
              <button
                type="button"
                onClick={() => scrollTo(item.id)}
                aria-current={isActive ? "true" : undefined}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 font-mono text-xs transition-colors duration-200 ${
                  isActive
                    ? "bg-[#a8ef3c] font-medium text-[#0c1f10]"
                    : "bg-white/5 text-subtle hover:bg-white/10 hover:text-basis"
                }`}
              >
                {String(index + 1).padStart(2, "0")}{" "}
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
