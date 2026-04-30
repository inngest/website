"use client";

export function ScrollToFormButton() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="group inline-flex items-center gap-2 rounded-md bg-[#a8ef3c] px-6 py-3 text-sm font-semibold text-[#0c1f10] transition-all hover:bg-[#baf54d]"
    >
      Download the full report
      <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
        →
      </span>
    </button>
  );
}
