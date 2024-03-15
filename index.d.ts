export {};

declare global {
  interface Window {
    Inngest: any;
    _inngestQueue: { [key: string]: any }[];
    dataLayer: any[]; // Google Tag Manager
  }
}

declare module "deterministic-split";
