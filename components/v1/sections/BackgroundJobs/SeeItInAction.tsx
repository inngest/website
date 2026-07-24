"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/utils/v1/cn";
import { reveals } from "@/utils/v1/reveals";
import { V1_CYCLE_MS } from "@/utils/v1/springs";
import GradientFrame from "@/components/v1/sections/shared/GradientFrame";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";

/**
 * "See it in action" — single tokenised code block split into three
 * named regions. Clicking a tab (or letting the auto-advance step
 * through them) raises that region to full opacity and drops the
 * other two to 20 %, so the eye follows the workflow step by step.
 *
 * Tabs render as card-style buttons (Home/TrustedInBigLeagues
 * TopicItem pattern): subtle frost hover background, a 2 px
 * top-edge progress bar driving the auto-cycle on the active tab,
 * and a salmon square next to the title. Auto-advance uses
 * setInterval — any manual click stops it permanently so the
 * timer never tugs a tab away from a reading user.
 */

type RegionId = "define" | "welcome" | "crm";

interface Tab {
  id: RegionId;
  number: string;
  label: string;
}

const TABS: Tab[] = [
  { id: "define", number: "01", label: "Define the workflow" },
  { id: "welcome", number: "02", label: "Send welcome email" },
  { id: "crm", number: "03", label: "Sync to CRM" },
];

const CLR_KEYWORD = "#fd8a72"; // export, const, async, await, if, throw, new
const CLR_IDENT = "#5f7df0"; //   postSignupFlow, inngest, step, event, …
const CLR_STRING = "#0bdd48"; //  "post-signup-flow", "user/signup", …
const CLR_DOT = "#fb5536"; //     the `.` operator
const CLR_COMMENT = "rgba(255,255,255,0.45)";

const Cmt = ({ children }: { children: React.ReactNode }) => (
  <span style={{ color: CLR_COMMENT }}>{children}</span>
);
const Kw = ({ children }: { children: React.ReactNode }) => (
  <span style={{ color: CLR_KEYWORD }}>{children}</span>
);
const Id = ({ children }: { children: React.ReactNode }) => (
  <span style={{ color: CLR_IDENT }}>{children}</span>
);
const Str = ({ children }: { children: React.ReactNode }) => (
  <span style={{ color: CLR_STRING }}>{children}</span>
);
const Dot = () => <span style={{ color: CLR_DOT }}>.</span>;
// Default — full-opacity white. Used for plain identifiers
// (property names after a dot), braces, parens, commas.
const T = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);

function Region({
  id,
  active,
  children,
}: {
  id: RegionId;
  active: RegionId;
  children: React.ReactNode;
}) {
  const isActive = id === active;
  return (
    <span
      // Each region is a single inline contiguous block of tokens —
      // an outer span lets us fade the whole region's opacity in one
      // place. `display: inline` keeps the newlines inside the
      // <pre> intact (block-level would inject its own breaks).
      className={cn(
        "motion-safe:transition-opacity motion-safe:duration-[280ms] motion-safe:ease-v1-out",
        isActive ? "opacity-100" : "opacity-20"
      )}
    >
      {children}
    </span>
  );
}

