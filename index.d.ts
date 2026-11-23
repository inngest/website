export {};

/**
 * The parts of DataGrail Consent's browser API we call. consent.js (loaded
 * through GTM) defines `window.DG_BANNER_API`; it's absent when GTM or the
 * DataGrail tag isn't on the page.
 */
interface DataGrailBannerApi {
  /** Opens a specific banner layer by its Layer ID. */
  showLayer?: (layerId: string) => void;
  /** Opens the banner's first layer based on the visitor's policy. */
  showConsentBanner?: () => void;
}

declare global {
  interface Window {
    DG_BANNER_API?: DataGrailBannerApi;
    Inngest: any;
    _inngestQueue: { [key: string]: any }[];
    dataLayer: any[]; // Google Tag Manager
  }
}

declare module "deterministic-split";
