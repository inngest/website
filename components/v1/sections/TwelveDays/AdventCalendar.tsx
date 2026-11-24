"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "motion/react";
import {
  COURSE_REPO,
  CALENDAR,
  CALENDAR_JOIN,
  DAY_ZERO,
  CALENDAR_ID,
  COLORS,
  DAYS,
  DOOR_ART,
  DOOR_FACES,
  NEW_TO_INNGEST,
  raffleDayAt,
  RAFFLE,
  unlockAt,
  unlockLabel,
  type WorkflowDay,
} from "@/components/v1/sections/TwelveDays/data";
import { buttonClass } from "@/components/v1/sections/TwelveDays/poster";
import JoinForm from "@/components/v1/sections/TwelveDays/JoinForm";
import { copyText } from "@/components/v1/sections/TwelveDays/copyText";
import { handleStartFreeClick } from "@/utils/v1/startFreeCta";
import { trackInstallCopy } from "@/utils/v1/trackInstallCopy";
import {
  formatCountdown,
  useOpenedDoors,
} from "@/components/v1/sections/TwelveDays/useCalendarClock";
import {
  claimAutoPrompt,
  openRaffle,
  useRaffleState,
} from "@/components/v1/sections/TwelveDays/useRaffle";
import {
  POSTER_EYEBROW,
  POSTER_TITLE,
} from "@/components/v1/sections/TwelveDays/poster";

/**
 * The advent calendar: twelve doors in order, each hinged on its left
 * edge. The front leads with the lesson's concept; the number and the
 * teaser quote are secondary. A door unlocks at midnight Eastern on its
 * date (one a day, December 7–18).
 * Today's door glows and waits to be held open (it creaks wider the
 * longer you hold); earlier days swing open on their own, in a stagger
 * the first time the grid scrolls into view.
 *
 * What's behind a locked door isn't rendered at all, so there's nothing
 * to find in the DOM before its day.
 */
/**
 * Where the Day 0 setup door sits while we try layouts:
 * - "header": a card to the right of "No peeking." and the sign-up form.
 * - "grid": a full-width door across the top of the twelve lessons.
 */
const DAY_ZERO_PLACEMENT: "header" | "grid" = "header";

