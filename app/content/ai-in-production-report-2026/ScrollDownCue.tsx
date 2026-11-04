"use client";

export function ScrollDownCue() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
      className="mt-7 flex w-full flex-col items-center gap-4 opacity-60 transition-opacity hover:opacity-100"
    >
      <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-[#a8ef3c]/80">
        Or explore key findings below
      </span>
      <span className="flex h-8 w-8 animate-bounce items-center justify-center rounded-full border border-[#a8ef3c]/40 bg-[#a8ef3c]/5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#a8ef3c"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 5v14" />
          <path d="M19 12l-7 7-7-7" />
        </svg>
      </span>
    </button>
  );
}
