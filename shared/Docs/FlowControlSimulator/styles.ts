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
