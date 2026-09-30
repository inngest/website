/**
 * Marble colors. A hue always means a state, matching the simulator:
 * purple waits for a slot, honey for throttle capacity, blush collects,
 * blue executes, red was skipped or cancelled.
 */
export interface Look {
  fill: string;
  text: string;
  stroke?: string;
  dash?: string;
}

export const LOOK = {
  event: {
    fill: "fill-carbon-800 dark:fill-carbon-100",
    text: "fill-white dark:fill-carbon-1000",
  },
  concurrency: {
    fill: "fill-purplehaze-300 dark:fill-purplehaze-500",
    text: "fill-purplehaze-900 dark:fill-white",
  },
  throttle: {
    fill: "fill-honey-300 dark:fill-honey-500",
    text: "fill-honey-900 dark:fill-carbon-1000",
  },
  backlog: {
    fill: "fill-carbon-300 dark:fill-carbon-600",
    text: "fill-carbon-900 dark:fill-carbon-100",
  },
  collect: {
    fill: "fill-blush-100 dark:fill-blush-500/30",
    stroke: "stroke-blush-400",
    dash: "2.5 2",
    text: "fill-blush-900 dark:fill-blush-100",
  },
  run: {
    fill: "fill-breeze-500 dark:fill-breeze-400",
    text: "fill-white dark:fill-carbon-1000",
  },
  skipped: {
    fill: "fill-white dark:fill-carbon-1000",
    stroke: "stroke-ruby-500 dark:stroke-ruby-400",
    text: "fill-ruby-600 dark:fill-ruby-400",
  },
  replaced: {
    fill: "fill-white dark:fill-carbon-1000",
    stroke: "stroke-carbon-400 dark:stroke-carbon-500",
    text: "fill-carbon-500 dark:fill-carbon-400",
  },
} satisfies Record<string, Look>;

export type LookKey = keyof typeof LOOK;

export const LINE = "stroke-carbon-300 dark:stroke-carbon-600";
export const LANE_LINE = "stroke-carbon-200 dark:stroke-carbon-700";
export const GUTTER_TEXT = "fill-carbon-600 dark:fill-carbon-300";
export const MUTED_TEXT = "fill-carbon-500 dark:fill-carbon-400";
export const SLEEP =
  "fill-white stroke-carbon-400 dark:fill-carbon-1000 dark:stroke-carbon-500";
export const METER_FILL = {
  slots: "fill-breeze-500 dark:fill-breeze-400",
  throttle: "fill-carbon-700 dark:fill-carbon-200",
  rateLimit: "fill-carbon-700 dark:fill-carbon-200",
  batch: "fill-blush-400",
} as const;
