"use client";

import {
  RiArrowDownLine,
  RiArrowUpLine,
  RiPauseFill,
  RiPlayFill,
  RiRestartLine,
} from "@remixicon/react";
import type { ReactNode } from "react";
import {
  ControlButton,
  useLoop,
} from "../FlowControlMarbles/FlowControlMarbles";

const DOMAIN = 6;
const STEP_AT = [0.2, 1.1, 2, 3.6, 4.5];

const CAPTION =
  "web's test asks platform for node-base. platform builds it in its own build run and replies when it's ready, then web's test starts from it.";

function Badge({ n, on }: { n: number; on: boolean }) {
  return (
    <span
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold transition-colors duration-300 motion-reduce:transition-none ${
        on
          ? "bg-breeze-500 text-white dark:bg-breeze-400 dark:text-carbon-1000"
          : "bg-carbon-200 text-carbon-600 dark:bg-carbon-700 dark:text-carbon-300"
      }`}
    >
      {n}
    </span>
  );
}

/** A step on one app's side of the diagram. */
function Card({
  n,
  on,
  app,
  tone,
  place,
  children,
}: {
  n?: number;
  on: boolean;
  app: string;
  tone: "run" | "miss" | "build" | "hit";
  /** Grid cell on wide screens. */
  place: string;
  children: ReactNode;
}) {
  const TONE = {
    run: "bg-breeze-500 text-white dark:bg-breeze-400 dark:text-carbon-1000",
    miss: "bg-honey-200 text-honey-900 dark:bg-honey-500/30 dark:text-honey-100",
    build:
      "bg-honey-400 text-honey-900 dark:bg-honey-500 dark:text-carbon-1000",
    hit: "bg-matcha-400 text-matcha-900 dark:bg-matcha-500 dark:text-carbon-1000",
  };

  return (
    <div
      className={`z-[1] flex items-center gap-2 rounded-md px-2.5 py-2 text-[11px] font-medium transition-opacity duration-300 motion-reduce:transition-none ${
        TONE[tone]
      } ${on ? "opacity-100" : "opacity-20"} ${place}`}
    >
      {n !== undefined && (
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/70 text-[11px] font-semibold text-carbon-900 dark:bg-black/30 dark:text-white">
          {n}
        </span>
      )}
      <span className="min-w-0 flex-1">{children}</span>
      <span className="text-[10px] uppercase tracking-wide opacity-70 lg:hidden">
        {app}
      </span>
    </div>
  );
}

/** A message from one app to the other. */
function Arrow({
  n,
  on,
  toPlatform,
  place,
  children,
}: {
  n: number;
  on: boolean;
  toPlatform: boolean;
  place: string;
  children: ReactNode;
}) {
  const Vertical = toPlatform ? RiArrowDownLine : RiArrowUpLine;

  return (
    <div
      className={`flex flex-col items-center justify-center gap-1 px-1 py-1 text-[11px] text-subtle transition-opacity duration-300 motion-reduce:transition-none ${
        on ? "opacity-100" : "opacity-20"
      } ${place}`}
    >
      <span className="flex items-center gap-1.5 text-center">
        <Badge n={n} on={on} />
        {children}
      </span>
      <Vertical
        aria-hidden="true"
        className="h-4 w-4 text-breeze-500 lg:hidden"
      />
      <svg
        aria-hidden="true"
        viewBox="0 0 100 10"
        preserveAspectRatio="none"
        className="hidden h-2.5 w-full text-breeze-500 lg:block"
      >
        <line
          x1={toPlatform ? 0 : 100}
          x2={toPlatform ? 94 : 6}
          y1="5"
          y2="5"
          stroke="currentColor"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={toPlatform ? "M90 1 L98 5 L90 9" : "M10 1 L2 5 L10 9"}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

function Panel({ name, place }: { name: string; place: string }) {
  return (
    <div
      className={`hidden rounded-md px-2 pt-2 text-[11px] font-semibold uppercase tracking-wide text-muted ring-1 ring-inset ring-carbon-200 dark:ring-carbon-700 lg:block ${place}`}
    >
      {name}
    </div>
  );
}

/**
 * A flow diagram of one app asking another for a base image: web's pipeline
 * run starts a test, platform builds `node-base` in its own build run, and the
 * test starts from it. Numbered arrows show the back-and-forth in order. It
 * plays while on screen and rests on its last frame with reduced motion.
 */
export function CiFlow() {
  const { rootRef, t, playing, toggle, replay } = useLoop(DOMAIN, 7);
  const on = STEP_AT.map((at) => {
    return t >= at;
  });

  return (
    <figure
      ref={rootRef}
      className="not-prose my-8 flex flex-col gap-2 rounded-xl bg-canvasSubtle p-3 leading-normal text-basis sm:p-4"
    >
      <div
        className="grid grid-cols-1 gap-2 rounded-lg bg-canvasBase p-2 lg:grid-cols-[1fr_8.5rem_1fr] lg:grid-rows-[1.5rem_repeat(5,2.75rem)_0.5rem] lg:gap-x-0 lg:gap-y-1.5"
        role="img"
        aria-label={CAPTION}
      >
        <Panel
          name="web app · pipeline run"
          place="lg:col-start-1 lg:row-span-7 lg:row-start-1"
        />
        <Panel
          name="platform app"
          place="lg:col-start-3 lg:row-span-7 lg:row-start-1"
        />

        <Card
          n={1}
          on={on[0]}
          app="web"
          tone="run"
          place="lg:col-start-1 lg:row-start-2 lg:mx-2"
        >
          test starts
        </Card>

        <div
          className={`hidden items-center rounded-md border border-dashed border-carbon-300 px-2.5 text-[11px] text-subtle transition-opacity duration-300 dark:border-carbon-600 lg:col-start-1 lg:row-span-3 lg:row-start-3 lg:mx-2 lg:flex ${
            on[1] && !on[4] ? "opacity-100" : "opacity-20"
          }`}
        >
          test waits for node-base
        </div>

        <Arrow
          n={2}
          on={on[1]}
          toPlatform
          place="lg:col-start-2 lg:row-start-3"
        >
          asks for node-base
        </Arrow>

        <Card
          n={3}
          on={on[2]}
          app="platform"
          tone="miss"
          place="lg:col-start-3 lg:row-span-2 lg:row-start-3 lg:mx-2"
        >
          node-base: cache miss, builds in its own build run
        </Card>

        <Arrow
          n={4}
          on={on[3]}
          toPlatform={false}
          place="lg:col-start-2 lg:row-start-5"
        >
          node-base is ready
        </Arrow>

        <Card
          on={on[3]}
          app="platform"
          tone="hit"
          place="lg:col-start-3 lg:row-start-5 lg:mx-2"
        >
          node-base cached, sends done
        </Card>

        <Card
          n={5}
          on={on[4]}
          app="web"
          tone="run"
          place="lg:col-start-1 lg:row-start-6 lg:mx-2"
        >
          test starts from node-base
        </Card>
      </div>

      <figcaption className="m-0 flex items-start gap-2 text-xs leading-relaxed text-subtle">
        <span className="flex-1">{CAPTION}</span>
        <span className="-my-1 flex shrink-0 items-center gap-0.5">
          <ControlButton label={playing ? "Pause" : "Play"} onClick={toggle}>
            {playing ? (
              <RiPauseFill className="h-3.5 w-3.5" />
            ) : (
              <RiPlayFill className="h-3.5 w-3.5" />
            )}
          </ControlButton>
          <ControlButton label="Replay" onClick={replay}>
            <RiRestartLine className="h-3.5 w-3.5" />
          </ControlButton>
        </span>
      </figcaption>
    </figure>
  );
}
