"use client";

import { useSyncExternalStore } from "react";

/**
 * Cross-tree signal so the fixed `Header` can adapt its nav-hover paint
 * to whatever hero sits beneath it, without hardcoding pathnames.
 *
 * The problem: landing-page heroes (SplitHero) paint a coloured panel
 * across the left 2/3 and a dark panel on the right 1/3. The transparent
 * (non-compact) header overlaps both — primary nav over the colour,
 * secondary items over the dark. Over the *salmon* panel a salmon hover
 * wipe is invisible, so the header swaps the primary wipe to dark there.
 * (Blue panels read fine with the salmon wipe, so the header leaves them
 * alone — it only needs to know the panel colour, not act on every one.)
 *
 * Header and hero live in different React trees (header in the layout,
 * hero in the page), so the hero publishes its panel colour here and the
 * header subscribes. `null` = no coloured-panel hero (the default dark
 * backdrop), so the header keeps its salmon wipe.
 *
 * Ownership: a hero claims the slot on mount with an opaque token and
 * releases it on unmount. Release is a no-op unless the caller still owns
 * the slot, so when navigating between two SplitHero pages the outgoing
 * hero's late cleanup can't clobber the value the incoming hero already
 * set (effect teardown/setup ordering across route commits isn't
 * guaranteed).
 */
export type HeroPanel = "salmon" | "blue" | null;

let current: HeroPanel = null;
let owner: object | null = null;
const subscribers = new Set<() => void>();

function emit() {
  subscribers.forEach((notify) => notify());
}

export function setHeroPanel(panel: HeroPanel, token: object): void {
  owner = token;
  if (panel !== current) {
    current = panel;
    emit();
  }
}

export function clearHeroPanel(token: object): void {
  if (owner !== token) return; // a newer hero already took over
  owner = null;
  if (current !== null) {
    current = null;
    emit();
  }
}

export function useHeroPanel(): HeroPanel {
  return useSyncExternalStore(
    (notify) => {
      subscribers.add(notify);
      return () => subscribers.delete(notify);
    },
    () => current,
    () => null, // SSR: assume no coloured panel; the hero's mount effect corrects it
  );
}
