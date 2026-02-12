import { createWrapper } from "@segment/analytics-consent-tools";
import type { ConsentCategories, GeoRegion } from "@/components/consent/consentTypes";

type Categories = Record<string, boolean>;
type ConsentChangedCallback = (categories: Categories) => void;

// Holds the callback for notifying Segment of consent changes
let onConsentChangedCallback: ConsentChangedCallback | null = null;

// Holds current consent state, updated by ConsentContext
let currentCategories: ConsentCategories = {
  necessary: true,
  analytics: false,
  marketing: false,
};
let currentRegion: GeoRegion = "eu";

// Resolve function to signal that consent has been resolved (user made a choice or defaults apply)
let resolveConsentReady: (() => void) | null = null;
const consentReadyPromise = new Promise<void>((resolve) => {
  resolveConsentReady = resolve;
});

/**
 * Called by ConsentContext when consent state is initialized or changes.
 */
export function updateSegmentConsent(
  categories: ConsentCategories,
  region: GeoRegion,
  hasConsented: boolean
) {
  currentCategories = categories;
  currentRegion = region;

  // Signal that consent state is ready (either user previously consented or defaults apply)
  if (hasConsented || region !== "eu") {
    resolveConsentReady?.();
    resolveConsentReady = null;
  }

  // Notify Segment of the change
  if (onConsentChangedCallback) {
    onConsentChangedCallback(mapCategories(categories));
  }
}

/**
 * Called by ConsentContext when user explicitly makes a consent choice.
 * This resolves the consent-ready promise for EU users.
 */
export function signalConsentResolved() {
  resolveConsentReady?.();
  resolveConsentReady = null;
}

function mapCategories(categories: ConsentCategories): Categories {
  return {
    Analytics: categories.analytics,
    Marketing: categories.marketing,
  };
}

export const segmentConsentWrapper = createWrapper({
  shouldLoadSegment: async (ctx) => {
    // Wait until consent is determined
    await consentReadyPromise;

    const consentModel = currentRegion === "eu" ? "opt-in" : "opt-out";
    ctx.load({ consentModel });
  },

  getCategories: () => {
    return mapCategories(currentCategories);
  },

  registerOnConsentChanged: (categoriesChangedCb) => {
    onConsentChangedCallback = categoriesChangedCb;
  },
});