export default function AdventCalendar({ now }: { now: Date | null }) {
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

  // Arriving from a daily email (…#day-N) means they've come for that
  // lesson: skip the press-and-hold and let today's door open itself,
  // without the raffle pop-up on top of it.
  useEffect(() => {
    if (today === undefined) return;
    const check = () => {
      const match = /^#day-(\d+)$/.exec(window.location.hash);
      if (match && Number(match[1]) === today) {
        markOpened(today);
        // They came for the lesson, so no pop-up over it; the door's
        // raffle button is right there.
        claimAutoPrompt(today);
      }
    };
    check();
    window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
    // markOpened is stable enough: it only appends to storage.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today]);

  // The day whose raffle is open, and the days this browser has entered.
  const raffleDay = now ? raffleDayAt(now) : null;
  const { days: entered } = useRaffleState();

  // Offer today's raffle once a day when the doors come into view. If
  // today's door still has to be held open, the offer waits for that
  // (onOpened below) so the door gets its moment first.
  const todayNeedsHold = today !== undefined && !opened.includes(today);
  useEffect(() => {
    if (!inView || raffleDay === null || todayNeedsHold) return;
    const id = window.setTimeout(() => {
      if (claimAutoPrompt(raffleDay)) openRaffle(raffleDay);
    }, 1500);
    return () => window.clearTimeout(id);
  }, [inView, raffleDay, todayNeedsHold]);

  return (
    <section
      id={CALENDAR_ID}
      aria-labelledby="twelve-days-calendar-heading"
      className="relative w-full scroll-mt-20 overflow-hidden text-white"
      style={{ backgroundColor: COLORS.ink }}
    >
      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col gap-12 px-6 py-16 sm:px-9 sm:py-20 lg:px-8 lg:py-24">
        {/* Header. With Day 0 placed here, it's two columns on desktop:
            the heading and sign-up on the left, the Day 0 door on the
            right. Stacks on smaller screens. */}
        <div
          className={
            DAY_ZERO_PLACEMENT === "header"
              ? "grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center xl:gap-16"
              : "contents"
          }
        >
          <div className="flex flex-col gap-5">
            <p className={`${POSTER_EYEBROW} text-[#0BDD48]`}>
              {CALENDAR.eyebrow}
            </p>
            <h2 id="twelve-days-calendar-heading" className={POSTER_TITLE}>
              {CALENDAR.title}
            </h2>
            {/* In place of the old "How it works" section: the doors and
              the page's one sign-up form (while a day's raffle is open it
              also enters that day's raffle). Setting up is the Day 0 door. */}
            <div className="mt-3 flex flex-col">
              <p className="font-v1Label text-[12px] uppercase tracking-[0.12em] text-[#0BDD48]">
                {CALENDAR_JOIN.when}
              </p>
              <h3 className="mt-1 font-sans text-[24px] font-black leading-[1.1] tracking-[-0.01em]">
                {CALENDAR_JOIN.title}
              </h3>
              <p className="mt-2 max-w-[560px] text-[15px] leading-[22px] text-white/80">
                {CALENDAR_JOIN.body}
              </p>
              <div className="mt-4">
                <JoinForm day={raffleDay} tone="dark" id="twelve-days" />
              </div>
              {/* Only before the first door: once a raffle is open the
                  form says so itself, and after the 18th it's over. */}
              {(!now || now.getTime() < unlockAt(1).getTime()) && (
                <p className="mt-3 font-v1Label text-[13px] text-white/60">
                  {CALENDAR_JOIN.note.before}
                  <a
                    href={CALENDAR_JOIN.note.link.href}
                    className="underline underline-offset-4 hover:no-underline"
                  >
                    {CALENDAR_JOIN.note.link.label}
                  </a>
                  {CALENDAR_JOIN.note.after}
                </p>
              )}
            </div>
          </div>
          {DAY_ZERO_PLACEMENT === "header" && (
            <div id="day-0" className="scroll-mt-24">
              <DayZeroDoor variant="card" />
            </div>
          )}
        </div>

        <ul
          ref={gridRef}
          className="grid list-none grid-cols-1 gap-6 pl-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {DAY_ZERO_PLACEMENT === "grid" && (
            <li id="day-0" className="col-span-full scroll-mt-24 list-none">
              <DayZeroDoor variant="banner" />
            </li>
          )}
          {DAYS.map((day, position) => {
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
                  onOpened={() => {
                    markOpened(day.day);
                    // Once the shutter is up, offer today's raffle.
                    if (day.day === raffleDay) {
                      window.setTimeout(() => {
                        if (claimAutoPrompt(day.day)) openRaffle(day.day);
                      }, 1200);
                    }
                  }}
                  raffle={
                    day.day === raffleDay
                      ? { entered: entered.includes(day.day) }
                      : null
                  }
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

/**
 * Day 0: the setup door. Full width above the lessons, so the twelve
 * stay a clean 4 × 3 (3 × 4, 2 × 6) grid at every breakpoint; thirteen
 * doors in one grid always leave one on its own.
 *
 * Open from the start, and it opens with a plain click: the hold is for
 * today's lesson. Not remembered between visits, so it always greets
 * people at the top. Arriving at #day-0 opens it straight away.
 */
function DayZeroDoor({ variant }: { variant: "banner" | "card" }) {
  const banner = variant === "banner";
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const check = () => {
      if (window.location.hash === "#day-0") setOpen(true);
    };
    check();
    window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
  }, []);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 4000);
    return () => window.clearTimeout(id);
  }, [copied]);

  async function copyPrompt() {
    const ok = await copyText(NEW_TO_INNGEST.prompt);
    setCopied(ok);
    trackInstallCopy({
      placement: "twelve_days_calendar",
      command: "get-started-prompt",
      status: ok ? "success" : "failed",
    });
  }

  const steps = [
    {
      text: DAY_ZERO.steps.prompt,
      action: (
        <button
          type="button"
          onClick={copyPrompt}
          className={buttonClass("ink")}
        >
          {copied ? "Copied ✓" : NEW_TO_INNGEST.copy}
        </button>
      ),
    },
    {
      text: DAY_ZERO.steps.repo,
      action: (
        <a
          href={COURSE_REPO.href}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass("outline")}
        >
          {COURSE_REPO.label}&nbsp;<span aria-hidden="true">↗</span>
        </a>
      ),
    },
    {
      text: DAY_ZERO.steps.cloud,
      action: (
        <a
          href={DAY_ZERO.signUpHref}
          onClick={handleStartFreeClick(DAY_ZERO.signUpHref)}
          className={buttonClass("outline")}
        >
          {NEW_TO_INNGEST.signUp.label}
        </a>
      ),
    },
  ];

  return (
    <div className="relative h-full">
      {/* Behind the door: the setup steps, and the prompt itself. */}
      <div
        className="relative h-full overflow-hidden rounded-[20px] border-[#020202] bg-white text-[#020202]"
        style={DOOR_BORDER}
      >
        <div
          className={
            banner
              ? "grid gap-6 p-5 md:min-h-[440px] md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-8 md:p-8"
              : "flex flex-col gap-3 p-5 sm:p-7"
          }
          inert={!open}
          aria-hidden={!open}
        >
          <div className="flex flex-col gap-3">
            <p className="font-v1Label text-[13px]">{DAY_ZERO.label}</p>
            <h3 className="font-sans text-[28px] font-black leading-[1.05] tracking-[-0.01em]">
              {DAY_ZERO.title}
            </h3>
            <p className="text-[14px] leading-[20px] text-[#020202]/75">
              {DAY_ZERO.body}
            </p>
            <ol className="mt-2 flex list-none flex-col gap-5 pl-0">
              {steps.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-[#020202] font-v1Label text-[12px] font-semibold"
                    style={{ backgroundColor: COLORS.yellow }}
                  >
                    {i + 1}
                  </span>
                  <span className="flex flex-col items-start gap-2.5">
                    <span className="text-[14px] leading-[20px]">
                      {step.text}
                    </span>
                    {step.action}
                  </span>
                </li>
              ))}
            </ol>
            <p
              role="status"
              className="min-h-[20px] font-v1Label text-[13px]"
              style={{ color: COLORS.salmon }}
            >
              {copied ? NEW_TO_INNGEST.copied : ""}
            </p>
          </div>
          {/* Banner only, and desktop only: on phones the copy button is
              enough, and the prompt would make the door a screen tall. */}
          {banner && (
            <div className="hidden min-w-0 flex-col gap-2 md:flex">
              <p className="font-v1Label text-[13px]">
                {DAY_ZERO.promptHeading}
              </p>
              <pre className="flex-1 overflow-auto whitespace-pre-wrap rounded-md bg-[#020202] p-4 font-v1Mono text-[12px] leading-[18px] text-[#0BDD48]">
                <code>{NEW_TO_INNGEST.prompt}</code>
              </pre>
            </div>
          )}
        </div>
      </div>

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
                className="absolute block h-3 w-3 rounded-full border border-[#020202]"
                style={{ backgroundColor: color }}
                initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                animate={{
                  x: Math.cos(angle) * 220,
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

      {/* The door, hinged on its left edge like the others. */}
      <div
        className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-[20px]"
        style={{ perspective: 2600 }}
      >
        <motion.button
          type="button"
          aria-label="Day 0: get set up. Open for the setup steps."
          tabIndex={open ? -1 : 0}
          onClick={() => setOpen(true)}
          className="absolute inset-0 rounded-[20px] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-[-7px] focus-visible:outline-[#F7DA10]"
          style={{
            pointerEvents: open ? "none" : "auto",
            transformOrigin: "left center",
          }}
          initial={false}
          animate={
            open
              ? reduceMotion
                ? { opacity: 0 }
                : { rotateY: -92, opacity: 0 }
              : { rotateY: 0, opacity: 1 }
          }
          whileHover={open || reduceMotion ? undefined : { rotateY: 6 }}
          transition={
            reduceMotion
              ? { duration: 0.2 }
              : open
              ? {
                  rotateY: { duration: 0.8, ease: [0.65, 0, 0.35, 1] },
                  opacity: { duration: 0.2, delay: 0.6 },
                }
              : { duration: 0.25 }
          }
        >
          <span
            className={
              "absolute inset-0 flex flex-col gap-6 overflow-hidden rounded-[20px] border-[#020202] p-5 text-left text-[#020202] " +
              (banner ? "md:flex-row md:p-8" : "sm:p-7 xl:flex-row") +
              // Ajar: creaks on a loop (CSS transform only); with reduced
              // motion it just rests a crack open.
              (open
                ? ""
                : " motion-safe:animate-door-ajar motion-reduce:[transform:perspective(1600px)_rotateY(3deg)]")
            }
            style={{
              ...DOOR_BORDER,
              backgroundColor: COLORS.salmon,
              transformOrigin: "left center",
            }}
          >
            <span
              className={
                "flex flex-col gap-6 " + (banner ? "md:w-1/2" : "xl:w-[46%]")
              }
            >
              <span className="flex items-start justify-between">
                <span className="flex flex-col">
                  <span className={`${DOOR_LABEL} -mb-2.5`}>Day</span>
                  <span className="font-sans text-[100px] font-black leading-none tracking-[-1px] text-white">
                    0
                  </span>
                </span>
                {/* A yellow sticker that wiggles every few seconds until
                    the door is opened. CSS only (transform), and still
                    for anyone who prefers reduced motion. */}
                <span
                  className={
                    `${DOOR_LABEL} inline-flex -rotate-3 items-center gap-[7px] rounded-full border-2 border-[#020202] px-3 py-0.5 shadow-[3px_3px_0_#020202] ` +
                    (open ? "" : "motion-safe:animate-start-here")
                  }
                  style={{ backgroundColor: HANDLE }}
                >
                  <LockIcon open />
                  Start here
                </span>
              </span>
              <span className="max-w-[420px] text-[20px] leading-[1.3]">
                {DAY_ZERO.teaser}
              </span>
              <span className={DOOR_LABEL}>{DAY_ZERO.cue}</span>
              <span
                aria-hidden="true"
                className="relative mt-auto block h-[15px] w-[100px] shrink-0 rounded-full border-2 border-[#020202]"
                style={{ backgroundColor: HANDLE }}
              />
            </span>
            {/* The window: the contraption art from the old Machine
                section, cropped to the mouse on its wheel. The art is
                split in two so the wheel can turn: the scene with the
                wheel's insides cleared, and the spokes and hub on their
                own, laid over the hub at the same scale. The spokes turn
                a quarter turn on the door's creak (CSS transform only);
                the spokes repeat every 45°, so the loop has no seam. */}
            <span
              className="relative block min-h-[180px] flex-1 overflow-hidden rounded-[30px] border-[#020202] bg-white"
              style={DOOR_BORDER}
            >
              <span
                className="pointer-events-none absolute inset-x-0 top-0 block select-none"
                style={{ aspectRatio: `${WHEEL_ART.w} / ${WHEEL_ART.h}` }}
              >
                <Image
                  src="/assets/v1/12-days/contraption-wheel-base.webp"
                  alt=""
                  aria-hidden="true"
                  draggable={false}
                  width={WHEEL_ART.w}
                  height={WHEEL_ART.h}
                  sizes="(min-width: 1024px) 25vw, 90vw"
                  className="absolute inset-0 h-full w-full"
                />
                <Image
                  src="/assets/v1/12-days/contraption-wheel-spokes.webp"
                  alt=""
                  aria-hidden="true"
                  draggable={false}
                  width={WHEEL_ART.size}
                  height={WHEEL_ART.size}
                  // Thin spokes: the higher quality keeps them crisp.
                  quality={95}
                  sizes="(min-width: 1024px) 17vw, 60vw"
                  className={
                    "absolute h-auto max-w-none " +
                    (open ? "" : "motion-safe:animate-wheel-spin")
                  }
                  style={{
                    left: `${(WHEEL_ART.left / WHEEL_ART.w) * 100}%`,
                    top: `${(WHEEL_ART.top / WHEEL_ART.h) * 100}%`,
                    width: `${(WHEEL_ART.size / WHEEL_ART.w) * 100}%`,
                  }}
                />
              </span>
            </span>
          </span>
        </motion.button>
      </div>
    </div>
  );
}

