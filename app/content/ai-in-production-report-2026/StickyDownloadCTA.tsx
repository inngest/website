"use client";
import { useEffect, useState } from "react";

export function StickyDownloadCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300"
      style={{ transform: visible ? "translateY(0)" : "translateY(100%)" }}
    >
      <div className="border-t border-white/10 bg-black/80 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
          <p className="hidden text-sm font-bold text-subtle sm:block">
            AI in Production: The 2026 Benchmark Report
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group ml-auto inline-flex items-center gap-2 rounded-md bg-[#a8ef3c] px-6 py-2.5 text-sm font-semibold text-[#0c1f10] transition-all hover:bg-[#baf54d]"
          >
            Download the full report
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
