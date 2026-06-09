"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { reveals } from "@/utils/v1/reveals";
import { BREAKPOINTS } from "@/utils/v1/breakpoints";
import { cn } from "@/utils/v1/cn";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";

// "What queues can't do, we can." Five problem cards in a row; each is
// an icon plus a bordered caption that, on hover, swaps the "WITHOUT
// INNGEST" / problem label for the "WITH INNGEST" / solution label. The
// icons are stipple-art SVGs.
//
// Touch devices have no hover, so on mobile each card self-activates
// while it sits in the central band of the viewport as the user
// scrolls (mirrors the desktop hover via `data-active` →
// `group-data-[active=true]:`). Gated below `lg` so desktop keeps
// pure pointer-hover.

interface Problem {
  id: string;
  /** Default icon (without Inngest) — PNG under /public. */
  icon: string;
  /** Hover icon (with Inngest) — PNG under /public. */
  iconHover: string;
  /** Icon's native pixel dimensions. The wrapper uses a fixed 122px
   *  icon-row height and a max width of 128px, so preserving aspect
   *  keeps the art crisp. Default and hover variants share the same
   *  intrinsic size. */
  iconW: number;
  iconH: number;
  /** Hover label (with Inngest) — Label/Md, uppercased. */
  solution: string;
  /** Default label (without Inngest) — Label/Md, uppercased. */
  problem: string;
}

const PROBLEMS: Problem[] = [
  {
    id: "noisy-neighbor",
    icon: "/assets/v1/queues-flow-control/problems/noisy-neighbor.png",
    iconHover: "/assets/v1/queues-flow-control/problems/noisy-neighbor-hover.png",
    iconW: 261,
    iconH: 235,
    solution: "Isolated workloads",
    problem: "Noisy neighbor problems",
  },
  {
    id: "rate-limiting",
    icon: "/assets/v1/queues-flow-control/problems/rate-limiting.png",
    iconHover: "/assets/v1/queues-flow-control/problems/rate-limiting-hover.png",
    iconW: 259,
    iconH: 174,
    solution: "Built-in rate limiting",
    problem: "Hand-rolled rate limiting",
  },
  {
    id: "priority",
    icon: "/assets/v1/queues-flow-control/problems/priority.png",
    iconHover: "/assets/v1/queues-flow-control/problems/priority-hover.png",
    iconW: 262,
    iconH: 157,
    solution: "Unified priority control",
    problem: "Priority queue sprawl",
  },
  {
    id: "wasted",
    icon: "/assets/v1/queues-flow-control/problems/wasted.png",
    iconHover: "/assets/v1/queues-flow-control/problems/wasted-hover.png",
    iconW: 258,
    iconH: 176,
    solution: "Zero wasted compute",
    problem: "Wasted compute",
  },
  {
    id: "cancellation",
    icon: "/assets/v1/queues-flow-control/problems/cancellation.png",
    iconHover: "/assets/v1/queues-flow-control/problems/cancellation-hover.png",
    iconW: 231,
    iconH: 199,
    solution: "Real-time cancellation",
    problem: "Impossible cancellation",
  },
];

