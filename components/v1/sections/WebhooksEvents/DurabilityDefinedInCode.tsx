"use client";

import { type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import GradientFrame from "@/components/v1/sections/shared/GradientFrame";
import ScaledWidget from "@/components/v1/sections/shared/ScaledWidget";
import Link from "@/components/v1/Link";
import MobileReelNav from "@/components/v1/sections/shared/MobileReelNav";
import ReelDirectoryRow from "@/components/v1/sections/shared/ReelDirectoryRow";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import { V1_HEADER_CONTENT_MT } from "@/components/v1/sections/shared/sectionShell";
import { useReelCarousel } from "@/components/v1/sections/shared/useReelCarousel";
import { cn } from "@/utils/v1/cn";
import { reveals } from "@/utils/v1/reveals";

// "DURABILITY DEFINED IN CODE" — left: large heading + 5 feature
// rows (each with a bullet, title, body, optional CTA). Clicking
// a row swaps the per-feature illustration on the right; the
// active row's bullet flips salmon and its body expands.

// Palette — salmon = v1-salmon-200, OK green / blue from spec.
const FAIL_COLOR = "#fb5536";
const OK_COLOR = "#0bdd48";
const BLUE_COLOR = "#013cf6";

interface Feature {
  id: string;
  title: string;
  body: string;
  cta?: { label: string; href: string };
  visual: ReactNode;
}

const FEATURES: Feature[] = [
  {
    id: "automatic-retries",
    title: "Automatic retries",
    body:
      "Events that fail retry automatically with exponential backoff. Step-level — so only the failed step re-runs, not the whole function.",
    cta: { label: "Read the docs →", href: "/docs" },
    visual: <RetryVisual />,
  },
  {
    id: "idempotency",
    title: "Idempotency",
    body:
      "Providers retry on failure. Set an event ID or function key and Inngest guarantees your function runs exactly once — no duplicate charges, no double-sends.",
    cta: { label: "Read the docs →", href: "/docs" },
    visual: <IdempotencyVisual />,
  },
  {
    id: "fan-out",
    title: "Fan-Out",
    body:
      "Any number of functions can subscribe to the same event, and all run in parallel, with independent retries. No routing. No extra queues.",
    cta: { label: "Read the pattern →", href: "/docs/guides/fan-out-jobs" },
    visual: <FanOutVisual />,
  },
  {
    id: "event-coordination",
    title: "Event Coordination",
    body:
      "Use step.waitForEvent() to pause a function. When the event arrives (or times out), execution resumes automatically. All without cron jobs or polling loops.",
    cta: { label: "Read the pattern →", href: "/docs/guides/wait-for-event" },
    visual: <EventCoordinationVisual />,
  },
  {
    id: "cancelation",
    title: "Cancelation",
    body:
      "Automatically cancel a sleeping function when a matching event arrives. A blog post scheduled to publish tomorrow can be cancelled the moment an editor fires post.cancelled.",
    cta: { label: "Read the pattern →", href: "/docs/guides/cancel-running-functions" },
    visual: <CancelationVisual />,
  },
];

export default function DurabilityDefinedInCode() {
  // Same reel engine + progress-timer UI as the AI page's "What users
  // are building on Inngest" section: rows show a top fill rail that
  // runs over each cycle while auto-advancing; a click/arrow latches
  // control and stops the reel. The active feature's visual swaps in
  // lockstep, so text and diagrams flip through all five together.
  const {
    active: activeIndex,
    select,
    next,
    prev,
    cycling,
    sectionRef,
  } = useReelCarousel(FEATURES.length, { threshold: 0.2 });

  const active = FEATURES[activeIndex] ?? FEATURES[0];
  const activeId = active.id;

  const prevIndex = (activeIndex - 1 + FEATURES.length) % FEATURES.length;
  const nextIndex = (activeIndex + 1) % FEATURES.length;

  return (
    <Section
      ref={sectionRef}
      aria-labelledby="we-durability-heading"
      className="relative"
    >
      <SectionHeader
        id="we-durability-heading"
        title="Durability defined in code"
      />

      <div className={`${V1_HEADER_CONTENT_MT} grid grid-cols-1 gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:items-stretch lg:gap-x-8`}>
        <ul className="flex list-none flex-col pl-0 lg:order-1">
          {FEATURES.map((f, i) => {
            const isActive = f.id === activeId;
            return (
              <motion.li key={f.id} {...reveals.item(i)}>
                <FeatureRow
                  feature={f}
                  isActive={isActive}
                  cycling={cycling}
                  onActivate={() => select(i)}
                />
              </motion.li>
            );
          })}
        </ul>

        <motion.div {...reveals.body} className="lg:order-2 lg:h-full">
          {/* Mobile-only nav row — prev/next arrows flanking the active
              feature title. Hidden at lg+ where the rows list is
              visible alongside the visual frame. */}
          <MobileReelNav
            activeTitle={active.title}
            prevTitle={FEATURES[prevIndex].title}
            nextTitle={FEATURES[nextIndex].title}
            itemNoun="durability feature"
            onPrev={prev}
            onNext={next}
            className="mb-4 flex items-center justify-between gap-3 lg:hidden"
          />

          <GradientFrame
            variant="black"
            className="h-full min-h-[480px] rounded-md sm:min-h-[640px] lg:min-h-[794px]"
            innerClassName="flex h-full w-full items-center justify-center px-6 py-8"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeId}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1] }}
                className="flex w-full justify-center"
              >
                {active.visual}
              </motion.div>
            </AnimatePresence>
          </GradientFrame>
        </motion.div>
      </div>
    </Section>
  );
}

