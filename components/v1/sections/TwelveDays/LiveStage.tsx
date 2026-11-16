"use client";

import { useReducedMotion } from "motion/react";
import { COLORS, LIVESTREAM } from "@/components/v1/sections/TwelveDays/data";
import { useCalendarClock } from "@/components/v1/sections/TwelveDays/useCalendarClock";

/** How long before the start the player replaces the countdown. */
const PLAYER_LEAD_MS = 15 * 60_000;

const INK = COLORS.ink;

/** Days, hours and minutes left, rounded up to the next minute. */
function remaining(ms: number) {
  const totalMinutes = Math.max(0, Math.ceil(ms / 60_000));
  return {
    day: Math.floor(totalMinutes / 1440),
    hour: Math.floor((totalMinutes % 1440) / 60),
    minute: totalMinutes % 60,
  };
}

/** A gear's outline: `teeth` square teeth around a circle. */
function gearPath(cx: number, cy: number, r: number, teeth: number): string {
  const depth = r * 0.22;
  const step = (Math.PI * 2) / (teeth * 2);
  const points: string[] = [];
  for (let i = 0; i < teeth * 2; i++) {
    const outer = i % 2 === 0;
    const rad = outer ? r + depth : r;
    for (const k of [-0.5, 0.5]) {
      const a = (i + k) * step;
      points.push(`${cx + rad * Math.cos(a)},${cy + rad * Math.sin(a)}`);
    }
  }
  return `M${points.join("L")}Z`;
}

/** The ball's run: down three ramps and into the funnel. */
const BALL_PATH =
  "M110 128 L470 214 L470 262 L150 352 L150 398 L520 492 L560 540 L600 610";

function Gear({
  cx,
  cy,
  r,
  teeth,
  fill,
  direction,
  seconds,
  animate,
}: {
  cx: number;
  cy: number;
  r: number;
  teeth: number;
  fill: string;
  direction: 1 | -1;
  seconds: number;
  animate: boolean;
}) {
  return (
    <g>
      <path
        d={gearPath(cx, cy, r, teeth)}
        fill={fill}
        stroke={INK}
        strokeWidth={6}
        strokeLinejoin="round"
      />
      <circle
        cx={cx}
        cy={cy}
        r={r * 0.32}
        fill="#FFFFFF"
        stroke={INK}
        strokeWidth={6}
      />
      <circle cx={cx} cy={cy} r={r * 0.09} fill={INK} />
      {animate && (
        <animateTransform
          attributeName="transform"
          type="rotate"
          from={`0 ${cx} ${cy}`}
          to={`${360 * direction} ${cx} ${cy}`}
          dur={`${seconds}s`}
          repeatCount="indefinite"
        />
      )}
    </g>
  );
}

/**
 * Door illustrations placed around the machine, in viewBox units. A
 * `hang` prop dangles on a string from the beam above it and swings.
 */
const PROPS: {
  day: number;
  x: number;
  y: number;
  w: number;
  h: number;
  hang?: number;
}[] = [
  // Sticky note pinned to the wall above the ramps.
  { day: 4, x: 214, y: 0, w: 220, h: 157 },
  // Pizza ornament swinging off the end of the beam.
  { day: 9, x: 1416, y: 104, w: 168, h: 189, hang: 62 },
  // Candle on its pedestal under the ramps.
  { day: 10, x: 290, y: 560, w: 170, h: 255 },
  // Mittens drying by the first post.
  { day: 12, x: -6, y: 612, w: 204, h: 200 },
  // Deodorant next to the funnel, and Clippy riding the pipe.
  { day: 2, x: 676, y: 630, w: 190, h: 180 },
  { day: 3, x: 1016, y: 598, w: 222, h: 211 },
];

