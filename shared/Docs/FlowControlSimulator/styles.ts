import type { WaitReason } from "./engine";

/**
 * State colors. Waiting states are light tints, executing is solid, sleeping
 * is hollow. Tenants are identified by letter chips, not color, so a hue
 * always means a state.
 */
export const FILL = {
  run: "fill-breeze-500 dark:fill-breeze-400",
  concurrency: "fill-purplehaze-300 dark:fill-purplehaze-500/60",
  throttle: "fill-honey-200 dark:fill-honey-400/50",
  backlog: "fill-carbon-100 dark:fill-carbon-700",
  collect: "fill-blush-100 dark:fill-blush-500/20",
  done: "fill-matcha-500",
  stop: "fill-ruby-500",
} as const;

export const STROKE = {
  sleep: "stroke-carbon-400 dark:stroke-carbon-500",
  collect: "stroke-blush-400 dark:stroke-blush-400",
  cancel: "stroke-ruby-500 dark:stroke-ruby-400",
  hatch: "stroke-honey-400 dark:stroke-honey-300/70",
  done: "stroke-matcha-500 dark:stroke-matcha-400",
} as const;

export const CHIP = {
  run: "bg-breeze-500 text-white dark:bg-breeze-400 dark:text-carbon-1000",
  sleep:
    "border border-dashed border-carbon-400 text-subtle dark:border-carbon-500",
  concurrency:
    "bg-purplehaze-200 text-purplehaze-900 dark:bg-purplehaze-500/50 dark:text-purplehaze-0",
  throttle:
    "bg-honey-200 text-honey-900 dark:bg-honey-400/50 dark:text-honey-0",
  backlog:
    "bg-carbon-100 text-carbon-700 dark:bg-carbon-700 dark:text-carbon-100",
  collect:
    "border border-dashed border-blush-400 bg-blush-100 text-blush-900 dark:bg-blush-500/20 dark:text-blush-100",
  done: "bg-matcha-100 text-matcha-800 dark:bg-matcha-500/25 dark:text-matcha-100",
  stop: "bg-ruby-100 text-ruby-800 dark:bg-ruby-500/25 dark:text-ruby-100",
} as const;

export const SWATCH = {
  run: "bg-breeze-500 dark:bg-breeze-400",
  concurrency: "bg-purplehaze-300 dark:bg-purplehaze-500/60",
  throttle: "bg-honey-200 dark:bg-honey-400/50",
  backlog: "bg-carbon-100 dark:bg-carbon-700",
  collect:
    "border border-dashed border-blush-400 bg-blush-100 dark:bg-blush-500/20",
  sleep: "border border-dashed border-carbon-400 dark:border-carbon-500",
} as const;

export const waitFill = (r: WaitReason) => FILL[r];
export const waitChip = (r: WaitReason) => CHIP[r];
