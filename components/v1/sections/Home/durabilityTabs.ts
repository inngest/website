/**
 * Shared tab identity for the "Durability belongs in code" experience.
 *
 * The three feature cards (FeatureCards) act as a tablist that drives the
 * content rendered in the ScaleInstantly panel below them. Both components
 * key off these ids, so they live here to keep the two in sync.
 */
export const DURABILITY_TAB_IDS = [
  "retries",
  "flow-control",
  "observability",
] as const;

export type DurabilityTabId = (typeof DURABILITY_TAB_IDS)[number];

export const DEFAULT_DURABILITY_TAB: DurabilityTabId = "retries";

/** DOM id of the tab button for a given tab — used to wire `aria-controls`
 *  on the tabs and `aria-labelledby` on the panel. */
export const durabilityTabButtonId = (id: DurabilityTabId) =>
  `durability-tab-${id}`;

/** DOM id of the single tabpanel (the ScaleInstantly section). */
export const DURABILITY_PANEL_ID = "durability-panel";
