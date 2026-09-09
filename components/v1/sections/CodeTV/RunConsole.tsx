"use client";

import { useEffect, useState } from "react";

const SCENES = [
  {
    while: "while you grab coffee",
    step: 'step.sleep("20m")',
    log: "function parked — clock is still ticking",
  },
  {
    while: "through a crash",
    step: 'step.run("start-the-thing")',
    log: "retry 2 of ∞ — picking up the last checkpoint",
  },
  {
    while: "after an event",
    step: 'waitForEvent("challenge.continue")',
    log: "listening — will resume the moment it fires",
  },
  {
    while: "while you sleep",
    step: 'step.sleep("8h")',
    log: "durable wait — nothing to babysit overnight",
  },
  {
    while: "across a deploy",
    step: "checkpoint restored",
    log: "new code, same run — still going",
  },
] as const;

export default function RunConsole() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % SCENES.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, []);

  const scene = SCENES[index];

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-lg border border-v1-subtle bg-v1-carbon-400 text-v1-frost">
      <div className="flex items-center justify-between gap-3 border-b border-v1-subtle px-4 py-3">
        <p className="font-v1Label text-[11px] uppercase tracking-[0.08em] text-v1-frost/70">
          inngest · keep-going
        </p>
        <span className="inline-flex items-center gap-2 font-v1Label text-[11px] uppercase tracking-[0.08em] text-v1-accent-green">
          <span
            aria-hidden="true"
            className="v1-codetv-pulse size-1.5 rounded-full bg-v1-accent-green"
          />
          Running
        </span>
      </div>
      <div className="flex flex-col gap-3 px-4 py-4 font-v1Mono text-[12px] leading-[1.55] sm:text-[13px]">
        <p>
          <span className="text-v1-frost/40">status</span>
          <span className="mt-1 block text-v1-frost">
            still going — {scene.while}
          </span>
        </p>
        <p>
          <span className="text-v1-frost/40">step</span>
          <span className="mt-1 block text-v1-accent-salmon">{scene.step}</span>
        </p>
        <p>
          <span className="text-v1-frost/40">log</span>
          <span className="mt-1 block text-v1-frost/80">{scene.log}</span>
        </p>
      </div>
    </div>
  );
}
