/**
 * Face-in-hole characters for the card. Each one is drawn in a 600×560
 * box in three layers so a real face can sit between them:
 *
 *   back  — everything behind the face (rat body, pickle)
 *   face  — the sender's photo, clipped to a circle at `face`
 *   front — everything over the face (pizza with a hole in it, ears, hat)
 *
 * These are placeholder drawings. To swap in finished artwork, export
 * back/front PNGs at 600×560 (front with a transparent face hole), put
 * them in /public/assets/12-days/, and set `artwork` on the character —
 * the card route draws them in place of the SVG layers. Keep `face`
 * matching the hole.
 *
 * Rendered by next/og (satori), so: plain SVG shapes only, no text.
 */

import type { ReactElement } from "react";

export const ART_W = 600;
export const ART_H = 560;

export const CHARACTER_IDS = ["rat", "pizza", "pickle"] as const;
export type CharacterId = typeof CHARACTER_IDS[number];

export type Character = {
  id: CharacterId;
  /** Shown in the page's picker. */
  label: string;
  blurb: string;
  /** Face circle, in the 600×560 art box. */
  face: { cx: number; cy: number; r: number };
  back?: () => ReactElement;
  front?: () => ReactElement;
  /** Finished artwork; when set, used instead of back/front. */
  artwork?: { back?: string; front?: string };
};

const svg = (children: ReactElement) => (
  <svg
    width={ART_W}
    height={ART_H}
    viewBox={`0 0 ${ART_W} ${ART_H}`}
    xmlns="http://www.w3.org/2000/svg"
  >
    {children}
  </svg>
);

/** A Santa hat whose brim sits across the top of a face circle. Called
 *  as a function: satori can't expand components nested inside <svg>. */
const santaHat = ({
  cx,
  top,
  width,
  tilt = -12,
}: {
  cx: number;
  top: number;
  width: number;
  tilt?: number;
}) => {
  const h = width * 0.85;
  return (
    <g transform={`rotate(${tilt} ${cx} ${top})`}>
      <path
        d={`M ${cx - width / 2} ${top} Q ${cx - width * 0.15} ${top - h} ${
          cx + width * 0.55
        } ${top - h * 0.7} Q ${cx + width * 0.25} ${top - h * 0.3} ${
          cx + width / 2
        } ${top} Z`}
        fill="#E5322D"
      />
      <circle
        cx={cx + width * 0.58}
        cy={top - h * 0.7}
        r={width * 0.11}
        fill="#FFFFFF"
      />
      <rect
        x={cx - width / 2 - 10}
        y={top - 16}
        width={width + 20}
        height={34}
        rx={17}
        fill="#FFFFFF"
      />
    </g>
  );
};

const RAT_GREY = "#8C8C94";
const RAT_LIGHT = "#BDBDC4";
const RAT_PINK = "#F2A7A7";

const rat: Character = {
  id: "rat",
  label: "Rat with a human head",
  blurb: "Your head. Rat body. No notes.",
  face: { cx: 290, cy: 215, r: 108 },
  back: () =>
    svg(
      <g>
        {/* tail */}
        <path
          d="M 440 470 C 560 520 590 410 520 380 S 470 290 575 250"
          fill="none"
          stroke={RAT_PINK}
          strokeWidth={14}
          strokeLinecap="round"
        />
        {/* ears, behind the head */}
        <circle cx={190} cy={128} r={56} fill={RAT_GREY} />
        <circle cx={190} cy={128} r={34} fill={RAT_PINK} />
        <circle cx={392} cy={128} r={56} fill={RAT_GREY} />
        <circle cx={392} cy={128} r={34} fill={RAT_PINK} />
        {/* body */}
        <ellipse cx={330} cy={410} rx={160} ry={125} fill={RAT_GREY} />
        <ellipse cx={300} cy={430} rx={92} ry={84} fill={RAT_LIGHT} />
        {/* feet */}
        <ellipse cx={235} cy={528} rx={40} ry={15} fill={RAT_PINK} />
        <ellipse cx={375} cy={532} rx={40} ry={15} fill={RAT_PINK} />
      </g>
    ),
  front: () =>
    svg(
      <g>
        {/* little arms clutching a candy cane */}
        <path
          d="M 300 470 L 300 360 Q 300 330 330 330 Q 360 330 360 360"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth={14}
          strokeLinecap="round"
        />
        <path
          d="M 300 470 L 300 360 Q 300 330 330 330 Q 360 330 360 360"
          fill="none"
          stroke="#E5322D"
          strokeWidth={14}
          strokeLinecap="round"
          strokeDasharray="14 14"
        />
        <ellipse cx={268} cy={400} rx={26} ry={18} fill={RAT_PINK} />
        <ellipse cx={330} cy={410} rx={26} ry={18} fill={RAT_PINK} />
        {/* whiskers, straight out of the human cheeks */}
        <g stroke="#2A2A2A" strokeWidth={3} strokeLinecap="round">
          <line x1={215} y1={250} x2={110} y2={226} />
          <line x1={215} y1={262} x2={104} y2={262} />
          <line x1={215} y1={274} x2={112} y2={298} />
          <line x1={365} y1={250} x2={470} y2={226} />
          <line x1={365} y1={262} x2={476} y2={262} />
          <line x1={365} y1={274} x2={468} y2={298} />
        </g>
        {santaHat({ cx: 290, top: 132, width: 200 })}
      </g>
    ),
};