function FeatureRow({
  feature: f,
  isActive,
  cycling,
  onActivate,
}: {
  feature: Feature;
  isActive: boolean;
  cycling: boolean;
  onActivate: () => void;
}) {
  return (
    <ReelDirectoryRow
      isActive={isActive}
      cycling={cycling}
      showProgress
      onSelect={onActivate}
      className="cursor-pointer px-[22px] py-[18px]"
      dotAnchorClassName="lg:h-[calc(clamp(1.25rem,1.75vw,1.625rem)*1.2)]"
    >
      <span className="flex flex-1 flex-col gap-2 font-v1Heading">
        <span className="text-[28px] leading-[40px] tracking-[-0.01em] lg:leading-[1.2] lg:[font-size:clamp(1.25rem,1.75vw,1.625rem)]">
          {f.title}
        </span>
        <span
          className={cn(
            "text-pretty text-[18px] leading-[1.5] tracking-[-0.01em] motion-safe:transition-colors motion-safe:duration-300 lg:[font-size:clamp(0.8125rem,1.05vw,1rem)]",
            isActive ? "text-v1-frost" : "text-v1-frost/80",
          )}
        >
          {f.body}
        </span>
        {f.cta ? (
          <Link
            href={f.cta.href}
            underline={false}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "mt-2 inline-flex w-fit font-v1Mono text-v1-label-sm uppercase text-v1-frost",
              "motion-safe:transition-[opacity,color] motion-safe:duration-300",
              // Salmon only on the link's OWN hover — NOT the row's. The
              // row is a <button>, and WipeLabel's salmon wipe fires on
              // any ancestor button:hover, so wrapping the label in a
              // <span> opts out of the auto-wrap and lets this anchor-
              // scoped `hover:` own the colour instead.
              "hover:text-v1-accent-salmon",
              // Visible when active OR when this row is hovered/focused.
              isActive
                ? "opacity-100"
                : "opacity-0 group-hover/row:opacity-100 group-focus-within/row:opacity-100",
            )}
          >
            <span>{f.cta.label}</span>
          </Link>
        ) : null}
      </span>
    </ReelDirectoryRow>
  );
}

// ── Visuals ─────────────────────────────────────────────────────
// Each diagram is hand-positioned (absolute pixel offsets in source
// space). Diagrams target the 794px-tall
// visual frame; narrower viewports clip via GradientFrame's
// overflow-hidden inner.

const CARD_MONO = "font-mono text-[14.378px] leading-[1.5]";

// Bullet — the small filled square that prefixes a card's first row.
function Bullet({ color }: { color: string }) {
  return (
    <span
      aria-hidden="true"
      className="block size-[8.4px] shrink-0"
      style={{ backgroundColor: color }}
    />
  );
}

