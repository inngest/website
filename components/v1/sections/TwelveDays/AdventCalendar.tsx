"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "motion/react";
import {
  CALENDAR,
  CALENDAR_ID,
  COLORS,
  DAYS,
  DOOR_FACES,
  DOOR_ORDER,
  REF,
  unlockAt,
  unlockLabel,
  type WorkflowDay,
} from "@/components/v1/sections/TwelveDays/data";
import {
  formatCountdown,
  useOpenedDoors,
} from "@/components/v1/sections/TwelveDays/useCalendarClock";
import {
  POSTER_EYEBROW,
  POSTER_TITLE,
} from "@/components/v1/sections/TwelveDays/poster";

/**
 * The advent calendar: twelve doors, scattered like a real one, each
 * hinged on its left edge. A door unlocks at midnight Eastern on its
 * date (weekdays, December 3–18).
 * Today's door glows and waits to be held open (it creaks wider the
 * longer you hold); earlier days swing open on their own, in a stagger
 * the first time the grid scrolls into view.
 *
 * What's behind a locked door isn't rendered at all, so there's nothing
 * to find in the DOM before its day.
 */
export default function AdventCalendar({
  now,
  done,
  onToggleDone,
}: {
  now: Date | null;
  done: number[];
  onToggleDone: (day: number) => void;
}) {
  const gridRef = useRef<HTMLUListElement>(null);
  // Doors wait to pop until someone can see them, so the stagger isn't
  // spent above the fold while the visitor is still reading the hero.
  const inView = useInView(gridRef, {
    once: true,
    margin: "0px 0px -15% 0px",
  });

  // The soonest locked door gets the live countdown; the rest show a date.
  const nextDay = now
    ? DAYS.find((d) => unlockAt(d.day).getTime() > now.getTime())?.day
    : undefined;

  // The newest unlocked day is "today's" door: it has to be held open,
  // once per visitor.
  const { opened, markOpened } = useOpenedDoors();
  const today = now
    ? [...DAYS]
        .reverse()
        .find((d) => unlockAt(d.day).getTime() <= now.getTime())?.day
    : undefined;

  return (
    <section
      id={CALENDAR_ID}
      aria-labelledby="twelve-days-calendar-heading"
      className="relative w-full scroll-mt-20 overflow-hidden text-white"
      style={{ backgroundColor: COLORS.blue }}
    >
      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col gap-12 px-6 py-16 sm:px-9 sm:py-20 lg:px-8 lg:py-24">
        <div className="relative flex flex-col gap-5">
          <p className={`${POSTER_EYEBROW} text-[#0BDD48]`}>
            {CALENDAR.eyebrow}
          </p>
          <h2 id="twelve-days-calendar-heading" className={POSTER_TITLE}>
            {CALENDAR.title}
          </h2>
          <p className="font-v1Label text-[clamp(18px,2.4vw,28px)] uppercase leading-[1.15]">
            {CALENDAR.subtitle}
          </p>
          <p className="max-w-[560px] text-[18px] leading-[28px] text-white/85">
            {CALENDAR.body}
          </p>
          {/* The step.run rat, leaping over the heading. */}
          <Image
            src="/assets/v1/12-days/rat.webp"
            alt=""
            aria-hidden="true"
            width={1400}
            height={500}
            className="pointer-events-none absolute -top-6 right-0 hidden h-auto w-[46%] max-w-[560px] rounded-[24px] border-[3px] border-[#010101] shadow-[6px_6px_0_#010101] lg:block"
          />
        </div>

        <ul
          ref={gridRef}
          className="grid list-none grid-cols-1 gap-6 pl-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {DOOR_ORDER.map((dayNumber, position) => {
            const day = DAYS[dayNumber - 1];
            const unlocked =
              now !== null && unlockAt(day.day).getTime() <= now.getTime();
            return (
              <li
                key={day.day}
                id={`day-${day.day}`}
                className="h-full scroll-mt-24 list-none"
              >
                <Door
                  day={day}
                  unlocked={unlocked}
                  // Popping waits for the grid to be on screen and for
                  // the clock to have ticked once.
                  canPop={inView && now !== null}
                  staggerIndex={position}
                  needsHold={day.day === today && !opened.includes(day.day)}
                  onOpened={() => markOpened(day.day)}
                  done={done.includes(day.day)}
                  onToggleDone={() => onToggleDone(day.day)}
                  countdown={
                    now && day.day === nextDay
                      ? formatCountdown(
                          unlockAt(day.day).getTime() - now.getTime()
                        )
                      : null
                  }
                />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/** How long today's door has to be held before it gives. */
const HOLD_MS = 1200;

const BURST = [
  COLORS.salmon,
  COLORS.green,
  COLORS.lime,
  COLORS.cream,
  "#FFFFFF",
  COLORS.green,
];

function Door({
  day,
  unlocked,
  canPop,
  staggerIndex,
  needsHold,
  onOpened,
  countdown,
  done,
  onToggleDone,
}: {
  day: WorkflowDay;
  unlocked: boolean;
  canPop: boolean;
  staggerIndex: number;
  needsHold: boolean;
  onOpened: () => void;
  countdown: string | null;
  done: boolean;
  onToggleDone: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const face = DOOR_FACES[(day.day - 1) % DOOR_FACES.length];
  const [open, setOpen] = useState(false);
  const [rattle, setRattle] = useState(0);
  // Doors already unlocked when the grid first comes into view open in a
  // stagger; one that unlocks later (live, at midnight) opens straight
  // away. Recorded once, idempotently, so StrictMode's double effect run
  // doesn't flip it.
  const unlockedWhenSeen = useRef<boolean | null>(null);
  const [hover, setHover] = useState(false);
  // Hold-to-open progress, 0 to 1.
  const [hold, setHold] = useState(0);
  const holdFrame = useRef<number | null>(null);

  const stopHold = () => {
    if (holdFrame.current !== null) cancelAnimationFrame(holdFrame.current);
    holdFrame.current = null;
    setHold(0);
  };

  const startHold = () => {
    if (!needsHold || open || holdFrame.current !== null) return;
    const started = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - started) / HOLD_MS);
      setHold(p);
      if (p >= 1) {
        holdFrame.current = null;
        setHold(0);
        setOpen(true);
        onOpened();
        return;
      }
      holdFrame.current = requestAnimationFrame(tick);
    };
    holdFrame.current = requestAnimationFrame(tick);
  };

  useEffect(
    () => () => {
      if (holdFrame.current !== null) cancelAnimationFrame(holdFrame.current);
    },
    []
  );

  useEffect(() => {
    if (!canPop) return;
    if (unlockedWhenSeen.current === null) unlockedWhenSeen.current = unlocked;
    if (!unlocked || open || needsHold) return;
    const delay = unlockedWhenSeen.current ? 250 + staggerIndex * 110 : 0;
    const id = window.setTimeout(() => setOpen(true), delay);
    return () => window.clearTimeout(id);
  }, [unlocked, canPop, open, needsHold, staggerIndex]);

  // Closed doors creak when hovered: today's door the most, a locked one
  // barely. Holding pulls today's door wider.
  const ajar = needsHold
    ? -(hover ? 10 : 4) - hold * 26
    : !unlocked && hover
    ? -5
    : 0;

  const opensOn = unlockLabel(day.day);

  return (
    <div className="relative h-full [perspective:2000px]">
      {/* Behind the door. Only exists once the day has unlocked. In
          normal flow, so a long lesson makes its door (and its row)
          taller instead of being clipped; the door covers it. */}
      <div className="relative h-full min-h-[460px] overflow-hidden rounded-xl border-[3px] border-[#010101] bg-white text-[#010101] shadow-[6px_6px_0_#010101]">
        {unlocked && (
          // Out of the tab order and hidden from screen readers until
          // the door swings open, but still taking up its space.
          <div
            className="flex h-full flex-col gap-3 p-5"
            inert={!open}
            aria-hidden={!open}
          >
            <div className="flex items-center justify-between">
              <p className="font-v1Label text-[13px] uppercase">
                Lesson {day.day} · {day.primitive}
              </p>
              {done && (
                <span className="shrink-0 whitespace-nowrap rounded-full bg-[#0BDD48] px-2 py-0.5 font-v1Label text-[12px] uppercase">
                  {CALENDAR.completed}
                </span>
              )}
            </div>
            {/* Lesson video, or its slot until it's cut. */}
            {day.video ? (
              <video
                src={day.video}
                controls
                playsInline
                preload="metadata"
                className="aspect-video w-full rounded-md border-2 border-[#010101] bg-[#010101]"
              />
            ) : (
              <div
                role="img"
                aria-label={`Lesson ${day.day} video coming soon`}
                className="flex aspect-video w-full items-center justify-center rounded-md border-2 border-dashed border-[#010101] text-center font-v1Label text-[12px] uppercase"
                style={{ backgroundColor: COLORS.cream }}
              >
                ▶ Lesson video coming
              </div>
            )}
            <h3 className="font-sans text-[22px] font-black uppercase leading-[1.05] tracking-[-0.01em]">
              {day.gift}
            </h3>
            <p className="text-[14px] leading-[20px] text-[#010101]/75">
              {day.body}
            </p>
            <pre className="shrink-0 overflow-x-auto rounded-md bg-[#010101] p-3 font-v1Mono text-[12px] leading-[18px] text-[#0BDD48]">
              <code>{day.code}</code>
            </pre>
            {/* Sign-ups from each door are attributed to its day. */}
            <a
              href={`/sign-up?ref=${REF}-day-${day.day}`}
              className="mt-auto self-start font-v1Label text-[12px] uppercase underline underline-offset-4"
            >
              {CALENDAR.tryIt} <span aria-hidden="true">→</span>
            </a>
            <div className="flex items-center justify-between gap-3 pt-1">
              <Link
                href={day.docs.href}
                className="inline-flex items-center gap-2 font-v1Label text-[13px] uppercase underline-offset-4 hover:underline"
              >
                {day.docs.label} docs <span aria-hidden="true">→</span>
              </Link>
              <button
                type="button"
                onClick={onToggleDone}
                aria-pressed={done}
                className="shrink-0 rounded-full border-2 border-[#010101] px-3 py-1 font-v1Label text-[12px] uppercase hover:bg-[#010101] hover:text-white"
              >
                {done ? "Undo" : "Mark done"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confetti puff the moment the door swings. */}
      {open && !reduceMotion && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 z-20"
        >
          {BURST.map((color, i) => {
            const angle = (i / BURST.length) * Math.PI * 2 + 0.4;
            return (
              <motion.span
                key={i}
                className="absolute block h-3 w-3 rounded-full border border-[#010101]"
                style={{ backgroundColor: color }}
                initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                animate={{
                  x: Math.cos(angle) * 150,
                  y: Math.sin(angle) * 150,
                  scale: 0.2,
                  opacity: 0,
                }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              />
            );
          })}
        </div>
      )}

      {/* The door. Hinged on the left; swings out toward the viewer. */}
      <motion.button
        type="button"
        aria-label={
          needsHold
            ? `Day ${day.day} is ready. Press and hold to open.`
            : unlocked
            ? `Day ${day.day}: ${day.gift}`
            : `Day ${day.day}, opens ${opensOn} at midnight Eastern`
        }
        aria-disabled={!open && !needsHold}
        tabIndex={open ? -1 : 0}
        onClick={() => {
          if (!open && !needsHold) setRattle((n) => n + 1);
        }}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => {
          setHover(false);
          stopHold();
        }}
        onPointerDown={startHold}
        onPointerUp={stopHold}
        onPointerCancel={stopHold}
        onKeyDown={(e) => {
          if ((e.key === " " || e.key === "Enter") && !e.repeat) {
            e.preventDefault();
            startHold();
          }
        }}
        onKeyUp={(e) => {
          if (e.key === " " || e.key === "Enter") stopHold();
        }}
        // Stop the long-press menu on touch screens while holding.
        onContextMenu={(e) => needsHold && e.preventDefault()}
        className="absolute inset-0 z-10 rounded-xl [transform-style:preserve-3d] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#ECFE08]"
        style={{
          transformOrigin: "left center",
          pointerEvents: open ? "none" : "auto",
          touchAction: needsHold ? "none" : undefined,
          WebkitUserSelect: "none",
          userSelect: "none",
        }}
        initial={false}
        animate={
          open
            ? reduceMotion
              ? { opacity: 0 }
              : { rotateY: -96 }
            : { rotateY: reduceMotion ? 0 : ajar, opacity: 1 }
        }
        transition={
          reduceMotion
            ? { duration: 0.2 }
            : hold > 0
            ? { duration: 0 }
            : { type: "spring", stiffness: 140, damping: 14, mass: 0.9 }
        }
      >
        {/* Front face. */}
        <motion.span
          key={rattle}
          className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-xl border-[3px] border-[#010101] p-5 text-left shadow-[6px_6px_0_#010101] [backface-visibility:hidden]"
          style={{
            backgroundColor: face.bg,
            color: face.bg === COLORS.ink ? "#FFFFFF" : COLORS.ink,
          }}
          // A locked door rattles in its frame when tapped.
          animate={
            rattle && !reduceMotion ? { x: [0, -6, 6, -4, 4, 0] } : undefined
          }
          transition={{ duration: 0.4 }}
        >
          {/* Today's door glows until it's opened. */}
          {needsHold && !reduceMotion && (
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[9px] border-[6px]"
              style={{ borderColor: COLORS.lime }}
              animate={{ opacity: [0.25, 1, 0.25] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            />
          )}
          <span className="relative flex items-center justify-between font-v1Label text-[14px] uppercase">
            <span>Day</span>
            <span>{needsHold ? "Today" : unlocked ? "Open" : "Locked"}</span>
          </span>
          <span
            className="relative font-sans text-[160px] font-black leading-[0.8] tracking-[-0.05em] sm:text-[180px]"
            style={{ color: face.num }}
          >
            {day.day}
          </span>
          {needsHold ? (
            <span className="relative flex flex-col gap-2">
              <span className="font-v1Label text-[13px] uppercase">
                {hold > 0
                  ? "Keep holding…"
                  : `Open Day ${day.day} · press and hold`}
              </span>
              <span className="block h-3 w-full overflow-hidden rounded-full border-[3px] border-[#010101] bg-white">
                <span
                  className="block h-full"
                  style={{
                    width: `${hold * 100}%`,
                    backgroundColor: COLORS.green,
                  }}
                />
              </span>
            </span>
          ) : (
            <span className="relative font-v1Label text-[13px] uppercase">
              {countdown
                ? `Opens in ${countdown}`
                : unlocked
                ? "Opening…"
                : `Opens ${opensOn}`}
            </span>
          )}
          {/* Door knob. */}
          <span
            aria-hidden="true"
            className="absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-[3px] border-[#010101]"
            style={{ backgroundColor: COLORS.lime }}
          />
        </motion.span>

        {/* Inside of the door, seen once it's swung open. */}
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-xl border-[3px] border-[#010101] [backface-visibility:hidden] [transform:rotateY(180deg)]"
          style={{
            backgroundColor: face.bg,
            backgroundImage:
              "linear-gradient(rgb(0 0 0 / 0.4), rgb(0 0 0 / 0.4))",
          }}
        />
      </motion.button>
    </div>
  );
}