/**
 * The contraption art (760 × 1499) and where the spokes image (504 ×
 * 504, centred on the hub at 546, 482) sits in it.
 */
const WHEEL_ART = { w: 760, h: 1499, size: 504, left: 294.1, top: 229.8 };

/** How long today's door has to be held before it gives. */
const HOLD_MS = 1200;

const BURST = [
  COLORS.salmon,
  COLORS.green,
  COLORS.yellow,
  COLORS.white,
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
  raffle,
  countdown,
}: {
  day: WorkflowDay;
  unlocked: boolean;
  canPop: boolean;
  staggerIndex: number;
  needsHold: boolean;
  onOpened: () => void;
  /** Set on the door whose raffle is open today. */
  raffle: { entered: boolean } | null;
  countdown: string | null;
}) {
  const reduceMotion = useReducedMotion();
  const face = DOOR_FACES[(day.day - 1) % DOOR_FACES.length];
  const art = DOOR_ART[day.day - 1];
  const [open, setOpen] = useState(false);
  const [rattle, setRattle] = useState(0);
  // Doors already unlocked when the grid first comes into view open in a
  // stagger; one that unlocks later (live, at midnight) opens straight
  // away. Recorded once, idempotently, so StrictMode's double effect run
  // doesn't flip it.
  const unlockedWhenSeen = useRef<boolean | null>(null);
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

  // Holding today's door creaks it open a little, as a preview.
  const creak = needsHold ? hold * 24 : 0;

  const opensOn = unlockLabel(day.day);

  return (
    <div className="relative h-full">
      {/* Behind the door. Only exists once the day has unlocked. In
          normal flow, so a long lesson makes its door (and its row)
          taller instead of being clipped; the shutter covers it. */}
      <div
        className="relative h-full min-h-[580px] overflow-hidden rounded-[20px] border-[#020202] bg-white text-[#020202]"
        style={DOOR_BORDER}
      >
        {unlocked && (
          // Out of the tab order and hidden from screen readers until
          // the shutter rolls up, but still taking up its space.
          <div
            className="flex h-full flex-col gap-3 p-5"
            inert={!open}
            aria-hidden={!open}
          >
            <p className="font-v1Label text-[13px]">
              Lesson {day.day} · {day.primitive}
            </p>
            {/* Lesson video, or its slot until it's cut. */}
            {day.video ? (
              <video
                src={day.video}
                controls
                playsInline
                preload="metadata"
                className="aspect-video w-full rounded-md border-2 border-[#020202] bg-[#020202]"
              />
            ) : (
              <div
                role="img"
                aria-label={`Lesson ${day.day} video coming soon`}
                className="flex aspect-video w-full items-center justify-center rounded-md border-2 border-dashed border-[#020202] text-center font-v1Label text-[12px]"
                style={{ backgroundColor: COLORS.white }}
              >
                ▶ Lesson video coming
              </div>
            )}
            <h3 className="font-sans text-[22px] font-black leading-[1.05] tracking-[-0.01em]">
              {day.title}
            </h3>
            <p className="text-[14px] leading-[20px] text-[#020202]/75">
              {day.body}
            </p>
            <div className="relative shrink-0">
              <pre className="overflow-x-auto rounded-md bg-[#020202] p-3 pr-16 font-v1Mono text-[12px] leading-[18px] text-[#0BDD48]">
                <code>{day.code}</code>
              </pre>
              <CopyButton
                text={day.code}
                label={`Copy the Day ${day.day} code`}
              />
            </div>
            {/* One way on per door: the docs, plus today's raffle until
                this visitor is in. Getting started with Inngest lives
                once, above the grid. */}
            <div className="mt-auto flex flex-col items-start gap-3 pt-1">
              {raffle && !raffle.entered && (
                <button
                  type="button"
                  onClick={() => openRaffle(day.day)}
                  className={buttonClass("ink", "sm") + " shrink-0"}
                >
                  {RAFFLE.enter} →
                </button>
              )}
              <Link
                href={day.docs.href}
                className="inline-flex items-center gap-2 font-v1Label text-[13px] underline-offset-4 hover:underline"
              >
                {day.docs.label} docs <span aria-hidden="true">→</span>
              </Link>
              <a
                href={COURSE_REPO.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-v1Label text-[13px] underline-offset-4 hover:underline"
              >
                {COURSE_REPO.doorLabel} <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Confetti puff the moment the shutter goes up. */}
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
                className="absolute block h-3 w-3 rounded-full border border-[#020202]"
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

      {/* The door, hinged on its left edge. Clipped to its own tile, so
          swinging open reveals the day behind it without covering the
          doors next to it. */}
      <div
        className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-[20px]"
        style={{ perspective: 1400 }}
      >
        <motion.button
          type="button"
          aria-label={
            needsHold
              ? `Day ${day.day} is ready. Press and hold to open.`
              : unlocked
              ? `Day ${day.day}: ${day.title}`
              : `Day ${day.day}, ${day.primitive}, opens ${opensOn} at midnight Eastern`
          }
          aria-disabled={!open && !needsHold}
          tabIndex={open ? -1 : 0}
          onClick={() => {
            if (!open && !needsHold) setRattle((n) => n + 1);
          }}
          onPointerLeave={stopHold}
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
          className="absolute inset-0 rounded-[20px] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-[-7px] focus-visible:outline-[#F7DA10]"
          style={{
            pointerEvents: open ? "none" : "auto",
            touchAction: needsHold ? "none" : undefined,
            WebkitUserSelect: "none",
            userSelect: "none",
            transformOrigin: "left center",
          }}
          initial={false}
          animate={
            open
              ? reduceMotion
                ? { opacity: 0 }
                : { rotateY: -92, opacity: 0 }
              : { rotateY: reduceMotion ? 0 : -creak, opacity: 1 }
          }
          transition={
            reduceMotion
              ? { duration: 0.2 }
              : hold > 0
              ? { duration: 0 }
              : open
              ? {
                  rotateY: { duration: 0.7, ease: [0.65, 0, 0.35, 1] },
                  opacity: { duration: 0.2, delay: 0.5 },
                }
              : { duration: 0.25 }
          }
        >
          {/* Front face, after Savannah's door design: day and number,
              lock state, the illustration breaking out of its window,
              the teaser, the date and a pull handle. */}
          <motion.span
            key={rattle}
            className="absolute inset-0 flex flex-col items-stretch gap-6 overflow-hidden rounded-[20px] border-[#020202] p-5 text-left text-[#020202]"
            style={{
              ...DOOR_BORDER,
              backgroundColor: face.bg,
            }}
            // A locked door rattles in its frame when tapped.
            animate={
              rattle && !reduceMotion ? { x: [0, -5, 4, -2, 0] } : undefined
            }
            transition={{ duration: 0.4 }}
          >
            {/* Today's door glows until it's opened. */}
            {needsHold && !reduceMotion && (
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-10 rounded-[16px] border-[6px]"
                style={{ borderColor: "#FFFFFF" }}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              />
            )}
            {/* Day and lock state across the top, then the number with
                the lesson's concept beside it. */}
            <span className="flex flex-col">
              <span className="flex items-start justify-between">
                <span className={DOOR_LABEL}>Day</span>
                <span className={`${DOOR_LABEL} flex items-center gap-[7px]`}>
                  <LockIcon open={unlocked} />
                  {needsHold ? "Today" : unlocked ? "Open" : "Locked"}
                </span>
              </span>
              <span className="-mt-2.5 flex items-center gap-4">
                <span
                  className="shrink-0 font-sans text-[100px] font-black leading-none tracking-[-1px]"
                  style={{ color: face.num }}
                >
                  {day.day}
                </span>
                <span className="mt-2 min-w-0 font-sans text-[22px] font-black leading-[1.05] tracking-[-0.01em]">
                  {day.primitive}
                </span>
              </span>
            </span>

            {/* The window. The art is positioned as in the design, in
                percentages of the window, and spills over its edges. */}
            <span
              className="relative block aspect-[295.5/208] w-full shrink-0 rounded-[30px] border-[#020202] bg-white"
              style={DOOR_BORDER}
            >
              <img
                src={`/assets/v1/12-days/doors/day-${day.day}.svg`}
                alt=""
                aria-hidden="true"
                draggable={false}
                className="pointer-events-none absolute max-w-none select-none"
                style={{
                  left: `${(art.x / ART_WINDOW.w) * 100}%`,
                  top: `${(art.y / ART_WINDOW.h) * 100}%`,
                  width: `${(art.w / ART_WINDOW.w) * 100}%`,
                }}
              />
            </span>

            <span className="text-[16px] leading-[1.3]">{day.teaser}</span>

            <span className={DOOR_LABEL}>
              {needsHold
                ? hold > 0
                  ? "Keep holding…"
                  : "Press and hold to open"
                : countdown
                ? `Opens in ${countdown}`
                : unlocked
                ? "Opening…"
                : `Opens ${opensOn}`}
            </span>

            {/* Pull handle. On today's door it fills while held. */}
            <span
              aria-hidden="true"
              className="relative mx-auto mt-auto block h-[15px] w-[100px] shrink-0 overflow-hidden rounded-full border-2 border-[#020202]"
              style={{ backgroundColor: HANDLE }}
            >
              {needsHold && (
                <span
                  className="absolute inset-y-0 left-0 block"
                  style={{
                    width: `${hold * 100}%`,
                    backgroundColor: "#FFFFFF",
                  }}
                />
              )}
            </span>
          </motion.span>
        </motion.button>
      </div>
    </div>
  );
}

/** The design's border: hairline top and left, a thick "shadow" edge. */
const DOOR_BORDER = {
  borderTopWidth: 1.5,
  borderLeftWidth: 1.5,
  borderRightWidth: 7,
  borderBottomWidth: 7,
  borderStyle: "solid",
} as const;

/** Small spaced-out labels: "Day", "Locked", "Opens December 11". */
const DOOR_LABEL =
  "font-sans text-[15px] font-normal uppercase leading-[1.5] tracking-[2.25px]";

const HANDLE = "#F7DA10";

/** The window's size in the design, which the art positions are in. */
const ART_WINDOW = { w: 295.5, h: 208 };

/** The design's lock-fill and lock-unlock-line icons. */
function LockIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      width="20"
      height="20"
      fill="currentColor"
    >
      <path
        d={
          open
            ? "M6.25 8.5H16C16.1989 8.5 16.3897 8.57902 16.5303 8.71967C16.671 8.86032 16.75 9.05109 16.75 9.25V16.75C16.75 16.9489 16.671 17.1397 16.5303 17.2803C16.3897 17.421 16.1989 17.5 16 17.5H4C3.80109 17.5 3.61032 17.421 3.46967 17.2803C3.32902 17.1397 3.25 16.9489 3.25 16.75V9.25C3.25 9.05109 3.32902 8.86032 3.46967 8.71967C3.61032 8.57902 3.80109 8.5 4 8.5H4.75V7.75C4.74957 6.56703 5.14869 5.41858 5.88264 4.49083C6.6166 3.56307 7.64238 2.91038 8.7937 2.63857C9.94502 2.36676 11.1544 2.49175 12.2258 2.99328C13.2972 3.49482 14.1678 4.3435 14.6965 5.40175L13.3548 6.07225C12.9771 5.31626 12.3552 4.70998 11.5899 4.35171C10.8245 3.99344 9.9606 3.90417 9.13816 4.09838C8.31572 4.2926 7.583 4.7589 7.05877 5.42171C6.53454 6.08451 6.24955 6.90494 6.25 7.75V8.5ZM4.75 10V16H15.25V10H4.75ZM8.5 12.25H11.5V13.75H8.5V12.25Z"
            : "M15.25 8.5H16C16.1989 8.5 16.3897 8.57902 16.5303 8.71967C16.671 8.86032 16.75 9.05109 16.75 9.25V16.75C16.75 16.9489 16.671 17.1397 16.5303 17.2803C16.3897 17.421 16.1989 17.5 16 17.5H4C3.80109 17.5 3.61032 17.421 3.46967 17.2803C3.32902 17.1397 3.25 16.9489 3.25 16.75V9.25C3.25 9.05109 3.32902 8.86032 3.46967 8.71967C3.61032 8.57902 3.80109 8.5 4 8.5H4.75V7.75C4.75 7.06056 4.8858 6.37787 5.14963 5.74091C5.41347 5.10395 5.80018 4.5252 6.28769 4.03769C6.7752 3.55018 7.35395 3.16347 7.99091 2.89963C8.62787 2.6358 9.31056 2.5 10 2.5C10.6894 2.5 11.3721 2.6358 12.0091 2.89963C12.646 3.16347 13.2248 3.55018 13.7123 4.03769C14.1998 4.5252 14.5865 5.10395 14.8504 5.74091C15.1142 6.37787 15.25 7.06056 15.25 7.75V8.5ZM13.75 8.5V7.75C13.75 6.75544 13.3549 5.80161 12.6517 5.09835C11.9484 4.39509 10.9946 4 10 4C9.00544 4 8.05161 4.39509 7.34835 5.09835C6.64509 5.80161 6.25 6.75544 6.25 7.75V8.5H13.75ZM9.25 11.5V14.5H10.75V11.5H9.25Z"
        }
      />
    </svg>
  );
}

/** Copies a door's code sample; says "Copied" for two seconds. */
function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(id);
  }, [copied]);

  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => {
        copyText(text).then((ok) => ok && setCopied(true));
      }}
      className="absolute right-2 top-2 rounded border border-[#0BDD48]/60 bg-[#020202] px-2 py-0.5 font-v1Label text-[11px] text-[#0BDD48] hover:bg-[#0BDD48] hover:text-[#020202] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F7DA10]"
    >
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}
