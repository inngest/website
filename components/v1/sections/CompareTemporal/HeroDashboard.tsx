"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { V1_CYCLE_MS } from "@/utils/v1/springs";

/**
 * The runs-dashboard hero image with a live
 * terminal panel composited over its right-hand "Function Payload"
 * column. The base JPG already carries the dashboard chrome; this
 * overlay covers the JSON pane with a #121212 box (matching the
 * dashboard's own panel fill, so the seam is invisible) and cycles
 * through the onboarding terminal states on the shared page cadence.
 *
 * Everything inside the overlay is sized in `cqw` against the image
 * wrapper (which is a `container-type: inline-size` container), so the
 * panel — text, gutter, padding — scales 1:1 with the screenshot at
 * every breakpoint, exactly like the baked-in dashboard pixels do.
 */

// Terminal palette.
const GREEN = "#027a48"; // command + log lines
const PURPLE = "#8a38f5"; // INF level tag
const GRAY = "#636363"; // muted system output / title

type Segment = { t: string; c?: string };
type Line = string | Segment[];

interface TerminalContent {
  id: string;
  title: string;
  lines: Line[];
}

// Content 1 — installing the SDK.
const INSTALLING: TerminalContent = {
  id: "installing",
  title: "Installing Inngest",
  lines: [
    [{ t: "Last login: Tue Apr 28 11:28:18 on ttys002", c: GRAY }],
    "john@JohnnoMacBook-Pro ~ % cd my-inngest-project/",
    "john@JohnnoMacBook-Pro my-inngest-project % npm install inngest",
  ],
};

// Content 2 — booting the dev server.
const DEV_SERVER: TerminalContent = {
  id: "dev-server",
  title: "Running the dev server",
  lines: [
    "john@JohnnoMacBook-Pro my-inngest-project % npx inngest-cli dev",
    [
      { t: "[15:30:22.812] " },
      { t: "INF", c: PURPLE },
      { t: " starting executor grpc server svc=executor addr=:50053" },
    ],
    [
      { t: "[15:30:22.815] " },
      { t: "INF", c: PURPLE },
      { t: " service starting caller=devserver service=devserver" },
    ],
    [
      { t: "[15:30:22.815] " },
      { t: "INF", c: PURPLE },
      { t: " autodiscovering locally hosted SDKs" },
    ],
    [
      { t: "[15:30:22.815] " },
      { t: "INF", c: PURPLE },
      { t: " service starting caller=executor service=executor" },
    ],
    [
      { t: "[15:30:22.815] " },
      { t: "INF", c: PURPLE },
      { t: " service event stream backend=redis" },
    ],
    [
      { t: "[15:30:22.815] " },
      { t: "INF", c: PURPLE },
      { t: " service starting caller=runner service=runner" },
    ],
    [
      { t: "[15:30:22.815] " },
      { t: "INF", c: PURPLE },
      { t: " service server caller=api addr=0.0.0.0:8288" },
    ],
    [
      { t: "[15:30:22.817] " },
      { t: "INF", c: PURPLE },
      { t: " service starting caller=connect-gateway service=connect-gateway" },
    ],
    [
      { t: "[15:30:22.817] " },
      { t: "INF", c: PURPLE },
      {
        t: " service connect gateway grpc server caller=connect-gateway addr=:50052",
      },
    ],
    [
      { t: "[15:30:22.817] " },
      { t: "INF", c: PURPLE },
      { t: " subscribing to events topic=events" },
    ],
    "",
    [
      {
        t: "Inngest Dev Server online at 0.0.0.0:8288, visible at the following URLs:",
        c: GRAY,
      },
    ],
    [{ t: "– http://127.0.0.1:8288 (http://localhost:8288)", c: GRAY }],
    [{ t: "– http://10.0.0.34:8288", c: GRAY }],
    "",
    [{ t: "Scanning for available serve handlers.", c: GRAY }],
    [
      {
        t: "To disable scanning run ‘inngest dev’ with flags: --no-discovery -u <your-serve-url>",
        c: GRAY,
      },
    ],
  ],
};

// Cycle order. Content 3 in the brief duplicated Content 2, so there
// are two distinct panels — add a third entry here to extend the reel.
const CONTENTS: TerminalContent[] = [INSTALLING, DEV_SERVER];

function CodeLine({ line }: { line: Line }) {
  if (line === "") return <>&nbsp;</>;
  if (typeof line === "string") return <span style={{ color: GREEN }}>{line}</span>;
  return (
    <>
      {line.map((seg, i) => (
        <span key={i} style={{ color: seg.c ?? GREEN }}>
          {seg.t}
        </span>
      ))}
    </>
  );
}

function TerminalPanel({ content }: { content: TerminalContent }) {
  return (
    <div className="flex h-full w-full flex-col gap-[0.398cqw] overflow-hidden bg-v1-codeEditor px-[0.597cqw] py-[0.797cqw]">
      <p
        className="shrink-0 whitespace-nowrap text-[0.797cqw] leading-[1.195cqw]"
        style={{ color: GRAY }}
      >
        {content.title}
      </p>
      {/* One flex row per line keeps the gutter number pinned to its
          line even when long log lines wrap — a separate gutter column
          would drift the moment a body line spilled to a second row. */}
      <div className="flex min-h-0 flex-1 flex-col font-mono text-[0.697cqw] leading-[1.195cqw]">
        {content.lines.map((line, i) => (
          <div key={i} className="flex gap-[0.797cqw]">
            <span className="w-[0.9cqw] shrink-0 text-center text-white">
              {i + 1}
            </span>
            <span className="min-w-0 flex-1 whitespace-pre-wrap">
              <CodeLine line={line} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HeroDashboard() {
  const [index, setIndex] = useState(0);

  // Auto-cycle the terminal states; skipped entirely under
  // prefers-reduced-motion (no interval → no swaps → no cross-fades).
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const interval = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % CONTENTS.length);
    }, V1_CYCLE_MS);
    return () => window.clearInterval(interval);
  }, []);

  const current = CONTENTS[index];

  return (
    <div className="relative overflow-hidden rounded-[12px] border border-black/10 bg-v1-jetBlack shadow-[0_40px_120px_-40px_rgba(0,0,0,0.45)] [container-type:inline-size] lg:rounded-r-none lg:border-r-0">
      <Image
        src="/assets/v1/compare-temporal/runs-dashboard.jpg"
        alt="Inngest dashboard showing a durable function run with its per-step trace waterfall"
        width={1806}
        height={1107}
        priority
        sizes="(max-width: 1024px) 100vw, (max-width: 1928px) 56vw, 1080px"
        className="block h-auto w-full"
      />

      {/* Terminal overlay — pinned over the right-hand JSON column. */}
      <div
        aria-hidden="true"
        className="absolute"
        style={{
          left: "65.8%",
          top: "26.5%",
          width: "33.6%",
          height: "64%",
        }}
      >
        <div className="relative h-full w-full">
          <AnimatePresence initial={false}>
            <motion.div
              key={current.id}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <TerminalPanel content={current} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