export default function ProblemsGrid({
  eyebrow,
  headline = "What queues can't do, we can.",
  intro = "Add the control layer queues are missing: fairness, priority, and real-time control.",
  labelledById = "qfc-problems-headline",
}: {
  eyebrow?: React.ReactNode;
  headline?: React.ReactNode;
  intro?: React.ReactNode;
  labelledById?: string;
} = {}) {
  // Mobile (no hover): the card row nearest the viewport centre is
  // "active" as the user scrolls. In the 1-col layout that's a single
  // card; in the 2-col (sm) layout it's the whole side-by-side row, so
  // a pair never lights unevenly. Disabled at lg+ where pointer hover
  // drives the inversion instead.
  const sectionRef = useRef<HTMLElement | null>(null);
  const liRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [activeIndices, setActiveIndices] = useState<readonly number[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mq = window.matchMedia(`(max-width: ${BREAKPOINTS.lg - 0.02}px)`);
    let raf = 0;
    let listening = false;
    let visible = false;

    // rAF-throttled measure of which card row sits nearest the
    // viewport centre. getBoundingClientRect forces layout, so this
    // only ever runs while the section itself is on screen (gated by
    // the IntersectionObserver below) and only below lg.
    const compute = () => {
      raf = 0;
      const viewportCenter = window.innerHeight / 2;
      // First pass: each card's vertical centre + distance to viewport
      // centre; track the nearest as the active row's anchor.
      const centers = liRefs.current.map((el) =>
        el ? el.getBoundingClientRect().top + el.offsetHeight / 2 : NaN,
      );
      let anchor = NaN;
      let bestDist = Infinity;
      centers.forEach((c) => {
        if (Number.isNaN(c)) return;
        const dist = Math.abs(c - viewportCenter);
        if (dist < bestDist) {
          bestDist = dist;
          anchor = c;
        }
      });
      // Second pass: light every card sharing the anchor's row (same
      // vertical centre within a 2px tolerance) — one card in 1-col,
      // the side-by-side pair in 2-col.
      const next = Number.isNaN(anchor)
        ? []
        : centers.flatMap((c, i) => (Math.abs(c - anchor) < 2 ? [i] : []));
      setActiveIndices((prev) =>
        prev.length === next.length && prev.every((v, i) => v === next[i])
          ? prev
          : next,
      );
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };

    const startListening = () => {
      if (listening) return;
      listening = true;
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      compute();
    };
    const stopListening = () => {
      if (!listening) return;
      listening = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      setActiveIndices([]);
    };
    const update = () =>
      mq.matches && visible ? startListening() : stopListening();

    // Cheap gate: only track scroll position while the section is in
    // (or near) the viewport. The 100px margin starts tracking just
    // before it scrolls in so the first card is already lit on entry.
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        update();
      },
      { rootMargin: "100px 0px 100px 0px" },
    );
    io.observe(section);
    mq.addEventListener("change", update);

    return () => {
      mq.removeEventListener("change", update);
      io.disconnect();
      stopListening();
    };
  }, []);

  return (
    <Section
      ref={sectionRef}
      aria-labelledby={labelledById}
      // Section box (gutters/padding/width) via <Section>;
      // header → cards uses the 48px stack (body → content rhythm).
      className="relative"
      containerClassName="flex flex-col gap-v1-stack-lg"
    >
      <SectionHeader
        id={labelledById}
        eyebrow={eyebrow}
        title={headline}
        body={intro}
        bodyClassName="max-w-[655px]"
      />

      {/* Cards — items-end so the 122px icon row aligns to
            the same baseline regardless of intrinsic icon height. 5-up
            at lg, 2-up at sm, stacked on mobile. Adjacent borders
            overlap via -ml-px so the strip reads as one continuous box. */}
        <ul className="grid list-none grid-cols-1 gap-y-12 pl-0 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-5 lg:items-end lg:gap-y-0">
          {PROBLEMS.map((p, i) => (
            <ProblemCard
              key={p.id}
              problem={p}
              index={i}
              active={activeIndices.includes(i)}
              innerRef={(el) => {
                liRefs.current[i] = el;
              }}
            />
          ))}
        </ul>
    </Section>
  );
}

/**
 * One problem card. `group` drives the desktop hover state; on mobile
 * the same inversion is driven by `data-active`, which the parent sets
 * on whichever card sits nearest the viewport centre as the user
 * scrolls. Every `group-hover:` style below is mirrored by a
 * `group-data-[active=true]:` twin so the two triggers stay in lockstep.
 */
