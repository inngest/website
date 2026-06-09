"use client";

import { useState } from "react";
import { motion } from "motion/react";
import ButtonLink from "@/components/v1/ButtonLink";
import GradientFrame from "@/components/v1/sections/shared/GradientFrame";
import ReelDirectoryRow from "@/components/v1/sections/shared/ReelDirectoryRow";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import { cn } from "@/utils/v1/cn";
import { reveals } from "@/utils/v1/reveals";

// "Observability by default." Bordered card with a
// top row (514px copy column + 784px dashboard) and a 3×2 feature grid
// below. The CTA sits under the intro copy in the left column; the grid
// holds the five features (its 6th cell is empty). Feature rows use a
// salmon square bullet on the first (featured) item and a gray bullet
// on the rest, with title + supporting copy stacked beneath.

interface Feature {
  title: string;
  body: string;
}

const FEATURES: Feature[] = [
  {
    title: "Waterfall Traces",
    body: "Functions traced automatically, in parallel",
  },
  {
    title: "Metrics dashboard",
    body: "System health at the environment level",
  },
  {
    title: "Run search",
    body: "Find the exact run for any user, org,\nor error pattern",
  },
  {
    title: "Replay",
    body: "Deploy a fix and re-run in bulk—\nno dead-letter queues",
  },
  {
    title: "Insights",
    body: "Query event and run data with SQL.\nNo ETL needed",
  },
];

export default function Observability() {
  // The five features double as reel-directory selectors: hover spotlight
  // + salmon dot, with a persistent active row. There's no panel to swap
  // here, so selection is purely a highlight — "Waterfall Traces" (the
  // featured item) is active by default.
  const [selected, setSelected] = useState(0);
  return (
    <Section
      aria-labelledby="de-observability-heading"
      className="relative"
    >
      <GradientFrame
        variant="charcoal"
        className="rounded-md"
        innerClassName="p-8 sm:p-12 lg:p-16"
      >
        {/* Top row — left copy column is 514px and the dashboard is
            784px with a 16px gap. */}
        <div className="grid grid-cols-1 gap-x-4 gap-y-10 lg:grid-cols-[minmax(0,514px)_minmax(0,784px)] lg:items-center">
          <SectionHeader
            id="de-observability-heading"
            title={
              <>
                <span className="block">Observability</span>
                <span className="block">by default.</span>
              </>
            }
            body="To guarantee completion, Inngest tracks the state of every step. That state is the trace — every timing, input, output, and retry, captured from day one with no extra instrumentation."
            bodyClassName="max-w-[445px]"
            actions={
              <ButtonLink
                href="/docs/observability?ref=durable-execution"
                variant="primary"
              >
                Learn more about Observability
              </ButtonLink>
            }
          />

          <motion.div {...reveals.body}>
            <DashboardPanel />
          </motion.div>
        </div>

        {/* Feature grid sits 40px
            below the dashboard row. 3 columns × 2 rows, gap-x-4
            (16px) / gap-y-8 (32px). Each cell is a reel-directory row;
            -mx-[22px] cancels the rows' inner padding so the dots stay
            aligned to the frame's content edge while the hover/active
            background bleeds outward. */}
        <div className="-mx-[22px] mt-20 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => {
            const isActive = i === selected;
            return (
              <motion.div key={f.title} {...reveals.item(i)} className="h-full">
                <ReelDirectoryRow
                  isActive={isActive}
                  onSelect={() => setSelected(i)}
                >
                  <span className="flex flex-1 flex-col gap-2">
                    <span
                      className={cn(
                        "flex min-h-10 items-center text-v1-heading-sm motion-safe:transition-colors",
                        isActive
                          ? "text-v1-frost"
                          : "text-v1-frost/70 group-hover/row:text-v1-frost",
                      )}
                    >
                      {f.title}
                    </span>
                    <span
                      className={cn(
                        "whitespace-pre-line text-v1-body-sm motion-safe:transition-colors",
                        isActive ? "text-v1-frost" : "text-v1-frost/80",
                      )}
                    >
                      {f.body}
                    </span>
                  </span>
                </ReelDirectoryRow>
              </motion.div>
            );
          })}
        </div>
      </GradientFrame>
    </Section>
  );
}

const OBSERVABILITY_VIDEO_ID = "QQoBDK0OePw";

function DashboardPanel() {
  // Click-to-load YouTube facade: the dashboard screenshot is the poster;
  // clicking swaps in the (autoplaying) YouTube player. The facade keeps
  // the heavy iframe off the initial load until the user opts in.
  const [playing, setPlaying] = useState(false);
  return (
    <div
      className="relative overflow-hidden bg-v1-jetBlack"
      style={{
        aspectRatio: "784/502",
        border: "1px solid #ffffff",
      }}
    >
      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube.com/embed/${OBSERVABILITY_VIDEO_ID}?autoplay=1&rel=0`}
          title="Observability by default — Inngest"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : (
        <>
          <img
            src="/assets/v1/scale-instantly/dashboard.webp"
            alt="Inngest dashboard showing a function run trace with per-step timings."
            width={1275}
            height={824}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="absolute inset-0 block h-full w-full select-none object-cover object-left-top"
          />
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label="Play observability demo"
            className="group absolute inset-0 flex cursor-pointer items-center justify-center"
          >
            <span className="flex size-[80px] items-center justify-center rounded-full bg-v1-frost/15 backdrop-blur-md motion-safe:transition-transform group-hover:scale-110">
              <span className="flex size-[64px] items-center justify-center rounded-full bg-v1-frost/85">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="ml-[3px] size-7 text-v1-jetBlack"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </span>
          </button>
        </>
      )}
    </div>
  );
}