function Prop({
  day,
  x,
  y,
  w,
  h,
  hang,
  animate,
}: typeof PROPS[number] & { animate: boolean }) {
  const cx = x + w / 2;
  const image = (
    <image
      href={`/assets/v1/12-days/doors/day-${day}.svg`}
      x={x}
      y={y}
      width={w}
      height={h}
      preserveAspectRatio="xMidYMid meet"
    />
  );
  if (hang === undefined) return image;
  return (
    <g>
      <line
        x1={cx}
        y1={hang}
        x2={cx}
        y2={y + 14}
        stroke={INK}
        strokeWidth={4}
      />
      {image}
      {animate && (
        <animateTransform
          attributeName="transform"
          type="rotate"
          values={`-6 ${cx} ${hang};6 ${cx} ${hang};-6 ${cx} ${hang}`}
          dur="3.2s"
          repeatCount="indefinite"
        />
      )}
    </g>
  );
}

/**
 * The machine around the sign: a ball rolls down the ramps into a
 * funnel, the pipe turns the gears, and the gears wind the rope that
 * holds the sign up. Decorative only; still for reduced motion.
 */
function Contraption({ animate }: { animate: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1600 900"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Savannah's door art, worked into the machine. */}
      <rect
        x={276}
        y={812}
        width={198}
        height={100}
        rx={10}
        fill={COLORS.green}
        stroke={INK}
        strokeWidth={6}
      />
      {PROPS.map((prop) => (
        <Prop key={prop.day} {...prop} animate={animate} />
      ))}

      {/* Ceiling beam and the pulleys the sign hangs from. */}
      <rect x={560} y={36} width={980} height={26} rx={8} fill={INK} />
      {[700, 1200].map((x) => (
        <g key={x}>
          <line x1={x} y1={62} x2={x} y2={150} stroke={INK} strokeWidth={6} />
          <circle
            cx={x}
            cy={88}
            r={18}
            fill={COLORS.lime}
            stroke={INK}
            strokeWidth={6}
          />
        </g>
      ))}
      {/* The rope from the right pulley down to the big gear's axle. */}
      <path
        d="M1218 88 C1300 88 1320 200 1380 610"
        fill="none"
        stroke={INK}
        strokeWidth={6}
        strokeDasharray="18 10"
      >
        {animate && (
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="-56"
            dur="1.4s"
            repeatCount="indefinite"
          />
        )}
      </path>

      {/* The chute and three ramps. */}
      <path
        d="M40 92 L150 120"
        stroke={INK}
        strokeWidth={14}
        strokeLinecap="round"
      />
      {["M90 156 L480 248", "M490 290 L140 386", "M130 426 L540 528"].map(
        (d) => (
          <path
            key={d}
            d={d}
            stroke={COLORS.green}
            strokeWidth={18}
            strokeLinecap="round"
          />
        )
      )}
      {["M90 156 L480 248", "M490 290 L140 386", "M130 426 L540 528"].map(
        (d) => (
          <path
            key={`${d}-edge`}
            d={d}
            stroke={INK}
            strokeWidth={4}
            strokeLinecap="round"
            transform="translate(0 10)"
          />
        )
      )}
      {/* Ramp posts. */}
      {[
        [480, 248, 290],
        [140, 386, 426],
        [90, 156, 900],
        [540, 528, 900],
      ].map(([x, y1, y2]) => (
        <line
          key={`${x}-${y1}`}
          x1={x}
          y1={y1 + 14}
          x2={x}
          y2={y2}
          stroke={INK}
          strokeWidth={6}
        />
      ))}

      {/* Funnel and the pipe along the floor to the gears. */}
      <path
        d="M548 590 L652 590 L618 650 L582 650 Z"
        fill={COLORS.salmon}
        stroke={INK}
        strokeWidth={6}
        strokeLinejoin="round"
      />
      <path
        d="M600 650 L600 780 Q600 812 632 812 L1300 812"
        fill="none"
        stroke={INK}
        strokeWidth={30}
        strokeLinecap="round"
      />
      <path
        d="M600 650 L600 780 Q600 812 632 812 L1300 812"
        fill="none"
        stroke={COLORS.lime}
        strokeWidth={18}
        strokeLinecap="round"
      />

      {/* Gears, meshing, turning opposite ways. */}
      <Gear
        cx={1380}
        cy={680}
        r={96}
        teeth={12}
        fill={COLORS.lime}
        direction={1}
        seconds={9}
        animate={animate}
      />
      <Gear
        cx={1512}
        cy={540}
        r={58}
        teeth={8}
        fill={COLORS.green}
        direction={-1}
        seconds={5.4}
        animate={animate}
      />

      {/* The ball, rolling down and dropping into the funnel. */}
      <circle
        r={22}
        cx={animate ? 0 : 520}
        cy={animate ? 0 : 492}
        fill={COLORS.lime}
        stroke={INK}
        strokeWidth={6}
      >
        {animate && (
          <animateMotion
            path={BALL_PATH}
            dur="5s"
            repeatCount="indefinite"
            keyPoints="0;1;1"
            keyTimes="0;0.8;1"
            calcMode="linear"
          />
        )}
      </circle>
    </svg>
  );
}