const CRUST = "#C98A3D";
const CHEESE = "#F6C445";
const PEPPERONI = "#C23B2E";

const pizza: Character = {
  id: "pizza",
  label: "Face in the pizza hole",
  blurb: "One slice. One hole. One you.",
  face: { cx: 300, cy: 250, r: 116 },
  front: () =>
    svg(
      <g>
        {/* the slice, with a face-sized hole punched through it */}
        <path
          fillRule="evenodd"
          d={`M 70 100 L 530 100 L 300 545 Z
              M 300 138 A 112 112 0 1 0 300 362 A 112 112 0 1 0 300 138 Z`}
          fill={CHEESE}
        />
        {/* crunchy rim around the hole */}
        <circle
          cx={300}
          cy={250}
          r={112}
          fill="none"
          stroke="#E0A92E"
          strokeWidth={10}
        />
        {/* crust */}
        <rect x={52} y={62} width={496} height={56} rx={28} fill={CRUST} />
        <rect
          x={72}
          y={74}
          width={456}
          height={12}
          rx={6}
          fill="#E3A65C"
          opacity={0.7}
        />
        {/* pepperoni */}
        <circle cx={150} cy={150} r={26} fill={PEPPERONI} />
        <circle cx={455} cy={152} r={24} fill={PEPPERONI} />
        <circle cx={300} cy={440} r={22} fill={PEPPERONI} />
        <circle cx={250} cy={392} r={14} fill={PEPPERONI} />
        <circle cx={352} cy={392} r={14} fill={PEPPERONI} />
      </g>
    ),
};

const PICKLE = "#6FA33E";
const PICKLE_DARK = "#4E7F2A";

const pickle: Character = {
  id: "pickle",
  label: "Face on the pickle butt",
  blurb: "The pickle has a face. You are not it.",
  face: { cx: 468, cy: 290, r: 100 },
  back: () =>
    svg(
      <g>
        {/* legs */}
        <g fill={PICKLE_DARK}>
          <rect x={120} y={360} width={30} height={110} rx={15} />
          <rect x={200} y={380} width={30} height={100} rx={15} />
          <rect x={300} y={380} width={30} height={100} rx={15} />
          <rect x={380} y={360} width={30} height={110} rx={15} />
        </g>
        {/* shoes */}
        <g fill="#2A2A2A">
          <ellipse cx={128} cy={470} rx={26} ry={12} />
          <ellipse cx={208} cy={480} rx={26} ry={12} />
          <ellipse cx={308} cy={480} rx={26} ry={12} />
          <ellipse cx={388} cy={470} rx={26} ry={12} />
        </g>
        {/* body */}
        <rect x={40} y={170} width={520} height={240} rx={120} fill={PICKLE} />
        {/* bumps */}
        <g fill={PICKLE_DARK} opacity={0.8}>
          <circle cx={150} cy={210} r={9} />
          <circle cx={220} cy={360} r={8} />
          <circle cx={280} cy={200} r={10} />
          <circle cx={330} cy={330} r={9} />
          <circle cx={190} cy={290} r={7} />
          <circle cx={370} cy={230} r={8} />
          <circle cx={110} cy={330} r={8} />
        </g>
        {/* the pickle's own face, at the front */}
        <circle cx={100} cy={260} r={9} fill="#1A1A1A" />
        <circle cx={145} cy={258} r={9} fill="#1A1A1A" />
        <path
          d="M 98 300 Q 122 322 148 300"
          fill="none"
          stroke="#1A1A1A"
          strokeWidth={5}
          strokeLinecap="round"
        />
        <circle cx={88} cy={290} r={10} fill="#F2A7A7" opacity={0.7} />
        <circle cx={160} cy={288} r={10} fill="#F2A7A7" opacity={0.7} />
      </g>
    ),
  front: () =>
    svg(
      <g>
        <circle
          cx={468}
          cy={290}
          r={100}
          fill="none"
          stroke={PICKLE_DARK}
          strokeWidth={14}
        />
        {/* a festive bow on the butt */}
        <path
          d="M 468 186 l -46 -26 l 0 52 Z M 468 186 l 46 -26 l 0 52 Z"
          fill="#E5322D"
        />
        <circle cx={468} cy={186} r={12} fill="#B8211C" />
      </g>
    ),
};

export const CHARACTERS: Record<CharacterId, Character> = {
  rat,
  pizza,
  pickle,
};