// Rounded mono card. `borderColor` accepts a CSS colour string
// (palette literals). Position via `top`/`left`/`w`/`h`.
function Card({
  top,
  left = 0,
  w,
  h,
  borderColor,
  className,
  children,
}: {
  top: number;
  left?: number;
  w: number;
  h: number;
  borderColor: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "absolute rounded-[6px] border px-[20px] py-3 text-v1-frost",
        CARD_MONO,
        className,
      )}
      style={{ top, left, width: w, height: h, borderColor }}
    >
      {children}
    </div>
  );
}

// Reused by RetryVisual + IdempotencyVisual's success card. Renders
// the standard 410×94 attempt card: bullet + filename + status block
// on the left, body on the right (wraps when narrow).
function AttemptCard({
  top,
  left = 0,
  borderColor,
  filename,
  status,
  statusColor,
  body,
}: {
  top: number;
  left?: number;
  borderColor: string;
  filename: string;
  status: string;
  statusColor: string;
  body: string;
}) {
  return (
    <Card
      top={top}
      left={left}
      w={410}
      h={94}
      borderColor={borderColor}
      className="flex flex-wrap content-center items-center gap-x-3 gap-y-0.5"
    >
      <div className="flex flex-col">
        <div className="flex items-center gap-3">
          <Bullet color={borderColor} />
          <span>{filename}</span>
        </div>
        <span style={{ color: statusColor }}>{status}</span>
      </div>
      <span>{body}</span>
    </Card>
  );
}

// Dashed vertical connector with a down-arrow at the bottom.
function DashedLineV({
  color,
  height = 55,
  top,
  left,
}: {
  color: string;
  height?: number;
  top?: number;
  left?: number;
}) {
  const tip = height - 6;
  return (
    <svg
      aria-hidden="true"
      width="8"
      height={height}
      viewBox={`0 0 8 ${height}`}
      style={{ position: top != null || left != null ? "absolute" : undefined, top, left }}
    >
      <line
        x1="4"
        y1="0"
        x2="4"
        y2={tip}
        stroke={color}
        strokeWidth="1"
        strokeDasharray="3 4"
      />
      <path d={`M0 ${tip} L4 ${height} L8 ${tip} Z`} fill={color} />
    </svg>
  );
}

// Dashed horizontal connector with a right-arrow at the end.
function DashedLineH({
  color,
  width = 55,
  top,
  left,
}: {
  color: string;
  width?: number;
  top?: number;
  left?: number;
}) {
  const tip = width - 6;
  return (
    <svg
      aria-hidden="true"
      width={width}
      height="8"
      viewBox={`0 0 ${width} 8`}
      style={{ position: top != null || left != null ? "absolute" : undefined, top, left }}
    >
      <line
        x1="0"
        y1="4"
        x2={tip}
        y2="4"
        stroke={color}
        strokeWidth="1"
        strokeDasharray="3 4"
      />
      <path d={`M${tip} 0 L${width} 4 L${tip} 8 Z`} fill={color} />
    </svg>
  );
}