/**
 * What /12-days-of-workflows/live shows. Before the stream: a Rube
 * Goldberg machine holding up a sign with the days, hours and minutes
 * left. From 15 minutes before the start, the YouTube player once
 * `LIVESTREAM.youtubeId` is set; past the start without one, a "going
 * live any second" line. The clock honours `?now=` off production.
 */
export default function LiveStage() {
  const now = useCalendarClock();
  const reduceMotion = useReducedMotion();
  const { live, youtubeId } = LIVESTREAM;
  const start = new Date(LIVESTREAM.start).getTime();
  const left = now ? start - now.getTime() : null;

  if (youtubeId && left !== null && left <= PLAYER_LEAD_MS) {
    return (
      <div className="overflow-hidden rounded-xl border-[3px] border-[#010101] bg-[#010101] shadow-[8px_8px_0_#010101]">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0`}
          title={live.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="aspect-video w-full"
        />
      </div>
    );
  }

  const parts = left !== null ? remaining(left) : null;
  const copy = live.countdown;

  return (
    <div
      className="relative overflow-hidden rounded-xl border-[3px] border-[#010101] text-[#010101] shadow-[8px_8px_0_#010101] sm:aspect-video"
      style={{ backgroundColor: COLORS.cream }}
    >
      <div className="hidden sm:block">
        <Contraption animate={!reduceMotion} />
      </div>

      {/* The sign, hung from the beam. On phones it stands alone. */}
      <div className="relative flex items-center justify-center p-6 sm:absolute sm:left-[37.5%] sm:top-[16.5%] sm:h-[48%] sm:w-[38.75%] sm:p-0">
        <div
          role="timer"
          aria-live="off"
          className="flex w-full flex-col items-center justify-center gap-3 rounded-[20px] border-[#020202] bg-white px-4 py-6 text-center sm:h-full sm:gap-[clamp(6px,1vw,14px)] sm:py-3"
          style={{
            borderTopWidth: 1.5,
            borderLeftWidth: 1.5,
            borderRightWidth: 7,
            borderBottomWidth: 7,
            borderStyle: "solid",
          }}
        >
          {left !== null && left <= 0 ? (
            <p className="font-sans text-[clamp(20px,2.4vw,30px)] font-black leading-[1.1]">
              {copy.starting}
            </p>
          ) : (
            <>
              <p className="font-v1Label text-[clamp(13px,1.3vw,17px)]">
                {copy.lead}
              </p>
              <div className="flex items-start justify-center gap-[clamp(10px,2vw,28px)]">
                {(["day", "hour", "minute"] as const).map((unit) => {
                  const n = parts ? parts[unit] : null;
                  const [one, many] = copy.units[unit];
                  return (
                    <div key={unit} className="flex flex-col items-center">
                      <span className="font-sans text-[clamp(44px,6vw,84px)] font-black tabular-nums leading-[0.9] tracking-[-0.02em]">
                        {n === null ? "–" : n}
                      </span>
                      <span className="font-v1Label text-[clamp(12px,1.2vw,15px)]">
                        {n === 1 ? one : many}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="font-v1Label text-[clamp(13px,1.3vw,17px)]">
                {copy.tail}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
