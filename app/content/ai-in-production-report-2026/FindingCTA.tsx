"use client";

export function FindingCTA() {
  return (
    <div className="mt-4">
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="group inline-flex items-center gap-1.5 rounded-md bg-[#a8ef3c] px-5 py-2.5 text-sm font-semibold text-[#0c1f10] transition-all hover:bg-[#baf54d]"
      >
        Download full report
        <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
          →
        </span>
      </button>
    </div>
  );
}