function CheckIcon({ color }: { color: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 22 22" className="block size-[22px]">
      <circle cx="11" cy="11" r="10" fill="none" stroke={color} strokeWidth="1.3" />
      <path
        d="M6.5 11.5 L9.5 14.5 L15 8.5"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function XIcon({ color }: { color: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 22 22" className="block size-[22px]">
      <circle cx="11" cy="11" r="10" fill="none" stroke={color} strokeWidth="1.3" />
      <path
        d="M7.5 7.5 L14.5 14.5 M14.5 7.5 L7.5 14.5"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function RetryVisual() {
  // 5 cards at y = 0, 156, 312, 468, 636 with dashed connectors at
  // y = 94, 250, 406, 562 — all 4 connectors paint salmon because
  // the visual tells the failure → retry story.
  const ATTEMPTS: { n: number; status: "FAILED" | "SUCCEEDED"; body: string }[] = [
    { n: 1, status: "FAILED", body: "throw new Error(...)" },
    { n: 2, status: "FAILED", body: "throw new Error(...)" },
    { n: 3, status: "FAILED", body: "throw new Error(...)" },
    { n: 4, status: "FAILED", body: "throw new Error(...)" },
    { n: 5, status: "SUCCEEDED", body: "return { ok: true }" },
  ];
  const CARD_Y = [0, 156, 312, 468, 636];
  const CONN_Y = [94, 250, 406, 562];
  return (
    <ScaledWidget scale={0.65} natural={{ w: 410, h: 730 }} fullSizeFrom="md">
      <div className="relative h-[730px] w-[410px]">
        {ATTEMPTS.map((a, i) => {
          const color = a.status === "SUCCEEDED" ? OK_COLOR : FAIL_COLOR;
          return (
            <AttemptCard
              key={a.n}
              top={CARD_Y[i]}
              borderColor={color}
              filename={`charge-credit-card/ attempt ${a.n}`}
              status={a.status}
              statusColor={color}
              body={a.body}
            />
          );
        })}
        {CONN_Y.map((y) => (
          <DashedLineV key={y} color={FAIL_COLOR} top={y} left={204} />
        ))}
      </div>
    </ScaledWidget>
  );
}

function IdempotencyVisual() {
  return (
    <ScaledWidget scale={0.52} natural={{ w: 525, h: 602 }} fullSizeFrom="md">
    <div className="relative h-[602px] w-[525px]">
      {[0, 101, 199].map((y) => (
        <Card
          key={y}
          top={y}
          w={261}
          h={77}
          borderColor="rgb(var(--color-v1-frost))"
          className="flex flex-col justify-center gap-1.5"
        >
          <div className="flex w-[64px] items-center justify-between">
            <Bullet color="rgba(254,254,254,0.8)" />
            <span>event</span>
          </div>
          <span>id: ch_3NqK2a</span>
        </Card>
      ))}

      {/* Bracket — 3 left-pointing fingers join a vertical spine that
          drops into the key card. */}
      <svg
        aria-hidden="true"
        width="68"
        height="328"
        viewBox="-8 0 68 328"
        className="absolute left-[261px] top-[38px]"
      >
        <g stroke={OK_COLOR} strokeWidth="1" fill="none" strokeDasharray="3 4">
          <line x1="0" y1="0.5" x2="53" y2="0.5" />
          <line x1="0" y1="101.5" x2="53" y2="101.5" />
          <line x1="0" y1="199.5" x2="53" y2="199.5" />
          <line x1="53" y1="0.5" x2="53" y2="321" />
        </g>
        <g fill={OK_COLOR}>
          <path d="M0 -3 L-6 0.5 L0 4 Z" />
          <path d="M0 98 L-6 101.5 L0 105 Z" />
          <path d="M0 196 L-6 199.5 L0 203 Z" />
          <path d="M49 321 L53 327 L57 321 Z" />
        </g>
      </svg>

      <Card
        top={357}
        left={115}
        w={410}
        h={77}
        borderColor="rgb(var(--color-v1-frost))"
        className="flex flex-wrap content-center items-center gap-x-[17px] gap-y-1"
      >
        <div className="flex items-center gap-3">
          <Bullet color="rgba(254,254,254,0.8)" />
          <span>Inngest / idempotency key</span>
        </div>
        <span>key = event.id</span>
      </Card>

      <DashedLineV color={OK_COLOR} top={434} left={319} />

      <AttemptCard
        top={508}
        left={115}
        borderColor={OK_COLOR}
        filename="charge-credit-card / attempt 5"
        status="RUNS EXACTLY ONCE"
        statusColor={OK_COLOR}
        body="return { ok: true }"
      />
    </div>
    </ScaledWidget>
  );
}

function FanOutVisual() {
  const CHILD = { w: 140, h: 44 };
  const CHILD_CN = "flex items-center justify-center whitespace-nowrap";
  return (
    <ScaledWidget scale={0.57} natural={{ w: 470, h: 235 }} fullSizeFrom="md">
    <div className="relative h-[235px] w-[470px]">
      <Card top={0} left={150} w={170} h={44} borderColor={OK_COLOR} className={CHILD_CN}>
        user/signup
      </Card>

      {/* Branching connector — drop from parent + horizontal bar +
          3 down-arrow drops into the children. */}
      <svg
        aria-hidden="true"
        width="330"
        height="61"
        viewBox="0 0 330 61"
        className="absolute left-[70px] top-[44px]"
      >
        <g fill="none" stroke={OK_COLOR} strokeWidth="1" strokeDasharray="3 4">
          <line x1="165" y1="0" x2="165" y2="30" />
          <line x1="0" y1="30" x2="330" y2="30" />
          <line x1="0" y1="30" x2="0" y2="55" />
          <line x1="165" y1="30" x2="165" y2="55" />
          <line x1="330" y1="30" x2="330" y2="55" />
        </g>
        <g fill={OK_COLOR}>
          <path d="M-4 55 L0 61 L4 55 Z" />
          <path d="M161 55 L165 61 L169 55 Z" />
          <path d="M326 55 L330 61 L334 55 Z" />
        </g>
      </svg>

      <Card top={105} left={0} {...CHILD} borderColor={OK_COLOR} className={CHILD_CN}>
        send-email
      </Card>
      <Card top={105} left={165} {...CHILD} borderColor={OK_COLOR} className={CHILD_CN}>
        sync-crm
      </Card>
      <Card top={105} left={330} {...CHILD} borderColor={OK_COLOR} className={CHILD_CN}>
        start-trial
      </Card>

      {[60, 225, 390].map((x) => (
        <div key={x} className="absolute" style={{ top: 166, left: x }}>
          <CheckIcon color={OK_COLOR} />
        </div>
      ))}

      <p
        className={cn(
          "absolute font-v1Mono uppercase",
          CARD_MONO,
          "text-v1-frost",
        )}
        style={{ top: 215, left: 153 }}
      >
        All run in parallel
      </p>
    </div>
    </ScaledWidget>
  );
}

function EventCoordinationVisual() {
  return (
    <ScaledWidget scale={0.74} natural={{ w: 365, h: 244 }} fullSizeFrom="md">
    <div className="relative h-[244px] w-[365px]">
      <Card
        top={0}
        w={280}
        h={44}
        borderColor={OK_COLOR}
        className="flex items-center justify-center"
      >
        cart/product.added → run
      </Card>

      <DashedLineV color={OK_COLOR} height={61} top={44} left={139} />

      <Card
        top={105}
        w={365}
        h={78}
        borderColor={BLUE_COLOR}
        className="flex flex-col justify-center gap-2"
      >
        <span style={{ color: BLUE_COLOR }}>
          step.waitForEvent(&ldquo;cart/purchased&rdquo;)
        </span>
        <span>timeout: &ldquo;24h&rdquo; - paused, waiting...</span>
      </Card>

      <div
        className={cn(
          "absolute flex gap-10 font-v1Mono uppercase text-v1-frost",
          CARD_MONO,
        )}
        style={{ top: 223, left: 90 }}
      >
        <span>PAUSE</span>
        <span>WAIT</span>
        <span>RESUME</span>
      </div>
    </div>
    </ScaledWidget>
  );
}

function CancelationVisual() {
  return (
    <ScaledWidget scale={0.53} natural={{ w: 514, h: 240 }} fullSizeFrom="md">
    <div className="relative h-[240px] w-[514px]">
      <Card
        top={0}
        w={290}
        h={44}
        borderColor={OK_COLOR}
        className="flex items-center justify-between"
      >
        <span>blog/post.scheduled</span>
        <CheckIcon color={OK_COLOR} />
      </Card>

      <DashedLineV color={OK_COLOR} height={50} top={46} left={144} />

      <Card
        top={96}
        w={290}
        h={46}
        borderColor={BLUE_COLOR}
        className="flex items-center"
      >
        step.sleepUntil(tomorrow
      </Card>

      <DashedLineH color={FAIL_COLOR} width={65} top={118} left={290} />

      <Card
        top={96}
        left={355}
        w={159}
        h={46}
        borderColor={FAIL_COLOR}
        className="flex items-center"
      >
        post.cancelled
      </Card>

      <Card
        top={192}
        w={290}
        h={46}
        borderColor={FAIL_COLOR}
        className="flex items-center justify-between"
      >
        <span>cancelled automatically</span>
        <XIcon color={FAIL_COLOR} />
      </Card>
    </div>
    </ScaledWidget>
  );
}