function ProblemCard({
  problem: p,
  index: i,
  active,
  innerRef,
}: {
  problem: Problem;
  index: number;
  active: boolean;
  innerRef: (el: HTMLLIElement | null) => void;
}) {
  return (
    <motion.li
      ref={innerRef}
      {...reveals.item(i)}
      data-active={active ? "true" : undefined}
      // `group` drives the hover state below. On hover (desktop) or
      // when active (mobile scroll), the caption block inverts (white
      // bg, black text) while the icon stays in place but brightens —
      // boosting the white-stipple's effective contrast against the
      // unchanged dark backdrop.
      className="group relative flex list-none flex-col items-stretch gap-10 sm:gap-[60px] lg:gap-[83px]"
    >
      {/* The icon and both label states below are decorative /
          aria-hidden (the copy lives in stacked hover layers), so this
          is the only accessible text for the card. */}
      <span className="sr-only">
        Without Inngest: {p.problem}. With Inngest: {p.solution}.
      </span>

      {/* Icon row — 122px tall, art centred, max width 128px.
          Default and hover variants are stacked
          in the same box; group-hover crossfades between them
          and the whole stack scales up slightly. */}
      <div className="relative flex h-[122px] items-center justify-center motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out motion-safe:group-hover:scale-110 motion-safe:group-data-[active=true]:scale-110">
        <img
          src={p.icon}
          alt=""
          aria-hidden="true"
          width={Math.round(p.iconW)}
          height={Math.round(p.iconH)}
          loading="lazy"
          decoding="async"
          className="block h-auto max-h-full w-auto motion-safe:transition-opacity motion-safe:duration-300 motion-safe:ease-out group-hover:opacity-0 group-data-[active=true]:opacity-0"
          style={{ maxWidth: 128 }}
        />
        <img
          src={p.iconHover}
          alt=""
          aria-hidden="true"
          width={Math.round(p.iconW)}
          height={Math.round(p.iconH)}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 m-auto block h-auto max-h-full w-auto opacity-0 motion-safe:transition-opacity motion-safe:duration-300 motion-safe:ease-out group-hover:opacity-100 group-data-[active=true]:opacity-100"
          style={{ maxWidth: 128 }}
        />
      </div>

      {/* Caption block — white border, fixed
          97px tall, 12px top + 16px bottom inset, 8px row gap.
          Layout: 4 rows in a flex column. Rows 1 and 3 are
          1px-tall opacity-0 anchors; row 2 is the eyebrow; row 4 is the label
          and flexes to fill the remainder. The hidden anchors
          + gap-2 push the label to sit ~2/3 down the box, not
          flush against the bottom. */}
      <div
        className={cn(
          "flex h-[97px] flex-col items-center gap-2 overflow-hidden border border-v1-frost px-3 pb-4 pt-3 uppercase motion-safe:transition-colors motion-safe:duration-300 motion-safe:ease-out group-hover:bg-v1-frost group-data-[active=true]:bg-v1-frost",
          i > 0 && "lg:-ml-px",
        )}
      >
        {/* Row 1 — hidden spacer (h-px opacity-0 "WITH INNGEST"
            placeholder). */}
        <div aria-hidden="true" className="h-px w-full" />

        {/* Row 2 — eyebrow. Default "Without Inngest" (cdcdcd)
            sits in place, then on hover slides down a touch
            while fading out; "With Inngest" simultaneously
            slides down into place from above and fades in,
            inverted to black for the white-bg state. */}
        <div className="relative w-full text-center text-v1-label-sm">
          <span
            aria-hidden="true"
            className="block text-v1-frost/80 motion-safe:transition-[opacity,transform] motion-safe:duration-300 motion-safe:ease-out group-hover:translate-y-2 group-hover:opacity-0 group-data-[active=true]:translate-y-2 group-data-[active=true]:opacity-0"
          >
            Without Inngest
          </span>
          <span
            aria-hidden="true"
            className="absolute inset-0 block -translate-y-2 text-v1-jetBlack opacity-0 motion-safe:transition-[opacity,transform] motion-safe:duration-300 motion-safe:ease-out group-hover:translate-y-0 group-hover:opacity-100 group-data-[active=true]:translate-y-0 group-data-[active=true]:opacity-100"
          >
            With Inngest
          </span>
        </div>

        {/* Row 3 — hidden spacer (h-px opacity-0 solution
            placeholder). */}
        <div aria-hidden="true" className="h-px w-full" />

        {/* Row 4 — label. 16/16, centred, fills the remaining
            height. White default (problem); hover swaps to
            the solution copy via the same absolute-stack
            technique as the eyebrow. */}
        <div className="relative flex w-full flex-1 items-center justify-center text-center text-v1-label-md">
          <span
            aria-hidden="true"
            className="block px-2 motion-safe:transition-[opacity,transform] motion-safe:duration-300 motion-safe:ease-out group-hover:translate-y-2 group-hover:opacity-0 group-data-[active=true]:translate-y-2 group-data-[active=true]:opacity-0"
          >
            {p.problem}
          </span>
          <span
            aria-hidden="true"
            className="absolute inset-0 flex -translate-y-2 items-center justify-center px-2 text-v1-jetBlack opacity-0 motion-safe:transition-[opacity,transform] motion-safe:duration-300 motion-safe:ease-out group-hover:translate-y-0 group-hover:opacity-100 group-data-[active=true]:translate-y-0 group-data-[active=true]:opacity-100"
          >
            {p.solution}
          </span>
        </div>
      </div>
    </motion.li>
  );
}
