"use client";

import { motion, type Variants } from "motion/react";

/**
 * Pixel-perfect illustrations for the background-jobs "Everything
 * production apps require" section.
 *
 * Colour tokens used throughout:
 *   #fb5536 — salmon (active markers, error chip outlines)
 *   #0bdd48 — bright green (success chips, "INFERRED", "LIMIT", 84ms)
 *   #2c9b63 — muted green (full-trace progress rail background)
 *   #7c7c7c — carbon/300 (inactive markers, muted text, divider lines)
 *   #fefefe — carbon/50 (default white text)
 */

// Shared stagger vocabulary. Each illustration sets `variants={stagger}`
// on its root (with `initial="hidden" animate="show"`) and tags the
// pieces that should cascade in with `variants={item}`. Re-plays on
// every active-tab swap because Reliability mounts the illustration
// under `<AnimatePresence>` keyed by id.
const stagger: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.08 },
  },
};
const item: Variants = {
  hidden: { opacity: 0, y: 6 },
  show: {
    opacity: 1,
    y: 0,
    // `as const` narrows the 4-tuple to a BezierDefinition; without
    // it TypeScript widens to `number[]` which motion's strict
    // `Easing` type rejects.
    transition: { duration: 0.32, ease: [0.32, 0.72, 0, 1] as const },
  },
};

const MONO_FONT_FAMILY =
  "'WhyteMonoV1', ui-monospace, SFMono-Regular, Menlo, monospace";
const MONO_FS = "14.378px";

const SALMON = "#fb5536";
const GREEN = "#0bdd48";
const MUTED_GREEN = "#2c9b63";
const CARBON_300 = "#7c7c7c";
const WHITE = "#fefefe";

/* ───────────────────────────── PRIMITIVES ────────────────────────────── */

const DotSquare = ({
  color,
  size = 8.5,
}: {
  color: string;
  size?: number;
}) => (
  <span
    aria-hidden="true"
    style={{ width: size, height: size, backgroundColor: color, display: "inline-block" }}
  />
);

