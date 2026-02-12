"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ConsentCategories, ConsentState, GeoRegion } from "./consentTypes";
import {
  getInitialConsentState,
  writeConsentCookie,
} from "./consentUtils";
import { loadAnalytics } from "@/utils/segment";
import {
  updateSegmentConsent,
  signalConsentResolved,
} from "@/utils/segmentConsentWrapper";

export type ConsentContextValue = ConsentState & {
  acceptAll: () => void;
  rejectAll: () => void;
  updateCategories: (categories: ConsentCategories) => void;
  openPreferences: () => void;
  isPreferencesOpen: boolean;
  setPreferencesOpen: (open: boolean) => void;
};

export const ConsentContext = createContext<ConsentContextValue | null>(null);

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

function pushConsentUpdate(categories: ConsentCategories) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("consent", "update", {
    analytics_storage: categories.analytics ? "granted" : "denied",
    ad_storage: categories.marketing ? "granted" : "denied",
    ad_user_data: categories.marketing ? "granted" : "denied",
    ad_personalization: categories.marketing ? "granted" : "denied",
  });
}

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ConsentState>(() => ({
    hasConsented: false,
    region: "eu",
    categories: { necessary: true, analytics: false, marketing: false },
    consentedAt: null,
  }));
  const [isPreferencesOpen, setPreferencesOpen] = useState(false);
  const initialized = useRef(false);
  const analyticsLoaded = useRef(false);

  // Initialize on mount (client-side only)
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const initial = getInitialConsentState();
    setState(initial);

    // Inform the Segment wrapper of the initial consent state
    updateSegmentConsent(
      initial.categories,
      initial.region,
      initial.hasConsented
    );

    // Load Segment analytics (the wrapper controls when it actually activates)
    if (!analyticsLoaded.current) {
      analyticsLoaded.current = true;
      loadAnalytics();
    }

    // Initialize services based on existing consent
    if (initial.categories.analytics) {
      pushConsentUpdate(initial.categories);
    }
    if (initial.categories.marketing) {
      initFullStory();
    }
  }, []);

  const applyConsent = useCallback(
    (categories: ConsentCategories, region: GeoRegion) => {
      const newState: ConsentState = {
        hasConsented: true,
        region,
        categories,
        consentedAt: new Date().toISOString(),
      };
      setState(newState);
      writeConsentCookie(region, categories);

      // Notify Segment wrapper and signal consent resolved for EU
      updateSegmentConsent(categories, region, true);
      signalConsentResolved();

      // Push GTM consent update
      pushConsentUpdate(categories);

      // Handle FullStory
      if (categories.marketing) {
        initFullStory();
      } else {
        shutdownFullStory();
      }
    },
    []
  );

  const acceptAll = useCallback(() => {
    applyConsent(
      { necessary: true, analytics: true, marketing: true },
      state.region
    );
  }, [applyConsent, state.region]);

  const rejectAll = useCallback(() => {
    applyConsent(
      { necessary: true, analytics: false, marketing: false },
      state.region
    );
  }, [applyConsent, state.region]);

  const updateCategories = useCallback(
    (categories: ConsentCategories) => {
      applyConsent({ ...categories, necessary: true }, state.region);
    },
    [applyConsent, state.region]
  );

  const openPreferences = useCallback(() => {
    setPreferencesOpen(true);
  }, []);

  const value = useMemo<ConsentContextValue>(
    () => ({
      ...state,
      acceptAll,
      rejectAll,
      updateCategories,
      openPreferences,
      isPreferencesOpen,
      setPreferencesOpen,
    }),
    [
      state,
      acceptAll,
      rejectAll,
      updateCategories,
      openPreferences,
      isPreferencesOpen,
    ]
  );

  return (
    <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
  );
}

let fullStoryInitialized = false;

function initFullStory() {
  if (fullStoryInitialized || typeof window === "undefined") return;
  import("@fullstory/browser").then((fullstory) => {
    fullstory.init({ orgId: "o-1CVB8R-na1" });
    fullStoryInitialized = true;
  });
}

function shutdownFullStory() {
  if (!fullStoryInitialized || typeof window === "undefined") return;
  import("@fullstory/browser").then((fullstory) => {
    fullstory.shutdown();
    fullStoryInitialized = false;
  });
}