function CodeBlock({ active }: { active: RegionId }) {
  return (
    <pre
      // The whitespace inside each region literal is preserved by <pre>.
      className="overflow-x-auto whitespace-pre px-6 py-11 font-v1Mono text-[16px] leading-[1.5]"
    >
      {/* REGION 01 — Define the workflow */}
      <Region id="define" active={active}>
        <Cmt>{`// Define the background job — triggered by the "user/signup" event\n`}</Cmt>
        <Kw>export const </Kw>
        <Id>postSignupFlow</Id>
        <T> = </T>
        <Id>inngest</Id>
        <Dot />
        <T>createFunction(</T>
        {"\n  { id: "}
        <Str>{'"post-signup-flow"'}</Str>
        {" },\n  { event: "}
        <Str>{'"user/signup"'}</Str>
        {" },\n  "}
        <Kw>async</Kw>
        <T>{` ({ event, step }) => {`}</T>
        {"\n"}
      </Region>

      {/* REGION 02 — Send welcome email */}
      <Region id="welcome" active={active}>
        {"    "}
        <Cmt>{`// step.run() is atomic: auto-retried on failure, memoized on success\n`}</Cmt>
        {"    "}
        <Kw>await </Kw>
        <Id>step</Id>
        <Dot />
        <T>run(</T>
        <Str>{'"send-welcome-email"'}</Str>
        <T>, </T>
        <Kw>async</Kw>
        <T>{` () => {`}</T>
        {"\n      "}
        <Kw>await </Kw>
        <Id>sendWelcomeEmail</Id>
        <T>{`({ email: `}</T>
        <Id>event</Id>
        <Dot />
        <T>data</T>
        <Dot />
        <T>{"email });"}</T>
        {"\n    });\n"}
      </Region>

      {/* REGION 03 — Sync to CRM (and the trigger that fires the flow) */}
      <Region id="crm" active={active}>
        {"    "}
        <Kw>await </Kw>
        <Id>step</Id>
        <Dot />
        <T>run(</T>
        <Str>{'"sync-to-crm"'}</Str>
        <T>, </T>
        <Kw>async</Kw>
        <T>{` () => {`}</T>
        {"\n      "}
        <Kw>await </Kw>
        <Id>createHubspotContact</Id>
        <T>({"{"}</T>
        {"\n        id: "}
        <Id>event</Id>
        <Dot />
        <T>data</T>
        <Dot />
        <T>userId,</T>
        {"\n        email: "}
        <Id>event</Id>
        <Dot />
        <T>data</T>
        <Dot />
        <T>email,</T>
        {"\n      });\n    });\n\n    "}
        <Cmt>{`// If "sync-to-crm" fails and retries, "send-welcome-email" does NOT re-run.\n    `}</Cmt>
        <Cmt>{`// Completed steps are memoized. No duplicate emails. Ever.\n`}</Cmt>
        {"  }\n);\n\n"}
        <Cmt>{`// Trigger from your API route, webhook handler, or anywhere in your codebase\n`}</Cmt>
        <Kw>await </Kw>
        <Id>inngest</Id>
        <Dot />
        <T>send({"{"}</T>
        {"\n  name: "}
        <Str>{'"user/signup"'}</Str>
        <T>,</T>
        {"\n  data: { userId: "}
        <Str>{'"abc123"'}</Str>
        <T>, email: </T>
        <Str>{'"user@example.com"'}</Str>
        <T>{` },`}</T>
        {"\n});"}
      </Region>
    </pre>
  );
}

export default function SeeItInAction() {
  const [active, setActive] = useState<RegionId>(TABS[0].id);
  const [inView, setInView] = useState(false);
  // Bumped on every advance (auto OR click) so the progress-bar
  // CSS animation re-mounts and restarts from 0 each cycle.
  const [cycleNonce, setCycleNonce] = useState(0);
  // Matches Home/TrustedInBigLeagues: any manual click stops the
  // auto-cycle permanently so the timer doesn't tug a tab away
  // from the user the moment they pick one.
  const [userTookControl, setUserTookControl] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const tabRefs = useRef<Record<RegionId, HTMLButtonElement | null>>({
    define: null,
    welcome: null,
    crm: null,
  });
  // Guards the initial render: on mount the first tab is already at
  // the left edge, so a `scrollIntoView` would be a no-op at best and
  // a flicker at worst. Only auto-scroll once `active` actually moves.
  const didMountRef = useRef(false);

  // Keep the active tab visible in the horizontally-scrollable
  // tablist. `block: "nearest"` keeps page scroll untouched (no
  // vertical jump when the auto-cycle ticks); `inline: "center"`
  // pulls the tab toward the centre of the scroll container.
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    const el = tabRefs.current[active];
    if (!el) return;
    el.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [active]);

  // IntersectionObserver — pause the auto-cycle when the section is
  // out of view so background tabs don't tick in the background.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "-15% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // setInterval auto-cycle — identical cadence to Home's TrustedIn
  // BigLeagues. Stops permanently once the user takes control.
  useEffect(() => {
    if (!inView) return;
    if (userTookControl) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const interval = window.setInterval(() => {
      setActive((prev) => {
        const idx = TABS.findIndex((t) => t.id === prev);
        return TABS[(idx + 1) % TABS.length].id;
      });
      setCycleNonce((n) => n + 1);
    }, V1_CYCLE_MS);
    return () => window.clearInterval(interval);
  }, [inView, userTookControl]);

  const handleSelect = (next: RegionId) => {
    setActive(next);
    setCycleNonce((n) => n + 1);
    setUserTookControl(true);
  };

  const showProgress = inView && !userTookControl;

  return (
    <Section
      ref={sectionRef}
      aria-labelledby="bg-jobs-see-heading"
      className="relative"
    >
      <SectionHeader id="bg-jobs-see-heading" title="See it in action" />

      <motion.div
        {...reveals.item(1)}
        role="tablist"
        aria-label="Workflow steps"
        // Tabs render as cards (Home/TrustedInBigLeagues TopicItem
        // pattern): subtle frost hover bg, 2 px top-edge progress
        // bar driving the auto-cycle, salmon square next to title.
        // Single horizontally-scrollable row at every breakpoint —
        // tabs keep their natural width and scroll on narrow viewports
        // instead of stacking. `-mx-*` cancels the section's px so
        // the scroll track bleeds edge-to-edge.
        className="-mx-6 mt-v1-stack flex gap-3 overflow-x-auto px-6 [scrollbar-width:none] sm:-mx-9 sm:px-9 md:gap-4 lg:-mx-8 lg:px-8 [&::-webkit-scrollbar]:hidden"
      >
        {TABS.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[tab.id] = el;
              }}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls="bg-jobs-code-panel"
              onClick={() => handleSelect(tab.id)}
              className={cn(
                // Natural width on narrow viewports so the row scrolls;
                // equal-width fill at lg so the three tabs distribute
                // across the section.
                "group relative flex flex-none items-center gap-[10px] whitespace-nowrap rounded-md px-4 py-5 text-left font-v1Mono text-[16px] uppercase leading-[1.5] tracking-[-0.01em] motion-safe:transition-colors motion-safe:duration-300 motion-safe:ease-v1-out lg:flex-1 lg:basis-0",
                "hover:bg-v1-frost/[0.035] focus-visible:bg-v1-frost/[0.04] focus-visible:outline-none"
              )}
            >
              {/* Top-edge progress bar — fills left → right over the
                  cycle while the tab is active + auto-cycling.
                  `cycleNonce` keys the fill span so the keyframe
                  restarts from 0 on each interval tick. The bar
                  (track + fill) hides entirely once `showProgress`
                  flips false — i.e., after a manual click. */}
              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute inset-x-2 top-0 block h-[2px] overflow-hidden bg-v1-frost/[0.08]",
                  isActive && showProgress ? "opacity-100" : "opacity-0"
                )}
              >
                {isActive && showProgress && (
                  <span
                    key={cycleNonce}
                    className="absolute inset-0 origin-left bg-v1-accent-salmon motion-reduce:hidden"
                    style={{
                      animation: `v1-carousel-progress ${V1_CYCLE_MS}ms linear forwards`,
                    }}
                  />
                )}
              </span>
              {/* Salmon square (active) / steel square (resting). */}
              <span
                aria-hidden="true"
                className={cn(
                  "block size-2 shrink-0 motion-safe:transition-colors motion-safe:duration-300",
                  isActive
                    ? "bg-v1-accent-salmon"
                    : "bg-v1-steel group-hover:bg-v1-frost"
                )}
              />
              <span
                className={cn(
                  "motion-safe:transition-colors motion-safe:duration-300",
                  isActive
                    ? "text-v1-frost"
                    : "text-v1-frost/60 group-hover:text-v1-frost"
                )}
              >
                {tab.number} {tab.label}
              </span>
            </button>
          );
        })}
      </motion.div>

      <motion.div
        {...reveals.item(2)}
        id="bg-jobs-code-panel"
        role="tabpanel"
        aria-label="Workflow code"
        className="mt-8"
      >
        <GradientFrame
          variant="black"
          className="w-full rounded-[9.026px]"
          innerClassName="overflow-hidden rounded-[9.026px]"
        >
          <CodeBlock active={active} />
        </GradientFrame>
      </motion.div>
    </Section>
  );
}