const Check = ({ color = GREEN, size = 22 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 22 22" fill="none" aria-hidden="true">
    <circle cx="11" cy="11" r="10" stroke={color} strokeWidth="1.5" />
    <path d="M6 11.2 9.6 14.5 16 8" stroke={color} strokeWidth="1.6" fill="none" strokeLinecap="square" />
  </svg>
);

const Cross = ({ color = SALMON, size = 22 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 22 22" fill="none" aria-hidden="true">
    <circle cx="11" cy="11" r="10" stroke={color} strokeWidth="1.5" />
    <path d="M7 7 15 15 M15 7 7 15" stroke={color} strokeWidth="1.6" fill="none" strokeLinecap="square" />
  </svg>
);

const TinyCheck = ({ color = GREEN }: { color?: string }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
    <path d="M3 7 6 10 11 4" stroke={color} strokeWidth="1.4" fill="none" strokeLinecap="square" />
  </svg>
);

const Chip = ({
  label,
  color,
  width,
}: {
  label: string;
  color: string;
  width?: number;
}) => (
  <span
    className="inline-flex items-center gap-3 rounded-[6px] border px-[20px] py-3"
    style={{ borderColor: color, width, color: WHITE }}
  >
    <DotSquare color={color} />
    <span
      style={{
        fontFamily: MONO_FONT_FAMILY,
        fontSize: MONO_FS,
        lineHeight: 1.5,
      }}
    >
      {label}
    </span>
  </span>
);

const MonoText = ({
  children,
  color = WHITE,
  size = MONO_FS,
}: {
  children: React.ReactNode;
  color?: string;
  size?: string;
}) => (
  <span
    style={{
      fontFamily: MONO_FONT_FAMILY,
      fontSize: size,
      lineHeight: 1.5,
      color,
    }}
  >
    {children}
  </span>
);

const Caption = ({ children }: { children: React.ReactNode }) => (
  // `motion.p` so the illustration's stagger flows straight through
  // to the caption — saves a wrapper div per illustration.
  <motion.p
    variants={item}
    className="uppercase"
    style={{
      fontFamily: MONO_FONT_FAMILY,
      fontSize: MONO_FS,
      lineHeight: 1.5,
      color: WHITE,
      textAlign: "center",
      letterSpacing: "0.01em",
    }}
  >
    {children}
  </motion.p>
);

/** 18 px horizontal dashed connector between chips in row 1. */
const HConnector = () => (
  <svg width="18" height="2" viewBox="0 0 18 2" aria-hidden="true" style={{ flexShrink: 0 }}>
    <line x1="0" y1="1" x2="18" y2="1" stroke={CARBON_300} strokeWidth="1" strokeDasharray="3 2" />
  </svg>
);

/* ─────────────────────────── 1. AUTOMATIC RETRIES ────────────────────── */

export function IllustrationAutomaticRetries() {
  // Row of FAIL FAIL FAIL DONE chips with 18 px
  // dashed connectors, 1s/2s/4s in salmon centered under each FAIL
  // chip, green check icon centered under DONE, EXPONENTIAL BACKOFF
  // caption centered below the whole diagram.
  return (
    <motion.div
      className="flex flex-col items-center gap-[34px]"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      <motion.div
        className="grid items-center"
        style={{
          gridTemplateColumns: "auto auto auto auto auto auto auto",
          columnGap: 0,
        }}
        variants={stagger}
      >
        <motion.span variants={item}><Chip label="FAIL" color={SALMON} /></motion.span>
        <motion.span variants={item}><HConnector /></motion.span>
        <motion.span variants={item}><Chip label="FAIL" color={SALMON} /></motion.span>
        <motion.span variants={item}><HConnector /></motion.span>
        <motion.span variants={item}><Chip label="FAIL" color={SALMON} /></motion.span>
        <motion.span variants={item}><HConnector /></motion.span>
        <motion.span variants={item}><Chip label="DONE" color={GREEN} /></motion.span>
        <motion.span variants={item} className="flex justify-center">
          <MonoText color={SALMON}><span className="uppercase">1s</span></MonoText>
        </motion.span>
        <span />
        <motion.span variants={item} className="flex justify-center">
          <MonoText color={SALMON}><span className="uppercase">2s</span></MonoText>
        </motion.span>
        <span />
        <motion.span variants={item} className="flex justify-center">
          <MonoText color={SALMON}><span className="uppercase">4s</span></MonoText>
        </motion.span>
        <span />
        <motion.span variants={item} className="flex justify-center pt-0.5">
          <Check />
        </motion.span>
      </motion.div>
      <Caption>Exponential backoff</Caption>
    </motion.div>
  );
}

/* ─────────────────────── 2. STEP-LEVEL CHECKPOINTING ─────────────────── */

export function IllustrationStepCheckpointing() {
  // Status-icon column on the left, chip column on
  // the right. Dashed vertical connectors live BETWEEN the chips in
  // the right column only (icon column is unconnected).
  //
  // Layout: stack the rows with explicit per-segment heights so the
  // dashed connectors can render as flex siblings between rows
  // (no absolute positioning, no measurement guessing) — that was
  // what produced the off-position stubs before. Each row is a
  // flex item, each connector is a 40 px tall flex item with a
  // single dashed border-left at the chip's mid-x.
  const STATUSES = [
    { icon: <Check />, chip: <Chip label="send-welcome-email" color={GREEN} width={232} /> },
    { icon: <Check />, chip: <Chip label="sync-to-crm" color={GREEN} width={216} /> },
    { icon: <Cross />, chip: <Chip label="update-metrics" color={SALMON} width={216} /> },
  ];
  // Icon column = 22 px wide, gap to chip = 20 px → chip starts at
  // x = 42. For a typical 216 px chip the mid-x is 42 + 108 = 150.
  // Connector sits one pixel left of that (left=150) so it visually
  // bisects the chip cleanly.
  const CONNECTOR_X = 150;
  const CONNECTOR_H = 40;
  return (
    <motion.div
      className="flex flex-col items-center gap-[34px]"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      <motion.div className="relative flex flex-col" variants={stagger}>
        {STATUSES.map((row, i) => (
          <motion.div key={i} variants={item}>
            <div className="flex items-center gap-[20px]">
              {row.icon}
              {row.chip}
            </div>
            {i < STATUSES.length - 1 && (
              <div className="relative" style={{ height: CONNECTOR_H }}>
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0"
                  style={{
                    left: CONNECTOR_X,
                    width: 0,
                    borderLeft: `1px dashed ${CARBON_300}`,
                  }}
                />
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
      <Caption>Only step 3 retried</Caption>
    </motion.div>
  );
}

/* ───────────────────────── 3. FULL RUN TRACES AND LOGS ───────────────── */

export function IllustrationFullRunTraces() {
  // 4 trace rows (label + ms timing right-aligned),
  // 46 px between rows. Horizontal progress bar below — muted-green
  // base (full 332 px) + bright-green slice (~90 px from the left).
  // Caption "FULL TRACE PER RUN".
  const ROWS: Array<{ label: string; ms: string; highlight?: boolean }> = [
    { label: "post-signup-flow", ms: "321ms" },
    { label: "send-welcome-email", ms: "84ms", highlight: true },
    { label: "sync-to-crm", ms: "121ms" },
    { label: "update-metrics", ms: "107ms" },
  ];
  return (
    <motion.div
      className="flex flex-col items-center gap-[22px]"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      <motion.div
        className="flex flex-col"
        style={{ width: 332, gap: 24 }}
        variants={stagger}
      >
        {ROWS.map((r) => (
          <motion.div
            key={r.label}
            className="flex items-center justify-between"
            variants={item}
          >
            <MonoText color={r.highlight ? GREEN : WHITE}>{r.label}</MonoText>
            <MonoText color={r.highlight ? GREEN : WHITE}>{r.ms}</MonoText>
          </motion.div>
        ))}
      </motion.div>
      <motion.div
        className="relative"
        style={{ width: 332, height: 5 }}
        variants={item}
      >
        <div className="absolute inset-0" style={{ backgroundColor: MUTED_GREEN }} />
        <motion.div
          className="absolute left-0 top-0 h-full"
          style={{ width: 90, backgroundColor: GREEN, transformOrigin: "left" }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] as const, delay: 0.45 }}
        />
      </motion.div>
      <Caption>Full trace per run</Caption>
    </motion.div>
  );
}

/* ────────────────────── 4. CONCURRENCY AND THROTTLING ────────────────── */

export function IllustrationConcurrency() {
  // 3 user rows, each with a 5-cell queue box
  // (small dots inside cells, outer border). Vertical green dashed
  // LIMIT line + green LIMIT label on the right.
  const CELL = 16;
  // Per-user 4-cell queue with green chips; fill pattern per the target
  // image (true = green chip, false = empty cell).
  const FILLS: Record<string, boolean[]> = {
    "user:alice": [false, true, true, true],
    "user:bob": [true, true, true, false],
    "user:carol": [false, true, true, true],
  };
  const QueueRow = ({ label }: { label: string }) => (
    <div className="flex items-center gap-6">
      <span style={{ width: 80 }}>
        <MonoText>{label}</MonoText>
      </span>
      <div
        className="flex items-center"
        style={{
          border: `1px solid ${CARBON_300}`,
          padding: 2,
          gap: 1.5,
        }}
      >
        {(FILLS[label] ?? []).map((on, i) => (
          <span
            key={i}
            className="flex items-center justify-center"
            style={{
              width: CELL,
              height: CELL,
              border: `1px solid ${CARBON_300}`,
            }}
          >
            {on && (
              <span
                style={{
                  width: 4,
                  height: 4,
                  backgroundColor: GREEN,
                  display: "inline-block",
                }}
              />
            )}
          </span>
        ))}
      </div>
    </div>
  );
  return (
    <motion.div
      className="flex flex-col items-center gap-[34px]"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      <div className="relative">
        <motion.div className="flex flex-col" style={{ gap: 16 }} variants={stagger}>
          <motion.div variants={item}><QueueRow label="user:alice" /></motion.div>
          <motion.div variants={item}><QueueRow label="user:bob" /></motion.div>
          <motion.div variants={item}><QueueRow label="user:carol" /></motion.div>
        </motion.div>
        {/* Dashed green LIMIT line — sits clearly to the right of
            the queue box (not flush). Total queue
            width = 5 cells × 16 px + 4 gaps × 1.5 px + 2 × 1 px
            outer border + 2 × 2 px inner padding = ~96 px. We
            offset the line by 20 px from the queue's right edge so
            the LIMIT label has breathing room. */}
        <span
          aria-hidden="true"
          className="absolute"
          style={{
            left: 80 + 24 + 74 + 16,
            top: -6,
            height: 112,
            borderLeft: `1px dashed ${GREEN}`,
          }}
        />
        <span
          className="absolute uppercase"
          style={{
            left: 80 + 24 + 74 + 24,
            top: -6,
            fontFamily: MONO_FONT_FAMILY,
            fontSize: MONO_FS,
            lineHeight: 1.5,
            color: GREEN,
          }}
        >
          LIMIT
        </span>
      </div>
      <Caption>Exponential backoff</Caption>
    </motion.div>
  );
}

/* ─────────────────────────── 5. PRIORITY QUEUING ─────────────────────── */

export function IllustrationPriorityQueuing() {
  // HIGH/MID/LOW tiers, each with a rounded dashed-
  // outline bucket holding chips. HIGH bucket has a GREEN dashed
  // border, MID/LOW have grey dashed borders. Green dashed arrow ↓
  // on the right side outside the buckets. The buckets
  // are 6 px rounded and PRO chips inside HIGH sit ~50 px apart.
  const TIER_LABEL_W = 56;
  const BUCKET_W = 240;
  const TierRow = ({
    tier,
    tierColor = WHITE,
    borderColor = CARBON_300,
    chips,
    chipGap = 12,
  }: {
    tier: string;
    tierColor?: string;
    borderColor?: string;
    chips: Array<{ label?: string; color: string }>;
    chipGap?: number;
  }) => (
    <div className="flex items-center gap-6">
      <span style={{ width: TIER_LABEL_W }}>
        <MonoText color={tierColor}>
          <span className="uppercase">{tier}</span>
        </MonoText>
      </span>
      <div
        className="flex items-center rounded-[6px]"
        style={{
          gap: chipGap,
          border: `1px dashed ${borderColor}`,
          padding: 8,
          width: BUCKET_W,
          minHeight: 32,
        }}
      >
        {chips.map((c, i) => (
          <span key={i} className="inline-flex items-center gap-2">
            <DotSquare color={c.color} size={8} />
            {c.label && (
              <MonoText color={WHITE}>
                <span className="uppercase">{c.label}</span>
              </MonoText>
            )}
          </span>
        ))}
      </div>
    </div>
  );
  return (
    <motion.div
      className="flex flex-col items-center gap-[34px]"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      <div className="relative">
        <motion.div className="flex flex-col" style={{ gap: 16 }} variants={stagger}>
          <motion.div variants={item}>
            <TierRow
              tier="HIGH"
              tierColor={GREEN}
              borderColor={GREEN}
              chipGap={50}
              chips={[
                { label: "PRO", color: GREEN },
                { label: "PRO", color: GREEN },
              ]}
            />
          </motion.div>
          <motion.div variants={item}>
            <TierRow tier="MID" chips={[{ label: "FREE", color: CARBON_300 }]} />
          </motion.div>
          <motion.div variants={item}>
            <TierRow
              tier="LOW"
              tierColor={CARBON_300}
              chips={[{ color: CARBON_300 }]}
            />
          </motion.div>
        </motion.div>
        {/* Green dashed arrow pointing DOWN, ~16 px right of the
            buckets so the arrow has breathing room from the dashed
            bucket border. Arrow head lands at the LOW row baseline. */}
        <svg
          width="14"
          height="120"
          viewBox="0 0 14 120"
          className="absolute"
          style={{ left: TIER_LABEL_W + 24 + BUCKET_W + 16, top: 0 }}
          aria-hidden="true"
        >
          <line x1="7" y1="0" x2="7" y2="106" stroke={GREEN} strokeWidth="1" strokeDasharray="3 2" />
          <path d="M2 102 L 7 114 L 12 102" stroke={GREEN} strokeWidth="1" fill="none" />
        </svg>
      </div>
      <Caption>High-priority drains first</Caption>
    </motion.div>
  );
}

/* ─────────────────────────── 6. BULK REPLAY ──────────────────────────── */

export function IllustrationBulkReplay() {
  // Left column 4 ✗ red run_281, centre REPLAY label
  // + short dashed → arrow, right column 4 ✓ green run_281.
  const Pair = ({ status }: { status: "fail" | "ok" }) => (
    <div className="flex items-center gap-4">
      {status === "fail" ? <Cross /> : <Check />}
      <span
        className="inline-flex items-center gap-3 rounded-[6px] border px-[20px] py-2"
        style={{
          borderColor: status === "fail" ? SALMON : GREEN,
          color: WHITE,
        }}
      >
        <DotSquare color={status === "fail" ? SALMON : GREEN} />
        <MonoText>run_281</MonoText>
      </span>
    </div>
  );
  return (
    <motion.div
      className="flex flex-col items-center gap-[34px]"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      <motion.div className="flex items-center gap-6" variants={stagger}>
        <motion.div className="flex flex-col gap-3" variants={stagger}>
          <motion.div variants={item}><Pair status="fail" /></motion.div>
          <motion.div variants={item}><Pair status="fail" /></motion.div>
          <motion.div variants={item}><Pair status="fail" /></motion.div>
          <motion.div variants={item}><Pair status="fail" /></motion.div>
        </motion.div>
        <motion.div
          className="flex flex-col items-center justify-center gap-1.5"
          variants={item}
        >
          <span
            className="uppercase"
            style={{ fontFamily: MONO_FONT_FAMILY, fontSize: MONO_FS, lineHeight: 1, color: GREEN }}
          >
            REPLAY
          </span>
          <svg width="48" height="10" viewBox="0 0 48 10" aria-hidden="true">
            <line x1="0" y1="5" x2="40" y2="5" stroke={GREEN} strokeWidth="1" strokeDasharray="3 2" />
            <path d="M40 1 L 46 5 L 40 9" stroke={GREEN} strokeWidth="1" fill="none" />
          </svg>
        </motion.div>
        <motion.div className="flex flex-col gap-3" variants={stagger}>
          <motion.div variants={item}><Pair status="ok" /></motion.div>
          <motion.div variants={item}><Pair status="ok" /></motion.div>
          <motion.div variants={item}><Pair status="ok" /></motion.div>
          <motion.div variants={item}><Pair status="ok" /></motion.div>
        </motion.div>
      </motion.div>
      <Caption>Bulk replay in one click</Caption>
    </motion.div>
  );
}

/* ─────────────────────────── 7. LOCAL DEV SERVER ─────────────────────── */

export function IllustrationLocalDev() {
  // A terminal-style bordered panel. Title row with
  // separator beneath. Two function entries (green dot + name + ms),
  // each followed by sub-steps (indented label + tiny green check).
  // Caption "NPX INNGEST-CLI DEV" *outside* the panel below.
  const SubLine = ({ label }: { label: string }) => (
    <div className="flex items-center justify-between gap-10 pl-6">
      <MonoText color={WHITE}>{label}</MonoText>
      <TinyCheck />
    </div>
  );
  const FnRow = ({ name, ms }: { name: string; ms: string }) => (
    <div className="flex items-center justify-between gap-10">
      <span className="inline-flex items-center gap-3">
        <DotSquare color={GREEN} />
        <MonoText color={GREEN}>{name}</MonoText>
      </span>
      <MonoText color={WHITE}>{ms}</MonoText>
    </div>
  );
  return (
    <motion.div
      className="flex flex-col items-center gap-6"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      <motion.div
        className="flex w-[316px] flex-col"
        style={{ border: `1px solid ${CARBON_300}`, transformOrigin: "top" }}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] as const }}
      >
        <motion.div
          className="px-[20px] py-[10px]"
          style={{ borderBottom: `1px solid ${CARBON_300}` }}
          variants={item}
        >
          <MonoText color={WHITE}>inngest dev — localhost:8288</MonoText>
        </motion.div>
        <motion.div className="flex flex-col gap-1.5 px-[20px] py-[14px]" variants={stagger}>
          <motion.div variants={item}><FnRow name="post-signup-flow" ms="84ms" /></motion.div>
          <motion.div variants={item}><SubLine label="send-welcome-email" /></motion.div>
          <motion.div variants={item}><SubLine label="sync-to-crm" /></motion.div>
          <motion.div variants={item}><FnRow name="process-payment" ms="121ms" /></motion.div>
          <motion.div variants={item}><SubLine label="charge-card" /></motion.div>
          <motion.div variants={item}><SubLine label="send-receipt" /></motion.div>
        </motion.div>
      </motion.div>
      <Caption>Npx inngest-cli dev</Caption>
    </motion.div>
  );
}

/* ───────────────────────── 8. TYPESCRIPT-NATIVE ──────────────────────── */

export function IllustrationTypeScript() {
  // A TS snippet (multi-line, mono) with a green
  // dashed arrow to a green-bordered "INFERRED" chip.
  return (
    <motion.div
      className="flex flex-col items-center gap-[28px]"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      <div className="flex items-center gap-6">
        <motion.pre
          className="whitespace-pre"
          style={{
            fontFamily: MONO_FONT_FAMILY,
            fontSize: MONO_FS,
            lineHeight: 1.5,
            color: WHITE,
            margin: 0,
          }}
          variants={item}
        >
          <span style={{ color: CARBON_300 }}>{`// define once`}</span>
          {"\n"}
          <span style={{ color: "#fd8a72" }}>type</span>
          {" SignupEvent = {"}
          {"\n  data : { "}
          {"\n    userId: "}
          <span style={{ color: "#5f7df0" }}>string</span>
          {"\n    email: "}
          <span style={{ color: "#5f7df0" }}>string</span>
          {"\n  }"}
          {"\n}"}
        </motion.pre>
        <motion.div className="flex items-center gap-[10px]" variants={item}>
          <svg width="56" height="10" viewBox="0 0 56 10" aria-hidden="true">
            <line x1="0" y1="5" x2="48" y2="5" stroke={GREEN} strokeWidth="1" strokeDasharray="3 2" />
            <path d="M48 1 L 54 5 L 48 9" stroke={GREEN} strokeWidth="1" fill="none" />
          </svg>
          <span
            className="inline-flex items-center gap-3 rounded-[6px] border px-[20px] py-2"
            style={{ borderColor: GREEN }}
          >
            <DotSquare color={GREEN} />
            <MonoText color={WHITE}>
              <span className="uppercase">INFERRED</span>
            </MonoText>
          </span>
        </motion.div>
      </div>
      <Caption>End-to-end type safety</Caption>
    </motion.div>
  );
}

/* ─────────────────────────────── REGISTRY ────────────────────────────── */

export const ILLUSTRATIONS = {
  retries: IllustrationAutomaticRetries,
  checkpointing: IllustrationStepCheckpointing,
  traces: IllustrationFullRunTraces,
  concurrency: IllustrationConcurrency,
  priority: IllustrationPriorityQueuing,
  replay: IllustrationBulkReplay,
  devServer: IllustrationLocalDev,
  typescript: IllustrationTypeScript,
} as const;

export type IllustrationId = keyof typeof ILLUSTRATIONS;
