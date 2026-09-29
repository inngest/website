/**
 * Homepage hero trace — a looping playback of an Inngest run.
 *
 * The tree and timeline stay put; spans draw in as the function
 * executes, two attempts fail, a retry lands, and the run finishes.
 * Motion is CSS-only (see `.ht-*` in styles/v1-animations.css) so a
 * reduced-motion preference just shows the finished trace.
 */

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3.2 8.3 6.3 11.4 12.8 4.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Chevron() {
  return (
    <svg
      className="h-2.5 w-2.5 shrink-0 text-v1-frost/45"
      viewBox="0 0 10 10"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        d="M3 1.5 7.2 5 3 8.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M13.2 8a5.2 5.2 0 1 1-1.4-3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M13.4 2.6v3.2H10.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StepsIcon() {
  return (
    <svg
      className="h-4 w-4 text-v1-frost"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 4.5h10M3 8h10M3 11.5h10"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Cursor({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 18 18"
      aria-hidden="true"
    >
      <path
        d="M2 1.2 2 15.2 6.1 11.3 9.3 17.1 11.4 16 8.2 10.3 13.2 10.1Z"
        fill="white"
        stroke="black"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HeroTrace() {
  return (
    <div className="ht-frame relative w-full select-none" aria-hidden="true">
      <div className="ht-anim ht-shell relative pb-7">
        <div className="grid grid-cols-[minmax(9.25rem,13.5rem)_minmax(0,1fr)] gap-x-3 sm:gap-x-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl border border-white/10 bg-black/55 shadow-[0_24px_60px_-28px_rgb(0_0_0_/_0.8)] backdrop-blur-md" />
            <span className="absolute bottom-4 left-[1.35rem] top-11 w-px bg-white/15" />
            <ul className="relative grid grid-rows-7 py-2">
              <li className="flex h-10 items-center gap-2 pl-3.5 font-v1Mono text-[12px] text-v1-frost">
                <span className="relative flex h-4 w-4 shrink-0 items-center justify-center">
                  <span className="ht-anim ht-run-dot absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-v1-accent-green shadow-[0_0_0_4px_rgb(11_221_72_/_0.18)]" />
                  <span className="ht-anim ht-run-check flex h-4 w-4 items-center justify-center rounded-full bg-v1-accent-green text-v1-jetBlack">
                    <CheckIcon className="h-3 w-3" />
                  </span>
                </span>
                <span className="truncate">Run</span>
              </li>
              <li className="flex h-10 items-center gap-2 pl-3.5 font-v1Mono text-[12px] text-v1-frost">
                <Chevron />
                <span className="truncate">Flaky-after-exec</span>
              </li>
              <li className="flex h-10 items-center gap-2 pl-7 font-v1Mono text-[12px] text-v1-accent-salmon">
                <Chevron />
                <span className="truncate">Attempt 0</span>
              </li>
              <li className="flex h-10 items-center gap-2 pl-7 font-v1Mono text-[12px] text-v1-accent-salmon">
                <Chevron />
                <span className="truncate">Attempt 1</span>
              </li>
              <li className="flex h-10 items-center gap-2 pl-7 font-v1Mono text-[12px] text-v1-accent-green">
                <Chevron />
                <span className="truncate">Attempt 3</span>
              </li>
              <li className="flex h-10 items-center gap-2 pl-3.5 font-v1Mono text-[12px] text-v1-frost">
                <Chevron />
                <span className="truncate">create-sandbox</span>
              </li>
              <li className="flex h-10 items-center gap-2 pl-3.5 font-v1Mono text-[12px] text-v1-frost">
                <Chevron />
                <span className="truncate">wait-running</span>
              </li>
            </ul>
          </div>

          <div className="grid grid-rows-7 py-2">
            <div className="flex h-10 items-center gap-2">
              <div className="relative h-4 w-[calc(100%-4.5rem)]">
                <div className="ht-anim ht-bar-run ht-hatch relative h-full w-full origin-left rounded-[4px]" />
              </div>
              <span className="ht-anim ht-time-run w-14 shrink-0 font-v1Mono text-[11px] text-v1-muted">
                67m 50s
              </span>
            </div>

            <div className="flex h-10 items-center gap-2">
              <div className="relative h-3 w-[22%] min-w-[2.25rem]">
                <div className="ht-anim ht-bar-flaky h-full w-full origin-left rounded-[4px] bg-v1-accent-green" />
              </div>
              <span className="ht-anim ht-time-flaky shrink-0 font-v1Mono text-[11px] text-v1-muted">
                100ms
              </span>
            </div>

            <div className="flex h-10 items-center gap-2 pl-[6%]">
              <div className="relative h-3 w-[11%] min-w-[1.15rem]">
                <div className="ht-anim ht-bar-fail0 h-full w-full origin-left rounded-[4px] bg-v1-accent-salmon" />
              </div>
              <span className="ht-anim ht-time-fail0 shrink-0 font-v1Mono text-[11px] text-v1-muted">
                3ms
              </span>
              <span className="ht-anim ht-mini-retry flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/15 bg-v1-jetBlack text-v1-frost">
                <RefreshIcon className="h-3.5 w-3.5" />
              </span>
            </div>

            <div className="flex h-10 items-center gap-2 pl-[8%]">
              <div className="relative h-3 w-[11%] min-w-[1.15rem]">
                <div className="ht-anim ht-bar-fail1 h-full w-full origin-left rounded-[4px] bg-v1-accent-salmon" />
              </div>
              <span className="ht-anim ht-time-fail1 shrink-0 font-v1Mono text-[11px] text-v1-muted">
                3ms
              </span>
            </div>

            <div className="flex h-10 items-center gap-2 pl-[4%]">
              <div className="relative h-4 w-[24%] min-w-[3.5rem]">
                <div className="ht-anim ht-bar-ok h-full w-full origin-left rounded-[4px] bg-v1-accent-green shadow-[0_0_16px_rgb(11_221_72_/_0.35)]" />
                <span className="ht-anim ht-check absolute -right-2 top-1/2 mt-[-10px] flex h-5 w-5 items-center justify-center rounded-full bg-v1-accent-green text-v1-jetBlack shadow-[0_0_0_3px_rgb(0_0_0_/_0.45)]">
                  <CheckIcon className="h-3 w-3" />
                </span>
              </div>
            </div>

            <div className="flex h-10 items-center gap-2 pl-[16%]">
              <div className="relative h-4 w-[30%] min-w-[3rem]">
                <div className="ht-anim ht-bar-sandbox h-full w-full origin-left rounded-[4px] bg-v1-accent-green" />
              </div>
              <span className="ht-anim ht-time-sandbox shrink-0 font-v1Mono text-[11px] text-v1-muted">
                12m 6s
              </span>
            </div>

            <div className="flex h-10 items-center justify-end gap-2">
              <div className="relative h-3 w-[12%] min-w-[1.35rem]">
                <div className="ht-anim ht-bar-wait h-full w-full origin-left rounded-[4px] bg-v1-accent-green" />
              </div>
              <span className="ht-anim ht-time-wait shrink-0 font-v1Mono text-[11px] text-v1-muted">
                2m 5s
              </span>
            </div>
          </div>
        </div>

        <div className="ht-anim ht-error absolute z-10 w-[min(14.5rem,46%)] overflow-hidden rounded-xl border border-white/10 bg-[#141414]/95 p-3 shadow-[0_18px_50px_-20px_rgb(0_0_0_/_0.7)]">
          <pre className="font-v1Mono text-[10px] leading-[1.45] text-v1-subtle">
            <span className="text-v1-muted">{"{"}</span>
            {"\n  "}
            <span className="text-v1-frost/80">&quot;name&quot;</span>
            <span className="text-v1-muted">: </span>
            <span className="text-v1-code-string">
              &quot;inngest/function.failed&quot;
            </span>
            <span className="text-v1-muted">,</span>
            {"\n  "}
            <span className="text-v1-frost/80">&quot;error&quot;</span>
            <span className="text-v1-muted">: </span>
            <span className="text-v1-code-string">
              &quot;invalid status code: 500&quot;
            </span>
            <span className="text-v1-muted">,</span>
            {"\n  "}
            <span className="text-v1-frost/80">&quot;__serialized&quot;</span>
            <span className="text-v1-muted">: </span>
            <span className="text-v1-code-keyword">true</span>
            {"\n}"}
          </pre>
        </div>

        <div className="ht-anim ht-retry absolute z-20 flex items-center gap-2 rounded-lg border border-white/10 bg-v1-jetBlack py-1.5 pl-1.5 pr-3 shadow-[0_16px_40px_-12px_rgb(0_0_0_/_0.65)]">
          <span className="flex h-7 w-7 items-center justify-center rounded-md border border-white/15 text-v1-frost">
            <RefreshIcon className="h-3.5 w-3.5" />
          </span>
          <span className="font-v1Heading text-[17px] tracking-[-0.02em] text-v1-accent-salmon">
            Retry
          </span>
          <span className="ht-anim ht-retry-ring pointer-events-none absolute inset-0 rounded-lg border border-v1-accent-salmon" />
          <Cursor className="ht-anim ht-cursor absolute left-[72%] top-[68%]" />
        </div>

        <div className="ht-anim ht-step absolute bottom-0 left-2 z-30 flex items-center gap-2.5 rounded-lg border border-white/10 bg-v1-jetBlack px-2.5 py-2 shadow-[0_16px_40px_-16px_rgb(0_0_0_/_0.8)]">
          <span className="flex h-7 w-7 items-center justify-center rounded-md border border-white/15">
            <StepsIcon />
          </span>
          <span className="font-v1Heading text-[16px] tracking-[-0.03em] text-v1-frost">
            step.run
          </span>
        </div>
      </div>
    </div>
  );
}
