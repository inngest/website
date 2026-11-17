"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import {
  COLORS,
  DAYS,
  MACHINE,
  unlockAt,
  unlockLabel,
} from "@/components/v1/sections/TwelveDays/data";
import {
  buttonClass,
  POSTER_EYEBROW,
  POSTER_TITLE,
} from "@/components/v1/sections/TwelveDays/poster";

type StageStatus = "idle" | "running" | "done" | "failed";
type RunState = "idle" | "running" | "crashed" | "finished";
type TraceKind = "start" | "ok" | "fail" | "retry" | "crash" | "resume" | "end";

interface TraceLine {
  id: number;
  kind: TraceKind;
  text: string;
  ms?: number;
}

const STEP_MS = 650;
const FLAKY_CHANCE = 0.3;

function formatMs(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
  if (ms < 86_400_000) return `${Math.round(ms / 60_000)}m`;
  return `${Math.round(ms / 86_400_000)}d`;
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const TRACE_COLOR: Record<TraceKind, string> = {
  start: "text-white/60",
  ok: "text-[#0BDD48]",
  fail: "text-[#F55C50]",
  retry: "text-[#ECFE08]",
  crash: "text-[#F55C50]",
  resume: "text-[#ECFE08]",
  end: "text-white",
};

/**
 * A playable Rube Goldberg machine built from the unlocked primitives.
 * An eyeball (the one from the finale poster) rolls from stage to
 * stage while a dashboard-style trace logs each step. Crash it mid-run
 * and Resume picks up at the stage that fell over: the finished steps
 * are memoized, which is the whole point of durable execution.
 */
export default function Machine({ now }: { now: Date | null }) {
  const reduceMotion = useReducedMotion();
  const unlocked = now
    ? DAYS.filter((d) => unlockAt(d.day).getTime() <= now.getTime())
    : [];
  const stages = unlocked.map((d) => d.day);

  const [status, setStatus] = useState<Record<number, StageStatus>>({});
  const [active, setActive] = useState<number | null>(null);
  const [runState, setRunState] = useState<RunState>("idle");
  const [trace, setTrace] = useState<TraceLine[]>([]);
  const [flaky, setFlaky] = useState(false);

  // Bumped to cancel an in-flight run (crash, reset, unmount).
  const token = useRef(0);
  const nextId = useRef(0);
  const activeIndex = useRef(0);
  const traceRef = useRef<HTMLOListElement>(null);

  useEffect(() => () => void token.current++, []);

  // Keep the newest trace line in view.
  useEffect(() => {
    const el = traceRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [trace]);

  const log = (kind: TraceKind, text: string, ms?: number) =>
    setTrace((t) => [...t, { id: nextId.current++, kind, text, ms }]);

  const setStage = (day: number, s: StageStatus) =>
    setStatus((prev) => ({ ...prev, [day]: s }));

  const runFrom = async (start: number) => {
    const mine = ++token.current;
    const stepMs = reduceMotion ? 250 : STEP_MS;
    setRunState("running");

    for (let i = start; i < stages.length; i++) {
      const day = stages[i];
      const step = MACHINE.steps[day];
      activeIndex.current = i;
      setActive(day);
      setStage(day, "running");
      log("start", step.step);
      await wait(stepMs);
      if (token.current !== mine) return;

      // Flaky mode: some steps throw once, and Inngest retries just
      // that step.
      if (flaky && Math.random() < FLAKY_CHANCE) {
        setStage(day, "failed");
        log("fail", `Error: flaky dependency (attempt 1)`);
        await wait(stepMs);
        if (token.current !== mine) return;
        setStage(day, "running");
        log("retry", `Retrying just this step (attempt 2)`);
        await wait(stepMs);
        if (token.current !== mine) return;
      }

      setStage(day, "done");
      log("ok", step.done, step.ms);
    }

    setActive(null);
    setRunState("finished");
    const next = DAYS.find((d) => !stages.includes(d.day));
    log(
      "end",
      next
        ? `Run complete. ${stages.length} of 12 stages. Stage ${
            next.day
          } unlocks ${unlockLabel(next.day)}.`
        : "Run complete. All 12 stages. Ridiculous."
    );
  };

  const run = () => {
    token.current++;
    setStatus({});
    setTrace([]);
    runFrom(0);
  };

  const crash = () => {
    token.current++;
    const day = stages[activeIndex.current];
    setStage(day, "failed");
    setRunState("crashed");
    log("crash", `💥 Server crashed during stage ${day}`);
  };

  const resume = () => {
    const skipped = activeIndex.current;
    log(
      "resume",
      skipped > 0
        ? `Resuming. ${skipped} finished step${
            skipped === 1 ? "" : "s"
          } skipped, not re-run.`
        : "Resuming from the first step."
    );
    runFrom(activeIndex.current);
  };

  const reset = () => {
    token.current++;
    setStatus({});
    setTrace([]);
    setActive(null);
    setRunState("idle");
  };

  const ballColor =
    runState === "crashed"
      ? COLORS.salmon
      : active && status[active] === "failed"
      ? COLORS.salmon
      : "#FFFFFF";

  return (
    <section
      aria-labelledby="twelve-days-machine-heading"
      className="relative w-full text-white"
      style={{ backgroundColor: COLORS.ink }}
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-6 py-16 sm:px-9 sm:py-20 lg:px-8 lg:py-24">
        <div className="flex flex-col gap-5">
          <p className={`${POSTER_EYEBROW} text-[#ECFE08]`}>
            {MACHINE.eyebrow}
          </p>
          <h2 id="twelve-days-machine-heading" className={POSTER_TITLE}>
            {MACHINE.title}
          </h2>
          <p className="font-v1Label text-[clamp(18px,2.4vw,28px)] uppercase leading-[1.15] text-[#0BDD48]">
            {MACHINE.subtitle}
          </p>
          <p className="max-w-[640px] text-[18px] leading-[28px] text-white/80">
            {MACHINE.body}
          </p>
          <p className="max-w-[640px] text-[15px] italic leading-[22px] text-white/60">
            {MACHINE.aside}
          </p>
        </div>

        {/* Controls. */}
        <div className="flex flex-wrap items-center gap-3">
          {runState === "running" ? (
            <MachineButton onClick={crash} tone="salmon">
              💥 Crash it
            </MachineButton>
          ) : runState === "crashed" ? (
            <MachineButton onClick={resume} tone="lime">
              ↻ Resume
            </MachineButton>
          ) : (
            <MachineButton
              onClick={run}
              tone="green"
              disabled={stages.length === 0}
            >
              ▶ {runState === "finished" ? "Run it again" : "Run the machine"}
            </MachineButton>
          )}
          {runState !== "idle" && (
            <MachineButton onClick={reset} tone="ghost">
              Reset
            </MachineButton>
          )}
          <label className="ml-1 inline-flex cursor-pointer select-none items-center gap-2 font-v1Label text-[13px] uppercase">
            <input
              type="checkbox"
              checked={flaky}
              onChange={(e) => setFlaky(e.target.checked)}
              className="h-4 w-4 accent-[#ECFE08]"
            />
            Flaky steps
          </label>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          {/* The track: twelve stages, in order. */}
          <LayoutGroup>
            <ol className="grid list-none grid-cols-2 gap-3 pl-0 sm:grid-cols-3 xl:grid-cols-4">
              {DAYS.map((d) => {
                const isUnlocked = stages.includes(d.day);
                const s = status[d.day] ?? "idle";
                return (
                  <li
                    key={d.day}
                    className="relative flex min-h-[112px] list-none flex-col justify-between gap-2 rounded-xl border-[3px] p-3"
                    style={{
                      borderColor: isUnlocked ? "#FFFFFF" : "#ffffff33",
                      backgroundColor:
                        s === "done"
                          ? COLORS.green
                          : s === "failed"
                          ? COLORS.salmon
                          : s === "running"
                          ? COLORS.lime
                          : "transparent",
                      color:
                        s === "idle"
                          ? isUnlocked
                            ? "#FFF"
                            : "#ffffff55"
                          : COLORS.ink,
                    }}
                  >
                    <span className="flex items-center justify-between font-v1Label text-[12px] uppercase">
                      <span>Stage {d.day}</span>
                      <span>
                        {!isUnlocked
                          ? unlockLabel(d.day, true)
                          : s === "done"
                          ? "✓"
                          : s === "failed"
                          ? "✕"
                          : s === "running"
                          ? "…"
                          : ""}
                      </span>
                    </span>
                    <span className="font-sans text-[17px] font-black uppercase leading-[1.05]">
                      {isUnlocked ? d.primitive : "Locked"}
                    </span>
                    {active === d.day && (
                      <motion.span
                        layoutId="machine-ball"
                        aria-hidden="true"
                        className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border-[3px] border-[#010101]"
                        style={{ backgroundColor: ballColor }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 22,
                        }}
                      >
                        <span className="h-2.5 w-2.5 rounded-full bg-[#010101]" />
                      </motion.span>
                    )}
                  </li>
                );
              })}
            </ol>
          </LayoutGroup>

          {/* Dashboard-style run trace. */}
          <div className="order-first flex flex-col overflow-hidden rounded-xl border-[3px] border-[#0BDD48] lg:order-none">
            <div className="flex items-center justify-between border-b-[3px] border-[#0BDD48] px-4 py-2 font-v1Label text-[12px] uppercase">
              <span>Run trace</span>
              <span
                className={
                  runState === "running"
                    ? "text-[#ECFE08]"
                    : runState === "crashed"
                    ? "text-[#F55C50]"
                    : runState === "finished"
                    ? "text-[#0BDD48]"
                    : "text-white/50"
                }
              >
                {runState === "idle" ? "Waiting" : runState}
              </span>
            </div>
            <ol
              ref={traceRef}
              aria-live="polite"
              className="h-[180px] list-none overflow-y-auto px-4 py-3 pl-4 font-v1Mono text-[12px] leading-[20px] lg:h-[320px]"
            >
              {trace.length === 0 ? (
                <li className="list-none text-white/40">
                  {stages.length === 0
                    ? MACHINE.locked
                    : "Press Run the machine."}
                </li>
              ) : (
                trace.map((t) => (
                  <li
                    key={t.id}
                    className={`flex list-none justify-between gap-3 ${
                      TRACE_COLOR[t.kind]
                    }`}
                  >
                    <span>
                      {t.kind === "ok" ? "✓ " : t.kind === "start" ? "→ " : ""}
                      {t.text}
                    </span>
                    {t.ms !== undefined && (
                      <span className="shrink-0 text-white/40">
                        {formatMs(t.ms)}
                      </span>
                    )}
                  </li>
                ))
              )}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

function MachineButton({
  children,
  onClick,
  tone,
  disabled,
}: {
  children: ReactNode;
  onClick: () => void;
  tone: "green" | "lime" | "salmon" | "ghost";
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={buttonClass(tone)}
    >
      {children}
    </button>
  );
}
