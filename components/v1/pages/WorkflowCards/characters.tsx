/**
 * The runners a face can go on. All of them are the campaign's own art,
 * pulled in by scripts/generate-workflow-card-art.mjs:
 *
 *   pizza — NYC's running slice (step.run/nyc)
 *   cup   — SF's running coffee cup (step.run/sf)
 *   logo  — the running Inngest logo (step.run)
 *   rat   — Savannah's running rat from the 12 Days art
 *
 * Positions are in card pixels (1200×630). Face circles are fractions of
 * the runner's own width/height, so they stay put if `width` changes.
 */

import { RUNNER_ART } from "./art.generated";

export const CHARACTER_IDS = ["pizza", "cup", "logo", "rat"] as const;
export type CharacterId = typeof CHARACTER_IDS[number];

export type Character = {
  id: CharacterId;
  /** Shown in the page's picker. */
  label: string;
  blurb: string;
  art: { src: string; width: number; height: number };
  /** Where the runner sits on the card. */
  left: number;
  top: number;
  width: number;
  /** One or more face holes, as fractions of the runner's box; r is a
   *  fraction of its width. */
  faces: { x: number; y: number; r: number }[];
  /** Draw behind the tongue instead of on top of it. */
  behindTongue?: boolean;
};

export const CHARACTERS: Record<CharacterId, Character> = {
  pizza: {
    id: "pizza",
    label: "The NYC pizza",
    blurb: "Your face, melted into the cheese.",
    art: RUNNER_ART.pizza,
    left: 760,
    top: 122,
    width: 400,
    faces: [{ x: 0.47, y: 0.33, r: 0.15 }],
  },
  cup: {
    id: "cup",
    label: "The SF coffee cup",
    blurb: "You are the cup now.",
    art: RUNNER_ART.cup,
    left: 810,
    top: 86,
    width: 330,
    faces: [{ x: 0.41, y: 0.45, r: 0.17 }],
  },
  logo: {
    id: "logo",
    label: "The running Inngest logo",
    blurb: "Two loops. Two of you.",
    art: RUNNER_ART.logo,
    left: 810,
    top: 84,
    width: 330,
    faces: [
      { x: 0.37, y: 0.28, r: 0.12 },
      { x: 0.68, y: 0.25, r: 0.12 },
    ],
  },
  rat: {
    id: "rat",
    label: "The rat (human head)",
    blurb: "Savannah's rat. Your head. No notes.",
    art: RUNNER_ART.rat,
    left: 520,
    top: 214,
    width: 680,
    faces: [{ x: 0.9, y: 0.56, r: 0.085 }],
    behindTongue: true,
  },
};
